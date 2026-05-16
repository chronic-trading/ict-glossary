import { useState, useMemo, useRef } from 'react'
import {
  TERMS, CATEGORIES, CATEGORY_COLORS, searchTerms,
  ALL_LETTERS, type Term, type Category,
} from './terms'

// ── Term Card ─────────────────────────────────────────────────────────────────
function TermCard({ term, onRelatedClick, highlight }: {
  term: Term
  onRelatedClick: (name: string) => void
  highlight?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[term.category]

  function renderText(text: string) {
    if (!highlight || highlight.length < 2) return <>{text}</>
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === highlight.toLowerCase()
            ? <mark key={i} style={{ background: `${color}30`, color, borderRadius: '2px' }}>{p}</mark>
            : p
        )}
      </>
    )
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      style={{ background: 'rgba(7,7,14,0.98)', border: `1px solid rgba(255,255,255,0.06)` }}
      onClick={() => setExpanded(e => !e)}>

      {/* Top color line */}
      <div className="absolute top-0 inset-x-0 h-[2px] opacity-40 group-hover:opacity-90 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%,${color}0a,transparent 70%)` }} />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-[15px] font-black text-white leading-tight">{term.term}</h3>
              {term.abbr && (
                <span className="text-[10px] font-black tracking-[0.15em] px-2 py-0.5 rounded-md"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                  {term.abbr}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color, opacity: 0.8 }}>
              {term.category}
            </span>
          </div>
          <div className="flex-shrink-0 text-slate-700 text-[12px] mt-0.5 select-none">
            {expanded ? '▲' : '▼'}
          </div>
        </div>

        {/* Definition — truncated when collapsed */}
        <p className={`text-[12.5px] text-slate-400 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
          {highlight ? renderText(term.definition) : term.definition}
        </p>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-4 animate-fade-up">
            {term.example && (
              <div className="px-3 py-2.5 rounded-xl text-[12px] text-slate-400 leading-relaxed"
                style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                <span className="font-bold" style={{ color }}>Example: </span>
                {term.example}
              </div>
            )}

            {term.related.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600 mb-2">Related Concepts</p>
                <div className="flex flex-wrap gap-1.5">
                  {term.related.map(r => (
                    <button key={r}
                      onClick={e => { e.stopPropagation(); onRelatedClick(r) }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      {r} →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeLetter,   setActiveLetter]   = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const displayed = useMemo(() => {
    let list = query.trim().length >= 1 ? searchTerms(query.trim()) : TERMS
    if (activeCategory) list = list.filter(t => t.category === activeCategory)
    if (activeLetter)   list = list.filter(t => t.term.toUpperCase().startsWith(activeLetter))
    return list.sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory, activeLetter])

  // Letter jump
  const lettersWithTerms = useMemo(() =>
    new Set(TERMS.map(t => t.term[0].toUpperCase())), [])

  function handleRelatedClick(name: string) {
    setQuery(name)
    setActiveCategory(null)
    setActiveLetter(null)
    searchRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    setQuery('')
    setActiveCategory(null)
    setActiveLetter(null)
  }

  const hasFilter = query || activeCategory || activeLetter

  return (
    <div className="min-h-screen bg-[#05050a] text-white">

      {/* ── Nav ── */}
      <nav className="border-b border-slate-800/50 bg-[#05050a]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl px-5 h-14 flex items-center justify-between" style={{ margin: '0 auto' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px]"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>📖</div>
            <span className="text-[13px] font-black tracking-widest text-white">ICT GLOSSARY</span>
            <span className="hidden sm:block text-[10px] text-slate-700 font-bold tracking-[0.12em] uppercase ml-1">a Chronic Trading tool</span>
          </div>
          <span className="text-[11px] text-slate-600 font-semibold">{TERMS.length} terms</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-5 pt-16 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.07), transparent 70%)' }} />
        <div className="relative" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/6 mb-5 animate-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ boxShadow: '0 0 6px #f59e0b' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400/80">{TERMS.length} Concepts Defined</span>
          </div>
          <h1 className="font-black mb-3 text-center" style={{ fontSize: 'clamp(32px,6vw,58px)', letterSpacing: '-2px', lineHeight: 0.92 }}>
            The <span className="gold-title">ICT / SMC</span><br />
            <span className="text-white">Glossary.</span>
          </h1>
          <p className="text-slate-400 text-center mb-8" style={{ fontSize: 'clamp(13px,2vw,16px)', maxWidth: '440px', margin: '0 auto 32px' }}>
            Every concept, term, and model from ICT and Smart Money Concepts — defined clearly, linked to related ideas, and searchable instantly.
          </p>

          {/* Search */}
          <div className="relative" style={{ maxWidth: '520px', margin: '0 auto' }}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-[16px]">🔍</span>
            <input
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveLetter(null) }}
              placeholder="Search terms, abbreviations, or definitions…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[14px] text-white placeholder-slate-600 focus:outline-none transition-all"
              style={{ background: 'rgba(10,10,18,0.95)', border: `1px solid ${query ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`, boxShadow: query ? '0 0 24px rgba(245,158,11,0.1)' : 'none' }}
              autoComplete="off" spellCheck={false}
            />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors text-[18px]">×</button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category filters ── */}
      <section className="px-5 pb-4">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setActiveCategory(null)}
              className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{ background: !activeCategory ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${!activeCategory ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)'}`, color: !activeCategory ? '#f59e0b' : '#64748b' }}>
              All ({TERMS.length})
            </button>
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLORS[cat]
              const count = TERMS.filter(t => t.category === cat).length
              const active = activeCategory === cat
              return (
                <button key={cat} onClick={() => setActiveCategory(active ? null : cat)}
                  className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                  style={{ background: active ? `${color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.07)'}`, color: active ? color : '#64748b' }}>
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── A–Z navigation ── */}
      {!query && (
        <section className="px-5 pb-5">
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="flex flex-wrap gap-1 justify-center">
              {ALL_LETTERS.map(letter => {
                const has = lettersWithTerms.has(letter)
                const active = activeLetter === letter
                return (
                  <button key={letter} disabled={!has}
                    onClick={() => setActiveLetter(active ? null : letter)}
                    className="w-8 h-8 rounded-lg text-[11px] font-black transition-all"
                    style={{
                      background: active ? 'rgba(245,158,11,0.15)' : has ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: active ? '1px solid rgba(245,158,11,0.4)' : has ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
                      color: active ? '#f59e0b' : has ? '#94a3b8' : '#1e293b',
                      cursor: has ? 'pointer' : 'default',
                    }}>
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Results header ── */}
      <section className="px-5 pb-3">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-slate-500 font-semibold">
              {displayed.length} term{displayed.length !== 1 ? 's' : ''}
              {query && <> matching "<span className="text-amber-400">{query}</span>"</>}
              {activeCategory && <> in <span style={{ color: CATEGORY_COLORS[activeCategory] }}>{activeCategory}</span></>}
              {activeLetter && <> starting with <span className="text-amber-400">{activeLetter}</span></>}
            </p>
            {hasFilter && (
              <button onClick={clearFilters}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors font-semibold">
                Clear filters ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Term grid ── */}
      <section className="px-5 pb-20">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[32px] mb-3">🔍</p>
              <p className="text-[15px] font-bold text-slate-500">No terms found</p>
              <p className="text-[12px] text-slate-700 mt-1">Try a different search or clear filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayed.map(term => (
                <TermCard key={term.id} term={term} highlight={query} onRelatedClick={handleRelatedClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-t border-slate-800/30 px-5 py-12">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: `${TERMS.length}+`,                label: 'Terms Defined',    color: '#f59e0b' },
              { val: `${CATEGORIES.length}`,            label: 'Categories',       color: '#34d399' },
              { val: `${TERMS.filter(t=>t.abbr).length}`,     label: 'With Abbreviation',color: '#60a5fa' },
              { val: `${TERMS.filter(t=>t.example).length}`,  label: 'With Examples',    color: '#c084fc' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(7,7,14,0.98)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-black text-[26px] mb-1" style={{ color: s.color, fontFamily: "'JetBrains Mono',monospace", textShadow: `0 0 20px ${s.color}40` }}>{s.val}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/30 px-5 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black tracking-widest text-slate-700 uppercase">ICT Glossary</span>
            <span className="text-[10px] text-slate-800 mx-1">·</span>
            <span className="text-[10px] text-slate-800 tracking-[0.12em] uppercase">a Chronic Trading tool</span>
          </div>
          <p className="text-[11px] text-slate-800">Definitions are educational. Not financial advice.</p>
        </div>
      </footer>
    </div>
  )
}
