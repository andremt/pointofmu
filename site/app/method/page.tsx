interface Row {
  dataset: string
  org: string
  n: string
  method: string
}

const ROWS: Row[] = [
  {
    dataset: "Total Income by Age Group, Canada",
    org: "Statistics Canada",
    n: "",
    method:
      "Table 11-10-0239-01, average and median total income by age group and gender, 2024 constant dollars, 2015-2024.",
  },
  {
    dataset: "r-g Series and US Labour Share, 1950-2024",
    org: "FRED · Piketty & Zucman (2014) · World Inequality Lab",
    n: "74",
    method:
      "Real GDP growth (FRED, 5-year centred moving average) against net return on capital calibrated from Piketty-Zucman and the WIL 2025 update, 2-year lag. Correlated against BLS labour-share series.",
  },
  {
    dataset: "Bachelors Without Bachelor's (NBER WP 35179)",
    org: "Chambers, Goldman & Winkelmann, NBER",
    n: "",
    method:
      "Marriage rates by birth cohort (1930-1980) from the paper's own figures, CPS-derived. Cross-checked against BLS CPS Table A-4 earnings by education.",
  },
  {
    dataset: "Team Shooting by Zone, 2001-2024",
    org: "Basketball-Reference",
    n: "716",
    method:
      "716 team-seasons, shot distribution and FG% by zone. Teams ranked into within-season tertiles by analytics score. Season-level (N=24) and team-season regressions, clustered SEs by season.",
  },
  {
    dataset: "PCE Inflation, Fed Funds, and Distributional Accounts",
    org: "FRED · Federal Reserve Distributional Financial Accounts · PGIM",
    n: "52",
    method:
      "PCEPI, PCEPILFE, FEDFUNDS, DFII10 from FRED; wealth distribution from the Fed's Distributional Financial Accounts, Q4 2024; claims checked against PGIM's 2026 Mid-Year Global Market Outlook.",
  },
  {
    dataset: "Predicted Incrementality by Experimentation (PIE)",
    org: "Meta Research & Northwestern University",
    n: "2,226",
    method:
      "Gordon, Moakler & Zettelmeyer, March 2026. Last-click vs. PIE prediction accuracy against RCT ground truth across 2,226 real Meta ad experiments.",
  },
  {
    dataset: "Player-Season xG and Non-Penalty Goals",
    org: "Understat",
    n: "5,498",
    method:
      "5,498 consecutive player-season pairs, six European leagues, 2014/15-2023/24. Min. 900 minutes and 0.05 xG/90 in both seasons of each pair.",
  },
  {
    dataset: "World Cup 2026 Pre-Kickoff Prices and Outcomes",
    org: "Polymarket (Gamma & CLOB APIs)",
    n: "73",
    method:
      "Pre-kickoff implied probabilities, resolved outcomes, volume, and unique trading wallets for 73 matches, group stage through the semifinals. CLOB price history limited to a ~30-day rolling window.",
  },
  {
    dataset: "Uplift Prediction Dataset",
    org: "Criteo AI Lab",
    n: "13,979,592",
    method:
      "Diemert et al. (2018). ~14M users from real randomized ad-incrementality tests, treatment/control split, 12 anonymized features. Two-model uplift approach vs. plain response model, scored by Qini curve.",
  },
  {
    dataset: "TikTok Profile Sample",
    org: "Bright Data",
    n: "1,000",
    method: "Followers 1-812,300. Log-log OLS, HC1 SEs. Sampling method undisclosed.",
  },
  {
    dataset: "Twitter/X Post Sample",
    org: "Bright Data",
    n: "1,000",
    method: "Followers 34-7.1M. Engagement = likes/followers per post.",
  },
  {
    dataset: "Top 1,000 Global Instagram Accounts",
    org: "niteshkuwarbi (GitHub mirror)",
    n: "996",
    method: "Followers 2.8M-469.6M, scraped 2022. Independent of Bright Data.",
  },
  {
    dataset: "Legacy Admissions and Resume Audits",
    org: "NBER · Economics of Education Review · American Sociological Review · ACLU",
    n: "",
    method:
      "Harvard admit rates via Arcidiacono, Kinsler & Ransom (NBER WP 26316), from data unsealed in SFFA v. Harvard. Hurwitz (2011) legacy-admission odds across 30 selective colleges. Rivera (2012) culture-fit interviews and Rivera & Tilcsik (2016) resume audit (316 law firm offices, 14 cities). ACLU legacy-admissions tracking (top-100 universities).",
  },
]

export default function MethodPage() {
  return (
    <div className="max-w-5xl mx-auto px-9 py-16">
      <div className="kicker mb-3">μ · Methodology</div>
      <h1 className="font-serif italic text-5xl mb-6">How I work</h1>
      <p className="text-ink-soft max-w-2xl mb-12">
        Every data point in every story is sourced from one of the datasets below. I analyse publicly available
        data. All raw data is available for download at{" "}
        <a href="https://github.com/andremt/pointofmu/tree/main/analysis" className="text-pink">
          github.com/andremt/pointofmu
        </a>
        .
      </p>
      <h2 className="font-serif italic text-2xl mb-4">Datasets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-rule">
              <th className="py-2 pr-4 font-medium">Dataset</th>
              <th className="py-2 pr-4 font-medium">Organization</th>
              <th className="py-2 pr-4 font-medium">N</th>
              <th className="py-2 font-medium">Method</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.dataset} className="border-b border-rule align-top">
                <td className="py-3 pr-4 font-medium whitespace-nowrap">{r.dataset}</td>
                <td className="py-3 pr-4 text-ink-soft whitespace-nowrap">{r.org}</td>
                <td className="py-3 pr-4 text-ink-soft">{r.n}</td>
                <td className="py-3 text-ink-soft min-w-[280px]">{r.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
