import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import {
  TrendingUp, Droplet, Target, Blocks, Clock, RefreshCw, Brain,
  Check, Link, Circle, Zap, BookOpen, Palette, Tag, Type, Lightbulb, Moon, Sun,
  type LucideIcon,
} from 'lucide-react'
import {
  TERMS, CATEGORIES, CATEGORY_COLORS, searchTerms,
  ALL_LETTERS, type Term, type Category,
} from './terms'
import { DIAGRAMS } from './diagrams'
import { SuiteBar } from './SuiteBar'
import { QuizMode } from './QuizMode'
import { probeSync, pushNamespace, onAuthChange } from './lib/crossSync'
import { useTheme } from './useTheme'

// ── Theme toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} title={theme === 'light' ? 'Switch to dark' : 'Switch to light'} aria-label="Toggle theme"
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:7, cursor:'pointer',
        background:'var(--gl-surface-2)', border:'1px solid var(--gl-border)', color:'var(--gl-text-dim)' }}>
      {theme === 'light' ? <Moon size={14} strokeWidth={2} /> : <Sun size={14} strokeWidth={2} />}
    </button>
  )
}

// Category hues are vivid for dark mode; on warm-light paper they're too pale as
// text, so darken them (returns a HEX so `${color}NN` tint concatenations still
// work). Dark mode returns the original vivid hue unchanged.
function catInk(hex: string): string {
  if (typeof document === 'undefined') return hex
  if (document.documentElement.getAttribute('data-theme') !== 'light') return hex
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, k = 0.58
  const h = (v: number) => Math.round(v * k).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

// ── Category metadata ─────────────────────────────────────────────────────────
// Category icons use the shared lucide set, so the glossary reads like the rest
// of the suite rather than an emoji picker.
const CAT_ICON: Record<string, LucideIcon> = {
  'Market Structure': TrendingUp, 'Liquidity': Droplet, 'Price Delivery': Target,
  'Order Blocks': Blocks,        'Sessions & Time': Clock, 'AMD & Bias': RefreshCw,
  'SMC & Models': Brain,
}
function CatIcon({ cat, size, strokeWidth = 1.75, style }: { cat: string; size: number; strokeWidth?: number; style?: React.CSSProperties }) {
  const I = CAT_ICON[cat] ?? Target
  return <I size={size} strokeWidth={strokeWidth} style={style} />
}
const CAT_SHORT: Record<string, string> = {
  'Market Structure': 'STRUCTURE', 'Liquidity': 'LIQUIDITY',
  'Price Delivery': 'DELIVERY',   'Order Blocks': 'ORDER BLOCK',
  'Sessions & Time': 'SESSION',   'AMD & Bias': 'AMD',
  'SMC & Models': 'SMC',
}

// ── Daily featured term (deterministic by calendar day) ───────────────────────
function getDailyTerm(): Term {
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  return TERMS[dayIndex % TERMS.length]
}

// ── Animated ICT network background ──────────────────────────────────────────
const NODES = [
  { id:'FVG',   x:12, y:18, c:'#f59e0b' }, { id:'OB',    x:28, y:8,  c:'#c084fc' },
  { id:'BOS',   x:45, y:22, c:'#34d399' }, { id:'ChoCH', x:62, y:12, c:'#34d399' },
  { id:'AMD',   x:78, y:20, c:'#f472b6' }, { id:'Po3',   x:88, y:8,  c:'#f472b6' },
  { id:'BSL',   x:18, y:38, c:'#60a5fa' }, { id:'SSL',   x:35, y:48, c:'#60a5fa' },
  { id:'DOL',   x:55, y:40, c:'#60a5fa' }, { id:'OTE',   x:70, y:35, c:'#f59e0b' },
  { id:'EQH',   x:82, y:42, c:'#34d399' }, { id:'MSS',   x:8,  y:58, c:'#34d399' },
  { id:'NWOG',  x:25, y:65, c:'#fb923c' }, { id:'SMT',   x:48, y:62, c:'#14b8a6' },
  { id:'IRL',   x:65, y:55, c:'#60a5fa' }, { id:'CE',    x:88, y:58, c:'#f59e0b' },
  { id:'CBDR',  x:15, y:78, c:'#fb923c' }, { id:'LRLR',  x:32, y:80, c:'#60a5fa' },
  { id:'BISI',  x:50, y:78, c:'#f59e0b' }, { id:'BPR',   x:80, y:75, c:'#f59e0b' },
  { id:'Kill',  x:22, y:92, c:'#fb923c' }, { id:'Macro', x:42, y:90, c:'#fb923c' },
  { id:'POI',   x:60, y:88, c:'#f59e0b' }, { id:'MSB',   x:72, y:92, c:'#34d399' },
]
const EDGES = [
  [0,1],[0,7],[1,6],[2,3],[2,9],[3,11],[4,5],[4,12],[6,7],[7,8],
  [8,13],[9,10],[10,15],[11,12],[13,14],[14,15],[16,17],[17,18],
  [18,22],[20,21],[21,22],[22,23],[0,9],[2,13],[4,8],[6,11],
]
function ICTNetworkBg() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width:'100%', height:'100%', opacity:0.055 }} aria-hidden>
        <defs><filter id="glow2"><feGaussianBlur stdDeviation="0.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        {EDGES.map(([a,b],i) => {
          const na=NODES[a], nb=NODES[b]; if (!na||!nb) return null
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="rgba(245,158,11,0.5)" strokeWidth="0.12" strokeDasharray="0.4,0.8"/>
        })}
        {NODES.map((n,i) => (
          <g key={n.id} style={{ animation:`float-node-${i%4} ${14+(i%6)*2}s ease-in-out infinite` }} filter="url(#glow2)">
            <circle cx={n.x} cy={n.y} r="1.1" fill={n.c} opacity="0.7"/>
            <text x={n.x+1.6} y={n.y+0.4} fill={n.c} fontSize="1.5" fontFamily="system-ui" fontWeight="900" opacity="0.65">{n.id}</text>
          </g>
        ))}
      </svg>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.12),transparent 65%)', filter:'blur(80px)', top:'-150px', left:'20%', animation:'orb-drift-1 20s ease-in-out infinite' }}/>
      <div style={{ position:'absolute', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle,rgba(96,165,250,0.09),transparent 65%)', filter:'blur(70px)', top:'100px', right:'8%', animation:'orb-drift-2 25s ease-in-out infinite' }}/>
      <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08),transparent 65%)', filter:'blur(60px)', bottom:'10%', left:'5%', animation:'orb-drift-3 30s ease-in-out infinite' }}/>
      <div style={{ position:'absolute', top:0, left:0, width:'180px', height:'100%', background:'linear-gradient(90deg,rgba(245,158,11,0.04),transparent)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:0, right:0, width:'180px', height:'100%', background:'linear-gradient(270deg,rgba(96,165,250,0.03),transparent)', pointerEvents:'none' }}/>
    </div>
  )
}

// ── Scrolling ticker ──────────────────────────────────────────────────────────
function Ticker() {
  const items = TERMS.map(t => t.abbr || t.term.split(' ').map(w=>w[0]).join(''))
  const full  = [...items, ...items]
  return (
    <div style={{ overflow:'hidden', width:'100%', borderTop:'1px solid rgba(245,158,11,0.1)', borderBottom:'1px solid rgba(245,158,11,0.1)', background:'rgba(245,158,11,0.03)', padding:'6px 0', maskImage:'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)', WebkitMaskImage:'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)' }}>
      <div style={{ display:'flex', gap:'24px', whiteSpace:'nowrap', animation:`ticker-scroll ${items.length*0.9}s linear infinite`, willChange:'transform' }}>
        {full.map((label,i) => (
          <span key={i} style={{ fontSize:'9px', fontWeight:900, letterSpacing:'0.14em', color:catInk(['#f59e0b','#34d399','#60a5fa','#c084fc','#fb923c','#f472b6','#14b8a6'][i%7]), opacity:0.65 }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Daily featured term banner ────────────────────────────────────────────────
function DailyTermBanner({ onSearch }: { onSearch: (q: string) => void }) {
  const term  = getDailyTerm()
  const color = catInk(CATEGORY_COLORS[term.category])
  const DiagramComp = DIAGRAMS[term.diagramId]
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 20px 20px' }}>
      <div style={{
        borderRadius: 20, overflow: 'hidden',
        background: `linear-gradient(135deg, ${color}10 0%, var(--gl-surface) 50%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 40px ${color}10`,
      }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 7, background: `${color}18`, color, border: `1px solid ${color}28` }}>
              ✦ Term of the Day
            </span>
            <span style={{ fontSize: 10, color: 'var(--gl-text-faint)', fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button
            onClick={() => onSearch(term.term)}
            style={{ fontSize: 10, fontWeight: 700, color, background: 'none', border: `1px solid ${color}28`, borderRadius: 8, padding: '4px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = `${color}14`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            View all related →
          </button>
        </div>

        <div className="daily-grid" style={{ gap: 0 }}>
          {/* Left: info */}
          <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--gl-text)', letterSpacing: '-0.5px' }}>{term.term}</h3>
              {term.abbr && <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.14em', padding: '3px 8px', borderRadius: 7, background: `${color}16`, color, border: `1px solid ${color}30` }}>{term.abbr}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block' }}/>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.16em', color, textTransform: 'uppercase', opacity: 0.8 }}>{term.category}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--gl-text-dim)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 4, WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden' }}>
              {term.definition}
            </p>
            {!expanded && (
              <button onClick={() => setExpanded(true)} style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: `${color}80`, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Read more ↓
              </button>
            )}
            {expanded && term.example && (
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 12, background: `${color}08`, border: `1px solid ${color}18`, fontSize: 12, color: 'var(--gl-text-dim)', lineHeight: 1.65 }}>
                <span style={{ display: 'block', fontSize: 10, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color, marginBottom: 6 }}>Example</span>
                {term.example}
              </div>
            )}
          </div>
          {/* Right: diagram */}
          {DiagramComp && (
            <div style={{ borderLeft: `1px solid ${color}14`, background: `linear-gradient(160deg,${color}08,transparent 60%)`, display: 'flex', alignItems: 'center' }}>
              <DiagramComp />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Term card ─────────────────────────────────────────────────────────────────
// Clipboard fallback for contexts where the async API is unavailable or rejects
function legacyCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch { /* best effort */ }
  document.body.removeChild(ta)
}

function TermCard({ term, onRelatedClick, highlight, learned, onToggleLearned, flash }: {
  term: Term; onRelatedClick: (name: string) => void; highlight?: string
  learned: boolean; onToggleLearned: (id: string) => void; flash?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [copied,   setCopied]   = useState(false)
  const color = catInk(CATEGORY_COLORS[term.category])
  const DiagramComp = DIAGRAMS[term.diagramId]

  function copyLink(e: React.MouseEvent) {
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}?t=${term.id}`
    const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 1500) }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(flash).catch(() => { legacyCopy(url); flash() })
    } else {
      legacyCopy(url); flash()
    }
  }

  function hl(text: string) {
    if (!highlight || highlight.length < 2) return <>{text}</>
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return <>{parts.map((p,i) => p.toLowerCase()===highlight.toLowerCase()
      ? <mark key={i} style={{ background:`${color}28`, color, borderRadius:'3px', padding:'0 2px', fontWeight:700 }}>{p}</mark>
      : p)}</>
  }

  return (
    <div className="gcard" id={`term-${term.id}`} style={{
      '--accent': color, borderRadius:18, overflow:'hidden',
      background: learned ? `var(--gl-surface)` : 'var(--gl-surface)',
      borderTop:`1px solid ${color}22`, borderRight:`1px solid ${color}10`,
      borderBottom:`1px solid ${learned ? color+'35' : color+'10'}`,
      borderLeft:`3px solid ${color}`,
      ...(flash ? { boxShadow:`0 0 0 2px ${color}, 0 0 32px ${color}66`, transition:'box-shadow 0.4s' } : {}),
    } as React.CSSProperties}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Learned glow */}
      {learned && <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${color}06,transparent 50%)`, pointerEvents:'none', zIndex:0 }}/>}

      {/* Diagram */}
      <div className="diagram-frame" style={{ background:`linear-gradient(160deg,${color}0e 0%,${color}03 50%,rgba(4,4,8,1) 80%)`, borderBottom:`1px solid ${color}14`, position:'relative' }}>
        <div style={{ position:'absolute', top:8, right:8, zIndex:3, display:'flex', gap:5, alignItems:'center' }}>
          {learned && <span style={{ fontSize:10, background:'rgba(52,211,153,0.15)', color:catInk('#34d399'), border:'1px solid rgba(52,211,153,0.3)', borderRadius:5, padding:'2px 6px', fontWeight:900, letterSpacing:'0.1em', display:'inline-flex', alignItems:'center', gap:4 }}><Check size={11} strokeWidth={3} /> LEARNED</span>}
          <span style={{ fontSize:7, fontWeight:900, letterSpacing:'0.14em', padding:'3px 7px', borderRadius:6, background:`${color}14`, color, border:`1px solid ${color}28`, textTransform:'uppercase' }}>
            {CAT_SHORT[term.category]}
          </span>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          {DiagramComp ? <DiagramComp /> : <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.25, color }}><CatIcon cat={term.category} size={30} /></div>}
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:20, background:`linear-gradient(transparent,rgba(5,5,12,0.6))`, zIndex:2, pointerEvents:'none' }}/>
      </div>

      {/* Body */}
      <div style={{ padding:'13px 14px 13px 12px', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:6 }}>
          <h3 style={{ fontSize:14, fontWeight:900, color:'var(--gl-text)', lineHeight:1.2, flex:1, letterSpacing:'-0.2px' }}>{term.term}</h3>
          <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
            {term.abbr && <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.14em', padding:'3px 8px', borderRadius:7, background:`${color}16`, color, border:`1px solid ${color}30` }}>{term.abbr}</span>}
            {/* Copy shareable link */}
            <button
              onClick={copyLink}
              title={copied ? 'Link copied!' : 'Copy link to this term'}
              style={{ display:'flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', padding:'3px', borderRadius:6, lineHeight:1, opacity: copied ? 1 : 0.3, transition:'opacity 0.2s, transform 0.15s', color: copied ? '#34d399' : 'var(--gl-text-dim)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity='1'; (e.currentTarget as HTMLElement).style.transform='scale(1.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=copied?'1':'0.3'; (e.currentTarget as HTMLElement).style.transform='scale(1)' }}
            >
              {copied ? <Check size={13} strokeWidth={3} /> : <Link size={13} strokeWidth={2} />}
            </button>
            {/* Learned toggle */}
            <button
              onClick={e => { e.stopPropagation(); onToggleLearned(term.id) }}
              title={learned ? 'Mark as unlearned' : 'Mark as learned'}
              style={{ display:'flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', padding:'3px', borderRadius:6, lineHeight:1, opacity: learned ? 1 : 0.25, transition:'opacity 0.2s, transform 0.15s', color: learned ? '#34d399' : 'rgba(148,163,184,0.6)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity='1'; (e.currentTarget as HTMLElement).style.transform='scale(1.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=learned?'1':'0.25'; (e.currentTarget as HTMLElement).style.transform='scale(1)' }}
            >
              {learned ? <Check size={14} strokeWidth={3} /> : <Circle size={14} strokeWidth={2} />}
            </button>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:9 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:color, boxShadow:`0 0 6px ${color}`, display:'inline-block' }}/>
          <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.16em', color, textTransform:'uppercase', opacity:0.8 }}>{term.category}</span>
        </div>

        <p style={{ fontSize:12, color:'var(--gl-text-dim)', lineHeight:1.68, display:'-webkit-box', WebkitLineClamp:expanded?'unset':3, WebkitBoxOrient:'vertical', overflow:expanded?'visible':'hidden' }}>
          {highlight ? hl(term.definition) : term.definition}
        </p>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
          <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', color:`${color}65`, display:'flex', alignItems:'center', gap:3 }}>
            {expanded ? 'Less' : 'Details'}
            <span style={{ display:'inline-block', transform:expanded?'rotate(180deg)':'none', transition:'transform 0.25s cubic-bezier(.34,1.56,.64,1)' }}>▾</span>
          </span>
        </div>

        {expanded && (
          <div className="expand-content" style={{ marginTop:12, borderTop:`1px solid ${color}14`, paddingTop:12 }}>
            {term.example && (
              <div style={{ padding:'10px 12px', borderRadius:12, marginBottom:10, background:`${color}08`, border:`1px solid ${color}18`, fontSize: 12, color:'var(--gl-text-dim)', lineHeight:1.65 }}>
                <span style={{ display:'block', fontSize: 10, fontWeight:900, letterSpacing:'0.18em', textTransform:'uppercase', color, marginBottom:6 }}>Example</span>
                {term.example}
              </div>
            )}
            {term.related.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase', color:`${color}55`, marginBottom:8 }}>Related</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {term.related.map(r => (
                    <button key={r} className="related-tag"
                      onClick={e => { e.stopPropagation(); onRelatedClick(r) }}
                      style={{ padding:'5px 11px', borderRadius:9, fontSize:11, fontWeight:700, background:`${color}10`, color, border:`1px solid ${color}28`, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                      {r} <span style={{ opacity:0.6, fontSize:9 }}>→</span>
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

// ── Category showcase ─────────────────────────────────────────────────────────
function CategoryCards({ onSelect, active }: { onSelect: (c: Category | null) => void; active: Category | null }) {
  return (
    <section style={{ padding:'0 20px 64px' }}>
      <div style={{ maxWidth:1020, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontSize:9, fontWeight:900, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(100,116,139,0.3)', marginBottom:8 }}>Explore by Category</p>
          <h2 style={{ fontSize:'clamp(22px,4vw,34px)', fontWeight:900, letterSpacing:'-1px', color:'var(--gl-text)' }}>7 Core ICT Frameworks</h2>
          <p style={{ fontSize:13, color:'var(--gl-text-faint)', marginTop:8, maxWidth:400, margin:'8px auto 0' }}>Every concept organized by its role in the ICT methodology.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
          {CATEGORIES.map(cat => {
            const color  = catInk(CATEGORY_COLORS[cat])
            const count  = TERMS.filter(t => t.category === cat).length
            const isActive = active === cat
            const sample = TERMS.filter(t => t.category === cat).slice(0,3).map(t => t.abbr || t.term.split(' ')[0])
            return (
              <button key={cat} onClick={() => { onSelect(isActive ? null : cat); window.scrollTo({ top:0, behavior:'smooth' }) }}
                style={{ '--accent':color, borderRadius:18, padding:'22px 20px', textAlign:'left', cursor:'pointer', background:isActive?`${color}14`:'var(--gl-surface)', border:`1px solid ${isActive?color+'45':color+'18'}`, boxShadow:isActive?`0 0 32px ${color}18`:'none', transition:'all 0.2s ease', position:'relative', overflow:'hidden' } as React.CSSProperties}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow=`0 12px 40px ${color}18, 0 0 0 1px ${color}30` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; (e.currentTarget as HTMLElement).style.boxShadow=isActive?`0 0 32px ${color}18`:'' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color},transparent)`, opacity:0.6 }}/>
                <div style={{ position:'absolute', right:12, top:10, opacity:0.06, pointerEvents:'none', color }}><CatIcon cat={cat} size={42} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color, background:`${color}15`, border:`1px solid ${color}28`, flexShrink:0 }}><CatIcon cat={cat} size={18} /></div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:900, color:'var(--gl-text)', lineHeight:1.2 }}>{cat}</p>
                    <p style={{ fontSize:10, color, fontWeight:700, opacity:0.8 }}>{count} concepts</p>
                  </div>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {sample.map(s => <span key={s} style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', padding:'3px 8px', borderRadius:6, background:`${color}10`, color, border:`1px solid ${color}20` }}>{s}</span>)}
                  <span style={{ fontSize:9, color:`${color}55`, padding:'3px 0', display:'flex', alignItems:'center' }}>+{count-3} more →</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useTheme() // re-render the tree on theme toggle so catInk() re-resolves
  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeLetter,   setActiveLetter]   = useState<string | null>(null)
  const [navShadow,      setNavShadow]      = useState(false)
  const [quizOpen,       setQuizOpen]       = useState(false)
  const [linkedId,       setLinkedId]       = useState<string | null>(null)
  const [learned,        setLearned]        = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ict:learned') ?? '[]')) }
    catch { return new Set() }
  })
  const [signedIn,       setSignedIn]       = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // ── Cross-site sync: piggyback on the shared Chronic Trading Supabase session ──
  useEffect(() => {
    let alive = true
    const sync = () => probeSync().then(({ status, blob }) => {
      if (!alive) return
      setSignedIn(status === 'ready')  // only claim "synced" when the round-trip works
      const remote = blob.glossary as { learned?: string[] } | undefined
      if (status === 'ready' && remote?.learned) {
        setLearned(local => {
          const merged = new Set([...local, ...remote.learned!])
          localStorage.setItem('ict:learned', JSON.stringify([...merged]))
          return merged
        })
      }
    })
    sync()
    const off = onAuthChange(() => { sync() })
    return () => { alive = false; off() }
  }, [])

  // Debounced push of the learned set whenever it changes (only while signed in)
  useEffect(() => {
    if (!signedIn) return
    const t = setTimeout(() => { pushNamespace('glossary', { learned: [...learned] }) }, 1200)
    return () => clearTimeout(t)
  }, [signedIn, learned])

  // Scroll shadow
  useEffect(() => {
    const fn = () => setNavShadow(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // URL deep link: ?t=term-id → filter to the term, scroll to it, flash it
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const termId = p.get('t')
    if (termId) {
      const term = TERMS.find(t => t.id === termId)
      if (term) {
        setQuery(term.term)
        setLinkedId(termId)
        setTimeout(() => {
          document.getElementById(`term-${termId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 350)
        setTimeout(() => setLinkedId(null), 3200)
      }
    }
  }, [])

  // Keyboard shortcuts: / to search, Escape to clear
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (e.key === '/' && !inInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
      if (e.key === 'Escape' && inInput) {
        setQuery(''); setActiveCategory(null); setActiveLetter(null)
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const toggleLearned = useCallback((id: string) => {
    setLearned(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      localStorage.setItem('ict:learned', JSON.stringify([...next]))
      return next
    })
  }, [])

  const displayed = useMemo(() => {
    let list = query.trim().length >= 1 ? searchTerms(query.trim()) : TERMS
    if (activeCategory) list = list.filter(t => t.category === activeCategory)
    if (activeLetter)   list = list.filter(t => t.term.toUpperCase().startsWith(activeLetter))
    return list.sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory, activeLetter])

  const lettersWithTerms = useMemo(() => new Set(TERMS.map(t => t.term[0].toUpperCase())), [])
  const learnedCount = learned.size
  const learnedPct   = Math.round((learnedCount / TERMS.length) * 100)

  function handleRelatedClick(name: string) {
    setQuery(name); setActiveCategory(null); setActiveLetter(null)
    searchRef.current?.focus(); window.scrollTo({ top:0, behavior:'smooth' })
  }
  function clearFilters() { setQuery(''); setActiveCategory(null); setActiveLetter(null) }
  const hasFilter = query || activeCategory || activeLetter

  const handleDailySearch = useCallback((q: string) => {
    setQuery(q); setActiveCategory(null); setActiveLetter(null)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--gl-bg)', color:'var(--gl-text)', position:'relative' }}>
      <SuiteBar current="glossary" />
      {quizOpen && <QuizMode onClose={() => setQuizOpen(false)} />}
      <ICTNetworkBg />

      {/* ══ Nav ══ */}
      <nav style={{ borderBottom:'1px solid var(--gl-border)', position:'sticky', top:0, zIndex:50, background:navShadow?'var(--gl-nav)':'var(--gl-nav)', backdropFilter:'blur(24px)', boxShadow:navShadow?'0 1px 40px rgba(0,0,0,0.7)':'none', transition:'background 0.3s,box-shadow 0.3s' }}>
        <Ticker />
        <div style={{ maxWidth:1020, margin:'0 auto', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.28)', boxShadow:'0 0 12px rgba(245,158,11,0.12)' }}>📖</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:7 }}>
              <span style={{ fontSize:12, fontWeight:900, letterSpacing:'0.2em', color:'var(--gl-text)' }}>ICT GLOSSARY</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gl-text-faint)' }}>by Chronic Trading</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {learnedCount > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:60, height:4, borderRadius:2, background:'var(--gl-border)', overflow:'hidden' }}>
                  <div style={{ width:`${learnedPct}%`, height:'100%', background:'linear-gradient(90deg,#34d399,#059669)', borderRadius:2, transition:'width 0.4s ease' }}/>
                </div>
                <span style={{ fontSize:9, fontWeight:700, color:'rgba(52,211,153,0.7)' }}>{learnedCount}/{TERMS.length}</span>
              </div>
            )}
            <div style={{ width:1, height:14, background:'var(--gl-border)' }}/>
            <button onClick={() => setQuizOpen(true)}
              style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', padding:'4px 10px', borderRadius:7, background:'rgba(245,158,11,0.1)', color:catInk('#f59e0b'), border:'1px solid rgba(245,158,11,0.25)', cursor:'pointer', transition:'all 0.15s', display:'inline-flex', alignItems:'center', gap:5 }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(245,158,11,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background='rgba(245,158,11,0.1)')}>
              <Zap size={11} strokeWidth={2.5} /> QUIZ
            </button>
            {signedIn && (
              <div title="Signed in — your learned terms sync across your Chronic Trading account" style={{ display:'flex', alignItems:'center', gap:4, fontSize:9, fontWeight:800, letterSpacing:'0.06em', padding:'4px 8px', borderRadius:7, background:'rgba(52,211,153,0.08)', color:catInk('#34d399'), border:'1px solid rgba(52,211,153,0.22)' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#34d399', boxShadow:'0 0 6px #34d399' }}/>
                Synced
              </div>
            )}
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', padding:'4px 9px', borderRadius:7, background:'rgba(52,211,153,0.1)', color:catInk('#34d399'), border:'1px solid rgba(52,211,153,0.22)' }}>
              {TERMS.length} terms
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <section style={{ position:'relative', padding:'72px 20px 48px', textAlign:'center', overflow:'hidden', zIndex:1 }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 80% 70% at 50% -5%,rgba(245,158,11,0.1),transparent 65%)' }}/>
        <div style={{ position:'absolute', inset:'-40px', backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'40px 40px', animation:'grid-scroll 25s linear infinite', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.7),transparent)' }}/>

        {/* Side labels */}
        <div className="hero-side" style={{ position:'absolute', left:'2%', top:'15%', bottom:'15%', width:'130px', pointerEvents:'none', flexDirection:'column', justifyContent:'space-evenly', opacity:0.55 }}>
          {CATEGORIES.slice(0,4).map(cat => (
            <div key={cat} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:18, height:1, background:CATEGORY_COLORS[cat], opacity:0.6 }}/>
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.14em', color:catInk(CATEGORY_COLORS[cat]), textTransform:'uppercase', opacity:0.65, whiteSpace:'nowrap' }}>{cat.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <div className="hero-side" style={{ position:'absolute', right:'2%', top:'15%', bottom:'15%', width:'130px', pointerEvents:'none', flexDirection:'column', justifyContent:'space-evenly', alignItems:'flex-end', opacity:0.55 }}>
          {CATEGORIES.slice(3).map(cat => (
            <div key={cat} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.14em', color:catInk(CATEGORY_COLORS[cat]), textTransform:'uppercase', opacity:0.65, whiteSpace:'nowrap' }}>{cat.split(' ')[0]}</span>
              <div style={{ width:18, height:1, background:CATEGORY_COLORS[cat], opacity:0.6 }}/>
            </div>
          ))}
        </div>

        <div style={{ position:'relative', zIndex:2, maxWidth:740, margin:'0 auto' }}>
          <div className="animate-glow" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, border:'1px solid rgba(245,158,11,0.28)', background:'rgba(245,158,11,0.07)', marginBottom:22 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 8px #f59e0b,0 0 16px #f59e0b60', display:'inline-block' }}/>
            <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase', color:catInk('#f59e0b') }}>
              {TERMS.length} Concepts · Every one visualised
            </span>
          </div>

          <h1 style={{ fontWeight:900, lineHeight:0.88, fontSize:'clamp(40px,8vw,72px)', letterSpacing:'clamp(-2px,-0.04em,-3.5px)', marginBottom:18 }}>
            The <span className="gold-title">ICT&thinsp;/&thinsp;SMC</span>
            <br/><span style={{ color:'var(--gl-text)' }}>Glossary.</span>
          </h1>

          <p style={{ color:'var(--gl-text-dim)', lineHeight:1.7, fontSize:'clamp(13px,2vw,16px)', maxWidth:480, margin:'0 auto 28px' }}>
            Every concept defined, visualised with a custom SVG diagram, and cross-linked.
            The complete reference for ICT and Smart Money Concepts trading.
          </p>

          {/* Search */}
          <div style={{ position:'relative', maxWidth:540, margin:'0 auto 12px' }}>
            <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', color:query?'rgba(245,158,11,0.7)':'var(--gl-text-faint)', fontSize:16, pointerEvents:'none', transition:'color 0.2s' }}>
              {query ? '✦' : '⌕'}
            </span>
            <input ref={searchRef} className="search-input" value={query}
              onChange={e => { setQuery(e.target.value); setActiveLetter(null) }}
              placeholder="Search terms, abbreviations, definitions…"
              style={{ width:'100%', padding:'15px 44px 15px 46px', borderRadius:16, fontSize:14, color:'var(--gl-text)', background:query?'var(--gl-surface)':'var(--gl-surface)', border:`1.5px solid ${query?'rgba(245,158,11,0.5)':'var(--gl-border)'}`, boxShadow:query?'0 0 0 3px rgba(245,158,11,0.08),0 8px 32px rgba(0,0,0,0.5)':'0 4px 24px rgba(0,0,0,0.35)', outline:'none', transition:'all 0.22s', boxSizing:'border-box' }}
              autoComplete="off" spellCheck={false}
            />
            {query && <button onClick={() => setQuery('')} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'rgba(148,163,184,0.5)', background:'none', border:'none', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>}
          </div>
          <p style={{ fontSize: 10, color:'var(--gl-text-faint)', fontWeight:600, letterSpacing:'0.08em' }}>
            Press <kbd style={{ padding:'2px 6px', borderRadius:4, background:'var(--gl-border)', border:'1px solid var(--gl-border)', fontSize:9, fontFamily:'monospace' }}>/</kbd> to focus · <kbd style={{ padding:'2px 6px', borderRadius:4, background:'var(--gl-border)', border:'1px solid var(--gl-border)', fontSize:9, fontFamily:'monospace' }}>Esc</kbd> to clear
          </p>

          {/* Quick stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', marginTop:20 }}>
            {[
              { n:TERMS.length,                      label:'concepts',   c:'#f59e0b' },
              { n:TERMS.length,                      label:'diagrams',   c:'#34d399' },
              { n:TERMS.filter(t=>t.example).length, label:'examples',   c:'#60a5fa' },
              { n:CATEGORIES.length,                 label:'categories', c:'#c084fc' },
              { n:learnedCount,                      label:'learned',    c:'#34d399' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                <span style={{ fontSize:20, fontWeight:900, color:catInk(s.c), textShadow:`0 0 18px ${s.c}60`, fontVariantNumeric:'tabular-nums' }}>{s.n}</span>
                <span style={{ fontSize: 10, color:'var(--gl-text-faint)', fontWeight:600, letterSpacing:'0.07em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Daily Term ══ */}
      <div style={{ position:'relative', zIndex:1 }}>
        <DailyTermBanner onSearch={handleDailySearch} />
      </div>

      {/* ══ Category Filters (sticky) ══ */}
      <section style={{ position:'sticky', top:84, zIndex:40, background:'var(--gl-nav)', backdropFilter:'blur(18px)', borderBottom:'1px solid var(--gl-surface-2)', padding:'10px 20px 8px' }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
            <button className="cat-pill" onClick={() => setActiveCategory(null)}
              style={{ padding:'6px 14px', borderRadius:11, fontSize:10, fontWeight:900, letterSpacing:'0.06em', cursor:'pointer', border:`1.5px solid ${!activeCategory?'rgba(245,158,11,0.5)':'var(--gl-border)'}`, background:!activeCategory?'rgba(245,158,11,0.13)':'var(--gl-surface-2)', color:!activeCategory?catInk('#f59e0b'):'var(--gl-text-faint)', boxShadow:!activeCategory?'0 0 16px rgba(245,158,11,0.14)':'none', transition:'all 0.18s' }}>
              All {TERMS.length}
            </button>
            {CATEGORIES.map(cat => {
              const color=catInk(CATEGORY_COLORS[cat]), count=TERMS.filter(t=>t.category===cat).length, active=activeCategory===cat
              return (
                <button key={cat} className="cat-pill" onClick={() => setActiveCategory(active?null:cat)}
                  style={{ padding:'6px 13px', borderRadius:11, fontSize:10, fontWeight:900, letterSpacing:'0.06em', cursor:'pointer', border:`1.5px solid ${active?color+'50':'var(--gl-border)'}`, background:active?`${color}17`:'var(--gl-surface-2)', color:active?color:'var(--gl-text-faint)', boxShadow:active?`0 0 18px ${color}18`:'none', transition:'all 0.18s', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:color, opacity:active?1:0.5, display:'inline-block', boxShadow:active?`0 0 6px ${color}`:'none' }}/>
                  {cat} <span style={{ opacity:0.55, fontSize:9 }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ A–Z ══ */}
      {!query && (
        <section style={{ padding:'12px 20px 6px', position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:1020, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:4, justifyContent:'center', alignItems:'center' }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', color:'rgba(100,116,139,0.3)', textTransform:'uppercase', marginRight:4 }}>A–Z</span>
            {ALL_LETTERS.map(letter => {
              const has=lettersWithTerms.has(letter), active=activeLetter===letter
              return (
                <button key={letter} disabled={!has} className={has?'letter-btn':''}
                  onClick={() => setActiveLetter(active?null:letter)}
                  style={{ width:28, height:28, borderRadius:8, fontSize:10, fontWeight:900, cursor:has?'pointer':'default', border:active?'1.5px solid rgba(245,158,11,0.5)':has?'1px solid var(--gl-border)':'1px solid transparent', background:active?'rgba(245,158,11,0.14)':has?'var(--gl-surface-2)':'transparent', color:active?catInk('#f59e0b'):has?'var(--gl-text-dim)':'var(--gl-text-faint)', boxShadow:active?'0 0 12px rgba(245,158,11,0.18)':'none', transition:'all 0.14s' }}>
                  {letter}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ══ Results header ══ */}
      <section style={{ padding:'12px 20px 10px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1020, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontSize:11, color:'var(--gl-text-faint)', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:displayed.length>0?'#34d399':'#f87171', display:'inline-block', boxShadow:`0 0 6px ${displayed.length>0?'#34d399':'#f87171'}` }}/>
            {displayed.length} result{displayed.length!==1?'s':''}
            {query && <><span style={{ opacity:0.4 }}> · </span><span style={{ color:'rgba(245,158,11,0.8)' }}>"{query}"</span></>}
            {activeCategory && <><span style={{ opacity:0.4 }}> · </span><span style={{ color:CATEGORY_COLORS[activeCategory] }}>{activeCategory}</span></>}
          </p>
          {hasFilter && (
            <button onClick={clearFilters} style={{ fontSize:10, fontWeight:700, color:'var(--gl-text-faint)', background:'none', border:'1px solid var(--gl-border)', cursor:'pointer', padding:'4px 10px', borderRadius:8, transition:'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color='var(--gl-text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color='var(--gl-text-faint)')}
            >Clear ×</button>
          )}
        </div>
      </section>

      {/* ══ Term grid ══ */}
      <section style={{ padding:'4px 20px 64px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }} className="animate-fade-up">
              <div style={{ fontSize:44, marginBottom:16, opacity:0.5 }}>🔍</div>
              <p style={{ fontSize:16, fontWeight:700, color:'var(--gl-text-faint)', marginBottom:6 }}>No terms match</p>
              <p style={{ fontSize:12, color:'rgba(30,41,59,0.8)' }}>Try a different search or clear filters</p>
            </div>
          ) : (
            <div className="card-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12, alignItems:'start' }}>
              {displayed.map(term => (
                <TermCard key={term.id} term={term} highlight={query} onRelatedClick={handleRelatedClick}
                  learned={learned.has(term.id)} onToggleLearned={toggleLearned} flash={linkedId === term.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ Category showcase ══ */}
      {!hasFilter && (
        <>
          <div style={{ borderTop:'1px solid var(--gl-border)' }}/>
          <CategoryCards onSelect={setActiveCategory} active={activeCategory} />
        </>
      )}

      {/* ══ Stats ══ */}
      <section style={{ borderTop:'1px solid var(--gl-border)', padding:'48px 20px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          <p style={{ textAlign:'center', fontSize:9, fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(100,116,139,0.25)', marginBottom:20 }}>By the numbers</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
            {[
              { val:`${TERMS.length}`,                              label:'Terms',      color:catInk('#f59e0b'), icon:BookOpen },
              { val:`${TERMS.length}`,                              label:'Diagrams',   color:catInk('#34d399'), icon:Palette },
              { val:`${CATEGORIES.length}`,                         label:'Categories', color:'#60a5fa', icon:Tag },
              { val:`${TERMS.filter(t=>t.abbr).length}`,            label:'Abbrevs',    color:'#c084fc', icon:Type },
              { val:`${TERMS.filter(t=>t.example).length}`,         label:'Examples',   color:'#f472b6', icon:Lightbulb },
              { val:learnedCount > 0 ? `${learnedPct}%` : '0%',    label:'Learned',    color:catInk('#34d399'), icon:Check },
            ].map(s => {
              const Ic = s.icon
              return (
              <div key={s.label} className="stat-card" style={{ '--accent':s.color, borderRadius:16, padding:'18px 12px', textAlign:'center', background:'var(--gl-surface)', border:`1px solid ${s.color}18`, position:'relative', overflow:'hidden' } as React.CSSProperties}>
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 60% at 50% 0%,${s.color}0c,transparent 70%)`, pointerEvents:'none' }}/>
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ marginBottom:6, color:s.color, display:'flex', justifyContent:'center' }}><Ic size={18} strokeWidth={1.75} /></div>
                  <p style={{ fontWeight:900, fontSize:28, lineHeight:1, marginBottom:5, color:catInk(s.color), textShadow:`0 0 24px ${s.color}55` }}>{s.val}</p>
                  <p style={{ fontSize:9, color:'var(--gl-text-faint)', textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:700 }}>{s.label}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ ICT Flow strip ══ */}
      <section style={{ borderTop:'1px solid var(--gl-surface-2)', padding:'36px 20px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          <p style={{ textAlign:'center', fontSize:9, fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(100,116,139,0.25)', marginBottom:14 }}>ICT Trade Execution Flow</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:0 }}>
            {[
              { label:'HTF Bias',c:'#f472b6' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'DOL',     c:'#60a5fa' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'Session', c:'#fb923c' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'Judas',   c:'#f87171' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'MSS',     c:'#34d399' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'POI',     c:'#f59e0b' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'Entry',   c:'#c084fc' },{label:'→',c:'var(--gl-text-faint)'},
              { label:'Target',  c:'#14b8a6' },
            ].map((step,i) => (
              <span key={i} style={{ fontSize:step.label==='→'?14:11, fontWeight:step.label==='→'?400:900, color:catInk(step.c), padding:step.label==='→'?'0 4px':'6px 12px', borderRadius:step.label==='→'?0:9, background:step.label==='→'?'none':`${step.c}12`, border:step.label==='→'?'none':`1px solid ${step.c}25`, letterSpacing:'0.06em' }}>
                {step.label}
              </span>
            ))}
          </div>
          <p style={{ textAlign:'center', fontSize:11, color:'rgba(100,116,139,0.38)', marginTop:12, lineHeight:1.7 }}>
            Click <kbd style={{ padding:'2px 6px', borderRadius:4, background:'var(--gl-border)', border:'1px solid var(--gl-border)', fontSize:9 }}>/</kbd> and type any step above to explore it.
          </p>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer style={{ borderTop:'1px solid var(--gl-surface-2)', padding:'28px 20px 40px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1020, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)' }}>📖</div>
            <span style={{ fontSize:11, fontWeight:900, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gl-text-faint)' }}>ICT Glossary</span>
            <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(245,158,11,0.3)', display:'inline-block' }}/>
            <span style={{ fontSize:10, fontWeight:700, color:'var(--gl-text-faint)' }}>a Chronic Trading tool</span>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            {CATEGORIES.map(cat => (
              <span key={cat} style={{ fontSize:8, color:`${catInk(CATEGORY_COLORS[cat])}72`, fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase' }}>{cat.split(' ')[0]}</span>
            ))}
          </div>
          <p style={{ fontSize:10, color:'rgba(30,41,59,0.9)' }}>Educational reference only — not financial advice.</p>
        </div>
      </footer>
    </div>
  )
}
