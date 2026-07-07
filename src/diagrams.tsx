import React from 'react'

// ── Shared helpers ────────────────────────────────────────────────────────────
const BG   = '#08080f'
const GRID = 'rgba(255,255,255,0.04)'
const LINE = 'rgba(255,255,255,0.25)'
const TXT  = 'rgba(255,255,255,0.75)'
const DIM  = 'rgba(255,255,255,0.35)'

function Base({ children, h = 130 }: { children: React.ReactNode; h?: number }) {
  return (
    <svg viewBox={`0 0 260 ${h}`} width="100%" style={{ maxHeight: h + 10 }} aria-hidden>
      <rect width="260" height={h} fill={BG} rx="8" />
      {/* subtle grid */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="10" y1={h * p} x2="250" y2={h * p} stroke={GRID} />
      ))}
      {children}
    </svg>
  )
}

function Candle({ x, y, h, w = 10, bull, wickT = 4, wickB = 4 }: {
  x: number; y: number; h: number; w?: number; bull: boolean; wickT?: number; wickB?: number
}) {
  const color = bull ? '#34d399' : '#f87171'
  const cx = x + w / 2
  return (
    <g>
      <line x1={cx} y1={y - wickT} x2={cx} y2={y + h + wickB} stroke={color} strokeWidth="1" />
      <rect x={x} y={y} width={w} height={Math.max(h, 2)} fill={color} fillOpacity="0.85" rx="1" />
    </g>
  )
}

function Label({ x, y, text, color = TXT, size = 7.5, anchor = 'middle' }: {
  x: number; y: number; text: string; color?: string; size?: number; anchor?: string
}) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor as any} fontFamily="system-ui" fontWeight="700">{text}</text>
}

function Arrow({ x1, y1, x2, y2, color = '#f59e0b' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const ax = x2 - ux * 6, ay = y2 - uy * 6
  const px = -uy * 4, py = ux * 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  )
}

function Zone({ x, y, w, h, color, label }: { x: number; y: number; w: number; h: number; color: string; label?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.18" />
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={color} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,2" />
      {label && <Label x={x + w + 4} y={y + h / 2 + 2.5} text={label} color={color} anchor="start" size={7} />}
    </g>
  )
}

// ── Diagrams ──────────────────────────────────────────────────────────────────

export function MarketStructureDiagram() {
  const pts: [number, number][] = [[10,105],[45,68],[65,82],[110,35],[135,52],[180,18],[205,32]]
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  return (
    <Base>
      <path d={path} stroke="#34d399" strokeWidth="2" fill="none" />
      {[[45,68,'HH'],[110,35,'HH'],[180,18,'HH']].map(([x,y,l]) => (
        <g key={String(l)+x}><circle cx={x as number} cy={y as number} r="3" fill="#34d399" /><Label x={x as number} y={(y as number)-7} text={String(l)} color="#34d399" size={7}/></g>
      ))}
      {[[65,82,'HL'],[135,52,'HL']].map(([x,y,l]) => (
        <g key={String(l)+x}><circle cx={x as number} cy={y as number} r="3" fill="#60a5fa" /><Label x={x as number} y={(y as number)+12} text={String(l)} color="#60a5fa" size={7}/></g>
      ))}
      <Label x={130} y={122} text="Bullish Market Structure: HH + HL sequence" color={DIM} size={7}/>
    </Base>
  )
}

export function BreakOfStructureDiagram() {
  return (
    <Base>
      <polyline points="10,105 45,72 65,85 110,45" stroke={LINE} strokeWidth="1.5" fill="none" />
      <line x1="10" y1="72" x2="140" y2="72" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
      <polyline points="110,45 135,60 160,25" stroke="#34d399" strokeWidth="2" fill="none" />
      <circle cx={110} cy={45} r="3" fill="#34d399" />
      <Label x={145} y={68} text="Previous High" color="#f59e0b" size={7} anchor="start"/>
      <Arrow x1={155} y1={55} x2={165} y2={38} color="#34d399"/>
      <Label x={170} y={35} text="BOS ↑" color="#34d399" size={8} anchor="start"/>
      <Label x={130} y={122} text="Break of Structure: price clears previous high" color={DIM} size={7}/>
    </Base>
  )
}

export function ChangeOfCharacterDiagram() {
  return (
    <Base>
      <polyline points="10,105 40,70 60,82 100,40 130,55" stroke="#34d399" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="82" x2="200" y2="82" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <polyline points="130,55 160,75 185,62 215,90" stroke="#f87171" strokeWidth="2" fill="none"/>
      <circle cx={130} cy={55} r="3" fill="#f59e0b"/>
      <Label x={85} y={45} text="Bullish" color="#34d399" size={7}/>
      <Label x={82} y={78} text="Last HL" color="#f59e0b" size={7}/>
      <Label x={195} y={92} text="ChoCH" color="#f87171" size={8} anchor="start"/>
      <Label x={130} y={122} text="Price breaks last HL → Change of Character" color={DIM} size={7}/>
    </Base>
  )
}

export function FairValueGapDiagram() {
  return (
    <Base>
      <Candle x={60} y={80} h={35} bull={false} wickT={8} wickB={4}/>
      <Candle x={100} y={28} h={55} bull={true} wickT={4} wickB={5}/>
      <Candle x={140} y={45} h={30} bull={true} wickT={3} wickB={8}/>
      <Zone x={60} y={45} w={100} h={35} color="#60a5fa" label="FVG"/>
      <line x1={60} y1={80} x2={60} y2={80} stroke="#60a5fa" strokeWidth="0"/>
      <Label x={105} y={63} text="Gap" color="#60a5fa" size={8}/>
      <Label x={130} y={122} text="C3 low doesn't reach C1 high = FVG" color={DIM} size={7}/>
    </Base>
  )
}

export function OrderBlockDiagram() {
  return (
    <Base>
      <Candle x={30} y={72} h={28} bull={true} wickT={5} wickB={3}/>
      <Candle x={55} y={68} h={32} bull={true} wickT={4} wickB={4}/>
      <Candle x={80} y={75} h={22} bull={false} wickT={3} wickB={5}/>
      <Zone x={80} y={75} w={20} h={22} color="#c084fc" label="OB"/>
      <Candle x={115} y={22} h={52} bull={true} wickT={5} wickB={4}/>
      <Candle x={140} y={18} h={40} bull={true} wickT={4} wickB={3}/>
      <Arrow x1={50} y1={115} x2={88} y2={95} color="#c084fc"/>
      <Label x={30} y={122} text="Last bearish candle before displacement = Bullish OB" color={DIM} size={7}/>
    </Base>
  )
}

export function BreakerBlockDiagram() {
  return (
    <Base>
      <Candle x={20} y={55} h={30} bull={false} wickT={5} wickB={4}/>
      <Zone x={20} y={55} w={20} h={30} color="#c084fc"/>
      <Label x={20} y={50} text="Bearish OB" color="#c084fc" size={6.5}/>
      <Candle x={55} y={30} h={55} bull={false} wickT={5} wickB={8}/>
      <Candle x={80} y={70} h={35} bull={true} wickT={3} wickB={5}/>
      <Candle x={105} y={40} h={45} bull={true} wickT={4} wickB={4}/>
      <line x1={20} y1={55} x2={200} y2={55} stroke="#f87171" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={160} y={52} text="Breaker" color="#f87171" size={7}/>
      <Label x={130} y={122} text="Violated OB becomes Breaker Block (resistance)" color={DIM} size={7}/>
    </Base>
  )
}

export function LiquiditySweepDiagram() {
  return (
    <Base>
      <line x1="20" y1="45" x2="240" y2="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={22} y={40} text="Buy Stops (BSL)" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={30} y={55} h={25} bull={true} wickT={20} wickB={3}/>
      <Candle x={55} y={60} h={20} bull={true} wickT={5} wickB={3}/>
      <Candle x={80} y={55} h={25} bull={true} wickT={3} wickB={4}/>
      <Candle x={110} y={25} h={60} bull={false} wickT={22} wickB={5}/>
      <Label x={118} y={18} text="Sweep!" color="#f87171" size={8} anchor="start"/>
      <Candle x={140} y={40} h={50} bull={false} wickT={4} wickB={4}/>
      <Candle x={165} y={65} h={35} bull={false} wickT={3} wickB={5}/>
      <Label x={130} y={122} text="Wick takes stops above level → sharp reversal" color={DIM} size={7}/>
    </Base>
  )
}

export function EqualHighsDiagram() {
  return (
    <Base>
      <polyline points="20,100 50,55 70,75 100,55 120,70 150,55 170,72" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="55" x2="220" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx={50} cy={55} r="3" fill="#f59e0b"/>
      <circle cx={100} cy={55} r="3" fill="#f59e0b"/>
      <circle cx={150} cy={55} r="3" fill="#f59e0b"/>
      <Label x={200} y={52} text="EQH" color="#f59e0b" size={8}/>
      <rect x={20} y={45} width={200} height={10} fill="#f59e0b" fillOpacity="0.08"/>
      <Label x={115} y={30} text="Buy Stops Pool" color="#f59e0b" size={7.5}/>
      <Arrow x1={115} y1={35} x2={115} y2={48} color="#f59e0b"/>
      <Label x={130} y={122} text="Equal highs = pooled buy stops above" color={DIM} size={7}/>
    </Base>
  )
}

export function EqualLowsDiagram() {
  return (
    <Base>
      <polyline points="20,30 50,75 70,55 100,75 120,60 150,75 170,58" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="75" x2="220" y2="75" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx={50} cy={75} r="3" fill="#60a5fa"/>
      <circle cx={100} cy={75} r="3" fill="#60a5fa"/>
      <circle cx={150} cy={75} r="3" fill="#60a5fa"/>
      <Label x={200} y={72} text="EQL" color="#60a5fa" size={8}/>
      <rect x={20} y={75} width={200} height={10} fill="#60a5fa" fillOpacity="0.08"/>
      <Label x={115} y={100} text="Sell Stops Pool" color="#60a5fa" size={7.5}/>
      <Arrow x1={115} y1={96} x2={115} y2={83} color="#60a5fa"/>
      <Label x={130} y={122} text="Equal lows = pooled sell stops below" color={DIM} size={7}/>
    </Base>
  )
}

export function AMDCycleDiagram() {
  const sections = [
    { x: 15, label: 'A', name: 'Accumulation', color: '#60a5fa' },
    { x: 90, label: 'M', name: 'Manipulation', color: '#f87171' },
    { x: 165, label: 'D', name: 'Distribution', color: '#34d399' },
  ]
  return (
    <Base>
      {sections.map(s => (
        <g key={s.label}>
          <rect x={s.x} y={20} width={68} height={80} fill={s.color} fillOpacity="0.07" rx="4"/>
          <rect x={s.x} y={20} width={68} height={80} fill="none" stroke={s.color} strokeOpacity="0.3" rx="4"/>
          <text x={s.x + 34} y={62} fill={s.color} fontSize={22} textAnchor="middle" fontFamily="system-ui" fontWeight="900" opacity="0.5">{s.label}</text>
          <Label x={s.x + 34} y={82} text={s.name} color={s.color} size={7}/>
        </g>
      ))}
      <polyline points="25,70 55,75 70,72 83,73" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <polyline points="98,68 110,55 120,80 135,40 148,65" stroke="#f87171" strokeWidth="1.5" fill="none"/>
      <polyline points="173,65 188,40 205,30 220,18 228,22" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Label x={130} y={122} text="Accumulate → Manipulate (Judas) → Distribute (real move)" color={DIM} size={7}/>
    </Base>
  )
}

export function PowerOfThreeDiagram() {
  return (
    <Base>
      <rect x={15} y={40} width={55} height={65} fill="#60a5fa" fillOpacity="0.07" rx="4"/>
      <rect x={80} y={25} width={55} height={80} fill="#f87171" fillOpacity="0.07" rx="4"/>
      <rect x={145} y={15} width={55} height={90} fill="#34d399" fillOpacity="0.07" rx="4"/>
      <Label x={42} y={85} text="A" color="#60a5fa" size={20}/>
      <Label x={42} y={100} text="Range" color="#60a5fa" size={7}/>
      <Label x={107} y={72} text="B" color="#f87171" size={20}/>
      <Label x={103} y={87} text="Judas" color="#f87171" size={7}/>
      <polyline points="20,85 45,80 60,88 73,83" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <polyline points="88,60 100,45 110,70 122,35 133,55" stroke="#f87171" strokeWidth="1.5" fill="none"/>
      <polyline points="153,55 165,35 180,22 200,14 215,18" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Label x={172} y={80} text="C" color="#34d399" size={20}/>
      <Label x={166} y={95} text="True Move" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Asia consolidates → London manipulates → NY distributes" color={DIM} size={6.5}/>
    </Base>
  )
}

export function PremiumDiscountDiagram() {
  return (
    <Base>
      <rect x={30} y={15} width={200} height={50} fill="#f87171" fillOpacity="0.07"/>
      <rect x={30} y={65} width={200} height={50} fill="#34d399" fillOpacity="0.07"/>
      <line x1="30" y1="15" x2="230" y2="15" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="30" y1="65" x2="230" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="30" y1="115" x2="230" y2="115" stroke="#34d399" strokeWidth="1.5"/>
      <Label x={35} y={11} text="Swing High / Premium Top" color="#f87171" size={7} anchor="start"/>
      <Label x={35} y={62} text="50% Equilibrium" color="#f59e0b" size={7} anchor="start"/>
      <Label x={35} y={127} text="Swing Low / Discount Bottom" color="#34d399" size={7} anchor="start"/>
      <Label x={220} y={45} text="SELL" color="#f87171" size={9} anchor="end"/>
      <Label x={220} y={95} text="BUY" color="#34d399" size={9} anchor="end"/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}

export function OTEDiagram() {
  return (
    <Base>
      <polyline points="20,100 80,20" stroke="#34d399" strokeWidth="2" fill="none"/>
      <line x1="20" y1="100" x2="240" y2="100" stroke={LINE} strokeWidth="1"/>
      <line x1="20" y1="20" x2="240" y2="20" stroke={LINE} strokeWidth="1"/>
      {[
        {pct:0.5,  label:'50% EQ',     color:'#f59e0b', y:60},
        {pct:0.618,label:'61.8% OTE',  color:'#34d399', y:69.4},
        {pct:0.705,label:'70.5%',      color:'#34d399', y:76.4},
        {pct:0.79, label:'79% Deep',   color:'#60a5fa', y:83.2},
      ].map(f => (
        <g key={f.label}>
          <line x1="80" y1={f.y} x2="240" y2={f.y} stroke={f.color} strokeWidth="0.8" strokeDasharray="4,3"/>
          <Label x={195} y={f.y - 2} text={f.label} color={f.color} size={6.5} anchor="start"/>
        </g>
      ))}
      <Zone x={80} y={69} w={80} h={15} color="#34d399" label="OTE Zone"/>
      <Label x={130} y={122} text="OTE = 61.8%–79% retracement of displacement" color={DIM} size={7}/>
    </Base>
  )
}

export function KillZonesDiagram() {
  const zones = [
    { x:15,  w:40, label:'Asia',  sub:'7PM–11PM', color:'#c084fc' },
    { x:65,  w:40, label:'London',sub:'2AM–5AM',  color:'#60a5fa' },
    { x:115, w:55, label:'NY AM', sub:'8:30–11AM',color:'#f59e0b' },
    { x:180, w:30, label:'NY PM', sub:'1:30–4PM', color:'#34d399' },
  ]
  return (
    <Base h={110}>
      <line x1="10" y1="60" x2="250" y2="60" stroke={LINE} strokeWidth="1"/>
      {zones.map(z => (
        <g key={z.label}>
          <rect x={z.x} y={40} width={z.w} height={40} fill={z.color} fillOpacity="0.15" rx="3"/>
          <rect x={z.x} y={40} width={z.w} height={40} fill="none" stroke={z.color} strokeOpacity="0.4" rx="3"/>
          <Label x={z.x + z.w/2} y={56} text={z.label} color={z.color} size={7}/>
          <Label x={z.x + z.w/2} y={68} text={z.sub} color={z.color} size={6} />
        </g>
      ))}
      <Label x={130} y={100} text="Highest probability setups occur within kill zones" color={DIM} size={7}/>
    </Base>
  )
}

export function DisplacementDiagram() {
  return (
    <Base>
      <Candle x={20}  y={75} h={22} bull={true}  wickT={3} wickB={3}/>
      <Candle x={40}  y={70} h={25} bull={false} wickT={4} wickB={3}/>
      <Candle x={60}  y={72} h={20} bull={true}  wickT={3} wickB={4}/>
      <Candle x={80}  y={68} h={24} bull={false} wickT={5} wickB={3}/>
      <Candle x={110} y={18} h={70} bull={true}  wickT={4} wickB={5}/>
      <Zone x={80} y={42} w={44} h={26} color="#60a5fa" label="FVG"/>
      <Label x={125} y={14} text="Displacement!" color="#34d399" size={8} anchor="start"/>
      <Candle x={155} y={38} h={30} bull={true}  wickT={4} wickB={4}/>
      <Candle x={180} y={32} h={25} bull={true}  wickT={3} wickB={4}/>
      <Label x={130} y={122} text="Impulsive move leaving FVG = institutional displacement" color={DIM} size={7}/>
    </Base>
  )
}

export function InducementDiagram() {
  return (
    <Base>
      <polyline points="20,90 60,40 90,60" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={60} cy={40} r="3" fill="#f59e0b"/>
      <Label x={60} y={34} text="Inducement" color="#f59e0b" size={7}/>
      <Label x={60} y={25} text="(Minor High)" color="#f59e0b" size={6.5}/>
      <polyline points="90,60 110,50 125,70" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={110} cy={50} r="3" fill="#f87171"/>
      <Label x={112} y={45} text="Sweep" color="#f87171" size={7} anchor="start"/>
      <polyline points="125,70 150,80 185,100 220,112" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={160} y={95} text="Real Move ↓" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Minor high baits retail longs → swept → real move" color={DIM} size={7}/>
    </Base>
  )
}

export function JudasSwingDiagram() {
  return (
    <Base>
      <line x1="30" y1="70" x2="230" y2="70" stroke={LINE} strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={32} y={66} text="Previous Low" color={DIM} size={7} anchor="start"/>
      <polyline points="30,70 60,85 80,100 95,110" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={70} y={118} text="Judas drop" color="#f87171" size={7}/>
      <circle cx={95} cy={110} r="3" fill="#f87171"/>
      <polyline points="95,110 115,90 140,65 170,40 210,20" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={175} y={30} text="True direction ↑" color="#34d399" size={8}/>
      <Label x={130} y={122} text="False open drops → stops swept → real bull move" color={DIM} size={7}/>
    </Base>
  )
}

export function MSSDiagram() {
  return (
    <Base>
      <polyline points="20,100 50,65 70,78 110,42 130,55 160,30" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="78" x2="240" y2="78" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={22} y={74} text="Last HL" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="160,30 185,50 210,85" stroke="#f87171" strokeWidth="2.5" fill="none"/>
      <circle cx={210} cy={85} r="4" fill="#f87171"/>
      <Label x={175} y={95} text="MSS" color="#f87171" size={9}/>
      <Label x={130} y={122} text="Displacement breaks last HL = Market Structure Shift" color={DIM} size={7}/>
    </Base>
  )
}

export function DrawOnLiquidityDiagram() {
  return (
    <Base>
      <polyline points="30,90 60,75 80,82 110,65 130,72" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="25" x2="240" y2="25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={22} y={21} text="DOL: Equal Highs / BSL" color="#f59e0b" size={7} anchor="start"/>
      <Arrow x1={130} y1={65} x2={200} y2={28} color="#f59e0b"/>
      <polyline points="130,72 155,55 175,40 200,28" stroke="#34d399" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
      <Label x={170} y={50} text="Price drawn↑" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Price is always moving toward the next liquidity pool" color={DIM} size={7}/>
    </Base>
  )
}

export function SMTDivergenceDiagram() {
  return (
    <Base>
      <Label x={50} y={18} text="ES" color="#34d399" size={8}/>
      <Label x={50} y={75} text="NQ" color="#60a5fa" size={8}/>
      <polyline points="30,40 70,22 100,30 140,15 170,20" stroke="#34d399" strokeWidth="2" fill="none"/>
      <circle cx={140} cy={15} r="3" fill="#34d399"/>
      <Label x={142} y={12} text="New High" color="#34d399" size={6.5} anchor="start"/>
      <polyline points="30,85 70,70 100,75 140,68 170,72" stroke="#60a5fa" strokeWidth="2" fill="none"/>
      <circle cx={140} cy={68} r="3" fill="#60a5fa"/>
      <Label x={142} y={65} text="Lower High ←" color="#f87171" size={6.5} anchor="start"/>
      <line x1="140" y1="15" x2="140" y2="68" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2"/>
      <Label x={148} y={44} text="SMT" color="#f87171" size={8}/>
      <Label x={130} y={122} text="ES new high + NQ lower high = bearish divergence" color={DIM} size={7}/>
    </Base>
  )
}

export function MitigationBlockDiagram() {
  return (
    <Base>
      <Candle x={30} y={70} h={30} bull={false} wickT={5} wickB={4}/>
      <Zone x={30} y={70} w={20} h={30} color="#c084fc" label="Bearish OB"/>
      <Candle x={60} y={45} h={50} bull={false} wickT={5} wickB={5}/>
      <Candle x={85} y={70} h={30} bull={true}  wickT={4} wickB={4}/>
      <Candle x={110} y={50} h={35} bull={true}  wickT={3} wickB={5}/>
      <Candle x={135} y={65} h={25} bull={false} wickT={4} wickB={3}/>
      <Label x={155} y={75} text="Return to OB" color="#c084fc" size={7} anchor="start"/>
      <Arrow x1={155} y1={75} x2={145} y2={75} color="#c084fc"/>
      <Label x={130} y={122} text="Price returns to OB, partially fills orders, continues" color={DIM} size={7}/>
    </Base>
  )
}

export function VolumeImbalanceDiagram() {
  return (
    <Base>
      <Candle x={60}  y={65} h={40} bull={true} wickT={4} wickB={4}/>
      <Candle x={85}  y={40} h={45} bull={true} wickT={3} wickB={3}/>
      <line x1="70" y1="65" x2="240" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="95" y1="85" x2="240" y2="85" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Zone x={95} y={65} w={70} h={20} color="#f59e0b" label="Vol. Imbalance"/>
      <Label x={130} y={122} text="Open/close gap between adjacent candles = imbalance" color={DIM} size={7}/>
    </Base>
  )
}

export function BPRDiagram() {
  return (
    <Base>
      <Zone x={50} y={30} w={160} h={30} color="#34d399" label="Bullish FVG"/>
      <Zone x={50} y={50} w={160} h={30} color="#f87171" label="Bearish FVG"/>
      <Zone x={50} y={50} w={160} h={10} color="#f59e0b"/>
      <Label x={130} y={55} text="BPR" color="#f59e0b" size={9}/>
      <Label x={130} y={22} text="Bullish FVG" color="#34d399" size={7}/>
      <Label x={130} y={92} text="Bearish FVG" color="#f87171" size={7}/>
      <Label x={130} y={105} text="Overlap = Balanced Price Range" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="Two opposing FVGs overlapping = high-reaction zone" color={DIM} size={7}/>
    </Base>
  )
}

export function NWOGDiagram() {
  return (
    <Base>
      <Label x={60} y={14} text="Friday Close" color={DIM} size={7}/>
      <Label x={165} y={14} text="Sunday Open" color={DIM} size={7}/>
      <line x1="20" y1="45" x2="110" y2="45" stroke={LINE} strokeWidth="1.5"/>
      <line x1="145" y1="65" x2="240" y2="65" stroke={LINE} strokeWidth="1.5"/>
      <circle cx={110} cy={45} r="3" fill="#f59e0b"/>
      <circle cx={145} cy={65} r="3" fill="#60a5fa"/>
      <Zone x={110} y={45} w={35} h={20} color="#f59e0b" label="Gap"/>
      <polyline points="145,65 165,55 185,48 210,40" stroke="#34d399" strokeWidth="2" strokeDasharray="5,3" fill="none"/>
      <Label x={185} y={35} text="Gap fills" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Price commonly returns to fill NWOG during the week" color={DIM} size={7}/>
    </Base>
  )
}

export function MacroDiagram() {
  const macros = [
    { x:20,  w:30, label:'8:50', color:'#f59e0b' },
    { x:70,  w:30, label:'9:50', color:'#f59e0b' },
    { x:120, w:30, label:'10:50',color:'#f59e0b' },
    { x:165, w:28, label:'1:10', color:'#60a5fa' },
    { x:203, w:28, label:'2:10', color:'#60a5fa' },
  ]
  return (
    <Base h={100}>
      <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
      {macros.map(m => (
        <g key={m.label}>
          <rect x={m.x} y={35} width={m.w} height={40} fill={m.color} fillOpacity="0.15" rx="3"/>
          <Label x={m.x + m.w/2} y={50} text={m.label} color={m.color} size={6.5}/>
          <Label x={m.x + m.w/2} y={62} text="AM" color={m.color} size={5.5}/>
        </g>
      ))}
      <Label x={130} y={90} text="20-min windows of highest algo predictability" color={DIM} size={7}/>
    </Base>
  )
}

export function DailyBiasDiagram() {
  return (
    <Base>
      <Label x={35} y={15} text="Bullish Day" color="#34d399" size={8}/>
      <rect x={15} y={20} width={55} height={90} fill="#34d399" fillOpacity="0.05" rx="4"/>
      <polyline points="25,100 35,92 42,95 50,70 55,65 65,40 70,35" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={20} y={108} text="Asia" color={DIM} size={6}/>
      <Label x={38} y={108} text="London" color={DIM} size={6}/>
      <Label x={58} y={108} text="NY" color={DIM} size={6}/>
      <Label x={155} y={15} text="Bearish Day" color="#f87171" size={8}/>
      <rect x={135} y={20} width={55} height={90} fill="#f87171" fillOpacity="0.05" rx="4"/>
      <polyline points="145,40 150,45 160,65 165,70 175,90 180,95" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={140} y={108} text="Asia" color={DIM} size={6}/>
      <Label x={158} y={108} text="London" color={DIM} size={6}/>
      <Label x={178} y={108} text="NY" color={DIM} size={6}/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}

export function LiquidityRunDiagram() {
  return (
    <Base>
      {[[50,48],[110,28],[170,14]].map(([x,y]) => (
        <g key={x}>
          <line x1={x} y1={y as number} x2={x+60} y2={y as number} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
          <Label x={x+2} y={(y as number)-4} text="BSL" color="#f59e0b" size={6.5} anchor="start"/>
        </g>
      ))}
      <polyline points="20,95 40,85 55,55 75,70 90,42 115,35 135,48 155,22 180,18 210,10" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Price systematically sweeps each liquidity level" color={DIM} size={7}/>
    </Base>
  )
}

export function IRL_ERL_Diagram() {
  return (
    <Base>
      <line x1="30" y1="25" x2="230" y2="25" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="30" y1="105" x2="230" y2="105" stroke="#34d399" strokeWidth="1.5"/>
      <rect x={30} y={25} width={200} height={80} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={32} y={21} text="External Resistance (ERL)" color="#f87171" size={7} anchor="start"/>
      <Label x={32} y={118} text="External Support (ERL)" color="#34d399" size={7} anchor="start"/>
      <line x1="70" y1="55" x2="200" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="70" y1="75" x2="200" y2="75" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
      <Zone x={70} y={55} w={130} h={20} color="#f59e0b" label="IRL Zone"/>
      <Label x={100} y={68} text="Internal Liquidity" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="IRL: within range. ERL: beyond swing highs/lows." color={DIM} size={7}/>
    </Base>
  )
}

export function MarketMakerBuyDiagram() {
  return (
    <Base>
      <Label x={30} y={12} text="1. Consolidation" color="#60a5fa" size={7}/>
      <rect x={15} y={15} width={55} height={95} fill="#60a5fa" fillOpacity="0.05" rx="3"/>
      <polyline points="20,80 30,75 35,85 45,72 55,80 62,70 67,78" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <Label x={95} y={12} text="2. Judas Drop" color="#f87171" size={7}/>
      <rect x={78} y={15} width={50} height={95} fill="#f87171" fillOpacity="0.05" rx="3"/>
      <polyline points="80,60 90,75 100,90 105,105" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={165} y={12} text="3. True Rally" color="#34d399" size={7}/>
      <rect x={148} y={15} width={70} height={95} fill="#34d399" fillOpacity="0.05" rx="3"/>
      <polyline points="152,100 162,80 175,60 190,40 205,25 215,18" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={130} y={122} text="Consolidate → False Drop (sweep SSL) → Real Rally" color={DIM} size={7}/>
    </Base>
  )
}

export function MarketMakerSellDiagram() {
  return (
    <Base>
      <Label x={30} y={12} text="1. Consolidation" color="#60a5fa" size={7}/>
      <rect x={15} y={15} width={55} height={95} fill="#60a5fa" fillOpacity="0.05" rx="3"/>
      <polyline points="20,60 30,65 35,55 45,68 55,55 62,65 67,58" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <Label x={95} y={12} text="2. Judas Rally" color="#f59e0b" size={7}/>
      <rect x={78} y={15} width={50} height={95} fill="#f59e0b" fillOpacity="0.05" rx="3"/>
      <polyline points="80,80 90,65 100,45 105,28" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <Label x={165} y={12} text="3. True Drop" color="#f87171" size={7}/>
      <rect x={148} y={15} width={70} height={95} fill="#f87171" fillOpacity="0.05" rx="3"/>
      <polyline points="152,25 162,40 175,60 190,78 205,95 215,108" stroke="#f87171" strokeWidth="2.5" fill="none"/>
      <Label x={130} y={122} text="Consolidate → False Rally (sweep BSL) → Real Drop" color={DIM} size={7}/>
    </Base>
  )
}

export function TurtleSoupDiagram() {
  return (
    <Base>
      <line x1="20" y1="35" x2="240" y2="35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={22} y={31} text="20-Day Low" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="20,60 50,55 75,48 95,52 110,44 125,38" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <Candle x={125} y={18} h={38} bull={false} wickT={20} wickB={4}/>
      <Label x={140} y={12} text="False Break" color="#f87171" size={7}/>
      <Candle x={150} y={30} h={40} bull={true}  wickT={3} wickB={3}/>
      <Candle x={175} y={22} h={30} bull={true}  wickT={3} wickB={4}/>
      <Candle x={200} y={15} h={25} bull={true}  wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Break of 20-day low triggers stops → sharp reversal up" color={DIM} size={7}/>
    </Base>
  )
}

export function CBDRDiagram() {
  return (
    <Base h={110}>
      <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
      <rect x={95} y={25} width={80} height={60} fill="#c084fc" fillOpacity="0.1" rx="4"/>
      <rect x={95} y={25} width={80} height={60} fill="none" stroke="#c084fc" strokeOpacity="0.4" rx="4"/>
      <Label x={135} y={42} text="CBDR" color="#c084fc" size={9}/>
      <Label x={135} y={54} text="2AM – 5AM EST" color="#c084fc" size={7}/>
      <Label x={135} y={65} text="Pre-NY Range" color="#c084fc" size={6.5}/>
      <line x1="95" y1="25" x2="95" y2="85" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="175" y1="25" x2="175" y2="85" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.6"/>
      <Label x={30} y={52} text="Asia" color={DIM} size={7}/>
      <Label x={210} y={52} text="NY" color={DIM} size={7}/>
      <Label x={130} y={100} text="Range before NY open — potential manipulation zone" color={DIM} size={7}/>
    </Base>
  )
}

export function RetraCementDiagram() {
  return (
    <Base>
      <polyline points="20,100 80,30" stroke="#34d399" strokeWidth="2" fill="none"/>
      <polyline points="80,30 130,60" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
      <polyline points="130,60 210,15" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={100} y={28} text="Impulse" color="#34d399" size={7}/>
      <Label x={115} y={70} text="Retracement" color="#f59e0b" size={7}/>
      <Label x={185} y={22} text="Continuation" color="#34d399" size={7}/>
      <Zone x={105} y={45} w={50} h={20} color="#f59e0b" label="OTE Zone"/>
      <circle cx={80} cy={30} r="3" fill="#34d399"/>
      <circle cx={130} cy={60} r="3" fill="#f59e0b"/>
      <Label x={130} y={122} text="Price pulls back into OTE zone before continuing" color={DIM} size={7}/>
    </Base>
  )
}

export function FlipDiagram() {
  return (
    <Base>
      <line x1="20" y1="55" x2="240" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <polyline points="20,90 50,80 70,60 90,45 110,30" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={70} y={50} text="Support" color="#34d399" size={7}/>
      <Candle x={110} y={18} h={50} bull={false} wickT={4} wickB={4}/>
      <Candle x={135} y={40} h={40} bull={false} wickT={4} wickB={4}/>
      <polyline points="155,55 170,65 190,75 220,85" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={185} y={72} text="Resistance" color="#f87171" size={7}/>
      <Label x={130} y={122} text="Previous support breaks → becomes resistance (flip)" color={DIM} size={7}/>
    </Base>
  )
}

export function OrderFlowDiagram() {
  return (
    <Base>
      {[
        { y:25,  label:'Institutional Buy Orders',  color:'#34d399', bull:true  },
        { y:60,  label:'Retail Sell Orders',        color:'#f87171', bull:false },
        { y:95,  label:'Institutional Sell Orders', color:'#f87171', bull:false },
      ].map((row, i) => (
        <g key={i}>
          <rect x={15} y={row.y} width={230} height={25} fill={row.color} fillOpacity="0.07" rx="3"/>
          <Label x={20} y={row.y + 16} text={row.label} color={row.color} size={7.5} anchor="start"/>
          <rect x={200} y={row.y + 6} width={35} height={12} fill={row.color} fillOpacity="0.3" rx="2"/>
          <Label x={217} y={row.y + 16} text={i === 1 ? 'SMALL' : 'LARGE'} color={row.color} size={6.5}/>
        </g>
      ))}
      <Label x={130} y={122} text="Institutions dominate flow — retail orders are absorbed" color={DIM} size={7}/>
    </Base>
  )
}

export function ConsequentEncroachmentDiagram() {
  return (
    <Base>
      <Zone x={50} y={35} w={160} h={55} color="#60a5fa" label="FVG"/>
      <line x1="50" y1="62" x2="210" y2="62" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={52} y={58} text="CE — 50% of FVG" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={75} y={30} h={28} bull={false} wickT={5} wickB={4}/>
      <Candle x={100} y={38} h={20} bull={true} wickT={3} wickB={3}/>
      <Arrow x1={145} y1={95} x2={135} y2={65} color="#f59e0b"/>
      <Label x={150} y={100} text="Target CE first" color="#f59e0b" size={7} anchor="start"/>
      <Label x={130} y={122} text="Midpoint of FVG = primary entry target (CE)" color={DIM} size={7}/>
    </Base>
  )
}

// ── Timeline helper (session diagrams) ───────────────────────────────────────
function TL({ s, e, color, label, sub }: { s:number; e:number; color:string; label:string; sub:string }) {
  const tx = (h:number) => 15 + (h/24)*230
  return (
    <Base h={100}>
      <rect x="15" y="32" width="230" height="26" fill="rgba(255,255,255,0.04)" rx="3"/>
      <rect x={tx(s)} y="32" width={tx(e)-tx(s)} height="26" fill={color} fillOpacity="0.25" rx="2"/>
      <rect x={tx(s)} y="32" width={tx(e)-tx(s)} height="26" fill="none" stroke={color} strokeOpacity="0.6" rx="2"/>
      {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1={58} x2={tx(h)} y2={63} stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={71} text={`${h}h`} color={DIM} size={6}/></g>)}
      <Label x={(tx(s)+tx(e))/2} y={43} text={label} color={color} size={7.5}/>
      <Label x={(tx(s)+tx(e))/2} y={53} text={sub} color={color} size={6}/>
      <Label x={130} y={88} text="Highest probability within highlighted window (EST)" color={DIM} size={6.5}/>
    </Base>
  )
}

// ── Market Structure ──────────────────────────────────────────────────────────
export function SwingHighDiagram() {
  return (
    <Base>
      <Candle x={20} y={80} h={22} bull={true}  wickT={5} wickB={4}/>
      <Candle x={48} y={62} h={25} bull={true}  wickT={5} wickB={4}/>
      <Candle x={76} y={28} h={30} bull={true}  wickT={7} wickB={5}/>
      <Candle x={104} y={60} h={22} bull={false} wickT={4} wickB={5}/>
      <Candle x={132} y={78} h={20} bull={false} wickT={3} wickB={4}/>
      <line x1="10" y1="28" x2="220" y2="28" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3"/>
      <circle cx={81} cy={28} r="3" fill="#34d399"/>
      <Label x={155} y={24} text="SWING HIGH" color="#34d399" size={7.5}/>
      <Label x={130} y={115} text="Middle candle high exceeds 2 on each side" color={DIM} size={7}/>
    </Base>
  )
}
export function SwingLowDiagram() {
  return (
    <Base>
      <Candle x={20} y={22} h={22} bull={false} wickT={4} wickB={5}/>
      <Candle x={48} y={38} h={25} bull={false} wickT={4} wickB={5}/>
      <Candle x={76} y={72} h={28} bull={false} wickT={4} wickB={8}/>
      <Candle x={104} y={40} h={22} bull={true}  wickT={5} wickB={4}/>
      <Candle x={132} y={24} h={20} bull={true}  wickT={3} wickB={4}/>
      <line x1="10" y1="108" x2="220" y2="108" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3"/>
      <circle cx={81} cy={108} r="3" fill="#60a5fa"/>
      <Label x={155} y={118} text="SWING LOW" color="#60a5fa" size={7.5}/>
      <Label x={130} y={122} text="Middle candle low is lower than 2 on each side" color={DIM} size={7}/>
    </Base>
  )
}
export function RelativeEqualHighsDiagram() {
  return (
    <Base>
      <polyline points="15,100 45,58 65,72 95,53 115,68 145,50 165,65" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={45} cy={58} r="3" fill="#f59e0b"/>
      <circle cx={95} cy={53} r="3" fill="#f59e0b"/>
      <circle cx={145} cy={50} r="3" fill="#f59e0b"/>
      <Zone x={15} y={45} w={170} h={18} color="#f59e0b" label="REH Zone"/>
      <Label x={90} y={36} text="Near-equal highs — not perfect" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="Stops still accumulate above REH zone" color={DIM} size={7}/>
    </Base>
  )
}
export function RelativeEqualLowsDiagram() {
  return (
    <Base>
      <polyline points="15,25 45,68 65,55 95,72 115,58 145,75 165,60" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={45} cy={68} r="3" fill="#60a5fa"/>
      <circle cx={95} cy={72} r="3" fill="#60a5fa"/>
      <circle cx={145} cy={75} r="3" fill="#60a5fa"/>
      <Zone x={15} y={62} w={170} h={18} color="#60a5fa" label="REL Zone"/>
      <Label x={90} y={98} text="Near-equal lows — soft SSL zone" color="#60a5fa" size={7}/>
      <Label x={130} y={122} text="Stops pool below REL zone even without exact match" color={DIM} size={7}/>
    </Base>
  )
}
export function PriceLegDiagram() {
  return (
    <Base>
      <circle cx={35} cy={100} r="4" fill="#60a5fa"/>
      <Label x={35} y={115} text="Swing Low" color="#60a5fa" size={7}/>
      <circle cx={200} cy={25} r="4" fill="#34d399"/>
      <Label x={200} y={18} text="Swing High" color="#34d399" size={7}/>
      <line x1="35" y1="100" x2="200" y2="25" stroke="#f59e0b" strokeWidth="2"/>
      <Label x={115} y={55} text="Price Leg" color="#f59e0b" size={9}/>
      <Label x={115} y={68} text="(apply Fibonacci here)" color={DIM} size={7}/>
      <polyline points="35,100 90,100 90,25 200,25" stroke={DIM} strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
      <Label x={130} y={122} text="Single directional move — anchor Fibonacci to SL → SH" color={DIM} size={7}/>
    </Base>
  )
}
export function AnchorPointDiagram() {
  return (
    <Base>
      <Candle x={40} y={80} h={50} bull={true} wickT={4} wickB={4}/>
      <Label x={45} y={76} text="Anchor" color="#f59e0b" size={7} anchor="start"/>
      <Arrow x1={55} y1={76} x2={55} y2={84} color="#f59e0b"/>
      {[[50,'50% EQ','#f59e0b'],[61,'61.8% OTE','#34d399'],[79,'79%','#60a5fa']].map(([pct,lbl,clr])=>{
        const y = 80 + (Number(pct)/100)*50
        return <g key={String(pct)}><line x1="60" y1={y} x2="230" y2={y} stroke={String(clr)} strokeWidth="1" strokeDasharray="4,3"/><Label x={190} y={y-2} text={String(lbl)} color={String(clr)} size={6.5}/></g>
      })}
      <Label x={130} y={122} text="Anchor at displacement swing to get valid OTE levels" color={DIM} size={7}/>
    </Base>
  )
}
export function PriceDiscoveryDiagram() {
  return (
    <Base>
      <line x1="15" y1="55" x2="240" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={51} text="Prior ATH — last known reference" color="#f59e0b" size={7} anchor="start"/>
      <Zone x={15} y={15} w={225} h={40} color="#34d399" label=""/>
      <Label x={130} y={35} text="NEW TERRITORY — no orders" color="#34d399" size={8}/>
      <polyline points="20,90 55,80 80,70 105,60 130,45 165,30 200,20" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={130} y={122} text="LRLR: accelerates above ATH with no opposing liquidity" color={DIM} size={7}/>
    </Base>
  )
}
export function FailureSwingDiagram() {
  return (
    <Base>
      <polyline points="15,100 50,45 75,65 110,35" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <circle cx={50} cy={45} r="3" fill="#34d399"/>
      <Label x={50} y={39} text="HH₁" color="#34d399" size={7}/>
      <circle cx={110} cy={35} r="3" fill="#34d399"/>
      <Label x={110} y={29} text="HH₁" color="#34d399" size={7}/>
      <polyline points="110,35 135,55 160,42" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="5,3"/>
      <circle cx={160} cy={42} r="3" fill="#f87171"/>
      <Label x={162} y={38} text="Failure" color="#f87171" size={7} anchor="start"/>
      <Label x={162} y={48} text="(lower high!)" color="#f87171" size={6.5} anchor="start"/>
      <polyline points="160,42 185,70 210,98" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Second peak fails to exceed first = early reversal warning" color={DIM} size={7}/>
    </Base>
  )
}
export function FractalDiagram() {
  const highs = [85,65,28,62,82]
  const xs    = [25,55,90,125,155]
  return (
    <Base>
      {xs.map((x,i)=><Candle key={i} x={x-5} y={highs[i]} h={20} bull={i===2} wickT={5} wickB={4}/>)}
      <circle cx={95} cy={28} r="4" fill="#34d399"/>
      <line x1="15" y1="28" x2="220" y2="28" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={130} y={22} text="← FRACTAL HIGH →" color="#34d399" size={7.5}/>
      <Label x={95} y={16} text="▼" color="#34d399" size={8}/>
      <Label x={130} y={122} text="5-candle pattern: middle candle has highest high" color={DIM} size={7}/>
    </Base>
  )
}
export function MSBDiagram() {
  return (
    <Base>
      <polyline points="15,100 45,70 65,80 100,45 120,58" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="15" y1="80" x2="230" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={17} y={76} text="Key Swing Low" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={125} y={45} h={55} bull={false} wickT={4} wickB={6}/>
      <Zone x={125} y={80} w={12} h={10} color="#f87171" label="Gap"/>
      <Label x={148} y={115} text="MSB — gap at the break" color="#f87171" size={7} anchor="start"/>
      <polyline points="140,100 165,108 200,115" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Gapped break with displacement = Market Structure Break" color={DIM} size={7}/>
    </Base>
  )
}

// ── Liquidity ─────────────────────────────────────────────────────────────────
export function LiquidityDiagram() {
  const levels = [[30,'BSL','#34d399'],[60,'Resistance','#f59e0b'],[90,'Support','#f59e0b'],[120,'SSL','#f87171']]
  return (
    <Base>
      {levels.map(([y,lbl,clr])=>(
        <g key={String(y)}>
          <line x1="15" y1={y as number} x2="245" y2={y as number} stroke={String(clr)} strokeWidth="1" strokeDasharray="4,3"/>
          <Label x={17} y={(y as number)-3} text={String(lbl)} color={String(clr)} size={6.5} anchor="start"/>
          {[50,80,120,160,200].map(xx=><circle key={xx} cx={xx} cy={y as number} r="2" fill={String(clr)} fillOpacity="0.7"/>)}
        </g>
      ))}
      <Label x={130} y={122} text="Liquidity = stop orders clustered at key price levels" color={DIM} size={7}/>
    </Base>
  )
}
export function BuySideLiquidityDiagram() {
  return (
    <Base>
      <polyline points="15,100 45,60 65,75 95,52 115,68 145,48 165,62" stroke={LINE} strokeWidth="1.5" fill="none"/>
      {[[45,60],[95,52],[145,48]].map(([x,y])=>(
        <g key={x}>
          <circle cx={x as number} cy={y as number} r="3" fill="#f59e0b"/>
          <text x={x as number} y={(y as number)-12} fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="system-ui" fontWeight="900">×</text>
          <text x={x as number} y={(y as number)-22} fill="#34d399" fontSize="6" textAnchor="middle" fontFamily="system-ui">STOP</text>
        </g>
      ))}
      <Label x={130} y={28} text="BSL — Buy stops above swing highs" color="#34d399" size={7.5}/>
      <Label x={130} y={122} text="Retail shorts place stops above highs → BSL pool" color={DIM} size={7}/>
    </Base>
  )
}
export function SellSideLiquidityDiagram() {
  return (
    <Base>
      <polyline points="15,30 45,65 65,52 95,72 115,58 145,78 165,62" stroke={LINE} strokeWidth="1.5" fill="none"/>
      {[[45,65],[95,72],[145,78]].map(([x,y])=>(
        <g key={x}>
          <circle cx={x as number} cy={y as number} r="3" fill="#f59e0b"/>
          <text x={x as number} y={(y as number)+20} fill="#f87171" fontSize="9" textAnchor="middle" fontFamily="system-ui" fontWeight="900">×</text>
          <text x={x as number} y={(y as number)+30} fill="#f87171" fontSize="6" textAnchor="middle" fontFamily="system-ui">STOP</text>
        </g>
      ))}
      <Label x={130} y={112} text="SSL — Sell stops below swing lows" color="#f87171" size={7.5}/>
      <Label x={130} y={122} text="Retail longs place stops below lows → SSL pool" color={DIM} size={7}/>
    </Base>
  )
}
export function LiquidityPoolDiagram() {
  return (
    <Base>
      <line x1="20" y1="60" x2="240" y2="60" stroke="#f59e0b" strokeWidth="2"/>
      {[30,50,70,90,110,130,150,170,190,210,230].map(x=>(
        <g key={x}>
          <line x1={x} y1="52" x2={x} y2="68" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.6"/>
        </g>
      ))}
      <rect x={20} y={52} width={220} height={16} fill="#f59e0b" fillOpacity="0.08"/>
      <Label x={130} y={50} text="LIQUIDITY POOL" color="#f59e0b" size={8}/>
      <Label x={130} y={82} text="Dense cluster of resting orders" color={TXT} size={7.5}/>
      <Label x={130} y={95} text="Stop losses + limit orders stacked at one level" color={DIM} size={7}/>
      <Label x={130} y={122} text="Bigger the pool, stronger the draw on price" color={DIM} size={7}/>
    </Base>
  )
}
export function StopHuntDiagram() {
  return (
    <Base>
      <line x1="15" y1="42" x2="240" y2="42" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={38} text="Stop Level" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="20,90 55,75 80,65 100,55" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <Candle x={100} y={15} h={60} bull={true} wickT={28} wickB={5}/>
      <Label x={118} y={10} text="Hunt!" color="#f87171" size={8} anchor="start"/>
      <Candle x={130} y={50} h={40} bull={false} wickT={4} wickB={4}/>
      <Candle x={155} y={65} h={30} bull={false} wickT={3} wickB={5}/>
      <Candle x={180} y={80} h={28} bull={false} wickT={3} wickB={4}/>
      <Label x={130} y={122} text="Wick pierces stops → closes back → real move begins" color={DIM} size={7}/>
    </Base>
  )
}
export function LiquidityVoidDiagram() {
  return (
    <Base>
      <Candle x={30} y={80} h={28} bull={true}  wickT={4} wickB={4}/>
      <Candle x={55} y={75} h={25} bull={true}  wickT={4} wickB={4}/>
      <Candle x={80} y={20} h={55} bull={true}  wickT={4} wickB={5}/>
      <Zone x={55} y={20} w={40} h={55} color="#60a5fa" label=""/>
      <Label x={95} y={45} text="VOID" color="#60a5fa" size={9} anchor="start"/>
      <Label x={95} y={56} text="No orders" color="#60a5fa" size={7} anchor="start"/>
      <Candle x={110} y={15} h={30} bull={true}  wickT={4} wickB={4}/>
      <Label x={130} y={122} text="Price skipped this zone — no two-sided trading occurred" color={DIM} size={7}/>
    </Base>
  )
}
export function EngineeredLiquidityDiagram() {
  return (
    <Base>
      <polyline points="15,100 40,60 60,72 90,58 110,70 140,58" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="15" y1="58" x2="220" y2="58" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx={90} cy={58} r="3" fill="#f59e0b"/>
      <circle cx={140} cy={58} r="3" fill="#f59e0b"/>
      <Label x={115} y={52} text="EQH (Engineered)" color="#f59e0b" size={7}/>
      <Candle x={145} y={28} h={60} bull={false} wickT={30} wickB={4}/>
      <Label x={165} y={22} text="Sweep!" color="#f87171" size={8} anchor="start"/>
      <polyline points="160,90 185,100 210,112" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Institutions deliberately engineer EQH to sweep stops" color={DIM} size={7}/>
    </Base>
  )
}
export function TrendlineLiquidityDiagram() {
  return (
    <Base>
      <line x1="20" y1="105" x2="170" y2="25" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={22} y={110} text="Retail trendline" color="#60a5fa" size={7} anchor="start"/>
      {[[55,85],[90,62],[130,42]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3" fill="#60a5fa"/>)}
      {[[55,85],[90,62],[130,42]].map(([x,y])=>(
        <text key={x+100} x={x} y={(y as number)-8} fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="900">×</text>
      ))}
      <polyline points="170,25 185,32 200,20" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={200} y={16} text="↗ Pierce stops" color="#f87171" size={7}/>
      <polyline points="200,20 220,40 235,65" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Trendlines attract retail stops → ICT sweeps them" color={DIM} size={7}/>
    </Base>
  )
}
export function LiquidityGrabDiagram() {
  return (
    <Base>
      <line x1="15" y1="45" x2="240" y2="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={41} text="Stop Level" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={50} y={55} h={22} bull={true}  wickT={4} wickB={4}/>
      <Candle x={78} y={52} h={20} bull={true}  wickT={4} wickB={3}/>
      <Candle x={106} y={42} h={22} bull={true}  wickT={6} wickB={4}/>
      <Candle x={134} y={42} h={45} bull={false} wickT={38} wickB={4}/>
      <Label x={150} y={8} text="Grab (wick only!)" color="#f87171" size={7} anchor="start"/>
      <Candle x={162} y={55} h={25} bull={false} wickT={4} wickB={4}/>
      <Candle x={190} y={68} h={28} bull={false} wickT={4} wickB={4}/>
      <Label x={130} y={122} text="Single wick takes stops — body stays below level" color={DIM} size={7}/>
    </Base>
  )
}
export function RaidDiagram() {
  return (
    <Base>
      {[[35,'SSL₁'],[65,'SSL₂'],[95,'SSL₃']].map(([y,lbl])=>(
        <g key={String(y)}>
          <line x1="15" y1={y as number} x2="240" y2={y as number} stroke="#f87171" strokeWidth="0.8" strokeDasharray="3,2"/>
          <Label x={17} y={(y as number)-3} text={String(lbl)} color="#f87171" size={6} anchor="start"/>
        </g>
      ))}
      <Candle x={110} y={18} h={95} bull={false} wickT={5} wickB={4}/>
      <Label x={130} y={14} text="RAID" color="#f87171" size={10}/>
      <polyline points="125,115 150,105 180,90 210,70" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={190} y={65} text="Reversal ↑" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Single candle raids all stop levels → instant reversal" color={DIM} size={7}/>
    </Base>
  )
}
export function TwoWayFlowDiagram() {
  return (
    <Base>
      <line x1="15" y1="30" x2="240" y2="30" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={17} y={26} text="BSL" color="#34d399" size={6.5} anchor="start"/>
      <line x1="15" y1="100" x2="240" y2="100" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={17} y={113} text="SSL" color="#f87171" size={6.5} anchor="start"/>
      <polyline points="30,65 55,45 72,30" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <Label x={55} y={20} text="BSL Sweep" color="#f59e0b" size={6.5}/>
      <polyline points="72,30 90,50 108,75 120,100" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <Label x={96} y={95} text="SSL Sweep" color="#f59e0b" size={6.5}/>
      <polyline points="120,100 145,80 170,58 200,35 225,20" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={190} y={28} text="True ↑" color="#34d399" size={8}/>
      <Label x={130} y={122} text="Both sides swept before true direction is revealed" color={DIM} size={7}/>
    </Base>
  )
}

// ── Price Delivery ────────────────────────────────────────────────────────────
export function SIBIDiagram() {
  return (
    <Base>
      <Candle x={60}  y={20} h={40} bull={false} wickT={5} wickB={5}/>
      <Candle x={100} y={45} h={55} bull={false} wickT={4} wickB={6}/>
      <Candle x={140} y={72} h={35} bull={false} wickT={4} wickB={5}/>
      <Zone x={65} y={60} w={80} h={17} color="#f87171" label=""/>
      <Label x={105} y={71} text="SIBI" color="#f87171" size={9}/>
      <line x1="65" y1="60" x2="220" y2="60" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="65" y1="77" x2="220" y2="77" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2"/>
      <Label x={17} y={58} text="C1 low" color={DIM} size={6.5} anchor="start"/>
      <Label x={17} y={80} text="C3 high" color={DIM} size={6.5} anchor="start"/>
      <Label x={130} y={122} text="Bearish FVG — C3 high doesn't reach C1 low" color={DIM} size={7}/>
    </Base>
  )
}
export function BISIDiagram() {
  return (
    <Base>
      <Candle x={60}  y={75} h={38} bull={true} wickT={5} wickB={5}/>
      <Candle x={100} y={28} h={52} bull={true} wickT={4} wickB={6}/>
      <Candle x={140} y={42} h={35} bull={true} wickT={4} wickB={5}/>
      <Zone x={65} y={42} w={80} h={33} color="#34d399" label=""/>
      <Label x={105} y={61} text="BISI" color="#34d399" size={9}/>
      <line x1="65" y1="42" x2="220" y2="42" stroke="#34d399" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="65" y1="75" x2="220" y2="75" stroke="#34d399" strokeWidth="1" strokeDasharray="3,2"/>
      <Label x={17} y={40} text="C3 low" color={DIM} size={6.5} anchor="start"/>
      <Label x={17} y={78} text="C1 high" color={DIM} size={6.5} anchor="start"/>
      <Label x={130} y={122} text="Bullish FVG — C3 low doesn't reach C1 high" color={DIM} size={7}/>
    </Base>
  )
}
export function ImbalanceDiagram() {
  return (
    <Base>
      <Candle x={70}  y={55} h={40} bull={true} wickT={8} wickB={5}/>
      <Candle x={110} y={20} h={45} bull={true} wickT={5} wickB={6}/>
      <line x1="75" y1="55" x2="230" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="115" y1="65" x2="230" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Zone x={75} y={55} w={155} h={10} color="#f59e0b" label="Imbalance"/>
      <Label x={130} y={90} text="Gap between C1 wick and C2 body" color={TXT} size={7.5}/>
      <Label x={130} y={122} text="Price moved too fast — one-sided market created" color={DIM} size={7}/>
    </Base>
  )
}
export function RebalancingDiagram() {
  return (
    <Base>
      <Candle x={30} y={75} h={30} bull={true}  wickT={4} wickB={4}/>
      <Candle x={58} y={22} h={55} bull={true}  wickT={5} wickB={5}/>
      <Zone x={35} y={50} w={30} h={25} color="#f59e0b" label="FVG"/>
      <Candle x={90} y={18} h={22} bull={false} wickT={3} wickB={3}/>
      <Candle x={118} y={32} h={30} bull={false} wickT={3} wickB={4}/>
      <Candle x={146} y={50} h={28} bull={false} wickT={3} wickB={4}/>
      <Arrow x1={175} y1={95} x2={155} y2={65} color="#f59e0b"/>
      <Label x={178} y={100} text="Fills FVG" color="#f59e0b" size={7} anchor="start"/>
      <Candle x={178} y={38} h={28} bull={true}  wickT={3} wickB={4}/>
      <Candle x={206} y={22} h={25} bull={true}  wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Price returns to imbalance → fills → continues up" color={DIM} size={7}/>
    </Base>
  )
}
export function EquilibriumDiagram() {
  return (
    <Base>
      <line x1="30" y1="20" x2="230" y2="20" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="30" y1="110" x2="230" y2="110" stroke="#34d399" strokeWidth="1.5"/>
      <line x1="30" y1="65" x2="230" y2="65" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
      <rect x={30} y={20} width={200} height={45} fill="#f87171" fillOpacity="0.05"/>
      <rect x={30} y={65} width={200} height={45} fill="#34d399" fillOpacity="0.05"/>
      <Label x={230} y={17} text="High" color="#f87171" size={7} anchor="end"/>
      <Label x={230} y={63} text="50% EQ" color="#f59e0b" size={8} anchor="end"/>
      <Label x={230} y={124} text="Low" color="#34d399" size={7} anchor="end"/>
      <Label x={60} y={46} text="PREMIUM" color="#f87171" size={8}/>
      <Label x={60} y={88} text="DISCOUNT" color="#34d399" size={8}/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}
export function FibonacciDiagram() {
  return (
    <Base>
      <polyline points="25,105 85,20" stroke="#34d399" strokeWidth="2" fill="none"/>
      {[[0,'0%',105],[0.5,'50% EQ',62.5],[0.618,'61.8% OTE',71.5],[0.79,'79%',81.7],[1,'100%',105]].map(([pct,lbl,y])=>(
        <g key={String(lbl)}>
          <line x1="85" y1={y as number} x2="240" y2={y as number} stroke={pct===0.618?'#34d399':pct===0.5?'#f59e0b':LINE} strokeWidth={pct===0.618?1.2:0.8} strokeDasharray="4,3"/>
          <Label x={88} y={(y as number)-2} text={String(lbl)} color={pct===0.618?'#34d399':pct===0.5?'#f59e0b':DIM} size={6.5} anchor="start"/>
        </g>
      ))}
      <Zone x={85} y={62} w={60} h={20} color="#34d399" label="OTE"/>
      <Label x={130} y={122} text="Fib from swing low to high — enter OTE at 61.8%–79%" color={DIM} size={7}/>
    </Base>
  )
}
export function PdArrayDiagram() {
  const rows = [
    ['Old Highs / Lows','#f87171'],['Liquidity Voids','#f59e0b'],['Fair Value Gaps','#f59e0b'],
    ['Volume Imbalances','#fbbf24'],['Order Blocks','#c084fc'],['Breaker Blocks','#a78bfa'],
    ['Mitigation Blocks','#818cf8'],['Propulsion Blocks','#6366f1'],['Rejection Blocks','#60a5fa'],
  ]
  return (
    <Base h={145}>
      <Label x={130} y={14} text="PD ARRAY HIERARCHY (highest → lowest)" color="#f59e0b" size={7.5}/>
      {rows.map(([lbl,clr],i)=>(
        <g key={String(lbl)}>
          <rect x={15+(i*2)} y={18+(i*13)} width={230-(i*4)} height={11} fill={String(clr)} fillOpacity={0.12-(i*0.008)} rx="2"/>
          <Label x={130} y={27+(i*13)} text={`${i+1}. ${String(lbl)}`} color={String(clr)} size={6.5}/>
        </g>
      ))}
    </Base>
  )
}
export function ExpansionDiagram() {
  return (
    <Base>
      <rect x={15} y={20} width={80} height={85} fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="0.8" rx="3"/>
      <Label x={55} y={68} text="RANGE" color={DIM} size={8}/>
      {[0,1,2,3].map(i=><Candle key={i} x={20+i*18} y={55+(i%2===0?0:5)} h={20+(i%2===0?5:0)} bull={i%2===0} wickT={3} wickB={3}/>)}
      <Candle x={110} y={18} h={72} bull={true} wickT={4} wickB={4}/>
      <Label x={112} y={14} text="EXPANSION!" color="#34d399" size={7.5} anchor="start"/>
      <Candle x={138} y={12} h={55} bull={true} wickT={4} wickB={4}/>
      <Candle x={166} y={8} h={45} bull={true} wickT={3} wickB={4}/>
      <Label x={130} y={122} text="Range breaks → explosive directional delivery" color={DIM} size={7}/>
    </Base>
  )
}
export function ConsolidationDiagram() {
  return (
    <Base>
      <rect x={15} y={35} width={230} height={60} fill="#f59e0b" fillOpacity="0.05" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3" rx="4"/>
      <Label x={17} y={31} text="Range High" color="#f59e0b" size={7} anchor="start"/>
      <Label x={17} y={105} text="Range Low" color="#f59e0b" size={7} anchor="start"/>
      {[0,1,2,3,4,5,6,7,8].map(i=>(
        <Candle key={i} x={22+i*24} y={50+(i%3===0?15:i%3===1?0:8)} h={18+(i%2===0?4:0)} bull={i%2===0} wickT={5} wickB={5}/>
      ))}
      <Label x={130} y={122} text="Neither buyers nor sellers dominate — AMD accumulation" color={DIM} size={7}/>
    </Base>
  )
}
export function InversionFVGDiagram() {
  return (
    <Base>
      <Candle x={20} y={70} h={35} bull={true}  wickT={4} wickB={4}/>
      <Candle x={45} y={25} h={48} bull={true}  wickT={4} wickB={5}/>
      <Zone x={25} y={45} w={28} h={25} color="#34d399" label="FVG"/>
      <Candle x={80} y={20} h={25} bull={false} wickT={3} wickB={3}/>
      <Candle x={105} y={35} h={30} bull={false} wickT={3} wickB={4}/>
      <Candle x={130} y={48} h={28} bull={false} wickT={3} wickB={5}/>
      <Label x={155} y={68} text="iFVG (Inverted)" color="#f87171" size={7} anchor="start"/>
      <Zone x={25} y={45} w={135} h={25} color="#f87171" label=""/>
      <Candle x={155} y={45} h={22} bull={false} wickT={3} wickB={3}/>
      <Candle x={180} y={58} h={28} bull={false} wickT={3} wickB={4}/>
      <Label x={130} y={122} text="Bullish FVG mitigated → flips to bearish resistance (iFVG)" color={DIM} size={7}/>
    </Base>
  )
}
export function ConvergenceDiagram() {
  return (
    <Base>
      <line x1="15" y1="62" x2="240" y2="62" stroke="#f59e0b" strokeWidth="1.5"/>
      <Zone x={15} y={55} w={225} h={20} color="#c084fc" label="OB"/>
      <Zone x={15} y={52} w={225} h={26} color="#34d399" label="FVG"/>
      <Zone x={15} y={55} w={225} h={20} color="#f59e0b" label="OTE 61.8%"/>
      <Label x={130} y={50} text="CONVERGENCE ZONE" color="#f59e0b" size={9}/>
      <Label x={130} y={42} text="FVG + OB + OTE all align here" color="#f59e0b" size={7}/>
      <Label x={130} y={95} text="OB  +  FVG  +  Fibonacci 61.8% at same price" color={TXT} size={7}/>
      <Label x={130} y={122} text="Multiple PD arrays at same level = highest probability" color={DIM} size={7}/>
    </Base>
  )
}
export function RetestDiagram() {
  return (
    <Base>
      <line x1="15" y1="60" x2="240" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <polyline points="20,95 55,72 80,60" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <Candle x={80} y={20} h={42} bull={true} wickT={4} wickB={4}/>
      <Label x={92} y={18} text="Break" color="#34d399" size={7} anchor="start"/>
      <Candle x={108} y={30} h={30} bull={false} wickT={3} wickB={3}/>
      <Candle x={133} y={48} h={22} bull={false} wickT={3} wickB={4}/>
      <Candle x={158} y={56} h={20} bull={true} wickT={5} wickB={4}/>
      <Label x={175} y={58} text="Retest ↩" color="#f59e0b" size={7}/>
      <Candle x={183} y={32} h={28} bull={true} wickT={3} wickB={3}/>
      <Candle x={208} y={18} h={25} bull={true} wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Break → retrace to level → confirm → continue" color={DIM} size={7}/>
    </Base>
  )
}
export function CreepDiagram() {
  return (
    <Base>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>(
        <Candle key={i} x={15+i*19} y={95-(i*6)} h={10} bull={true} w={8} wickT={2} wickB={2}/>
      ))}
      <polyline points="15,98 244,34" stroke="#34d399" strokeWidth="1" strokeDasharray="3,3" fill="none"/>
      <Label x={130} y={22} text="PRICE CREEP" color="#34d399" size={9}/>
      <Label x={130} y={35} text="Slow methodical delivery" color={DIM} size={7}/>
      <Label x={130} y={122} text="Small uniform candles — quiet institutional accumulation" color={DIM} size={7}/>
    </Base>
  )
}
export function CompressionDiagram() {
  const sizes = [28,24,20,16,12,8,6,4,50]
  return (
    <Base>
      {sizes.map((h,i)=>(
        <Candle key={i} x={15+i*24} y={65-(h/2)} h={h} bull={i%2===0} w={10} wickT={3} wickB={3}/>
      ))}
      <Arrow x1={220} y1={90} x2={230} y2={30} color="#34d399"/>
      <Label x={235} y={28} text="BOOM" color="#34d399" size={8} anchor="start"/>
      <Label x={130} y={122} text="Tightening range → inevitable explosive breakout" color={DIM} size={7}/>
    </Base>
  )
}

// ── Order Blocks ──────────────────────────────────────────────────────────────
export function PropulsionBlockDiagram() {
  return (
    <Base>
      <polyline points="15,105 35,85 55,92 80,65 100,72 130,40 150,48 175,22 200,28" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Zone x={96} y={65} w={12} h={14} color="#c084fc" label="Prop OB"/>
      <Label x={90} y={60} text="Propulsion" color="#c084fc" size={6.5}/>
      <Label x={90} y={52} text="Block (mid-leg)" color="#c084fc" size={6.5}/>
      <Arrow x1={85} y1={60} x2={99} y2={68} color="#c084fc"/>
      <Label x={130} y={122} text="OB within a trend leg — continuation entry on return" color={DIM} size={7}/>
    </Base>
  )
}
export function RejectionBlockDiagram() {
  return (
    <Base>
      <Candle x={80} y={50} h={18} bull={true} w={14} wickT={35} wickB={5}/>
      <line x1="15" y1="50" x2="240" y2="50" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3"/>
      <Zone x={80} y={15} w={14} h={35} color="#c084fc" label="Rejection Zone"/>
      <Label x={80} y={12} text="Wick = Rejection Block" color="#c084fc" size={7}/>
      <Candle x={120} y={62} h={25} bull={false} wickT={3} wickB={4}/>
      <Candle x={148} y={58} h={30} bull={false} wickT={3} wickB={5}/>
      <Arrow x1={170} y1={40} x2={155} y2={52} color="#c084fc"/>
      <Label x={172} y={37} text="Entry at upper wick" color="#c084fc" size={7} anchor="start"/>
      <Label x={130} y={122} text="Large wick = rejection zone — entry on return to wick" color={DIM} size={7}/>
    </Base>
  )
}
export function InstitutionalCandleDiagram() {
  return (
    <Base>
      {[-3,-2,-1].map(i=><Candle key={i} x={45+(i+3)*20} y={72-(i*3)} h={14+(i%2===0?4:0)} bull={i%2===0} w={8} wickT={3} wickB={3}/>)}
      <Candle x={110} y={15} h={82} bull={true} w={18} wickT={3} wickB={3}/>
      <Label x={119} y={12} text="Institutional Candle" color="#c084fc" size={7} anchor="start"/>
      <Label x={119} y={22} text="(large body, tiny wicks)" color={DIM} size={6.5} anchor="start"/>
      {[0,1,2].map(i=><Candle key={i+10} x={138+i*20} y={22+i*8} h={18-(i*2)} bull={true} w={8} wickT={3} wickB={3}/>)}
      <Label x={130} y={122} text="Decisive institutional candle — majority body, minimal wick" color={DIM} size={7}/>
    </Base>
  )
}
export function VoidDiagram() {
  return (
    <Base>
      <Candle x={30} y={75} h={32} bull={true}  wickT={4} wickB={4}/>
      <Candle x={58} y={72} h={28} bull={true}  wickT={4} wickB={5}/>
      <Candle x={86} y={18} h={55} bull={true}  wickT={4} wickB={4}/>
      <rect x={63} y={18} width={30} height={54} fill="#c084fc" fillOpacity="0.08" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="3,2"/>
      <Label x={78} y={42} text="VOID" color="#c084fc" size={8}/>
      <Label x={78} y={52} text="skipped" color="#c084fc" size={6.5}/>
      <Candle x={120} y={12} h={28} bull={true}  wickT={3} wickB={4}/>
      <Candle x={148} y={8}  h={22} bull={true}  wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Rapid move leaves void area — price will revisit" color={DIM} size={7}/>
    </Base>
  )
}
export function PointOfOriginDiagram() {
  return (
    <Base>
      <Candle x={30} y={78} h={25} bull={true}  wickT={4} wickB={4}/>
      <Candle x={58} y={60} h={42} bull={true}  wickT={5} wickB={4}/> {/* Point of Origin */}
      <rect x={58} y={60} width={10} height={42} fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5"/>
      <Label x={58} y={56} text="Origin" color="#f59e0b" size={7}/>
      <Arrow x1={78} y1={108} x2={65} y2={100} color="#f59e0b"/>
      <Candle x={90} y={22} h={70} bull={true}  wickT={4} wickB={5}/>
      <Candle x={118} y={15} h={45} bull={true}  wickT={3} wickB={4}/>
      <polyline points="125,50 155,42 185,35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
      <Arrow x1={185} y1={35} x2={68} y2={65} color="#f59e0b"/>
      <Label x={130} y={122} text="Institutional flow originated here — price returns to it" color={DIM} size={7}/>
    </Base>
  )
}
export function ReclaimDiagram() {
  return (
    <Base>
      <line x1="15" y1="55" x2="240" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={51} text="Key Level" color="#f59e0b" size={7} anchor="start"/>
      <polyline points="20,30 55,42 80,55" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <Candle x={80} y={55} h={40} bull={false} wickT={3} wickB={4}/>
      <Label x={95} y={80} text="Break" color="#f87171" size={7} anchor="start"/>
      <Candle x={108} y={62} h={30} bull={false} wickT={3} wickB={3}/>
      <Candle x={133} y={65} h={28} bull={true}  wickT={3} wickB={3}/>
      <Candle x={158} y={45} h={30} bull={true}  wickT={5} wickB={4}/>
      <Label x={170} y={40} text="Reclaimed!" color="#34d399" size={7} anchor="start"/>
      <Candle x={186} y={28} h={25} bull={true}  wickT={3} wickB={3}/>
      <Label x={130} y={122} text="Price breaks level then closes back above = reclaim" color={DIM} size={7}/>
    </Base>
  )
}

// ── Sessions & Time ───────────────────────────────────────────────────────────
export function AsianSessionDiagram()    { return <TL s={19} e={23} color="#c084fc" label="ASIAN SESSION" sub="7PM – 11PM EST"/> }
export function AsiaRangeDiagram() {
  return (
    <Base>
      <rect x={15} y={35} width={170} height={55} fill="#c084fc" fillOpacity="0.05" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="4,3" rx="3"/>
      <line x1="15" y1="35" x2="185" y2="35" stroke="#c084fc" strokeWidth="1.5"/>
      <line x1="15" y1="90" x2="185" y2="90" stroke="#c084fc" strokeWidth="1.5"/>
      <Label x={17} y={31} text="Asia High — Buy Stops Above" color="#c084fc" size={7} anchor="start"/>
      <Label x={17} y={103} text="Asia Low — Sell Stops Below" color="#c084fc" size={7} anchor="start"/>
      {[0,1,2,3,4,5].map(i=><Candle key={i} x={20+i*26} y={52+(i%2===0?8:0)} h={18} bull={i%2===0} w={10} wickT={5} wickB={5}/>)}
      <Label x={130} y={122} text="Asia range = key reference for London & NY sessions" color={DIM} size={7}/>
    </Base>
  )
}
export function LondonKillZoneDiagram()  { return <TL s={2} e={5} color="#60a5fa" label="LONDON KILL ZONE" sub="2AM – 5AM EST"/> }
export function NYAmKillZoneDiagram()    { return <TL s={8.5} e={11} color="#f59e0b" label="NEW YORK AM" sub="8:30AM – 11AM EST"/> }
export function NYPmKillZoneDiagram()    { return <TL s={13.5} e={16} color="#34d399" label="NEW YORK PM" sub="1:30PM – 4PM EST"/> }
export function NYLunchDiagram() {
  return (
    <Base h={100}>
      <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
      {(() => {
        const tx = (h:number) => 15 + (h/24)*230
        return <>
          <rect x={tx(12)} y="32" width={tx(13.5)-tx(12)} height="26" fill="#f87171" fillOpacity="0.2" rx="2"/>
          <Label x={(tx(12)+tx(13.5))/2} y={43} text="NY LUNCH" color="#f87171" size={7.5}/>
          <Label x={(tx(12)+tx(13.5))/2} y={53} text="12PM–1:30PM" color="#f87171" size={6}/>
          <Label x={(tx(12)+tx(13.5))/2} y={73} text="DO NOT TRADE" color="#f87171" size={7}/>
          {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1={58} x2={tx(h)} y2={63} stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={71} text={`${h}h`} color={DIM} size={6}/></g>)}
        </>
      })()}
      <Label x={130} y={88} text="Choppy reversing price — avoid trading this window" color={DIM} size={6.5}/>
    </Base>
  )
}
export function FOMCDiagram() {
  return (
    <Base>
      <line x1="130" y1="10" x2="130" y2="120" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3"/>
      <Label x={130} y={8} text="2:00 PM — FOMC Release" color="#f87171" size={7}/>
      <polyline points="30,65 80,65 130,65 145,20 155,110 165,35 175,90 185,55 210,62 230,60" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <Label x={155} y={16} text="Extreme Spike" color="#f59e0b" size={7}/>
      <Label x={130} y={122} text="FOMC = extreme volatility both ways — stay out" color={DIM} size={7}/>
    </Base>
  )
}
export function TrueDayDiagram() {
  return (
    <Base h={100}>
      {(() => {
        const tx = (h:number) => 15 + (h/24)*230
        return <>
          <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
          <line x1={tx(0)} y1="25" x2={tx(0)} y2="85" stroke="#f59e0b" strokeWidth="2"/>
          <Label x={tx(0)} y={22} text="MIDNIGHT" color="#f59e0b" size={7}/>
          <Label x={tx(0)} y={13} text="True Day Start" color="#f59e0b" size={6.5}/>
          <rect x={tx(0)} y="32" width={tx(24)-tx(0)} height="26" fill="#f59e0b" fillOpacity="0.06" rx="2"/>
          <Label x={tx(12)} y={47} text="TRUE TRADING DAY" color="#f59e0b" size={7}/>
          {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1={58} x2={tx(h)} y2={63} stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={71} text={`${h}h`} color={DIM} size={6}/></g>)}
        </>
      })()}
      <Label x={130} y={88} text="ICT counts day from midnight not the 6PM open" color={DIM} size={6.5}/>
    </Base>
  )
}
export function PDHPDLDiagram() {
  return (
    <Base>
      <rect x={15} y={20} width={90} height={90} fill="rgba(255,255,255,0.02)" stroke={LINE} strokeWidth="0.5" rx="2"/>
      <Label x={60} y={14} text="Yesterday" color={DIM} size={7}/>
      <Candle x={35} y={32} h={60} bull={true} w={14} wickT={8} wickB={8}/>
      <line x1="15" y1="32" x2="240" y2="32" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="15" y1="100" x2="240" y2="100" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={110} y={28} text="PDH — Buy Stops Above" color="#f59e0b" size={7} anchor="start"/>
      <Label x={110} y={113} text="PDL — Sell Stops Below" color="#60a5fa" size={7} anchor="start"/>
      <Candle x={155} y={55} h={30} bull={false} w={10} wickT={5} wickB={4}/>
      <Candle x={175} y={48} h={35} bull={false} w={10} wickT={4} wickB={4}/>
      <Label x={130} y={122} text="PDH / PDL = key liquidity levels for the current day" color={DIM} size={7}/>
    </Base>
  )
}
export function PWHPWLDiagram() {
  return (
    <Base>
      <line x1="15" y1="22" x2="240" y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="15" y1="108" x2="240" y2="108" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={18} text="PWH — Weekly Buy Stops" color="#f59e0b" size={7} anchor="start"/>
      <Label x={17} y={121} text="PWL — Weekly Sell Stops" color="#60a5fa" size={7} anchor="start"/>
      <Zone x={15} y={22} w={225} h={86} color="#f59e0b" label=""/>
      <Label x={130} y={65} text="THIS WEEK" color={DIM} size={8}/>
      <Label x={130} y={78} text="price range" color={DIM} size={7}/>
      <Label x={130} y={122} text="PWH / PWL = week's primary liquidity targets" color={DIM} size={7}/>
    </Base>
  )
}
export function PMHPMLDiagram() {
  return (
    <Base>
      <line x1="15" y1="18" x2="240" y2="18" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3"/>
      <line x1="15" y1="112" x2="240" y2="112" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,3"/>
      <Label x={17} y={14} text="PMH — Monthly Resistance / BSL" color="#f59e0b" size={7} anchor="start"/>
      <Label x={17} y={122} text="PML — Monthly Support / SSL" color="#60a5fa" size={7} anchor="start"/>
      <Zone x={15} y={18} w={225} h={94} color="#f59e0b" label=""/>
      <Label x={130} y={62} text="MONTHLY RANGE" color={DIM} size={8}/>
      <Label x={130} y={75} text="Major institutional reference" color={DIM} size={7}/>
    </Base>
  )
}
export function NDOGDiagram() {
  return (
    <Base>
      <Label x={70} y={14} text="Previous Day" color={DIM} size={7}/>
      <Label x={185} y={14} text="New Day" color={DIM} size={7}/>
      <line x1="15" y1="20" x2="130" y2="20" stroke={LINE} strokeWidth="1.5"/>
      <line x1="145" y1="20" x2="240" y2="20" stroke={LINE} strokeWidth="1.5"/>
      <Candle x={50} y={30} h={55} bull={true} w={14} wickT={6} wickB={6}/>
      <line x1="50" y1="80" x2="240" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="145" y1="55" x2="240" y2="55" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3"/>
      <Zone x={130} y={55} w={115} h={25} color="#f59e0b" label="NDOG"/>
      <Label x={187} y={70} text="Gap to fill" color="#f59e0b" size={7}/>
      <Candle x={175} y={50} h={35} bull={false} w={10} wickT={4} wickB={4}/>
      <Label x={130} y={122} text="Gap between prev close (midnight) and new open" color={DIM} size={7}/>
    </Base>
  )
}
export function OpeningRangeGapDiagram() {
  return (
    <Base>
      <Candle x={40} y={38} h={50} bull={false} w={14} wickT={5} wickB={5}/>
      <Label x={47} y={33} text="Previous Close" color={DIM} size={6.5}/>
      <line x1="15" y1="88" x2="240" y2="88" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="110" y1="62" x2="240" y2="62" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Zone x={15} y={62} w={225} h={26} color="#f59e0b" label="ORG"/>
      <Label x={130} y={78} text="Opening Range Gap" color="#f59e0b" size={7.5}/>
      <Candle x={148} y={55} h={38} bull={true}  w={10} wickT={4} wickB={4}/>
      <Label x={148} y={108} text="Gap fill" color="#34d399" size={7}/>
      <Label x={130} y={122} text="Price commonly returns to fill session opening gaps" color={DIM} size={7}/>
    </Base>
  )
}
export function SilverBulletDiagram() {
  return (
    <Base h={110}>
      {(() => {
        const tx = (h:number) => 15 + (h/24)*230
        return <>
          <rect x={tx(10)} y="20" width={tx(11)-tx(10)} height="50" fill="#f59e0b" fillOpacity="0.15" rx="3"/>
          <Label x={(tx(10)+tx(11))/2} y={35} text="SILVER" color="#f59e0b" size={8}/>
          <Label x={(tx(10)+tx(11))/2} y={47} text="BULLET" color="#f59e0b" size={8}/>
          <Label x={(tx(10)+tx(11))/2} y={58} text="10–11AM" color="#f59e0b" size={6}/>
          <polyline points={`${tx(10.1)},65 ${tx(10.25)},78 ${tx(10.3)},52 ${tx(10.5)},42 ${tx(10.7)},30 ${tx(10.9)},22`} stroke="#34d399" strokeWidth="2" fill="none"/>
          {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1="70" x2={tx(h)} y2="75" stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={83} text={`${h}h`} color={DIM} size={6}/></g>)}
        </>
      })()}
      <Label x={130} y={98} text="Sweep + FVG entry within 10–11AM window" color={DIM} size={6.5}/>
    </Base>
  )
}
export function LondonCloseDiagram() {
  return (
    <Base h={100}>
      {(() => {
        const tx = (h:number) => 15 + (h/24)*230
        return <>
          <line x1="10" y1="55" x2="250" y2="55" stroke={LINE} strokeWidth="1"/>
          <rect x={tx(11)} y="32" width={tx(12)-tx(11)} height="26" fill="#f87171" fillOpacity="0.2" rx="2"/>
          <Label x={(tx(11)+tx(12))/2} y={43} text="LONDON" color="#f87171" size={7}/>
          <Label x={(tx(11)+tx(12))/2} y={53} text="CLOSE" color="#f87171" size={7}/>
          {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1={58} x2={tx(h)} y2={63} stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={71} text={`${h}h`} color={DIM} size={6}/></g>)}
        </>
      })()}
      <Label x={130} y={88} text="11AM–12PM — counter-trend close moves, do not trade" color={DIM} size={6.5}/>
    </Base>
  )
}
export function MidnightOpenDiagram() {
  return (
    <Base>
      <line x1="15" y1="55" x2="240" y2="55" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
      <circle cx={15} cy={55} r="4" fill="#f59e0b"/>
      <Label x={17} y={51} text="MIDNIGHT OPEN — 12:00 AM" color="#f59e0b" size={7.5} anchor="start"/>
      <polyline points="30,55 55,45 75,62 100,48 125,58 150,38 175,52 200,42 225,55" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <rect x={15} y={38} width={225} height={17} fill="#f59e0b" fillOpacity="0.05"/>
      <rect x={15} y={55} width={225} height={17} fill="#60a5fa" fillOpacity="0.05"/>
      <Label x={220} y={48} text="Premium" color="#f59e0b" size={6} anchor="end"/>
      <Label x={220} y={68} text="Discount" color="#60a5fa" size={6} anchor="end"/>
      <Label x={130} y={122} text="Reference for premium vs discount on the true day" color={DIM} size={7}/>
    </Base>
  )
}
export function ADRDiagram() {
  return (
    <Base>
      <Candle x={100} y={28} h={72} bull={true} w={20} wickT={5} wickB={5}/>
      <line x1="50" y1="28" x2="170" y2="28" stroke="#34d399" strokeWidth="1.5"/>
      <line x1="50" y1="100" x2="170" y2="100" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="50" y1="28" x2="50" y2="100" stroke="#f59e0b" strokeWidth="1.5"/>
      <line x1="170" y1="28" x2="170" y2="100" stroke="#f59e0b" strokeWidth="1.5"/>
      <Label x={50} y={24} text="High" color="#34d399" size={7} anchor="end"/>
      <Label x={50} y={115} text="Low" color="#f87171" size={7} anchor="end"/>
      <Label x={175} y={65} text="ADR" color="#f59e0b" size={11} anchor="start"/>
      <Label x={175} y={78} text="= 30 pts" color="#f59e0b" size={8} anchor="start"/>
      <Label x={130} y={122} text="Once ADR is used up — no more chasing entries" color={DIM} size={7}/>
    </Base>
  )
}
export function OvernightRangeDiagram() {
  return (
    <Base>
      <rect x={15} y={35} width={145} height={60} fill="#c084fc" fillOpacity="0.05" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="4,3" rx="3"/>
      <line x1="15" y1="35" x2="160" y2="35" stroke="#c084fc" strokeWidth="1.5"/>
      <line x1="15" y1="95" x2="160" y2="95" stroke="#c084fc" strokeWidth="1.5"/>
      <Label x={17} y={31} text="Overnight High — BSL" color="#c084fc" size={7} anchor="start"/>
      <Label x={17} y={108} text="Overnight Low — SSL" color="#c084fc" size={7} anchor="start"/>
      {[0,1,2,3,4].map(i=><Candle key={i} x={22+i*27} y={52+(i%2===0?10:0)} h={18} bull={i%2===0} w={10} wickT={6} wickB={6}/>)}
      <Label x={85} y={14} text="Overnight" color="#c084fc" size={7}/>
      <Candle x={175} y={22} h={55} bull={true} w={14} wickT={4} wickB={4}/>
      <Label x={182} y={18} text="NY Open" color="#34d399" size={6.5}/>
      <Label x={130} y={122} text="Overnight range sets BSL/SSL targets for London + NY" color={DIM} size={7}/>
    </Base>
  )
}
export function OptimalTimeDiagram() {
  return (
    <Base h={100}>
      {(() => {
        const tx = (h:number) => 15 + (h/24)*230
        const zones = [{s:2,e:5,c:'#60a5fa',l:'London'},{s:8.5,e:11,c:'#f59e0b',l:'NY AM'},{s:13.5,e:16,c:'#34d399',l:'NY PM'}]
        return <>
          <rect x="15" y="32" width="230" height="26" fill="rgba(255,255,255,0.03)" rx="3"/>
          {zones.map(z=><g key={z.l}>
            <rect x={tx(z.s)} y="32" width={tx(z.e)-tx(z.s)} height="26" fill={z.c} fillOpacity="0.3" rx="2"/>
            <Label x={(tx(z.s)+tx(z.e))/2} y={48} text={z.l} color={z.c} size={6.5}/>
          </g>)}
          {[0,6,12,18,24].map(h=><g key={h}><line x1={tx(h)} y1={58} x2={tx(h)} y2={63} stroke={LINE} strokeWidth="1"/><Label x={tx(h)} y={71} text={`${h}h`} color={DIM} size={6}/></g>)}
        </>
      })()}
      <Label x={130} y={88} text="OTT: trade only inside colored windows" color={DIM} size={6.5}/>
    </Base>
  )
}
export function SessionHighLowDiagram() {
  return (
    <Base>
      <line x1="15" y1="22" x2="240" y2="22" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="15" y1="108" x2="240" y2="108" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Label x={17} y={18} text="Session High — BSL forms" color="#34d399" size={7} anchor="start"/>
      <Label x={17} y={121} text="Session Low — SSL forms" color="#f87171" size={7} anchor="start"/>
      <polyline points="25,65 50,80 70,108 90,90 115,72 140,55 165,38 185,22 205,35 225,28" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <circle cx={70} cy={108} r="3" fill="#f87171"/>
      <circle cx={185} cy={22} r="3" fill="#34d399"/>
      <Label x={130} y={122} text="Session H/L build reference levels as day progresses" color={DIM} size={7}/>
    </Base>
  )
}

// ── AMD & Bias ────────────────────────────────────────────────────────────────
export function AccumulationDiagram() {
  return (
    <Base>
      <rect x={15} y={30} width={230} height={70} fill="#60a5fa" fillOpacity="0.05" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,3" rx="4"/>
      <Label x={17} y={26} text="Range High" color="#60a5fa" size={7} anchor="start"/>
      <Label x={17} y={114} text="Range Low" color="#60a5fa" size={7} anchor="start"/>
      {[0,1,2,3,4,5,6,7,8,9].map(i=>(
        <Candle key={i} x={20+i*21} y={55+(i%2===0?12:i%3===0?-5:5)} h={18+(i%3===0?6:0)} bull={i%2===0} w={9} wickT={6} wickB={6}/>
      ))}
      <Label x={130} y={122} text="Institutions quietly build position in the range" color={DIM} size={7}/>
    </Base>
  )
}
export function DistributionDiagram() {
  return (
    <Base>
      <rect x={15} y={65} width={70} height={45} fill="#60a5fa" fillOpacity="0.05" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="4,3" rx="3"/>
      {[0,1,2].map(i=><Candle key={i} x={20+i*20} y={70+(i%2===0?8:0)} h={18} bull={i%2===0} w={8} wickT={4} wickB={4}/>)}
      <Label x={50} y={62} text="Range" color="#60a5fa" size={7}/>
      <Candle x={105} y={18} h={62} bull={true} w={16} wickT={4} wickB={5}/>
      <Candle x={135} y={12} h={50} bull={true} w={14} wickT={3} wickB={4}/>
      <Candle x={163} y={8}  h={40} bull={true} w={12} wickT={3} wickB={3}/>
      <Label x={150} y={4} text="DISTRIBUTION" color="#34d399" size={7.5}/>
      <Label x={130} y={122} text="True institutional move after accumulation ends" color={DIM} size={7}/>
    </Base>
  )
}
export function QuarterlyShiftDiagram() {
  const qs = [{q:'Q1',y:40,bull:true,c:'#34d399'},{q:'Q2',y:80,bull:false,c:'#f87171'},{q:'Q3',y:55,bull:true,c:'#34d399'},{q:'Q4',y:85,bull:false,c:'#f87171'}]
  return (
    <Base>
      {qs.map((q,i)=>(
        <g key={q.q}>
          <rect x={15+i*60} y={q.bull?q.y:25} width={55} height={Math.abs(q.y-25)} fill={q.c} fillOpacity="0.15" stroke={q.c} strokeOpacity="0.3" rx="3"/>
          <Label x={42+i*60} y={q.bull?q.y+15:40} text={q.q} color={q.c} size={11}/>
          <text x={42+i*60} y={q.bull?q.y+30:55} fill={q.c} fontSize="12" textAnchor="middle">{q.bull?'↑':'↓'}</text>
        </g>
      ))}
      <Label x={130} y={122} text="Macro bias shifts each quarter — Q1 often trending" color={DIM} size={7}/>
    </Base>
  )
}
export function IPDADiagram() {
  return (
    <Base h={110}>
      <line x1="15" y1="60" x2="245" y2="60" stroke={LINE} strokeWidth="1.5"/>
      {[{days:20,x:205,c:'#34d399'},{days:40,x:165,c:'#f59e0b'},{days:60,x:125,c:'#60a5fa'}].map(lb=>(
        <g key={lb.days}>
          <line x1={lb.x} y1="48" x2="240" y2="48" stroke={lb.c} strokeWidth="1" strokeDasharray="3,2"/>
          <line x1={lb.x} y1="48" x2={lb.x} y2="72" stroke={lb.c} strokeWidth="1.5"/>
          <Label x={lb.x} y={44} text={`${lb.days}D`} color={lb.c} size={7}/>
          <Label x={(lb.x+240)/2} y={80} text={`${lb.days} Day Lookback`} color={lb.c} size={6.5}/>
        </g>
      ))}
      <Label x={240} y={57} text="NOW" color="#f59e0b" size={7} anchor="end"/>
      <Label x={130} y={95} text="Algorithm references 20/40/60 day highs and lows" color={DIM} size={6.5}/>
    </Base>
  )
}
export function DealingRangeDiagram() {
  return (
    <Base>
      <line x1="20" y1="18" x2="230" y2="18" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="20" y1="112" x2="230" y2="112" stroke="#34d399" strokeWidth="1.5"/>
      <line x1="20" y1="65" x2="230" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3"/>
      <rect x={20} y={18} width={210} height={47} fill="#f87171" fillOpacity="0.05"/>
      <rect x={20} y={65} width={210} height={47} fill="#34d399" fillOpacity="0.05"/>
      <Label x={22} y={14} text="Swing High — ERL / Premium top" color="#f87171" size={7} anchor="start"/>
      <Label x={22} y={62} text="50% EQ — Equilibrium" color="#f59e0b" size={7} anchor="start"/>
      <Label x={22} y={126} text="Swing Low — ERL / Discount bottom" color="#34d399" size={7} anchor="start"/>
      <Label x={200} y={44} text="SELL" color="#f87171" size={9} anchor="end"/>
      <Label x={200} y={90} text="BUY" color="#34d399" size={9} anchor="end"/>
    </Base>
  )
}
export function WeeklyProfileDiagram() {
  const days = ['Mon','Tue','Wed','Thu','Fri']
  const ys   = [95,55,68,38,55]
  return (
    <Base>
      <Label x={130} y={12} text="Classic Bullish Week — Monday Low" color="#34d399" size={7.5}/>
      {days.map((d,i)=>(
        <g key={d}>
          <Candle x={20+i*44} y={ys[i]} h={i===0?30:20+(4-i)*5} bull={i>0} w={16} wickT={6} wickB={6}/>
          <Label x={28+i*44} y={125} text={d} color={DIM} size={7}/>
        </g>
      ))}
      <polyline points={days.map((_,i)=>`${28+i*44},${ys[i]}`).join(' ')} stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}
export function TimeAndPriceDiagram() {
  return (
    <Base>
      <line x1="30" y1="110" x2="240" y2="110" stroke={TXT} strokeWidth="1.5"/>
      <line x1="30" y1="15"  x2="30"  y2="110" stroke={TXT} strokeWidth="1.5"/>
      <Label x={135} y={122} text="TIME →" color={TXT} size={7}/>
      <Label x={20} y={60} text="P↑" color={TXT} size={7} anchor="end"/>
      {[{x:80,y:85,c:'#f87171',l:'Wrong time'},{x:140,y:55,c:'#f59e0b',l:'Wrong price'},{x:175,y:75,c:'#34d399',l:'✓ Both right'}].map(p=>(
        <g key={p.l}>
          <circle cx={p.x} cy={p.y} r="5" fill={p.c} fillOpacity="0.8"/>
          <Label x={p.x} y={p.y-9} text={p.l} color={p.c} size={6.5}/>
        </g>
      ))}
      <Zone x={155} y={60} w={55} h={30} color="#34d399" label="Sweet Spot"/>
      <Label x={130} y={122} text="Valid setup = correct PRICE at correct TIME" color={DIM} size={7}/>
    </Base>
  )
}
export function SeasonalTendenciesDiagram() {
  const qs = [{q:'Q1',dir:'↑ Trending',c:'#34d399'},{q:'Q2',dir:'↓ Reversal',c:'#f87171'},{q:'Q3',dir:'→ Choppy',c:'#f59e0b'},{q:'Q4',dir:'↑ Year-End',c:'#34d399'}]
  return (
    <Base>
      {qs.map((q,i)=>(
        <g key={q.q}>
          <rect x={15+i*58} y={25} width={52} height={80} fill={q.c} fillOpacity="0.08" stroke={q.c} strokeOpacity="0.3" rx="3"/>
          <Label x={41+i*58} y={58} text={q.q} color={q.c} size={12}/>
          <Label x={41+i*58} y={74} text={q.dir} color={q.c} size={6.5}/>
        </g>
      ))}
      <Label x={130} y={122} text="Historical quarterly bias — frame macro direction" color={DIM} size={7}/>
    </Base>
  )
}
export function DailyProfilesDiagram() {
  return (
    <Base>
      <Label x={45}  y={13} text="Run Day" color="#34d399" size={7}/>
      <Label x={130} y={13} text="Seek+Destroy" color="#f59e0b" size={7}/>
      <Label x={210} y={13} text="Consolidation" color="#60a5fa" size={7}/>
      <polyline points="15,105 30,95 45,80 60,62 75,45 90,30 100,18" stroke="#34d399" strokeWidth="2" fill="none"/>
      <polyline points="110,65 120,45 130,25 140,50 150,70 160,45 170,30" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <polyline points="185,55 195,45 205,60 215,48 225,58 235,50 242,55" stroke="#60a5fa" strokeWidth="2" fill="none"/>
      <Label x={130} y={122} text="Identify which profile is forming before trading" color={DIM} size={7}/>
    </Base>
  )
}
export function RunningDayDiagram() {
  return (
    <Base>
      <Candle x={15}  y={98} h={18} bull={true} w={12} wickT={5} wickB={5}/>
      <Candle x={35}  y={80} h={20} bull={true} w={12} wickT={4} wickB={4}/>
      <Candle x={55}  y={62} h={20} bull={true} w={12} wickT={4} wickB={4}/>
      <Candle x={75}  y={44} h={20} bull={true} w={12} wickT={3} wickB={3}/>
      <Candle x={95}  y={28} h={18} bull={true} w={12} wickT={3} wickB={3}/>
      <Candle x={115} y={15} h={16} bull={true} w={12} wickT={3} wickB={3}/>
      <Candle x={135} y={10} h={14} bull={true} w={12} wickT={2} wickB={2}/>
      <Candle x={155} y={8}  h={12} bull={true} w={12} wickT={2} wickB={2}/>
      <Candle x={175} y={6}  h={12} bull={true} w={12} wickT={2} wickB={2}/>
      <Label x={125} y={4} text="RUNNING DAY ↑" color="#34d399" size={8}/>
      <Label x={130} y={122} text="No Judas swing — just trend from open to close" color={DIM} size={7}/>
    </Base>
  )
}
export function PropulsionPhaseDiagram() {
  const sizes = [15,18,22,26,32,38,44]
  return (
    <Base>
      <Label x={130} y={12} text="PROPULSION PHASE" color="#f472b6" size={8}/>
      {sizes.map((h,i)=>(
        <Candle key={i} x={20+i*32} y={100-h} h={h} bull={true} w={12+(i*1.5)} wickT={3} wickB={3}/>
      ))}
      <polyline points={sizes.map((h,i)=>`${26+i*32},${100-h}`).join(' ')} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
      <Label x={130} y={122} text="Candles grow as institutions fully commit to the move" color={DIM} size={7}/>
    </Base>
  )
}

// ── SMC & Models ──────────────────────────────────────────────────────────────
export function MTFADiagram() {
  const tfs = [
    {tf:'Monthly / Weekly',w:220,x:20,c:'#f59e0b',role:'Macro Bias'},
    {tf:'Daily / 4H',w:170,x:45,c:'#34d399',role:'Swing Context'},
    {tf:'1H / 15m',w:120,x:70,c:'#60a5fa',role:'Execution Zone'},
    {tf:'5m / 1m',w:70, x:95,c:'#c084fc',role:'Entry Refinement'},
  ]
  return (
    <Base h={120}>
      {tfs.map((t,i)=>(
        <g key={t.tf}>
          <rect x={t.x} y={18+(i*22)} width={t.w} height={18} fill={t.c} fillOpacity="0.12" stroke={t.c} strokeOpacity="0.3" rx="2"/>
          <Label x={130} y={31+(i*22)} text={`${t.tf} — ${t.role}`} color={t.c} size={6.5}/>
        </g>
      ))}
      <Label x={130} y={112} text="Higher TF always overrides lower TF analysis" color={DIM} size={7}/>
    </Base>
  )
}
export function UnicornModelDiagram() {
  return (
    <Base>
      <polyline points="15,100 45,65 65,78 100,38 120,50" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <line x1="15" y1="78" x2="200" y2="78" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
      <Candle x={120} y={38} h={55} bull={false} wickT={4} wickB={5}/>
      <Label x={138} y={105} text="ChoCH / MSS" color="#f87171" size={7} anchor="start"/>
      <Zone x={120} y={58} w={12} h={20} color="#c084fc" label="FVG"/>
      <Candle x={150} y={52} h={30} bull={true} wickT={3} wickB={4}/>
      <Arrow x1={185} y1={95} x2={165} y2={70} color="#c084fc"/>
      <Label x={187} y={98} text="Enter FVG" color="#c084fc" size={7} anchor="start"/>
      <Label x={130} y={122} text="MSS + entry at FVG within breaker = Unicorn Model" color={DIM} size={7}/>
    </Base>
  )
}
export function RallyBaseDropDiagram() {
  return (
    <Base>
      <polyline points="15,100 50,55 65,62" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={35} y={50} text="Rally" color="#34d399" size={8}/>
      <rect x={50} y={50} width={55} height={30} fill="#c084fc" fillOpacity="0.12" stroke="#c084fc" strokeOpacity="0.4" rx="3"/>
      <Label x={77} y={60} text="Base" color="#c084fc" size={8}/>
      <Label x={77} y={72} text="(Bearish OB)" color="#c084fc" size={6.5}/>
      <polyline points="105,62 130,85 160,105 185,115" stroke="#f87171" strokeWidth="2" fill="none"/>
      <Label x={155} y={102} text="Drop" color="#f87171" size={8}/>
      <Arrow x1={60} y1={115} x2={70} y2={68} color="#c084fc"/>
      <Label x={40} y={120} text="Entry on return" color="#c084fc" size={6.5}/>
      <Label x={130} y={122} text="" color={DIM} size={7}/>
    </Base>
  )
}
export function RallyBaseRallyDiagram() {
  return (
    <Base>
      <polyline points="15,100 50,60 65,68" stroke="#34d399" strokeWidth="2" fill="none"/>
      <Label x={35} y={55} text="Rally" color="#34d399" size={8}/>
      <rect x={50} y={55} width={55} height={28} fill="#34d399" fillOpacity="0.12" stroke="#34d399" strokeOpacity="0.4" rx="3"/>
      <Label x={77} y={66} text="Base" color="#34d399" size={8}/>
      <Label x={77} y={77} text="(Bullish OB)" color="#34d399" size={6.5}/>
      <polyline points="105,65 130,48 155,32 185,15" stroke="#34d399" strokeWidth="2.5" fill="none"/>
      <Label x={165} y={25} text="Rally" color="#34d399" size={9}/>
      <Arrow x1={60} y1={115} x2={68} y2={80} color="#34d399"/>
      <Label x={40} y={120} text="Entry on return" color="#34d399" size={6.5}/>
      <Label x={130} y={122} text="Continuation: Rally → OB Base → Next Rally" color={DIM} size={7}/>
    </Base>
  )
}
export function OpenFloatDiagram() {
  return (
    <Base>
      <line x1="15" y1="62" x2="240" y2="62" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
      <circle cx={15} cy={62} r="4" fill="#f59e0b"/>
      <Label x={17} y={58} text="OPENING PRICE (Float)" color="#f59e0b" size={7.5} anchor="start"/>
      <polyline points="30,62 50,48 70,65 90,52 110,70 130,55 150,72 170,58 190,78 210,60 230,62" stroke={LINE} strokeWidth="1.5" fill="none"/>
      <rect x={15} y={42} width={225} height={20} fill="#f59e0b" fillOpacity="0.04"/>
      <rect x={15} y={62} width={225} height={20} fill="#60a5fa" fillOpacity="0.04"/>
      <Label x={130} y={122} text="Opening price = reference all day; gaps to it get filled" color={DIM} size={7}/>
    </Base>
  )
}
export function ImpliedMoveDiagram() {
  return (
    <Base>
      <Candle x={100} y={38} h={55} bull={true} w={20} wickT={5} wickB={5}/>
      <line x1="50" y1="38" x2="200" y2="38" stroke="#34d399" strokeWidth="1.5"/>
      <line x1="50" y1="93" x2="200" y2="93" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="50" y1="38" x2="50" y2="93" stroke="#f59e0b" strokeWidth="1.5"/>
      <line x1="200" y1="38" x2="200" y2="93" stroke="#f59e0b" strokeWidth="1.5"/>
      <Label x={205} y={68} text="Implied" color="#f59e0b" size={7} anchor="start"/>
      <Label x={205} y={78} text="Move" color="#f59e0b" size={7} anchor="start"/>
      <Label x={205} y={88} text="(ADR)" color="#f59e0b" size={6.5} anchor="start"/>
      <Label x={40} y={35} text="Target" color="#34d399" size={6.5} anchor="end"/>
      <Label x={40} y={96} text="Stop" color="#f87171" size={6.5} anchor="end"/>
      <Label x={130} y={122} text="Expected range based on ADR — set realistic targets" color={DIM} size={7}/>
    </Base>
  )
}
export function SmartMoneyDiagram() {
  return (
    <Base>
      <rect x={15} y={15} width={105} height={95} fill="#34d399" fillOpacity="0.05" stroke="#34d399" strokeOpacity="0.3" rx="4"/>
      <Label x={67} y={32} text="SMART" color="#34d399" size={9}/>
      <Label x={67} y={45} text="MONEY" color="#34d399" size={9}/>
      <Label x={67} y={60} text="Buys discount" color="#34d399" size={6.5}/>
      <Label x={67} y={70} text="Sells premium" color="#34d399" size={6.5}/>
      <Label x={67} y={82} text="Runs stops first" color="#34d399" size={6.5}/>
      <rect x={138} y={15} width={107} height={95} fill="#f87171" fillOpacity="0.05" stroke="#f87171" strokeOpacity="0.3" rx="4"/>
      <Label x={191} y={32} text="DUMB" color="#f87171" size={9}/>
      <Label x={191} y={45} text="MONEY" color="#f87171" size={9}/>
      <Label x={191} y={60} text="Buys breakouts" color="#f87171" size={6.5}/>
      <Label x={191} y={70} text="Sells breakdowns" color="#f87171" size={6.5}/>
      <Label x={191} y={82} text="Stops at swing H/L" color="#f87171" size={6.5}/>
      <Label x={130} y={122} text="ICT methodology = follow smart money flow" color={DIM} size={7}/>
    </Base>
  )
}
export function DumbMoneyDiagram() {
  return (
    <Base>
      <polyline points="15,90 50,55 85,30 100,20" stroke="#34d399" strokeWidth="1.5" fill="none"/>
      <circle cx={100} cy={20} r="4" fill="#f87171"/>
      <Label x={102} y={16} text="Retail BUYS here ↑" color="#f87171" size={7} anchor="start"/>
      <polyline points="100,20 130,45 160,80 190,110" stroke="#f87171" strokeWidth="2" fill="none"/>
      <circle cx={190} cy={110} r="4" fill="#34d399"/>
      <Label x={190} y={122} text="Retail SELLS here ↓" color="#34d399" size={7}/>
      <Label x={60} y={105} text="Predictable behavior" color={DIM} size={7}/>
      <Label x={60} y={116} text="= exploitable by institutions" color="#f59e0b" size={7}/>
    </Base>
  )
}
export function HTFNarrativeDiagram() {
  return (
    <Base>
      {[{tf:'Weekly',y:18,w:220,c:'#f59e0b'},{tf:'Daily',y:45,w:180,c:'#f59e0b'},{tf:'4H',y:72,w:140,c:'#34d399'},{tf:'LTF Entry',y:99,w:100,c:'#60a5fa'}].map(t=>(
        <g key={t.tf}>
          <rect x={(260-t.w)/2} y={t.y} width={t.w} height={18} fill={t.c} fillOpacity="0.1" stroke={t.c} strokeOpacity="0.35" rx="2"/>
          <Label x={130} y={t.y+12} text={`${t.tf} — Bearish`} color={t.c} size={7}/>
        </g>
      ))}
      <Label x={130} y={122} text="All TFs must align to form valid HTF narrative" color={DIM} size={7}/>
    </Base>
  )
}

export function POIDiagram() {
  return (
    <Base>
      <Zone x={55} y={40} w={145} h={44} color="#f59e0b" label=""/>
      <Zone x={55} y={46} w={145} h={32} color="#c084fc" label=""/>
      <Zone x={55} y={52} w={145} h={18} color="#34d399" label=""/>
      <line x1="50" y1="61" x2="215" y2="61" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5,3"/>
      <Label x={208} y={44}  text="FVG"    color="#f59e0b" size={7} anchor="start"/>
      <Label x={208} y={56}  text="OB"     color="#c084fc" size={7} anchor="start"/>
      <Label x={208} y={66}  text="61.8%"  color="#34d399" size={7} anchor="start"/>
      <Label x={130} y={36}  text="POINT OF INTEREST (POI)" color="#f59e0b" size={7.5}/>
      <Arrow x1={155} y1={102} x2={138} y2={76} color="#f59e0b"/>
      <Label x={158} y={107} text="Enter here during kill zone" color={DIM} size={6.5} anchor="start"/>
      <Candle x={22} y={82} h={20} bull={false} wickT={4} wickB={4}/>
      <Candle x={46} y={72} h={22} bull={false} wickT={4} wickB={4}/>
      <Label x={130} y={122} text="FVG + OB + Fib at same price = highest-probability zone" color={DIM} size={7}/>
    </Base>
  )
}

export function CISDDiagram() {
  return (
    <Base>
      {/* Bearish candles leading into sweep */}
      <Candle x={14}  y={42} h={16} bull={false} wickT={3} wickB={3}/>
      <Candle x={34}  y={54} h={18} bull={false} wickT={3} wickB={3}/>
      <Candle x={54}  y={66} h={16} bull={false} wickT={3} wickB={3}/>
      {/* SSL sweep candle — long bearish wick reaching way down */}
      <Candle x={74}  y={76} h={8}  bull={false} wickT={3} wickB={30}/>
      {/* CISD candle — large bull close above swing high */}
      <Candle x={94}  y={98} h={52} bull={true}  wickT={4} wickB={4}/>
      {/* Continuation */}
      <Candle x={114} y={46} h={18} bull={true}  wickT={3} wickB={3}/>
      <Candle x={134} y={30} h={16} bull={true}  wickT={3} wickB={3}/>
      <Candle x={154} y={16} h={14} bull={true}  wickT={3} wickB={3}/>
      {/* Swing high line */}
      <line x1="10" y1="72" x2="200" y2="72" stroke="#34d399" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={204} y={74} text="Swing High" color="#34d399" size={6.5} anchor="start"/>
      {/* SSL level */}
      <line x1="10" y1="108" x2="200" y2="108" stroke="#f87171" strokeWidth="1" strokeDasharray="5,3"/>
      <Label x={204} y={110} text="SSL" color="#f87171" size={6.5} anchor="start"/>
      {/* CISD arrow */}
      <Arrow x1={108} y1={108} x2={108} y2={68} color="#34d399"/>
      <Label x={130} y={52} text="CISD" color="#34d399" size={8.5}/>
      <Label x={78}  y={122} text="SSL swept → CISD close above swing high → entry" color={DIM} size={6.5}/>
    </Base>
  )
}

// ── Diagram registry ──────────────────────────────────────────────────────────
import type { ReactElement } from 'react'
export const DIAGRAMS: Record<string, () => ReactElement> = {
  // Market Structure
  'market-structure':        MarketStructureDiagram,
  'break-of-structure':      BreakOfStructureDiagram,
  'change-of-character':     ChangeOfCharacterDiagram,
  'market-structure-shift':  MSSDiagram,
  'swing-high':              SwingHighDiagram,
  'swing-low':               SwingLowDiagram,
  'equal-highs':             EqualHighsDiagram,
  'equal-lows':              EqualLowsDiagram,
  'relative-equal-highs':    RelativeEqualHighsDiagram,
  'relative-equal-lows':     RelativeEqualLowsDiagram,
  'price-leg':               PriceLegDiagram,
  'anchor-point':            AnchorPointDiagram,
  'price-discovery':         PriceDiscoveryDiagram,
  'failure-swing':           FailureSwingDiagram,
  'fractal':                 FractalDiagram,
  'msb':                     MSBDiagram,
  // Liquidity
  'liquidity':               LiquidityDiagram,
  'buy-side-liquidity':      BuySideLiquidityDiagram,
  'sell-side-liquidity':     SellSideLiquidityDiagram,
  'liquidity-pool':          LiquidityPoolDiagram,
  'liquidity-sweep':         LiquiditySweepDiagram,
  'stop-hunt':               StopHuntDiagram,
  'draw-on-liquidity':       DrawOnLiquidityDiagram,
  'liquidity-void':          LiquidityVoidDiagram,
  'inducement':              InducementDiagram,
  'irl-erl':                 IRL_ERL_Diagram,
  'liquidity-run':           LiquidityRunDiagram,
  'engineered-liquidity':    EngineeredLiquidityDiagram,
  'low-resistance-liquidity-run': LiquidityRunDiagram,
  'trendline-liquidity':     TrendlineLiquidityDiagram,
  'liquidity-grab':          LiquidityGrabDiagram,
  'raid':                    RaidDiagram,
  'two-way-flow':            TwoWayFlowDiagram,
  // Price Delivery
  'fair-value-gap':          FairValueGapDiagram,
  'sibi':                    SIBIDiagram,
  'bisi':                    BISIDiagram,
  'displacement':            DisplacementDiagram,
  'imbalance':               ImbalanceDiagram,
  'rebalancing':             RebalancingDiagram,
  'premium-discount':        PremiumDiscountDiagram,
  'equilibrium':             EquilibriumDiagram,
  'ote':                     OTEDiagram,
  'fibonacci':               FibonacciDiagram,
  'pd-array':                PdArrayDiagram,
  'volume-imbalance':        VolumeImbalanceDiagram,
  'balanced-price-range':    BPRDiagram,
  'retracement':             RetraCementDiagram,
  'expansion':               ExpansionDiagram,
  'consolidation':           ConsolidationDiagram,
  'consequent-encroachment': ConsequentEncroachmentDiagram,
  'inversion-fvg':           InversionFVGDiagram,
  'convergence':             ConvergenceDiagram,
  'retest':                  RetestDiagram,
  'creep':                   CreepDiagram,
  'compression':             CompressionDiagram,
  // Order Blocks
  'order-block':             OrderBlockDiagram,
  'breaker-block':           BreakerBlockDiagram,
  'mitigation-block':        MitigationBlockDiagram,
  'propulsion-block':        PropulsionBlockDiagram,
  'rejection-block':         RejectionBlockDiagram,
  'institutional-candle':    InstitutionalCandleDiagram,
  'void':                    VoidDiagram,
  'point-of-origin':         PointOfOriginDiagram,
  'reclaim':                 ReclaimDiagram,
  // Sessions & Time
  'kill-zones':              KillZonesDiagram,
  'asian-session':           AsianSessionDiagram,
  'asia-range':              AsiaRangeDiagram,
  'london-kill-zone':        LondonKillZoneDiagram,
  'ny-am-kill-zone':         NYAmKillZoneDiagram,
  'ny-pm-kill-zone':         NYPmKillZoneDiagram,
  'ny-lunch':                NYLunchDiagram,
  'macro':                   MacroDiagram,
  'silver-bullet':           SilverBulletDiagram,
  'fomc':                    FOMCDiagram,
  'true-day':                TrueDayDiagram,
  'pdh-pdl':                 PDHPDLDiagram,
  'pwh-pwl':                 PWHPWLDiagram,
  'pmh-pml':                 PMHPMLDiagram,
  'ndog':                    NDOGDiagram,
  'nwog':                    NWOGDiagram,
  'opening-range-gap':       OpeningRangeGapDiagram,
  'cbdr':                    CBDRDiagram,
  'london-close':            LondonCloseDiagram,
  'midnight-open':           MidnightOpenDiagram,
  'adr':                     ADRDiagram,
  'overnight-range':         OvernightRangeDiagram,
  'optimal-time':            OptimalTimeDiagram,
  'session-high-low':        SessionHighLowDiagram,
  // AMD & Bias
  'amd':                     AMDCycleDiagram,
  'accumulation':            AccumulationDiagram,
  'manipulation':            JudasSwingDiagram,
  'distribution':            DistributionDiagram,
  'judas-swing':             JudasSwingDiagram,
  'power-of-three':          PowerOfThreeDiagram,
  'daily-bias':              DailyBiasDiagram,
  'weekly-profile':          WeeklyProfileDiagram,
  'quarterly-shift':         QuarterlyShiftDiagram,
  'ipda':                    IPDADiagram,
  'dealing-range':           DealingRangeDiagram,
  'time-and-price':          TimeAndPriceDiagram,
  'seasonal-tendencies':     SeasonalTendenciesDiagram,
  'daily-profiles':          DailyProfilesDiagram,
  'running-day':             RunningDayDiagram,
  'propulsion-phase':        PropulsionPhaseDiagram,
  // SMC & Models
  'mtfa':                    MTFADiagram,
  'smt-divergence':          SMTDivergenceDiagram,
  'unicorn-model':           UnicornModelDiagram,
  'rally-base-drop':         RallyBaseDropDiagram,
  'rally-base-rally':        RallyBaseRallyDiagram,
  'open-float':              OpenFloatDiagram,
  'implied-move':            ImpliedMoveDiagram,
  'market-maker-buy':        MarketMakerBuyDiagram,
  'market-maker-sell':       MarketMakerSellDiagram,
  'turtle-soup':             TurtleSoupDiagram,
  'smart-money':             SmartMoneyDiagram,
  'dumb-money':              DumbMoneyDiagram,
  'order-flow':              OrderFlowDiagram,
  'flip':                    FlipDiagram,
  'htf-narrative':           HTFNarrativeDiagram,
  'poi':                     POIDiagram,
  'cisd':                    CISDDiagram,
}
