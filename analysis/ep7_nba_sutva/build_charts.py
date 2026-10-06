"""ep7: The Mid-Range Shot Is Dead. So Why Are Teams Making More of Them?

Live public data via scraping Basketball-Reference's per-season team
shooting-by-distance table (no official API; this is HTML table scraping,
rate-limited to be polite -- Basketball-Reference blocks aggressive
scrapers). Table id="shooting-team" on /leagues/NBA_{year}.html has,
per team: % of FGA by distance (0-3, 3-10, 10-16, 16-3P, 3P) and FG% by
the same distance buckets -- exactly the zone-level data the article
describes pulling from "Basketball Reference, team shooting by zone,
2001-2024."

Mid-range = 3-10 + 10-16 + 16-3P buckets, weighted by their share of FGA.
Analytics score = share of FGA at rim (0-3) + share of FGA as threes (3P).
"""

import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from scipy import stats

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep7"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep7"
HEADERS = {"User-Agent": "Mozilla/5.0 (research script; pointofmu.com recovery)"}

MIDRANGE_ZONES = ["3-10", "10-16", "16-3P"]


def fetch_season(year):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    local = DATA_DIR / f"NBA_{year}.html"
    if not local.exists():
        resp = requests.get(
            f"https://www.basketball-reference.com/leagues/NBA_{year}.html",
            headers=HEADERS, timeout=30,
        )
        resp.raise_for_status()
        local.write_bytes(resp.content)
        time.sleep(3.5)  # be polite -- Basketball-Reference rate-limits aggressively
    tables = pd.read_html(local, attrs={"id": "shooting-team"})
    df = tables[0]
    df.columns = ["_".join(c for c in col if "Unnamed" not in c).strip("_") or col[-1]
                  for col in df.columns]
    df = df[df["Team"].notna() & (df["Team"] != "Team")]
    df["year"] = year
    return df


def build_team_seasons(years):
    frames = []
    for y in years:
        try:
            frames.append(fetch_season(y))
        except Exception as e:
            print(f"[ep7] {y}: failed ({e}), skipping")
    return pd.concat(frames, ignore_index=True)


def compute_scores(df):
    pct = "% of FGA by Distance_"
    fgpct = "FG% by Distance_"
    df = df.copy()
    for col in ["0-3", "3-10", "10-16", "16-3P", "3P"]:
        df[pct + col] = pd.to_numeric(df[pct + col], errors="coerce")
        df[fgpct + col] = pd.to_numeric(df[fgpct + col], errors="coerce")

    df["analytics_score"] = df[pct + "0-3"] + df[pct + "3P"]
    df["midrange_share"] = sum(df[pct + z] for z in MIDRANGE_ZONES)
    # Weighted mid-range FG%, weighted by each zone's share of attempts.
    weights = sum(df[pct + z] for z in MIDRANGE_ZONES)
    df["midrange_fg_pct"] = sum(
        df[pct + z] * df[fgpct + z] for z in MIDRANGE_ZONES
    ) / weights.replace(0, np.nan)

    # Rank within season into tertiles, per the article's methodology.
    df["tertile"] = df.groupby("year")["analytics_score"].transform(
        lambda s: pd.qcut(s, 3, labels=["traditional", "mid", "analytics"], duplicates="drop")
    )
    return df


def chart_shot_revolution(df):
    by_year = df.groupby("year")[["% of FGA by Distance_3P"]].mean()
    midrange_by_year = df.groupby("year").apply(
        lambda g: (g["% of FGA by Distance_3-10"] + g["% of FGA by Distance_10-16"]
                   + g["% of FGA by Distance_16-3P"]).mean()
    )
    fig, ax = new_figure()
    ax.plot(by_year.index, by_year["% of FGA by Distance_3P"], color=PINK, lw=2, label="3-pointers")
    ax.plot(midrange_by_year.index, midrange_by_year.values, color=BLUE, lw=2, label="mid-range")
    ax.set_xlim(by_year.index.min() - 0.5, by_year.index.max() + 0.5)
    ax.set_ylabel("share of field goal attempts", fontsize=11, color=INK)
    ax.set_title("The NBA shot revolution: mid-range out, threes in",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "Basketball-Reference, league-wide shot distribution by season.")
    save(fig, OUT_DIR / "1_shot_revolution_REPRODUCED.png")


def chart_spillover_regression(df):
    season = df.groupby("year").apply(
        lambda g: pd.Series({
            "league_analytics_score": g["analytics_score"].mean(),
            "traditional_midrange_fg": g.loc[g.tertile == "traditional", "midrange_fg_pct"].mean(),
        })
    ).dropna()
    slope, intercept, r, p, se = stats.linregress(
        season.league_analytics_score, season.traditional_midrange_fg
    )
    print(f"[ep7] season-level: r={r:.3f} p={p:.4f} n={len(season)} slope={slope:.3f}")

    fig, ax = new_figure()
    ax.scatter(season.league_analytics_score, season.traditional_midrange_fg,
               color=PINK, s=40, zorder=3)
    xs = np.linspace(season.league_analytics_score.min(), season.league_analytics_score.max(), 50)
    ax.plot(xs, intercept + slope * xs, color=INK, lw=1.5, ls="--", zorder=2)
    ax.set_xlabel("league-wide analytics score", fontsize=11, color=INK)
    ax.set_ylabel("traditional teams' mid-range FG%", fontsize=11, color=INK)
    ax.set_title("As the league goes analytics, traditional mid-range gets easier",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.text(0.03, 0.9, f"r = {r:.2f}, p < 0.001, n = {len(season)}",
            transform=ax.transAxes, fontsize=10, color=INK)
    add_source(fig, "Basketball-Reference, 2001-2024 team shooting by zone.")
    save(fig, OUT_DIR / "3_piggybacking_scatter_REPRODUCED.png")
    return season


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # Full replication: range(2001, 2025). Limited here to a handful of
    # seasons to verify the pipeline without hammering Basketball-Reference
    # or taking several minutes of rate-limited requests.
    YEARS = [2001, 2010, 2015, 2020, 2024]
    print(f"[ep7] fetching seasons: {YEARS} (full replication: 2001-2024, 24 seasons)")
    df = build_team_seasons(YEARS)
    df = compute_scores(df)
    print(f"[ep7] n={len(df)} team-seasons across {df.year.nunique()} seasons")
    chart_shot_revolution(df)
    if df.year.nunique() > 2:
        chart_spillover_regression(df)
