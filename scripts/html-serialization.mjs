const htmlTextEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtmlText(value) {
  return value.replace(/[&<>"']/g, (character) => htmlTextEntities[character])
}

export function renderPrerenderedHtml(template, { title, description, canonicalUrl, markup }) {
  if (!/<title>[\s\S]*?<\/title>/.test(template)) {
    throw new Error('HTML template must contain a title element')
  }
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('HTML template must contain an empty React root')
  }
  if (!/<meta name="description" content="[^"]*"\s*\/?\s*>/.test(template)) {
    throw new Error('HTML template must contain a description meta element')
  }
  if (!template.includes('<!-- ROUTE_METADATA -->')) throw new Error('HTML template must contain route metadata marker')
  if (canonicalUrl && new URL(canonicalUrl).protocol !== 'https:') {
    throw new Error('Canonical URL must use HTTPS')
  }

  const socialMetadata = [
    `<meta property="og:title" content="${escapeHtmlText(title)}" />`,
    `<meta property="og:description" content="${escapeHtmlText(description)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta name="twitter:card" content="summary" />',
    ...(canonicalUrl ? [
      `<link rel="canonical" href="${escapeHtmlText(canonicalUrl)}" />`,
      `<meta property="og:url" content="${escapeHtmlText(canonicalUrl)}" />`,
    ] : []),
  ].join('\n    ')

  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtmlText(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, () => `<meta name="description" content="${escapeHtmlText(description)}" />`)
    .replace('<!-- ROUTE_METADATA -->', () => socialMetadata)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
}
