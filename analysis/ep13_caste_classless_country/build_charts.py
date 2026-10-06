"""ep13: Does a Country Without Castes Still Build One?

No public dataset for either underlying statistic:
  - Harvard legacy admit rates (classes of 2014-2019) come from economist
    expert reports filed in Students for Fair Admissions v. Harvard,
    analyzed by Arcidiacono, Kinsler & Ransom. The underlying admissions
    microdata was produced under a protective order during litigation and
    is not public; only the aggregate rates the article cites are
    available, from the public court filings and subsequent academic
    papers discussing them.
  - The law-firm resume-audit callback rates are from Rivera & Tilcsik's
    published field-experiment study. Field-experiment audit data of this
    kind is sometimes deposited with ICPSR, but isn't guaranteed public or
    in a directly machine-readable form; the article's cited summary
    statistics are transcribed below rather than re-derived from raw data.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep13"

# TRANSCRIBED from Arcidiacono, Kinsler & Ransom's analysis of SFFA v.
# Harvard litigation data, as cited in the article.
HARVARD_ADMIT_RATES = {"Legacy applicants": 33.6, "Non-legacy applicants": 5.9}

# TRANSCRIBED from Rivera & Tilcsik's resume-audit field experiment
# (316 law firm offices, 14 cities), as cited in the article.
RESUME_CALLBACK_RATES = {
    "Class-coded 'elite' hobbies\n(sailing, polo, classical music)": 16.25,
    "Class-coded 'working-class' hobbies\n(track, soccer, country music)": 1.28,
}


def chart_harvard_legacy():
    fig, ax = new_figure(figsize=(7, 5.5))
    labels, values = list(HARVARD_ADMIT_RATES), list(HARVARD_ADMIT_RATES.values())
    ax.bar(labels, values, color=[PINK, GREY], width=0.5, zorder=2)
    ax.set_ylabel("admit rate (%)", fontsize=11, color=INK)
    ax.set_title("Harvard admit rate, legacy vs. non-legacy applicants, classes of 2014-2019",
                 fontsize=12, color=INK, loc="left", fontweight="bold")
    for i, v in enumerate(values):
        ax.text(i, v + 0.5, f"{v}%", ha="center", fontsize=11, color=INK)
    ax.text(0.97, 0.85, f"{values[0]/values[1]:.1f}x gap", transform=ax.transAxes,
            ha="right", fontsize=10, color=INK)
    add_source(fig, "Arcidiacono, Kinsler & Ransom, analysis of SFFA v. Harvard litigation data. Transcribed from the article's cited figures.")
    save(fig, OUT_DIR / "1_harvard_legacy_admit_rate_REPRODUCED.png")


def chart_resume_audit():
    fig, ax = new_figure(figsize=(8, 5.5))
    labels, values = list(RESUME_CALLBACK_RATES), list(RESUME_CALLBACK_RATES.values())
    ax.bar(labels, values, color=[PINK, GREY], width=0.5, zorder=2)
    ax.set_ylabel("callback rate (%)", fontsize=11, color=INK)
    ax.set_title("Law firm callback rate for identical resumes with class-coded extracurriculars, men only",
                 fontsize=11, color=INK, loc="left", fontweight="bold")
    for i, v in enumerate(values):
        ax.text(i, v + 0.3, f"{v}%", ha="center", fontsize=11, color=INK)
    ax.text(0.97, 0.85, f"{values[0]/values[1]:.1f}x gap", transform=ax.transAxes,
            ha="right", fontsize=10, color=INK)
    add_source(fig, "Rivera & Tilcsik resume audit, 316 law firm offices, 14 cities. Transcribed from the article's cited figures.")
    save(fig, OUT_DIR / "2_resume_audit_callback_rate_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_harvard_legacy()
    chart_resume_audit()
