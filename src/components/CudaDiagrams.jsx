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

// Backwards-compat: legacy stub
export const Placeholder = () => (
  <svg width="200" height="40" viewBox="0 0 200 40">
    <text x="100" y="25" textAnchor="middle" fill="#888" fontSize="12">SVG diagram pending</text>
  </svg>
)
