export interface Source {
  id: string;
  title: string;
  org: string;
  n: number | null;
  method: string;
  url: string;
  flavor: 'collected by us' | 'public data';
}

export const POM_SOURCES: Record<string, Source> = {
  canadianWages: {
    id: 'statcan-income-2026',
    title: 'Total Income by Age Group, Canada',
    org: 'Statistics Canada',
    n: null,
    method: 'Table 11-10-0239-01, average and median total income by age group and gender, 2024 constant dollars, 2015-2024.',
    url: 'https://www150.statcan.gc.ca/',
    flavor: 'public data',
  },
  labourShare: {
    id: 'labour-share-2026',
    title: 'r-g Series and US Labour Share, 1950-2024',
    org: 'FRED · Piketty & Zucman (2014) · World Inequality Lab',
    n: 74,
    method: 'Real GDP growth (FRED, 5-year centred moving average) against net return on capital calibrated from Piketty-Zucman and the WIL 2025 update, 2-year lag. Correlated against BLS labour-share series.',
    url: 'https://fred.stlouisfed.org/',
    flavor: 'public data',
  },
  marriageMarket: {
    id: 'nber-marriage-market-2026',
    title: 'Bachelors Without Bachelor\'s (NBER WP 35179)',
    org: 'Chambers, Goldman & Winkelmann, NBER',
    n: null,
    method: 'Marriage rates by birth cohort (1930-1980) from the paper\'s own figures, CPS-derived. Cross-checked against BLS CPS Table A-4 earnings by education.',
    url: 'https://www.nber.org/',
    flavor: 'public data',
  },
  nbaSutva: {
    id: 'bbref-shot-zones-2026',
    title: 'Team Shooting by Zone, 2001-2024',
    org: 'Basketball-Reference',
    n: 716,
    method: '716 team-seasons, shot distribution and FG% by zone. Teams ranked into within-season tertiles by analytics score. Season-level (N=24) and team-season regressions, clustered SEs by season.',
    url: 'https://www.basketball-reference.com/',
    flavor: 'public data',
  },
  newYieldParadigm: {
    id: 'fred-dfa-pgim-2026',
    title: 'PCE Inflation, Fed Funds, and Distributional Accounts',
    org: 'FRED · Federal Reserve Distributional Financial Accounts · PGIM',
    n: 52,
    method: 'PCEPI, PCEPILFE, FEDFUNDS, DFII10 from FRED; wealth distribution from the Fed\'s Distributional Financial Accounts, Q4 2024; claims checked against PGIM\'s 2026 Mid-Year Global Market Outlook.',
    url: 'https://fred.stlouisfed.org/',
    flavor: 'public data',
  },
  pieAdMeasurement: {
    id: 'pie-meta-2026',
    title: 'Predicted Incrementality by Experimentation (PIE)',
    org: 'Meta Research & Northwestern University',
    n: 2226,
    method: 'Gordon, Moakler & Zettelmeyer, March 2026. Last-click vs. PIE prediction accuracy against RCT ground truth across 2,226 real Meta ad experiments.',
    url: 'https://research.facebook.com/',
    flavor: 'public data',
  },
  finishingLuck: {
    id: 'understat-xg-2026',
    title: 'Player-Season xG and Non-Penalty Goals',
    org: 'Understat',
    n: 5498,
    method: '5,498 consecutive player-season pairs, six European leagues, 2014/15-2023/24. Min. 900 minutes and 0.05 xG/90 in both seasons of each pair.',
    url: 'https://understat.com/',
    flavor: 'public data',
  },
  polymarketWorldCup: {
    id: 'polymarket-wc-2026',
    title: 'World Cup 2026 Pre-Kickoff Prices and Outcomes',
    org: 'Polymarket (Gamma & CLOB APIs)',
    n: 73,
    method: 'Pre-kickoff implied probabilities, resolved outcomes, volume, and unique trading wallets for 73 matches, group stage through the semifinals. CLOB price history limited to a ~30-day rolling window.',
    url: 'https://polymarket.com/',
    flavor: 'public data',
  },
  criteoUplift: {
    id: 'criteo-uplift-2026',
    title: 'Uplift Prediction Dataset',
    org: 'Criteo AI Lab',
    n: 13979592,
    method: 'Diemert et al. (2018). ~14M users from real randomized ad-incrementality tests, treatment/control split, 12 anonymized features. Two-model uplift approach vs. plain response model, scored by Qini curve.',
    url: 'https://ailab.criteo.com/criteo-uplift-prediction-dataset/',
    flavor: 'public data',
  },
  tiktokEngagement: {
    id: 'brightdata-tiktok-2026',
    title: 'TikTok Profile Sample',
    org: 'Bright Data',
    n: 1000,
    method: 'Followers 1-812,300. Log-log OLS, HC1 SEs. Sampling method undisclosed.',
    url: 'https://github.com/luminati-io/Free-datasets',
    flavor: 'public data',
  },
  twitterEngagement: {
    id: 'brightdata-twitter-2026',
    title: 'Twitter/X Post Sample',
    org: 'Bright Data',
    n: 1000,
    method: 'Followers 34-7.1M. Engagement = likes/followers per post.',
    url: 'https://github.com/luminati-io/Free-datasets',
    flavor: 'public data',
  },
  instagramEngagement: {
    id: 'instagram-top1000-2022',
    title: 'Top 1,000 Global Instagram Accounts',
    org: 'niteshkuwarbi (GitHub mirror)',
    n: 996,
    method: 'Followers 2.8M-469.6M, scraped 2022. Independent of Bright Data.',
    url: 'https://github.com/niteshkuwarbi/instagram-data-analysis',
    flavor: 'public data',
  },
  untouchableCaste: {
    id: 'untouchable-caste-2026',
    title: 'Legacy Admissions and Resume Audits',
    org: 'NBER · Economics of Education Review · American Sociological Review · ACLU',
    n: null,
    method: 'Harvard admit rates via Arcidiacono, Kinsler & Ransom (NBER WP 26316), from data unsealed in SFFA v. Harvard. Hurwitz (2011) legacy-admission odds across 30 selective colleges. Rivera (2012) culture-fit interviews and Rivera & Tilcsik (2016) resume audit (316 law firm offices, 14 cities). ACLU legacy-admissions tracking (top-100 universities).',
    url: 'https://www.nber.org/system/files/working_papers/w26316/w26316.pdf',
    flavor: 'public data',
  },
};
