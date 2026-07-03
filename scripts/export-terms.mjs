/**
 * Exports a trimmed glossary-terms snapshot for the sibling apps
 * (trading-lab, ict-replay) to power inline term popups.
 *
 * Usage: node scripts/export-terms.mjs
 * Compiles src/terms.ts with the local TypeScript, then writes
 * src/data/glossaryTerms.ts into each sibling repo. Re-run whenever
 * terms.ts changes (same keep-in-sync convention as brand.css).
 */
import { createRequire } from 'module'
import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const tmp = path.join(root, '.terms-export-tmp')

rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })
// The repo is "type": "module" — mark the tmp dir CJS so require() works
writeFileSync(path.join(tmp, 'package.json'), '{"type":"commonjs"}')
execSync(
  `npx tsc src/terms.ts --ignoreConfig --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck`,
  { cwd: root, stdio: 'inherit' },
)

const { TERMS, CATEGORY_COLORS } = require(path.join(tmp, 'terms.js'))

const trimmed = TERMS.map(({ id, term, abbr, category, definition }) => ({
  id, term, ...(abbr ? { abbr } : {}), category, definition,
}))

const banner = `/**
 * AUTO-GENERATED from ict-glossary/src/terms.ts — do not hand-edit.
 * Regenerate with: node scripts/export-terms.mjs (in the ict-glossary repo).
 * Powers inline glossary popups; kept in sync manually like brand.css.
 */
`

const file = `${banner}
export interface GlossaryTerm {
  id: string
  term: string
  abbr?: string
  category: string
  definition: string
}

export const GLOSSARY_URL = 'https://chronic-trading.github.io/ict-glossary/'

export const GLOSSARY_CATEGORY_COLORS: Record<string, string> = ${JSON.stringify(CATEGORY_COLORS, null, 2)}

export const GLOSSARY_TERMS: GlossaryTerm[] = ${JSON.stringify(trimmed, null, 2)}
`

const targets = [
  path.join(root, '..', 'ict-replay', 'src', 'data', 'glossaryTerms.ts'),
  path.join(root, '..', 'trading-lab', 'src', 'data', 'glossaryTerms.ts'),
]

for (const t of targets) {
  if (!existsSync(path.dirname(t))) mkdirSync(path.dirname(t), { recursive: true })
  writeFileSync(t, file)
  console.log(`wrote ${trimmed.length} terms -> ${t}`)
}

rmSync(tmp, { recursive: true, force: true })
