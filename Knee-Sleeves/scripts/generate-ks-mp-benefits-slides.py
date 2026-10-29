"""Generate FLEXORA PDP benefits slides (slot 2) per product family."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "assets"
SIZE = (823, 823)
BG = (248, 249, 251)
ACCENT = (255, 103, 12)
INK = (17, 17, 17)
MUTED = (107, 114, 128)

FAMILIES = {
    "knee": {
        "title": "Knee support benefits",
        "items": ["Patella stability", "Compression warmth", "Squat & lunge ready", "Breathable knit"],
    },
    "wrist": {
        "title": "Wrist wrap benefits",
        "items": ["Lift stability", "Thumb loop support", "Heavy press ready", "Sweat-wicking fabric"],
    },
    "ankle": {
        "title": "Ankle brace benefits",
        "items": ["Sprain protection", "Lace-up hold", "Court & trail ready", "Light daily wear"],
    },
    "elbow": {
        "title": "Elbow sleeve benefits",
        "items": ["Joint compression", "Press & pull support", "Flexible stretch", "Recovery friendly"],
    },
    "calf": {
        "title": "Calf sleeve benefits",
        "items": ["Muscle compression", "Run & ride support", "Moisture control", "Second-skin fit"],
    },
    "arm": {
        "title": "Arm band benefits",
        "items": ["Training pump", "Blood flow focus", "Durable elastic", "Gym & field ready"],
    },
    "cap": {
        "title": "Shoulder brace benefits",
        "items": ["Posture support", "Strap adjustability", "Daily wear comfort", "Stability first"],
    },
    "socks": {
        "title": "Gym sock benefits",
        "items": ["Half terry cushion", "Grip training", "Breathable knit", "All-session comfort"],
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


def draw_slide(family: str, meta: dict) -> None:
    img = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(img)
    title_font = load_font(34, bold=True)
    item_font = load_font(26, bold=True)
    sub_font = load_font(20)

    draw.rounded_rectangle((40, 40, SIZE[0] - 40, SIZE[1] - 40), radius=28, outline=(229, 231, 235), width=2, fill=(255, 255, 255))

    draw.text((72, 72), meta["title"], fill=INK, font=title_font)
    draw.line((72, 130, SIZE[0] - 72, 130), fill=ACCENT, width=4)

    y = 170
    for i, label in enumerate(meta["items"], start=1):
        cy = y + 36
        draw.ellipse((72, cy - 28, 128, cy + 28), fill=ACCENT)
        draw.text((88, cy - 18), str(i), fill=(255, 255, 255), font=item_font)
        draw.text((150, cy - 22), label, fill=INK, font=item_font)
        draw.text((150, cy + 8), "FLEXORA support gear", fill=MUTED, font=sub_font)
        y += 130

    draw.text((72, SIZE[1] - 96), "FLEXORA", fill=ACCENT, font=load_font(28, bold=True))
    draw.text((72, SIZE[1] - 62), "Engineered for training & recovery", fill=MUTED, font=sub_font)

    out = ROOT / f"ks-mp-p-{family}-benefits.jpg"
    img.save(out, "JPEG", quality=88, optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB)")


def main():
    for family, meta in FAMILIES.items():
        draw_slide(family, meta)


if __name__ == "__main__":
    main()
