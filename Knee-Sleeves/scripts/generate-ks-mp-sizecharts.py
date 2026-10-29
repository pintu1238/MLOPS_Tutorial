"""FLEXORA PDP size-guide slides — 2nd gallery image for every catalog product."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
CATALOG = ASSETS / "ks-mp-search-catalog.json"
SIZE = (823, 823)
BG = (255, 255, 255)
ACCENT = (255, 103, 12)
INK = (17, 17, 17)
MUTED = (75, 85, 99)
LINE = (255, 103, 12)

FAMILY_CHARTS = {
    "knee": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "12.0 – 13.4", "30 – 34"), ("M", "13.4 – 15.0", "34 – 38"), ("L", "15.0 – 16.5", "38 – 42"), ("XL", "16.5 – 18.1", "42 – 46"), ("XXL", "18.1 – 19.7", "46 – 50")],
        "steps": [
            "Stand with a slight bend in the knee.",
            "Measure around the centre of the kneecap.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-knee-worn.jpg",
    },
    "wrist": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "5.5 – 6.3", "14 – 16"), ("M", "6.3 – 7.1", "16 – 18"), ("L", "7.1 – 7.9", "18 – 20"), ("XL", "7.9 – 8.7", "20 – 22"), ("XXL", "8.7 – 9.4", "22 – 24")],
        "steps": [
            "Keep the wrist straight and relaxed.",
            "Measure around the wrist joint, just below the palm.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-wrist-worn.jpg",
    },
    "ankle": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "7.1 – 7.9", "18 – 20"), ("M", "7.9 – 8.7", "20 – 22"), ("L", "8.7 – 9.4", "22 – 24"), ("XL", "9.4 – 10.2", "24 – 26"), ("XXL", "10.2 – 11.0", "26 – 28")],
        "steps": [
            "Sit with the foot flat on the floor.",
            "Measure around the narrowest part of the ankle.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-ankle-worn.jpg",
    },
    "elbow": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "8.7 – 9.4", "22 – 24"), ("M", "9.4 – 10.2", "24 – 26"), ("L", "10.2 – 11.0", "26 – 28"), ("XL", "11.0 – 11.8", "28 – 30"), ("XXL", "11.8 – 12.6", "30 – 32")],
        "steps": [
            "Bend the elbow slightly.",
            "Measure around the centre of the elbow joint.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-elbow-worn.jpg",
    },
    "calf": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "12.2 – 13.4", "31 – 34"), ("M", "13.4 – 14.6", "34 – 37"), ("L", "14.6 – 15.7", "37 – 40"), ("XL", "15.7 – 16.9", "40 – 43"), ("XXL", "16.9 – 18.1", "43 – 46")],
        "steps": [
            "Sit with the foot flat on the floor.",
            "Measure around the widest part of the calf.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-calf-worn.jpg",
    },
    "arm": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "9.8 – 11.0", "25 – 28"), ("M", "11.0 – 12.2", "28 – 31"), ("L", "12.2 – 13.4", "31 – 34"), ("XL", "13.4 – 14.6", "34 – 37"), ("XXL", "14.6 – 15.7", "37 – 40")],
        "steps": [
            "Relax the arm at your side.",
            "Measure around the widest part of the bicep.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-arm-worn.jpg",
    },
    "cap": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "Inches", "CM"),
        "rows": [("S", "34 – 36", "86 – 91"), ("M", "36 – 38", "91 – 97"), ("L", "38 – 40", "97 – 102"), ("XL", "40 – 42", "102 – 107"), ("XXL", "42 – 44", "107 – 112")],
        "steps": [
            "Stand upright with arms relaxed.",
            "Measure around the chest at the armpit line.",
            "Match the cm range. Between sizes, size up.",
        ],
        "photo": "ks-mp-p-cap-worn.jpg",
    },
    "socks": {
        "heading": "CHOOSE YOUR\nPERFECT FIT",
        "measure_title": "HOW TO MEASURE",
        "cols": ("Sizes", "UK", "EU"),
        "rows": [("S", "4 – 6", "37 – 39"), ("M", "6 – 8", "40 – 42"), ("L", "8 – 10", "43 – 45"), ("XL", "10 – 12", "46 – 48"), ("XXL", "12 – 13", "48 – 50")],
        "steps": [
            "Use your usual shoe size.",
            "If you are between sizes, choose the larger size.",
            "Match UK or EU to the chart for a snug gym fit.",
        ],
        "photo": "ks-mp-p-socks-worn.jpg",
    },
}


def load_font(size: int, bold: bool = False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def family_from_asset(asset: str) -> str:
    parts = asset.replace(".jpg", "").split("-")
    return parts[3] if len(parts) >= 4 else "knee"


def paste_photo(canvas: Image.Image, photo_name: str) -> None:
    path = ASSETS / photo_name
    if not path.exists():
        return
    src = Image.open(path).convert("RGB")
    box_w, box_h = 360, 760
    src_w, src_h = src.size
    scale = max(box_w / src_w, box_h / src_h)
    new = src.resize((int(src_w * scale), int(src_h * scale)), Image.Resampling.LANCZOS)
    left = max(0, (new.width - box_w) // 2)
    top = max(0, (new.height - box_h) // 2)
    crop = new.crop((left, top, left + box_w, top + box_h))
    canvas.paste(crop, (SIZE[0] - box_w - 12, (SIZE[1] - box_h) // 2))


def draw_chart(out_name: str, family: str, product_title: str) -> None:
    meta = FAMILY_CHARTS[family]
    img = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(img)

    paste_photo(img, meta["photo"])
    fade = Image.new("RGBA", SIZE, (255, 255, 255, 0))
    fade_draw = ImageDraw.Draw(fade)
    for i in range(80):
        alpha = int(180 * (1 - i / 80))
        x = 430 + i
        fade_draw.line((x, 0, x, SIZE[1]), fill=(255, 255, 255, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), fade).convert("RGB")
    draw = ImageDraw.Draw(img)

    heading_font = load_font(42, bold=True)
    table_head = load_font(20, bold=True)
    table_cell = load_font(22, bold=True)
    step_title = load_font(32, bold=True)
    step_font = load_font(18)
    brand_font = load_font(16, bold=True)
    title_font = load_font(15, bold=True)

    draw.text((36, 22), "FLEXORA", fill=ACCENT, font=brand_font)
    draw.text((36, 44), product_title[:42], fill=MUTED, font=title_font)

    y = 78
    for line in meta["heading"].split("\n"):
        draw.text((36, y), line, fill=ACCENT, font=heading_font)
        y += 48

    col_x = [36, 130, 278]
    table_top = y + 18
    draw.text((col_x[0], table_top), meta["cols"][0], fill=INK, font=table_head)
    draw.text((col_x[1], table_top), meta["cols"][1], fill=INK, font=table_head)
    draw.text((col_x[2], table_top), meta["cols"][2], fill=INK, font=table_head)
    line_y = table_top + 32
    draw.line((36, line_y, 400, line_y), fill=LINE, width=3)

    row_y = line_y + 14
    for size, inches, cm in meta["rows"]:
        draw.text((col_x[0], row_y), size, fill=INK, font=table_cell)
        draw.text((col_x[1], row_y), inches, fill=INK, font=table_cell)
        draw.text((col_x[2], row_y), cm, fill=INK, font=table_cell)
        row_y += 42
        draw.line((36, row_y - 8, 400, row_y - 8), fill=(255, 214, 186), width=2)

    my = row_y + 18
    draw.text((36, my), meta["measure_title"], fill=ACCENT, font=step_title)
    my += 48
    for i, step in enumerate(meta["steps"], start=1):
        draw.text((36, my), f"{i}. {step}", fill=INK, font=step_font)
        my += 36

    out = ASSETS / out_name
    img.save(out, "JPEG", quality=90, optimize=True)
    print(f"wrote {out.name}")


def main():
    products = json.loads(CATALOG.read_text(encoding="utf-8"))
    for item in products:
        asset = item["asset"]
        family = family_from_asset(asset)
        if family not in FAMILY_CHARTS:
            family = "knee"
        stem = asset.replace(".jpg", "")
        draw_chart(f"{stem}-sizechart.jpg", family, item["title"])


if __name__ == "__main__":
    main()
