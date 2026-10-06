"""ep5 (shared chart dir): The New Yield Paradigm: Capital's Institutional
Seal of Approval

Mixed sources:
  - LIVE, public, no API key: FRED series PCEPI, PCEPILFE, FEDFUNDS,
    DFII10, via the same unauthenticated fredgraph.csv endpoint used in
    ep4_labour_share/build_charts.py.
  - NOT a simple REST endpoint: the Federal Reserve's Distributional
    Financial Accounts (wealth share by percentile) are served through an
    interactive dataviz tool (federalreserve.gov/releases/z1/dataviz/dfa/),
    not a stable CSV URL -- export the "Distribution of wealth" table from
    that tool manually (choose "Wealth shares" x "Percentile groups") for
    an exact refresh of the 3_wealth_distribution chart.
  - PGIM's 2026 Mid-Year Global Market Outlook is a proprietary research
    note, not a public dataset -- its quotes and recommendations in the
    article are cited directly from the report, not independently
    re-derivable.
"""

import sys
from pathlib import Path

import pandas as pd
import requests

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep5_new_yield"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep5_new_yield"
FRED_CSV = "https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}"


def fetch_fred(series_id):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    local = DATA_DIR / f"{series_id}.csv"
    if not local.exists():
        resp = requests.get(FRED_CSV.format(series=series_id), timeout=30)
        resp.raise_for_status()
        local.write_bytes(resp.content)
    df = pd.read_csv(local, parse_dates=["observation_date"])
    df = df.rename(columns={series_id: "value", "observation_date": "date"})
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna()


def chart_pce_inflation():
    pcepi = fetch_fred("PCEPI")
    pcepi["yoy"] = pcepi.value.pct_change(12) * 100
    core = fetch_fred("PCEPILFE")
    core["yoy"] = core.value.pct_change(12) * 100

    fig, ax = new_figure()
    recent = pcepi[pcepi.date >= "2018-01-01"]
    core_recent = core[core.date >= "2018-01-01"]
    ax.plot(recent.date, recent.yoy, color=PINK, lw=2, label="Headline PCE")
    ax.plot(core_recent.date, core_recent.yoy, color=BLUE, lw=2, label="Core PCE")
    ax.axhline(2.0, color=GREY, lw=1, ls="--")
    ax.text(recent.date.iloc[5], 2.1, "Fed 2% target", fontsize=9, color=GREY)
    ax.set_ylabel("year-over-year % change", fontsize=11, color=INK)
    ax.set_title("US PCE Inflation vs Fed 2% Target, 2018-present",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "FRED PCEPI, PCEPILFE.")
    save(fig, OUT_DIR / "1_pce_inflation_REPRODUCED.png")

    latest = recent.iloc[-1]
    print(f"[ep5-nyp] latest headline PCE YoY: {latest.yoy:.1f}% ({latest.date.date()})")
    months_above = (recent[recent.date >= "2021-02-01"].yoy > 2.0).sum()
    print(f"[ep5-nyp] months above 2% target since Feb 2021: {months_above}")


def chart_rates_vs_real_yields():
    fedfunds = fetch_fred("FEDFUNDS")
    dfii10 = fetch_fred("DFII10")  # 10yr TIPS real yield

    fig, ax = new_figure()
    recent_ff = fedfunds[fedfunds.date >= "2018-01-01"]
    recent_ty = dfii10[dfii10.date >= "2018-01-01"]
    ax.plot(recent_ff.date, recent_ff.value, color=PINK, lw=2, label="Fed Funds Rate")
    ax.plot(recent_ty.date, recent_ty.value, color=BLUE, lw=2, label="10yr TIPS real yield")
    ax.set_ylabel("%", fontsize=11, color=INK)
    ax.set_title("Fed Funds Rate vs 10yr Real Yield, 2018-present",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "FRED FEDFUNDS, DFII10.")
    save(fig, OUT_DIR / "2_rates_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_pce_inflation()
    chart_rates_vs_real_yields()
    print("[ep5-nyp] 3_wealth_distribution needs a manual export from the Fed's "
          "Distributional Financial Accounts dataviz tool (see module docstring); "
          "4_china_consumption (TIP ETF vs S&P 500) needs a market-data source "
          "(e.g. yfinance) for TIP and SPY, not included here to avoid an extra "
          "paid/rate-limited dependency.")
