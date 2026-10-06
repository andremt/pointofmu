'use client'

import { useMemo, useRef, useState } from 'react'

export interface ChartPoint { x: number; y: number | null }

export interface ChartSeries {
  name: string
  color: string
  points: ChartPoint[]
  /** x-value before which the line renders dashed (for methodology-break segments) */
  dashBeforeX?: number
  endLabel?: string
  /** which y-axis this series maps to; default 'left' */
  axis?: 'left' | 'right'
  /** 'scatter' draws points only, no connecting path, for raw observations */
  mode?: 'line' | 'scatter'
  pointRadius?: number
  pointOpacity?: number
}

export interface RefLine {
  x: number
  label: string
}

export interface ChartBand {
  color: string
  axis?: 'left' | 'right'
  /** parallel arrays: x, low, high */
  x: number[]
  low: number[]
  high: number[]
}

interface Props {
  title: string
  /** base64(JSON.stringify(ChartSeries[])), base64-encoded because this MDX pipeline
   *  only reliably passes plain double-quoted string attributes, not JS expressions
   *  or quoted JSON (which trips on internal quote characters). */
  series: string
  yLabel: string
  /** base64(JSON.stringify(number[])) */
  xTicks: string
  /** base64(JSON.stringify([number, number])) */
  yDomain?: string
  /** base64(JSON.stringify([number, number])), for series with axis:'right' */
  yDomainRight?: string
  /** label for the right axis, plain string (no encoding needed) */
  yLabelRight?: string
  /** base64(JSON.stringify(RefLine[])) */
  refLines?: string
  /** base64(JSON.stringify(ChartBand[])) */
  bands?: string
  /** base64(JSON.stringify(string[])) */
  statBox?: string
  sourceNote: string
  height?: number
  /** 'log' for wide-range data (e.g. follower counts); default 'linear' */
  xScale?: 'linear' | 'log'
  yScale?: 'linear' | 'log'
}

const VB_W = 900
const FONT_SANS = '"Geist", sans-serif'
const FONT_MONO = '"JetBrains Mono", monospace'
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
const yFormat = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 1 })
const formatPow10 = (v: number) => {
  const k = Math.round(Math.log10(v))
  const digits = String(Math.abs(k)).split('').map(d => SUP[Number(d)]).join('')
  return `10${k < 0 ? '⁻' : ''}${digits}`
}
function logTicks(min: number, max: number) {
  const lo = Math.floor(Math.log10(min))
  const hi = Math.ceil(Math.log10(max))
  const ticks: number[] = []
  for (let k = lo; k <= hi; k++) ticks.push(Math.pow(10, k))
  return ticks
}

export default function InteractiveChart({
  title,
  series: seriesJSON,
  yLabel,
  xTicks: xTicksJSON,
  yDomain: yDomainJSON,
  yDomainRight: yDomainRightJSON,
  yLabelRight,
  refLines: refLinesJSON,
  bands: bandsJSON,
  statBox: statBoxJSON,
  sourceNote,
  height = 460,
  xScale = 'linear',
  yScale = 'linear',
}: Props) {
  const decode = (b64: string) => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(b64))))
    } catch {
      throw new Error(`decode failed len=${b64?.length} head=${JSON.stringify(b64?.slice(0, 60))} tail=${JSON.stringify(b64?.slice(-60))}`)
    }
  }
  const series: ChartSeries[] = decode(seriesJSON)
  const xTicks: number[] = decode(xTicksJSON)
  const yDomain: [number, number] | undefined = yDomainJSON ? decode(yDomainJSON) : undefined
  const yDomainRight: [number, number] | undefined = yDomainRightJSON ? decode(yDomainRightJSON) : undefined
  const refLines: RefLine[] = refLinesJSON ? decode(refLinesJSON) : []
  const bands: ChartBand[] = bandsJSON ? decode(bandsJSON) : []
  const statBox: string[] | undefined = statBoxJSON ? decode(statBoxJSON) : undefined
  const hasRightAxis = !!yDomainRight
  const isLogX = xScale === 'log'
  const isLogY = yScale === 'log'

  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)

  const pad = { top: 36, right: hasRightAxis ? 60 : 116, bottom: 44, left: isLogY ? 64 : 56 }
  const w = VB_W - pad.left - pad.right
  const h = height - pad.top - pad.bottom

  const leftSeries = series.filter(s => s.axis !== 'right')
  const rightSeries = series.filter(s => s.axis === 'right')
  const allX = series.flatMap(s => s.points.map(p => p.x))
  const allYLeft = leftSeries.flatMap(s => s.points.filter(p => p.y !== null).map(p => p.y as number))
  const allYRight = rightSeries.flatMap(s => s.points.filter(p => p.y !== null).map(p => p.y as number))
  const minX = allX.length ? Math.min(...allX) : 0
  const maxX = allX.length ? Math.max(...allX) : 1
  const [minY, maxY] = yDomain ?? [
    allYLeft.length ? Math.min(...allYLeft) * (isLogY ? 0.8 : 0.92) : 0,
    allYLeft.length ? Math.max(...allYLeft) * (isLogY ? 1.15 : 1.06) : 1,
  ]
  const [minYR, maxYR] = yDomainRight ?? [
    allYRight.length ? Math.min(...allYRight) * 0.92 : 0,
    allYRight.length ? Math.max(...allYRight) * 1.06 : 1,
  ]

  const tx = (v: number) => (isLogX ? Math.log10(v) : v)
  const ty = (v: number) => (isLogY ? Math.log10(v) : v)
  const txInv = (v: number) => (isLogX ? Math.pow(10, v) : v)
  const tMinX = tx(minX), tMaxX = tx(maxX)
  const tMinY = ty(minY), tMaxY = ty(maxY)
  const tMinYR = ty(minYR), tMaxYR = ty(maxYR)

  const round = (v: number) => Math.round(v * 1000) / 1000
  const px = (x: number) => round(((tx(x) - tMinX) / (tMaxX - tMinX)) * w)
  const py = (y: number) => round(h - ((ty(y) - tMinY) / (tMaxY - tMinY)) * h)
  const pyR = (y: number) => round(h - ((ty(y) - tMinYR) / (tMaxYR - tMinYR)) * h)
  const pyFor = (s: ChartSeries) => (s.axis === 'right' ? pyR : py)

  // nearest hovered x, in transformed (screen-linear) space so log axes snap correctly
  const nearestX = useMemo(() => {
    if (hoverX === null || allX.length === 0) return null
    let best = allX[0]
    let bestDist = Infinity
    for (const x of Array.from(new Set(allX))) {
      const d = Math.abs(tx(x) - tx(hoverX))
      if (d < bestDist) { bestDist = d; best = x }
    }
    return best
  }, [hoverX, allX]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!series || series.length === 0) return null

  // nearest point within one series to a given x (independent of other series' x grids)
  function nearestPointIn(s: ChartSeries, xTarget: number) {
    let best: ChartPoint | null = null
    let bestDist = Infinity
    for (const p of s.points) {
      if (p.y === null) continue
      const d = Math.abs(tx(p.x) - tx(xTarget))
      if (d < bestDist) { bestDist = d; best = p }
    }
    return best
  }

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scale = VB_W / rect.width
    const localX = (e.clientX - rect.left) * scale - pad.left
    const t = localX / w
    const dataX = txInv(tMinX + t * (tMaxX - tMinX))
    setHoverX(dataX)
  }

  function pathFor(points: ChartPoint[], yFn: (y: number) => number) {
    const valid = points.filter(p => p.y !== null) as { x: number; y: number }[]
    return valid.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.x)} ${yFn(p.y)}`).join(' ')
  }

  function bandPath(band: ChartBand, yFn: (y: number) => number) {
    const top = band.x.map((x, i) => `${i === 0 ? 'M' : 'L'} ${px(x)} ${yFn(band.high[i])}`).join(' ')
    const bottom = band.x.slice().reverse().map((x, i) => `L ${px(x)} ${yFn(band.low.slice().reverse()[i])}`).join(' ')
    return `${top} ${bottom} Z`
  }

  function splitDashed(points: ChartPoint[], dashBeforeX?: number) {
    if (!dashBeforeX) return { dashed: [] as ChartPoint[], solid: points }
    const dashed = points.filter(p => p.x <= dashBeforeX)
    const solid = points.filter(p => p.x >= dashBeforeX)
    return { dashed, solid }
  }

  const yTickVals = isLogY ? logTicks(minY, maxY).filter(v => v >= minY * 0.999 && v <= maxY * 1.001) : null
  const gridCount = 5
  const fmtY = (v: number) => (isLogY ? formatPow10(v) : yFormat(v))

  return (
    <div style={{ position: 'relative', margin: '32px 0 8px' }}>
      <div style={{
        fontFamily: FONT_SANS, fontWeight: 700, fontSize: 16, color: 'var(--pom-ink)',
        marginBottom: 10, letterSpacing: '-0.01em',
      }}>
        {title}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${height}`}
        width="100%"
        style={{ display: 'block', height: 'auto', cursor: 'crosshair', overflow: 'visible' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverX(null)}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          {/* gridlines */}
          {(isLogY && yTickVals ? yTickVals : Array.from({ length: gridCount }).map((_, i) => minY + (maxY - minY) * (i / (gridCount - 1)))).map((yVal, i) => {
            const yPos = py(yVal)
            return (
              <g key={i}>
                <line x1={0} y1={yPos} x2={w} y2={yPos} stroke="var(--pom-rule)" strokeWidth={1} />
                <text x={-10} y={yPos + 4} textAnchor="end" fontSize={11} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
                  {fmtY(yVal)}
                </text>
              </g>
            )
          })}

          {/* y axis label */}
          <text
            x={-40} y={h / 2} textAnchor="middle" fontSize={11} fill="var(--pom-ink-soft)"
            fontFamily={FONT_MONO} transform={`rotate(-90,-40,${h / 2})`}
          >
            {yLabel}
          </text>

          {/* right axis ticks + label */}
          {hasRightAxis && Array.from({ length: gridCount }).map((_, i) => {
            const yVal = minYR + (maxYR - minYR) * (i / (gridCount - 1))
            return (
              <text key={i} x={w + 10} y={pyR(yVal) + 4} textAnchor="start" fontSize={11} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
                {yFormat(yVal)}
              </text>
            )
          })}
          {hasRightAxis && yLabelRight && (
            <text
              x={w + 52} y={h / 2} textAnchor="middle" fontSize={11} fill="var(--pom-ink-soft)"
              fontFamily={FONT_MONO} transform={`rotate(90,${w + 52},${h / 2})`}
            >
              {yLabelRight}
            </text>
          )}

          {/* bands (e.g. percentile range) */}
          {bands.map((band, i) => (
            <path key={i} d={bandPath(band, band.axis === 'right' ? pyR : py)} fill={band.color} opacity={0.18} stroke="none" />
          ))}

          {/* x ticks */}
          {xTicks.map((t, i) => (
            <text key={i} x={px(t)} y={h + 26} textAnchor="middle" fontSize={11} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
              {isLogX ? formatPow10(t) : t}
            </text>
          ))}

          {/* reference lines */}
          {refLines.map((r, i) => (
            <g key={i}>
              <line x1={px(r.x)} y1={0} x2={px(r.x)} y2={h} stroke="var(--pom-rule)" strokeWidth={1.5} strokeDasharray="3,3" />
              <text x={px(r.x)} y={-14} textAnchor="middle" fontSize={10.5} fill="var(--pom-ink-soft)" fontFamily={FONT_SANS}>
                {r.label}
              </text>
            </g>
          ))}

          {/* series */}
          {series.map((s, i) => {
            const yFn = pyFor(s)
            const isScatter = s.mode === 'scatter'
            const { dashed, solid } = isScatter ? { dashed: [], solid: [] } : splitDashed(s.points, s.dashBeforeX)
            return (
              <g key={i}>
                {!isScatter && dashed.length > 0 && (
                  <path d={pathFor(dashed, yFn)} fill="none" stroke={s.color} strokeWidth={2.25} strokeDasharray="7,5" opacity={0.75} />
                )}
                {!isScatter && (
                  <path d={pathFor(solid.length > 0 ? solid : s.points, yFn)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                )}
                {s.points.filter(p => p.y !== null).map((p, j) => (
                  <circle
                    key={j} cx={px(p.x)} cy={yFn(p.y as number)}
                    r={s.pointRadius ?? (isScatter ? 2.5 : 3)}
                    fill={s.color}
                    opacity={s.pointOpacity ?? (isScatter ? 0.55 : 1)}
                  />
                ))}
                {s.endLabel && (() => {
                  const last = [...s.points].filter(p => p.y !== null).pop()
                  if (!last) return null
                  return (
                    <text
                      x={px(last.x) + 10} y={yFn(last.y as number) + 4} fontSize={12.5} fontWeight={700}
                      fill={s.color} fontFamily={FONT_SANS}
                    >
                      {s.endLabel}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* crosshair + hover dots */}
          {nearestX !== null && (
            <g pointerEvents="none">
              <line x1={px(nearestX)} y1={0} x2={px(nearestX)} y2={h} stroke="var(--pom-ink)" strokeWidth={1} opacity={0.35} />
              {series.map((s, i) => {
                const pt = nearestPointIn(s, nearestX)
                if (!pt || pt.y === null) return null
                return (
                  <circle key={i} cx={px(pt.x)} cy={pyFor(s)(pt.y)} r={5.5} fill="var(--pom-paper)" stroke={s.color} strokeWidth={2.5} />
                )
              })}
            </g>
          )}

          {/* stat box */}
          {statBox && (
            <foreignObject x={8} y={h - 90} width={260} height={86}>
              <div style={{
                background: 'var(--pom-cream)', border: '1px solid var(--pom-rule)', borderRadius: 8,
                padding: '10px 14px', fontFamily: FONT_MONO, fontSize: 11.5, color: 'var(--pom-ink)', lineHeight: 1.5,
              }}>
                {statBox.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </foreignObject>
          )}
        </g>
      </svg>

      {/* tooltip */}
      {nearestX !== null && (
        <div style={{
          position: 'absolute',
          top: 4,
          right: 0,
          background: 'var(--pom-ink)',
          color: 'var(--pom-paper)',
          borderRadius: 8,
          padding: '8px 12px',
          fontFamily: FONT_MONO,
          fontSize: 11.5,
          lineHeight: 1.6,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>
            {isLogX ? nearestX.toLocaleString(undefined, { maximumFractionDigits: 0 }) : Math.round(nearestX)}
          </div>
          {series.map((s, i) => {
            const pt = nearestPointIn(s, nearestX)
            if (!pt || pt.y === null) return null
            return (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                <span>{s.name}: {isLogY ? pt.y.toLocaleString(undefined, { maximumFractionDigits: 4 }) : yFormat(pt.y)}</span>
              </div>
            )
          })}
        </div>
      )}

      <div style={{
        fontFamily: FONT_SANS, fontStyle: 'italic', fontSize: 11.5, color: 'var(--pom-ink-soft)',
        opacity: 0.75, marginTop: 6,
      }}>
        {sourceNote}
      </div>
    </div>
  )
}
