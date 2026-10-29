#!/usr/bin/env python3
"""Generate 8 marketing gallery JPEGs per drift catalog product (g02–g09)."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SIZE = 1400

SHOTS = [
    ("g02-kit", "COMPLETE DRIFT SET", "READY TO RUN", "#f5f5f5", "#111111"),
    ("g03-drift", "DRIFT WITH CONFIDENCE", "UP TO 20 KM/H", "#0a0a12", "#ffffff"),
    ("g04-tires", "TWO TIRE TYPES", "RACING & DRIFT TYRES", "#eef2f7", "#111111"),
    ("g05-leds", "Bright Details Day or Night", "FRONT & REAR LED LIGHTS", "#111111", "#ffffff"),
    ("g06-remote", "PRECISION REMOTE CONTROL", "SMOOTH STEERING · INSTANT RESPONSE", "#0d0d0d", "#ffffff"),
    ("g07-details", "DETAILS THAT MAKE THE DIFFERENCE", "CHASSIS · WHEELS · SPOILER", "#f0f0f0", "#111111"),
    ("g08-action", "TAKE CONTROL OF EVERY CORNER", "4WD DRIFT READY", "#050508", "#ffffff"),
    ("g09-complete", "EVERYTHING IN THE BOX", "REMOTE · BATTERY · USB · SPARE WHEELS", "#ffffff", "#111111"),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates += [
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/segoeuib.ttf",
        ]
    else:
        candidates += [
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
        ]
    for path in candidates:
        if os.path.isfile(path):
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def hero_path(index: int) -> Path | None:
    for name in (
        f"tc-mp-drift-{index:02d}.jpg",
        f"tc-mp-drift-0{index}.jpg" if index < 10 else "tc-mp-drift-10.jpg",
        f"tc-mp-shop-{index:02d}.jpg",
        f"tc-mp-shop-0{index}.jpg" if index < 10 else "tc-mp-shop-10.jpg",
    ):
        p = ASSETS / name
        if p.is_file():
            return p
    return None


def paste_product(canvas: Image.Image, hero: Path, box: tuple[int, int, int, int]) -> None:
    try:
        car = Image.open(hero).convert("RGBA")
    except OSError:
        return
    car = ImageOps.contain(car, (box[2] - box[0], box[3] - box[1]))
    x = box[0] + (box[2] - box[0] - car.width) // 2
    y = box[3] - car.height - 40
    canvas.paste(car, (x, y), car if car.mode == "RGBA" else None)


def render_shot(index: int, shot_key: str, title: str, subtitle: str, bg: str, fg: str) -> Image.Image:
    img = Image.new("RGB", (SIZE, SIZE), bg)
    draw = ImageDraw.Draw(img)
    title_font = load_font(56, bold=True)
    sub_font = load_font(32, bold=False)

    draw.text((SIZE // 2, 120), title, fill=fg, font=title_font, anchor="mm")
    draw.text((SIZE // 2, 200), subtitle, fill=fg, font=sub_font, anchor="mm")

    hero = hero_path(index)
    if hero:
        paste_product(img, hero, (120, 280, SIZE - 120, SIZE - 80))

    if shot_key == "g03-drift":
        draw.rounded_rectangle((SIZE // 2 - 140, 240, SIZE // 2 + 140, 310), radius=24, fill="#c41e3a")
        draw.text((SIZE // 2, 275), "25% OFF", fill="#fff", font=load_font(36, True), anchor="mm")

    if shot_key == "g05-leds":
        draw.ellipse((180, 520, 380, 720), outline="#ffffff", width=4)
        draw.text((280, 840), "FRONT LED", fill=fg, font=sub_font, anchor="mm")

    if shot_key == "g09-complete":
        labels = ["REMOTE", "BATTERY", "USB", "WHEELS"]
        for i, label in enumerate(labels):
            cx = 200 + i * 280
            draw.ellipse((cx - 50, SIZE - 220, cx + 50, SIZE - 120), outline=fg, width=3)
            draw.text((cx, SIZE - 70), label, fill=fg, font=load_font(22, True), anchor="mm")

    return img


def main() -> None:
    import sys

    if "--force-graphics" not in sys.argv:
        raise SystemExit(
            "Refusing to overwrite Amazon-style drift galleries. "
            "Pass --force-graphics only if you intentionally want the old text banners back."
        )

    ASSETS.mkdir(parents=True, exist_ok=True)
    count = 0
    for idx in range(1, 11):
        if idx < 10:
            pfx = f"tc-mp-drift-0{idx}"
        else:
            pfx = "tc-mp-drift-10"
        for shot_key, title, subtitle, bg, fg in SHOTS:
            out = ASSETS / f"{pfx}-{shot_key}.jpg"
            img = render_shot(idx, shot_key, title, subtitle, bg, fg)
            img.save(out, "JPEG", quality=88, optimize=True)
            count += 1
            print(out.name)
    print(f"Wrote {count} gallery images.")


if __name__ == "__main__":
    main()
