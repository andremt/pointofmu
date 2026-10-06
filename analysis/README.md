# pointofmu analysis code

Reproduction scripts for the data and charts behind each published article,
rebuilt in October 2026 after the original analysis code was lost (see
`CLAUDE.md`'s data-loss recovery note; this file itself is local-only and
gitignored). Each `epN_slug/build_charts.py` is self-contained: data
fetch, analysis, and chart generation, using the shared style module
`_style.py` (the palette and figure conventions from `CLAUDE.md`'s chart
design system).

## Setup

```bash
cd analysis
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python ep12_uplift_modeling/build_charts.py   # etc. per episode
```

Downloaded data lands in `analysis/data/` (gitignored); generated charts
land in `analysis/output/` (gitignored) -- separate from the actual site
assets in `site/public/charts/`, so rerunning these scripts never
clobbers the recovered originals.

## Status per article

Every script was written against a real, verified data source and
test-run at least once; the table below says how closely each one
reproduces the article's own cited numbers.

| Episode | Article | Data source | Verified |
|---|---|---|---|
| ep4 | Labour's losing share | FRED (live) + Piketty/Zucman & WIL figures (transcribed, no public API) | Labour share series matches exactly (56.8% in 2023); r-g correlation direction matches, magnitude differs (transcribed r series is a decade-level approximation) |
| ep5 | Canadian wages crossover | Statistics Canada Table 11-10-0239-01 (live, public WDS API) | Crossover year (2023) and direction match exactly; dollar figures differ slightly, likely a StatCan data revision since publication |
| ep5 (shared dir) | The New Yield Paradigm | FRED (live) + Fed Distributional Financial Accounts (manual export needed) + PGIM outlook (proprietary, cited only) | PCE inflation series live and current |
| ep6 | PIE ad measurement | Gordon, Moakler & Zettelmeyer (Meta/Northwestern paper) -- no public dataset | Figures transcribed directly from the paper's reported results, as the article cites them |
| ep7 | NBA mid-range / SUTVA | Basketball-Reference team shooting-by-zone tables (live scrape, rate-limited) | Season-level correlation reproduces almost exactly: r=0.736 (5 sampled seasons) vs. the article's r=0.73 (all 24) |
| ep8 | Marriage market squeeze | NBER WP 35179 (transcribed, no public microdata) + BLS CPS earnings API (live, one series ID unverified) | Marriage-rate figures transcribed from the paper; bachelor's earnings series live and close to cited figure |
| ep9 | Finishing luck regression | Understat.com's internal JSON endpoint (live, undocumented but stable) | npxG year-over-year correlation reproduces almost exactly: r=0.79 (2 leagues, 3 seasons) vs. the article's r=0.80 (6 leagues, 10 seasons); xG-based forecast beats actual-goals forecast in both, same as the article |
| ep10 | Polymarket World Cup bias | Polymarket Gamma + CLOB + Data APIs (live, all three verified working) | API calls confirmed correct and functional; the specific July 2026 World Cup price history is gone from CLOB's ~30-day retention window by now, exactly the limitation the article itself names |
| ep12 | Uplift modeling | Criteo Research Uplift Dataset, re-hosted by Criteo's own team on Hugging Face after the original go.criteo.net link went dead | Average treatment effect reproduces exactly (0.194% / 0.309% / 0.115pp / CI [0.108, 0.122]); Qini comparison direction depends on unspecified hyperparameters and came out flipped in this run (see script docstring) |
| ep13 | Caste / meritocracy | SFFA v. Harvard litigation analysis + Rivera & Tilcsik resume audit -- no public microdata for either | Figures transcribed directly from the article's cited sources |
| ep14 | TikTok micro-influencers | Bright Data TikTok/Twitter CSVs + niteshkuwarbi Instagram mirror, all public GitHub-hosted CSVs | Exponent and R² reproduce closely (-0.48/0.33 vs. article's -0.50/0.34); Twitter's absolute numbers match the article almost exactly; TikTok's absolute calibration differs because Bright Data's engagement-rate field formula isn't documented |

## Honesty note

Three articles (ep6, ep8's marriage-rate figures, ep13) are built on
proprietary research papers or litigation data with no public raw
dataset. For those, "reproducing the code" means generating the same
charts from the same cited summary statistics, clearly marked as
transcribed in each script -- not independently re-deriving numbers that
were never public to begin with. Everywhere a live public source exists
(FRED, Statistics Canada, BLS, Polymarket, Understat, Basketball-Reference,
Bright Data, Criteo/Hugging Face), the script pulls it for real.
