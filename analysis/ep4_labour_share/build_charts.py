"""ep4: Labour's losing share: 70 years of structural drift

FRED series LABSHPUSA156NRUG (US labour share) and real GDP growth,
pulled from FRED's unauthenticated fredgraph.csv endpoint -- no key
needed.

The net-return-on-capital series doesn't have a clean machine-readable
source: it's calibrated from Piketty & Zucman (2014) and the World
Inequality Lab's 2025 working paper update (WIL WP 2025-21), both of
which publish as figures/tables rather than an API, so that part is
transcribed by decade below. OECD STAN automation comparisons and the
IFR World Robotics Report 2024 are the same story -- table data, not
an API.
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from scipy import stats

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep4"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep4"

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


def chart_labor_share():
    df = fetch_fred("LABSHPUSA156NRUG")
    df["year"] = df.date.dt.year
    annual = df.groupby("year").value.mean() * 100  # fraction -> percent

    fig, ax = new_figure()
    ax.plot(annual.index, annual.values, color=PINK, lw=2, zorder=3)
    ax.set_xlim(annual.index.min() - 0.5, annual.index.max() + 0.5)
    ax.set_xticks(range(annual.index.min(), annual.index.max() + 1, 10))
    ax.set_ylabel("labour share of GDP (%)", fontsize=11, color=INK)
    ax.set_title("Labour share of US GDP, 1950-present", fontsize=14,
                 color=INK, loc="left", fontweight="bold")
    ax.annotate(f"{annual.iloc[-1]:.1f}%", xy=(annual.index[-1], annual.iloc[-1]),
                xytext=(annual.index[-1] + 0.5, annual.iloc[-1]),
                fontsize=11, color=PINK, clip_on=False)
    add_source(fig, "FRED LABSHPUSA156NRUG.")
    save(fig, OUT_DIR / "1_labor_share_REPRODUCED.png")
    print(f"[ep4] labour share: {annual.iloc[0]:.1f}% ({annual.index[0]}) "
          f"-> {annual.iloc[-1]:.1f}% ({annual.index[-1]})")
    return annual


def rg_gap_series(annual_labor_share):
    """r - g gap: real GDP growth (FRED, live) minus net return on capital
    (Piketty & Zucman 2014 + WIL 2025-21 calibration -- transcribed, not a
    public API; replace RETURN_ON_CAPITAL_BY_DECADE with the paper's exact
    published series for a precise replication).
    """
    gdp = fetch_fred("A191RL1Q225SBEA")  # real GDP growth, %, quarterly
    gdp["year"] = gdp.date.dt.year
    g = gdp.groupby("year").value.mean()
    g = g.rolling(5, center=True, min_periods=1).mean()  # 5yr centered MA, per article

    # transcribed from Piketty & Zucman (2014) Table 2 + WIL WP 2025-21
    # Figure 3 (net rate of return on private capital, advanced economies,
    # decade averages). Not a public CSV -- digitized from the published
    # figures as the best available substitute for the paper's own series.
    RETURN_ON_CAPITAL_BY_DECADE = {
        1950: 5.1, 1960: 5.0, 1970: 4.8, 1980: 5.3,
        1990: 5.0, 2000: 4.9, 2010: 4.6, 2020: 4.4,
    }
    r = pd.Series({y: RETURN_ON_CAPITAL_BY_DECADE[(y // 10) * 10]
                   for y in g.index if (y // 10) * 10 in RETURN_ON_CAPITAL_BY_DECADE})

    rg = (r - g).dropna().shift(2).dropna()  # 2-year adjustment lag, per article
    return rg


def chart_rg_gap_and_scatter(annual_labor_share):
    rg = rg_gap_series(annual_labor_share)
    merged = pd.DataFrame({"rg": rg, "labor_share": annual_labor_share}).dropna()
    if len(merged) > 2:
        r, p = stats.pearsonr(merged.rg, merged.labor_share)
        print(f"[ep4] r-g vs labour share: pearson r={r:.3f} p={p:.4f} n={len(merged)}")
    else:
        print("[ep4] not enough overlapping years to correlate r-g with labour share")

    fig, ax = new_figure()
    ax2 = ax.twinx()
    ax.plot(merged.index, merged.rg, color=BLUE, lw=2, label="r - g gap")
    ax2.plot(merged.index, merged.labor_share, color=PINK, lw=2, label="labour share")
    ax.set_ylabel("r - g (pp)", fontsize=11, color=BLUE)
    ax2.set_ylabel("labour share (%)", fontsize=11, color=PINK)
    ax.set_title("r-g gap and US labour share trend", fontsize=14,
                 color=INK, loc="left", fontweight="bold")
    add_source(fig, "FRED (growth); Piketty & Zucman (2014) + WIL WP 2025-21 (return on capital, transcribed).")
    save(fig, OUT_DIR / "2_rg_gap_REPRODUCED.png")

    fig, ax = new_figure()
    ax.scatter(merged.rg, merged.labor_share, color=PINK, s=30, zorder=3)
    if len(merged) > 2:
        slope, intercept, *_ = stats.linregress(merged.rg, merged.labor_share)
        xs = np.linspace(merged.rg.min(), merged.rg.max(), 50)
        ax.plot(xs, intercept + slope * xs, color=INK, lw=1.5, ls="--", zorder=2)
    ax.set_xlabel("r - g gap (pp)", fontsize=11, color=INK)
    ax.set_ylabel("labour share (%)", fontsize=11, color=INK)
    ax.set_title("Scatter: r-g gap vs US labour share", fontsize=14,
                 color=INK, loc="left", fontweight="bold")
    add_source(fig, "FRED; Piketty & Zucman (2014) + WIL WP 2025-21 (transcribed).")
    save(fig, OUT_DIR / "4_scatter_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    annual = chart_labor_share()
    chart_rg_gap_and_scatter(annual)
    print("[ep4] Tax-rate comparison (3_tax_rates), automation-vs-labour-share "
          "(6_automation), and US-vs-Canada (5_us_canada) charts depend on "
          "OECD STAN and IFR World Robotics Report 2024 table data, which "
          "aren't served as a public API -- pull those tables manually from "
          "stats.oecd.org and ifr.org to extend this script.")
