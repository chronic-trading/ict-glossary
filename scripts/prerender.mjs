/**
 * Prerender one static page per glossary term.
 *
 * THE PROBLEM. The glossary is 121 terms rendered as cards on a single URL, and
 * the sitemap listed exactly that one URL. So the site could rank for "ICT
 * glossary" — which people search once they already know the thing exists — and
 * could not rank for "what is a fair value gap", which is how a stranger who has
 * never heard of Chronic Trading would actually arrive. 121 potential landing
 * pages were collapsed into one.
 *
 * THE FIX. After `vite build`, write dist/t/<id>/index.html for every term: the
 * same app bundle, but with that term's title, description, canonical and
 * DefinedTerm structured data, and — the part that matters — the definition and
 * example as real HTML inside #root.
 *
 * That last point is the whole exercise. Googlebot does render JavaScript, but
 * rendering is queued separately and can lag indexing by days or weeks. Content
 * that is already in the HTML is indexed on the first pass. React discards this
 * markup the moment it mounts, so a human never sees it and there is no second
 * copy to keep in sync — it is generated from the same TERMS array the app uses.
 *
 * GitHub Pages serves /t/<id>/ from /t/<id>/index.html natively, so this needs
 * no routing config, no 404 redirect hack, and no server.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { TERMS } from '../src/terms.ts'

const SITE = 'https://chronic-trading.github.io/ict-glossary'
const DIST = 'dist'

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Search engines truncate around 155 characters; cut on a word, not mid-word. */
const clip = (s, n = 155) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  return t.slice(0, t.lastIndexOf(' ', n)).replace(/[,;:]$/, '') + '…'
}

const shell = readFileSync(join(DIST, 'index.html'), 'utf8')

let written = 0
for (const t of TERMS) {
  const name = t.abbr ? `${t.term} (${t.abbr})` : t.term
  const title = `${name} — ICT Glossary | Chronic Trading`
  const desc = clip(t.definition)
  const url = `${SITE}/t/${t.id}/`

  // schema.org DefinedTerm, pointing back at the set the whole glossary declares.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': url,
    name,
    description: t.definition,
    inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': `${SITE}/`, name: 'ICT / SMC Glossary' },
    termCode: t.id,
    ...(t.category ? { additionalType: t.category } : {}),
  }

  // Crawlable content. Replaced by React on mount — this exists for the first
  // indexing pass, before the JS render queue gets to the page.
  const seed =
    `<article>` +
    `<nav><a href="${SITE}/">ICT Glossary</a> › ${esc(t.category)}</nav>` +
    `<h1>${esc(name)}</h1>` +
    `<p>${esc(t.definition)}</p>` +
    (t.example ? `<h2>Example</h2><p>${esc(t.example)}</p>` : '') +
    (t.related?.length
      ? `<h2>Related terms</h2><ul>${t.related.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`
      : '') +
    `<p><a href="${SITE}/">See all ${TERMS.length} ICT and SMC terms</a></p>` +
    `</article>`

  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/,
             `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/,
             `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[\s\S]*?"\s*\/?>/,
             `<meta property="og:title" content="${esc(name)} — ICT Glossary" />`)
    .replace(/<meta property="og:description" content="[\s\S]*?"\s*\/?>/,
             `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/,
             `<meta property="og:url" content="${url}" />`)
    .replace('<div id="root"></div>',
             `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n    <div id="root">${seed}</div>`)

  const dir = join(DIST, 't', t.id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  written++
}

// Sitemap: the hub plus every term.
const today = new Date().toISOString().slice(0, 10)
const urls = [
  `  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ...TERMS.map(t =>
  `  <url><loc>${SITE}/t/${t.id}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
]
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

console.log(`prerendered ${written} term pages · sitemap now lists ${urls.length} URLs`)
