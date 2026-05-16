export type Category =
  | 'Market Structure'
  | 'Liquidity'
  | 'Price Delivery'
  | 'Order Blocks'
  | 'Sessions & Time'
  | 'AMD & Bias'
  | 'SMC & Models'

export interface Term {
  id: string
  term: string
  abbr?: string
  category: Category
  definition: string
  example?: string
  related: string[]
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Market Structure': '#34d399',
  'Liquidity':        '#60a5fa',
  'Price Delivery':   '#f59e0b',
  'Order Blocks':     '#c084fc',
  'Sessions & Time':  '#fb923c',
  'AMD & Bias':       '#f472b6',
  'SMC & Models':     '#14b8a6',
}

export const TERMS: Term[] = [
  // ── Market Structure ──────────────────────────────────────────────────────
  {
    id: 'market-structure',
    term: 'Market Structure',
    category: 'Market Structure',
    definition: 'The framework of swing highs and swing lows that defines the directional bias of price. Bullish market structure consists of higher highs and higher lows. Bearish market structure consists of lower lows and lower highs. ICT reads market structure across multiple timeframes to determine institutional intent.',
    related: ['Swing High', 'Swing Low', 'Break of Structure', 'Change of Character', 'MTFA'],
  },
  {
    id: 'break-of-structure',
    term: 'Break of Structure',
    abbr: 'BOS',
    category: 'Market Structure',
    definition: 'When price breaks a previous swing high (in an uptrend) or swing low (in a downtrend), confirming continuation of the current trend. A BOS is a structural continuation signal — price is expanding in the direction of the prevailing higher timeframe bias.',
    example: 'In a bullish trend, price forms HH-HL-HH. Each break above the previous swing high is a BOS confirming bullish structure.',
    related: ['Change of Character', 'Market Structure', 'Swing High', 'Swing Low'],
  },
  {
    id: 'change-of-character',
    term: 'Change of Character',
    abbr: 'ChoCH',
    category: 'Market Structure',
    definition: 'A break of the most recent swing low in a bullish trend (or swing high in a bearish trend) that signals a potential reversal. Unlike a BOS which confirms continuation, a ChoCH suggests the market may be shifting direction. Used to identify the beginning of a new phase.',
    example: 'Price is making HH-HL. Then price breaks below the last HL — this is a ChoCH signaling possible bearish shift.',
    related: ['Break of Structure', 'Market Structure', 'Market Structure Shift', 'Displacement'],
  },
  {
    id: 'market-structure-shift',
    term: 'Market Structure Shift',
    abbr: 'MSS',
    category: 'Market Structure',
    definition: 'A decisive break of a significant swing point accompanied by displacement (a strong impulsive move), indicating that institutional players have stepped in and shifted market direction. More significant than a standard ChoCH because of the velocity and magnitude of the move.',
    related: ['Change of Character', 'Displacement', 'Order Block', 'Liquidity Sweep'],
  },
  {
    id: 'swing-high',
    term: 'Swing High',
    category: 'Market Structure',
    definition: 'A candle whose high is higher than the highs of the candles immediately to its left and right. Swing highs form the upper boundary of market structure and act as areas where buy side liquidity rests above.',
    related: ['Swing Low', 'Buy Side Liquidity', 'Market Structure', 'Equal Highs'],
  },
  {
    id: 'swing-low',
    term: 'Swing Low',
    category: 'Market Structure',
    definition: 'A candle whose low is lower than the lows of the candles immediately to its left and right. Swing lows form the lower boundary of market structure and act as areas where sell side liquidity rests below.',
    related: ['Swing High', 'Sell Side Liquidity', 'Market Structure', 'Equal Lows'],
  },
  {
    id: 'equal-highs',
    term: 'Equal Highs',
    abbr: 'EQH',
    category: 'Market Structure',
    definition: 'Two or more swing highs at approximately the same price level. Equal highs are a strong liquidity magnet because retail traders place buy stops above them expecting a breakout. ICT expects price to sweep above EQH before reversing or continuing.',
    related: ['Equal Lows', 'Buy Side Liquidity', 'Liquidity Sweep', 'Relative Equal Highs'],
  },
  {
    id: 'equal-lows',
    term: 'Equal Lows',
    abbr: 'EQL',
    category: 'Market Structure',
    definition: 'Two or more swing lows at approximately the same price level. Equal lows pool sell side liquidity below them as retail traders place sell stops there. Price is expected to sweep below EQL to run those stops before moving higher.',
    related: ['Equal Highs', 'Sell Side Liquidity', 'Liquidity Sweep', 'Relative Equal Lows'],
  },
  {
    id: 'relative-equal-highs',
    term: 'Relative Equal Highs',
    abbr: 'REH',
    category: 'Market Structure',
    definition: 'Highs that are close to the same price but not perfectly aligned. They still attract stop orders from retail traders and function as a liquidity target, though less precisely than perfect equal highs.',
    related: ['Equal Highs', 'Buy Side Liquidity'],
  },
  {
    id: 'relative-equal-lows',
    term: 'Relative Equal Lows',
    abbr: 'REL',
    category: 'Market Structure',
    definition: 'Lows that are close but not perfectly equal. They still represent a liquidity pool and act as a draw on price. ICT uses these as targets when seeking stop runs below recent structure.',
    related: ['Equal Lows', 'Sell Side Liquidity'],
  },

  // ── Liquidity ─────────────────────────────────────────────────────────────
  {
    id: 'liquidity',
    term: 'Liquidity',
    category: 'Liquidity',
    definition: 'Orders resting in the market — specifically stop loss orders and limit orders that haven\'t been triggered yet. ICT views price delivery as a process of seeking and collecting liquidity. Institutions need massive order flow to execute their positions, so price gravitates toward areas where many orders are clustered.',
    related: ['Buy Side Liquidity', 'Sell Side Liquidity', 'Liquidity Pool', 'Stop Hunt'],
  },
  {
    id: 'buy-side-liquidity',
    term: 'Buy Side Liquidity',
    abbr: 'BSL',
    category: 'Liquidity',
    definition: 'Buy stop orders resting above swing highs, equal highs, and obvious resistance levels. When retail traders short at resistance, they place stops above the highs — this creates a pool of buy orders. Smart money drives price up to sweep these stops (triggering buy orders they can sell into) before reversing lower.',
    example: 'Price taps above EQH, triggers buy stops, then reverses sharply — BSL has been swept.',
    related: ['Sell Side Liquidity', 'Equal Highs', 'Liquidity Sweep', 'Stop Hunt'],
  },
  {
    id: 'sell-side-liquidity',
    term: 'Sell Side Liquidity',
    abbr: 'SSL',
    category: 'Liquidity',
    definition: 'Sell stop orders resting below swing lows, equal lows, and obvious support levels. Retail longs place stops below support — smart money drives price down to trigger those stops (creating sell orders they can buy against) before reversing higher.',
    example: 'Price dips below EQL, sweeps sell stops, then aggressively reverses up — SSL has been engineered.',
    related: ['Buy Side Liquidity', 'Equal Lows', 'Liquidity Sweep', 'Stop Hunt'],
  },
  {
    id: 'liquidity-pool',
    term: 'Liquidity Pool',
    category: 'Liquidity',
    definition: 'A concentration of resting orders at a specific price level or zone. The larger the pool (more stop orders clustered), the stronger the draw on price. Identified by obvious swing points, equal highs/lows, and areas where many retail traders would logically place stops.',
    related: ['Buy Side Liquidity', 'Sell Side Liquidity', 'Draw on Liquidity'],
  },
  {
    id: 'liquidity-sweep',
    term: 'Liquidity Sweep',
    category: 'Liquidity',
    definition: 'When price temporarily moves beyond a key level to trigger resting orders, then reverses. The sweep is often a single candle or wick that pierces the level. ICT looks for displacement after the sweep as confirmation that institutional orders have been filled and the real move is beginning.',
    example: 'Price wicks below the Asian low, taking sell stops, then closes back above — the sweep has occurred.',
    related: ['Stop Hunt', 'Judas Swing', 'Buy Side Liquidity', 'Sell Side Liquidity', 'Displacement'],
  },
  {
    id: 'stop-hunt',
    term: 'Stop Hunt',
    category: 'Liquidity',
    definition: 'A deliberate engineered move by smart money to trigger retail stop loss orders clustered at predictable levels. Once stops are triggered, the engineered move reverses and the real directional move begins. Stop hunts are not random — they are a systematic feature of how smart money accumulates or distributes positions.',
    related: ['Liquidity Sweep', 'Judas Swing', 'Liquidity Pool'],
  },
  {
    id: 'draw-on-liquidity',
    term: 'Draw on Liquidity',
    abbr: 'DOL',
    category: 'Liquidity',
    definition: 'The target that price is being pulled toward — the next significant pool of liquidity above or below current price. Identifying the DOL gives a trader a directional bias and a logical profit target. Price is always delivering toward the nearest significant liquidity pool in the direction of the HTF bias.',
    example: 'If price broke bullish structure and the next EQH is 50 points above, that EQH is the DOL.',
    related: ['Buy Side Liquidity', 'Sell Side Liquidity', 'Liquidity Pool', 'PD Array'],
  },
  {
    id: 'liquidity-void',
    term: 'Liquidity Void',
    category: 'Liquidity',
    definition: 'A price area that was traversed so quickly that very little trading occurred there — essentially a void of orders. Price tends to return to fill these voids as the market seeks to create two-sided trading at every level. Similar to a Fair Value Gap but used in a broader context.',
    related: ['Fair Value Gap', 'Imbalance', 'Rebalancing'],
  },
  {
    id: 'inducement',
    term: 'Inducement',
    category: 'Liquidity',
    definition: 'A minor liquidity pool deliberately engineered to pull retail traders into a trade in the wrong direction before the real move. Inducement is the bait — price sweeps a small high or low to induce retail entries, before reversing toward the actual target. Recognizing inducement prevents entering too early.',
    example: 'In a downtrend, price makes a small rally creating a minor swing high (inducement). Retail traders go long; price then sweeps that high and collapses toward the real SSL target.',
    related: ['Liquidity Sweep', 'Stop Hunt', 'Draw on Liquidity'],
  },

  // ── Price Delivery ─────────────────────────────────────────────────────────
  {
    id: 'fair-value-gap',
    term: 'Fair Value Gap',
    abbr: 'FVG',
    category: 'Price Delivery',
    definition: 'A three-candle formation where there is a gap between the wick of the first candle and the wick of the third candle, with no overlap. This represents an imbalance in price delivery — price moved so fast in one direction that both sides of the market were not represented. FVGs act as magnets for price to return and rebalance.',
    example: 'Candle 1 high: 100. Candle 2 is large and bullish. Candle 3 low: 105. The gap between 100 and 105 is the FVG.',
    related: ['SIBI', 'BISI', 'Imbalance', 'Rebalancing', 'Displacement'],
  },
  {
    id: 'sibi',
    term: 'Sell Stops Below / Inefficiency',
    abbr: 'SIBI',
    category: 'Price Delivery',
    definition: 'A bearish Fair Value Gap — a downside imbalance where the high of the third candle does not reach the low of the first candle. Price left an inefficiency on the way down. These act as resistance when price returns to them and are used as entry areas in bearish scenarios.',
    related: ['Fair Value Gap', 'BISI', 'Order Block', 'Displacement'],
  },
  {
    id: 'bisi',
    term: 'Buy Stops Above / Inefficiency',
    abbr: 'BISI',
    category: 'Price Delivery',
    definition: 'A bullish Fair Value Gap — an upside imbalance where the low of the third candle does not reach the high of the first candle. Price left an inefficiency on the way up. These act as support when price returns and are entry areas in bullish scenarios.',
    related: ['Fair Value Gap', 'SIBI', 'Order Block', 'Displacement'],
  },
  {
    id: 'displacement',
    term: 'Displacement',
    category: 'Price Delivery',
    definition: 'A strong, impulsive one-directional price move that leaves behind Fair Value Gaps and breaks market structure with authority. Displacement is the signature of institutional order flow entering the market. It is the "D" in ICT\'s PD Array hierarchy — the most important confirmation that real intent is present.',
    example: 'After sweeping SSL, a large 5-minute bullish candle forms that completely engulfs the previous candles — this is displacement.',
    related: ['Fair Value Gap', 'Market Structure Shift', 'Change of Character', 'Power of Three'],
  },
  {
    id: 'imbalance',
    term: 'Imbalance',
    category: 'Price Delivery',
    definition: 'Any area where price moved so quickly that only one side of the market (buyers or sellers) participated. Imbalances represent inefficiencies that the market tends to revisit to allow the other side to trade. All Fair Value Gaps are imbalances, but not all imbalances are FVGs.',
    related: ['Fair Value Gap', 'Liquidity Void', 'Rebalancing'],
  },
  {
    id: 'rebalancing',
    term: 'Rebalancing',
    category: 'Price Delivery',
    definition: 'When price returns to fill an imbalance or FVG, allowing two-sided trading to occur at that level. Rebalancing is normal market behavior and is often where ICT traders look for entries — price returns to the imbalance, fills it, then continues in the original direction.',
    related: ['Fair Value Gap', 'Imbalance', 'Optimal Trade Entry'],
  },
  {
    id: 'premium-discount',
    term: 'Premium / Discount',
    category: 'Price Delivery',
    definition: 'The concept of price being expensive (premium) or cheap (discount) relative to a defined range. Above the 50% equilibrium of a swing range is premium — where sellers look to sell. Below 50% is discount — where buyers look to buy. ICT buys in discount and sells in premium.',
    related: ['Equilibrium', 'Optimal Trade Entry', 'PD Array', 'Fibonacci'],
  },
  {
    id: 'equilibrium',
    term: 'Equilibrium',
    abbr: 'EQ',
    category: 'Price Delivery',
    definition: 'The 50% midpoint of any defined price range (swing high to swing low). Equilibrium represents fair value. ICT looks to buy below EQ (in discount) and sell above EQ (in premium). Often used with the 50% level of a Fibonacci retracement.',
    related: ['Premium / Discount', 'Fibonacci', 'Optimal Trade Entry'],
  },
  {
    id: 'ote',
    term: 'Optimal Trade Entry',
    abbr: 'OTE',
    category: 'Price Delivery',
    definition: 'A Fibonacci-based entry zone between the 61.8% and 79% retracement levels of a displacement move. After a strong impulse (displacement), price often retraces into the OTE zone before continuing. This provides a high-probability entry with favorable risk-to-reward. ICT considers this the "golden zone" for entries.',
    example: 'Price displaces bullishly from 100 to 120 (20-point range). OTE zone is approximately 107.60 to 111.80.',
    related: ['Fibonacci', 'Premium / Discount', 'Displacement', 'Fair Value Gap'],
  },
  {
    id: 'fibonacci',
    term: 'Fibonacci Retracement',
    category: 'Price Delivery',
    definition: 'ICT uses specific Fibonacci levels to identify premium/discount zones and optimal entries. Key levels: 50% (equilibrium), 61.8% (OTE entry), 70.5%, 79% (deep OTE), 88.6% (last level before invalidation). Applied from swing low to swing high in bullish moves, and swing high to swing low in bearish moves.',
    related: ['Optimal Trade Entry', 'Premium / Discount', 'Equilibrium'],
  },
  {
    id: 'pd-array',
    term: 'PD Array',
    abbr: 'PDA',
    category: 'Price Delivery',
    definition: 'Premium / Discount Array — the hierarchy of ICT tools used to determine where price is likely to react. From highest to lowest significance: Old Highs/Lows, Liquidity Voids, Fair Value Gaps, Volume Imbalances, Order Blocks, Breaker Blocks, Mitigation Blocks, Propulsion Blocks, Rejection Blocks.',
    related: ['Fair Value Gap', 'Order Block', 'Breaker Block', 'Premium / Discount'],
  },
  {
    id: 'volume-imbalance',
    term: 'Volume Imbalance',
    category: 'Price Delivery',
    definition: 'Similar to a Fair Value Gap but occurs within a single candle — the close of one candle and the open of the next candle leave a gap. Volume imbalances are less significant than FVGs but still act as potential support/resistance levels where price may pause or react.',
    related: ['Fair Value Gap', 'Imbalance', 'PD Array'],
  },
  {
    id: 'balanced-price-range',
    term: 'Balanced Price Range',
    abbr: 'BPR',
    category: 'Price Delivery',
    definition: 'When a bullish FVG and a bearish FVG overlap, creating a zone where both sides of the market have been represented. The overlap area is the balanced price range — a high-probability reaction zone. Price often reacts sharply from BPRs.',
    related: ['Fair Value Gap', 'SIBI', 'BISI'],
  },

  // ── Order Blocks ──────────────────────────────────────────────────────────
  {
    id: 'order-block',
    term: 'Order Block',
    abbr: 'OB',
    category: 'Order Blocks',
    definition: 'The last opposing candle before a significant move. A bullish order block is the last bearish candle before a bullish displacement — it represents where institutional buy orders were placed. A bearish order block is the last bullish candle before a bearish displacement. Price frequently returns to order blocks before continuing.',
    example: 'Before a strong bull run, the last red candle in the base is the bullish OB. When price returns to that candle, it is entering the institutional buy zone.',
    related: ['Breaker Block', 'Mitigation Block', 'Fair Value Gap', 'Displacement'],
  },
  {
    id: 'breaker-block',
    term: 'Breaker Block',
    category: 'Order Blocks',
    definition: 'A former order block that has been violated — price has broken through it and the OB has "failed." When a bullish OB fails (price falls through it), it becomes a bearish breaker. When a bearish OB fails (price rises through it), it becomes a bullish breaker. Breakers act as significant support/resistance levels.',
    related: ['Order Block', 'Mitigation Block', 'Market Structure'],
  },
  {
    id: 'mitigation-block',
    term: 'Mitigation Block',
    category: 'Order Blocks',
    definition: 'An order block that has been partially "mitigated" — price has returned to it and absorbed some of the resting orders, but not fully broken through. After mitigation, the remaining orders at that level continue to act as support/resistance, often providing another entry opportunity.',
    related: ['Order Block', 'Breaker Block', 'Rebalancing'],
  },
  {
    id: 'propulsion-block',
    term: 'Propulsion Block',
    category: 'Order Blocks',
    definition: 'A specific type of order block that forms within a strong trend, found in areas of rapid price movement. Propulsion blocks indicate continuation rather than reversal and are used to find entries in the direction of the prevailing trend after a pullback.',
    related: ['Order Block', 'PD Array', 'Displacement'],
  },
  {
    id: 'rejection-block',
    term: 'Rejection Block',
    category: 'Order Blocks',
    definition: 'A candle with a significant wick that shows strong rejection of a price level. The wick itself represents an area where orders were present. ICT uses rejection blocks as potential entry areas — when price returns to the upper portion of the wick, it may find support or resistance.',
    related: ['Order Block', 'Liquidity Sweep', 'Stop Hunt'],
  },
  {
    id: 'institutional-candle',
    term: 'Institutional Candle',
    category: 'Order Blocks',
    definition: 'A large, decisive candle that represents significant institutional participation. These candles often form the basis of order blocks. Characterized by large bodies, minimal wicks, and occurring after liquidity has been swept. They signal directional conviction from smart money.',
    related: ['Order Block', 'Displacement', 'Market Structure Shift'],
  },
  {
    id: 'void',
    term: 'Void',
    category: 'Order Blocks',
    definition: 'An area of price that was covered rapidly by an institutional candle or run of candles, leaving a void of resting orders. Voids represent one-sided markets and are targets for price to return to and fill with two-sided participation.',
    related: ['Liquidity Void', 'Fair Value Gap', 'Displacement'],
  },

  // ── Sessions & Time ───────────────────────────────────────────────────────
  {
    id: 'kill-zones',
    term: 'Kill Zones',
    category: 'Sessions & Time',
    definition: 'Specific time windows during the trading day when institutional participation is highest and the highest probability ICT setups occur. The four kill zones are: Asian (7PM-11PM EST), London (2AM-5AM EST), New York AM (8:30AM-11AM EST), and New York PM (1:30PM-4PM EST).',
    related: ['London Kill Zone', 'New York AM Kill Zone', 'New York PM Kill Zone', 'Asian Session', 'Macro'],
  },
  {
    id: 'asian-session',
    term: 'Asian Session',
    category: 'Sessions & Time',
    definition: 'The overnight trading window roughly 6PM-2AM EST (7PM-11PM kill zone). During Asia, price tends to consolidate and establish the high and low of the session (the "Asia range"). This range is a key reference for the London and New York sessions — London often sweeps one side of the Asia range.',
    related: ['Kill Zones', 'Asia Range', 'Judas Swing', 'London Kill Zone'],
  },
  {
    id: 'asia-range',
    term: 'Asia Range',
    category: 'Sessions & Time',
    definition: 'The high and low established during the Asian session. The Asia range high and low are key liquidity levels — buy stops sit above the high, sell stops sit below the low. London session frequently sweeps one side of the Asia range before reversing in the true direction of the day.',
    related: ['Asian Session', 'Liquidity Sweep', 'London Kill Zone', 'Judas Swing'],
  },
  {
    id: 'london-kill-zone',
    term: 'London Kill Zone',
    category: 'Sessions & Time',
    definition: 'The 2AM-5AM EST window when London markets open. One of the highest probability windows for ICT setups. London frequently creates the Judas swing — sweeping one side of the Asia range to engineer liquidity before establishing the true directional move. Many daily high/low formations originate in London.',
    related: ['Kill Zones', 'Judas Swing', 'Asia Range', 'New York AM Kill Zone'],
  },
  {
    id: 'ny-am-kill-zone',
    term: 'New York AM Kill Zone',
    category: 'Sessions & Time',
    definition: 'The 8:30AM-11AM EST window — the highest liquidity and most volatile session of the US trading day. Encompasses the NY open, economic data releases (8:30AM), and the first hour of full US participation. Many of the highest R-multiple ICT setups occur in this window.',
    related: ['Kill Zones', 'New York PM Kill Zone', 'FOMC', 'Macro'],
  },
  {
    id: 'ny-pm-kill-zone',
    term: 'New York PM Kill Zone',
    category: 'Sessions & Time',
    definition: 'The 1:30PM-4PM EST window. After the NY lunch lull (12PM-1:30PM), the PM session often sees directional continuation or the day\'s second significant move. The 1:30PM macro and 3PM silver bullet are key windows within this kill zone.',
    related: ['Kill Zones', 'New York AM Kill Zone', 'Macro', 'NY Lunch'],
  },
  {
    id: 'ny-lunch',
    term: 'NY Lunch',
    category: 'Sessions & Time',
    definition: 'The 12PM-1:30PM EST period when institutional participation drops significantly and retail/algorithmic trading dominates. Price action during lunch is choppy, unreliable, and often reverses the morning move. ICT strongly advises against trading during NY lunch.',
    related: ['New York AM Kill Zone', 'New York PM Kill Zone', 'Kill Zones'],
  },
  {
    id: 'macro',
    term: 'Macro',
    category: 'Sessions & Time',
    definition: 'Specific 20-minute windows during the trading day when algorithmic price delivery is most predictable. Key macros: 8:50-9:10 AM, 9:50-10:10 AM, 10:50-11:10 AM, 1:10-1:30 PM, 2:10-2:30 PM, 3:15-4:00 PM EST. Within macros, ICT looks for the highest quality setups as algo behavior is most consistent.',
    related: ['Kill Zones', 'Silver Bullet', 'Power of Three'],
  },
  {
    id: 'silver-bullet',
    term: 'Silver Bullet',
    category: 'Sessions & Time',
    definition: 'A specific ICT model that operates within defined time windows — 3-4AM, 10-11AM, or 2-3PM EST. The setup involves a liquidity sweep followed by an FVG entry in the direction of the bias. Named for its precision and high probability when the conditions align properly.',
    related: ['Macro', 'Fair Value Gap', 'Liquidity Sweep', 'AMD & Bias'],
  },
  {
    id: 'fomc',
    term: 'FOMC',
    category: 'Sessions & Time',
    definition: 'Federal Open Market Committee announcements — the highest impact economic events in US markets. Released 8 times per year at 2PM EST. ICT advises staying out of the market around FOMC releases due to extreme volatility and unpredictable algorithmic behavior. FOMC sessions often see massive liquidity sweeps in both directions.',
    related: ['New York PM Kill Zone', 'Kill Zones'],
  },
  {
    id: 'true-day',
    term: 'True Day',
    category: 'Sessions & Time',
    definition: 'ICT\'s concept that the trading day begins at midnight (12:00 AM) rather than at the 6PM futures open. The true day high and low are measured from midnight, and reference points like Previous Day High/Low are calculated from this perspective.',
    related: ['PDH / PDL', 'New Day Opening Gap', 'Kill Zones'],
  },
  {
    id: 'pdh-pdl',
    term: 'Previous Day High / Low',
    abbr: 'PDH / PDL',
    category: 'Sessions & Time',
    definition: 'The high and low of the previous trading day. These are key reference levels for the current day — buy stops rest above PDH, sell stops below PDL. ICT frequently uses PDH and PDL as liquidity targets and entry level references.',
    related: ['PWH / PWL', 'PMH / PML', 'Buy Side Liquidity', 'Sell Side Liquidity'],
  },
  {
    id: 'pwh-pwl',
    term: 'Previous Week High / Low',
    abbr: 'PWH / PWL',
    category: 'Sessions & Time',
    definition: 'The high and low from the previous trading week. Significant liquidity pools — stops accumulate above and below these levels over the week. PWH and PWL are often weekly draw on liquidity targets and key reference levels for weekly bias analysis.',
    related: ['PDH / PDL', 'PMH / PML', 'Buy Side Liquidity', 'Weekly Profile'],
  },
  {
    id: 'pmh-pml',
    term: 'Previous Month High / Low',
    abbr: 'PMH / PML',
    category: 'Sessions & Time',
    definition: 'The high and low of the previous calendar month. Major liquidity levels that institutions reference. PMH and PML often serve as long-term draw on liquidity targets and help frame the monthly macro bias.',
    related: ['PDH / PDL', 'PWH / PWL', 'Buy Side Liquidity'],
  },
  {
    id: 'ndog',
    term: 'New Day Opening Gap',
    abbr: 'NDOG',
    category: 'Sessions & Time',
    definition: 'The gap between the previous day\'s closing price (at midnight) and the opening price of the new day. NDOGs tend to be filled as the market seeks to rebalance the gap. ICT uses NDOGs as reference levels for intraday price delivery.',
    related: ['New Week Opening Gap', 'True Day', 'Opening Range Gap'],
  },
  {
    id: 'nwog',
    term: 'New Week Opening Gap',
    abbr: 'NWOG',
    category: 'Sessions & Time',
    definition: 'The gap between Friday\'s closing price and Sunday\'s opening price in futures. NWOGs are significant reference levels that price often fills during the week. A bullish NWOG (gap up on open) suggests bullish bias; a bearish NWOG suggests bearish bias.',
    related: ['New Day Opening Gap', 'Opening Range Gap', 'Weekly Profile'],
  },
  {
    id: 'opening-range-gap',
    term: 'Opening Range Gap',
    abbr: 'ORG',
    category: 'Sessions & Time',
    definition: 'A gap that forms at a session or market open between the previous close and new open. Opening range gaps create imbalances that the market typically seeks to fill. Used as reference levels and potential entry/target zones.',
    related: ['New Day Opening Gap', 'New Week Opening Gap', 'Fair Value Gap'],
  },

  // ── AMD & Bias ────────────────────────────────────────────────────────────
  {
    id: 'amd',
    term: 'AMD Cycle',
    category: 'AMD & Bias',
    definition: 'Accumulation → Manipulation → Distribution. ICT\'s framework for understanding how smart money orchestrates price movement. Accumulation: institutions quietly build positions in a range. Manipulation: a false move (Judas swing) to trap retail traders and engineer liquidity. Distribution: the real directional move begins.',
    related: ['Accumulation', 'Manipulation', 'Distribution', 'Judas Swing', 'Power of Three'],
  },
  {
    id: 'accumulation',
    term: 'Accumulation',
    category: 'AMD & Bias',
    definition: 'The phase in the AMD cycle where institutions quietly build their position in a ranging market. Price appears choppy and directionless. Retail traders often lose money trying to trade the range. ICT identifies accumulation by the consolidating price action before a significant move.',
    related: ['AMD Cycle', 'Manipulation', 'Distribution'],
  },
  {
    id: 'manipulation',
    term: 'Manipulation',
    category: 'AMD & Bias',
    definition: 'The engineered false move in the AMD cycle — designed to trap retail traders in the wrong direction and generate the liquidity needed for institutional distribution. The Judas swing and London sweep of the Asia range are classic manipulation phases. Manipulation is quickly reversed into the true direction.',
    related: ['AMD Cycle', 'Judas Swing', 'Liquidity Sweep', 'Accumulation', 'Distribution'],
  },
  {
    id: 'distribution',
    term: 'Distribution',
    category: 'AMD & Bias',
    definition: 'The true directional move in the AMD cycle — after accumulation and manipulation, institutions distribute their positions by driving price toward the draw on liquidity. Distribution is characterized by displacement and often forms the "C" leg of the Power of Three model.',
    related: ['AMD Cycle', 'Accumulation', 'Manipulation', 'Power of Three', 'Draw on Liquidity'],
  },
  {
    id: 'judas-swing',
    term: 'Judas Swing',
    category: 'AMD & Bias',
    definition: 'The deceptive opening move during London or NY sessions that traps retail traders in the wrong direction before the real move begins. Named for its betrayal of apparent direction. The Judas swing sweeps liquidity on one side before reversing aggressively in the opposite direction.',
    example: 'NY opens bearish, sweeping lows and triggering sell stops. Retail traders short. Price then reverses bullishly and runs all day.',
    related: ['AMD Cycle', 'Manipulation', 'Liquidity Sweep', 'London Kill Zone'],
  },
  {
    id: 'power-of-three',
    term: 'Power of Three',
    abbr: 'Po3',
    category: 'AMD & Bias',
    definition: 'ICT\'s three-phase price delivery model: A (accumulation/consolidation) → B (manipulation/false move) → C (distribution/true move). Applied across all timeframes. On a daily chart: Asia consolidates (A), London manipulates (B), NY distributes (C). Understanding Po3 allows traders to identify which phase price is in.',
    related: ['AMD Cycle', 'Accumulation', 'Manipulation', 'Distribution', 'Kill Zones'],
  },
  {
    id: 'daily-bias',
    term: 'Daily Bias',
    category: 'AMD & Bias',
    definition: 'The expected directional tendency for the trading day, determined by analyzing HTF market structure, draw on liquidity, and the daily candle context. ICT determines daily bias before the session opens. A bullish daily bias means looking for buy setups during AM and PM kill zones; bearish means looking for shorts.',
    related: ['Weekly Profile', 'Draw on Liquidity', 'MTFA', 'AMD Cycle'],
  },
  {
    id: 'weekly-profile',
    term: 'Weekly Profile',
    category: 'AMD & Bias',
    definition: 'The anticipated structure of the trading week based on HTF analysis. ICT identifies weekly profiles such as: Monday low for the week (bullish week — sell Monday, buy the rest), Monday high for the week (bearish week), or midweek reversal patterns. Weekly profiles help frame which days are likely to see highs and lows form.',
    related: ['Daily Bias', 'AMD Cycle', 'PWH / PWL', 'Draw on Liquidity'],
  },
  {
    id: 'quarterly-shift',
    term: 'Quarterly Shift',
    category: 'AMD & Bias',
    definition: 'ICT\'s concept that markets shift macro direction every quarter (Q1-Q4). Each quarter has a specific seasonal tendency. Institutional money repositions at quarterly boundaries, often creating significant reversals at the beginning of new quarters. Part of ICT\'s broader seasonal tendencies framework.',
    related: ['IPDA', 'Daily Bias', 'Weekly Profile'],
  },
  {
    id: 'ipda',
    term: 'Interbank Price Delivery Algorithm',
    abbr: 'IPDA',
    category: 'AMD & Bias',
    definition: 'ICT\'s model for how price is algorithmically delivered between key reference points over time. The algorithm seeks liquidity pools in a defined look-back period (20, 40, or 60 trading days). IPDA looks back 20 days for short-term draws, 40 for intermediate, and 60 for longer-term institutional targets.',
    related: ['Draw on Liquidity', 'PD Array', 'Quarterly Shift'],
  },
  {
    id: 'dealing-range',
    term: 'Dealing Range',
    category: 'AMD & Bias',
    definition: 'A significant swing from a major swing low to a major swing high (or vice versa) that defines the current premium/discount context. ICT uses the dealing range to apply Fibonacci levels and identify where price is expensive or cheap relative to the institutional reference points.',
    related: ['Premium / Discount', 'Equilibrium', 'Fibonacci', 'PD Array'],
  },

  // ── SMC & Models ──────────────────────────────────────────────────────────
  {
    id: 'mtfa',
    term: 'Multiple Time Frame Analysis',
    abbr: 'MTFA',
    category: 'SMC & Models',
    definition: 'The practice of analyzing price across multiple timeframes to build a complete picture before executing a trade. ICT hierarchy: Monthly/Weekly for macro bias → Daily/4H for swing context → 1H for execution zones → 15m/5m for entry refinement. Higher timeframes always take precedence over lower timeframes.',
    related: ['Daily Bias', 'Market Structure', 'Draw on Liquidity'],
  },
  {
    id: 'smt-divergence',
    term: 'SMT Divergence',
    abbr: 'SMT',
    category: 'SMC & Models',
    definition: 'Smart Money Technique Divergence — when two correlated markets (e.g., ES and NQ, or DXY and EUR/USD) fail to confirm each other\'s move. If ES makes a new high but NQ fails to — that divergence signals institutional non-participation and a potential reversal. SMT is a leading indicator of smart money positioning.',
    example: 'ES sweeps a previous high, but NQ makes a lower high. This SMT divergence suggests the ES high is a stop hunt, not a genuine breakout.',
    related: ['Market Structure', 'Liquidity Sweep', 'Daily Bias'],
  },
  {
    id: 'unicorn-model',
    term: 'Unicorn Model',
    category: 'SMC & Models',
    definition: 'A specific ICT setup combining a market structure shift on a lower timeframe with a Fair Value Gap entry. A breaker block forms, price returns to the FVG within the breaker, and the trader enters with a tight stop. Considered one of ICT\'s highest probability patterns when all elements align.',
    related: ['Market Structure Shift', 'Fair Value Gap', 'Breaker Block', 'Order Block'],
  },
  {
    id: 'rally-base-drop',
    term: 'Rally Base Drop',
    abbr: 'RBD',
    category: 'SMC & Models',
    definition: 'A three-phase price pattern: Rally (price moves up) → Base (price consolidates, forming an order block) → Drop (price falls sharply from the base). The base phase is where the bearish order block forms and is a key entry level on the return.',
    related: ['Rally Base Rally', 'Order Block', 'Displacement'],
  },
  {
    id: 'rally-base-rally',
    term: 'Rally Base Rally',
    abbr: 'RBR',
    category: 'SMC & Models',
    definition: 'A bullish continuation pattern: Rally → Base (consolidation/pullback forming a bullish OB) → Rally (continuation). The base forms the bullish order block entry zone. ICT uses RBR structures to find continuation entries in trending markets.',
    related: ['Rally Base Drop', 'Order Block', 'Displacement'],
  },
  {
    id: 'open-float',
    term: 'Opening Price',
    category: 'SMC & Models',
    definition: 'The opening price of a session, day, week, or month. ICT treats opening prices as significant reference levels — particularly midnight open, NY open (9:30 AM), and the weekly open. Price frequently references these levels as support/resistance throughout the session.',
    related: ['New Day Opening Gap', 'Kill Zones', 'Daily Bias'],
  },
  {
    id: 'consequent-encroachment',
    term: 'Consequent Encroachment',
    abbr: 'CE',
    category: 'SMC & Models',
    definition: 'The 50% midpoint of a Fair Value Gap. ICT teaches that price often returns to at least the CE of an FVG before continuing. The CE is the primary entry target within an FVG — rather than the full gap, traders look for entries at the midpoint for better positioning.',
    related: ['Fair Value Gap', 'Equilibrium', 'Rebalancing'],
  },
  {
    id: 'implied-move',
    term: 'Implied Move',
    category: 'SMC & Models',
    definition: 'The expected range of price movement for a given session or timeframe based on historical volatility and institutional reference levels. ICT uses implied moves to set realistic profit targets and understand when a move is overextended.',
    related: ['Daily Bias', 'Kill Zones', 'Draw on Liquidity'],
  },
]

export const CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[]
export const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function getTermsByLetter(letter: string): Term[] {
  return TERMS.filter(t => t.term.toUpperCase().startsWith(letter))
}

export function searchTerms(query: string): Term[] {
  const q = query.toLowerCase()
  return TERMS.filter(t =>
    t.term.toLowerCase().includes(q) ||
    (t.abbr?.toLowerCase().includes(q)) ||
    t.definition.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  )
}
