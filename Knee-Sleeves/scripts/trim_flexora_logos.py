from pathlib import Path

import numpy as np
from PIL import Image

assets = Path(r"C:\Users\pintu\Desktop\shopify_websites\Knee-Sleeves\assets")


def trim(path, mode, pad=16):
    im = Image.open(path).convert("RGB")
    arr = np.array(im)
    if mode == "light":
        mask = np.any(arr < 245, axis=2)
    else:
        mask = np.any(arr > 18, axis=2)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        print("no content", path)
        return
    top, bottom = int(rows[0]), int(rows[-1])
    left, right = int(cols[0]), int(cols[-1])
    top = max(0, top - pad)
    left = max(0, left - pad)
    bottom = min(im.height - 1, bottom + pad)
    right = min(im.width - 1, right + pad)
    cropped = im.crop((left, top, right + 1, bottom + 1))
    cropped.save(path, quality=95)
    print(path.name, im.size, "->", cropped.size)


trim(assets / "ks-mp-logo-flexora.jpg", "light", pad=16)
trim(assets / "ks-mp-logo-flexora-dark.jpg", "dark", pad=16)
