"""ep12: Does Uplift Modeling Actually Beat Guessing Who'll Buy?

Criteo Research Uplift Modeling Dataset (Diemert, Betlei, Renaudin &
Amini, "A Large Scale Benchmark for Uplift Modeling," AdKDD 2018).
go.criteo.net stops serving the file from time to time; Criteo's team
also mirrors it on Hugging Face (criteo/criteo-uplift), which is what
this pulls from.

n = 13,979,592 (post dropna), 12 anonymized features (f0-f11), a binary
treatment indicator, visit/conversion outcomes.

Builds: average treatment effect, a two-model uplift score vs. a plain
response-propensity baseline, their Qini coefficients, the percentile
score distribution, and the decile uplift breakdown.

Qini direction is sensitive to regularization/solver choices the
article doesn't specify -- a plain LogisticRegression run here puts the
two-model score slightly ahead of the baseline (r=0.83 between scores)
rather than behind it like the article (r=0.51). Match exact
hyperparameters if that specific flip matters.
"""

import gzip
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import BLUE, GREY, INK, PINK, add_source, new_figure, save

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep12"
DATA_FILE = DATA_DIR / "criteo-research-uplift-v2.1.csv.gz"
# go.criteo.net is unreliable; Criteo's team mirrors the identical file here.
DATA_URL = "https://huggingface.co/datasets/criteo/criteo-uplift/resolve/main/criteo-research-uplift-v2.1.csv.gz"
OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep12"

FEATURES = [f"f{i}" for i in range(12)]


def fetch():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        print("[ep12] downloading ~311MB from Hugging Face...")
        resp = requests.get(DATA_URL, stream=True, timeout=120)
        resp.raise_for_status()
        with open(DATA_FILE, "wb") as fh:
            for chunk in resp.iter_content(chunk_size=2**20):
                fh.write(chunk)
    with gzip.open(DATA_FILE, "rt") as fh:
        df = pd.read_csv(fh)
    return df


def average_treatment_effect(df):
    treat = df[df.treatment == 1].conversion.mean()
    ctrl = df[df.treatment == 0].conversion.mean()
    n1, n0 = (df.treatment == 1).sum(), (df.treatment == 0).sum()
    se = np.sqrt(treat * (1 - treat) / n1 + ctrl * (1 - ctrl) / n0)
    diff = treat - ctrl
    ci = (diff - 1.96 * se, diff + 1.96 * se)
    print(f"[ep12] conversion: control={ctrl*100:.3f}% treatment={treat*100:.3f}% "
          f"diff={diff*100:.3f}pp 95% CI=({ci[0]*100:.3f}, {ci[1]*100:.3f})")
    return ctrl, treat, diff, ci


def chart_ate(df):
    ctrl, treat, diff, ci = average_treatment_effect(df)
    fig, ax = new_figure(figsize=(7, 5.5))
    ax.bar(["Control\n(no ad)", "Treatment\n(saw ad)"], [ctrl * 100, treat * 100],
           color=[GREY, PINK], width=0.5, zorder=2)
    ax.set_ylabel("conversion rate (%)", fontsize=11, color=INK)
    ax.set_title("Average conversion rate, treatment vs. control, across 14 million users",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.text(0.5, 0.9, f"+{diff*100:.3f}pp ({diff/ctrl*100:.0f}% relative lift)",
            transform=ax.transAxes, ha="center", fontsize=11, color=INK)
    add_source(fig, "Criteo Research Uplift Dataset (Diemert et al. 2018), n=14M.")
    save(fig, OUT_DIR / "1_ate_conversion_REPRODUCED.png")


def qini_curve(y_true, treatment, score):
    """Qini curve values and the Qini coefficient (area vs. random targeting)."""
    order = np.argsort(-score)
    y, t = y_true[order], treatment[order]
    n = len(y)
    n_t, n_c = t.sum(), (1 - t).sum()
    cum_t_conv = np.cumsum(y * t)
    cum_c_conv = np.cumsum(y * (1 - t))
    frac = np.arange(1, n + 1) / n
    qini = cum_t_conv - cum_c_conv * (n_t / max(n_c, 1))
    # Qini coefficient: area under curve above the random-targeting diagonal
    random_line = qini[-1] * frac
    trapezoid = getattr(np, "trapezoid", None) or np.trapz
    coef = trapezoid(qini - random_line, frac)
    return frac, qini, coef


def two_model_and_baseline(df):
    X = df[FEATURES].to_numpy()
    y = df["conversion"].to_numpy()
    t = df["treatment"].to_numpy()

    X_train, X_test, y_train, y_test, t_train, t_test = train_test_split(
        X, y, t, test_size=1 / 3, random_state=42, stratify=t
    )

    # Two-model uplift: separate models for treated and control, subtract.
    m_t = LogisticRegression(max_iter=200).fit(X_train[t_train == 1], y_train[t_train == 1])
    m_c = LogisticRegression(max_iter=200).fit(X_train[t_train == 0], y_train[t_train == 0])
    uplift_score = m_t.predict_proba(X_test)[:, 1] - m_c.predict_proba(X_test)[:, 1]

    # Plain response-propensity baseline: one model, trained on treated users only.
    response_score = m_t.predict_proba(X_test)[:, 1]

    frac_u, qini_u, coef_u = qini_curve(y_test, t_test, uplift_score)
    frac_r, qini_r, coef_r = qini_curve(y_test, t_test, response_score)
    print(f"[ep12] Qini coefficient: two-model={coef_u*1e6:.0f} response-only={coef_r*1e6:.0f}")
    print(f"[ep12] score correlation r={np.corrcoef(uplift_score, response_score)[0,1]:.2f}")

    return (frac_u, qini_u, coef_u), (frac_r, qini_r, coef_r), uplift_score, response_score, y_test, t_test


def chart_qini(uplift_res, response_res):
    frac_u, qini_u, coef_u = uplift_res
    frac_r, qini_r, coef_r = response_res
    fig, ax = new_figure()
    ax.plot(frac_r * 100, qini_r, color=GREY, lw=2, label=f"response-only (Qini={coef_r*1e6:.0f})")
    ax.plot(frac_u * 100, qini_u, color=PINK, lw=2, label=f"two-model uplift (Qini={coef_u*1e6:.0f})")
    ax.set_xlabel("% of users targeted (sorted by score)", fontsize=11, color=INK)
    ax.set_ylabel("cumulative incremental conversions", fontsize=11, color=INK)
    ax.set_title("Qini curve: two-model uplift score vs. a plain response-probability score",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")
    add_source(fig, "Criteo Research Uplift Dataset, held-out third, n~4.66M test rows.")
    save(fig, OUT_DIR / "2_qini_curve_REPRODUCED.png")


def chart_score_distribution(uplift_score, response_score):
    fig, ax = new_figure()
    pct = np.linspace(0, 100, 200)
    ax.plot(pct, np.percentile(uplift_score, pct), color=PINK, lw=2, label="two-model uplift score")
    ax.plot(pct, np.percentile(response_score, pct), color=GREY, lw=2, label="response-only score")
    ax.set_xlabel("percentile", fontsize=11, color=INK)
    ax.set_ylabel("score value", fontsize=11, color=INK)
    ax.set_title("Both scores sorted by percentile: flat for most users, diverging only at the tail",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")
    add_source(fig, "Criteo Research Uplift Dataset, held-out third.")
    save(fig, OUT_DIR / "4_score_distribution_REPRODUCED.png")


def chart_decile_uplift(uplift_score, y_test, t_test):
    deciles = pd.qcut(uplift_score, 10, labels=False, duplicates="drop")
    rows = []
    for d in sorted(np.unique(deciles)):
        mask = deciles == d
        yt, tt = y_test[mask], t_test[mask]
        if tt.sum() == 0 or (1 - tt).sum() == 0:
            continue
        lift = yt[tt == 1].mean() - yt[tt == 0].mean()
        rows.append((d, lift))
    fig, ax = new_figure()
    ds = [r[0] for r in rows]
    lifts = [r[1] * 100 for r in rows]
    colors = [PINK if d == max(ds) else (BLUE if d == min(ds) else GREY) for d in ds]
    ax.bar(ds, lifts, color=colors, zorder=2)
    ax.set_xlabel("decile of predicted uplift (0=lowest, 9=highest)", fontsize=11, color=INK)
    ax.set_ylabel("actual incremental conversion (pp)", fontsize=11, color=INK)
    ax.set_title("Actual incremental conversion rate by decile of predicted uplift",
                 fontsize=13, color=INK, loc="left", fontweight="bold")
    add_source(fig, "Criteo Research Uplift Dataset, held-out third.")
    save(fig, OUT_DIR / "3_decile_uplift_REPRODUCED.png")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df = fetch()
    df = df.dropna(subset=FEATURES + ["treatment", "conversion"])
    print(f"[ep12] n={len(df):,}")
    chart_ate(df)
    uplift_res, response_res, uplift_score, response_score, y_test, t_test = two_model_and_baseline(df)
    chart_qini(uplift_res, response_res)
    chart_score_distribution(uplift_score, response_score)
    chart_decile_uplift(uplift_score, y_test, t_test)
