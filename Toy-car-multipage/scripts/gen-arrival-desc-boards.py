#!/usr/bin/env python3
"""Build 6 Product Description infographics per arrival product from that product's hero."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
W, H = 1920, 1080
DARK = (18, 18, 18)
PANEL = (28, 28, 28)
WHITE = (255, 255, 255)
MUTED = (200, 200, 200)
ACCENT = (80, 80, 80)

PRODUCTS = {
    1: {
        "name": "Ironclad RC Battleship",
        "kind": "battleship",
        "bullets": [
            "Full-function RC ship: forward, reverse, and rudder steering",
            "2.4GHz remote for lag-free control on the water",
            "Ready-to-run hobby hull with deck detail",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "RTR", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Pond ready", "Calm water play"),
            ("RTR kit", "Charge and launch"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Launch",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Sail")],
    },
    2: {
        "name": "Velocity RC Speedboat",
        "kind": "speedboat",
        "bullets": [
            "Full-function RC boat: throttle, reverse, and steering",
            "2.4GHz remote for lag-free control",
            "Planing hull built for ponds and pools",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "RTR", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Speed hull", "Quick on water"),
            ("RTR kit", "Charge and launch"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Launch",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Race")],
    },
    3: {
        "name": "SkyRunner RC Airplane",
        "kind": "airplane",
        "bullets": [
            "Beginner RC airplane with stable trainer layout",
            "2.4GHz remote for lag-free control",
            "Twin-prop hobby airframe, ready to fly",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "RTR", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Trainer wing", "Stable first flights"),
            ("RTR kit", "Charge and fly"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Fly")],
    },
    4: {
        "name": "Stealth Strike Fighter Jet",
        "kind": "jet",
        "bullets": [
            "4-channel RC fighter jet with EPP foam body",
            "2.4GHz remote for lag-free control",
            "Hobby-grade jet styling for outdoor flights",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "4CH", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("EPP foam", "Tough airframe"),
            ("4CH control", "Bank, pitch, throttle"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Fly")],
    },
    5: {
        "name": "Thunder RC Helicopter",
        "kind": "helicopter",
        "bullets": [
            "Gyro-stabilized RC helicopter for indoor play",
            "2.4GHz remote for lag-free control",
            "Hobby heli with responsive collective feel",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "Gyro", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Gyro assist", "Easier hovering"),
            ("RTR kit", "Charge and fly"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Hover")],
    },
    6: {
        "name": "Deep Dive RC Submarine",
        "kind": "submarine",
        "bullets": [
            "Pool-ready RC submarine with dive control",
            "2.4GHz remote for lag-free control",
            "LED-ready hobby sub for indoor water play",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "Pool", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Dive ready", "Pool and pond"),
            ("RTR kit", "Charge and launch"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Dive",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Dive")],
    },
    7: {
        "name": "Harbor Luxe RC Yacht",
        "kind": "yacht",
        "bullets": [
            "Full-function RC yacht: throttle and rudder steering",
            "2.4GHz remote for lag-free control",
            "Smooth-cruise hobby hull for calm water",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "RTR", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Cruise hull", "Calm-water play"),
            ("RTR kit", "Charge and launch"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Launch",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Cruise")],
    },
    8: {
        "name": "Coast Guard RC Seaplane",
        "kind": "seaplane",
        "bullets": [
            "RC seaplane built for water takeoff and landing",
            "2.4GHz remote for lag-free control",
            "Hobby airframe with float-style play",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "Water", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Water takeoff", "Pond and pool"),
            ("RTR kit", "Charge and fly"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Fly")],
    },
    9: {
        "name": "Cobra Attack Helicopter",
        "kind": "military heli",
        "bullets": [
            "6-channel hobby RC attack helicopter",
            "2.4GHz remote for lag-free control",
            "Military-style airframe with gyro assist",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "6CH", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("6CH control", "Hover and bank"),
            ("Gyro assist", "Stable flights"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Hover")],
    },
    10: {
        "name": "Hercules RC Cargo Plane",
        "kind": "cargo plane",
        "bullets": [
            "Large-wingspan RC cargo plane, ready to fly",
            "2.4GHz remote for lag-free control",
            "Hobby transport styling for outdoor flights",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "RTR", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Wide wing", "Stable glides"),
            ("RTR kit", "Charge and fly"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Fly")],
    },
    11: {
        "name": "WindRider RC Sailboat",
        "kind": "sailboat",
        "bullets": [
            "Full-function RC sailboat: rudder steering on the water",
            "2.4GHz remote for lag-free control",
            "Pond-ready hull with working sails and mast",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "Pond", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Pond ready", "Calm water sailing"),
            ("Working sails", "Rudder steering"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Sail",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Sail")],
    },
    12: {
        "name": "AeroSnap RC Drone",
        "kind": "drone",
        "bullets": [
            "Quadcopter RC drone with stunt-flip play",
            "2.4GHz remote for lag-free control",
            "Indoor-friendly hobby drone, ready to fly",
            "Rechargeable battery with USB charging",
            "Complete starter kit, ready to play",
        ],
        "chips": ["Age 8+", "2.4GHz", "Flips", "USB Charge"],
        "cards": [
            ("2.4GHz Remote", "Lag-free control"),
            ("Stunt flips", "Indoor fun"),
            ("RTR kit", "Charge and fly"),
            ("USB Charge", "On a single pack"),
        ],
        "ready": "Ready to Fly",
        "steps": [("01", "Charge"), ("02", "Power On"), ("03", "Fly")],
    },
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in names:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def pfx(idx: int) -> str:
    return f"tc-mp-arrival-{idx:02d}"


def hero(idx: int) -> Image.Image:
    img = Image.open(ASSETS / f"{pfx(idx)}.jpg").convert("RGB")
    return img


def fit_cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))


def rounded(img: Image.Image, radius: int = 24) -> Image.Image:
    img = img.convert("RGBA")
    mask = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, img.size[0], img.size[1]), radius=radius, fill=255)
    img.putalpha(mask)
    return img


def save(img: Image.Image, name: str) -> None:
    path = ASSETS / name
    img.convert("RGB").save(path, "JPEG", quality=92, optimize=True)
    print("wrote", path.name)


def board() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGB", (W, H), DARK)
    return im, ImageDraw.Draw(im)


def d01(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    left = fit_cover(photo, (960, H))
    im.paste(left, (0, 0))
    shade = Image.new("RGB", (80, H), DARK)
    im.paste(shade, (920, 0))
    x = 1040
    dr.text((x, 120), "About this item", font=font(64, True), fill=WHITE)
    y = 230
    for line in meta["bullets"]:
        dr.ellipse((x, y + 8, x + 22, y + 30), outline=WHITE, width=2)
        dr.line((x + 6, y + 20, x + 10, y + 26), fill=WHITE, width=2)
        dr.line((x + 10, y + 26, x + 17, y + 13), fill=WHITE, width=2)
        dr.text((x + 34, y), line, font=font(28), fill=WHITE)
        y += 78
    chip_x = x
    chip_y = 900
    for chip in meta["chips"]:
        tw = dr.textlength(chip, font=font(22, True))
        pad = 22
        dr.rounded_rectangle((chip_x, chip_y, chip_x + tw + pad * 2, chip_y + 48), 24, outline=ACCENT, width=2)
        dr.text((chip_x + pad, chip_y + 8), chip, font=font(22, True), fill=WHITE)
        chip_x += int(tw + pad * 2 + 18)
    save(im, f"{pfx(idx)}-d01-about.jpg")


def d02(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    title = "What's in the box"
    tw = dr.textlength(title, font=font(64, True))
    dr.text(((W - tw) / 2, 48), title, font=font(64, True), fill=WHITE)
    mid = rounded(fit_cover(photo, (920, 720)), 28)
    im.paste(mid, ((W - 920) // 2, 180), mid)
    dr.text(((W - dr.textlength(meta["name"], font=font(26, True))) / 2, 920), meta["name"], font=font(26, True), fill=WHITE)
    labels = [("2.4GHz Remote", 80, 220), ("Battery Pack", 80, 520), ("USB Cable", 80, 800), ("Ready to run", 1600, 220)]
    for text, x, y in labels:
        dr.text((x, y), text, font=font(26, True), fill=MUTED)
    save(im, f"{pfx(idx)}-d02-box.jpg")


def d03(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    dr.text((80, 48), "About this item", font=font(56, True), fill=WHITE)
    gap = 28
    card_w = (W - 80 * 2 - gap * 3) // 4
    card_h = 820
    y0 = 160
    for i, (title, sub) in enumerate(meta["cards"]):
        x = 80 + i * (card_w + gap)
        dr.rounded_rectangle((x, y0, x + card_w, y0 + card_h), 28, fill=PANEL)
        crop = rounded(fit_cover(photo, (card_w - 40, 560)), 20)
        im.paste(crop, (x + 20, y0 + 24), crop)
        dr.text((x + 28, y0 + 620), title, font=font(28, True), fill=WHITE)
        dr.text((x + 28, y0 + 670), sub, font=font(22), fill=MUTED)
    save(im, f"{pfx(idx)}-d03-features.jpg")


def d04(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    title = "Battery & Charging"
    tw = dr.textlength(title, font=font(64, True))
    dr.text(((W - tw) / 2, 48), title, font=font(64, True), fill=WHITE)
    left = rounded(fit_cover(photo, (1100, 820)), 28)
    im.paste(left, (60, 160), left)
    callouts = ["2.5 Hours Play", "USB Charging", "Fast Charge"]
    y = 280
    for text in callouts:
        dr.text((1240, y), text, font=font(32, True), fill=WHITE)
        y += 120
    foot = "Charge. Play. Repeat."
    fw = dr.textlength(foot, font=font(36, True))
    dr.text(((W - fw) / 2, 1000), foot, font=font(36, True), fill=WHITE)
    save(im, f"{pfx(idx)}-d04-battery.jpg")


def d05(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    title = "Precision Engineering"
    tw = dr.textlength(title, font=font(56, True))
    dr.text(((W - tw) / 2, 36), title, font=font(56, True), fill=WHITE)
    labels = [
        ("2.4GHz Control", "Lag-free steering"),
        ("Hobby Grade", "Ready-to-run kit"),
        ("USB Charge", "Fast between sessions"),
        ("Stable Play", "Indoor and outdoor"),
        ("Complete Kit", "Remote, battery, USB"),
        ("Age 8+", "Family RC fun"),
    ]
    gap = 24
    cell_w = (W - 80 * 2 - gap * 2) // 3
    cell_h = 430
    for i, (title, sub) in enumerate(labels):
        col, row = i % 3, i // 3
        x = 80 + col * (cell_w + gap)
        y = 140 + row * (cell_h + gap)
        dr.rounded_rectangle((x, y, x + cell_w, y + cell_h), 22, fill=PANEL)
        crop = rounded(fit_cover(photo, (cell_w - 24, 280)), 16)
        im.paste(crop, (x + 12, y + 12), crop)
        dr.text((x + 24, y + 310), title, font=font(26, True), fill=WHITE)
        dr.text((x + 24, y + 352), sub, font=font(20), fill=MUTED)
    save(im, f"{pfx(idx)}-d05-precision.jpg")


def d06(idx: int, meta: dict, photo: Image.Image) -> None:
    im, dr = board()
    title = meta["ready"]
    tw = dr.textlength(title, font=font(56, True))
    dr.text(((W - tw) / 2, 40), title, font=font(56, True), fill=WHITE)
    gap = 28
    cell_w = (W - 80 * 2 - gap * 2) // 3
    for i, (num, label) in enumerate(meta["steps"]):
        x = 80 + i * (cell_w + gap)
        dr.text((x + cell_w / 2, 140), num, font=font(48, True), fill=WHITE, anchor="ma")
        dr.text((x + cell_w / 2, 200), label, font=font(28), fill=MUTED, anchor="ma")
        crop = rounded(fit_cover(photo, (cell_w, 680)), 24)
        im.paste(crop, (x, 250), crop)
        chip = meta["chips"][i] if i < len(meta["chips"]) else meta["chips"][-1]
        cw = dr.textlength(chip, font=font(22, True))
        bx = x + (cell_w - cw) / 2 - 22
        dr.rounded_rectangle((bx, 960, bx + cw + 44, 1014), 24, fill=(40, 40, 40))
        dr.text((x + cell_w / 2, 987), chip, font=font(22, True), fill=WHITE, anchor="mm")
    save(im, f"{pfx(idx)}-d06-ready.jpg")


def main() -> None:
    for idx, meta in PRODUCTS.items():
        photo = hero(idx)
        d01(idx, meta, photo)
        d02(idx, meta, photo)
        d03(idx, meta, photo)
        d04(idx, meta, photo)
        d05(idx, meta, photo)
        d06(idx, meta, photo)
    print("done")


if __name__ == "__main__":
    main()
