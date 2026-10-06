# Datasets

The actual data behind each article, as pulled by the scripts in
`analysis/epN_*/build_charts.py`. 22MB total across 21 files. See
`analysis/README.md` for which episode used which source and how closely
each reproduction matches the article.

| File | Episode | What it is |
|---|---|---|
| `ep4/labour_share.csv` | ep4 | FRED LABSHPUSA156NRUG, US labour share of GDP, 1950-present |
| `ep4/real_gdp_growth.csv` | ep4 | FRED A191RL1Q225SBEA, real GDP growth |
| `ep5/canadian_income_by_age_raw_long.csv` | ep5 | Statistics Canada Table 11-10-0239-01, filtered to total income, 2015-2024, all age/gender groups |
| `ep5_new_yield/*.csv` | ep5 (new yield paradigm) | FRED: PCE inflation, core PCE, Fed funds rate, 10yr TIPS real yield |
| `ep6/*.csv` | ep6 | Transcribed from Gordon, Moakler & Zettelmeyer (2026) -- no public microdata exists for this paper's 2,226 Meta ad experiments |
| `ep7/nba_team_season_shooting_by_zone.csv` | ep7 | Basketball-Reference, all 740 team-seasons 2001-2024, shot distribution and FG% by distance zone |
| `ep8/*.csv` | ep8 | Marriage-rate figures transcribed from Chambers, Goldman & Winkelmann (NBER WP 35179) -- no public microdata |
| `ep9/understat_player_season_pairs.csv` | ep9 | Understat.com, 4,938 consecutive player-season pairs across 6 European leagues, 2014/15-2023/24 |
| `ep10/world_cup_nation_to_reach_final_markets.csv` | ep10 | Live Polymarket Gamma+Data API pull (demo event -- original World Cup match data is gone from CLOB's retention window, see ep10's script docstring) |
| `ep12/criteo_uplift_sample_50k.csv` | ep12 | 50,000-row random sample of the Criteo Research Uplift Dataset (full dataset is 14M rows / 311MB gzipped -- too large for git; see ep12/README below) |
| `ep12/ate_summary.csv` | ep12 | Average treatment effect computed from the FULL 14M-row dataset (not just the sample) |
| `ep13/*.csv` | ep13 | Transcribed from SFFA v. Harvard litigation analysis and the Rivera & Tilcsik resume-audit study -- no public microdata for either |
| `ep14/*.csv` | ep14 | Bright Data TikTok/Twitter samples and the niteshkuwarbi Instagram mirror, as downloaded in full |

## The one dataset not included here

`ep12`'s full Criteo dataset (13,979,592 rows, 311MB gzipped) is too
large for git -- GitHub hard-blocks any file over 100MB. `ate_summary.csv`
above was computed from the complete file, and `criteo_uplift_sample_50k.csv`
is a random 50k-row sample for inspection. To get the full file:

```
curl -L -o criteo-research-uplift-v2.1.csv.gz \
  https://huggingface.co/datasets/criteo/criteo-uplift/resolve/main/criteo-research-uplift-v2.1.csv.gz
```

(The dataset's original host, go.criteo.net, returns 404 as of this
recovery; the URL above is Criteo's own team re-publishing the identical
file on Hugging Face.)
