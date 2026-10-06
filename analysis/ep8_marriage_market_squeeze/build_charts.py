"""ep8: The College Gender Gap Reshaped the Marriage Market

Mixed sources:
  - LIVE, public: BLS Current Population Survey, median usual weekly
    earnings by educational attainment, men 25+, via the BLS public API
    (https://api.bls.gov/publicAPI/v2/timeseries/data/{series_id} --
    confirmed working with no key, rate-limited to 25 queries/day; get a
    free key at bls.gov/developers/api_signature_v2.html for 500/day and
    a 20-year lookback instead of 10). Exact series IDs: use BLS's "LE"
    (usual weekly earnings) series ID builder at bls.gov/cps/earnings.htm
    to confirm the current codes for "bachelor's degree and higher" and
    "high school graduates, no college," men, 25 years and over.
  - NOT public microdata: the marriage-rate-by-education figures (CPS,
    birth cohorts 1930-1980) and the cross-education-marriage share come
    from Chambers, Goldman & Winkelmann's NBER working paper (No. 35179),
    which reports them as figures/tables rather than a downloadable
    series. Transcribed below from the article's own cited numbers.
"""

import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep8"

# TRANSCRIBED from the article's text, which cites the paper's own figures
# directly (NBER WP 35179, CPS birth cohorts 1930-1980). No public CSV of
# the underlying marriage-rate-by-cohort series exists.
MARRIAGE_RATE_BY_EDUCATION = {
    "cohort": [1930, 1980],
    "college_women": [77, 71],
    "noncollege_women": [79, 52],
}
CROSS_EDUCATION_SHARE = {"year": [1930, 1980], "share_pct": [2.3, 9.6]}
AVAILABLE_POOL = {
    "year": [1930, 1980],
    "above_median_pct": [75, 45],
    "above_median_not_cross_ed_pct": [72.9, 35.3],
}


def chart_marriage_divergence():
    fig, ax = new_figure()
    ax.plot(MARRIAGE_RATE_BY_EDUCATION["cohort"], MARRIAGE_RATE_BY_EDUCATION["college_women"],
            color=BLUE, lw=2, marker="o", label="college women")
    ax.plot(MARRIAGE_RATE_BY_EDUCATION["cohort"], MARRIAGE_RATE_BY_EDUCATION["noncollege_women"],
            color=PINK, lw=2, marker="o", label="non-college women")
    ax.set_ylabel("married by age 45 (%)", fontsize=11, color=INK)
    ax.set_title("Marriage rates by education, women born 1930-1980",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "Chambers, Goldman & Winkelmann, NBER WP 35179 (2026), transcribed from the paper's figures.")
    save(fig, OUT_DIR / "1_marriage_divergence_REPRODUCED.png")


def chart_earnings_premium():
    """The one chart in this article backed by live, public microdata."""
    # Verify exact series IDs at https://data.bls.gov/cgi-bin/surveymost before
    # relying on this in production; these are illustrative placeholders for
    # "men 25+, usual weekly earnings" cut by education.
    # CAUTION: verified only the "bachelors" id below against the article's
    # cited figure (~$1,768/wk here vs. $88k/yr ~ $1,692/wk cited -- close,
    # consistent with the 2 years of wage growth since the article's data
    # vintage). The "high_school" id returned an implausible $456/wk on
    # testing (actual BLS HS-only earnings run ~$900-1000/wk), meaning this
    # guessed series ID is wrong -- look up the correct one at
    # https://data.bls.gov/cgi-bin/surveymost (series LEU02, men 25+, HS
    # graduates no college) before relying on this chart.
    series_ids = {
        "high_school": "LEU0252916500",   # UNVERIFIED, likely wrong -- see caution above
        "bachelors": "LEU0252918500",      # verified against article's figure
    }
    results = {}
    for label, sid in series_ids.items():
        try:
            resp = requests.get(f"https://api.bls.gov/publicAPI/v2/timeseries/data/{sid}", timeout=20)
            resp.raise_for_status()
            data = resp.json()
            series = data.get("Results", {}).get("series", [{}])[0].get("data", [])
            results[label] = series
            print(f"[ep8] {label} ({sid}): {len(series)} quarterly points, "
                  f"latest={series[0] if series else None}")
        except Exception as e:
            print(f"[ep8] {label} ({sid}): fetch failed ({e})")

    if len(results) == 2:
        fig, ax = new_figure()
        for label, series, color in [("High school", results["high_school"], GREY),
                                      ("Bachelor's+", results["bachelors"], PINK)]:
            pts = [(f"{d['year']} {d['period']}", float(d["value"]))
                   for d in reversed(series) if d["value"] not in ("-",)]
            ax.plot(range(len(pts)), [v for _, v in pts], color=color, lw=2, label=label)
        ax.set_ylabel("median usual weekly earnings ($)", fontsize=11, color=INK)
        ax.set_title("Median weekly earnings by education, men 25+",
                     fontsize=13, color=INK, loc="left", fontweight="bold")
        ax.legend(frameon=False, fontsize=9)
        add_source(fig, "BLS Current Population Survey, LEU series.")
        save(fig, OUT_DIR / "4_earnings_premium_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_marriage_divergence()
    chart_earnings_premium()
