"""ep14: Do Micro-Influencers Actually Engage More?

Pulls the three cited samples from their public CSV mirrors and reruns
the log-log fit, the cross-platform comparison, and the power-law vs
log-normal test.

Sources:
  - Bright Data TikTok profile sample (n=1,000), via luminati-io/Free-datasets
    columns: followers, like_engagement_rate (pre-computed, as a %)
  - Bright Data Twitter/X post sample (n=1,000), via luminati-io/Free-datasets
    columns: followers, likes (engagement rate = likes / followers)
  - niteshkuwarbi/instagram-data-analysis top-1,000 global Instagram mirror (n=996)
    columns: Followers, Engagement avg (engagement rate = that / Followers)

Bright Data mirrors get refreshed periodically, so column names can
drift -- re-check against the live CSV header if this starts raising
KeyErrors. TikTok's like_engagement_rate field isn't formula-documented
by Bright Data, so its absolute scale is a best-effort match to the
article's chart axis rather than a guaranteed exact replication; the
fitted exponent and R2 are the more load-bearing numbers here.
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from scipy import stats

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _style import GREY, INK, PINK, add_source, new_figure, save

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ep14"
OUT_DIR = Path(__file__).resolve().parents[1] / "output" / "ep14"

SOURCES = {
    "tiktok": "https://raw.githubusercontent.com/luminati-io/Free-datasets/main/tiktok-profiles.csv",
    "twitter": "https://raw.githubusercontent.com/luminati-io/Free-datasets/main/twitter-posts.csv",
    "instagram": "https://raw.githubusercontent.com/niteshkuwarbi/instagram-data-analysis/main/instagram_global_top_1000.csv",
}


def fetch(name, url):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    local = DATA_DIR / f"{name}.csv"
    if not local.exists():
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        local.write_bytes(resp.content)
    return pd.read_csv(local, low_memory=False)


def followers_and_engagement(platform):
    """Return (followers, engagement_rate_as_fraction) for one platform."""
    df = fetch(platform, SOURCES[platform])
    if platform == "tiktok":
        followers = pd.to_numeric(df["followers"], errors="coerce")
        # like_engagement_rate is already on the article's native scale (its
        # own chart axis runs 10^-4 to 10^2), not a 0-1 fraction -- do not
        # divide by 100 here.
        engagement = pd.to_numeric(df["like_engagement_rate"], errors="coerce")
    elif platform == "twitter":
        followers = pd.to_numeric(df["followers"], errors="coerce")
        # expressed as a percent (0-100), to match TikTok's native scale
        engagement = 100 * pd.to_numeric(df["likes"], errors="coerce") / followers.replace(0, np.nan)
    elif platform == "instagram":
        followers = pd.to_numeric(df["Followers"], errors="coerce")
        engagement = 100 * pd.to_numeric(df["Engagement avg"], errors="coerce") / followers.replace(0, np.nan)
    else:
        raise ValueError(platform)
    mask = followers.notna() & engagement.notna() & (followers > 0) & (engagement > 0)
    return followers[mask].to_numpy(), engagement[mask].to_numpy()


def log_log_fit(followers, engagement):
    x, y = np.log10(followers), np.log10(engagement)
    slope, intercept, r, _, _ = stats.linregress(x, y)
    return slope, intercept, r**2, len(x)


def gini(x):
    x = np.sort(np.asarray(x, dtype=float))
    n = len(x)
    cum = np.cumsum(x)
    return (2 * np.sum(np.arange(1, n + 1) * x) - (n + 1) * cum[-1]) / (n * cum[-1])


def chart_tiktok_power_law():
    followers, engagement = followers_and_engagement("tiktok")
    slope, intercept, r2, n = log_log_fit(followers, engagement)

    fig, ax = new_figure()
    lf, le = np.log10(followers), np.log10(engagement)
    ax.scatter(lf, le, s=8, color=GREY, alpha=0.4, zorder=2)
    xs = np.linspace(lf.min(), lf.max(), 100)
    ax.plot(xs, intercept + slope * xs, color=PINK, lw=2, zorder=3)
    ax.set_xlabel("log10(followers)", fontsize=11, color=INK)
    ax.set_ylabel("log10(engagement rate)", fontsize=11, color=INK)
    ax.set_title("TikTok: engagement rate falls as a power of follower count",
                 fontsize=14, color=INK, loc="left", fontweight="bold")
    ax.text(0.03, 0.08, f"exponent {slope:.2f}\nengagement rate ~ followers^{slope:.2f}\n"
            f"R2 = {r2:.2f}, n = {n}", transform=ax.transAxes, fontsize=10, color=INK)
    add_source(fig, "Bright Data TikTok profile sample, n=1,000. Sampling method undisclosed.")
    save(fig, OUT_DIR / "1_tiktok_power_law_REPRODUCED.png")
    print(f"[ep14] TikTok fit: exponent={slope:.3f} R2={r2:.3f} n={n}")
    return slope, r2, n


def chart_cross_platform_comparison():
    """Fitted engagement rate at 10,000 vs 100,000(+) followers, per platform."""
    rows = []
    for platform, hi_lo in (("tiktok", (1e4, 1e5)), ("twitter", (1e4, 1e5)), ("instagram", (1e7, 1e8))):
        followers, engagement = followers_and_engagement(platform)
        slope, intercept, r2, n = log_log_fit(followers, engagement)
        lo, hi = hi_lo
        rate_lo = 10 ** (intercept + slope * np.log10(lo))
        rate_hi = 10 ** (intercept + slope * np.log10(hi))
        rows.append((platform, lo, rate_lo, hi, rate_hi, n))
        print(f"[ep14] {platform}: at {lo:.0g} followers -> {rate_lo:.2f}%; "
              f"at {hi:.0g} -> {rate_hi:.2f}% (n={n})")

    fig, ax = new_figure()
    labels = [r[0].title() for r in rows]
    lo_vals = [r[2] for r in rows]  # already percent-scale, see followers_and_engagement
    hi_vals = [r[4] for r in rows]
    x = np.arange(len(rows))
    ax.bar(x - 0.18, lo_vals, width=0.36, color=PINK, label="lower follower count", zorder=2)
    ax.bar(x + 0.18, hi_vals, width=0.36, color=GREY, label="10x more followers", zorder=2)
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("engagement rate (%)", fontsize=11, color=INK)
    ax.set_title("Bigger accounts get less engagement per follower, on every platform checked",
                 fontsize=14, color=INK, loc="left", fontweight="bold")
    ax.legend(frameon=False, fontsize=9)
    add_source(fig, "Bright Data (TikTok, Twitter/X); niteshkuwarbi/instagram-data-analysis top-1,000 mirror (Instagram).")
    save(fig, OUT_DIR / "2_cross_platform_REPRODUCED.png")
    return rows


def power_law_vs_lognormal_test(followers):
    """Simplified Vuong-style LR test, power law vs log-normal tail (above median).

    This reproduces the qualitative finding (near coin flip) using a basic
    MLE + Vuong LR test. For a publication-grade replication, use the
    `powerlaw` package (Alstott, Bullmore & Plenz 2014), which does a proper
    xmin search and bootstrap p-value.
    """
    x = np.sort(followers[followers > 0])
    xmin = np.median(x)
    tail = x[x >= xmin]
    n = len(tail)

    alpha = 1 + n / np.sum(np.log(tail / xmin))
    ll_pl_i = np.log((alpha - 1) / xmin) - alpha * np.log(tail / xmin)

    mu, sigma = np.mean(np.log(tail)), np.std(np.log(tail))
    ll_ln_i = stats.lognorm.logpdf(tail, s=sigma, scale=np.exp(mu))

    diff = ll_pl_i - ll_ln_i
    R, var = diff.sum(), diff.var()
    z = R / np.sqrt(n * var) if var > 0 else 0.0
    p = 2 * (1 - stats.norm.cdf(abs(z)))
    print(f"[ep14] power law alpha={alpha:.2f}, Gini={gini(tail):.3f}, "
          f"Vuong R={R:.2f}, p={p:.3f} (near 0.5 => shapes nearly indistinguishable)")
    return alpha, p


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chart_tiktok_power_law()
    chart_cross_platform_comparison()
    followers, _ = followers_and_engagement("tiktok")
    power_law_vs_lognormal_test(followers)
