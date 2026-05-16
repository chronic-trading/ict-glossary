import { useState, useMemo, useRef } from 'react'
import {
  TERMS, CATEGORIES, CATEGORY_COLORS, searchTerms,
  ALL_LETTERS, type Term, type Category,
} from './terms'
import { DIAGRAMS } from './diagrams'

// ── Term Card ─────────────────────────────────────────────────────────────────
function TermCard({ term, onRelatedClick, highlight }: {
  term: Term
  onRelatedClick: (name: string) => void
  highlight?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[term.category]
  const DiagramComp = DIAGRAMS[term.diagramId]

  function hl(text: string) {
    if (!highlight || highlight.length < 2) return <>{text}</>
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === highlight.toLowerCase()
            ? <mark key={i} style={{ background: `${color}30`, color, borderRadius: '2px', padding: '0 1px' }}>{p}</mark>
            : p
        )}
      </>
    )
  }

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: 'rgba(6,6,12,0.98)',
        border: `1px solid ${color}22`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${color}18, 0 0 0 1px ${color}35`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Top gradient bar */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg,transparent 0%,${color} 40%,${color} 60%,transparent 100%)` }} />

      {/* Category tinted diagram section */}
      <div style={{ background: `linear-gradient(180deg,${color}08 0%,transparent 100%)`, borderBottom: `1px solid ${color}15` }}>
        {DiagramComp && <DiagramComp />}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-[14px] font-black text-white leading-tight">{term.term}</h3>
              {term.abbr && (
                <span className="text-[9px] font-black tracking-[0.18em] px-2 py-0.5 rounded-md shrink-0"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>
                  {term.abbr}
                </span>
              )}
            </div>
            <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color, opacity: 0.75 }}>
              {term.category}
            </span>
          </div>
          <div className="text-[11px] shrink-0 mt-0.5 transition-transform duration-200" style={{ color: `${color}60`, transform: expanded ? 'rotate(180deg)' : 'none' }}>▼</div>
        </div>

        <p className={`text-[12px] text-slate-400 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
          {highlight ? hl(term.definition) : term.definition}
        </p>

        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-up">
            {term.example && (
              <div className="px-3 py-2.5 rounded-xl text-[11.5px] text-slate-400 leading-relaxed"
                style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                <span className="font-black text-[10px] tracking-widest uppercase" style={{ color }}>Example </span>
                {term.example}
              </div>
            )}
            {term.related.length > 0 && (
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: `${color}80` }}>Related</p>
                <div className="flex flex-wrap gap-1.5">
                  {term.related.map(r => (
                    <button key={r}
                      onClick={e => { e.stopPropagation(); onRelatedClick(r) }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80 active:scale-95"
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

  const lettersWithTerms = useMemo(() => new Set(TERMS.map(t => t.term[0].toUpperCase())), [])

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
    <div className="min-h-screen text-white" style={{ background: '#04040a' }}>

      {/* ── Nav ── */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)' }}>📖</div>
            <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.18em', color: 'white' }}>ICT GLOSSARY</span>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginLeft: '2px', display: 'none' }} className="sm-show">a Chronic Trading tool</span>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{TERMS.length} terms</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '64px 20px 48px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Ambient background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(245,158,11,0.09) 0%, transparent 65%)' }} />
        {/* Subtle grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} aria-hidden>
          <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>

        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div className="animate-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.07)', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.85)' }}>{TERMS.length} Concepts — Each with a Visual</span>
          </div>

          <h1 style={{ fontWeight: 900, fontSize: 'clamp(34px,7vw,62px)', letterSpacing: '-2.5px', lineHeight: 0.9, marginBottom: '16px' }}>
            The <span className="gold-title">ICT / SMC</span><br />
            <span style={{ color: 'white' }}>Glossary.</span>
          </h1>
          <p style={{ color: 'rgba(148,163,184,1)', fontSize: 'clamp(13px,2vw,15px)', maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.65 }}>
            Every concept defined, visualised, and linked. The complete reference for ICT and Smart Money trading.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100,116,139,1)', fontSize: '16px', pointerEvents: 'none' }}>🔍</span>
            <input
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveLetter(null) }}
              placeholder="Search terms, abbreviations, definitions…"
              style={{
                width: '100%', paddingLeft: '44px', paddingRight: '40px', paddingTop: '14px', paddingBottom: '14px',
                borderRadius: '16px', fontSize: '14px', color: 'white', background: 'rgba(8,8,16,0.95)',
                border: `1px solid ${query ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.09)'}`,
                boxShadow: query ? '0 0 28px rgba(245,158,11,0.12)' : 'none',
                outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
              }}
              autoComplete="off" spellCheck={false}
            />
            {query && (
              <button onClick={() => setQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100,116,139,1)', fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category filters ── */}
      <section style={{ padding: '0 20px 16px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => setActiveCategory(null)}
              style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', cursor: 'pointer', border: `1px solid ${!activeCategory ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.07)'}`, background: !activeCategory ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.04)', color: !activeCategory ? '#f59e0b' : 'rgba(100,116,139,1)', transition: 'all 0.15s' }}>
              All ({TERMS.length})
            </button>
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLORS[cat]
              const count = TERMS.filter(t => t.category === cat).length
              const active = activeCategory === cat
              return (
                <button key={cat} onClick={() => setActiveCategory(active ? null : cat)}
                  style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', cursor: 'pointer', border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.07)'}`, background: active ? `${color}18` : 'rgba(255,255,255,0.04)', color: active ? color : 'rgba(100,116,139,1)', transition: 'all 0.15s', boxShadow: active ? `0 0 14px ${color}20` : 'none' }}>
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── A–Z ── */}
      {!query && (
        <section style={{ padding: '0 20px 20px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
              {ALL_LETTERS.map(letter => {
                const has = lettersWithTerms.has(letter)
                const active = activeLetter === letter
                return (
                  <button key={letter} disabled={!has}
                    onClick={() => setActiveLetter(active ? null : letter)}
                    style={{ width: '30px', height: '30px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: has ? 'pointer' : 'default', border: active ? '1px solid rgba(245,158,11,0.45)' : has ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent', background: active ? 'rgba(245,158,11,0.14)' : has ? 'rgba(255,255,255,0.04)' : 'transparent', color: active ? '#f59e0b' : has ? 'rgba(148,163,184,1)' : 'rgba(30,41,59,1)', transition: 'all 0.15s' }}>
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Results header ── */}
      <section style={{ padding: '0 20px 12px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '11px', color: 'rgba(100,116,139,1)', fontWeight: 600 }}>
            {displayed.length} term{displayed.length !== 1 ? 's' : ''}
            {query && <> matching "<span style={{ color: '#f59e0b' }}>{query}</span>"</>}
            {activeCategory && <> in <span style={{ color: CATEGORY_COLORS[activeCategory] }}>{activeCategory}</span></>}
            {activeLetter && <> starting with <span style={{ color: '#f59e0b' }}>{activeLetter}</span></>}
          </p>
          {hasFilter && (
            <button onClick={clearFilters} style={{ fontSize: '11px', color: 'rgba(100,116,139,1)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Clear ×
            </button>
          )}
        </div>
      </section>

      {/* ── Term grid ── */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(100,116,139,1)' }}>No terms found</p>
              <p style={{ fontSize: '12px', color: 'rgba(30,41,59,1)', marginTop: '6px' }}>Try a different search or clear filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px', alignItems: 'start' }}>
              {displayed.map(term => (
                <TermCard key={term.id} term={term} highlight={query} onRelatedClick={handleRelatedClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }} className="md-4col">
          {[
            { val: `${TERMS.length}+`,                           label: 'Terms Defined',      color: '#f59e0b' },
            { val: `${TERMS.length}`,                            label: 'Visual Diagrams',     color: '#34d399' },
            { val: `${CATEGORIES.length}`,                       label: 'Categories',          color: '#60a5fa' },
            { val: `${TERMS.filter(t=>t.example).length}`,       label: 'With Examples',       color: '#c084fc' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: '16px', padding: '20px', textAlign: 'center', background: 'rgba(6,6,14,0.98)', border: `1px solid ${s.color}18` }}>
              <p style={{ fontWeight: 900, fontSize: '28px', marginBottom: '4px', color: s.color, fontFamily: 'system-ui,monospace', textShadow: `0 0 24px ${s.color}50` }}>{s.val}</p>
              <p style={{ fontSize: '9px', color: 'rgba(100,116,139,1)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '24px 20px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.18em', color: 'rgba(30,41,59,1)', textTransform: 'uppercase' }}>ICT Glossary · a Chronic Trading tool</span>
          <p style={{ fontSize: '10px', color: 'rgba(30,41,59,1)' }}>Definitions are educational. Not financial advice.</p>
        </div>
      </footer>
    </div>
  )
}
