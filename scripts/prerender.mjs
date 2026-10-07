import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'
import { renderPrerenderedHtml } from './html-serialization.mjs'
import { createRobotsTxt, createSitemapXml } from './static-seo.mjs'

const baseHtml = await readFile(resolve('dist/index.html'), 'utf8')
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

try {
  const { default: App } = await vite.ssrLoadModule('/src/app/App.tsx')
  const { getPrerenderPaths, getRouteMetadata } = await vite.ssrLoadModule('/src/content/routes.ts')
  const { canonicalOrigin } = await vite.ssrLoadModule('/src/content/site.ts')
  const routes = getPrerenderPaths()

  for (const pathname of routes) {
    const markup = renderToString(React.createElement(App, { pathname }))
    const html = renderPrerenderedHtml(baseHtml, { ...getRouteMetadata(pathname), markup })
    const target = pathname === '/' ? resolve('dist/index.html') : resolve(`dist${pathname}/index.html`)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, html)
  }

  const notFoundMarkup = renderToString(React.createElement(App, { pathname: '/404' }))
  const notFoundHtml = renderPrerenderedHtml(baseHtml, {
    ...getRouteMetadata('/404'),
    markup: notFoundMarkup,
  })
  await writeFile(resolve('dist/404.html'), notFoundHtml)

  const sitemapUrl = canonicalOrigin ? new URL('/sitemap.xml', canonicalOrigin).href : undefined
  await writeFile(resolve('dist/robots.txt'), createRobotsTxt(sitemapUrl))
  if (canonicalOrigin) await writeFile(resolve('dist/sitemap.xml'), createSitemapXml(canonicalOrigin, routes))
} finally {
  await vite.close()
}
