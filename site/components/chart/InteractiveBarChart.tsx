'use client'

import { useState } from 'react'

export interface BarDatum {
  label: string
  sublabel?: string
  value: number
  color: string
  detail?: string
  /** starts a new visual group with extra spacing above this bar (e.g. a new platform) */
  groupStart?: boolean
}

interface Props {
  title: string
  bars: string /** base64(JSON.stringify(BarDatum[])) */
  xLabel: string
  /** plain string, not a JS expression, this MDX pipeline only reliably passes quoted string attributes */
  xMax?: string
  xTickStep?: string
  valueSuffix?: string
  /** base64(JSON.stringify({x:number,label:string})) */
  refLine?: string
  sourceNote: string
}

const FONT_SANS = '"Geist", sans-serif'
const FONT_MONO = '"JetBrains Mono", monospace'
const VB_W = 900
const GROUP_GAP = 18

export default function InteractiveBarChart({
  title, bars: barsJSON, xLabel, xMax: xMaxStr, xTickStep: xTickStepStr, valueSuffix = '%', refLine: refLineJSON, sourceNote,
}: Props) {
  const decode = (b64: string) => JSON.parse(decodeURIComponent(escape(atob(b64))))
  const bars: BarDatum[] = decode(barsJSON)
  const xMax = xMaxStr ? Number(xMaxStr) : 100
  const xTickStep = xTickStepStr ? Number(xTickStepStr) : undefined
  const refLine: { x: number; label: string } | undefined = refLineJSON ? decode(refLineJSON) : undefined
  const [hover, setHover] = useState<number | null>(null)

  const pad = { top: 40, right: 24, bottom: 46, left: 210 }
  const w = VB_W - pad.left - pad.right
  const rowH = 82

  // cumulative y offset per row, adding a gap before groupStart rows (except the first)
  const rowY: number[] = []
  let cursor = 0
  bars.forEach((b, i) => {
    if (i > 0 && b.groupStart) cursor += GROUP_GAP
    rowY.push(cursor)
    cursor += rowH
  })
  const h = cursor

  const px = (v: number) => (v / xMax) * w
  const step = xTickStep ?? xMax / 5
  const ticks: number[] = []
  for (let v = 0; v <= xMax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100)

  return (
    <div style={{ position: 'relative', margin: '32px 0 8px' }}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 16, color: 'var(--pom-ink)', marginBottom: 10, letterSpacing: '-0.01em' }}>
        {title}
      </div>

      <svg viewBox={`0 0 ${VB_W} ${h + pad.top + pad.bottom}`} width="100%" style={{ display: 'block', height: 'auto', overflow: 'visible' }}>
        <g transform={`translate(${pad.left},${pad.top})`}>
          {ticks.map(v => (
            <line key={v} x1={px(v)} y1={-8} x2={px(v)} y2={h} stroke="var(--pom-rule)" strokeWidth={1} />
          ))}
          {ticks.map(v => (
            <text key={v} x={px(v)} y={h + 22} textAnchor="middle" fontSize={11} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
              {v}
            </text>
          ))}
          <text x={w / 2} y={h + 38} textAnchor="middle" fontSize={11.5} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
            {xLabel}
          </text>

          {refLine && (
            <g>
              <line x1={px(refLine.x)} y1={-8} x2={px(refLine.x)} y2={h} stroke="var(--pom-ink)" strokeWidth={1.5} strokeDasharray="3,3" />
              <text x={px(refLine.x)} y={-14} textAnchor="middle" fontSize={10.5} fill="var(--pom-ink-soft)" fontFamily={FONT_SANS} fontStyle="italic">
                {refLine.label}
              </text>
            </g>
          )}

          {bars.map((b, i) => {
            const y = rowY[i] + rowH * 0.22
            const barH = rowH * 0.56
            const isHover = hover === i
            return (
              <g key={i}>
                {b.label && (
                  <text x={-14} y={y + barH / 2 - 8} textAnchor="end" fontSize={13} fontWeight={600} fill="var(--pom-ink)" fontFamily={FONT_SANS}>
                    {b.label}
                  </text>
                )}
                {b.sublabel && (
                  <text x={-14} y={y + barH / 2 + 10} textAnchor="end" fontSize={11} fill="var(--pom-ink-soft)" fontFamily={FONT_MONO}>
                    {b.sublabel}
                  </text>
                )}
                <rect
                  x={0} y={y} width={Math.max(px(b.value), 2)} height={barH} rx={4}
                  fill={b.color} opacity={isHover ? 1 : 0.9}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.1s' }}
                />
                <text x={px(b.value) + 10} y={y + barH / 2 + 5} fontSize={14} fontWeight={700} fill="var(--pom-ink)" fontFamily={FONT_MONO}>
                  {b.value.toFixed(2)}{valueSuffix}
                </text>
                {isHover && b.detail && (
                  <foreignObject x={0} y={Math.max(rowY[i] - 40, -pad.top + 2)} width={w} height={40}>
                    <div style={{
                      background: 'var(--pom-ink)', color: 'var(--pom-paper)', borderRadius: 6,
                      padding: '6px 12px', fontFamily: FONT_MONO, fontSize: 11, display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', whiteSpace: 'normal', maxWidth: w - 20,
                    }}>
                      {b.detail}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      <div style={{ fontFamily: FONT_SANS, fontStyle: 'italic', fontSize: 11.5, color: 'var(--pom-ink-soft)', opacity: 0.75, marginTop: 6 }}>
        {sourceNote}
      </div>
    </div>
  )
}
