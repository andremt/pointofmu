'use client'
import { useEffect, useRef, useState } from 'react'
import { STRATEGY_DATA } from './strategyData'

// ── Plotly layout base ────────────────────────────────────────────────────────
const LAYOUT_BASE = {
  paper_bgcolor: '#F7F4ED',
  plot_bgcolor: '#F7F4ED',
  font: { family: 'JetBrains Mono, monospace', color: '#0E0E10', size: 11 },
  xaxis: { gridcolor: 'rgba(14,14,16,0.08)', linecolor: 'rgba(14,14,16,0.15)', tickfont: { size: 10 } },
  yaxis: { gridcolor: 'rgba(14,14,16,0.08)', linecolor: 'rgba(14,14,16,0.15)', tickfont: { size: 10 } },
  legend: { bgcolor: 'transparent', borderwidth: 0 },
  margin: { t: 20, r: 20, b: 40, l: 55 },
  hovermode: 'x unified' as const,
}

// ── Typed helpers ─────────────────────────────────────────────────────────────
type Direction = 'LONG' | 'SHORT' | 'NEUTRAL'
type Signal = { label: string; direction: Direction; carry?: number; beta?: number; score?: number; value?: number }

function SignalBadge({ label, direction }: { label: string; direction: Direction }) {
  const config: Record<Direction, { bg: string; color: string }> = {
    LONG:    { bg: 'rgba(16,185,129,0.12)',  color: '#10B981' },
    SHORT:   { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
    NEUTRAL: { bg: 'rgba(14,14,16,0.06)',    color: '#6B7280' },
  }
  const { bg, color } = config[direction]
  return (
    <span style={{
      background: bg, color, border: `1px solid ${color}33`,
      borderRadius: 6, padding: '4px 10px',
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600,
      display: 'inline-block', margin: '3px 4px', letterSpacing: '0.04em',
    }}>
      {label}: {direction}
    </span>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 100,
      borderTop: `2px solid ${color}`,
      paddingTop: 16, paddingRight: 8,
    }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 28, color, lineHeight: 1 }}>{value}</div>
    </div>
  )
}

function SectionDivider({ num, tag, title, journal }: { num: string; tag: string; title: string; journal?: string }) {
  return (
    <div style={{ borderTop: '2px solid var(--pom-ink)', paddingTop: 32, marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-pink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>μ · {tag}</span>
        {journal && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)' }}>· {journal}</span>}
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', marginLeft: 'auto' }}>{num}</span>
      </div>
      <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(22px,4vw,32px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', margin: 0, lineHeight: 1.1 }}>
        {title}
      </h2>
    </div>
  )
}

function Narrative({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 16, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 32 }}>
      {children}
    </div>
  )
}

function ChartContainer({ id, height = 420 }: { id: string; height?: number }) {
  return (
    <div style={{ background: 'var(--pom-paper)', border: '1.5px solid var(--pom-rule)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      <div id={id} style={{ height }} />
    </div>
  )
}

function SignalCard({ title, signals, note }: { title: string; signals: Signal[]; note?: string }) {
  return (
    <div style={{ background: 'var(--pom-cream)', border: '1.5px solid var(--pom-rule)', borderRadius: 12, padding: '24px 28px', marginBottom: 32 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pom-ink-soft)', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {signals.map(s => <SignalBadge key={s.label} label={s.label} direction={s.direction} />)}
      </div>
      {note && <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#9CA3AF', marginTop: 12, margin: '12px 0 0' }}>{note}</p>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IlmanenDashboard() {
  const plotlyLoaded = useRef(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as Window & { Plotly?: unknown }).Plotly) {
      plotlyLoaded.current = true
      setReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.plot.ly/plotly-2.26.0.min.js'
    script.async = true
    script.onload = () => {
      plotlyLoaded.current = true
      setReady(true)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!ready) return
    const Plotly = (window as Window & { Plotly?: { newPlot: (id: string, data: unknown[], layout: unknown, config?: unknown) => void } }).Plotly
    if (!Plotly) return

    const cfg = { displayModeBar: false, responsive: true }
    const PINK = '#FF3D8B'
    const BLUE = '#2B4BFF'
    const INK  = '#0E0E10'
    const GREY = 'rgba(14,14,16,0.3)'

    // ── P1: FX Carry equity ────────────────────────────────────────────────
    {
      const p = STRATEGY_DATA.p1
      Plotly.newPlot('chart-p1', [
        {
          type: 'scatter', mode: 'lines',
          x: p.bench_dates as unknown as string[], y: p.bench_values as unknown as number[],
          name: 'SPY B&H', line: { color: GREY, width: 1.5, dash: 'dot' },
        },
        {
          type: 'scatter', mode: 'lines',
          x: p.dates as unknown as string[], y: p.values as unknown as number[],
          name: 'FX Carry', line: { color: PINK, width: 2 },
          fill: 'tozeroy', fillcolor: 'rgba(255,61,139,0.06)',
        },
      ], {
        ...LAYOUT_BASE, height: 420,
        margin: { ...LAYOUT_BASE.margin, t: 10, l: 55 },
        yaxis: { ...LAYOUT_BASE.yaxis, tickformat: '.2f', title: { text: 'Cumulative Return', font: { size: 10 } } },
        legend: { ...LAYOUT_BASE.legend, orientation: 'h', y: -0.12 },
        xaxis: {
          ...LAYOUT_BASE.xaxis,
          rangeselector: { buttons: [
            { count: 1, label: '1Y', step: 'year', stepmode: 'backward' },
            { count: 3, label: '3Y', step: 'year', stepmode: 'backward' },
            { label: 'All', step: 'all' },
          ], bgcolor: '#F7F4ED', font: { size: 10 } },
        },
      }, cfg)
    }

    // ── P2: Trend Following equity ─────────────────────────────────────────
    {
      const p = STRATEGY_DATA.p2
      Plotly.newPlot('chart-p2', [
        {
          type: 'scatter', mode: 'lines',
          x: p.bench_dates as unknown as string[], y: p.bench_values as unknown as number[],
          name: 'SPY B&H', line: { color: GREY, width: 1.5, dash: 'dot' },
        },
        {
          type: 'scatter', mode: 'lines',
          x: p.dates as unknown as string[], y: p.values as unknown as number[],
          name: 'Trend Following', line: { color: BLUE, width: 2 },
          fill: 'tozeroy', fillcolor: 'rgba(43,75,255,0.06)',
        },
      ], {
        ...LAYOUT_BASE, height: 420,
        yaxis: { ...LAYOUT_BASE.yaxis, tickformat: '.2f', title: { text: 'Cumulative Return', font: { size: 10 } } },
        legend: { ...LAYOUT_BASE.legend, orientation: 'h', y: -0.12 },
        xaxis: {
          ...LAYOUT_BASE.xaxis,
          rangeselector: { buttons: [
            { count: 1, label: '1Y', step: 'year', stepmode: 'backward' },
            { count: 3, label: '3Y', step: 'year', stepmode: 'backward' },
            { label: 'All', step: 'all' },
          ], bgcolor: '#F7F4ED', font: { size: 10 } },
        },
      }, cfg)
    }

    // ── P3: Value equity ───────────────────────────────────────────────────
    {
      const p = STRATEGY_DATA.p3
      Plotly.newPlot('chart-p3', [
        {
          type: 'scatter', mode: 'lines',
          x: p.bench_dates as unknown as string[], y: p.bench_values as unknown as number[],
          name: 'SPY B&H', line: { color: GREY, width: 1.5, dash: 'dot' },
        },
        {
          type: 'scatter', mode: 'lines',
          x: p.dates as unknown as string[], y: p.values as unknown as number[],
          name: 'Value', line: { color: '#F59E0B', width: 2 },
          fill: 'tozeroy', fillcolor: 'rgba(245,158,11,0.06)',
        },
      ], {
        ...LAYOUT_BASE, height: 420,
        yaxis: { ...LAYOUT_BASE.yaxis, tickformat: '.2f', title: { text: 'Cumulative Return', font: { size: 10 } } },
        legend: { ...LAYOUT_BASE.legend, orientation: 'h', y: -0.12 },
        xaxis: {
          ...LAYOUT_BASE.xaxis,
          rangeselector: { buttons: [
            { count: 1, label: '1Y', step: 'year', stepmode: 'backward' },
            { count: 3, label: '3Y', step: 'year', stepmode: 'backward' },
            { label: 'All', step: 'all' },
          ], bgcolor: '#F7F4ED', font: { size: 10 } },
        },
      }, cfg)
    }

    // ── P4: BAB equity ─────────────────────────────────────────────────────
    {
      const p = STRATEGY_DATA.p4
      if (p.dates.length > 0) {
        Plotly.newPlot('chart-p4', [
          {
            type: 'scatter', mode: 'lines',
            x: p.bench_dates as unknown as string[], y: p.bench_values as unknown as number[],
            name: 'SPY B&H', line: { color: GREY, width: 1.5, dash: 'dot' },
          },
          {
            type: 'scatter', mode: 'lines',
            x: p.dates as unknown as string[], y: p.values as unknown as number[],
            name: 'BAB', line: { color: PINK, width: 2.5 },
          },
        ], {
          ...LAYOUT_BASE, height: 420,
          yaxis: { ...LAYOUT_BASE.yaxis, tickformat: '.2f', title: { text: 'Cumulative Return', font: { size: 10 } } },
          legend: { ...LAYOUT_BASE.legend, orientation: 'h', y: -0.12 },
        }, cfg)
      }

      // BAB beta bar chart
      const betas = (STRATEGY_DATA.p4.signals as unknown as unknown as Signal[]).map(s => ({ label: s.label, beta: s.beta ?? 0, dir: s.direction }))
      if (betas.length > 0) {
        Plotly.newPlot('chart-p4-betas', [
          {
            type: 'bar', orientation: 'h',
            x: betas.map(b => b.beta),
            y: betas.map(b => b.label),
            marker: { color: betas.map(b => b.dir === 'LONG' ? BLUE : b.dir === 'SHORT' ? '#EF4444' : 'rgba(14,14,16,0.15)') },
            text: betas.map(b => b.beta.toFixed(2)),
            textposition: 'outside',
          },
        ], {
          ...LAYOUT_BASE, height: Math.max(400, betas.length * 22),
          xaxis: { ...LAYOUT_BASE.xaxis, title: { text: 'Rolling 52-wk Beta vs SPY', font: { size: 10 } } },
          margin: { t: 10, r: 60, b: 40, l: 80 },
        }, cfg)
      }
    }

    // ── P5: Signal Stack ───────────────────────────────────────────────────
    {
      const p = STRATEGY_DATA.p5
      Plotly.newPlot('chart-p5', [
        {
          type: 'scatter', mode: 'lines',
          x: p.bench_dates as unknown as string[], y: p.bench_values as unknown as number[],
          name: '60/40 Bench', line: { color: GREY, width: 1.5, dash: 'dot' },
        },
        {
          type: 'scatter', mode: 'lines',
          x: (p.eq_carry as { dates: readonly string[]; values: readonly number[] }).dates as unknown as string[],
          y: (p.eq_carry as { dates: readonly string[]; values: readonly number[] }).values as unknown as number[],
          name: 'Carry Only', line: { color: '#EF4444', width: 1.2 },
        },
        {
          type: 'scatter', mode: 'lines',
          x: (p.eq_trend as { dates: readonly string[]; values: readonly number[] }).dates as unknown as string[],
          y: (p.eq_trend as { dates: readonly string[]; values: readonly number[] }).values as unknown as number[],
          name: 'Trend Only', line: { color: BLUE, width: 1.2 },
        },
        {
          type: 'scatter', mode: 'lines',
          x: (p.eq_value as { dates: readonly string[]; values: readonly number[] }).dates as unknown as string[],
          y: (p.eq_value as { dates: readonly string[]; values: readonly number[] }).values as unknown as number[],
          name: 'Value Only', line: { color: '#F59E0B', width: 1.2 },
        },
        {
          type: 'scatter', mode: 'lines',
          x: p.dates as unknown as string[], y: p.values as unknown as number[],
          name: 'Signal Stack', line: { color: INK, width: 2.5 },
        },
      ], {
        ...LAYOUT_BASE, height: 420,
        yaxis: { ...LAYOUT_BASE.yaxis, tickformat: '.2f', title: { text: 'Cumulative Return', font: { size: 10 } } },
        legend: { ...LAYOUT_BASE.legend, orientation: 'h', y: -0.12 },
        xaxis: {
          ...LAYOUT_BASE.xaxis,
          rangeselector: { buttons: [
            { count: 1, label: '1Y', step: 'year', stepmode: 'backward' },
            { count: 3, label: '3Y', step: 'year', stepmode: 'backward' },
            { label: 'All', step: 'all' },
          ], bgcolor: '#F7F4ED', font: { size: 10 } },
        },
      }, cfg)
    }

  }, [ready])

  const p1s = STRATEGY_DATA.p1.stats
  const p2s = STRATEGY_DATA.p2.stats
  const p3s = STRATEGY_DATA.p3.stats
  const p4s = STRATEGY_DATA.p4.stats
  const p5s = STRATEGY_DATA.p5.stats

  const fmtPct  = (v: number) => `${(v * 100).toFixed(1)}%`
  const fmtSr   = (v: number) => v.toFixed(2)
  const posColor = (v: number, threshold = 0) => v > threshold ? 'var(--pom-pink)' : 'var(--pom-ink-soft)'

  const WRAP: React.CSSProperties = {
    maxWidth: 900, margin: '0 auto', padding: '0 36px',
  }

  return (
    <div>
      {/* ── Overview narrative ─────────────────────────────────────────────── */}
      <div style={{ ...WRAP, paddingTop: 0, paddingBottom: 80 }}>

        {/* ── P1: FX Carry ──────────────────────────────────────────────── */}
        <div style={{ paddingTop: 72 }}>
          <SectionDivider num="01" tag="fx carry" title="G10 FX Carry, borrow cheap, fund expensive." journal="Ilmanen (2011)" />

          <Narrative>
            <p style={{ marginBottom: 16 }}>
              The carry trade is one of the oldest tricks in FX: borrow in low-rate currencies (JPY, CHF) and invest in high-rate ones (NZD, AUD, NOK). Uncovered interest parity predicts these differentials should be offset by exchange rate moves, empirically they aren&apos;t, creating the &ldquo;UIP puzzle.&rdquo;
            </p>
            <p>
              I added a momentum overlay, if a currency&apos;s 4-week return is negative, the weight is zeroed for that month. Vol-weighting ensures Norwegian krone doesn&apos;t dominate purely because of high carry. Post-2020 volatility has made this trade rockier, which shows in the flat equity curve.
            </p>
          </Narrative>

          {/* Stat row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatBox label="Ann. Return" value={fmtPct(p1s.ann_ret)} color={posColor(p1s.ann_ret)} />
            <StatBox label="Ann. Vol"    value={fmtPct(p1s.ann_vol)} color="var(--pom-blue)" />
            <StatBox label="Sharpe"      value={fmtSr(p1s.sharpe)}   color={posColor(p1s.sharpe, 0.5)} />
            <StatBox label="Max DD"      value={fmtPct(p1s.max_dd)}  color="#EF4444" />
          </div>

          <ChartContainer id="chart-p1" height={420} />

          <SignalCard
            title="Live positions, G10 currencies"
            signals={STRATEGY_DATA.p1.signals as unknown as Signal[]}
            note="NEUTRAL = momentum overlay active (4-week return negative)"
          />
        </div>

        {/* ── P2: Trend Following ───────────────────────────────────────── */}
        <div style={{ paddingTop: 72 }}>
          <SectionDivider num="02" tag="trend following" title="Multi-Asset Trend, CTAs have been doing this for 50 years." journal="Moskowitz, Ooi & Pedersen (2012)" />

          <Narrative>
            <p style={{ marginBottom: 16 }}>
              Time-series momentum (TSMOM), go long assets trending up, short those trending down, is one of the most replicated factors in finance. Signal is 12-month return minus 1-month (the &ldquo;12-1&rdquo; skip-month momentum), applied across 12 asset classes.
            </p>
            <p>
              Each position is inverse-volatility weighted so every asset contributes equally to portfolio risk. Trend following is famous for crisis alpha: it gets short early in a down-trend. The strategy ran across equities, bonds, commodities, and FX with monthly rebalancing.
            </p>
          </Narrative>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatBox label="Ann. Return" value={fmtPct(p2s.ann_ret)} color={posColor(p2s.ann_ret)} />
            <StatBox label="Ann. Vol"    value={fmtPct(p2s.ann_vol)} color="var(--pom-blue)" />
            <StatBox label="Sharpe"      value={fmtSr(p2s.sharpe)}   color={posColor(p2s.sharpe, 0.5)} />
            <StatBox label="Max DD"      value={fmtPct(p2s.max_dd)}  color="#EF4444" />
          </div>

          <ChartContainer id="chart-p2" height={420} />

          <SignalCard
            title="Live positions, multi-asset trend"
            signals={STRATEGY_DATA.p2.signals as unknown as Signal[]}
          />
        </div>

        {/* ── P3: Value Across Borders ──────────────────────────────────── */}
        <div style={{ paddingTop: 72 }}>
          <SectionDivider num="03" tag="country value" title="Value Across Borders, long cheap countries, short expensive ones." journal="Ilmanen (2011)" />

          <Narrative>
            <p style={{ marginBottom: 16 }}>
              What does &ldquo;cheap&rdquo; mean at the country level? CAPE, dividend yield, book-to-market all have blind spots. My proxy: the negative of the past year&apos;s price return. Countries that underperformed tend to be cheaper relative to fundamentals, a crude mean-reversion assumption.
            </p>
            <p>
              Annual rebalance, long the 5 cheapest, short the 5 most expensive. Equal-weight within each leg. US tech dominance has made cross-country valuation spreads wider and stickier, which has hurt this factor over the past decade.
            </p>
          </Narrative>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatBox label="Ann. Return" value={fmtPct(p3s.ann_ret)} color={posColor(p3s.ann_ret)} />
            <StatBox label="Ann. Vol"    value={fmtPct(p3s.ann_vol)} color="var(--pom-blue)" />
            <StatBox label="Sharpe"      value={fmtSr(p3s.sharpe)}   color={posColor(p3s.sharpe, 0.5)} />
            <StatBox label="Max DD"      value={fmtPct(p3s.max_dd)}  color="#EF4444" />
          </div>

          <ChartContainer id="chart-p3" height={420} />

          <SignalCard
            title="Live positions, country ETFs (annual rebalance)"
            signals={STRATEGY_DATA.p3.signals as unknown as Signal[]}
          />
        </div>

        {/* ── P4: BAB ───────────────────────────────────────────────────── */}
        <div style={{ paddingTop: 72 }}>
          <SectionDivider num="04" tag="betting against beta" title="Betting Against Beta, the CAPM is empirically backwards." journal="Frazzini & Pedersen (2014)" />

          <Narrative>
            <p style={{ marginBottom: 16 }}>
              CAPM says higher beta equals higher expected return. Frazzini and Pedersen showed this is empirically backwards within equities: low-beta stocks deliver better Sharpe ratios than high-beta stocks. The explanation: leverage-constrained investors reach for beta to hit return targets, bidding up high-beta stocks.
            </p>
            <p>
              The strategy levers up the low-beta quintile and de-levers the high-beta quintile to create a market-neutral portfolio. Rolling 52-week betas computed on a universe of 60 large-cap stocks. Floor beta at 0.2 to cap max leverage at 5x. Monthly rebalance. This is the strongest performer of the five.
            </p>
          </Narrative>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatBox label="Ann. Return" value={fmtPct(p4s.ann_ret)} color={posColor(p4s.ann_ret)} />
            <StatBox label="Ann. Vol"    value={fmtPct(p4s.ann_vol)} color="var(--pom-blue)" />
            <StatBox label="Sharpe"      value={fmtSr(p4s.sharpe)}   color={posColor(p4s.sharpe, 0.5)} />
            <StatBox label="Max DD"      value={fmtPct(p4s.max_dd)}  color="#EF4444" />
          </div>

          {/* Pull quote */}
          <div style={{ borderLeft: '3px solid var(--pom-pink)', paddingLeft: 20, marginBottom: 32 }}>
            <p style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 22, color: 'var(--pom-ink)', lineHeight: 1.4 }}>
              &ldquo;The single clearest finding: low-risk assets earn higher risk-adjusted returns than high-risk assets.&rdquo;
            </p>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', marginTop: 8 }}>, Frazzini &amp; Pedersen (2014)</p>
          </div>

          <ChartContainer id="chart-p4" height={420} />
          <ChartContainer id="chart-p4-betas" height={Math.max(400, STRATEGY_DATA.p4.signals.length * 22)} />

          <SignalCard
            title="Live positions, current beta quintiles"
            signals={STRATEGY_DATA.p4.signals as unknown as Signal[]}
            note="Blue = LONG (low-beta), Red = SHORT (high-beta), Grey = middle quintiles (neutral)"
          />
        </div>

        {/* ── P5: Signal Stack ──────────────────────────────────────────── */}
        <div style={{ paddingTop: 72, paddingBottom: 80 }}>
          <SectionDivider num="05" tag="signal stack" title="Signal Stack, carry + trend + value, combined." journal="Ilmanen (2011)" />

          <Narrative>
            <p style={{ marginBottom: 16 }}>
              If carry, trend, and value each have mediocre Sharpe ratios individually, what happens when you combine them? Carry tends to struggle in risk-off environments precisely when trend does best. Value moves on long cycles mostly uncorrelated with both. Combining with equal weights smooths the equity curve.
            </p>
            <p>
              Each signal is z-scored cross-sectionally across 20 assets, combined with 1/3 weights, then the portfolio goes long the top 7 and short the bottom 7 by composite score. The chart below shows the Sharpe improvement through diversification, Ilmanen&apos;s central thesis.
            </p>
          </Narrative>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatBox label="Ann. Return" value={fmtPct(p5s.ann_ret)} color={posColor(p5s.ann_ret)} />
            <StatBox label="Ann. Vol"    value={fmtPct(p5s.ann_vol)} color="var(--pom-blue)" />
            <StatBox label="Sharpe"      value={fmtSr(p5s.sharpe)}   color={posColor(p5s.sharpe, 0.5)} />
            <StatBox label="Max DD"      value={fmtPct(p5s.max_dd)}  color="#EF4444" />
          </div>

          <ChartContainer id="chart-p5" height={420} />

          <SignalCard
            title="Live positions, composite signal (top 7 long, bottom 7 short)"
            signals={STRATEGY_DATA.p5.signals as unknown as Signal[]}
          />

          {/* Conclusions */}
          <div style={{ borderTop: '2px solid var(--pom-ink)', paddingTop: 40, marginTop: 24 }}>
            <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 24 }}>What I found.</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {[
                { label: 'What worked', color: '#10B981', body: 'BAB showed consistent alpha, Sharpe of 1.06 across the backtest window. The low-beta premium is real. Signal Stack outperformed all individual components through diversification.' },
                { label: "What didn't", color: '#EF4444', body: 'FX Carry suffered from post-2020 carry crash volatility. Country Value struggled as US tech dominance made cross-country spreads wider and stickier than any mean-reversion model expected.' },
                { label: 'What\'s next', color: 'var(--pom-blue)', body: 'Incorporate PE/DY data for richer value signals. Test crypto factor premia. Implement regime detection to tilt factor weights. Add ML-based signal combination.' },
              ].map(c => (
                <div key={c.label} style={{ borderTop: `2px solid ${c.color}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.color, marginBottom: 8 }}>{c.label}</div>
                  <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, lineHeight: 1.65, color: 'var(--pom-ink-soft)', margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 48, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', opacity: 0.6 }}>
            Data: Yahoo Finance (weekly prices) / FRED (short rates) · Python + pandas · Backtest 2018,2026 · No transaction costs
          </div>
        </div>
      </div>
    </div>
  )
}
