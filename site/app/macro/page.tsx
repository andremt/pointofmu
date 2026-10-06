import Link from "next/link"

const REPLICATIONS = [
  {
    slug: "ilmanen",
    kicker: "carry",
    source: "Journal of Finance",
    title: "Carry Trade Returns Across Asset Classes",
    authors: "Koijen, Moskowitz, Pedersen, Vrugt (2018)",
    dek: "Carry predicts returns across currencies, equities, bonds, and commodities. Replicating the cross-asset carry factor.",
    status: "published",
  },
  {
    slug: null,
    kicker: "momentum",
    source: "Journal of Finance",
    title: "Momentum Everywhere",
    authors: "Asness, Moskowitz, Pedersen (2013)",
    dek: "12-1 momentum works across 8 asset classes and 40 countries. Reproducing the momentum factor construction.",
    status: "planned",
  },
  {
    slug: null,
    kicker: "trend",
    source: "SSRN",
    title: "Global Value and Momentum Strategies",
    authors: "Faber (2010)",
    dek: "Simple moving average timing rules applied to global asset allocation. Backtesting the 10-month SMA rule.",
    status: "planned",
  },
  {
    slug: null,
    kicker: "risk",
    source: "Financial Analysts Journal",
    title: "The Death of Diversification Has Been Greatly Exaggerated",
    authors: "Asness, Frazzini, Pedersen (2012)",
    dek: "Leverage aversion and low-risk anomaly across asset classes. Replicating BAB (betting against beta).",
    status: "planned",
  },
]

const CODE_URL = "https://github.com/andremt/macro-quant"

export default function MacroPage() {
  return (
    <div className="max-w-4xl mx-auto px-9 py-16">
      <div className="kicker mb-3">μ · Macro quant</div>
      <h1 className="font-serif italic text-5xl leading-tight mb-6">
        Replicating the research that moves markets.
      </h1>
      <p className="text-ink-soft max-w-2xl mb-4">
        Taking seminal macro and quant finance papers, carry, momentum, trend, risk premia, and rebuilding their
        strategies with public data.
      </p>
      <a href={CODE_URL} target="_blank" rel="noreferrer" className="text-pink font-medium">
        github.com/andremt/macro-quant
      </a>

      <h2 className="font-serif italic text-3xl mt-16 mb-6">Replication log</h2>
      <a href={CODE_URL} target="_blank" rel="noreferrer" className="text-pink text-sm font-medium block mb-6">
        All code →
      </a>
      <div className="space-y-4">
        {REPLICATIONS.map((r) => (
          <div key={r.title} className="border border-rule rounded p-5">
            <div className="kicker mb-1">
              μ · {r.kicker} · {r.source}
            </div>
            <h3 className="font-serif italic text-xl mb-1">{r.title}</h3>
            <div className="text-ink-soft text-sm mb-2">{r.authors}</div>
            <p className="text-sm mb-3">{r.dek}</p>
            {r.status === "published" && r.slug ? (
              <Link href={`/macro/${r.slug}`} className="text-pink text-sm font-medium">
                View dashboard →
              </Link>
            ) : (
              <span className="text-ink-soft text-xs uppercase tracking-wide">planned</span>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-serif italic text-3xl mt-16 mb-6">How these replications work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-medium mb-1">Public data only</div>
          <p className="text-ink-soft">Yahoo Finance, FRED, Kenneth French data library, BIS. No Bloomberg terminal required.</p>
        </div>
        <div>
          <div className="font-medium mb-1">Python + pandas</div>
          <p className="text-ink-soft">All code on GitHub, Jupyter notebooks you can run locally or in Colab.</p>
        </div>
        <div>
          <div className="font-medium mb-1">Show the gaps</div>
          <p className="text-ink-soft">When I can't replicate a result exactly, I document why. Data vintage, index composition, fee assumptions.</p>
        </div>
      </div>
      <a href={CODE_URL} target="_blank" rel="noreferrer" className="text-pink text-sm font-medium block mt-6">
        View notebooks on GitHub
      </a>
    </div>
  )
}
