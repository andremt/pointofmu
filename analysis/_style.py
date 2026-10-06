"""Shared chart style for pointofmu.com, per the project's chart design system.

Every episode's build_charts.py imports this module so all charts share one
palette, one type scale, and one figure/source-line convention.
"""

import matplotlib.pyplot as plt

INK = "#0E0E10"    # text, axes
PAPER = "#F7F4ED"  # background
PINK = "#FF3D8B"   # primary highlight / call-out series
BLUE = "#2B4BFF"   # secondary series
GREY = "#AAAAAA"   # muted / background series
RULE = "#D8D4CA"   # gridlines, axis lines
CREAM = "#EDE9DF"  # stat box backgrounds

TITLE_SIZE = 14
LABEL_SIZE = 11
TICK_SIZE = 10
ANNOT_SIZE = 10
SOURCE_SIZE = 8.5


def new_figure(figsize=(11, 5.5)):
    fig, ax = plt.subplots(figsize=figsize, facecolor=PAPER)
    ax.set_facecolor(PAPER)
    ax.spines[["top", "right"]].set_visible(False)
    ax.spines[["left", "bottom"]].set_color(RULE)
    ax.tick_params(colors=INK, labelsize=TICK_SIZE)
    ax.grid(axis="y", color=RULE, lw=0.8, zorder=0)
    return fig, ax


def add_source(fig, text):
    fig.text(
        0.0, -0.04, f"Source: {text}",
        fontsize=SOURCE_SIZE, color=GREY,
        fontstyle="italic", transform=fig.transFigure,
    )


def add_stat_box(ax, text):
    ax.text(
        0.97, 0.06, text, transform=ax.transAxes,
        fontsize=10, color=INK, ha="right", va="bottom",
        bbox=dict(boxstyle="round,pad=0.5", facecolor=CREAM, edgecolor=RULE, lw=1),
    )


def save(fig, path):
    fig.tight_layout(rect=[0, 0.04, 1, 1])
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=PAPER)
    plt.close(fig)
