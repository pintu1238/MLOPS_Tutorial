#!/usr/bin/env python3
"""Generate FLEXORA catalog color-variant JPGs (5 accents × each ks-mp-p-*-NN.jpg base).

Only recolors product accents (stripes, trim). Skin and background are never modified.
"""

from __future__ import annotations

import re
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "assets"

VARIANTS = {
    "c-orange": (249, 115, 22),
    "c-red": (255, 77, 20),
    "c-green": (132, 204, 22),
    "c-blue": (37, 99, 235),
    "c-sky": (66, 183, 255),
}

CATALOG_ACCENTS = np.array(list(VARIANTS.values()), dtype=np.float32)

BASE_PATTERN = re.compile(r"^ks-mp-p-[a-z]+-\d+\.jpg$", re.I)


def _dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    out = mask.copy()
    for _ in range(radius):
        out = (
            out
            | np.roll(out, 1, axis=0)
            | np.roll(out, -1, axis=0)
            | np.roll(out, 1, axis=1)
            | np.roll(out, -1, axis=1)
        )
    return out


def _erode(mask: np.ndarray, radius: int) -> np.ndarray:
    out = mask.copy()
    for _ in range(radius):
        out = (
            out
            & np.roll(out, 1, axis=0)
            & np.roll(out, -1, axis=0)
            & np.roll(out, 1, axis=1)
            & np.roll(out, -1, axis=1)
        )
    return out


def skin_mask(rgb: np.ndarray) -> np.ndarray:
    """True skin only — never white, grey fabric, or saturated product trim."""
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc

    y = 0.299 * r + 0.587 * g + 0.114 * b
    cb = 128.0 - 0.168736 * r - 0.331264 * g + 0.5 * b
    cr = 128.0 + 0.5 * r - 0.418688 * g - 0.081312 * b

    ycrcb = (
        (cb >= 77.0)
        & (cb <= 127.0)
        & (cr >= 133.0)
        & (cr <= 173.0)
        & (y > 40.0)
        & (y < 230.0)
        & (sat >= 18.0)
        & (sat <= 110.0)
        & (r > g + 8.0)
        & (r > b + 10.0)
        & (maxc < 248.0)
    )

    rgb_skin = (
        (r > 95.0)
        & (g > 40.0)
        & (b > 20.0)
        & (b < 200.0)
        & (r > g)
        & (r - g > 10.0)
        & (r - b > 15.0)
        & (sat >= 20.0)
        & (sat <= 105.0)
        & (maxc < 245.0)
    )

    tan = (
        (r > 110.0)
        & (g > 70.0)
        & (g < 190.0)
        & (b < 145.0)
        & (r - b > 20.0)
        & (r - g > 8.0)
        & (sat >= 18.0)
        & (sat <= 100.0)
        & (maxc < 240.0)
    )

    return ycrcb | rgb_skin | tan


def background_mask(rgb: np.ndarray) -> np.ndarray:
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    white = (r > 247) & (g > 247) & (b > 247)
    cream = (r > 218) & (g > 200) & (b > 180) & ((maxc - minc) < 48)
    return white | cream


def fabric_mask(rgb: np.ndarray) -> np.ndarray:
    """Achromatic dark product fabric — excludes brown skin shadows."""
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc
    return (maxc < 78) & (sat < 30)


def near_catalog_accent(rgb: np.ndarray, tolerance: float) -> np.ndarray:
    flat = rgb.reshape(-1, 3).astype(np.float32)
    diff = flat[:, None, :] - CATALOG_ACCENTS[None, :, :]
    dist = np.linalg.norm(diff, axis=2)
    return dist.min(axis=1).reshape(rgb.shape[:2]) <= tolerance


def grey_stripe_mask(rgb: np.ndarray) -> np.ndarray:
    """Mid-grey accent stripes only — skip whole grey garments."""
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc
    grey = (
        (np.abs(r - g) < 18)
        & (np.abs(g - b) < 18)
        & (maxc > 68)
        & (maxc < 175)
        & (sat < 32)
    )
    if grey.mean() > 0.08:
        return np.zeros(grey.shape, dtype=bool)
    return grey


def skin_mask_safe(rgb: np.ndarray) -> np.ndarray:
    """Skin detection with saturated product trim excluded."""
    maxc = np.maximum(np.maximum(rgb[:, :, 0], rgb[:, :, 1]), rgb[:, :, 2])
    minc = np.minimum(np.minimum(rgb[:, :, 0], rgb[:, :, 1]), rgb[:, :, 2])
    sat = maxc.astype(np.int16) - minc.astype(np.int16)
    product_hue = near_catalog_accent(rgb, tolerance=62.0) & (sat >= 70)
    return skin_mask(rgb) & ~product_hue


def skin_shadow_mask(rgb: np.ndarray) -> np.ndarray:
    """Dark flesh / body shadow that is not black product fabric."""
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc
    return (
        (r >= g)
        & (r > b)
        & ((r - b) > 4)
        & (sat < 55)
        & (maxc > 18)
        & (maxc < 115)
        & ~fabric_mask(rgb)
    )


def pale_studio_hand_mask(rgb: np.ndarray) -> np.ndarray:
    """Light/grey studio hands — often missed by YCrCb skin rules."""
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc
    return (
        (maxc > 105.0)
        & (maxc < 245.0)
        & (sat < 55.0)
        & (r >= g - 8.0)
        & (g >= b - 22.0)
        & (r - b > 5.0)
        & ~fabric_mask(rgb)
        & ~background_mask(rgb)
    )


def locked_skin_mask(rgb: np.ndarray) -> np.ndarray:
    skin = skin_mask_safe(rgb) | skin_shadow_mask(rgb) | pale_studio_hand_mask(rgb)
    return _dilate(skin, radius=7)


def product_trim_mask(rgb: np.ndarray) -> np.ndarray:
    """Recolor only existing accent trim on/near product fabric — safe when skin is visible."""
    locked = locked_skin_mask(rgb)
    bg = background_mask(rgb)
    fabric = _dilate(fabric_mask(rgb), radius=5)
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc

    on_product = fabric | (near_catalog_accent(rgb, tolerance=70.0) & (sat >= 52) & _dilate(fabric, radius=8))
    trim = near_catalog_accent(rgb, tolerance=72.0) & (sat >= 48) & (maxc > 58) & on_product
    trim |= (
        ((g > r + 18) & (g > b + 12) & (sat >= 62) & on_product)
        | ((b > r + 14) & (b > g + 10) & (sat >= 58) & on_product)
        | ((r > g + 22) & (r > b + 18) & (sat >= 65) & on_product)
    ) & ~locked
    grey = grey_stripe_mask(rgb) & on_product & ~locked
    mask = trim | grey
    mask &= ~locked
    mask &= ~bg
    mask = _dilate(mask, radius=1)
    mask = _erode(mask, radius=1)
    return mask


def accent_mask(rgb: np.ndarray) -> np.ndarray:
    """Product accent pixels in the base image that may receive a new accent color."""
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc

    skin = skin_mask_safe(rgb)
    bg = background_mask(rgb)
    on_fabric = _dilate(fabric_mask(rgb), radius=6)
    forbidden = _dilate(skin, radius=2) | bg

    vivid = (
        (maxc > 55)
        & ~forbidden
        & (
            ((r > g + 28) & (r > b + 24) & (sat >= 78) & on_fabric)
            | ((g > r + 22) & (g > b + 16) & (sat >= 68))
            | ((b > r + 18) & (b > g + 12) & (sat >= 68))
        )
    )
    catalog_trim = (
        near_catalog_accent(rgb, tolerance=78.0)
        & (sat >= 50)
        & (maxc > 55)
        & on_fabric
        & ~forbidden
    )
    grey = grey_stripe_mask(rgb) & on_fabric & ~forbidden

    if skin.mean() > 0.02:
        accent = vivid | catalog_trim | grey
    else:
        chroma_trim = (
            on_fabric
            & (sat >= 55)
            & (maxc > 70)
            & (
                (r > g + 45) & (r > b + 40)
                | (g > r + 28) & (g > b + 20)
                | (b > r + 24) & (b > g + 16)
            )
            & ~forbidden
        )
        accent = vivid | catalog_trim | chroma_trim | grey

    accent = _dilate(accent, radius=1)
    accent = _erode(accent, radius=1)
    return accent & ~forbidden


def apply_accent_color(img: Image.Image, target: tuple[int, int, int]) -> Image.Image:
    arr = np.array(img.convert("RGB"))
    bg = background_mask(arr)
    locked = locked_skin_mask(arr) | bg
    skin_ratio = float(np.mean(locked_skin_mask(arr)))
    if skin_ratio > 0.018:
        mask = product_trim_mask(arr)
    else:
        mask = accent_mask(arr)
        mask &= ~locked
        mask &= ~_dilate(locked_skin_mask(arr), radius=2)

    out = arr.copy()
    if np.any(mask):
        tr, tg, tb = target
        ys, xs = np.where(mask)
        lum = (arr[ys, xs, 0].astype(np.float32) + arr[ys, xs, 1] + arr[ys, xs, 2]) / 3.0
        scale = np.clip(lum / 140.0, 0.35, 1.35)
        out[ys, xs, 0] = np.clip(tr * scale, 0, 255).astype(np.uint8)
        out[ys, xs, 1] = np.clip(tg * scale, 0, 255).astype(np.uint8)
        out[ys, xs, 2] = np.clip(tb * scale, 0, 255).astype(np.uint8)

    restore = locked_skin_mask(arr) | bg
    out[restore] = arr[restore]
    return Image.fromarray(out, "RGB")


def main() -> None:
    import sys

    only_filter = sys.argv[1] if len(sys.argv) > 1 else ""
    bases = sorted(p for p in ASSETS.glob("ks-mp-p-*.jpg") if BASE_PATTERN.match(p.name))
    if only_filter:
        bases = [p for p in bases if only_filter in p.stem]
    if not bases:
        raise SystemExit("No base ks-mp-p-*-NN.jpg files found.")

    written = 0
    for base_path in bases:
        try:
            source = Image.open(base_path)
        except OSError as err:
            print(f"skip {base_path.name}: {err}")
            continue
        for slug, rgb in VARIANTS.items():
            out_path = ASSETS / f"{base_path.stem}-{slug}.jpg"
            variant = apply_accent_color(source, rgb)
            variant.save(out_path, "JPEG", quality=92, optimize=True)
            written += 1
        print(f"{base_path.name} -> 5 variants")

    print(f"Done. Wrote {written} files ({len(bases)} bases × {len(VARIANTS)} colors).")


if __name__ == "__main__":
    main()
