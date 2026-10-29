#!/usr/bin/env python3
"""DEPRECATED graphic compositor.

Catalog galleries are now photorealistic Amazon-style AI product photos:
  hero + g02-kit + g03 side + g04 rear + g05 front + g06 remote + g07 detail + g08 lifestyle + g09 alt.

This script used to paste the same hero onto text banners (DRIFT WITH CONFIDENCE /
TWO TIRE TYPES). Do not run it unless you pass --force-graphics, which will
overwrite those photorealistic files.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

KIT_REF = ASSETS / "tc-mp-kit-accessories-ref.jpg"
KIT_STRIP_TOP_RATIO = 0.52
_kit_strip_rgba: Image.Image | None = None

SHOTS = [
    ("g02-kit", "COMPLETE KIT", "Remote · Battery · USB · Cones · Spare tyres"),
    ("g03-drift", "DRIFT WITH CONFIDENCE", "2.4 GHz · USB charge · LED lights"),
    ("g04-tires", "TWO TIRE TYPES", "Drift slicks + grip tread sets included"),
    ("g05-leds", "BRIGHT DETAILS", "Front & rear LEDs for day or night"),
    ("g06-remote", "PRECISION REMOTE", "Instant steering response"),
    ("g07-details", "ENGINEERED DETAILS", "Shocks · tyres · chassis · spoiler"),
    ("g08-action", "OWN EVERY CORNER", "High-grip handling for smooth floors"),
    ("g09-complete", "READY TO RUN", "Everything in the box — just charge & play"),
]


def hero_path(idx: int) -> Path:
    if idx == 10:
        return ASSETS / "tc-mp-shop-10.jpg"
    if idx < 10:
        return ASSETS / f"tc-mp-shop-0{idx}.jpg"
    return ASSETS / f"tc-mp-shop-{idx}.jpg"


def prefix(idx: int) -> str:
    if idx == 10:
        return "tc-mp-shop-10"
    if idx < 10:
        return f"tc-mp-shop-0{idx}"
    return f"tc-mp-shop-{idx}"


def discover_products() -> list[tuple[int, str]]:
    found: list[tuple[int, str]] = []
    for idx in range(1, 33):
        if hero_path(idx).exists():
            found.append((idx, f"Catalog product {idx:02d}"))
    if not found:
        raise SystemExit("No tc-mp-shop-NN.jpg hero files in assets/")
    return found


def kit_accessories_strip() -> Image.Image:
    global _kit_strip_rgba
    if _kit_strip_rgba is not None:
        return _kit_strip_rgba
    if not KIT_REF.exists():
        raise SystemExit(f"Missing kit reference: {KIT_REF}")
    ref = Image.open(KIT_REF).convert("RGBA")
    w, h = ref.size
    top = int(h * KIT_STRIP_TOP_RATIO)
    _kit_strip_rgba = ref.crop((0, top, w, h))
    return _kit_strip_rgba


def render_kit_composite(hero: Image.Image) -> Image.Image:
    """FLYTEK-style slide 2: real product on top, shared RTR accessories below."""
    size = 1024
    split_y = 548
    base = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    car = fit_product(hero, (12, 8, size - 12, split_y - 8))
    base = Image.alpha_composite(base, car)
    strip = kit_accessories_strip()
    strip_h = size - split_y
    fitted = ImageOps.contain(strip, (size - 24, strip_h - 8), Image.Resampling.LANCZOS)
    ox = (size - fitted.width) // 2
    oy = split_y + (strip_h - fitted.height) // 2
    base.alpha_composite(fitted, (ox, oy))
    return base.convert("RGB")


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in (
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        p = Path(candidate)
        if p.exists():
            return ImageFont.truetype(str(p), size=size)
    return ImageFont.load_default()


def fit_product(hero: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    fitted = ImageOps.contain(hero, (w, h), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    ox = x0 + (w - fitted.width) // 2
    oy = y0 + (h - fitted.height) // 2
    layer.paste(fitted, (ox, oy))
    return layer


def draw_header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, dark: bool) -> None:
    font_t = load_font(52)
    font_s = load_font(26)
    fill = (255, 255, 255) if dark else (15, 23, 42)
    draw.text((48, 40), title, font=font_t, fill=fill)
    draw.text((48, 108), subtitle, font=font_s, fill=fill if dark else (51, 65, 85))


def render_shot(hero: Image.Image, idx: int, slug: str, title: str, subtitle: str) -> Image.Image:
    if slug == "g02-kit":
        return render_kit_composite(hero)

    if slug == "g03-drift":
        base = Image.new("RGB", (1024, 1024), (10, 14, 28))
        car = fit_product(hero, (80, 280, 960, 920))
        car = car.rotate(-6, resample=Image.Resampling.BICUBIC, expand=True)
        layer = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
        layer.paste(car, (20, 180), car)
        glow = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(glow)
        for x in range(120, 900, 40):
            gdraw.line([(x, 780), (x + 80, 820)], fill=(0, 200, 255, 90), width=6)
        base = Image.alpha_composite(base.convert("RGBA"), glow).convert("RGB")
        base = Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")
        draw = ImageDraw.Draw(base)
        draw.text((48, 48), "DRIFT WITH CONFIDENCE", font=load_font(48), fill=(255, 255, 255))
        draw.text((48, 118), subtitle.upper(), font=load_font(24), fill=(148, 163, 184))
        return base

    if slug == "g04-tires":
        base = Image.new("RGB", (1024, 1024), (241, 245, 249))
        draw = ImageDraw.Draw(base)
        draw_header(draw, title, subtitle, dark=False)
        draw.line([(512, 180), (512, 980)], fill=(203, 213, 225), width=4)
        draw.text((140, 200), "DRIFT", font=load_font(34), fill=(15, 23, 42))
        draw.text((640, 200), "GRIP", font=load_font(34), fill=(15, 23, 42))
        left = fit_product(hero, (60, 280, 480, 760))
        right = fit_product(hero, (540, 280, 960, 760))
        base = Image.alpha_composite(base.convert("RGBA"), left).convert("RGB")
        base = Image.alpha_composite(base.convert("RGBA"), right).convert("RGB")
        return base

    if slug == "g05-leds":
        base = Image.new("RGB", (1024, 1024), (12, 18, 32))
        car = fit_product(hero, (140, 280, 900, 880))
        base = Image.alpha_composite(base.convert("RGBA"), car).convert("RGB")
        draw = ImageDraw.Draw(base)
        draw_header(draw, title, subtitle, dark=True)
        draw.ellipse((760, 520, 820, 580), fill=(255, 255, 200))
        draw.ellipse((200, 640, 260, 700), fill=(255, 80, 80))
        return base

    if slug == "g06-remote":
        base = Image.new("RGB", (1024, 1024), (15, 23, 42))
        draw = ImageDraw.Draw(base)
        draw_header(draw, title, subtitle, dark=True)
        draw.rounded_rectangle((120, 360, 420, 780), radius=28, fill=(30, 41, 59))
        draw.text((170, 520), "FLYTEK", font=load_font(36), fill=(56, 189, 248))
        car = fit_product(hero, (460, 300, 980, 900))
        base = Image.alpha_composite(base.convert("RGBA"), car).convert("RGB")
        return base.convert("RGB")

    if slug == "g07-details":
        base = Image.new("RGB", (1024, 1024), (248, 250, 252))
        car = fit_product(hero, (260, 260, 860, 860))
        base = Image.alpha_composite(base.convert("RGBA"), car).convert("RGB")
        draw = ImageDraw.Draw(base)
        draw_header(draw, title, subtitle, dark=False)
        for box in ((60, 260, 200, 380), (820, 260, 960, 380), (60, 700, 200, 820), (820, 700, 960, 820)):
            draw.rounded_rectangle(box, radius=12, outline=(148, 163, 184), width=3)
        return base

    if slug == "g08-action":
        base = Image.new("RGB", (1024, 1024), (17, 24, 39))
        car = fit_product(hero, (100, 320, 940, 920))
        car = car.rotate(-8, resample=Image.Resampling.BICUBIC, expand=True)
        canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
        canvas.paste(car, (40, 120), car)
        base = Image.alpha_composite(base.convert("RGBA"), canvas).convert("RGB")
        draw = ImageDraw.Draw(base)
        draw_header(draw, title, subtitle, dark=True)
        return base

    # g09-complete
    base = Image.new("RGB", (1024, 1024), (255, 255, 255))
    draw = ImageDraw.Draw(base)
    draw.text((48, 36), title, font=load_font(44), fill=(15, 23, 42))
    draw.text((48, 96), subtitle, font=load_font(22), fill=(71, 85, 105))
    car = fit_product(hero, (48, 200, 976, 980))
    base = Image.alpha_composite(base.convert("RGBA"), car).convert("RGB")
    return base


def main() -> None:
    import sys

    if "--force-graphics" not in sys.argv:
        raise SystemExit(
            "Refusing to overwrite Amazon-style galleries. "
            "Pass --force-graphics only if you intentionally want the old text banners back."
        )

    manifest: list[str] = []
    products = discover_products()
    for idx, _name in products:
        hero_file = hero_path(idx)
        if not hero_file.exists():
            raise SystemExit(f"Missing hero: {hero_file}")
        hero = Image.open(hero_file).convert("RGBA")
        pfx = prefix(idx)
        for slug, title, subtitle in SHOTS:
            out_name = f"{pfx}-{slug}.jpg"
            out_path = ASSETS / out_name
            img = render_shot(hero, idx, slug, title, subtitle)
            img.save(out_path, "JPEG", quality=92, optimize=True)
            manifest.append(out_name)
            print("wrote", out_name)
    (ASSETS / "tc-mp-gallery-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
