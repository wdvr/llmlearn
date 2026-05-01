// React SVG diagram components for CUDA modules.
// Each exported component renders a self-contained <svg>.
// Used via ```cudadiagram\nComponentName\n``` fences in module content.

import React from 'react'

// --- Shared style helpers -------------------------------------------------
const COLORS = {
  bg: '#161b22',
  panel: '#1f2630',
  text: '#e6edf3',
  muted: '#8b949e',
  accent: '#58a6ff',
  green: '#3fb950',
  red: '#f85149',
  orange: '#d29922',
  purple: '#a371f7',
  yellow: '#e3b341',
  grid: '#30363d',
}

const FONT = "'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"

const wrapperStyle = (maxWidth = 700) => ({
  width: '100%',
  maxWidth: `${maxWidth}px`,
  height: 'auto',
  display: 'block',
})

// =========================================================================
// 1. ClockSpeedChart — Module 01: Power Wall
// =========================================================================
export const ClockSpeedChart = () => {
  const W = 700, H = 360
  const padL = 60, padR = 30, padT = 30, padB = 50
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xMin = 1993, xMax = 2010
  const yMin = 0, yMax = 4.0

  const xScale = x => padL + ((x - xMin) / (xMax - xMin)) * plotW
  const yScale = y => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH

  const points = [
    { year: 1993, ghz: 0.066, label: 'Pentium (66MHz, 15W)', era: 'single' },
    { year: 1999, ghz: 0.5,   label: 'Pentium III (500MHz, 25W)', era: 'single' },
    { year: 2004, ghz: 3.8,   label: 'Pentium 4 (3.8GHz, 115W)', era: 'single' },
    { year: 2006, ghz: 2.4,   label: 'Core 2 Duo (2.4GHz, 65W)', era: 'multi' },
    { year: 2010, ghz: 3.3,   label: 'Multi-core era', era: 'multi' },
  ]

  const xTicks = [1993, 1996, 1999, 2002, 2006, 2010]
  const yTicks = [0, 1, 2, 3, 4]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="cs-title cs-desc">
      <title id="cs-title">CPU Clock Speed vs Year (the Power Wall)</title>
      <desc id="cs-desc">A line chart showing CPU clock speeds rising from 1993 to 2004, peaking at the Pentium 4 (3.8 GHz, 115 W), then dropping in 2006 as the multi-core era begins.</desc>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={COLORS.muted} strokeWidth="1" />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={COLORS.muted} strokeWidth="1" />

      {/* y ticks */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={padL - 4} y1={yScale(t)} x2={padL} y2={yScale(t)} stroke={COLORS.muted} />
          <line x1={padL} y1={yScale(t)} x2={padL + plotW} y2={yScale(t)} stroke={COLORS.grid} strokeDasharray="2 4" />
          <text x={padL - 8} y={yScale(t) + 4} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="end">{t.toFixed(1)}</text>
        </g>
      ))}
      {/* x ticks */}
      {xTicks.map(t => (
        <g key={t}>
          <line x1={xScale(t)} y1={padT + plotH} x2={xScale(t)} y2={padT + plotH + 4} stroke={COLORS.muted} />
          <text x={xScale(t)} y={padT + plotH + 18} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* axis labels */}
      <text x={padL - 42} y={padT + plotH / 2} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" transform={`rotate(-90 ${padL - 42} ${padT + plotH / 2})`}>Frequency (GHz)</text>
      <text x={padL + plotW / 2} y={H - 10} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle">Year</text>

      {/* line connecting points */}
      <polyline
        fill="none"
        stroke={COLORS.accent}
        strokeWidth="2"
        points={points.map(p => `${xScale(p.year)},${yScale(p.ghz)}`).join(' ')}
      />

      {/* multi-core era shading */}
      <rect x={xScale(2006)} y={padT} width={padL + plotW - xScale(2006)} height={plotH} fill={COLORS.green} fillOpacity="0.06" />
      <text x={xScale(2008)} y={padT + 18} fontFamily={FONT} fontSize="11" fill={COLORS.green} textAnchor="middle">multi-core era</text>

      {/* points */}
      {points.map((p, i) => {
        const cx = xScale(p.year), cy = yScale(p.ghz)
        const color = p.era === 'single' ? COLORS.red : COLORS.green
        return (
          <g key={i}>
            {p.era === 'single' ? (
              <g stroke={color} strokeWidth="2.5">
                <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} />
                <line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} />
              </g>
            ) : (
              <circle cx={cx} cy={cy} r="6" fill="none" stroke={color} strokeWidth="2.5" />
            )}
          </g>
        )
      })}

      {/* annotations */}
      <text x={xScale(2004)} y={yScale(3.8) - 12} fontFamily={FONT} fontSize="11" fill={COLORS.red} textAnchor="middle">Pentium 4 (115W) — power wall</text>
      <text x={xScale(1999)} y={yScale(0.5) + 18} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Pentium III (25W)</text>
      <text x={xScale(2006)} y={yScale(2.4) + 22} fontFamily={FONT} fontSize="11" fill={COLORS.green} textAnchor="middle">Core 2 Duo: clock drops, cores double</text>

      {/* legend */}
      <g transform={`translate(${padL + 12}, ${padT + 8})`}>
        <line x1="0" y1="0" x2="10" y2="10" stroke={COLORS.red} strokeWidth="2" />
        <line x1="0" y1="10" x2="10" y2="0" stroke={COLORS.red} strokeWidth="2" />
        <text x="16" y="9" fontFamily={FONT} fontSize="11" fill={COLORS.text}>single-core era</text>
        <circle cx="115" cy="5" r="5" fill="none" stroke={COLORS.green} strokeWidth="2" />
        <text x="125" y="9" fontFamily={FONT} fontSize="11" fill={COLORS.text}>multi-core era</text>
      </g>

      <text x={W / 2} y={padT - 12} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Clock Speed Over Time: The Power Wall</text>
    </svg>
  )
}

// =========================================================================
// 2. TransferComputeBars — Module 01: vec-add vs matmul time breakdown
// =========================================================================
export const TransferComputeBars = () => {
  const W = 700, H = 260
  const barH = 60, barX = 130, barW = 480
  const yVA = 70, yMM = 170

  const drawBar = (y, segments, label, ai) => (
    <g>
      <text x={barX - 12} y={y + barH / 2 + 5} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="end">{label}</text>
      <text x={barX - 12} y={y + barH / 2 + 22} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="end">{ai}</text>
      {segments.reduce((acc, seg) => {
        const x = barX + (acc.offset / 100) * barW
        const w = (seg.pct / 100) * barW
        acc.nodes.push(
          <g key={seg.label}>
            <rect x={x} y={y} width={w} height={barH} fill={seg.color} stroke={COLORS.bg} strokeWidth="1" />
            {seg.pct >= 5 && (
              <text x={x + w / 2} y={y + barH / 2 - 2} fontFamily={FONT} fontSize="11" fill="#fff" textAnchor="middle">{seg.label}</text>
            )}
            {seg.pct >= 5 && (
              <text x={x + w / 2} y={y + barH / 2 + 14} fontFamily={MONO} fontSize="11" fill="#fff" textAnchor="middle">{seg.pct}%</text>
            )}
          </g>
        )
        acc.offset += seg.pct
        return acc
      }, { offset: 0, nodes: [] }).nodes}
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="tcb-title tcb-desc">
      <title id="tcb-title">Transfer vs Compute time breakdown</title>
      <desc id="tcb-desc">Two horizontal stacked bars. Vector add: 45% transfer-to, 10% compute, 45% transfer-back. Matrix multiply: 2% transfer-to, 96% compute, 2% transfer-back.</desc>

      <text x={W / 2} y={28} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Transfer vs Compute: Where Your Time Goes</text>

      {drawBar(yVA, [
        { label: 'Transfer To', pct: 45, color: COLORS.red },
        { label: 'Compute', pct: 10, color: COLORS.green },
        { label: 'Transfer Back', pct: 45, color: COLORS.red },
      ], 'Vector Add', 'low AI: 1 FLOP / 12 bytes')}

      {drawBar(yMM, [
        { label: 'Xfer', pct: 2, color: COLORS.red },
        { label: 'Compute', pct: 96, color: COLORS.green },
        { label: 'Xfer', pct: 2, color: COLORS.red },
      ], 'Matrix Multiply', 'high AI: O(N) FLOP/byte')}

      {/* legend */}
      <g transform={`translate(${barX}, ${H - 28})`}>
        <rect x="0" y="0" width="14" height="14" fill={COLORS.red} />
        <text x="20" y="11" fontFamily={FONT} fontSize="11" fill={COLORS.text}>PCIe transfer</text>
        <rect x="120" y="0" width="14" height="14" fill={COLORS.green} />
        <text x="140" y="11" fontFamily={FONT} fontSize="11" fill={COLORS.text}>GPU compute</text>
      </g>
    </svg>
  )
}

// =========================================================================
// 3. Block2DGrid — Module 02: 6x8 matrix with 4x4 blocks
// =========================================================================
export const Block2DGrid = () => {
  const cell = 44
  const cols = 8, rows = 8
  const padL = 60, padT = 60
  const W = padL + cols * cell + 30
  const H = padT + rows * cell + 50

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="b2d-title b2d-desc">
      <title id="b2d-title">2D thread layout: 6×8 matrix with 4×4 blocks</title>
      <desc id="b2d-desc">An 8x8 thread grid divided into four 4x4 blocks. The bottom two rows fall outside the 6x8 matrix and are shaded as idle.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">2D Thread Layout: 6×8 Matrix with 4×4 Blocks</text>

      {/* col labels */}
      {Array.from({ length: cols }, (_, c) => (
        <text key={c} x={padL + c * cell + cell / 2} y={padT - 8} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">col {c}</text>
      ))}
      {/* row labels */}
      {Array.from({ length: rows }, (_, r) => (
        <text key={r} x={padL - 8} y={padT + r * cell + cell / 2 + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">row {r}</text>
      ))}

      {/* cells */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const isIdle = r >= 6
          const blockX = Math.floor(c / 4)
          const blockY = Math.floor(r / 4)
          const blockColors = [
            [COLORS.accent, COLORS.purple],
            [COLORS.green, COLORS.orange],
          ]
          const baseColor = blockColors[blockY][blockX]
          const tx = c % 4, ty = r % 4
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={padL + c * cell}
                y={padT + r * cell}
                width={cell}
                height={cell}
                fill={isIdle ? COLORS.panel : baseColor}
                fillOpacity={isIdle ? 0.4 : 0.25}
                stroke={COLORS.grid}
                strokeWidth="1"
              />
              <text
                x={padL + c * cell + cell / 2}
                y={padT + r * cell + cell / 2 - 2}
                fontFamily={MONO}
                fontSize="9"
                fill={isIdle ? COLORS.muted : COLORS.text}
                textAnchor="middle"
              >tx={tx}</text>
              <text
                x={padL + c * cell + cell / 2}
                y={padT + r * cell + cell / 2 + 10}
                fontFamily={MONO}
                fontSize="9"
                fill={isIdle ? COLORS.muted : COLORS.text}
                textAnchor="middle"
              >ty={ty}</text>
            </g>
          )
        })
      )}

      {/* block boundary highlighting */}
      {[0, 1].map(by =>
        [0, 1].map(bx => (
          <rect
            key={`b-${bx}-${by}`}
            x={padL + bx * 4 * cell}
            y={padT + by * 4 * cell}
            width={4 * cell}
            height={4 * cell}
            fill="none"
            stroke={COLORS.text}
            strokeWidth="2"
          />
        ))
      )}

      {/* block labels */}
      <text x={padL + 2 * cell} y={padT + 2 * cell + 4} fontFamily={FONT} fontSize="11" fill="#fff" textAnchor="middle" opacity="0.7">Block(0,0)</text>
      <text x={padL + 6 * cell} y={padT + 2 * cell + 4} fontFamily={FONT} fontSize="11" fill="#fff" textAnchor="middle" opacity="0.7">Block(1,0)</text>
      <text x={padL + 2 * cell} y={padT + 6 * cell + 4} fontFamily={FONT} fontSize="11" fill="#fff" textAnchor="middle" opacity="0.7">Block(0,1)</text>
      <text x={padL + 6 * cell} y={padT + 6 * cell + 4} fontFamily={FONT} fontSize="11" fill="#fff" textAnchor="middle" opacity="0.7">Block(1,1)</text>

      <text x={W / 2} y={H - 20} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Bottom 2 rows are idle (matrix is 6×8 but grid covers 8×8)</text>
    </svg>
  )
}

// =========================================================================
// 4. MemoryPyramid — Module 03: GPU memory hierarchy
// =========================================================================
export const MemoryPyramid = () => {
  const W = 700, H = 420
  const cx = W / 2
  const apexY = 30, baseY = 360
  const totalH = baseY - apexY

  // 4 tiers, top tier narrowest
  const tiers = [
    { name: 'Registers', detail: '~1 KB / thread • ~0 cyc • ~20 TB/s', color: COLORS.green, frac: 0.10 },
    { name: 'Shared Memory', detail: '48–164 KB / block • ~5 cyc • ~12 TB/s', color: COLORS.yellow, frac: 0.20 },
    { name: 'L2 Cache', detail: '6–40 MB • ~50 cyc • ~2 TB/s', color: COLORS.orange, frac: 0.30 },
    { name: 'Global Memory', detail: '8–80 GB • 400–800 cyc • 320–2039 GB/s', color: COLORS.red, frac: 0.40 },
  ]

  let yCur = apexY
  const tierShapes = tiers.map(t => {
    const top = yCur
    const h = t.frac * totalH
    const bot = top + h
    yCur = bot
    // Half-width is proportional to vertical position (linear from 0 at apex to maxHalf at base)
    const maxHalf = 270
    const topHalf = ((top - apexY) / totalH) * maxHalf
    const botHalf = ((bot - apexY) / totalH) * maxHalf
    return { ...t, top, bot, topHalf, botHalf }
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="mp-title mp-desc">
      <title id="mp-title">GPU memory hierarchy pyramid</title>
      <desc id="mp-desc">A pyramid with four tiers from top (smallest, fastest) to bottom (largest, slowest): Registers, Shared Memory, L2 Cache, Global Memory.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">GPU Memory Hierarchy</text>

      {tierShapes.map((t, i) => {
        const points = [
          [cx - t.topHalf, t.top],
          [cx + t.topHalf, t.top],
          [cx + t.botHalf, t.bot],
          [cx - t.botHalf, t.bot],
        ].map(p => p.join(',')).join(' ')
        return (
          <g key={i}>
            <polygon points={points} fill={t.color} fillOpacity="0.35" stroke={t.color} strokeWidth="1.5" />
            <text x={cx} y={t.top + (t.bot - t.top) / 2 - 6} fontFamily={FONT} fontSize="14" fill={COLORS.text} textAnchor="middle" fontWeight="600">{t.name}</text>
            <text x={cx} y={t.top + (t.bot - t.top) / 2 + 12} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle">{t.detail}</text>
          </g>
        )
      })}

      {/* speed/size arrows on sides */}
      <g>
        <text x={40} y={apexY + 10} fontFamily={FONT} fontSize="11" fill={COLORS.green} textAnchor="start">fast</text>
        <text x={40} y={baseY - 4} fontFamily={FONT} fontSize="11" fill={COLORS.red} textAnchor="start">slow</text>
        <line x1={50} y1={apexY + 18} x2={50} y2={baseY - 14} stroke={COLORS.muted} strokeWidth="1" markerEnd="url(#arrow-down)" />
        <text x={W - 40} y={apexY + 10} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="end">small</text>
        <text x={W - 40} y={baseY - 4} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="end">large</text>
        <line x1={W - 50} y1={apexY + 18} x2={W - 50} y2={baseY - 14} stroke={COLORS.muted} strokeWidth="1" markerEnd="url(#arrow-down)" />
      </g>

      <defs>
        <marker id="arrow-down" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 5 9 L 10 0 Z" fill={COLORS.muted} />
        </marker>
      </defs>

      <text x={W / 2} y={H - 15} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Speed: Registers ≫ Shared ≫ L2 ≫ Global · Size: opposite</text>
    </svg>
  )
}

// =========================================================================
// 5. BankConflictBitmap — Module 03: 32-lane bank conflicts
// =========================================================================
export const BankConflictBitmap = () => {
  const W = 740, H = 340
  const cellW = 18, cellH = 22
  const padL = 130, padT = 50
  const banks = 32

  // Each row maps thread t -> bank
  const rows = [
    {
      label: 'No conflict',
      sub: 'stride-1 · 1 cycle',
      color: COLORS.green,
      map: t => t,
    },
    {
      label: '2-way conflict',
      sub: 'stride-2 · 2 cycles',
      color: COLORS.orange,
      map: t => t % 16,
    },
    {
      label: '32-way conflict',
      sub: 'stride-32 · 32 cycles',
      color: COLORS.red,
      map: () => 0,
    },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(760)} role="img" aria-labelledby="bcb-title bcb-desc">
      <title id="bcb-title">Shared memory bank conflict patterns (32 banks)</title>
      <desc id="bcb-desc">Three rows of 32 cells representing memory banks. Top row shows no conflict (each thread hits a different bank). Middle row shows 2-way conflict. Bottom row shows 32-way conflict (all threads hit bank 0).</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Shared Memory Bank Conflicts (32 banks)</text>

      {/* bank header */}
      <text x={padL - 10} y={padT - 12} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">Bank #:</text>
      {[0, 8, 16, 24, 31].map(b => (
        <text key={b} x={padL + b * cellW + cellW / 2} y={padT - 12} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{b}</text>
      ))}

      {rows.map((row, ri) => {
        const y = padT + ri * 90
        // Count hits per bank
        const hits = new Array(banks).fill(0)
        for (let t = 0; t < 32; t++) hits[row.map(t)] += 1

        return (
          <g key={ri}>
            <text x={padL - 10} y={y + cellH / 2 + 4} fontFamily={FONT} fontSize="12" fill={row.color} textAnchor="end" fontWeight="600">{row.label}</text>
            <text x={padL - 10} y={y + cellH / 2 + 20} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">{row.sub}</text>

            {Array.from({ length: banks }, (_, b) => {
              const hitCount = hits[b]
              const opacity = hitCount === 0 ? 0.1 : Math.min(0.3 + hitCount * 0.15, 0.95)
              return (
                <g key={b}>
                  <rect
                    x={padL + b * cellW}
                    y={y}
                    width={cellW - 1}
                    height={cellH}
                    fill={row.color}
                    fillOpacity={opacity}
                    stroke={COLORS.grid}
                    strokeWidth="0.5"
                  />
                  {hitCount > 1 && (
                    <text x={padL + b * cellW + cellW / 2} y={y + cellH / 2 + 4} fontFamily={MONO} fontSize="9" fill="#fff" textAnchor="middle">{hitCount}</text>
                  )}
                </g>
              )
            })}

            {/* example threads label */}
            <text x={padL} y={y + cellH + 18} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>
              {ri === 0 && 'T0→B0, T1→B1, …, T31→B31'}
              {ri === 1 && 'T0,T16→B0  T1,T17→B1  …  (each bank hit by 2)'}
              {ri === 2 && 'T0,T1,…,T31 ALL → Bank 0 (fully serialized)'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// =========================================================================
// 6. TileSlidingPhases — Module 04: Phase 0/1 tile sliding
// =========================================================================
export const TileSlidingPhases = () => {
  const W = 760, H = 360
  const cell = 30
  const gridSize = 6
  const matrixW = gridSize * cell

  const drawMatrix = (x, y, label, highlightCol, highlightRow) => (
    <g>
      <text x={x + matrixW / 2} y={y - 8} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>
      {Array.from({ length: gridSize }).map((_, r) =>
        Array.from({ length: gridSize }).map((_, c) => {
          const isHL = (highlightCol !== null && c >= highlightCol[0] && c < highlightCol[1])
            || (highlightRow !== null && r >= highlightRow[0] && r < highlightRow[1])
          return (
            <rect
              key={`${r}-${c}`}
              x={x + c * cell}
              y={y + r * cell}
              width={cell}
              height={cell}
              fill={isHL ? COLORS.accent : COLORS.panel}
              fillOpacity={isHL ? 0.6 : 0.4}
              stroke={COLORS.grid}
              strokeWidth="0.8"
            />
          )
        })
      )}
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(800)} role="img" aria-labelledby="tsp-title tsp-desc">
      <title id="tsp-title">Tile sliding across phases</title>
      <desc id="tsp-desc">Two phases shown side-by-side. In each phase, matrix A has a vertical tile column highlighted and matrix B has a horizontal tile row highlighted. The tile slides from columns 0:T to T:2T as phases advance.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Tile Sliding: Phase 0 → Phase 1</text>

      {/* Phase 0 */}
      <text x={120} y={62} fontFamily={FONT} fontSize="13" fill={COLORS.accent} textAnchor="middle" fontWeight="600">Phase 0</text>
      {drawMatrix(40, 80, 'A (M×K)', [0, 2], null)}
      {drawMatrix(40 + matrixW + 30, 80, 'B (K×N)', null, [0, 2])}

      {/* arrow */}
      <g transform={`translate(${380}, ${160})`}>
        <line x1="0" y1="0" x2="40" y2="0" stroke={COLORS.accent} strokeWidth="2" markerEnd="url(#arr-right)" />
        <text x="20" y="-8" fontFamily={FONT} fontSize="11" fill={COLORS.accent} textAnchor="middle">slide</text>
      </g>

      {/* Phase 1 */}
      <text x={550} y={62} fontFamily={FONT} fontSize="13" fill={COLORS.purple} textAnchor="middle" fontWeight="600">Phase 1</text>
      {drawMatrix(430, 80, 'A (M×K)', [2, 4], null)}
      {drawMatrix(430 + matrixW + 30, 80, 'B (K×N)', null, [2, 4])}

      <defs>
        <marker id="arr-right" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={COLORS.accent} />
        </marker>
      </defs>

      <text x={W / 2} y={H - 12} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">A tile slides → along columns; B tile slides ↓ along rows</text>
    </svg>
  )
}

// =========================================================================
// 7. MatmulTileDecomposition — Module 04: A x B -> C tile decomposition
// =========================================================================
export const MatmulTileDecomposition = () => {
  const W = 780, H = 380
  const cell = 50
  const gridDim = 3
  const matW = gridDim * cell

  const drawGrid = (x, y, name, labelFn, highlight) => (
    <g>
      <text x={x + matW / 2} y={y - 8} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">{name}</text>
      {Array.from({ length: gridDim }).map((_, r) =>
        Array.from({ length: gridDim }).map((_, c) => {
          const key = `${r}-${c}`
          const hl = highlight && highlight.includes(key)
          return (
            <g key={key}>
              <rect x={x + c * cell} y={y + r * cell} width={cell} height={cell}
                fill={hl ? COLORS.accent : COLORS.panel} fillOpacity={hl ? 0.55 : 0.35}
                stroke={COLORS.grid} strokeWidth="1" />
              <text x={x + c * cell + cell / 2} y={y + r * cell + cell / 2 + 4}
                fontFamily={MONO} fontSize="12" fill={COLORS.text} textAnchor="middle">{labelFn(r, c)}</text>
            </g>
          )
        })
      )}
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(800)} role="img" aria-labelledby="mtd-title mtd-desc">
      <title id="mtd-title">Tile decomposition: A × B → C</title>
      <desc id="mtd-desc">Three 3x3 tile grids. Computing tile C00 requires tiles from row 0 of A (A00, A01, A02) and column 0 of B (B00, B10, B20).</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Tile Decomposition: C00 = A00·B00 + A01·B10 + A02·B20</text>

      {drawGrid(40, 90, 'A (3×3 tiles)', (r, c) => `A${r}${c}`, ['0-0', '0-1', '0-2'])}
      <text x={40 + matW + 20} y={90 + matW / 2 + 5} fontFamily={FONT} fontSize="20" fill={COLORS.accent} textAnchor="middle">×</text>
      {drawGrid(40 + matW + 50, 90, 'B (3×3 tiles)', (r, c) => `B${r}${c}`, ['0-0', '1-0', '2-0'])}
      <text x={40 + 2 * matW + 80} y={90 + matW / 2 + 5} fontFamily={FONT} fontSize="20" fill={COLORS.accent} textAnchor="middle">=</text>
      {drawGrid(40 + 2 * matW + 110, 90, 'C (3×3 tiles)', (r, c) => `C${r}${c}`, ['0-0'])}

      <text x={W / 2} y={H - 30} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">
        Highlighted: A row 0 · B column 0 · C00 (3 phases of multiply-accumulate)
      </text>
      <text x={W / 2} y={H - 12} fontFamily={MONO} fontSize="11" fill={COLORS.green} textAnchor="middle">
        C00 = A00·B00 + A01·B10 + A02·B20
      </text>
    </svg>
  )
}

// =========================================================================
// 8. WarpDivergenceBitmap — Module 05: 32-lane divergence
// =========================================================================
export const WarpDivergenceBitmap = () => {
  const W = 760, H = 340
  const cellW = 18, cellH = 22
  const padL = 180, padT = 60
  const lanes = 32

  // Active mask per step. 1 = active, 0 = masked
  // Diverge on if/else; thread t goes branch A if data[t] == '+', else B.
  const dataPattern = '+-++--++-++--+-+ -++++-+--+-++-++'.replace(/\s/g, '')
  // Steps:
  //  Step 1: ALL 32 (cond eval)
  //  Steps 2-4: branch A active (lanes where data == '+')
  //  Steps 5-7: branch B active (lanes where data == '-')
  //  Step 8: reconverge (all)
  const branchA = lanes => Array.from({ length: lanes }, (_, t) => dataPattern[t] === '+' ? 1 : 0)
  const branchB = lanes => Array.from({ length: lanes }, (_, t) => dataPattern[t] === '-' ? 1 : 0)
  const allOn = lanes => Array.from({ length: lanes }, () => 1)

  const steps = [
    { label: 'Step 1: cond', detail: 'all active', mask: allOn(lanes) },
    { label: 'Step 2: branchA mul', detail: 'A only', mask: branchA(lanes) },
    { label: 'Step 3: branchA add', detail: 'A only', mask: branchA(lanes) },
    { label: 'Step 4: branchA sqrt', detail: 'A only', mask: branchA(lanes) },
    { label: 'Step 5: branchB neg', detail: 'B only', mask: branchB(lanes) },
    { label: 'Step 6: branchB add', detail: 'B only', mask: branchB(lanes) },
    { label: 'Step 7: branchB sqr', detail: 'B only', mask: branchB(lanes) },
    { label: 'Step 8: reconverge', detail: 'all active', mask: allOn(lanes) },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(780)} role="img" aria-labelledby="wdb-title wdb-desc">
      <title id="wdb-title">Warp divergence lane-activity bitmap</title>
      <desc id="wdb-desc">A grid showing 32 warp lanes across 8 instruction steps. Active lanes are filled green; masked lanes are dim. Steps 2-4 only activate the lanes that took branch A; steps 5-7 only branch B.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Warp Divergence: 32 Lanes Over 8 Instruction Steps</text>

      {/* lane number header */}
      {[0, 8, 16, 24, 31].map(l => (
        <text key={l} x={padL + l * cellW + cellW / 2} y={padT - 8} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{l}</text>
      ))}
      <text x={padL - 8} y={padT - 8} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">Lane:</text>

      {steps.map((s, si) => {
        const y = padT + si * (cellH + 4)
        const active = s.mask.reduce((a, v) => a + v, 0)
        return (
          <g key={si}>
            <text x={padL - 8} y={y + cellH / 2 + 4} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="end">{s.label}</text>
            {s.mask.map((v, l) => (
              <rect
                key={l}
                x={padL + l * cellW}
                y={y}
                width={cellW - 1}
                height={cellH}
                fill={v ? COLORS.green : COLORS.panel}
                fillOpacity={v ? 0.7 : 0.3}
                stroke={COLORS.grid}
                strokeWidth="0.5"
              />
            ))}
            <text x={padL + lanes * cellW + 8} y={y + cellH / 2 + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>{active}/32</text>
          </g>
        )
      })}

      <text x={W / 2} y={H - 12} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">
        Total: 8 instruction slots vs 5 without divergence — ~60% overhead for this warp
      </text>
    </svg>
  )
}

// =========================================================================
// 9. Roofline — Module 06 / 12: T4 roofline with kernel positions
// =========================================================================
export const Roofline = () => {
  const W = 760, H = 440
  const padL = 70, padR = 30, padT = 40, padB = 60
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  // log-log axes
  const xMin = 0.05, xMax = 500
  const yMin = 10, yMax = 20000
  const lx = x => Math.log10(x)
  const xScale = x => padL + ((lx(x) - lx(xMin)) / (lx(xMax) - lx(xMin))) * plotW
  const yScale = y => padT + plotH - ((lx(y) - lx(yMin)) / (lx(yMax) - lx(yMin))) * plotH

  const peakBW = 320 // GB/s
  const peakFlops = 8100 // GFLOPs
  const ridgeAI = peakFlops / peakBW // 25.3

  // Roofline: P(AI) = min(BW * AI, peak)
  const rooflinePts = []
  for (let i = 0; i <= 100; i++) {
    const ai = xMin * Math.pow(xMax / xMin, i / 100)
    const p = Math.min(peakBW * ai, peakFlops)
    rooflinePts.push([xScale(ai), yScale(p)])
  }

  const xTicks = [0.1, 1, 10, 100]
  const yTicks = [10, 100, 1000, 10000]

  const kernels = [
    { ai: 0.08, gflops: peakBW * 0.08, label: 'vec-add', color: COLORS.red },
    { ai: 0.25, gflops: peakBW * 0.25, label: 'reduction', color: COLORS.red },
    { ai: 4.0, gflops: peakBW * 4.0, label: 'tiled-matmul', color: COLORS.orange },
    { ai: 24.5, gflops: peakBW * 24.5, label: 'conv', color: COLORS.orange },
    { ai: 170, gflops: peakFlops, label: 'matmul (cuBLAS)', color: COLORS.green },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(780)} role="img" aria-labelledby="rf-title rf-desc">
      <title id="rf-title">T4 GPU Roofline plot</title>
      <desc id="rf-desc">A log-log roofline chart: a sloped memory-bound region (slope = 320 GB/s) meets a flat compute ceiling at 8100 GFLOPs. The ridge point is at AI = 25.3 FLOP/byte. Kernel positions: vec-add 0.08, reduction 0.25, tiled-matmul 4.0, conv 24.5, matmul 170.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">T4 GPU Roofline (FP32)</text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={COLORS.muted} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={COLORS.muted} />

      {/* y ticks */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={padL} y1={yScale(t)} x2={padL + plotW} y2={yScale(t)} stroke={COLORS.grid} strokeDasharray="2 4" />
          <line x1={padL - 4} y1={yScale(t)} x2={padL} y2={yScale(t)} stroke={COLORS.muted} />
          <text x={padL - 8} y={yScale(t) + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">{t}</text>
        </g>
      ))}
      {xTicks.map(t => (
        <g key={t}>
          <line x1={xScale(t)} y1={padT + plotH} x2={xScale(t)} y2={padT + plotH + 4} stroke={COLORS.muted} />
          <text x={xScale(t)} y={padT + plotH + 18} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* axis titles */}
      <text x={padL + plotW / 2} y={H - 28} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle">Arithmetic Intensity (FLOP / byte) — log scale</text>
      <text x={20} y={padT + plotH / 2} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" transform={`rotate(-90 20 ${padT + plotH / 2})`}>Performance (GFLOPS) — log</text>

      {/* memory-bound shading */}
      <polygon
        points={`${xScale(xMin)},${padT + plotH} ${xScale(ridgeAI)},${yScale(peakFlops)} ${xScale(xMin)},${yScale(peakFlops)}`}
        fill={COLORS.red}
        fillOpacity="0.06"
      />
      {/* compute-bound shading */}
      <polygon
        points={`${xScale(ridgeAI)},${yScale(peakFlops)} ${xScale(xMax)},${yScale(peakFlops)} ${xScale(xMax)},${padT + plotH} ${xScale(ridgeAI)},${padT + plotH}`}
        fill={COLORS.green}
        fillOpacity="0.06"
      />

      {/* roofline */}
      <polyline
        fill="none"
        stroke={COLORS.accent}
        strokeWidth="2.5"
        points={rooflinePts.map(p => p.join(',')).join(' ')}
      />

      {/* peak compute label */}
      <text x={padL + plotW - 8} y={yScale(peakFlops) - 6} fontFamily={MONO} fontSize="11" fill={COLORS.accent} textAnchor="end">Peak: 8100 GFLOPS</text>
      <text x={xScale(0.3)} y={yScale(peakBW * 0.3) - 6} fontFamily={MONO} fontSize="11" fill={COLORS.accent} transform={`rotate(-32 ${xScale(0.3)} ${yScale(peakBW * 0.3) - 6})`}>BW: 320 GB/s</text>

      {/* ridge point */}
      <line x1={xScale(ridgeAI)} y1={yScale(peakFlops)} x2={xScale(ridgeAI)} y2={padT + plotH} stroke={COLORS.muted} strokeDasharray="3 3" />
      <text x={xScale(ridgeAI)} y={padT + plotH - 6} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">ridge AI=25.3</text>

      {/* kernels */}
      {kernels.map((k, i) => {
        const cx = xScale(k.ai)
        const cy = yScale(k.gflops)
        const labelLeft = k.ai > 50
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill={k.color} stroke="#fff" strokeWidth="1" />
            <text
              x={labelLeft ? cx - 8 : cx + 8}
              y={cy + 4}
              fontFamily={MONO}
              fontSize="10"
              fill={COLORS.text}
              textAnchor={labelLeft ? 'end' : 'start'}
            >{k.label} ({k.ai})</text>
          </g>
        )
      })}

      {/* region labels */}
      <text x={xScale(0.4)} y={padT + 14} fontFamily={FONT} fontSize="11" fill={COLORS.red} textAnchor="middle">memory-bound</text>
      <text x={xScale(80)} y={padT + 14} fontFamily={FONT} fontSize="11" fill={COLORS.green} textAnchor="middle">compute-bound</text>
    </svg>
  )
}

// =========================================================================
// 10. HaloTileNesting — Module 07: halo + tile concentric rectangles
// =========================================================================
export const HaloTileNesting = () => {
  const W = 700, H = 440
  // Coordinates: outer = global image (40-units), tile+halo = 20x20, inner = 16x16
  const cell = 16
  const innerN = 16
  const haloN = 20 // 16 + 2*2
  const outerN = 30 // global image visible portion

  const cx = W / 2, cy = 230
  const outerW = outerN * cell
  const haloW = haloN * cell
  const innerW = innerN * cell

  const ox = cx - outerW / 2
  const oy = cy - outerW / 2
  const hx = cx - haloW / 2
  const hy = cy - haloW / 2
  const ix = cx - innerW / 2
  const iy = cy - innerW / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="htn-title htn-desc">
      <title id="htn-title">Halo + tile nested layout</title>
      <desc id="htn-desc">Three concentric rectangles: outer is the global input image, the middle is the shared-memory tile of 20x20 (16 + 2*radius), inner is the 16x16 output tile.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Halo + Tile Layout (radius=2, output tile 16×16)</text>

      {/* Outer global */}
      <rect x={ox} y={oy} width={outerW} height={outerW} fill={COLORS.panel} fillOpacity="0.4" stroke={COLORS.muted} strokeWidth="1.5" />
      <text x={cx} y={oy - 8} fontFamily={FONT} fontSize="12" fill={COLORS.muted} textAnchor="middle">Global input image</text>

      {/* Halo+tile (20x20) - shaded */}
      <rect x={hx} y={hy} width={haloW} height={haloW} fill={COLORS.orange} fillOpacity="0.3" stroke={COLORS.orange} strokeWidth="1.5" />
      {/* Output tile (16x16) inside halo - cut out shading via opaque inner */}
      <rect x={ix} y={iy} width={innerW} height={innerW} fill={COLORS.green} fillOpacity="0.45" stroke={COLORS.green} strokeWidth="2" />

      {/* labels */}
      <text x={cx} y={hy - 8} fontFamily={MONO} fontSize="11" fill={COLORS.orange} textAnchor="middle">Shared memory tile: 20×20 = 400 elements</text>
      <text x={cx} y={cy + 4} fontFamily={FONT} fontSize="13" fill="#fff" textAnchor="middle" fontWeight="600">Output Tile</text>
      <text x={cx} y={cy + 22} fontFamily={MONO} fontSize="11" fill="#fff" textAnchor="middle">16×16 = 256 elements</text>

      {/* Halo annotations */}
      <text x={hx + haloW / 2} y={iy - 4} fontFamily={MONO} fontSize="10" fill={COLORS.orange} textAnchor="middle">halo (r=2)</text>

      {/* Side-arrow showing halo width */}
      <line x1={hx} y1={hy + haloW + 10} x2={ix} y2={hy + haloW + 10} stroke={COLORS.orange} strokeWidth="1" markerEnd="url(#arr-r2)" markerStart="url(#arr-l2)" />
      <text x={(hx + ix) / 2} y={hy + haloW + 24} fontFamily={MONO} fontSize="10" fill={COLORS.orange} textAnchor="middle">r=2</text>

      <defs>
        <marker id="arr-r2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={COLORS.orange} />
        </marker>
        <marker id="arr-l2" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 10 0 L 0 5 L 10 10 Z" fill={COLORS.orange} />
        </marker>
      </defs>

      <text x={W / 2} y={H - 16} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Halo overhead: 400/256 = 56% extra storage</text>
    </svg>
  )
}

// =========================================================================
// Helper: butterfly diagram primitive
// =========================================================================
const Butterfly = ({ title, desc, rows, w = 720 }) => {
  const cellW = 56, cellH = 36
  const padL = 110, padT = 60
  const rowGap = 80
  const N = 8
  const H = padT + rows.length * rowGap + 60
  const W = w

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(740)} role="img" aria-label={title}>
      <title>{title}</title>
      <desc>{desc}</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">{title}</text>

      <defs>
        <marker id="arr-bf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={COLORS.accent} />
        </marker>
      </defs>

      {rows.map((row, ri) => {
        const y = padT + ri * rowGap
        const prevY = padT + (ri - 1) * rowGap + cellH
        return (
          <g key={ri}>
            <text x={padL - 12} y={y + cellH / 2 + 4} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="end">{row.label}</text>

            {/* arrows from previous row to this row */}
            {ri > 0 && row.arrows && row.arrows.map((a, ai) => {
              const x1 = padL + a.from * cellW + cellW / 2
              const x2 = padL + a.to * cellW + cellW / 2
              return (
                <path
                  key={ai}
                  d={`M ${x1} ${prevY} Q ${(x1 + x2) / 2} ${(prevY + y) / 2} ${x2} ${y}`}
                  fill="none"
                  stroke={COLORS.accent}
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  markerEnd="url(#arr-bf)"
                />
              )
            })}

            {/* cells */}
            {row.values.map((v, c) => (
              <g key={c}>
                <rect
                  x={padL + c * cellW}
                  y={y}
                  width={cellW - 4}
                  height={cellH}
                  fill={row.activeCells && row.activeCells.includes(c) ? COLORS.green : COLORS.panel}
                  fillOpacity={row.activeCells && row.activeCells.includes(c) ? 0.45 : 0.4}
                  stroke={COLORS.grid}
                />
                <text
                  x={padL + c * cellW + (cellW - 4) / 2}
                  y={y + cellH / 2 + 4}
                  fontFamily={MONO}
                  fontSize="11"
                  fill={COLORS.text}
                  textAnchor="middle"
                >{v}</text>
              </g>
            ))}
          </g>
        )
      })}

      <text x={W / 2} y={H - 14} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Input: [3,1,7,0,4,1,6,3] → Output: [3,4,11,11,15,16,22,25]</text>
    </svg>
  )
}

// =========================================================================
// 11. HillisSteeleButterfly — Module 09
// =========================================================================
export const HillisSteeleButterfly = () => {
  const rows = [
    { label: 'input', values: [3, 1, 7, 0, 4, 1, 6, 3] },
    {
      label: 'd=0 (stride 1)',
      values: [3, 4, 8, 7, 4, 5, 7, 9],
      arrows: [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
        { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 },
      ],
    },
    {
      label: 'd=1 (stride 2)',
      values: [3, 4, 11, 11, 12, 12, 11, 14],
      arrows: [
        { from: 0, to: 2 }, { from: 1, to: 3 },
        { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 7 },
      ],
    },
    {
      label: 'd=2 (stride 4)',
      values: [3, 4, 11, 11, 15, 16, 22, 25],
      arrows: [
        { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 },
      ],
    },
  ]
  return (
    <Butterfly
      title="Hillis-Steele scan: stride doubling"
      desc="Four rows of 8 cells each. Each step doubles the stride, with arrows from each cell to the cell stride away that consumes its value."
      rows={rows}
    />
  )
}

// =========================================================================
// 12. BrentKungButterfly — Module 09
// =========================================================================
export const BrentKungButterfly = () => {
  const rows = [
    { label: 'input', values: [3, 1, 7, 0, 4, 1, 6, 3] },
    // up-sweep stride 1
    {
      label: 'up d=0 (s=1)',
      values: [3, 4, 7, 7, 4, 5, 6, 9],
      arrows: [
        { from: 0, to: 1 }, { from: 2, to: 3 }, { from: 4, to: 5 }, { from: 6, to: 7 },
      ],
    },
    // up-sweep stride 2
    {
      label: 'up d=1 (s=2)',
      values: [3, 4, 7, 11, 4, 5, 6, 14],
      arrows: [
        { from: 1, to: 3 }, { from: 5, to: 7 },
      ],
    },
    // up-sweep stride 4
    {
      label: 'up d=2 (s=4)',
      values: [3, 4, 7, 11, 4, 5, 6, 25],
      arrows: [
        { from: 3, to: 7 },
      ],
    },
    // down-sweep
    {
      label: 'down sweep',
      values: [3, 4, 11, 11, 15, 16, 22, 25],
      arrows: [
        { from: 3, to: 5 }, { from: 1, to: 2 },
        { from: 1, to: 4 }, { from: 5, to: 6 },
      ],
    },
  ]
  return (
    <Butterfly
      title="Brent-Kung scan: up-sweep + down-sweep"
      desc="Five rows showing the Brent-Kung up-sweep phase (pairs combining at increasing strides) and the down-sweep phase that fills in intermediate prefix sums."
      rows={rows}
      w={720}
    />
  )
}

// =========================================================================
// 13. BitonicSortNetwork — Module 10: N=8 sorting network
// =========================================================================
export const BitonicSortNetwork = () => {
  const W = 760, H = 360
  const padL = 50, padR = 30, padT = 60, padB = 40
  const N = 8
  const wireY = i => padT + i * ((H - padT - padB) / (N - 1))
  const stages = [
    // Phase 1 (k=2): pair-wise compare swaps. Stage j=1.
    [{ a: 0, b: 1 }, { a: 2, b: 3 }, { a: 4, b: 5 }, { a: 6, b: 7 }],
    // Phase 2 (k=4): j=2 then j=1
    [{ a: 0, b: 2 }, { a: 1, b: 3 }, { a: 4, b: 6 }, { a: 5, b: 7 }],
    [{ a: 0, b: 1 }, { a: 2, b: 3 }, { a: 4, b: 5 }, { a: 6, b: 7 }],
    // Phase 3 (k=8): j=4, j=2, j=1
    [{ a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }],
    [{ a: 0, b: 2 }, { a: 1, b: 3 }, { a: 4, b: 6 }, { a: 5, b: 7 }],
    [{ a: 0, b: 1 }, { a: 2, b: 3 }, { a: 4, b: 5 }, { a: 6, b: 7 }],
  ]

  const stageGap = (W - padL - padR) / stages.length
  const stageX = i => padL + i * stageGap + stageGap / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(780)} role="img" aria-labelledby="bsn-title bsn-desc">
      <title id="bsn-title">Bitonic sort network N=8</title>
      <desc id="bsn-desc">Eight horizontal wires representing sorted values, with vertical compare-swap connectors at each stage. Phase 1 has 1 stage, Phase 2 has 2 stages, Phase 3 has 3 stages.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Bitonic Sort Network (N=8)</text>

      {/* phase headers */}
      <text x={stageX(0)} y={42} fontFamily={FONT} fontSize="11" fill={COLORS.accent} textAnchor="middle">Phase 1 (k=2)</text>
      <text x={(stageX(1) + stageX(2)) / 2} y={42} fontFamily={FONT} fontSize="11" fill={COLORS.purple} textAnchor="middle">Phase 2 (k=4)</text>
      <text x={(stageX(3) + stageX(5)) / 2} y={42} fontFamily={FONT} fontSize="11" fill={COLORS.green} textAnchor="middle">Phase 3 (k=8)</text>

      {/* wires */}
      {Array.from({ length: N }).map((_, i) => (
        <g key={i}>
          <line x1={padL} y1={wireY(i)} x2={W - padR} y2={wireY(i)} stroke={COLORS.muted} strokeWidth="1" />
          <text x={padL - 6} y={wireY(i) + 4} fontFamily={MONO} fontSize="11" fill={COLORS.muted} textAnchor="end">{i}</text>
        </g>
      ))}

      {/* compare-swap connectors */}
      {stages.map((stage, si) => {
        const phaseColor = si === 0 ? COLORS.accent : si <= 2 ? COLORS.purple : COLORS.green
        return (
          <g key={si}>
            {stage.map((cs, ci) => (
              <g key={ci}>
                <line
                  x1={stageX(si)}
                  y1={wireY(cs.a)}
                  x2={stageX(si)}
                  y2={wireY(cs.b)}
                  stroke={phaseColor}
                  strokeWidth="2"
                />
                <circle cx={stageX(si)} cy={wireY(cs.a)} r="4" fill={phaseColor} />
                <circle cx={stageX(si)} cy={wireY(cs.b)} r="4" fill={phaseColor} />
              </g>
            ))}
          </g>
        )
      })}

      <text x={W / 2} y={H - 12} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Each vertical line = compare-and-swap (top → min, bottom → max)</text>
    </svg>
  )
}

// =========================================================================
// 14. CSRLayout — Module 11: dense + CSR arrays
// =========================================================================
export const CSRLayout = () => {
  const W = 760, H = 460
  const cell = 50
  const padL = 50, padT = 60
  const denseW = 4 * cell

  // dense matrix: 4x4
  const dense = [
    [0, 0, 3, 0],
    [2, 0, 0, 0],
    [0, 5, 0, 1],
    [0, 0, 4, 0],
  ]

  // collect non-zeros into CSR arrays
  const colIdx = []
  const values = []
  const rowptr = [0]
  const positionMap = {} // (r,c) -> nzIndex
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (dense[r][c] !== 0) {
        positionMap[`${r}-${c}`] = colIdx.length
        colIdx.push(c)
        values.push(dense[r][c])
      }
    }
    rowptr.push(colIdx.length)
  }

  const arrayCellW = 50
  const arrayY = (idx) => padT + denseW + 80 + idx * 60
  const arrayX = (i) => padL + 200 + i * arrayCellW

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(780)} role="img" aria-labelledby="csr-title csr-desc">
      <title id="csr-title">CSR sparse matrix layout</title>
      <desc id="csr-desc">A dense 4x4 matrix with 5 non-zero entries, paired with three CSR arrays: rowptr, col_idx, and values. Arrows connect each non-zero in the dense matrix to its slot in col_idx and values.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">CSR (Compressed Sparse Row) Layout</text>

      {/* dense matrix */}
      <text x={padL + denseW / 2} y={padT - 12} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">Dense 4×4 matrix</text>
      {dense.map((row, r) =>
        row.map((v, c) => {
          const isNZ = v !== 0
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={padL + c * cell}
                y={padT + r * cell}
                width={cell}
                height={cell}
                fill={isNZ ? COLORS.accent : COLORS.panel}
                fillOpacity={isNZ ? 0.55 : 0.3}
                stroke={COLORS.grid}
                strokeWidth="1"
              />
              <text
                x={padL + c * cell + cell / 2}
                y={padT + r * cell + cell / 2 + 4}
                fontFamily={MONO}
                fontSize="13"
                fill={isNZ ? '#fff' : COLORS.muted}
                textAnchor="middle"
                fontWeight={isNZ ? '600' : '400'}
              >{v}</text>
            </g>
          )
        })
      )}

      {/* col labels */}
      {[0, 1, 2, 3].map(c => (
        <text key={c} x={padL + c * cell + cell / 2} y={padT - 2} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">c{c}</text>
      ))}
      {[0, 1, 2, 3].map(r => (
        <text key={r} x={padL - 6} y={padT + r * cell + cell / 2 + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">r{r}</text>
      ))}

      {/* CSR arrays - layout to the right of dense */}
      <g>
        {/* rowptr */}
        <text x={padL + 200 - 8} y={padT + 10} fontFamily={MONO} fontSize="12" fill={COLORS.green} textAnchor="end" fontWeight="600">rowptr</text>
        {rowptr.map((v, i) => (
          <g key={i}>
            <rect x={padL + 200 + i * arrayCellW} y={padT} width={arrayCellW - 2} height={32} fill={COLORS.green} fillOpacity="0.3" stroke={COLORS.grid} />
            <text x={padL + 200 + i * arrayCellW + (arrayCellW - 2) / 2} y={padT + 20} fontFamily={MONO} fontSize="12" fill={COLORS.text} textAnchor="middle">{v}</text>
            <text x={padL + 200 + i * arrayCellW + (arrayCellW - 2) / 2} y={padT - 4} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">[{i}]</text>
          </g>
        ))}

        {/* col_idx */}
        <text x={padL + 200 - 8} y={padT + 70} fontFamily={MONO} fontSize="12" fill={COLORS.orange} textAnchor="end" fontWeight="600">col_idx</text>
        {colIdx.map((v, i) => (
          <g key={i}>
            <rect x={padL + 200 + i * arrayCellW} y={padT + 60} width={arrayCellW - 2} height={32} fill={COLORS.orange} fillOpacity="0.3" stroke={COLORS.grid} />
            <text x={padL + 200 + i * arrayCellW + (arrayCellW - 2) / 2} y={padT + 80} fontFamily={MONO} fontSize="12" fill={COLORS.text} textAnchor="middle">{v}</text>
            <text x={padL + 200 + i * arrayCellW + (arrayCellW - 2) / 2} y={padT + 56} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">[{i}]</text>
          </g>
        ))}

        {/* values */}
        <text x={padL + 200 - 8} y={padT + 130} fontFamily={MONO} fontSize="12" fill={COLORS.purple} textAnchor="end" fontWeight="600">values</text>
        {values.map((v, i) => (
          <g key={i}>
            <rect x={padL + 200 + i * arrayCellW} y={padT + 120} width={arrayCellW - 2} height={32} fill={COLORS.purple} fillOpacity="0.3" stroke={COLORS.grid} />
            <text x={padL + 200 + i * arrayCellW + (arrayCellW - 2) / 2} y={padT + 140} fontFamily={MONO} fontSize="12" fill={COLORS.text} textAnchor="middle">{v}</text>
          </g>
        ))}
      </g>

      {/* arrows from dense non-zeros to values slot */}
      <defs>
        <marker id="arr-csr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={COLORS.accent} fillOpacity="0.6" />
        </marker>
      </defs>
      {Object.entries(positionMap).map(([key, idx]) => {
        const [r, c] = key.split('-').map(Number)
        const x1 = padL + c * cell + cell
        const y1 = padT + r * cell + cell / 2
        const x2 = padL + 200 + idx * arrayCellW + (arrayCellW - 2) / 2
        const y2 = padT + 120
        return (
          <path
            key={key}
            d={`M ${x1} ${y1} C ${x1 + 30} ${y1}, ${x2} ${y2 - 30}, ${x2} ${y2}`}
            fill="none"
            stroke={COLORS.accent}
            strokeOpacity="0.45"
            strokeWidth="1"
            markerEnd="url(#arr-csr)"
          />
        )
      })}

      <text x={W / 2} y={H - 22} fontFamily={MONO} fontSize="11" fill={COLORS.muted} textAnchor="middle">
        rowptr[i] = start index of row i in col_idx/values · row i length = rowptr[i+1] − rowptr[i]
      </text>
      <text x={W / 2} y={H - 6} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">
        Row 2 lookup: rowptr[2]=2, rowptr[3]=4 → cols=[1,3], vals=[5,1]
      </text>
    </svg>
  )
}

// =========================================================================
// 15. ThreadTileGrid16x16 — Module 12: 16x16 thread tiles over 32x32
// =========================================================================
export const ThreadTileGrid16x16 = () => {
  const W = 720, H = 720
  const padL = 60, padT = 60
  const cell = 36
  const subN = 16
  const totalW = subN * cell

  // Highlighted thread tile (ty=2, tx=3)
  const HL_TY = 2, HL_TX = 3

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="ttg-title ttg-desc">
      <title id="ttg-title">16×16 thread-tile grid (32×32 output)</title>
      <desc id="ttg-desc">A 16x16 grid of thread tiles. Each tile is a 2x2 register block (4 output elements). Thread (ty=2, tx=3) is highlighted, computing C[4,6], C[4,7], C[5,6], C[5,7].</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Output tile C (32×32) — 16×16 threads, each computes 2×2 sub-tile</text>

      {/* col group labels */}
      {Array.from({ length: subN }).map((_, c) => (
        c % 2 === 0 ? <text key={c} x={padL + c * cell + cell / 2} y={padT - 8} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">tx={c}</text> : null
      ))}
      {Array.from({ length: subN }).map((_, r) => (
        r % 2 === 0 ? <text key={r} x={padL - 8} y={padT + r * cell + cell / 2 + 3} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="end">ty={r}</text> : null
      ))}

      {/* tiles */}
      {Array.from({ length: subN }).map((_, ty) =>
        Array.from({ length: subN }).map((_, tx) => {
          const isHL = ty === HL_TY && tx === HL_TX
          return (
            <g key={`${ty}-${tx}`}>
              <rect
                x={padL + tx * cell}
                y={padT + ty * cell}
                width={cell - 1}
                height={cell - 1}
                fill={isHL ? COLORS.accent : COLORS.panel}
                fillOpacity={isHL ? 0.7 : 0.35}
                stroke={isHL ? '#fff' : COLORS.grid}
                strokeWidth={isHL ? 2 : 0.6}
              />
              {/* internal 2x2 quadrant */}
              <line x1={padL + tx * cell + cell / 2} y1={padT + ty * cell} x2={padL + tx * cell + cell / 2} y2={padT + ty * cell + cell - 1} stroke={COLORS.grid} strokeWidth="0.4" />
              <line x1={padL + tx * cell} y1={padT + ty * cell + cell / 2} x2={padL + tx * cell + cell - 1} y2={padT + ty * cell + cell / 2} stroke={COLORS.grid} strokeWidth="0.4" />
              {(isHL || (tx % 4 === 0 && ty % 4 === 0)) && (
                <text x={padL + tx * cell + cell / 2} y={padT + ty * cell + cell / 2 + 3} fontFamily={MONO} fontSize="8" fill={isHL ? '#fff' : COLORS.muted} textAnchor="middle">T{ty},{tx}</text>
              )}
            </g>
          )
        })
      )}

      {/* annotation */}
      <g transform={`translate(${padL + (HL_TX + 1) * cell + 20}, ${padT + HL_TY * cell})`}>
        <line x1="-20" y1={cell / 2} x2="0" y2={cell / 2} stroke={COLORS.accent} strokeWidth="1.5" />
        <text x="4" y={cell / 2 - 4} fontFamily={MONO} fontSize="10" fill={COLORS.accent}>Thread (ty=2, tx=3):</text>
        <text x="4" y={cell / 2 + 10} fontFamily={MONO} fontSize="10" fill={COLORS.text}>C[4,6], C[4,7],</text>
        <text x="4" y={cell / 2 + 22} fontFamily={MONO} fontSize="10" fill={COLORS.text}>C[5,6], C[5,7]</text>
      </g>

      <text x={W / 2} y={H - 14} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">Each 2×2 sub-tile lives in registers (4 accumulators per thread)</text>
    </svg>
  )
}

// =========================================================================
// FloatFormatBits — PyTorch Module 1: dtype anatomy (sign/exponent/mantissa)
// =========================================================================
export const FloatFormatBits = () => {
  const W = 720, H = 320
  const padL = 90, padR = 130
  const stripW = W - padL - padR // pixels for 64 bits
  const bitPx = stripW / 64
  const stripH = 30
  const gap = 18

  const formats = [
    { name: 'fp64', sign: 1, exp: 11, mant: 52, tag: 'Range ~10^±308 · Not on MPS', tagColor: COLORS.red },
    { name: 'fp32', sign: 1, exp: 8,  mant: 23, tag: 'Default · Range ~10^±38',   tagColor: COLORS.muted },
    { name: 'bf16', sign: 1, exp: 8,  mant: 7,  tag: 'Same range as fp32 · Training friendly', tagColor: COLORS.green, badge: 'range' },
    { name: 'fp16', sign: 1, exp: 5,  mant: 10, tag: 'Range ~10^±5 · Underflow risk', tagColor: COLORS.orange, badge: 'precision' },
  ]

  const startY = 50

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="ffb-title ffb-desc">
      <title id="ffb-title">Floating-point dtype anatomy</title>
      <desc id="ffb-desc">Bit-strip comparison of fp64, fp32, bf16, and fp16 showing how sign, exponent, and mantissa bits divide each format. bf16 trades mantissa precision for fp32-equivalent exponent range; fp16 has narrow range and underflows.</desc>

      <text x={W / 2} y={24} fontFamily={FONT} fontSize="14" fill={COLORS.text} textAnchor="middle" fontWeight="600">Floating-Point Format Anatomy: Sign · Exponent · Mantissa</text>

      {formats.map((f, i) => {
        const y = startY + i * (stripH + gap)
        const total = f.sign + f.exp + f.mant
        const x0 = padL
        const wSign = f.sign * bitPx
        const wExp = f.exp * bitPx
        const wMant = f.mant * bitPx
        const totalW = wSign + wExp + wMant
        return (
          <g key={f.name}>
            {/* dtype label on left */}
            <text x={padL - 10} y={y + stripH / 2 + 4} fontFamily={MONO} fontSize="13" fill={COLORS.text} textAnchor="end">{f.name}</text>

            {/* sign field */}
            <rect x={x0} y={y} width={wSign} height={stripH} fill={COLORS.red} stroke={COLORS.bg} />
            {/* exponent field */}
            <rect x={x0 + wSign} y={y} width={wExp} height={stripH} fill={COLORS.orange} stroke={COLORS.bg} />
            {/* mantissa field */}
            <rect x={x0 + wSign + wExp} y={y} width={wMant} height={stripH} fill={COLORS.accent} stroke={COLORS.bg} />

            {/* bit count labels inside fields if wide enough */}
            {wExp > 18 && (
              <text x={x0 + wSign + wExp / 2} y={y + stripH / 2 + 4} fontFamily={MONO} fontSize="11" fill="#fff" textAnchor="middle">{f.exp}</text>
            )}
            {wMant > 18 && (
              <text x={x0 + wSign + wExp + wMant / 2} y={y + stripH / 2 + 4} fontFamily={MONO} fontSize="11" fill="#fff" textAnchor="middle">{f.mant}</text>
            )}

            {/* total bits label on right of strip */}
            <text x={x0 + totalW + 8} y={y + stripH / 2 + 4} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>{total} bits</text>

            {/* tag below strip */}
            <text x={x0} y={y + stripH + 13} fontFamily={FONT} fontSize="10" fill={f.tagColor}>{f.tag}</text>

            {/* badge */}
            {f.badge && (
              <g>
                <rect x={W - padR + 8} y={y + 4} width={70} height={stripH - 8} rx="4" fill={f.badge === 'range' ? COLORS.green : COLORS.orange} fillOpacity="0.18" stroke={f.badge === 'range' ? COLORS.green : COLORS.orange} />
                <text x={W - padR + 43} y={y + stripH / 2 + 4} fontFamily={FONT} fontSize="10" fill={f.badge === 'range' ? COLORS.green : COLORS.orange} textAnchor="middle" fontWeight="600">{f.badge}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* axis with bit ticks */}
      {(() => {
        const axisY = startY + formats.length * (stripH + gap) + 4
        const ticks = [0, 16, 32, 48, 64]
        return (
          <g>
            <line x1={padL} y1={axisY} x2={padL + 64 * bitPx} y2={axisY} stroke={COLORS.muted} />
            {ticks.map(t => (
              <g key={t}>
                <line x1={padL + t * bitPx} y1={axisY} x2={padL + t * bitPx} y2={axisY + 4} stroke={COLORS.muted} />
                <text x={padL + t * bitPx} y={axisY + 16} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{t}</text>
              </g>
            ))}
            <text x={padL + 32 * bitPx} y={axisY + 30} fontFamily={FONT} fontSize="11" fill={COLORS.muted} textAnchor="middle">bit position</text>
          </g>
        )
      })()}

      {/* legend */}
      <g transform={`translate(${padL}, ${H - 14})`}>
        <rect x="0" y="-9" width="10" height="10" fill={COLORS.red} />
        <text x="14" y="0" fontFamily={FONT} fontSize="10" fill={COLORS.text}>sign</text>
        <rect x="60" y="-9" width="10" height="10" fill={COLORS.orange} />
        <text x="74" y="0" fontFamily={FONT} fontSize="10" fill={COLORS.text}>exponent (range)</text>
        <rect x="200" y="-9" width="10" height="10" fill={COLORS.accent} />
        <text x="214" y="0" fontFamily={FONT} fontSize="10" fill={COLORS.text}>mantissa (precision)</text>
      </g>
    </svg>
  )
}

// =========================================================================
// VanishingGradientChart — PyTorch Module 2: gradient magnitude vs depth
// =========================================================================
export const VanishingGradientChart = () => {
  const W = 720, H = 340
  const padL = 70, padR = 30, padT = 40, padB = 60
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  // Log10 scale on Y from 1.0 down to 1e-8
  const logMax = 0, logMin = -8
  const yScale = v => padT + (logMax - Math.log10(v)) / (logMax - logMin) * plotH

  const depths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const sigmoid = depths.map(n => Math.pow(0.25, n))
  const relu = depths.map(() => 1.0)

  const groupW = plotW / depths.length
  const barW = (groupW - 8) / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="vg-title vg-desc">
      <title id="vg-title">Vanishing Gradients Through Deep Sigmoid Stack</title>
      <desc id="vg-desc">Bar chart on a log Y-axis comparing gradient magnitude at each layer for a sigmoid-activated chain (decays as 0.25^n) versus a ReLU chain (constant 1). Sigmoid bars sink below the underflow line by depth 10, while ReLU bars stay flat at 1.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Gradient magnitude vs depth (chain of activation derivatives)</text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={COLORS.muted} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={COLORS.muted} />

      {/* Y log gridlines */}
      {[0, -1, -2, -3, -4, -5, -6, -7, -8].map(e => {
        const y = padT + (logMax - e) / (logMax - logMin) * plotH
        return (
          <g key={e}>
            <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={COLORS.grid} strokeDasharray="2 4" />
            <text x={padL - 6} y={y + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">10{'⁻'}{Math.abs(e) || ''}{e === 0 ? '⁰' : ''}</text>
          </g>
        )
      })}

      {/* underflow zone */}
      <line x1={padL} y1={yScale(1e-6)} x2={padL + plotW} y2={yScale(1e-6)} stroke={COLORS.red} strokeDasharray="6 4" strokeWidth="1.5" />
      <text x={padL + plotW - 6} y={yScale(1e-6) - 4} fontFamily={FONT} fontSize="10" fill={COLORS.red} textAnchor="end">underflow zone (fp32 ≈ 10⁻⁷)</text>

      {/* bars */}
      {depths.map((d, i) => {
        const x = padL + i * groupW + 4
        const sBar = sigmoid[i]
        const rBar = relu[i]
        const sH = padT + plotH - yScale(sBar)
        const rH = padT + plotH - yScale(rBar)
        return (
          <g key={d}>
            <rect x={x} y={yScale(sBar)} width={barW} height={Math.max(1, sH)} fill={COLORS.red} opacity="0.85" />
            <rect x={x + barW + 2} y={yScale(rBar)} width={barW} height={Math.max(1, rH)} fill={COLORS.green} opacity="0.85" />
            <text x={x + barW + 1} y={padT + plotH + 14} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{d}</text>
          </g>
        )
      })}

      {/* axis labels */}
      <text x={padL + plotW / 2} y={H - 18} fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle">layer depth</text>
      <text x={20} y={padT + plotH / 2} fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle" transform={`rotate(-90 20 ${padT + plotH / 2})`}>gradient magnitude (log)</text>

      {/* legend */}
      <g transform={`translate(${padL + plotW - 200}, ${padT + 6})`}>
        <rect x="0" y="0" width="10" height="10" fill={COLORS.red} opacity="0.85" />
        <text x="14" y="9" fontFamily={FONT} fontSize="11" fill={COLORS.text}>sigmoid (×0.25/layer)</text>
        <rect x="0" y="16" width="10" height="10" fill={COLORS.green} opacity="0.85" />
        <text x="14" y="25" fontFamily={FONT} fontSize="11" fill={COLORS.text}>ReLU (active = 1)</text>
      </g>
    </svg>
  )
}

// =========================================================================
// EmbeddingLookup — PyTorch Module 4: token + position embedding lookup
// =========================================================================
export const EmbeddingLookup = () => {
  const W = 760, H = 380

  const tokenIds = [17, 482, 9, 311]
  const posIds = [0, 1, 2, 3]

  // Token embedding matrix E
  const ex = 60, ey = 70, ew = 60, eh = 230
  // Highlighted token rows (within E)
  const tokenRowIdx = [2, 7, 11, 16]  // visual placeholder positions out of ~22 rows shown
  const rowsShown = 22
  const rowH = eh / rowsShown

  // Position matrix P
  const px = 460, py = 70, pw = 50, ph = 130
  const pRowsShown = 12
  const pRowH = ph / pRowsShown
  const posRowIdx = [0, 1, 2, 3]

  // Extracted (T,d) tiles
  const tokTileX = 200, tokTileY = 100
  const tokTileW = 170, tokTileH = 60
  const posTileX = 540, posTileY = 100
  const posTileW = 170, posTileH = 60

  // Final tile
  const finalTileX = 220, finalTileY = 290
  const finalTileW = 320, finalTileH = 56

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(760)} role="img" aria-labelledby="el-title el-desc">
      <title id="el-title">Token + Position Embedding Lookup</title>
      <desc id="el-desc">Token IDs index into the embedding matrix E (V×d) producing a (T,d) tile. Position IDs index a separate position matrix P (Tmax×d). The two tiles are summed to form the model input x of shape (B,T,d).</desc>

      {/* Title */}
      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Token + Position Embeddings → Model Input</text>

      {/* Token id row */}
      <text x={ex} y={50} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>token ids (B=1, T=4)</text>
      {tokenIds.map((t, i) => (
        <g key={i}>
          <rect x={ex + i * 30} y={54} width={26} height={18} fill={COLORS.panel} stroke={COLORS.green} />
          <text x={ex + i * 30 + 13} y={67} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* Token embedding matrix E */}
      <rect x={ex} y={ey + 15} width={ew} height={eh} fill={COLORS.panel} stroke={COLORS.muted} />
      {Array.from({ length: rowsShown }).map((_, i) => (
        <line key={i} x1={ex} y1={ey + 15 + i * rowH} x2={ex + ew} y2={ey + 15 + i * rowH} stroke={COLORS.grid} strokeWidth="0.5" />
      ))}
      {tokenRowIdx.map((r, i) => (
        <rect key={i} x={ex} y={ey + 15 + r * rowH} width={ew} height={rowH} fill={COLORS.green} fillOpacity="0.6" stroke={COLORS.green} />
      ))}
      <text x={ex + ew / 2} y={ey + eh + 32} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">E (V=10000, d=768)</text>

      {/* Arrows from token ids to highlighted rows */}
      {tokenRowIdx.map((r, i) => (
        <line key={i} x1={ex + i * 30 + 13} y1={72} x2={ex + ew / 2} y2={ey + 15 + r * rowH + rowH / 2} stroke={COLORS.green} strokeOpacity="0.5" strokeWidth="1" />
      ))}

      {/* Token tile (T, d) */}
      <rect x={tokTileX} y={tokTileY} width={tokTileW} height={tokTileH} fill={COLORS.green} fillOpacity="0.18" stroke={COLORS.green} />
      <text x={tokTileX + tokTileW / 2} y={tokTileY + 24} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle">token_embed</text>
      <text x={tokTileX + tokTileW / 2} y={tokTileY + 42} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">(B, T=4, d=768)</text>
      {/* arrow E -> token tile */}
      <line x1={ex + ew + 4} y1={ey + 80} x2={tokTileX - 4} y2={tokTileY + tokTileH / 2} stroke={COLORS.green} strokeWidth="1.5" markerEnd="url(#elArrow)" />

      {/* Position id row */}
      <text x={px} y={50} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>position ids (T=4)</text>
      {posIds.map((t, i) => (
        <g key={i}>
          <rect x={px + i * 30} y={54} width={26} height={18} fill={COLORS.panel} stroke={COLORS.orange} />
          <text x={px + i * 30 + 13} y={67} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* Position embedding matrix P */}
      <rect x={px} y={py + 15} width={pw} height={ph} fill={COLORS.panel} stroke={COLORS.muted} />
      {Array.from({ length: pRowsShown }).map((_, i) => (
        <line key={i} x1={px} y1={py + 15 + i * pRowH} x2={px + pw} y2={py + 15 + i * pRowH} stroke={COLORS.grid} strokeWidth="0.5" />
      ))}
      {posRowIdx.map((r, i) => (
        <rect key={i} x={px} y={py + 15 + r * pRowH} width={pw} height={pRowH} fill={COLORS.orange} fillOpacity="0.6" stroke={COLORS.orange} />
      ))}
      <text x={px + pw / 2} y={py + ph + 32} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">P (T_max=2048, d=768)</text>

      {/* Position tile */}
      <rect x={posTileX} y={posTileY} width={posTileW} height={posTileH} fill={COLORS.orange} fillOpacity="0.18" stroke={COLORS.orange} />
      <text x={posTileX + posTileW / 2} y={posTileY + 24} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle">pos_embed</text>
      <text x={posTileX + posTileW / 2} y={posTileY + 42} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">(B, T=4, d=768)</text>
      <line x1={px + pw + 4} y1={py + 50} x2={posTileX - 4} y2={posTileY + posTileH / 2} stroke={COLORS.orange} strokeWidth="1.5" markerEnd="url(#elArrowO)" />

      {/* Plus sign */}
      <text x={W / 2} y={tokTileY + tokTileH + 80} fontFamily={FONT} fontSize="32" fill={COLORS.accent} textAnchor="middle" fontWeight="700">+</text>

      {/* Arrows from tiles down to plus */}
      <line x1={tokTileX + tokTileW / 2} y1={tokTileY + tokTileH + 4} x2={W / 2 - 14} y2={tokTileY + tokTileH + 60} stroke={COLORS.green} strokeWidth="1.5" />
      <line x1={posTileX + posTileW / 2} y1={posTileY + posTileH + 4} x2={W / 2 + 14} y2={posTileY + posTileH + 60} stroke={COLORS.orange} strokeWidth="1.5" />

      {/* Final tile */}
      <rect x={finalTileX} y={finalTileY} width={finalTileW} height={finalTileH} fill={COLORS.accent} fillOpacity="0.18" stroke={COLORS.accent} />
      <text x={finalTileX + finalTileW / 2} y={finalTileY + 22} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle">x = token_embed + pos_embed</text>
      <text x={finalTileX + finalTileW / 2} y={finalTileY + 40} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">(B, T=4, d=768)</text>

      <defs>
        <marker id="elArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={COLORS.green} />
        </marker>
        <marker id="elArrowO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={COLORS.orange} />
        </marker>
      </defs>
    </svg>
  )
}

// =========================================================================
// SingleHeadAttention — PyTorch Module 4: scaled dot-product attention
// =========================================================================
export const SingleHeadAttention = () => {
  const W = 800, H = 420

  const tile = (x, y, w, h, label, shape, color) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.18" stroke={color} />
      <text x={x + w / 2} y={y + h / 2 - 2} fontFamily={MONO} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 14} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{shape}</text>
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(800)} role="img" aria-labelledby="sha-title sha-desc">
      <title id="sha-title">Single-Head Scaled Dot-Product Attention</title>
      <desc id="sha-desc">Input x is projected by W_q, W_k, W_v into Q, K, V. Q times K transpose scaled by sqrt(d_k) gives an attention score matrix; row-wise softmax produces attention weights alpha; alpha times V yields the output.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Scaled Dot-Product Attention (single head)</text>

      {/* Input x */}
      {tile(20, 170, 110, 60, 'x', '(B, T, d_model)', COLORS.accent)}

      {/* Projection labels */}
      <text x={170} y={130} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>W_q</text>
      <text x={170} y={205} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>W_k</text>
      <text x={170} y={290} fontFamily={MONO} fontSize="11" fill={COLORS.muted}>W_v</text>

      {/* Arrows from x to Q,K,V */}
      <line x1={130} y1={195} x2={210} y2={120} stroke={COLORS.purple} strokeWidth="1.5" markerEnd="url(#shArrowP)" />
      <line x1={130} y1={200} x2={210} y2={200} stroke={COLORS.orange} strokeWidth="1.5" markerEnd="url(#shArrowO)" />
      <line x1={130} y1={205} x2={210} y2={290} stroke={COLORS.green} strokeWidth="1.5" markerEnd="url(#shArrowG)" />

      {/* Q, K, V tiles */}
      {tile(210, 100, 100, 50, 'Q', '(B, T, d_k)', COLORS.purple)}
      {tile(210, 175, 100, 50, 'K', '(B, T, d_k)', COLORS.orange)}
      {tile(210, 270, 100, 50, 'V', '(B, T, d_k)', COLORS.green)}

      {/* Scores box (Q · K^T) */}
      <line x1={310} y1={125} x2={400} y2={155} stroke={COLORS.purple} strokeWidth="1.5" />
      <line x1={310} y1={200} x2={400} y2={170} stroke={COLORS.orange} strokeWidth="1.5" />
      {tile(400, 140, 130, 60, 'scores', 'Q·Kᵀ / √d_k  (B, T, T)', COLORS.yellow)}

      {/* Softmax */}
      <line x1={465} y1={200} x2={465} y2={225} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#shArrowM)" />
      {tile(400, 225, 130, 44, 'softmax', 'row-wise → α', COLORS.yellow)}

      {/* alpha tile */}
      <line x1={465} y1={269} x2={465} y2={293} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#shArrowM)" />
      {tile(400, 293, 130, 44, 'α', '(B, T, T)', COLORS.yellow)}

      {/* alpha · V -> output */}
      <line x1={310} y1={295} x2={400} y2={315} stroke={COLORS.green} strokeWidth="1.5" />
      <line x1={530} y1={315} x2={620} y2={250} stroke={COLORS.accent} strokeWidth="1.5" markerEnd="url(#shArrowA)" />
      {tile(620, 220, 150, 60, 'out = α·V', '(B, T, d_k)', COLORS.accent)}

      {/* Causal mask inset */}
      <g transform="translate(610, 30)">
        <text x="65" y="0" fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">causal mask: −∞ above diagonal</text>
        {Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <rect key={`${i}-${j}`} x={20 + j * 14} y={8 + i * 14} width={13} height={13}
              fill={j > i ? COLORS.grid : COLORS.yellow} fillOpacity={j > i ? 0.3 : 0.55} stroke={COLORS.bg} strokeWidth="0.5" />
          ))
        )}
      </g>

      <defs>
        <marker id="shArrowP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.purple} /></marker>
        <marker id="shArrowO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.orange} /></marker>
        <marker id="shArrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.green} /></marker>
        <marker id="shArrowM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.muted} /></marker>
        <marker id="shArrowA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.accent} /></marker>
      </defs>
    </svg>
  )
}

// =========================================================================
// AttentionScaleHistogram — PyTorch Module 4: why √d_k scaling
// =========================================================================
export const AttentionScaleHistogram = () => {
  const W = 720, H = 320
  const padT = 40, padB = 70
  const panelW = (W - 60) / 2
  const plotH = H - padT - padB

  // Without scaling: very peaked (one near 1.0, rest near 0)
  const without = [0.78, 0.04, 0.03, 0.025, 0.02, 0.015, 0.012, 0.01, 0.008, 0.008, 0.005, 0.005, 0.003, 0.003, 0.002, 0.002, 0.001, 0.001, 0.001, 0.001]
  // With scaling: smoother distribution
  const withS = [0.04, 0.06, 0.08, 0.10, 0.12, 0.13, 0.12, 0.10, 0.08, 0.06, 0.04, 0.03, 0.02, 0.015, 0.01, 0.008, 0.005, 0.003, 0.002, 0.001]

  const drawPanel = (xOff, title, data, color, annotation) => {
    const padL = 30
    const innerW = panelW - padL - 20
    const binW = innerW / data.length
    const yMax = Math.max(...data) * 1.1
    const bars = data.map((v, i) => {
      const h = (v / yMax) * plotH
      return (
        <rect key={i} x={xOff + padL + i * binW + 1} y={padT + plotH - h} width={binW - 2} height={h} fill={color} opacity="0.85" />
      )
    })
    return (
      <g>
        <text x={xOff + panelW / 2} y={padT - 16} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{title}</text>
        {/* axes */}
        <line x1={xOff + padL} y1={padT} x2={xOff + padL} y2={padT + plotH} stroke={COLORS.muted} />
        <line x1={xOff + padL} y1={padT + plotH} x2={xOff + padL + innerW} y2={padT + plotH} stroke={COLORS.muted} />
        {bars}
        <text x={xOff + padL} y={padT + plotH + 14} fontFamily={MONO} fontSize="9" fill={COLORS.muted}>0</text>
        <text x={xOff + padL + innerW} y={padT + plotH + 14} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="end">1</text>
        <text x={xOff + padL + innerW / 2} y={padT + plotH + 28} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">softmax value</text>
        <text x={xOff + panelW / 2} y={padT + plotH + 50} fontFamily={FONT} fontSize="10" fill={color} textAnchor="middle" fontStyle="italic">{annotation}</text>
      </g>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="ash-title ash-desc">
      <title id="ash-title">Why Scale by 1/√d_k</title>
      <desc id="ash-desc">Two histograms of softmax outputs for d_k=64. Without scaling the distribution is sharp and one-hot-like, killing gradients. With 1/√d_k scaling the distribution is smooth and gradients flow.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Distribution of softmax(QKᵀ) values, d_k = 64</text>

      {drawPanel(20, 'Without 1/√d_k', without, COLORS.red, 'Sharp; gradient ≈ 0')}
      {drawPanel(40 + panelW, 'With 1/√d_k', withS, COLORS.green, 'Smooth; gradients flow')}

      <text x={W / 2} y={H - 8} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">Dot-product variance grows as d_k → softmax saturates. Scaling restores variance to ~1.</text>
    </svg>
  )
}

// =========================================================================
// MultiHeadAttentionLayout — PyTorch Module 5: split, attend, concat
// =========================================================================
export const MultiHeadAttentionLayout = () => {
  const W = 880, H = 480
  const headColors = [COLORS.purple, COLORS.accent, COLORS.green, COLORS.orange, COLORS.yellow, COLORS.red, '#7ee787', '#ff7b72']

  const xTile = (x, y, w, h, label, shape, color) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.18" stroke={color} />
      <text x={x + w / 2} y={y + h / 2 - 2} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 12} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">{shape}</text>
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(880)} role="img" aria-labelledby="mha-title mha-desc">
      <title id="mha-title">Multi-Head Attention Layout</title>
      <desc id="mha-desc">Input x is linearly projected once into Q, K, V each of shape (B,T,512), then reshaped into 8 parallel heads of dimension 64. Each head computes its own scaled dot-product attention. The 8 head outputs are concatenated and passed through W_o.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Multi-Head Attention: split → attend in parallel → concat</text>
      <text x={W / 2} y={38} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">Single big projection, then reshape into heads — same params as 8 separate projections</text>

      {/* Input x */}
      {xTile(W / 2 - 70, 50, 140, 36, 'x', '(B, T, d=512)', COLORS.accent)}

      {/* W_q, W_k, W_v */}
      <line x1={W / 2 - 50} y1={86} x2={170} y2={120} stroke={COLORS.muted} strokeWidth="1.2" />
      <line x1={W / 2}      y1={86} x2={W / 2}  y2={120} stroke={COLORS.muted} strokeWidth="1.2" />
      <line x1={W / 2 + 50} y1={86} x2={710} y2={120} stroke={COLORS.muted} strokeWidth="1.2" />
      {xTile(110, 120, 140, 38, 'Q = x·W_q', '(B, T, 512)', COLORS.purple)}
      {xTile(W / 2 - 70, 120, 140, 38, 'K = x·W_k', '(B, T, 512)', COLORS.orange)}
      {xTile(650, 120, 140, 38, 'V = x·W_v', '(B, T, 512)', COLORS.green)}

      {/* Reshape annotation */}
      <text x={W / 2} y={180} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">reshape (B, T, 512) → (B, T, 8, 64) → 8 heads of (B, T, d_k=64)</text>

      {/* 8 head lanes */}
      {(() => {
        const laneW = 90
        const laneGap = 8
        const totalW = 8 * laneW + 7 * laneGap
        const startX = (W - totalW) / 2
        const laneY = 200
        const laneH = 180
        return Array.from({ length: 8 }).map((_, h) => {
          const x = startX + h * (laneW + laneGap)
          const c = headColors[h]
          return (
            <g key={h}>
              {/* head column container */}
              <rect x={x} y={laneY} width={laneW} height={laneH} fill={c} fillOpacity="0.06" stroke={c} strokeOpacity="0.5" />
              <text x={x + laneW / 2} y={laneY + 14} fontFamily={MONO} fontSize="10" fill={c} textAnchor="middle" fontWeight="600">head {h + 1}</text>
              {/* mini Q,K,V */}
              <rect x={x + 8} y={laneY + 22} width={(laneW - 24) / 3} height={16} fill={COLORS.purple} fillOpacity="0.4" />
              <rect x={x + 12 + (laneW - 24) / 3} y={laneY + 22} width={(laneW - 24) / 3} height={16} fill={COLORS.orange} fillOpacity="0.4" />
              <rect x={x + 16 + 2 * (laneW - 24) / 3} y={laneY + 22} width={(laneW - 24) / 3} height={16} fill={COLORS.green} fillOpacity="0.4" />
              <text x={x + laneW / 2} y={laneY + 33} fontFamily={MONO} fontSize="8" fill={COLORS.text} textAnchor="middle">Q K V</text>
              {/* attention box */}
              <rect x={x + 8} y={laneY + 50} width={laneW - 16} height={36} fill={c} fillOpacity="0.25" stroke={c} />
              <text x={x + laneW / 2} y={laneY + 65} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">softmax</text>
              <text x={x + laneW / 2} y={laneY + 78} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">(QKᵀ/√d_k)·V</text>
              {/* output tile */}
              <rect x={x + 8} y={laneY + 100} width={laneW - 16} height={32} fill={c} fillOpacity="0.4" stroke={c} />
              <text x={x + laneW / 2} y={laneY + 115} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">out_{h + 1}</text>
              <text x={x + laneW / 2} y={laneY + 127} fontFamily={MONO} fontSize="8" fill={COLORS.muted} textAnchor="middle">(B,T,64)</text>
              {/* arrow down to concat */}
              <line x1={x + laneW / 2} y1={laneY + 132} x2={x + laneW / 2} y2={laneY + laneH - 2} stroke={c} strokeOpacity="0.6" strokeWidth="1" />
            </g>
          )
        })
      })()}

      {/* Concat bar */}
      <rect x={50} y={395} width={W - 100} height={26} fill={COLORS.muted} fillOpacity="0.15" stroke={COLORS.muted} />
      <text x={W / 2} y={412} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">concat → (B, T, 8·64 = 512)</text>

      {/* W_o */}
      <line x1={W / 2} y1={421} x2={W / 2} y2={438} stroke={COLORS.muted} strokeWidth="1.2" />
      <text x={W / 2 + 8} y={433} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>W_o</text>
      {xTile(W / 2 - 100, 438, 200, 32, 'output', '(B, T, 512)', COLORS.accent)}

      <text x={W / 2} y={H - 2} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">Each head specializes (syntax / coreference / long-range / …)</text>
    </svg>
  )
}

// =========================================================================
// KVCacheGrowth — PyTorch Module 5: KV cache during autoregressive gen
// =========================================================================
export const KVCacheGrowth = () => {
  const W = 820, H = 380

  const cellW = 22
  const cellH = 22
  const snapY = 130

  const drawSnapshot = (xOff, label, cachedLen, isLast) => {
    const cells = isLast ? cachedLen : cachedLen
    return (
      <g>
        <text x={xOff + cells * cellW / 2} y={70} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>

        {/* Q vector for current step */}
        <rect x={xOff + (cells - 1) * cellW} y={85} width={cellW} height={cellH} fill={COLORS.accent} stroke={COLORS.accent} strokeWidth="1.5" />
        <text x={xOff + (cells - 1) * cellW + cellW / 2} y={101} fontFamily={MONO} fontSize="9" fill={COLORS.bg} textAnchor="middle" fontWeight="700">Q_{cells}</text>

        {/* arrow Q -> cache */}
        <line x1={xOff + (cells - 1) * cellW + cellW / 2} y1={107} x2={xOff + cells * cellW / 2} y2={snapY - 4} stroke={COLORS.accent} strokeWidth="1" strokeDasharray="3 3" />

        {/* K cache row */}
        {Array.from({ length: cells }).map((_, i) => (
          <rect key={`k-${i}`} x={xOff + i * cellW} y={snapY} width={cellW} height={cellH}
            fill={COLORS.accent} fillOpacity={i === cells - 1 ? 0.8 : 0.35}
            stroke={i === cells - 1 ? COLORS.yellow : COLORS.accent}
            strokeWidth={i === cells - 1 ? 2 : 1} />
        ))}
        <text x={xOff - 8} y={snapY + cellH / 2 + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">K</text>

        {/* V cache row */}
        {Array.from({ length: cells }).map((_, i) => (
          <rect key={`v-${i}`} x={xOff + i * cellW} y={snapY + cellH + 4} width={cellW} height={cellH}
            fill={COLORS.green} fillOpacity={i === cells - 1 ? 0.8 : 0.35}
            stroke={i === cells - 1 ? COLORS.yellow : COLORS.green}
            strokeWidth={i === cells - 1 ? 2 : 1} />
        ))}
        <text x={xOff - 8} y={snapY + cellH * 1.5 + 8} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">V</text>

        {/* shape label */}
        <text x={xOff + cells * cellW / 2} y={snapY + cellH * 2 + 22} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">cached len = {cells}</text>
      </g>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(820)} role="img" aria-labelledby="kvc-title kvc-desc">
      <title id="kvc-title">KV Cache Growth During Autoregressive Generation</title>
      <desc id="kvc-desc">Snapshots at step 1, step 2, and step T showing K and V caches growing by one cell per generated token. Each step only computes Q for the new token, then attends over the full cached K and V.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">KV cache grows by one column per generated token</text>

      {/* Memory bar */}
      <rect x={40} y={40} width={W - 80} height={14} fill={COLORS.panel} stroke={COLORS.grid} />
      <text x={W / 2} y={51} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">Cache memory: B × T × n_layers × 2 × d_head bytes (linear in T)</text>

      {drawSnapshot(70, 'step 1', 1)}
      {drawSnapshot(220, 'step 2', 2)}
      {drawSnapshot(420, 'step T', 12, true)}

      {/* Bottom comparison */}
      <g transform="translate(40, 290)">
        <rect x="0" y="0" width={W - 80} height="22" fill={COLORS.red} fillOpacity="0.15" stroke={COLORS.red} />
        <text x="10" y="15" fontFamily={MONO} fontSize="10" fill={COLORS.red}>Without cache: recompute K_{1..t}, V_{1..t} every step → O(T²) total work</text>

        <rect x="0" y="28" width={W - 80} height="22" fill={COLORS.green} fillOpacity="0.15" stroke={COLORS.green} />
        <text x="10" y="43" fontFamily={MONO} fontSize="10" fill={COLORS.green}>With cache: append K_t, V_t only → O(T) total work</text>
      </g>

      <text x={W / 2} y={H - 6} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">Each step: compute Q_t only, then attend over full cached K and V.</text>
    </svg>
  )
}

// =========================================================================
// TransformerArchitecture — PyTorch Module 6: full nanoGPT pipeline
// =========================================================================
export const TransformerArchitecture = () => {
  const W = 720, H = 660

  const box = (x, y, w, h, label, sub, color) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.22" stroke={color} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 4)} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{sub}</text>}
    </g>
  )

  const cx = W / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="ta-title ta-desc">
      <title id="ta-title">Full Transformer (nanoGPT) Architecture</title>
      <desc id="ta-desc">Token IDs are embedded and added to position embeddings, then passed through N stacked transformer blocks. A final LayerNorm and a linear projection to vocabulary size produces logits.</desc>

      <text x={cx} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">nanoGPT Architecture (decoder-only Transformer)</text>

      {/* Token IDs */}
      <g>
        <text x={cx} y={50} fontFamily={MONO} fontSize="11" fill={COLORS.muted} textAnchor="middle">[ t₁  t₂  t₃  …  t_T ]</text>
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={cx - 100 + i * 40} y={56} width={36} height={20} fill={COLORS.panel} stroke={COLORS.muted} />
        ))}
        {[1, 2, 3, '…', 'T'].map((t, i) => (
          <text key={i} x={cx - 100 + i * 40 + 18} y={70} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">t_{t}</text>
        ))}
      </g>

      {/* Token embedding */}
      <line x1={cx} y1={76} x2={cx} y2={100} stroke={COLORS.muted} />
      {box(cx - 140, 100, 280, 38, 'Token Embedding', '(V × d) lookup → (B, T, d)', COLORS.accent)}

      {/* + Position embedding */}
      <line x1={cx} y1={138} x2={cx} y2={160} stroke={COLORS.muted} />
      <text x={cx - 110} y={166} fontFamily={MONO} fontSize="14" fill={COLORS.orange} textAnchor="middle" fontWeight="700">+</text>
      {box(cx - 90, 150, 240, 32, 'Position Embedding', '(T_max × d)', COLORS.orange)}

      {/* x_0 tile */}
      <line x1={cx} y1={182} x2={cx} y2={205} stroke={COLORS.muted} />
      {box(cx - 100, 205, 200, 32, 'x₀  (B, T, d)', null, COLORS.accent)}

      {/* Stacked blocks (visual depth) */}
      <line x1={cx} y1={237} x2={cx} y2={260} stroke={COLORS.muted} />
      {[0, 1, 2, 3, 4].map(i => {
        const dx = i * 6
        const dy = i * 6
        return (
          <g key={i}>
            <rect x={cx - 130 + dx} y={260 + dy} width={260} height={90} fill={COLORS.purple} fillOpacity="0.15" stroke={COLORS.purple} />
          </g>
        )
      })}
      {/* Front block content */}
      <text x={cx} y={278} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">Transformer Block (× N)</text>
      <text x={cx} y={296} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">LN → Self-Attn → +</text>
      <text x={cx} y={310} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">LN → MLP → +</text>
      <text x={cx} y={328} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">shape preserved (B, T, d)</text>

      {/* Final LN */}
      <line x1={cx} y1={384} x2={cx} y2={410} stroke={COLORS.muted} />
      {box(cx - 120, 410, 240, 36, 'Final LayerNorm', null, COLORS.accent)}

      {/* Output linear */}
      <line x1={cx} y1={446} x2={cx} y2={468} stroke={COLORS.muted} />
      {box(cx - 140, 468, 280, 38, 'Output Linear', 'd → V (vocab)', COLORS.green)}

      {/* logits */}
      <line x1={cx} y1={506} x2={cx} y2={528} stroke={COLORS.muted} />
      {box(cx - 110, 528, 220, 36, 'logits', '(B, T, V)', COLORS.green)}

      {/* softmax annotation */}
      <text x={cx} y={585} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">apply softmax over V → next-token probabilities</text>

      {/* Side annotations */}
      <g transform="translate(20, 100)">
        <rect x="0" y="0" width="120" height="60" fill={COLORS.panel} stroke={COLORS.grid} />
        <text x="60" y="16" fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">B = batch</text>
        <text x="60" y="28" fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">T = seq_len</text>
        <text x="60" y="40" fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">d = embed_dim</text>
        <text x="60" y="52" fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">V = vocab_size</text>
      </g>

      <text x={W - 30} y={302} fontFamily={FONT} fontSize="10" fill={COLORS.purple} textAnchor="end">× N blocks</text>
      <text x={W - 30} y={316} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="end">(typically 6–96)</text>

      <text x={cx} y={H - 16} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">Same shape (B, T, d) flows through every block — composition stays simple.</text>
    </svg>
  )
}

// =========================================================================
// LRSchedulePlot — PyTorch Module 7: warmup + cosine LR schedule
// =========================================================================
export const LRSchedulePlot = () => {
  const W = 720, H = 300
  const padL = 70, padR = 30, padT = 40, padB = 50
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const totalSteps = 10000
  const warmupSteps = 1000
  const peakLR = 1.0  // normalized

  const xScale = s => padL + (s / totalSteps) * plotW
  const yScale = lr => padT + plotH - (lr / peakLR) * plotH

  const lrAt = s => {
    if (s < warmupSteps) return (s / warmupSteps) * peakLR
    const progress = (s - warmupSteps) / (totalSteps - warmupSteps)
    return 0.5 * peakLR * (1 + Math.cos(Math.PI * progress))
  }

  const points = Array.from({ length: 200 }).map((_, i) => {
    const s = (i / 199) * totalSteps
    return `${xScale(s)},${yScale(lrAt(s))}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(720)} role="img" aria-labelledby="lr-title lr-desc">
      <title id="lr-title">Warmup + Cosine Learning Rate Schedule</title>
      <desc id="lr-desc">Learning rate ramps linearly from zero to a peak value over the warmup steps, then decays smoothly to zero following a cosine curve.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Warmup + Cosine LR Schedule</text>

      {/* warmup region */}
      <rect x={xScale(0)} y={padT} width={xScale(warmupSteps) - xScale(0)} height={plotH} fill={COLORS.yellow} fillOpacity="0.10" />
      {/* decay region */}
      <rect x={xScale(warmupSteps)} y={padT} width={xScale(totalSteps) - xScale(warmupSteps)} height={plotH} fill={COLORS.accent} fillOpacity="0.08" />

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={COLORS.muted} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={COLORS.muted} />

      {/* Y ticks */}
      {[0, 0.25, 0.5, 0.75, 1.0].map(t => (
        <g key={t}>
          <line x1={padL - 4} y1={yScale(t)} x2={padL} y2={yScale(t)} stroke={COLORS.muted} />
          <text x={padL - 8} y={yScale(t) + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="end">{t === 1.0 ? 'peak' : t.toFixed(2)}</text>
        </g>
      ))}

      {/* X ticks */}
      {[0, 1000, 2500, 5000, 7500, 10000].map(s => (
        <g key={s}>
          <line x1={xScale(s)} y1={padT + plotH} x2={xScale(s)} y2={padT + plotH + 4} stroke={COLORS.muted} />
          <text x={xScale(s)} y={padT + plotH + 16} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{s}</text>
        </g>
      ))}

      {/* Curve */}
      <polyline points={points} fill="none" stroke={COLORS.accent} strokeWidth="2.5" />

      {/* Warmup boundary */}
      <line x1={xScale(warmupSteps)} y1={padT} x2={xScale(warmupSteps)} y2={padT + plotH} stroke={COLORS.muted} strokeDasharray="4 4" />
      <text x={xScale(warmupSteps)} y={padT - 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">warmup_steps = 1000</text>

      {/* Region annotations */}
      <text x={xScale(warmupSteps / 2)} y={padT + 18} fontFamily={FONT} fontSize="10" fill={COLORS.yellow} textAnchor="middle">warmup</text>
      <text x={xScale(warmupSteps / 2)} y={padT + 30} fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle">prevents early divergence</text>
      <text x={xScale(5500)} y={padT + 18} fontFamily={FONT} fontSize="10" fill={COLORS.accent} textAnchor="middle">cosine decay</text>
      <text x={xScale(5500)} y={padT + 30} fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle">smooth, no hard restarts</text>

      <text x={padL + plotW / 2} y={H - 12} fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle">training step</text>
      <text x={20} y={padT + plotH / 2} fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle" transform={`rotate(-90 20 ${padT + plotH / 2})`}>learning rate</text>
    </svg>
  )
}

// =========================================================================
// SamplingStrategies — PyTorch Module 7: greedy / temp / top-k / top-p
// =========================================================================
export const SamplingStrategies = () => {
  const W = 760, H = 500

  const base = [0.30, 0.18, 0.12, 0.09, 0.07, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.02]
  const tokens = base.length

  // Apply temperature: p_i ∝ p_i^(1/T) — flattens with T>1
  const temperature = (probs, T) => {
    const scaled = probs.map(p => Math.pow(p, 1 / T))
    const sum = scaled.reduce((a, b) => a + b, 0)
    return scaled.map(s => s / sum)
  }
  const greedy = base.map((_, i) => i === 0 ? 1 : 0)
  const tempDist = temperature(base, 1.5)
  const topK = (() => {
    const k = 4
    const kept = base.map((p, i) => i < k ? p : 0)
    const sum = kept.reduce((a, b) => a + b, 0)
    return kept.map(v => v / sum)
  })()
  const topP = (() => {
    const p = 0.9
    let cum = 0
    const result = []
    for (const v of base) {
      if (cum < p) {
        result.push(v)
        cum += v
      } else {
        result.push(0)
      }
    }
    const sum = result.reduce((a, b) => a + b, 0)
    return result.map(v => v / sum)
  })()

  const panels = [
    { title: 'Greedy (T=0)',     subtitle: 'deterministic, can collapse', dist: greedy,  cutoff: null },
    { title: 'Temperature T=1.5', subtitle: 'more diverse / random',       dist: tempDist, cutoff: null },
    { title: 'Top-k = 4',         subtitle: 'fixed truncation',            dist: topK,     cutoff: 4 },
    { title: 'Top-p = 0.9',       subtitle: 'adaptive nucleus',            dist: topP,     cutoff: topP.findIndex(v => v === 0) },
  ]

  const panelW = (W - 60) / 2
  const panelH = (H - 80) / 2

  const drawPanel = (xOff, yOff, panel) => {
    const padL = 30, padT = 28, padB = 40, padR = 12
    const innerW = panelW - padL - padR
    const innerH = panelH - padT - padB
    const binW = innerW / tokens
    const yMax = 1.0
    return (
      <g transform={`translate(${xOff}, ${yOff})`}>
        <rect x="0" y="0" width={panelW} height={panelH} fill={COLORS.panel} stroke={COLORS.grid} />
        <text x={panelW / 2} y={16} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{panel.title}</text>

        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke={COLORS.muted} />
        <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke={COLORS.muted} />

        {/* bars */}
        {panel.dist.map((v, i) => {
          const h = (v / yMax) * innerH
          const isKept = v > 0
          const cutoff = panel.cutoff
          const isMuted = cutoff !== null && cutoff > 0 && i >= cutoff
          return (
            <rect key={i}
              x={padL + i * binW + 1}
              y={padT + innerH - h}
              width={binW - 2}
              height={Math.max(0, h)}
              fill={isMuted || !isKept ? COLORS.muted : COLORS.accent}
              fillOpacity={isMuted || !isKept ? 0.3 : 0.85} />
          )
        })}

        {/* token id ticks */}
        {[0, 5, 11].map(i => (
          <text key={i} x={padL + i * binW + binW / 2} y={padT + innerH + 12} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">{i + 1}</text>
        ))}
        <text x={panelW / 2} y={padT + innerH + 26} fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle">vocab token rank</text>
        <text x={panelW / 2} y={panelH - 4} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">{panel.subtitle}</text>
      </g>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(760)} role="img" aria-labelledby="ss-title ss-desc">
      <title id="ss-title">Sampling Strategies: Greedy, Temperature, Top-k, Top-p</title>
      <desc id="ss-desc">Four panels show how different sampling strategies reshape the same base probability distribution. Greedy collapses to a single token; temperature flattens; top-k keeps the highest k; top-p (nucleus) keeps the smallest set covering probability mass p.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Same logits, four sampling strategies</text>

      {drawPanel(20, 40, panels[0])}
      {drawPanel(40 + panelW, 40, panels[1])}
      {drawPanel(20, 60 + panelH, panels[2])}
      {drawPanel(40 + panelW, 60 + panelH, panels[3])}
    </svg>
  )
}

// =========================================================================
// RoPERotation — PyTorch Module 8: rotary position encoding
// =========================================================================
export const RoPERotation = () => {
  const W = 800, H = 400

  // Left: unit circle with three rotated arrows
  const cx = 160, cy = 200, r = 110
  const theta = Math.PI / 5  // ~36°
  const arrows = [
    { angle: 0,         label: 'pos 0', color: COLORS.accent },
    { angle: theta,     label: 'pos 1', color: COLORS.green },
    { angle: 2 * theta, label: 'pos 2', color: COLORS.orange },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(800)} role="img" aria-labelledby="rope-title rope-desc">
      <title id="rope-title">RoPE — 2D Rotation per Dimension Pair</title>
      <desc id="rope-desc">Each dimension pair (x_2i, x_2i+1) is rotated by an angle proportional to position. Higher-index pairs rotate at lower frequencies. The dot product after rotation depends only on the relative position m minus n.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">RoPE: rotate each dimension pair by pos · θᵢ</text>

      {/* axes */}
      <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke={COLORS.muted} strokeDasharray="2 3" />
      <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke={COLORS.muted} strokeDasharray="2 3" />
      <text x={cx + r + 28} y={cy + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>x_{'{2i}'}</text>
      <text x={cx + 6} y={cy - r - 24} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>x_{'{2i+1}'}</text>

      {/* circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.grid} />

      {/* rotated arrows */}
      {arrows.map((a, i) => {
        const ex = cx + Math.cos(-a.angle) * r
        const ey = cy + Math.sin(-a.angle) * r
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={a.color} strokeWidth="2.5" markerEnd={`url(#ropeArr${i})`} />
            <text x={ex + (a.angle === 0 ? 8 : 0)} y={ey - 6} fontFamily={MONO} fontSize="10" fill={a.color} textAnchor={a.angle === 0 ? 'start' : 'middle'}>{a.label}</text>
            <defs>
              <marker id={`ropeArr${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={a.color} />
              </marker>
            </defs>
          </g>
        )
      })}
      {/* angle arc */}
      <path d={`M ${cx + 30} ${cy} A 30 30 0 0 0 ${cx + 30 * Math.cos(-theta)} ${cy + 30 * Math.sin(-theta)}`} fill="none" stroke={COLORS.green} strokeWidth="1" />
      <text x={cx + 38} y={cy - 16} fontFamily={MONO} fontSize="10" fill={COLORS.green}>θᵢ</text>

      <text x={cx} y={cy + r + 50} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle">2D rotation in dimension pair (2i, 2i+1)</text>

      {/* Center: dimension pairs */}
      <g transform="translate(370, 60)">
        <text x="50" y="0" fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">head dim d = 8</text>
        {[
          { i: 0, color: COLORS.purple, freq: 'θ₀ = 1.0' },
          { i: 1, color: COLORS.accent, freq: 'θ₁ ≈ 0.10' },
          { i: 2, color: COLORS.green,  freq: 'θ₂ ≈ 0.01' },
          { i: 3, color: COLORS.orange, freq: 'θ₃ ≈ 0.001' },
        ].map((p, i) => (
          <g key={i}>
            <rect x="0" y={20 + i * 30} width="40" height="22" fill={p.color} fillOpacity="0.4" stroke={p.color} />
            <rect x="40" y={20 + i * 30} width="40" height="22" fill={p.color} fillOpacity="0.4" stroke={p.color} />
            <text x="20" y={35 + i * 30} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">{p.i * 2}</text>
            <text x="60" y={35 + i * 30} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">{p.i * 2 + 1}</text>
            <text x="92" y={35 + i * 30} fontFamily={MONO} fontSize="10" fill={p.color}>{p.freq}</text>
          </g>
        ))}
        <text x="100" y="170" fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle">θᵢ = 10000⁻²ⁱ/d</text>
        <text x="100" y="184" fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle">(high freq → low freq)</text>
      </g>

      {/* Right: frequency curve */}
      <g transform="translate(580, 80)">
        <text x="100" y="0" fontFamily={FONT} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">θᵢ across dimension pairs</text>
        <line x1="20" y1="20" x2="20" y2="160" stroke={COLORS.muted} />
        <line x1="20" y1="160" x2="200" y2="160" stroke={COLORS.muted} />
        {(() => {
          const pts = []
          for (let i = 0; i < 32; i++) {
            const t = Math.pow(10000, -2 * i / 64)
            const x = 20 + (i / 31) * 180
            const y = 160 - Math.max(0, (Math.log10(t) + 4) / 4) * 130
            pts.push(`${x},${y}`)
          }
          return <polyline points={pts.join(' ')} fill="none" stroke={COLORS.purple} strokeWidth="2" />
        })()}
        <text x="20" y="178" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>i = 0</text>
        <text x="200" y="178" fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="end">i = d/2</text>
        <text x="0" y="20" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>10⁰</text>
        <text x="0" y="160" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>10⁻⁴</text>
      </g>

      {/* Bottom annotation */}
      <text x={W / 2} y={H - 14} fontFamily={MONO} fontSize="10" fill={COLORS.accent} textAnchor="middle">⟨R_m·q, R_n·k⟩ = ⟨q, R_(m−n)·k⟩  → encodes only relative position</text>
    </svg>
  )
}

// =========================================================================
// GQAHeadGroups — PyTorch Module 8: MHA / GQA / MQA head sharing
// =========================================================================
export const GQAHeadGroups = () => {
  const W = 820, H = 360

  const drawLane = (xOff, title, kvCount, groupColors, label) => {
    const laneW = 240
    const qY = 60
    const kY = 130
    const vY = 180
    const qStart = xOff + 18
    const qSpacing = (laneW - 36) / 7

    const qToKv = i => {
      // mapping Q index -> KV index based on kvCount
      if (kvCount === 8) return i
      if (kvCount === 2) return Math.floor(i / 4)
      return 0  // MQA
    }

    // KV positions
    const kvPositions = []
    for (let k = 0; k < kvCount; k++) {
      const groupQs = [0, 1, 2, 3, 4, 5, 6, 7].filter(i => qToKv(i) === k)
      const avg = groupQs.reduce((a, b) => a + b, 0) / groupQs.length
      kvPositions.push(qStart + avg * qSpacing)
    }

    return (
      <g>
        <text x={xOff + laneW / 2} y={36} fontFamily={FONT} fontSize="12" fill={COLORS.text} textAnchor="middle" fontWeight="600">{title}</text>
        <text x={xOff + laneW / 2} y={50} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">{label}</text>

        {/* Q heads */}
        {Array.from({ length: 8 }).map((_, i) => {
          const c = groupColors[qToKv(i) % groupColors.length]
          const cx = qStart + i * qSpacing
          return (
            <g key={i}>
              <circle cx={cx} cy={qY} r="11" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
              <text x={cx} y={qY + 4} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">Q{i + 1}</text>
            </g>
          )
        })}
        <text x={xOff} y={qY + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>Q</text>

        {/* connections from Q to K */}
        {Array.from({ length: 8 }).map((_, i) => {
          const c = groupColors[qToKv(i) % groupColors.length]
          const cx = qStart + i * qSpacing
          const kx = kvPositions[qToKv(i)]
          return <line key={i} x1={cx} y1={qY + 11} x2={kx} y2={kY - 10} stroke={c} strokeOpacity="0.5" strokeWidth="1" />
        })}

        {/* K boxes */}
        {kvPositions.map((kx, k) => {
          const c = groupColors[k % groupColors.length]
          return (
            <g key={k}>
              <rect x={kx - 16} y={kY - 10} width="32" height="20" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
              <text x={kx} y={kY + 4} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">K{kvCount === 1 ? '' : k + 1}</text>
            </g>
          )
        })}
        <text x={xOff} y={kY + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>K</text>

        {/* V boxes */}
        {kvPositions.map((kx, k) => {
          const c = groupColors[k % groupColors.length]
          return (
            <g key={k}>
              <rect x={kx - 16} y={vY - 10} width="32" height="20" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
              <text x={kx} y={vY + 4} fontFamily={MONO} fontSize="9" fill={COLORS.text} textAnchor="middle">V{kvCount === 1 ? '' : k + 1}</text>
            </g>
          )
        })}
        <text x={xOff} y={vY + 4} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>V</text>

        {/* cache size bar */}
        <text x={xOff + laneW / 2} y={vY + 40} fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">KV cache</text>
        <rect x={xOff + 8} y={vY + 50} width={(laneW - 16) * (kvCount / 8)} height={10} fill={COLORS.accent} fillOpacity="0.6" stroke={COLORS.accent} />
        <rect x={xOff + 8} y={vY + 50} width={laneW - 16} height={10} fill="none" stroke={COLORS.grid} />
        <text x={xOff + laneW / 2} y={vY + 76} fontFamily={MONO} fontSize="9" fill={COLORS.accent} textAnchor="middle">{kvCount}/8 of full size</text>
      </g>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(820)} role="img" aria-labelledby="gqa-title gqa-desc">
      <title id="gqa-title">MHA / GQA / MQA Head-Sharing Layout</title>
      <desc id="gqa-desc">Three lanes compare multi-head attention variants. MHA uses 8 query heads with 8 KV heads. GQA shares KV across groups (here 8 Q heads with 2 KV groups of 4). MQA collapses to a single shared K and V.</desc>

      <text x={W / 2} y={18} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">Attention head sharing: MHA → GQA → MQA</text>

      {drawLane(20,  'MHA', 8, [COLORS.purple, COLORS.accent, COLORS.green, COLORS.orange, COLORS.yellow, COLORS.red, '#7ee787', '#ff7b72'], '8 Q · 8 KV')}
      {drawLane(290, 'GQA', 2, [COLORS.purple, COLORS.orange], '8 Q · 2 KV (groups of 4)')}
      {drawLane(560, 'MQA', 1, [COLORS.accent], '8 Q · 1 KV')}

      <text x={W / 2} y={H - 6} fontFamily={FONT} fontSize="10" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">Cache size shrinks 8× → 2× → 1×; quality stays close, speed/memory wins are large.</text>
    </svg>
  )
}

// =========================================================================
// MoEParamBudget — PyTorch Module 9: active vs total params
// =========================================================================
export const MoEParamBudget = () => {
  const W = 740, H = 320
  const numExperts = 128
  const activeIdx = [37, 92]

  const expertsX = 30
  const expertsY = 60
  const expertsW = W - 280
  const expertW = expertsW / numExperts
  const expertH = 36

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(740)} role="img" aria-labelledby="moe-title moe-desc">
      <title id="moe-title">MoE — Active vs Total Parameters</title>
      <desc id="moe-desc">Of 128 expert FFNs (each 1B params, 128B total), only the top-2 chosen by the router actually run for each token. Compute is ~1.6% of total params, while memory must hold all experts.</desc>

      <text x={W / 2} y={22} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">MoE: 128 experts · top-2 active per token</text>

      {/* Total experts row */}
      <text x={expertsX} y={50} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>Total params: 128 × 1B = 128B (all stored in memory)</text>
      {Array.from({ length: numExperts }).map((_, i) => {
        const isActive = activeIdx.includes(i)
        const baseColor = i % 2 === 0 ? COLORS.purple : COLORS.muted
        return (
          <rect key={i}
            x={expertsX + i * expertW}
            y={expertsY}
            width={expertW - 0.5}
            height={expertH}
            fill={isActive ? COLORS.accent : baseColor}
            fillOpacity={isActive ? 0.9 : 0.3}
            stroke={isActive ? COLORS.yellow : 'none'}
            strokeWidth={isActive ? 2 : 0} />
        )
      })}

      {/* Highlight callout for active experts */}
      <line x1={expertsX + activeIdx[0] * expertW + expertW / 2} y1={expertsY + expertH + 4} x2={W / 2 - 100} y2={150} stroke={COLORS.accent} strokeWidth="1" />
      <line x1={expertsX + activeIdx[1] * expertW + expertW / 2} y1={expertsY + expertH + 4} x2={W / 2 - 100} y2={150} stroke={COLORS.accent} strokeWidth="1" />
      <g transform={`translate(${W / 2 - 250}, 150)`}>
        <rect x="0" y="0" width="300" height="40" fill={COLORS.accent} fillOpacity="0.18" stroke={COLORS.accent} />
        <text x="150" y="16" fontFamily={MONO} fontSize="11" fill={COLORS.accent} textAnchor="middle" fontWeight="600">Active per token (top-2): 2B params</text>
        <text x="150" y="30" fontFamily={MONO} fontSize="10" fill={COLORS.muted} textAnchor="middle">~1.6% of total compute</text>
      </g>

      {/* Equivalent dense bar */}
      <text x={expertsX} y={220} fontFamily={MONO} fontSize="10" fill={COLORS.muted}>Dense FFN with equivalent compute:</text>
      <rect x={expertsX} y={228} width={expertW * 2} height={expertH} fill={COLORS.green} fillOpacity="0.7" stroke={COLORS.green} />
      <text x={expertsX + expertW * 2 + 8} y={250} fontFamily={MONO} fontSize="10" fill={COLORS.green}>~2B params</text>
      <text x={expertsX} y={282} fontFamily={FONT} fontSize="11" fill={COLORS.text} fontStyle="italic">MoE buys 128B of stored knowledge with 2B of per-token compute.</text>

      {/* Right side annotation list */}
      <g transform={`translate(${W - 230}, 60)`}>
        <rect x="0" y="0" width="220" height="120" fill={COLORS.panel} stroke={COLORS.grid} />
        <text x="10" y="18" fontFamily={FONT} fontSize="10" fill={COLORS.text} fontWeight="600">Costs</text>
        <text x="10" y="36" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>Memory: O(N · expert)</text>
        <text x="10" y="48" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>  → all experts stored</text>
        <text x="10" y="68" fontFamily={MONO} fontSize="9" fill={COLORS.green}>Compute: O(k · expert)</text>
        <text x="10" y="80" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>  → only top-k run</text>
        <text x="10" y="100" fontFamily={MONO} fontSize="9" fill={COLORS.orange}>Comm: token → expert</text>
        <text x="10" y="112" fontFamily={MONO} fontSize="9" fill={COLORS.muted}>  → often across GPUs</text>
      </g>
    </svg>
  )
}

// =========================================================================
// MLACompression — PyTorch Module 9: KV compression / decompression
// =========================================================================
export const MLACompression = () => {
  const W = 880, H = 420

  const tile = (x, y, w, h, label, shape, color) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.22" stroke={color} />
      <text x={x + w / 2} y={y + h / 2 - 2} fontFamily={MONO} fontSize="11" fill={COLORS.text} textAnchor="middle" fontWeight="600">{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 12} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">{shape}</text>
    </g>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={wrapperStyle(880)} role="img" aria-labelledby="mla-title mla-desc">
      <title id="mla-title">MLA — KV Compression and Decompression</title>
      <desc id="mla-desc">Multi-head Latent Attention compresses K and V through a low-rank latent of dimension d_latent (much smaller than n_h·d_k). Only the latent is cached; full K and V are reconstructed at attention time via up-projections.</desc>

      <text x={W / 2} y={20} fontFamily={FONT} fontSize="13" fill={COLORS.text} textAnchor="middle" fontWeight="600">MLA: cache the latent, reconstruct K and V at attention time</text>

      {/* Input x */}
      {tile(20, 180, 90, 50, 'x', '(B, T, d)', COLORS.accent)}

      {/* Q track (top) */}
      {tile(180, 80, 90, 44, 'W_q', 'projection', COLORS.muted)}
      <line x1={110} y1={195} x2={180} y2={102} stroke={COLORS.muted} strokeWidth="1.5" />
      {tile(310, 80, 160, 44, 'Q', '(B, T, n_h·d_k = 4096)', COLORS.purple)}
      <line x1={270} y1={102} x2={310} y2={102} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#mlaArrM)" />

      {/* KV compression track (bottom) */}
      {tile(180, 250, 110, 44, 'W_kv_down', 'compress', COLORS.red)}
      <line x1={110} y1={215} x2={180} y2={272} stroke={COLORS.muted} strokeWidth="1.5" />

      {/* Latent narrow tile */}
      <g>
        <rect x={310} y={258} width={70} height={28} fill={COLORS.red} fillOpacity="0.3" stroke={COLORS.red} strokeWidth="2" />
        <text x={345} y={274} fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle" fontWeight="700">latent</text>
        <text x={345} y={300} fontFamily={MONO} fontSize="9" fill={COLORS.muted} textAnchor="middle">(B, T, d_latent=128)</text>
        <text x={345} y={246} fontFamily={FONT} fontSize="10" fill={COLORS.yellow} textAnchor="middle" fontWeight="600">cached here</text>
      </g>
      <line x1={290} y1={272} x2={310} y2={272} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#mlaArrM)" />

      {/* Up projections W_k_up, W_v_up */}
      {tile(420, 220, 90, 36, 'W_k_up', null, COLORS.muted)}
      {tile(420, 280, 90, 36, 'W_v_up', null, COLORS.muted)}
      <line x1={380} y1={272} x2={420} y2={238} stroke={COLORS.muted} strokeWidth="1.5" />
      <line x1={380} y1={272} x2={420} y2={298} stroke={COLORS.muted} strokeWidth="1.5" />

      {/* Reconstructed K, V */}
      {tile(540, 210, 160, 40, 'K', '(B, T, n_h·d_k = 4096)', COLORS.green)}
      {tile(540, 280, 160, 40, 'V', '(B, T, n_h·d_k = 4096)', COLORS.green)}
      <line x1={510} y1={238} x2={540} y2={230} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#mlaArrM)" />
      <line x1={510} y1={298} x2={540} y2={300} stroke={COLORS.muted} strokeWidth="1.5" markerEnd="url(#mlaArrM)" />

      {/* Attention block */}
      {tile(740, 170, 120, 80, 'attention', 'softmax(QKᵀ/√d)·V', COLORS.accent)}
      <line x1={470} y1={102} x2={740} y2={195} stroke={COLORS.purple} strokeWidth="1.5" markerEnd="url(#mlaArrP)" />
      <line x1={700} y1={230} x2={740} y2={210} stroke={COLORS.green} strokeWidth="1.5" markerEnd="url(#mlaArrG)" />
      <line x1={700} y1={300} x2={740} y2={235} stroke={COLORS.green} strokeWidth="1.5" markerEnd="url(#mlaArrG)" />

      {/* Cache size annotation */}
      <g transform="translate(20, 350)">
        <rect x="0" y="0" width={W - 40} height="44" fill={COLORS.panel} stroke={COLORS.grid} />
        <text x={(W - 40) / 2} y="18" fontFamily={MONO} fontSize="10" fill={COLORS.text} textAnchor="middle">Standard MHA cache:  B·T·n_h·d_k·2 ≈ 4096·2 floats per token</text>
        <text x={(W - 40) / 2} y="34" fontFamily={MONO} fontSize="10" fill={COLORS.green} textAnchor="middle">MLA cache:  B·T·d_latent ≈ 128 floats per token  →  ~32× smaller</text>
      </g>

      {/* RoPE inset */}
      <text x={345} y={325} fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">RoPE applied before compression</text>
      <text x={345} y={336} fontFamily={FONT} fontSize="9" fill={COLORS.muted} textAnchor="middle" fontStyle="italic">to preserve relative-position math</text>

      <defs>
        <marker id="mlaArrM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.muted} /></marker>
        <marker id="mlaArrP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.purple} /></marker>
        <marker id="mlaArrG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={COLORS.green} /></marker>
      </defs>
    </svg>
  )
}

// Backwards-compat: legacy stub
export const Placeholder = () => (
  <svg width="200" height="40" viewBox="0 0 200 40">
    <text x="100" y="25" textAnchor="middle" fill="#888" fontSize="12">SVG diagram pending</text>
  </svg>
)
