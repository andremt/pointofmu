import { notFound } from "next/navigation"

export function generateStaticParams() {
  return [{ slug: "ilmanen" }]
}

interface Strategy {
  kicker: string
  source: string
  title: string
  dek: string
  stats: { label: string; value: string }[]
  positionsLabel: string
  positions: { name: string; side: "LONG" | "SHORT" | "NEUTRAL" }[]
  quote?: string
}

const ILMANEN_STRATEGIES: Strategy[] = [
  {
    kicker: "fx carry",
    source: "Ilmanen (2011)",
    title: "G10 FX Carry, borrow cheap, fund expensive.",
    dek: "The carry trade is one of the oldest tricks in FX: borrow in low-rate currencies (JPY, CHF) and invest in high-rate ones. A momentum overlay zeroes the weight for any currency whose 4-week return is negative.",
    stats: [
      { label: "Ann. Return", value: "0.3%" },
      { label: "Ann. Vol", value: "3.6%" },
      { label: "Sharpe", value: "0.08" },
      { label: "Max DD", value: "-9.8%" },
    ],
    positionsLabel: "Live positions, G10 currencies",
    positions: [
      { name: "NZD", side: "NEUTRAL" }, { name: "AUD", side: "NEUTRAL" },
      { name: "NOK", side: "NEUTRAL" }, { name: "GBP", side: "NEUTRAL" },
      { name: "CAD", side: "NEUTRAL" }, { name: "EUR", side: "NEUTRAL" },
      { name: "CHF", side: "NEUTRAL" }, { name: "JPY", side: "NEUTRAL" },
      { name: "SEK", side: "SHORT" },
    ],
  },
  {
    kicker: "trend following",
    source: "Moskowitz, Ooi & Pedersen (2012)",
    title: "Multi-Asset Trend, CTAs have been doing this for 50 years.",
    dek: "Time-series momentum: go long assets trending up, short those trending down. Each position is inverse-volatility weighted so every asset contributes equally to portfolio risk.",
    stats: [
      { label: "Ann. Return", value: "3.6%" },
      { label: "Ann. Vol", value: "10.1%" },
      { label: "Sharpe", value: "0.36" },
      { label: "Max DD", value: "-24.4%" },
    ],
    positionsLabel: "Live positions, multi-asset trend",
    positions: [
      { name: "US Equity", side: "LONG" }, { name: "Intl Equity", side: "LONG" },
      { name: "EM Equity", side: "LONG" }, { name: "US 20yr", side: "LONG" },
      { name: "US 7-10yr", side: "LONG" }, { name: "Intl Govt", side: "SHORT" },
      { name: "Gold", side: "LONG" }, { name: "Oil", side: "LONG" },
      { name: "Cmdty Bskt", side: "LONG" }, { name: "EUR", side: "LONG" },
      { name: "JPY", side: "SHORT" }, { name: "AUD", side: "LONG" },
    ],
  },
  {
    kicker: "country value",
    source: "Ilmanen (2011)",
    title: "Value Across Borders, long cheap countries, short expensive ones.",
    dek: "What does \"cheap\" mean at the country level? CAPE, dividend yield, book-to-market all have blind spots. Annual rebalance, long the 5 cheapest, short the 5 most expensive, equal-weight within each leg.",
    stats: [
      { label: "Ann. Return", value: "1.9%" },
      { label: "Ann. Vol", value: "8.5%" },
      { label: "Sharpe", value: "0.22" },
      { label: "Max DD", value: "-12.4%" },
    ],
    positionsLabel: "Live positions, country ETFs (annual rebalance)",
    positions: [
      { name: "Germany", side: "LONG" }, { name: "France", side: "LONG" },
      { name: "Australia", side: "LONG" }, { name: "Singapore", side: "LONG" },
      { name: "Sweden", side: "LONG" }, { name: "Switzerland", side: "NEUTRAL" },
      { name: "US", side: "NEUTRAL" }, { name: "UK", side: "NEUTRAL" },
      { name: "Canada", side: "NEUTRAL" }, { name: "Brazil", side: "NEUTRAL" },
      { name: "Japan", side: "SHORT" }, { name: "Italy", side: "SHORT" },
      { name: "Spain", side: "SHORT" }, { name: "Taiwan", side: "SHORT" },
      { name: "Korea", side: "SHORT" },
    ],
  },
  {
    kicker: "betting against beta",
    source: "Frazzini & Pedersen (2014)",
    title: "Betting Against Beta, the CAPM is empirically backwards.",
    dek: "CAPM says higher beta equals higher expected return. Frazzini and Pedersen showed this is empirically backwards. The strategy levers up the low-beta quintile and de-levers the high-beta quintile to create a market-neutral bet.",
    stats: [
      { label: "Ann. Return", value: "70.5%" },
      { label: "Ann. Vol", value: "66.3%" },
      { label: "Sharpe", value: "1.06" },
      { label: "Max DD", value: "-40.6%" },
    ],
    positionsLabel: "Live positions, current beta quintiles",
    positions: [
      { name: "MRK", side: "LONG" }, { name: "FCX", side: "LONG" }, { name: "LMT", side: "LONG" },
      { name: "NEM", side: "LONG" }, { name: "EXC", side: "LONG" }, { name: "PFE", side: "LONG" },
      { name: "JNJ", side: "LONG" }, { name: "KO", side: "LONG" }, { name: "TMO", side: "LONG" },
      { name: "DUK", side: "LONG" }, { name: "PEP", side: "LONG" }, { name: "LIN", side: "LONG" },
      { name: "PLD", side: "NEUTRAL" }, { name: "HON", side: "NEUTRAL" }, { name: "MCD", side: "NEUTRAL" },
      { name: "WMT", side: "NEUTRAL" }, { name: "BRK-B", side: "NEUTRAL" }, { name: "SHW", side: "NEUTRAL" },
    ],
    quote: "The single clearest finding: low-risk assets earn higher risk-adjusted returns than high-risk assets.",
  },
  {
    kicker: "signal stack",
    source: "Ilmanen (2011)",
    title: "Signal Stack, carry + trend + value, combined.",
    dek: "If carry, trend, and value each have mediocre Sharpe ratios individually, what happens when you combine them? Each signal is z-scored cross-sectionally across 20 assets, combined with 1/3 weights, then the portfolio is formed from the top and bottom 7.",
    stats: [
      { label: "Ann. Return", value: "-1.9%" },
      { label: "Ann. Vol", value: "5.5%" },
      { label: "Sharpe", value: "-0.34" },
      { label: "Max DD", value: "-22.3%" },
    ],
    positionsLabel: "Live positions, composite signal (top 7 long, bottom 7 short)",
    positions: [
      { name: "Korea", side: "LONG" }, { name: "EM Equity", side: "LONG" },
      { name: "Australia", side: "LONG" }, { name: "Germany", side: "LONG" },
      { name: "DM Equity", side: "LONG" }, { name: "AUD", side: "LONG" },
      { name: "Canada", side: "LONG" }, { name: "JPY", side: "SHORT" },
      { name: "US Equity", side: "SHORT" }, { name: "Italy", side: "SHORT" },
      { name: "Spain", side: "SHORT" }, { name: "Cmdty Bskt", side: "SHORT" },
      { name: "Gold", side: "SHORT" }, { name: "Oil", side: "SHORT" },
    ],
  },
]

const SIDE_COLOR: Record<string, string> = {
  LONG: "bg-blue text-white",
  SHORT: "bg-pink text-white",
  NEUTRAL: "bg-rule text-ink-soft",
}

export default async function MacroDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug !== "ilmanen") notFound()

  return (
    <div className="max-w-4xl mx-auto px-9 py-16">
      <div className="kicker mb-3">μ · Macro quant · Ilmanen</div>
      <h1 className="font-serif italic text-5xl leading-tight mb-4">
        Five factor strategies, built from scratch.
      </h1>
      <p className="text-ink-soft max-w-2xl mb-16">
        I spent a semester reading Ilmanen's Expected Returns and wondering whether these strategies actually hold
        up when you implement them with public data instead of taking the tables on faith.
      </p>

      {ILMANEN_STRATEGIES.map((s) => (
        <section key={s.title} className="border-t border-rule py-10">
          <div className="kicker mb-2">
            μ · {s.kicker} · {s.source}
          </div>
          <h2 className="font-serif italic text-2xl mb-2">{s.title}</h2>
          <p className="text-sm text-ink-soft mb-5 max-w-2xl">{s.dek}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {s.stats.map((st) => (
              <div key={st.label}>
                <div className="text-2xl font-medium">{st.value}</div>
                <div className="text-xs text-ink-soft">{st.label}</div>
              </div>
            ))}
          </div>
          {s.quote && (
            <blockquote className="text-sm italic text-ink-soft border-l-2 border-pink pl-4 mb-5">
              &ldquo;{s.quote}&rdquo;
            </blockquote>
          )}
          <div className="text-xs text-ink-soft mb-2">{s.positionsLabel}</div>
          <div className="flex flex-wrap gap-1.5">
            {s.positions.map((p) => (
              <span key={p.name} className={`text-xs px-2 py-1 rounded ${SIDE_COLOR[p.side]}`}>
                {p.name}
              </span>
            ))}
          </div>
        </section>
      ))}

      <section className="border-t border-rule py-10">
        <h2 className="font-serif italic text-2xl mb-4">What I found.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-medium mb-1">What worked</div>
            <p className="text-ink-soft">
              BAB showed consistent alpha, Sharpe of 1.06 across the backtest window. The low-beta premium is real.
            </p>
          </div>
          <div>
            <div className="font-medium mb-1">What didn&apos;t</div>
            <p className="text-ink-soft">
              FX Carry suffered from post-2020 carry crash volatility. Country Value struggled as US tech dominance
              compressed the opportunity set.
            </p>
          </div>
          <div>
            <div className="font-medium mb-1">What&apos;s next</div>
            <p className="text-ink-soft">
              Incorporate PE/DY data for richer value signals. Test crypto factor premia. Implement regime
              detection.
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-soft mt-6">
          Data: Yahoo Finance (weekly prices) / FRED (short rates) · Python + pandas · Backtest 2018-2026.
        </p>
      </section>
    </div>
  )
}
