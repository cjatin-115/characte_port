function requireHttpsOrigin(origin) {
  const parsed = new URL(origin)
  if (parsed.protocol !== 'https:' || parsed.origin !== origin || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('Sitemap requires an explicit HTTPS origin')
  }
  return parsed.origin
}

export function createSitemapXml(origin, paths) {
  const base = requireHttpsOrigin(origin)
  const uniquePaths = [...new Set(paths)]
  const urls = uniquePaths.map((path) => {
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) throw new Error(`Invalid public route path: ${path}`)
    const loc = new URL(path, base).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
    return `  <url><loc>${loc}</loc></url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function createRobotsTxt(sitemapUrl) {
  const lines = ['User-agent: *', 'Allow: /']
  if (sitemapUrl) {
    const parsed = new URL(sitemapUrl)
    if (parsed.protocol !== 'https:' || parsed.pathname !== '/sitemap.xml' || parsed.search || parsed.hash) throw new Error('Sitemap URL must be an HTTPS sitemap URL')
    lines.push(`Sitemap: ${parsed.href}`)
  }
  return `${lines.join('\n')}\n`
}
