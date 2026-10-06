import React from 'react'

export interface LineChartPoint { x: number; y: number; label?: string }

interface Props {
  points: LineChartPoint[]
  width?: number
  height?: number
  progress?: number
  highlightIndex?: number
  xLabels?: string[]
  yLabel?: string
  color?: string
}

export default function LineChart({
  points,
  width = 600,
  height = 240,
  progress = 1,
  highlightIndex,
  xLabels,
  yLabel,
  color = 'var(--pom-pink)',
}: Props) {
  const pad = { top: 20, right: 24, bottom: 40, left: 48 }
  const w = width - pad.left - pad.right
  const h = height - pad.top - pad.bottom

  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys) * 0.9, maxY = Math.max(...ys) * 1.05

  const px = (x: number) => ((x - minX) / (maxX - minX)) * w
  const py = (y: number) => h - ((y - minY) / (maxY - minY)) * h

  const cutoff = Math.floor(progress * points.length)
  const visiblePoints = points.slice(0, Math.max(2, cutoff))

  const pathD = visiblePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.x)} ${py(p.y)}`).join(' ')
  const fillD = visiblePoints.length > 1
    ? `${pathD} L ${px(visiblePoints[visiblePoints.length - 1].x)} ${h} L ${px(visiblePoints[0].x)} ${h} Z`
    : ''

  const hlIdx = highlightIndex !== undefined ? highlightIndex : visiblePoints.length - 1
  const hlPoint = visiblePoints[Math.min(hlIdx, visiblePoints.length - 1)]

  const gridLines = 4
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {Array.from({ length: gridLines }).map((_, i) => {
          const yVal = minY + (maxY - minY) * (i / (gridLines - 1))
          const yPos = py(yVal)
          return (
            <g key={i}>
              <line x1={0} y1={yPos} x2={w} y2={yPos} stroke="var(--pom-rule)" strokeWidth={1} />
              <text x={-8} y={yPos + 4} textAnchor="end" fontSize={10} fill="var(--pom-ink-soft)" fontFamily='"JetBrains Mono", monospace'>
                {Math.round(yVal).toLocaleString()}
              </text>
            </g>
          )
        })}
        {yLabel && (
          <text x={-36} y={h / 2} textAnchor="middle" fontSize={10} fill="var(--pom-ink-soft)" fontFamily='"JetBrains Mono", monospace' transform={`rotate(-90,-36,${h / 2})`}>
            {yLabel}
          </text>
        )}
        {xLabels && xLabels.map((lbl, i) => (
          <text key={i} x={px(minX + (maxX - minX) * (i / (xLabels.length - 1)))} y={h + 28} textAnchor="middle" fontSize={10} fill="var(--pom-ink-soft)" fontFamily='"JetBrains Mono", monospace'>
            {lbl}
          </text>
        ))}
        {fillD && (
          <path d={fillD} fill={color} opacity={0.12} />
        )}
        {pathD && (
          <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {hlPoint && (
          <>
            <circle cx={px(hlPoint.x)} cy={py(hlPoint.y)} r={6} fill={color} />
            <circle cx={px(hlPoint.x)} cy={py(hlPoint.y)} r={3} fill="var(--pom-paper)" />
            {hlPoint.label && (
              <text x={px(hlPoint.x)} y={py(hlPoint.y) - 12} textAnchor="middle" fontSize={11} fontWeight={600} fill={color} fontFamily='"JetBrains Mono", monospace'>
                {hlPoint.label}
              </text>
            )}
          </>
        )}
      </g>
    </svg>
  )
}
