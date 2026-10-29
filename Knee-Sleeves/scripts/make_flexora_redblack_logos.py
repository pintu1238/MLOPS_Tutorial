from pathlib import Path

import numpy as np
from PIL import Image

src = Path(
    r"C:\Users\pintu\.cursor\projects\c-Users-pintu-Desktop-shopify-websites-Knee-Sleeves\assets\ks-mp-logo-flexora-redblack.jpg"
)
assets = Path(r"C:\Users\pintu\Desktop\shopify_websites\Knee-Sleeves\assets")
light_out = assets / "ks-mp-logo-flexora.jpg"
dark_out = assets / "ks-mp-logo-flexora-dark.jpg"


def trim_arr(arr, mask, pad=14):
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    top, bottom = int(rows[0]), int(rows[-1])
    left, right = int(cols[0]), int(cols[-1])
    h, w = arr.shape[:2]
    top = max(0, top - pad)
    left = max(0, left - pad)
    bottom = min(h, bottom + 1 + pad)
    right = min(w, right + 1 + pad)
    return arr[top:bottom, left:right]


im = Image.open(src).convert("RGB")
arr = np.array(im).astype(np.int16)
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
ink = (r < 245) | (g < 245) | (b < 245)
light = trim_arr(arr, ink, pad=16)
Image.fromarray(light.astype(np.uint8)).save(light_out, quality=95)
print("light", im.size, "->", light.shape[1], light.shape[0])

lr, lg, lb = light[:, :, 0], light[:, :, 1], light[:, :, 2]
red_mask = (lr > 140) & (lr > lg + 40) & (lr > lb + 40)
dark_mask = (lr < 70) & (lg < 70) & (lb < 70)
light_mask = (lr > 220) & (lg > 220) & (lb > 220)

dark = np.empty_like(light)
dark[:, :] = (0, 0, 0)
dark[light_mask] = (0, 0, 0)
dark[dark_mask] = (255, 255, 255)
dark[red_mask] = light[red_mask]
# keep remaining mid tones as inverted-ish: prefer white if originally dark-ish
mid = ~(red_mask | dark_mask | light_mask)
luma = (0.3 * lr + 0.59 * lg + 0.11 * lb)
dark[mid & (luma < 160)] = (255, 255, 255)
dark[mid & (luma >= 160)] = (0, 0, 0)
dark[red_mask] = light[red_mask]

ink_dark = (dark[:, :, 0] > 12) | (dark[:, :, 1] > 12) | (dark[:, :, 2] > 12)
dark = trim_arr(dark, ink_dark, pad=16)
Image.fromarray(dark.astype(np.uint8)).save(dark_out, quality=95)
print("dark", dark.shape[1], dark.shape[0])
