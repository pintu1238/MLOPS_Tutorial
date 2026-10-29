#!/usr/bin/env python3
"""Copy shop 01-10 Amazon galleries onto matching drift asset names."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SHOTS = [
    "g02-kit",
    "g03-drift",
    "g04-tires",
    "g05-leds",
    "g06-remote",
    "g07-details",
    "g08-action",
    "g09-complete",
    "g10-cyan",
    "g11-red",
    "g12-yellow",
    "d01-about",
    "d02-box",
    "d03-features",
    "d04-battery",
    "d05-precision",
    "d06-ready",
]


def prefix(idx: int, family: str) -> str:
    base = "tc-mp-drift-" if family == "drift" else "tc-mp-shop-"
    return f"{base}{idx:02d}" if idx < 10 else f"{base}10"


def main() -> None:
    copied = 0
    for idx in range(1, 11):
        shop = prefix(idx, "shop")
        drift = prefix(idx, "drift")
        for slug in SHOTS:
            src = ASSETS / f"{shop}-{slug}.jpg"
            dst = ASSETS / f"{drift}-{slug}.jpg"
            if not src.exists():
                print("missing", src.name)
                continue
            shutil.copyfile(src, dst)
            copied += 1
            print("copied", src.name, "->", dst.name)
    print(f"Copied {copied} drift gallery files.")


if __name__ == "__main__":
    main()
