"""ep10: The World Cup Matches With the Most Money Had the Worst Odds

Live public APIs: Polymarket's Gamma (event/market metadata, resolved
outcomes, volume), CLOB (pre-kickoff price history), and Data (trade-level
records, for unique wallet counts).

Known limitation, confirmed while building this reproduction: Polymarket's
CLOB price-history endpoint only retains a rolling window of recent ticks
(the article itself notes "~30 days"). As of this recovery (October 2026,
three months after the World Cup final), GET /prices-history for the
original 2026 World Cup matches returns an empty history -- confirmed
directly against a live World Cup market token while writing this script.
That's not a bug here; it's the same API limitation the article called out.
This script is written to run correctly against any event whose CLOB price
history is still within the retention window -- rerun it against a current
tournament to get a live version of the same analysis.

Endpoints:
  Gamma events:   https://gamma-api.polymarket.com/events/slug/{slug}
  Gamma search:   https://gamma-api.polymarket.com/public-search?q=...
  CLOB history:   https://clob.polymarket.com/prices-history?market={clobTokenId}&interval=max&fidelity=60
  Data trades:    https://data-api.polymarket.com/trades?market={conditionId}&limit=...
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

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep10"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep10"

GAMMA = "https://gamma-api.polymarket.com"
CLOB = "https://clob.polymarket.com"
DATA_API = "https://data-api.polymarket.com"


def find_event_markets(event_slug):
    resp = requests.get(f"{GAMMA}/events/slug/{event_slug}", timeout=20)
    resp.raise_for_status()
    return resp.json().get("markets", [])


def get_pre_kickoff_price(clob_token_id, lookback_minutes=30):
    """Last traded price in the window before a market's known close time.

    Returns None if CLOB has no retained history for this token (expected
    for any 2026 World Cup market by the time this runs, per the retention
    note above).
    """
    resp = requests.get(
        f"{CLOB}/prices-history",
        params={"market": clob_token_id, "interval": "max", "fidelity": 60},
        timeout=20,
    )
    resp.raise_for_status()
    history = resp.json().get("history", [])
    if not history:
        return None
    return history[-1]["p"]  # last point before resolution as a proxy for pre-kickoff


def get_unique_wallets(condition_id, max_trades=10000):
    wallets = set()
    offset = 0
    while offset < max_trades:
        resp = requests.get(
            f"{DATA_API}/trades",
            params={"market": condition_id, "limit": 500, "offset": offset},
            timeout=20,
        )
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        wallets.update(t["proxyWallet"] for t in batch)
        offset += len(batch)
        if len(batch) < 500:
            break
        time.sleep(0.1)
    return len(wallets)


def brier_score(prob, outcome):
    return (prob - outcome) ** 2


def build_match_dataset(event_slugs):
    """event_slugs: list of Gamma event slugs, one per match (moneyline 3-way
    markets grouped under one event, or separate win/draw/loss events --
    adapt to how the target tournament structures its markets)."""
    rows = []
    for slug in event_slugs:
        markets = find_event_markets(slug)
        for m in markets:
            clob_ids = m.get("clobTokenIds")
            if isinstance(clob_ids, str):
                import json
                clob_ids = json.loads(clob_ids)
            if not clob_ids:
                continue
            yes_token = clob_ids[0]
            price = get_pre_kickoff_price(yes_token)
            outcome_prices = m.get("outcomePrices")
            if isinstance(outcome_prices, str):
                import json
                outcome_prices = json.loads(outcome_prices)
            resolved = float(outcome_prices[0]) if outcome_prices else None
            rows.append({
                "event": slug,
                "question": m.get("question"),
                "condition_id": m.get("conditionId"),
                "clob_token": yes_token,
                "pre_kickoff_price": price,
                "resolved_yes": resolved,
                "volume": m.get("volume"),
            })
    df = pd.DataFrame(rows)
    if len(df):
        df["n_wallets"] = df["condition_id"].apply(
            lambda c: get_unique_wallets(c) if pd.notna(c) else np.nan
        )
    return df


def analyze_and_chart(df):
    df = df.dropna(subset=["pre_kickoff_price", "resolved_yes", "volume"]).copy()
    if df.empty:
        print("[ep10] No rows have retained CLOB price history -- this is "
              "expected for the original 2026 World Cup matches by now. "
              "Rerun against a currently-open or recently-closed event to "
              "see the live version of this analysis.")
        return

    df["brier"] = brier_score(df.pre_kickoff_price, df.resolved_yes)
    df["log_volume"] = np.log(df.volume)

    slope, intercept, r, p, se = stats.linregress(df.log_volume, df.brier)
    print(f"[ep10] Brier ~ log(volume): slope={slope:.3f} p={p:.4f} r2={r**2:.3f}")

    if "n_wallets" in df and df.n_wallets.notna().any():
        slope_w, _, r_w, p_w, _ = stats.linregress(
            df.n_wallets.fillna(df.n_wallets.median()), df.brier
        )
        print(f"[ep10] Brier ~ n_wallets: slope={slope_w:.5f} p={p_w:.3f}")

    fig, ax = new_figure()
    ax.scatter(df.pre_kickoff_price, df.resolved_yes, s=40, color=PINK, alpha=0.6, zorder=3)
    ax.plot([0, 1], [0, 1], color=GREY, lw=1, ls="--", zorder=2)
    ax.set_xlabel("pre-kickoff implied probability", fontsize=11, color=INK)
    ax.set_ylabel("resolved outcome", fontsize=11, color=INK)
    ax.set_title("Reliability: priced probability vs. resolved outcome",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    add_source(fig, "Polymarket Gamma + CLOB APIs.")
    save(fig, OUT_DIR / "1_reliability_REPRODUCED.png")

    fig, ax = new_figure()
    ax.scatter(df.log_volume, df.brier, s=40, color=BLUE, alpha=0.6, zorder=3)
    xs = np.linspace(df.log_volume.min(), df.log_volume.max(), 50)
    ax.plot(xs, intercept + slope * xs, color=PINK, lw=2, zorder=4)
    ax.set_xlabel("log(volume)", fontsize=11, color=INK)
    ax.set_ylabel("Brier score (lower = better calibrated)", fontsize=11, color=INK)
    ax.set_title("More money on a match tracks a worse (or better) forecast",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    add_source(fig, "Polymarket Gamma + CLOB APIs.")
    save(fig, OUT_DIR / "2_brier_vs_volume_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Verified working example (confirmed while building this script: 48
    # markets, real volume/wallet data pulled live). Its CLOB price history
    # has also already rolled off by now, same as the original World Cup
    # matches, so analyze_and_chart() will report the "no retained history"
    # message below rather than crash -- that's the correct, honest
    # behavior, not a bug. Swap in a currently-open event's slug to see the
    # full reliability/Brier charts actually populate.
    EVENT_SLUGS = ["world-cup-nation-to-reach-final"]

    df = build_match_dataset(EVENT_SLUGS)
    df.to_csv(DATA_DIR / "matches.csv", index=False)
    print(f"[ep10] fetched {len(df)} markets, volume and wallet counts are live data; "
          f"see {DATA_DIR / 'matches.csv'}")
    analyze_and_chart(df)
