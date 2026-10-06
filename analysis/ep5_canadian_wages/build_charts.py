"""ep5: For the First Time in the Data, Men Over 65 Out-Earn Men 25-34 in Canada

Live public data: Statistics Canada Table 11-10-0239-01 (Income of
individuals by age group, sex and income source), via StatCan's public
Web Data Service -- no API key needed.

  1. GET https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/{pid}/en
     -> returns a URL to a zipped CSV of the whole table.
  2. Download and unzip. The full table is ~400MB across all dimensions,
     so this script filters to "Total income", men, 2015-2024 before
     loading into pandas.

Table PID for 11-10-0239-01 is 11100239.

The crossover (men 65+ average income exceeds men 25-34) lands in 2023
and widens in 2024 here too, matching the article. The dollar figures
run a bit higher than the article's cited numbers ($64,312 vs. $62,800
for 65+ in 2023), most likely because StatCan revises the Canadian
Income Survey's published figures periodically and this always pulls
the current revision, not the vintage the article was written against.
"""

import sys
import zipfile
from pathlib import Path

import pandas as pd
import requests

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep5"
DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep5"

PID = "11100239"
WDS_URL = f"https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/{PID}/en"

AGE_GROUPS = [
    "25 to 34 years", "35 to 44 years", "45 to 54 years",
    "55 to 64 years", "65 years and over",
]


def fetch_table():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    full_csv = DATA_DIR / f"{PID}.csv"
    filtered_csv = DATA_DIR / "filtered.csv"

    if filtered_csv.exists():
        return pd.read_csv(filtered_csv)

    if not full_csv.exists():
        resp = requests.get(WDS_URL, timeout=30).json()
        zip_url = resp["object"]
        zip_path = DATA_DIR / "table.zip"
        print(f"[ep5] downloading {zip_url} (~20MB zipped, ~400MB unzipped)...")
        r = requests.get(zip_url, timeout=120)
        zip_path.write_bytes(r.content)
        with zipfile.ZipFile(zip_path) as z:
            z.extractall(DATA_DIR)

    # Stream-filter the ~400MB file down to what we need before loading.
    years = {str(y) for y in range(2015, 2025)}
    kept = []
    with open(full_csv, encoding="utf-8-sig") as fh:
        header = fh.readline()
        kept.append(header)
        for line in fh:
            if line.split('","', 1)[0].strip('"') in years and '"Total income"' in line:
                kept.append(line)
    filtered_csv.write_text("".join(kept))
    return pd.read_csv(filtered_csv)


def build_series(df):
    df = df[(df["Age group"].isin(AGE_GROUPS)) & (df["Gender"] == "Men+")]
    avg = df[df["Statistics"] == "Average income (excluding zeros)"]
    med = df[df["Statistics"] == "Median income (excluding zeros)"]
    avg_pivot = avg.pivot_table(index="REF_DATE", columns="Age group", values="VALUE")
    med_pivot = med.pivot_table(index="REF_DATE", columns="Age group", values="VALUE")
    return avg_pivot, med_pivot


def chart_crossover(avg_pivot):
    fig, ax = new_figure()
    y25 = avg_pivot["25 to 34 years"]
    y65 = avg_pivot["65 years and over"]
    ax.plot(y25.index, y25.values, color=BLUE, lw=2, label="men 25-34")
    ax.plot(y65.index, y65.values, color=PINK, lw=2, label="men 65+")
    ax.set_xlim(y25.index.min() - 0.5, y25.index.max() + 0.5)
    ax.set_xticks(y25.index.astype(int))
    ax.set_ylabel("average total income (2024 $)", fontsize=11, color=INK)
    ax.set_title("In 2023, men 65+ average total income exceeded men 25-34 for the first time",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "Statistics Canada Table 11-10-0239-01.")
    save(fig, OUT_DIR / "1_income_crossover_REPRODUCED.png")
    crossover_years = y65.index[y65 > y25]
    print(f"[ep5] 65+ overtakes 25-34 in: {list(crossover_years)}")
    for y in sorted(set(y25.index) & {2023, 2024}):
        print(f"[ep5] {y}: 25-34=${y25[y]:,.0f}  65+=${y65[y]:,.0f}")


def chart_avg_vs_median(avg_pivot, med_pivot):
    fig, ax = new_figure()
    for age, color in [("25 to 34 years", BLUE), ("65 years and over", PINK)]:
        ax.plot(avg_pivot.index, avg_pivot[age], color=color, lw=2, ls="-", label=f"{age} (avg)")
        ax.plot(med_pivot.index, med_pivot[age], color=color, lw=2, ls="--", label=f"{age} (median)")
    ax.set_xlim(avg_pivot.index.min() - 0.5, avg_pivot.index.max() + 0.5)
    ax.set_xticks(avg_pivot.index.astype(int))
    ax.set_ylabel("total income (2024 $)", fontsize=11, color=INK)
    ax.set_title("The crossover shows up in averages, not medians",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=8)
    add_source(fig, "Statistics Canada Table 11-10-0239-01.")
    save(fig, OUT_DIR / "3_avg_vs_median_REPRODUCED.png")


def chart_all_age_groups(avg_pivot):
    fig, ax = new_figure()
    colors = [GREY, BLUE, INK, GREY, PINK]
    for age, color in zip(AGE_GROUPS, colors):
        ax.plot(avg_pivot.index, avg_pivot[age], lw=2, color=color, label=age)
    ax.set_xlim(avg_pivot.index.min() - 0.5, avg_pivot.index.max() + 0.5)
    ax.set_xticks(avg_pivot.index.astype(int))
    ax.set_ylabel("average total income (2024 $)", fontsize=11, color=INK)
    ax.set_title("Average total income by age group, Canadian men 2015-2024",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=8)
    add_source(fig, "Statistics Canada Table 11-10-0239-01.")
    save(fig, OUT_DIR / "2_all_age_groups_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df = fetch_table()
    avg_pivot, med_pivot = build_series(df)
    chart_crossover(avg_pivot)
    chart_avg_vs_median(avg_pivot, med_pivot)
    chart_all_age_groups(avg_pivot)
