import { useMemo, useState, useEffect } from 'react'
import { TERMS, CATEGORY_COLORS, type Term } from './terms'
import { DIAGRAMS } from './diagrams'

const ROUND_SIZE = 10
const BEST_KEY   = 'ict:quiz-best'

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
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(2,2,6,0.96)', backdropFilter:'blur(12px)', overflowY:'auto' }}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'20px 16px 48px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:900, letterSpacing:'0.2em', color:'#f59e0b' }}>⚡ DIAGRAM QUIZ</span>
            {!finished && <span style={{ fontSize:10, color:'rgba(100,116,139,0.7)', fontWeight:700 }}>{qi + 1} / {round.length}</span>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, fontWeight:900, color:'#34d399', fontVariantNumeric:'tabular-nums' }}>✓ {score}</span>
            {best > 0 && <span style={{ fontSize:10, fontWeight:700, color:'rgba(245,158,11,0.6)' }}>Best {best}/{ROUND_SIZE}</span>}
            <button onClick={onClose} style={{ fontSize:12, fontWeight:700, color:'rgba(148,163,184,0.7)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 12px', cursor:'pointer' }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden', marginBottom:20 }}>
          <div style={{ width:`${((qi + (picked ? 1 : 0)) / round.length) * 100}%`, height:'100%', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', transition:'width 0.3s ease' }}/>
        </div>

        {finished ? (
          /* ── Results ── */
          <div style={{ textAlign:'center', padding:'40px 0' }}>
            <p style={{ fontSize:64, fontWeight:900, lineHeight:1, marginBottom:10, color: score >= 8 ? '#34d399' : score >= 5 ? '#f59e0b' : '#f87171', textShadow:'0 0 40px currentColor' }}>
              {score}/{round.length}
            </p>
            <p style={{ fontSize:15, fontWeight:700, color:'rgba(226,232,240,0.9)', marginBottom:6 }}>
              {score === round.length ? '🔥 Perfect — you know your diagrams' : score >= 8 ? 'Sharp eye — nearly flawless' : score >= 5 ? 'Solid — keep drilling' : 'The diagrams will click — run it again'}
            </p>
            {score >= best && score > 0 && <p style={{ fontSize:11, fontWeight:900, letterSpacing:'0.14em', color:'#f59e0b', textTransform:'uppercase', marginBottom:24 }}>★ New best</p>}
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:24 }}>
              <button onClick={restart} style={{ padding:'12px 28px', borderRadius:14, fontSize:13, fontWeight:900, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#0a0800', border:'none', cursor:'pointer' }}>
                ↺ Play again
              </button>
              <button onClick={onClose} style={{ padding:'12px 24px', borderRadius:14, fontSize:13, fontWeight:700, background:'transparent', color:'rgba(148,163,184,0.8)', border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer' }}>
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
            <p style={{ textAlign:'center', fontSize:13, fontWeight:700, color:'rgba(226,232,240,0.9)', marginBottom:14 }}>
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
                      fontSize:12.5, fontWeight:700, transition:'all 0.15s',
                      background: isCorrect ? 'rgba(52,211,153,0.12)' : isWrong ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${isCorrect ? 'rgba(52,211,153,0.5)' : isWrong ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: isCorrect ? '#34d399' : isWrong ? '#f87171' : 'rgba(226,232,240,0.85)',
                    }}>
                    {opt.term}{opt.abbr ? ` (${opt.abbr})` : ''}
                    {isCorrect ? ' ✓' : isWrong ? ' ✗' : ''}
                    {!picked && <span style={{ display:'block', fontSize:8.5, fontWeight:900, letterSpacing:'0.14em', textTransform:'uppercase', color:`${oc}70`, marginTop:3 }}>{opt.category}</span>}
                  </button>
                )
              })}
            </div>

            {picked && (
              <div style={{ marginTop:14 }}>
                <div style={{ padding:'12px 14px', borderRadius:13, background:`${color}0a`, border:`1px solid ${color}22`, marginBottom:12 }}>
                  <p style={{ fontSize:10, fontWeight:900, letterSpacing:'0.16em', textTransform:'uppercase', color, marginBottom:5 }}>{q.term.term}</p>
                  <p style={{ fontSize:11.5, color:'rgba(148,163,184,0.85)', lineHeight:1.6 }}>{q.term.definition}</p>
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
