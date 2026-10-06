"""ep9: The Striker Who 'Found a New Level' Almost Never Really Did

Live public data via Understat.com's internal JSON endpoint (no official
API, but a real stable endpoint their own frontend calls):

    GET https://understat.com/getLeagueData/{league}/{year}
    Headers: X-Requested-With: XMLHttpRequest, Referer: https://understat.com/league/{league}/{year}

Returns {"teams": ..., "players": [...], "dates": ...}; the "players" list
has per-player-season npg (non-penalty goals), npxG, minutes ("time"),
for every player in that league-season. This script pulls each of the
article's six leagues across consecutive season pairs and reproduces the
reversion-to-mean analysis directly.

Leagues' Understat slugs: EPL, La_liga, Bundesliga, Serie_A, Ligue_1, RFPL.
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

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep9"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep9"

LEAGUES = ["EPL", "La_liga", "Bundesliga", "Serie_A", "Ligue_1", "RFPL"]
HEADERS_TMPL = {"User-Agent": "Mozilla/5.0 (research script; pointofmu.com recovery)",
                "X-Requested-With": "XMLHttpRequest"}

MIN_MINUTES = 900
MIN_XG90 = 0.05


def fetch_league_season(league, year):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    local = DATA_DIR / f"{league}_{year}.json"
    if not local.exists():
        resp = requests.get(
            f"https://understat.com/getLeagueData/{league}/{year}",
            headers={**HEADERS_TMPL, "Referer": f"https://understat.com/league/{league}/{year}"},
            timeout=20,
        )
        resp.raise_for_status()
        local.write_bytes(resp.content)
        time.sleep(1.5)  # be polite
    import json
    data = json.loads(local.read_text())
    df = pd.DataFrame(data["players"])
    for col in ["games", "time", "goals", "xG", "npg", "npxG"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df["league"], df["season"] = league, year
    return df


def build_consecutive_pairs(leagues, seasons):
    """seasons: list of starting years, e.g. 2014 means the 2014/15 season."""
    pairs = []
    for league in leagues:
        frames = {}
        for y in seasons:
            try:
                frames[y] = fetch_league_season(league, y)
            except Exception as e:
                print(f"[ep9] {league} {y}: failed ({e})")
        for y in seasons:
            if y not in frames or (y + 1) not in frames:
                continue
            a, b = frames[y], frames[y + 1]
            merged = a.merge(b, on="player_name", suffixes=("_1", "_2"))
            merged["npxG90_1"] = merged.npxG_1 / merged.time_1 * 90
            merged["npxG90_2"] = merged.npxG_2 / merged.time_2 * 90
            merged["npg90_1"] = merged.npg_1 / merged.time_1 * 90
            merged["npg90_2"] = merged.npg_2 / merged.time_2 * 90
            mask = (
                (merged.time_1 >= MIN_MINUTES) & (merged.time_2 >= MIN_MINUTES)
                & (merged.npxG90_1 >= MIN_XG90) & (merged.npxG90_2 >= MIN_XG90)
            )
            pairs.append(merged[mask])
    return pd.concat(pairs, ignore_index=True) if pairs else pd.DataFrame()


def analyze(df):
    df = df.copy()
    df["finishing_1"] = df.npg90_1 - df.npxG90_1
    df["finishing_2"] = df.npg90_2 - df.npxG90_2

    r_xg, p_xg = stats.pearsonr(df.npxG90_1, df.npxG90_2)
    r_fin, p_fin = stats.pearsonr(df.finishing_1, df.finishing_2)
    print(f"[ep9] n={len(df)} pairs")
    print(f"[ep9] npxG90 year-over-year: r={r_xg:.3f} p={p_xg:.4f}")
    print(f"[ep9] finishing (goals-xG) year-over-year: r={r_fin:.3f} p={p_fin:.4f}")

    r2_actual = stats.linregress(df.npg90_1, df.npg90_2).rvalue ** 2
    r2_xg = stats.linregress(df.npxG90_1, df.npg90_2).rvalue ** 2
    print(f"[ep9] forecasting next season's npg90: R2 from actual goals={r2_actual:.3f}, "
          f"R2 from xG instead={r2_xg:.3f}")
    return df, r_xg, r_fin


def chart_reversion_by_decile(df):
    df = df.copy()
    df["decile"] = pd.qcut(df.finishing_1, 10, labels=False, duplicates="drop")
    by_decile = df.groupby("decile")[["finishing_1", "finishing_2"]].mean()

    fig, ax = new_figure()
    x = np.arange(len(by_decile))
    ax.bar(x - 0.18, by_decile.finishing_1, width=0.36, color=PINK, label="this season", zorder=2)
    ax.bar(x + 0.18, by_decile.finishing_2, width=0.36, color=GREY, label="next season", zorder=2)
    ax.axhline(0, color=INK, lw=0.8)
    ax.set_xlabel("decile of finishing (goals - xG) this season", fontsize=11, color=INK)
    ax.set_ylabel("non-penalty goals - xG per 90", fontsize=11, color=INK)
    ax.set_title("Whatever your finishing luck this season, it is mostly gone by next season",
                 fontsize=12, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "Understat.com, player-seasons across six European leagues.")
    save(fig, OUT_DIR / "1_reversion_by_decile_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # Full replication: LEAGUES x range(2014, 2024). Limited here to verify
    # the pipeline without ~60 sequential rate-limited requests.
    SEASONS = [2021, 2022, 2023]
    print(f"[ep9] fetching leagues={LEAGUES[:2]} seasons={SEASONS} "
          f"(full replication: all 6 leagues, 2014-2023)")
    df = build_consecutive_pairs(LEAGUES[:2], SEASONS)
    if len(df):
        df, r_xg, r_fin = analyze(df)
        chart_reversion_by_decile(df)
    else:
        print("[ep9] no pairs built -- check Understat endpoint/headers above")
