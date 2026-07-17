import { useMemo, useState, useEffect } from 'react'
import { Zap, Check, X, Star } from 'lucide-react'
import { TERMS, CATEGORY_COLORS, type Term } from './terms'
import { DIAGRAMS } from './diagrams'

const ROUND_SIZE = 10
const BEST_KEY   = 'ict:quiz-best'

// Darken vivid hues for legibility on warm-light paper; unchanged in dark mode.
function catInk(hex: string): string {
  if (typeof document === 'undefined') return hex
  if (document.documentElement.getAttribute('data-theme') !== 'light') return hex
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, k = 0.58
  const h = (v: number) => Math.round(v * k).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

interface QuizQuestion {
  term: Term
  options: Term[]   // 4, shuffled, includes term
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(): QuizQuestion[] {
  const pool = TERMS.filter(t => DIAGRAMS[t.diagramId])
  return shuffle(pool).slice(0, ROUND_SIZE).map(term => {
    const sameCat = shuffle(pool.filter(t => t.id !== term.id && t.category === term.category)).slice(0, 3)
    const filler  = shuffle(pool.filter(t => t.id !== term.id && !sameCat.includes(t))).slice(0, 3 - sameCat.length)
    return { term, options: shuffle([term, ...sameCat, ...filler]) }
  })
}

export function QuizMode({ onClose }: { onClose: () => void }) {
  const [round,    setRound]    = useState<QuizQuestion[]>(() => buildRound())
  const [qi,       setQi]       = useState(0)
  const [picked,   setPicked]   = useState<string | null>(null)
  const [score,    setScore]    = useState(0)
  const [finished, setFinished] = useState(false)
  const [best,     setBest]     = useState<number>(() => {
    try { return Number(localStorage.getItem(BEST_KEY) ?? 0) } catch { return 0 }
  })

  const q = round[qi]
  const color = useMemo(() => q ? CATEGORY_COLORS[q.term.category] : '#f59e0b', [q])
  const DiagramComp = q ? DIAGRAMS[q.term.diagramId] : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (finished && score > best) {
      setBest(score)
      try { localStorage.setItem(BEST_KEY, String(score)) } catch { /* private mode */ }
    }
  }, [finished, score, best])

  const pick = (id: string) => {
    if (picked) return
    setPicked(id)
    if (id === q.term.id) setScore(s => s + 1)
  }
  const next = () => {
    if (qi + 1 >= round.length) { setFinished(true); return }
    setQi(i => i + 1); setPicked(null)
  }
  const restart = () => {
    setRound(buildRound()); setQi(0); setPicked(null); setScore(0); setFinished(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'var(--gl-overlay)', backdropFilter:'blur(12px)', overflowY:'auto' }}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'20px 16px 48px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:900, letterSpacing:'0.2em', color:catInk('#f59e0b'), display:'inline-flex', alignItems:'center', gap:6 }}><Zap size={13} strokeWidth={2.5} /> DIAGRAM QUIZ</span>
            {!finished && <span style={{ fontSize:10, color:'var(--gl-text-faint)', fontWeight:700 }}>{qi + 1} / {round.length}</span>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, fontWeight:900, color:catInk('#34d399'), fontVariantNumeric:'tabular-nums', display:'inline-flex', alignItems:'center', gap:4 }}><Check size={12} strokeWidth={3} /> {score}</span>
            {best > 0 && <span style={{ fontSize:10, fontWeight:700, color:catInk('#f59e0b') }}>Best {best}/{ROUND_SIZE}</span>}
            <button onClick={onClose} style={{ fontSize:12, fontWeight:700, color:'var(--gl-text-dim)', background:'var(--gl-border)', border:'1px solid var(--gl-border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:5 }}>
              <X size={12} strokeWidth={2.5} /> Close
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:3, borderRadius:2, background:'var(--gl-border)', overflow:'hidden', marginBottom:20 }}>
          <div style={{ width:`${((qi + (picked ? 1 : 0)) / round.length) * 100}%`, height:'100%', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', transition:'width 0.3s ease' }}/>
        </div>

        {finished ? (
          /* ── Results ── */
          <div style={{ textAlign:'center', padding:'40px 0' }}>
            <p style={{ fontSize:64, fontWeight:900, lineHeight:1, marginBottom:10, color: score >= 8 ? catInk('#34d399') : score >= 5 ? catInk('#f59e0b') : catInk('#f87171'), textShadow:'0 0 40px currentColor' }}>
              {score}/{round.length}
            </p>
            <p style={{ fontSize:15, fontWeight:700, color:'var(--gl-text)', marginBottom:6 }}>
              {score === round.length ? '🔥 Perfect — you know your diagrams' : score >= 8 ? 'Sharp eye — nearly flawless' : score >= 5 ? 'Solid — keep drilling' : 'The diagrams will click — run it again'}
            </p>
            {score >= best && score > 0 && <p style={{ fontSize:11, fontWeight:900, letterSpacing:'0.14em', color:catInk('#f59e0b'), textTransform:'uppercase', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><Star size={11} strokeWidth={2} fill="currentColor" /> New best</p>}
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:24 }}>
              <button onClick={restart} style={{ padding:'12px 28px', borderRadius:14, fontSize:13, fontWeight:900, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#0a0800', border:'none', cursor:'pointer' }}>
                ↺ Play again
              </button>
              <button onClick={onClose} style={{ padding:'12px 24px', borderRadius:14, fontSize:13, fontWeight:700, background:'transparent', color:'var(--gl-text-dim)', border:'1px solid var(--gl-border-2)', cursor:'pointer' }}>
                Back to glossary
              </button>
            </div>
          </div>
        ) : (
          /* ── Question ── */
          <>
            <div style={{ borderRadius:18, overflow:'hidden', border:`1px solid ${color}22`, background:`linear-gradient(160deg,${color}0a,rgba(4,4,8,1) 70%)`, marginBottom:16 }}>
              {DiagramComp && <DiagramComp />}
            </div>
            <p style={{ textAlign:'center', fontSize:13, fontWeight:700, color:'var(--gl-text)', marginBottom:14 }}>
              Which concept does this diagram show?
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {q.options.map(opt => {
                const isCorrect = picked && opt.id === q.term.id
                const isWrong   = picked === opt.id && opt.id !== q.term.id
                const oc = CATEGORY_COLORS[opt.category]
                return (
                  <button key={opt.id} onClick={() => pick(opt.id)}
                    style={{
                      padding:'13px 14px', borderRadius:13, textAlign:'left', cursor: picked ? 'default' : 'pointer',
                      fontSize: 13, fontWeight:700, transition:'all 0.15s',
                      background: isCorrect ? 'rgba(52,211,153,0.12)' : isWrong ? 'rgba(248,113,113,0.12)' : 'var(--gl-surface-2)',
                      border: `1.5px solid ${isCorrect ? 'rgba(52,211,153,0.5)' : isWrong ? 'rgba(248,113,113,0.5)' : 'var(--gl-border)'}`,
                      color: isCorrect ? catInk('#34d399') : isWrong ? catInk('#f87171') : 'var(--gl-text)',
                    }}>
                    {opt.term}{opt.abbr ? ` (${opt.abbr})` : ''}
                    {isCorrect ? <Check size={12} strokeWidth={3} style={{ display:'inline', verticalAlign:'-2px', marginLeft:4 }} /> : isWrong ? <X size={12} strokeWidth={3} style={{ display:'inline', verticalAlign:'-2px', marginLeft:4 }} /> : ''}
                    {!picked && <span style={{ display:'block', fontSize: 10, fontWeight:900, letterSpacing:'0.14em', textTransform:'uppercase', color:catInk(oc), marginTop:3 }}>{opt.category}</span>}
                  </button>
                )
              })}
            </div>

            {picked && (
              <div style={{ marginTop:14 }}>
                <div style={{ padding:'12px 14px', borderRadius:13, background:`${color}0a`, border:`1px solid ${color}22`, marginBottom:12 }}>
                  <p style={{ fontSize:10, fontWeight:900, letterSpacing:'0.16em', textTransform:'uppercase', color, marginBottom:5 }}>{q.term.term}</p>
                  <p style={{ fontSize: 12, color:'var(--gl-text-dim)', lineHeight:1.6 }}>{q.term.definition}</p>
                </div>
                <button onClick={next}
                  style={{ width:'100%', padding:'13px', borderRadius:14, fontSize:13, fontWeight:900, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#0a0800', border:'none', cursor:'pointer' }}>
                  {qi + 1 >= round.length ? 'See results →' : 'Next question →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
