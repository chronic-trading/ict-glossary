/**
 * Injects a schema.org DefinedTermSet describing the whole glossary into the
 * document head. Googlebot renders JS and reads this, so the 120+ terms and
 * their definitions become structured, machine-readable content — useful for
 * search understanding and rich results even though the app is a single-page
 * SPA with one canonical URL.
 */
import { TERMS, CATEGORIES } from './terms'

const SITE = 'https://chronic-trading.github.io/ict-glossary/'

export function injectGlossaryJsonLd() {
  if (typeof document === 'undefined') return
  if (document.getElementById('ld-glossary')) return

  const termSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': SITE,
    name: 'ICT / SMC Glossary',
    description:
      'The complete ICT (Inner Circle Trader) and Smart Money Concepts glossary: every term defined, diagrammed and cross-linked.',
    url: SITE,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: 'Chronic Trading' },
    hasDefinedTerm: TERMS.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      ...(t.abbr ? { alternateName: t.abbr } : {}),
      description: t.definition,
      termCode: t.abbr || undefined,
      inDefinedTermSet: SITE,
      url: `${SITE}?t=${t.id}`,
    })),
  }

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ICT concept categories',
    itemListElement: CATEGORIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c,
    })),
  }

  const el = document.createElement('script')
  el.id = 'ld-glossary'
  el.type = 'application/ld+json'
  el.textContent = JSON.stringify([termSet, breadcrumbs])
  document.head.appendChild(el)
}
