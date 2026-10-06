"""ep6: Last-Click Attribution Explains About 19% of Whether Ads Actually Work

No public dataset: this article is built entirely on results reported in
Gordon, Moakler & Zettelmeyer, "Predicted Incrementality by Experimentation
(PIE) for Ad Measurement" (Meta Research & Northwestern, March 2026). The
underlying 2,226 Meta ad experiments are Meta's proprietary RCT data and
are not published as a dataset -- the paper reports only the aggregate
benchmark statistics reproduced below. There's no independent public
source to re-derive this from; the figures are transcribed directly from
the paper's reported results, as cited in the article.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep6"

# TRANSCRIBED from Gordon, Moakler & Zettelmeyer (2026), as cited in the article.
R2_COMPARISON = {"Last-click": 0.19, "PIE": 0.88}
ERROR_RATES = {"Last-click": 19, "PIE": 12}  # % disagreement with RCT ground truth
N_EXPERIMENTS = 2226


def chart_r2_comparison():
    fig, ax = new_figure(figsize=(7, 5.5))
    labels, values = list(R2_COMPARISON), list(R2_COMPARISON.values())
    ax.bar(labels, values, color=[GREY, PINK], width=0.5, zorder=2)
    ax.set_ylim(0, 1)
    ax.set_ylabel("out-of-sample R² vs. RCT ground truth", fontsize=11, color=INK)
    ax.set_title("Predictive accuracy: last-click attribution vs PIE",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    for i, v in enumerate(values):
        ax.text(i, v + 0.02, f"{v:.2f}", ha="center", fontsize=11, color=INK)
    add_source(fig, f"Gordon, Moakler & Zettelmeyer (2026), n={N_EXPERIMENTS} Meta ad experiments. Transcribed from the paper's reported results.")
    save(fig, OUT_DIR / "1_r2_comparison_REPRODUCED.png")


def chart_error_rates():
    fig, ax = new_figure(figsize=(7, 5.5))
    labels, values = list(ERROR_RATES), list(ERROR_RATES.values())
    ax.bar(labels, values, color=[GREY, PINK], width=0.5, zorder=2)
    ax.set_ylabel("disagreement with RCT ground truth (%)", fontsize=11, color=INK)
    ax.set_title("Decision errors: PIE vs last-click attribution at campaign threshold",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    for i, v in enumerate(values):
        ax.text(i, v + 0.3, f"{v}%", ha="center", fontsize=11, color=INK)
    add_source(fig, f"Gordon, Moakler & Zettelmeyer (2026), n={N_EXPERIMENTS}. Transcribed from the paper's reported results.")
    save(fig, OUT_DIR / "3_error_rates_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_r2_comparison()
    chart_error_rates()
    print("[ep6] 2_pie_flow (method diagram) and 4_sample_size (performance vs. "
          "training sample size) are process/sensitivity figures from the paper, "
          "not single reported statistics -- redraw directly from the paper's "
          "Figure 2 and Figure 4 if you have access to it.")
