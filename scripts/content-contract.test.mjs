import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { test } from 'node:test'
import { createServer } from 'vite'
import { renderPrerenderedHtml } from './html-serialization.mjs'
import { transitionLoadingState } from './loading-state-machine.mjs'
import { createRobotsTxt, createSitemapXml } from './static-seo.mjs'

const projectSource = JSON.parse(await readFile(new URL('../content/projects.json', import.meta.url), 'utf8'))
const sourceProjects = projectSource.data

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
let contentModule
let routeModule
try {
  contentModule = await vite.ssrLoadModule('/src/content/projects.ts')
  routeModule = await vite.ssrLoadModule('/src/content/routes.ts')
} finally {
  await vite.close()
}
const { parseProjects, projectsDocument, projectCatalog, projects } = contentModule
const { primaryRoutes, navigationRoutes, getPrerenderPaths, getRouteMetadata, projectDetailPath, resolveRoute } = routeModule
let portfolioModule
let domainModules = {}
let documentModule
let appModule
const contentVite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  portfolioModule = await contentVite.ssrLoadModule('/src/content/portfolio.ts')
  documentModule = await contentVite.ssrLoadModule('/src/content/content-document.ts')
  appModule = await contentVite.ssrLoadModule('/src/app/App.tsx')
  for (const domain of ['about', 'education', 'experience', 'achievements', 'links', 'field-notes']) {
    domainModules[domain] = await contentVite.ssrLoadModule(`/src/content/${domain}.ts`)
  }
} finally {
  await contentVite.close()
}

test('project content has unique URL-safe slugs, titles, and verified repository URLs', () => {
  assert.ok(Array.isArray(sourceProjects))
  assert.equal(projectsDocument.version, 2)
  assert.equal(projectCatalog.length, sourceProjects.length)
  assert.equal(projects.length, 2)
  const slugs = projectCatalog.map((project) => project.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const project of projectCatalog) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.equal(typeof project.title, 'string')
    assert.ok(project.title.trim().length > 0)
    if (project.repository) {
      const repository = new URL(project.repository)
      assert.equal(repository.protocol, 'https:')
      assert.equal(repository.hostname, 'github.com')
    }
  }
})

test('the build emits direct-loadable HTML and route-specific metadata for every primary route', async () => {
  for (const route of primaryRoutes) {
    const file = route.path === '/' ? '../dist/index.html' : `../dist${route.path}/index.html`
    const html = await readFile(new URL(file, import.meta.url), 'utf8')
    assert.match(html, /<main\b/)
    assert.ok(html.includes(`<title>${route.title}</title>`))
    assert.ok(html.includes(`content="${route.description}"`))
    assert.ok(html.includes(`<meta property="og:title" content="${route.title}" />`))
    assert.ok(html.includes(`<meta property="og:description" content="${route.description}" />`))
    assert.match(html, /<meta property="og:type" content="website" \/>/)
    assert.match(html, /<meta name="twitter:card" content="summary" \/>/)
    assert.doesNotMatch(html, /rel="canonical"|property="og:url"/)
  }
})

test('the build emits one titled detail page per project and links back to Work', async () => {
  for (const project of projects) {
    const html = await readFile(new URL(`../dist/work/${project.slug}/index.html`, import.meta.url), 'utf8')
    assert.ok(html.includes(`<title>${project.title} — Jatin Choudhary</title>`))
    assert.ok(html.includes('← ALL WORK'))
    assert.ok(html.includes(project.title))
    assert.ok(html.includes(`<meta property="og:title" content="${project.title} — Jatin Choudhary" />`))
    assert.match(html, /<meta name="description" content="[^"]+" \/>/)
  }
})

test('the static home page contains every project in its index', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  for (const project of projects) assert.ok(html.includes(project.title))
})

test('project titles remain text when serialized into prerendered HTML', () => {
  const hostileTitles = [
    '<script>alert(1)</script>',
    '"><script>alert(1)</script>',
    "' onload='alert(1)",
    'A & B < C > D',
  ]

  for (const title of hostileTitles) {
    const [project] = parseProjects([{ slug: 'hostile-title', title, status: 'draft' }])
    const markup = renderToString(React.createElement('h1', null, project.title))
    const html = renderPrerenderedHtml(
      '<!doctype html><html><head><meta name="description" content="Base description" /><title>Base</title><!-- ROUTE_METADATA --></head><body><div id="root"></div></body></html>',
      { title: project.title, description: 'Test description', markup },
    )
    const escapedTitle = title
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')

    assert.match(html, new RegExp(`<title>${escapedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`))
    const heading = markup.match(/^<h1>([\s\S]*)<\/h1>$/)?.[1]
    assert.ok(heading)
    assert.equal(heading
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&#x27;', "'")
      .replaceAll('&#39;', "'")
      .replaceAll('&amp;', '&'), title)
    assert.equal((html.match(/<title>/g) ?? []).length, 1)
    assert.equal((html.match(/<\/title>/g) ?? []).length, 1)
    assert.ok(!html.includes('<script>alert(1)</script>'))
  }
})

test('hostile route metadata is escaped in HTML text and attributes', () => {
  const hostile = `A & B < C > D "quote" 'single' $&`
  const html = renderPrerenderedHtml(
    '<!doctype html><html><head><meta name="description" content="Base" /><title>Base</title><!-- ROUTE_METADATA --></head><body><div id="root"></div></body></html>',
    { title: hostile, description: hostile, canonicalUrl: 'https://portfolio.example/work/safe', markup: '<main>Static</main>' },
  )
  const escaped = hostile.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
  assert.ok(html.includes(`<title>${escaped}</title>`))
  assert.ok(html.includes(`<meta name="description" content="${escaped}" />`))
  assert.ok(html.includes(`<meta property="og:title" content="${escaped}" />`))
  assert.ok(html.includes('<link rel="canonical" href="https://portfolio.example/work/safe" />'))
  assert.ok(html.includes('<meta property="og:url" content="https://portfolio.example/work/safe" />'))
  assert.ok(!html.includes('<script>'))
  assert.throws(() => renderPrerenderedHtml(
    '<meta name="description" content="Base" /><title>Base</title><!-- ROUTE_METADATA --><div id="root"></div>',
    { title: 'Safe', description: 'Safe', canonicalUrl: 'javascript:alert(1)', markup: '' },
  ), /Canonical URL must use HTTPS/)
})

test('project title validation accepts punctuation while rejecting missing or blank values', () => {
  assert.equal(parseProjects([{ slug: 'normal-title', title: 'Miraaj: A & B — “Orbit”', status: 'draft' }])[0].title, 'Miraaj: A & B — “Orbit”')
  assert.throws(() => parseProjects([{ slug: 'missing-title', status: 'draft' }]), /needs a title/)
  assert.throws(() => parseProjects([{ slug: 'blank-title', title: '  ', status: 'draft' }]), /needs a title/)
})

test('project content validation preserves optional fields and rejects malformed required values', () => {
  assert.deepEqual(parseProjects([{ slug: 'minimal', title: 'Minimal', status: 'not-ready' }]), [{ slug: 'minimal', title: 'Minimal', status: 'not-ready' }])
  assert.deepEqual(parseProjects([{ slug: 'future', title: 'Future', status: 'draft', summary: 'A summary' }]), [{ slug: 'future', title: 'Future', status: 'draft', summary: 'A summary' }])
  assert.throws(() => parseProjects([{ slug: 'bad-status', title: 'Bad status', status: 'public' }]), /status must be not-ready, draft, or published/)
  assert.throws(() => parseProjects([{ slug: '', title: 'Empty slug', status: 'draft' }]), /valid slug/)
  assert.throws(() => parseProjects([{ slug: 'empty-title', title: ' ', status: 'draft' }]), /needs a title/)
  assert.throws(() => parseProjects([{ slug: 'bad-repository', title: 'Bad', status: 'draft', repository: 'javascript:alert(1)' }]), /invalid repository link/)
  assert.throws(() => parseProjects([{ slug: 'bad-tech', title: 'Bad', status: 'draft', technologies: [''] }]), /technology must be non-empty/)
})

test('all content domains have explicit versioned documents and reject malformed data', () => {
  const documents = [
    projectsDocument,
    domainModules.about.aboutDocument,
    domainModules.education.educationDocument,
    domainModules.experience.experienceDocument,
    domainModules.achievements.achievementsDocument,
    domainModules.links.linksDocument,
    domainModules['field-notes'].fieldNotesDocument,
  ]
  assert.ok(documents.every((document) => document.version >= 1))
  assert.equal(projectsDocument.version, 2)
  assert.deepEqual(domainModules.experience.experience, [])
  assert.throws(() => documentModule.parseContentDocument({ version: 0, data: [] }, (data) => data), /positive integer version/)
  assert.throws(() => documentModule.parseContentDocument({ version: 1 }, (data) => data), /needs data/)
  assert.throws(() => portfolioModule.parseEducation([{ qualification: 'Degree' }]), /institution must be non-empty/)
  assert.throws(() => portfolioModule.parseExperience([{ role: 'Engineer' }]), /organization must be non-empty/)
  assert.throws(() => portfolioModule.parseAchievements([{ title: ' ' }]), /title must be non-empty/)
  assert.throws(() => portfolioModule.parseLinks([{ label: 'Unsafe', href: 'javascript:alert(1)' }]), /HTTPS or mailto/)
  assert.throws(() => portfolioModule.parseFieldNotes({ entries: [{ title: 'No slug' }], emptyState: 'Empty' }), /slug must be non-empty/)
})

test('primary route registry and generated project routes remain unique and complete', () => {
  const paths = primaryRoutes.map((route) => route.path)
  const keys = primaryRoutes.map((route) => route.key)
  assert.equal(new Set(paths).size, paths.length)
  assert.equal(new Set(keys).size, keys.length)
  for (const route of primaryRoutes) {
    assert.ok(route.path === '/' || /^\/[a-z0-9-]+$/.test(route.path))
    assert.ok(route.title.trim())
    assert.ok(route.description.trim())
    assert.ok(route.navLabel.trim())
  }
  const detailPaths = projects.map(({ slug }) => projectDetailPath(slug))
  assert.equal(new Set(detailPaths).size, detailPaths.length)
  assert.ok(detailPaths.every((path) => resolveRoute(path).kind === 'project'))
  assert.deepEqual(getPrerenderPaths(), [...paths, ...detailPaths])
  assert.equal(getRouteMetadata('/work/miraaj').title, 'Miraaj — Jatin Choudhary')
  assert.deepEqual(resolveRoute('/work/vetra'), { kind: 'not-found' })
  assert.deepEqual(resolveRoute('/work/unknown'), { kind: 'not-found' })
})

test('configured sitemap includes exactly the registered public routes and robots allows crawling', async () => {
  const paths = getPrerenderPaths()
  const sitemap = createSitemapXml('https://portfolio.example', paths)
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 8)
  for (const path of paths) assert.ok(sitemap.includes(`<loc>https://portfolio.example${path === '/' ? '/' : path}</loc>`))
  assert.doesNotMatch(sitemap, /oracle|snake|api|admin/i)
  assert.throws(() => createSitemapXml('http://portfolio.example', paths), /explicit HTTPS origin/)
  assert.throws(() => createSitemapXml('https://portfolio.example/path', paths), /explicit HTTPS origin/)
  assert.match(createRobotsTxt('https://portfolio.example/sitemap.xml'), /Sitemap: https:\/\/portfolio\.example\/sitemap\.xml/)
  assert.throws(() => createRobotsTxt('http://portfolio.example/sitemap.xml'), /HTTPS sitemap URL/)

  const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8')
  assert.match(robots, /^User-agent: \*\nAllow: \/\n$/)
  assert.ok(!robots.includes('Disallow: /'))
  assert.ok(!robots.includes('portfolio.example'))
  await assert.rejects(readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8'), { code: 'ENOENT' })
})

test('deployment output provides a static accessible 404 and no provider-specific configuration', async () => {
  const html = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8')
  assert.match(html, /<title>Page not found — Jatin Choudhary<\/title>/)
  assert.match(html, /<a href="#main-content" class="skip-link">Skip to content<\/a>/)
  assert.match(html, /<main id="main-content"/)
  assert.match(html, /RETURN HOME/)
  assert.match(html, /<footer class="site-footer">/)
  assert.doesNotMatch(html, /rel="canonical"|<script\b/i)
})

test('content and primary route/navigation regressions match the pre-migration baseline', () => {
  assert.deepEqual(projectCatalog.map(({ title }) => title), [
    'Miraaj', 'Vetra', 'Seika', 'Ikigai', 'Forecast-Buster', 'Luma / LedgerOS',
  ])
  assert.deepEqual(projectCatalog.map(({ slug }) => slug), [
    'miraaj', 'vetra', 'seika', 'ikigai', 'forecast-buster', 'luma',
  ])
  assert.deepEqual(projectCatalog.map(({ repository }) => repository), [
    undefined, 'https://github.com/cjatin-115/Vetra', 'https://github.com/cjatin-115/seika', undefined, undefined, 'https://github.com/cjatin-115/ledger_os',
  ])
  assert.deepEqual(primaryRoutes.map(({ path }) => path), ['/', '/work', '/lab', '/field-notes', '/about', '/contact'])
  assert.deepEqual(navigationRoutes.map(({ navLabel, path }) => [navLabel, path]), [
    ['Home', '/'], ['Work', '/work'], ['Lab', '/lab'], ['Field Notes', '/field-notes'], ['About', '/about'], ['Contact', '/contact'],
  ])
  assert.equal(sourceProjects.length, 6)
  assert.ok(!sourceProjects.some(({ slug }) => slug === 'human-activity-recognition'))
  assert.deepEqual(projects.map(({ slug }) => slug), ['miraaj', 'forecast-buster'])
})

test('positioning and migrated Field Notes copy render with their current wording', async () => {
  const aboutHtml = (await readFile(new URL('../dist/about/index.html', import.meta.url), 'utf8')).replaceAll('<!-- -->', '')
  const fieldNotesHtml = await readFile(new URL('../dist/field-notes/index.html', import.meta.url), 'utf8')
  const homeHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8').then((html) => html.replaceAll('<!-- -->', ''))
  assert.ok(homeHtml.includes('JATIN CHOUDHARY <span>— COMPUTER ENGINEERING STUDENT</span>'))
  assert.ok(homeHtml.includes('I build software prototypes across AI-assisted creative workflows and machine-learning applications.'))
  assert.ok(homeHtml.includes('AI-assisted creative workflows and machine-learning applications, explored through prototypes.'))
  assert.ok(homeHtml.includes('<title>Jatin Choudhary — Computer Engineering Student</title>'))
  assert.ok(aboutHtml.includes('I’m a computer engineering student building software prototypes while exploring AI/ML and software engineering.'))
  assert.ok(aboutHtml.includes('B. Engineering — Computer Science at Bharati Vidyapeeth College of Engineering, Navi Mumbai. Expected graduation: 2028. CGPA: 8.7.'))
  assert.ok(aboutHtml.includes('Miraaj explores AI-assisted video planning and editing; Forecast-Buster explores machine-learning approaches to forecast risk.'))
  assert.ok(aboutHtml.includes('I’m also interested in exploring developer tooling, computer vision, and intelligent applications through practical projects.'))
  assert.ok(fieldNotesHtml.includes('Engineering notes from work in progress.'))
})

test('rendered routes have one semantic main landmark targeted by the visible skip link', () => {
  for (const path of ['/', '/about', '/work', '/lab', '/field-notes', '/contact', '/work/miraaj', '/work/forecast-buster', '/work/vetra']) {
    const html = renderToStaticMarkup(React.createElement(appModule.default, { pathname: path }))
    assert.equal((html.match(/<main\b/g) ?? []).length, 1)
    assert.equal((html.match(/id="main-content"/g) ?? []).length, 1)
    assert.ok(html.includes('<a href="#main-content" class="skip-link">Skip to content</a>'))
    assert.match(html, /<main id="main-content"(?: class="[^"]+")?>/)
  }
})

test('navigation current state and keyboard-reachable links use native anchors', () => {
  const aboutHtml = renderToStaticMarkup(React.createElement(appModule.default, { pathname: '/about' }))
  const projectHtml = renderToStaticMarkup(React.createElement(appModule.default, { pathname: '/work/miraaj' }))
  const nav = aboutHtml.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1]
  assert.ok(nav)
  assert.equal((nav.match(/aria-current="page"/g) ?? []).length, 1)
  assert.match(nav, /href="\/about" aria-current="page">About<\/a>/)
  assert.ok(!nav.includes('aria-current="page" href="/work"'))
  const projectNav = projectHtml.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1]
  assert.match(projectNav, /href="\/work" aria-current="page">Work<\/a>/)
  assert.match(projectHtml, /href="\/work\/"[^>]*>← ALL WORK/)
  assert.match(projectHtml, /href="\/work\/forecast-buster\/" aria-label="Next project: Forecast-Buster"/)
  const forecastHtml = renderToStaticMarkup(React.createElement(appModule.default, { pathname: '/work/forecast-buster' }))
  assert.match(forecastHtml, /href="\/work\/miraaj\/" aria-label="Previous project: Miraaj"/)
  assert.doesNotMatch(projectHtml + forecastHtml, /href="\/work\/(?:vetra|seika|ikigai|luma)\//)
  assert.match(aboutHtml, /<footer class="site-footer">[\s\S]*?<a href="https:\/\/github\.com\/cjatin-115" target="_blank"/)
  assert.ok(!aboutHtml.includes('<button'))
})

test('skip-link and interactive-link focus styles remain keyboard-visible', async () => {
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8')
  assert.match(css, /a:focus-visible\s*\{[^}]*outline:/)
  assert.match(css, /\.skip-link:focus\s*\{[^}]*transform:\s*translateY\(0\)/)
})

test('mobile navigation stays horizontally scrollable without page-level overflow rules', async () => {
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8')
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*?\.site-header nav\s*\{[^}]*overflow-x:\s*auto/)
  assert.match(css, /\.site-header nav a\s*\{[^}]*white-space:\s*nowrap/)
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*?\.orbit-caption\s*\{[^}]*display:\s*none/)
  assert.match(css, /body\s*\{[^}]*min-width:\s*320px/)
  assert.doesNotMatch(css, /body\s*\{[^}]*overflow-x:\s*hidden/)
})

test('all prerendered pages deliver content and navigation without a client script', async () => {
  const paths = getPrerenderPaths()
  assert.equal(paths.length, 8)
  for (const path of paths) {
    const relativeFile = path === '/' ? '../dist/index.html' : `../dist${path}/index.html`
    const html = await readFile(new URL(relativeFile, import.meta.url), 'utf8')
    assert.match(html, /<main id="main-content"/)
    assert.match(html, /<nav aria-label="Primary navigation">/)
    assert.match(html, /<link[^>]+\.css/)
    assert.doesNotMatch(html, /<script\b/i)
  }
  const assets = await readdir(new URL('../dist/assets/', import.meta.url))
  assert.ok(assets.some((asset) => asset.endsWith('.css')))
  assert.equal(assets.filter((asset) => asset.endsWith('.js')).length, 0)
})

test('loading lifecycle contract covers normal, failure, and reduced-motion paths', () => {
  const run = (state, events) => events.reduce(transitionLoadingState, state)

  assert.equal(run('BOOT', ['START', 'READY', 'ENTER', 'ENTER_COMPLETE']), 'SITE')
  assert.equal(run('BOOT', ['START', 'FAIL', 'USE_FALLBACK', 'CONTINUE_STATIC']), 'SITE')
  assert.equal(run('BOOT', ['START', 'READY', 'REDUCED_MOTION']), 'SITE')
  assert.throws(() => transitionLoadingState('BOOT', 'ENTER'), /Invalid loading transition/)
  assert.throws(() => transitionLoadingState('SITE', 'START'), /Invalid loading transition/)
})

test('static page output remains the fallback and loading model adds no browser script or timer', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const coordinator = await readFile(new URL('./loading-state-machine.mjs', import.meta.url), 'utf8')

  assert.match(html, /<main id="main-content"/)
  assert.match(html, /<nav aria-label="Primary navigation">/)
  assert.match(html, /<footer class="site-footer">/)
  assert.doesNotMatch(html, /<script\b/i)
  assert.doesNotMatch(coordinator, /setTimeout|setInterval|document\.|window\./)
})

test('static output preserves education, contact links, and project source links', async () => {
  const aboutHtml = await readFile(new URL('../dist/about/index.html', import.meta.url), 'utf8')
  const contactHtml = await readFile(new URL('../dist/contact/index.html', import.meta.url), 'utf8')
  const workHtml = await readFile(new URL('../dist/work/index.html', import.meta.url), 'utf8')
  assert.ok(aboutHtml.includes('B. Engineering — Computer Science'))
  assert.ok(aboutHtml.includes('Bharati Vidyapeeth College of Engineering'))
  assert.ok(contactHtml.includes('mailto:cjatin015@gmail.com'))
  assert.ok(workHtml.includes('Forecast-Buster'))
  assert.ok(!workHtml.includes('Seika'))
})

test('project index and detail pages present only facts provided by structured content', async () => {
  const indexHtml = (await readFile(new URL('../dist/work/index.html', import.meta.url), 'utf8')).replaceAll('<!-- -->', '')
  assert.doesNotMatch(indexHtml, /ARCHIVE ENTRY/)
  for (const futureTitle of ['Vetra', 'Seika', 'Ikigai', 'Luma / LedgerOS', 'Human Activity Recognition System']) {
    assert.ok(!indexHtml.includes(futureTitle))
  }
  for (const [index, project] of projects.entries()) {
    const html = (await readFile(new URL(`../dist/work/${project.slug}/index.html`, import.meta.url), 'utf8')).replaceAll('<!-- -->', '')
    assert.match(html, new RegExp(`<h1>${project.title.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}</h1>`))
    assert.ok(html.includes(`PROJECT ${String(index + 1).padStart(2, '0')} / 02`))
    assert.doesNotMatch(html, /Project details will be added after the source material is verified\./)
    assert.doesNotMatch(html, /<dt>Role<\/dt>/)
    assert.match(html, /<dt>Technologies<\/dt>/)
    for (const [field, heading] of [
      ['problem', 'Problem'], ['approach', 'Approach'], ['implementation', 'Implementation'],
      ['solution', 'Solution'], ['outcome', 'Outcome'], ['limitations', 'Limitations'],
    ]) {
      if (project[field]) assert.ok(html.includes(`<h2>${heading}</h2>`))
      else assert.ok(!html.includes(`<h2>${heading}</h2>`))
    }
    assert.doesNotMatch(html, /not-ready|draft/)
    assert.ok(indexHtml.includes(`href="/work/${project.slug}/"`))
    if (project.repository) {
      assert.ok(html.includes(project.repository))
      assert.match(html, /VIEW REPOSITORY/)
    } else {
      assert.doesNotMatch(html, /VIEW REPOSITORY/)
    }
  }
  for (const slug of ['vetra', 'seika', 'ikigai', 'luma', 'human-activity-recognition']) {
    await assert.rejects(readFile(new URL(`../dist/work/${slug}/index.html`, import.meta.url), 'utf8'), { code: 'ENOENT' })
  }
})
