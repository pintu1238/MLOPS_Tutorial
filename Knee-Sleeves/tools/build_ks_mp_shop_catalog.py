#!/usr/bin/env python3
"""Generate FLEXORA shop catalog: 8 categories x 10 unique product photos + templates."""
from __future__ import annotations

import json
import random
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
TEMPLATES = ROOT / "templates"
SHOP_TEMPLATE = TEMPLATES / "collection.ks-mp-shop-155459.json"

PRODUCT_BASE = "/products/flytek-curve-rc-drift-car-4x4"

CATEGORY_META = {
    "knee-support": {
        "slug": "knee",
        "view": "ks-mp-knee-155459",
        "cdn": "ks-mp-hero-01-knee.jpg",
        "pool": [
            "ks-mp-bs-01-knee-navy.jpg",
            "ks-mp-hero-01-knee.jpg",
            "ks-mp-cat-knee-v2.jpg",
            "ks-mp-zone-knee-sleeves.jpg",
            "ks-mp-zone-knee-pads.jpg",
            "ks-mp-cat-knee.jpg",
        ],
    },
    "wrist-support": {
        "slug": "wrist",
        "view": "ks-mp-wrist-155459",
        "cdn": "ks-mp-hero-02-wrist.jpg",
        "pool": [
            "ks-mp-bs-02-wrist-black-blue.jpg",
            "ks-mp-hero-02-wrist.jpg",
            "ks-mp-cat-wrist.jpg",
            "ks-mp-zone-wrist.jpg",
        ],
    },
    "calf-sleeve": {
        "slug": "calf",
        "view": "ks-mp-calf-155459",
        "cdn": "ks-mp-cat-calf.jpg",
        "pool": ["ks-mp-cat-calf.jpg", "ks-mp-zone-calf.jpg", "ks-mp-bs-01-knee-navy.jpg"],
    },
    "half-terry-socks": {
        "slug": "socks",
        "view": "ks-mp-socks-155459",
        "cdn": "ks-mp-cat-foot.jpg",
        "pool": ["ks-mp-cat-foot.jpg", "ks-mp-cat-stocking-v2.jpg", "ks-mp-cat-stocking.jpg"],
    },
    "shoulder-support": {
        "slug": "cap",
        "view": "ks-mp-cap-155459",
        "cdn": "ks-mp-cat-neck.jpg",
        "pool": ["ks-mp-cat-neck.jpg", "ks-mp-zone-shoulder.jpg"],
    },
    "ankle-support": {
        "slug": "ankle",
        "view": "ks-mp-ankle-155459",
        "cdn": "ks-mp-hero-05-ankle.jpg",
        "pool": ["ks-mp-hero-05-ankle.jpg", "ks-mp-cat-foot.jpg", "ks-mp-zone-compression.jpg"],
    },
    "elbow-support": {
        "slug": "elbow",
        "view": "ks-mp-elbow-155459",
        "cdn": "ks-mp-hero-04-elbow.jpg",
        "pool": ["ks-mp-hero-04-elbow.jpg", "ks-mp-cat-elbow.jpg", "ks-mp-zone-elbow.jpg"],
    },
    "full-arm-sleeve": {
        "slug": "arm",
        "view": "ks-mp-arm-155459",
        "cdn": "ks-mp-hero-03-arm.jpg",
        "pool": [
            "ks-mp-hero-03-arm.jpg",
            "ks-mp-bs-03-sleeve-purple.jpg",
            "ks-mp-bs-04-hand-yellow.jpg",
            "ks-mp-zone-compression.jpg",
        ],
    },
}

ACCENTS = [
    (255, 77, 20),
    (37, 99, 235),
    (20, 184, 166),
    (245, 158, 11),
    (100, 116, 139),
    (99, 102, 241),
    (251, 113, 133),
    (56, 189, 248),
    (234, 88, 12),
    (16, 185, 129),
]


def square_photo(path: Path, size: int = 720) -> Image.Image:
    img = Image.open(path).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    return img.resize((size, size), Image.Resampling.LANCZOS)


def hue_shift(img: Image.Image, amount: int) -> Image.Image:
    hsv = img.convert("HSV")
    h, s, v = hsv.split()
    h = h.point(lambda p: (p + amount) % 256)
    return Image.merge("HSV", (h, s, v)).convert("RGB")


def unique_photo(source: Path, cat_index: int, product_index: int) -> Image.Image:
    size = 720
    img = square_photo(source, size)
    n = product_index

    crop = 0.03 + (n % 7) * 0.012
    dx = int(size * crop)
    dy = int(size * crop * ((n % 3) + 1) / 2)
    ox = (n * 11) % max(dx, 1)
    oy = (n * 7) % max(dy, 1)
    img = img.crop((ox, oy, size - dx + ox, size - dy + oy)).resize((size, size), Image.Resampling.LANCZOS)

    if n % 2 == 0:
        img = ImageOps.mirror(img)
    if n % 5 == 0:
        img = ImageOps.flip(img)
    if n % 4 == 0:
        img = img.rotate(90 * ((n % 3) - 1), expand=False)

    img = hue_shift(img, (cat_index * 18 + n * 14) % 256)
    img = ImageEnhance.Brightness(img).enhance(0.82 + (n % 6) * 0.05)
    img = ImageEnhance.Contrast(img).enhance(0.95 + (n % 5) * 0.06)
    img = ImageEnhance.Color(img).enhance(0.85 + (n % 4) * 0.08)

    if n % 3 == 1:
        img = img.filter(ImageFilter.SMOOTH_MORE)
    return img


CATEGORIES = [
    (
        "knee-support",
        "Knee Support",
        [
            ("FLEXORA Pro Knee Sleeves", "Black · Grey · Lime gym knit", "Knee", "Knit", "Pair"),
            ("FLEXORA Open Patella Brace", "Black · Red · Daily support", "Knee", "Open", "Single"),
            ("FLEXORA Hinged Knee Support", "Black · Blue · ACL recovery", "Knee", "Hinged", "Single"),
            ("FLEXORA Neoprene Knee Wrap", "Black · Orange · Powerlifting", "Knee", "Wrap", "Single"),
            ("FLEXORA Dual Strap Knee Brace", "Navy · Lime · Adjustable", "Knee", "Dual", "Pair"),
            ("FLEXORA 7mm Power Knee Sleeves", "Black · Red · Heavy lifts", "Knee", "7mm", "Pair"),
            ("FLEXORA Hard Cap Knee Pads", "Black · White · Neon sport", "Knee", "Pad", "Pair"),
            ("FLEXORA Copper Knee Sleeve", "Black · Copper · Recovery", "Knee", "Copper", "Single"),
            ("FLEXORA Patella Sports Band", "Black · Lime · Jump support", "Knee", "Band", "Single"),
            ("FLEXORA Honeycomb Knee Pads", "Black · Teal · Youth sport", "Knee", "Honey", "Pair"),
        ],
    ),
    (
        "wrist-support",
        "Wrist Support",
        [
            ("FLEXORA Striped Wrist Wrap", "Black · Grey · Palm support", "Wrist", "Wrap", "Single"),
            ("FLEXORA Thumb Loop Wrap", "Black · Red · Lifting", "Wrist", "Loop", "Single"),
            ("FLEXORA Splint Wrist Brace", "Black · Blue · Sprain", "Wrist", "Splint", "Single"),
            ("FLEXORA Compression Wrist Sleeve", "Navy · Lime · Tennis", "Wrist", "Sleeve", "Pair"),
            ("FLEXORA Carpal Tunnel Brace", "Grey · Lime · Night", "Wrist", "Night", "Single"),
            ("FLEXORA Elastic Wrist Band", "Black · Lime · Yoga", "Wrist", "Band", "Pair"),
            ("FLEXORA Weightlifting Wrist Wraps", "Black · Red · Heavy lifts", "Wrist", "Lift", "Pair"),
            ("FLEXORA Neoprene Wrist Wrap", "Black · Orange · Court", "Wrist", "Neoprene", "Pair"),
            ("FLEXORA Skate Wrist Guard", "Black · White · Neon", "Wrist", "Guard", "Pair"),
            ("FLEXORA Gel Wrist Cushion", "Charcoal · Copper · Desk", "Wrist", "Gel", "Single"),
        ],
    ),
    (
        "calf-sleeve",
        "Calf Sleeve",
        [
            ("FLEXORA Calf Compression Sleeve", "Black · Grey · Lime run", "Calf", "Knit", "Pair"),
            ("FLEXORA Shin Splint Calf Wrap", "Black · Red · Marathon", "Calf", "Shin", "Single"),
            ("FLEXORA UV Calf Sleeve", "Navy · White · Cricket", "Calf", "UV", "Pair"),
            ("FLEXORA Pro Calf Guard", "Black · White · Neon sport", "Calf", "Guard", "Pair"),
            ("FLEXORA Graduated Calf Sleeve", "Charcoal · Copper · Travel", "Calf", "Travel", "Pair"),
            ("FLEXORA XL Calf Compression", "Black · Orange · Wide calf", "Calf", "XL", "Pair"),
            ("FLEXORA Night Calf Sleeve", "Grey · Lime · Recovery", "Calf", "Night", "Pair"),
            ("FLEXORA Copper Calf Sleeve", "Charcoal · Copper · Walk", "Calf", "Copper", "Single"),
            ("FLEXORA Kids Calf Sleeve", "Black · Teal · Youth", "Calf", "Kids", "Pair"),
            ("FLEXORA Power Calf Sleeve", "Black · Red · Sprint", "Calf", "Power", "Pair"),
        ],
    ),
    (
        "half-terry-socks",
        "Half terry socks",
        [
            ("FLEXORA Half Terry Gym Socks", "Black · Grey · Lime cushion", "Socks", "Terry", "Pair"),
            ("FLEXORA Anti-Slip Yoga Socks", "Black · Lime · Grip studio", "Socks", "Grip", "Pair"),
            ("FLEXORA Running Ankle Socks", "Black · Red · Mesh run", "Socks", "Run", "Pair"),
            ("FLEXORA Compression Ankle Socks", "Charcoal · Copper · Arch", "Socks", "Arch", "Pair"),
            ("FLEXORA Cotton Terry Crew Socks", "Navy · Lime · Gym crew", "Socks", "Cotton", "Pair"),
            ("FLEXORA Sports Quarter Socks", "Black · Orange · Court", "Socks", "Sport", "Pair"),
            ("FLEXORA Diabetic Comfort Socks", "Grey · Lime · Seamless", "Socks", "Comfort", "Pair"),
            ("FLEXORA Striped Gym Socks", "Black · White · Red stripe", "Socks", "Stripe", "Pair"),
            ("FLEXORA Merino Hike Socks", "Black · Teal · Trail", "Socks", "Merino", "Pair"),
            ("FLEXORA Cushion Quarter Socks", "Navy · Lime · Training", "Socks", "Quarter", "Pair"),
        ],
    ),
    (
        "shoulder-support",
        "Shoulder Support",
        [
            ("FLEXORA Shoulder Stability Brace", "Black · Grey · Lime gym", "Shoulder", "Brace", "Single"),
            ("FLEXORA Rotator Cuff Support", "Black · Red · Recovery", "Shoulder", "Cuff", "Single"),
            ("FLEXORA Dual Strap Shoulder Wrap", "Black · Blue · Adjustable", "Shoulder", "Wrap", "Single"),
            ("FLEXORA Shoulder Immobilizer", "Black · Orange · Sling", "Shoulder", "Sling", "Single"),
            ("FLEXORA Compression Shoulder Sleeve", "Navy · Lime · Training", "Shoulder", "Sleeve", "Single"),
            ("FLEXORA Posture Shoulder Support", "Black · White · Desk", "Shoulder", "Posture", "Single"),
            ("FLEXORA AC Joint Shoulder Brace", "Charcoal · Copper · Impact", "Shoulder", "Pad", "Single"),
            ("FLEXORA Gym Shoulder Wrap", "Black · Lime · Lifting", "Shoulder", "Gym", "Single"),
            ("FLEXORA Dislocation Shoulder Brace", "Navy · Red · Stabilizer", "Shoulder", "Harness", "Single"),
            ("FLEXORA Thermal Shoulder Sleeve", "Black · Teal · Warmth", "Shoulder", "Thermal", "Single"),
        ],
    ),
    (
        "ankle-support",
        "Ankle Support",
        [
            ("FLEXORA Knit Ankle Sleeves", "Black · Grey · Lime run", "Ankle", "Knit", "Pair"),
            ("FLEXORA Lace-Up Ankle Brace", "Black · Red · Basketball", "Ankle", "Lace", "Single"),
            ("FLEXORA Stirrup Ankle Guard", "Black · Blue · Jump", "Ankle", "Stirrup", "Single"),
            ("FLEXORA Neoprene Ankle Wrap", "Black · Orange · Walk", "Ankle", "Wrap", "Single"),
            ("FLEXORA Figure-8 Ankle Strap", "Navy · Lime · Court", "Ankle", "Strap", "Single"),
            ("FLEXORA Rigid Ankle Stabilizer", "Black · Blue · Rehab", "Ankle", "Rigid", "Single"),
            ("FLEXORA Kids Ankle Sleeve", "Black · Teal · Youth", "Ankle", "Kids", "Pair"),
            ("FLEXORA Copper Ankle Support", "Charcoal · Copper · Daily", "Ankle", "Copper", "Single"),
            ("FLEXORA Night Ankle Splint", "Grey · Lime · Plantar", "Ankle", "Night", "Single"),
            ("FLEXORA Heel Protector Sleeve", "Black · Lime · Heel pain", "Ankle", "Heel", "Single"),
        ],
    ),
    (
        "elbow-support",
        "Elbow Support",
        [
            ("FLEXORA Knit Elbow Sleeves", "Black · Grey · Lime gym", "Elbow", "Knit", "Pair"),
            ("FLEXORA Tennis Elbow Strap", "Black · Lime · Racquet", "Elbow", "Strap", "Single"),
            ("FLEXORA Hinged Elbow Brace", "Black · Blue · Recovery", "Elbow", "Hinged", "Single"),
            ("FLEXORA Neoprene Elbow Wrap", "Black · Orange · Curl", "Elbow", "Wrap", "Single"),
            ("FLEXORA Sport Elbow Sleeve", "Navy · Red · Gym wear", "Elbow", "Sleeve", "Single"),
            ("FLEXORA Hard Cap Elbow Pads", "Black · White · Neon skate", "Elbow", "Pad", "Pair"),
            ("FLEXORA Copper Elbow Sleeve", "Charcoal · Copper · Daily", "Elbow", "Copper", "Pair"),
            ("FLEXORA Adjustable Elbow Guard", "Navy · Lime · Impact", "Elbow", "Guard", "Single"),
            ("FLEXORA Thermal Elbow Sleeve", "Black · Red · Winter", "Elbow", "Thermal", "Pair"),
            ("FLEXORA Honeycomb Elbow Pads", "Black · Teal · Youth", "Elbow", "Sport", "Pair"),
        ],
    ),
    (
        "full-arm-sleeve",
        "Full Arm Sleeve",
        [
            ("FLEXORA BFR Arm Training Bands", "Black · Red · Blood flow gym", "Arm", "BFR", "Pair"),
            ("FLEXORA UV Arm Sleeves", "Navy · White · Cricket", "Arm", "UV", "Pair"),
            ("FLEXORA Cooling Arm Sleeve", "Charcoal · Teal · Run", "Arm", "Cool", "Single"),
            ("FLEXORA Tattoo Cover Sleeve", "Black · Red · Events", "Arm", "Cover", "Pair"),
            ("FLEXORA Padded Arm Guard", "Black · White · Neon", "Arm", "Pad", "Pair"),
            ("FLEXORA Pro Shooter Sleeve", "Navy · Lime · Basketball", "Arm", "Shooter", "Pair"),
            ("FLEXORA Kids Arm Sleeve", "Black · Teal · Youth", "Arm", "Kids", "Pair"),
            ("FLEXORA Copper Full Arm", "Charcoal · Copper · Recovery", "Arm", "Copper", "Pair"),
            ("FLEXORA Long Arm Warmers", "Black · Red · Cycling", "Arm", "Warm", "Pair"),
            ("FLEXORA Full Arm Compression", "Black · Lime · Shooting sleeve", "Arm", "Full", "Pair"),
        ],
    ),
]


def shop_settings(heading: str, subheading: str, pinned: str, per_page: int) -> dict:
    return {
        "kicker": "Fitness Essentials",
        "heading": heading,
        "subheading": subheading,
        "card_cta": "View product",
        "list_quick_view_label": "View product",
        "list_quick_add_label": "Add to cart",
        "products_per_page": per_page,
        "catalog_per_page": per_page,
        "grid_4_per_page": per_page,
        "show_store_products": False,
        "show_catalog_blocks": True,
        "filter_price_max": 4999,
        "filter_categories_from_tags": True,
        "show_budget_filter_categories": False,
        "fill_empty_categories": False,
        "default_rating": "4.8",
        "default_review_count": "120",
        "reviews_label": "Reviews",
        "placeholder_product_url": PRODUCT_BASE,
        "pinned_category_match_key": pinned,
    }


def write_template(path: Path, blocks: dict, block_order: list[str], settings: dict) -> None:
    template = {
        "sections": {
            "ks_mp_shop_all": {
                "type": "ks-mp-shop-all",
                "blocks": blocks,
                "block_order": block_order,
                "settings": settings,
            }
        },
        "order": ["ks_mp_shop_all"],
    }
    path.write_text(json.dumps(template, indent=2), encoding="utf-8")


def main(skip_images: bool = False) -> None:
    random.seed(155459)
    all_blocks: dict = {}
    all_order: list[str] = []
    global_idx = 1
    image_names: list[str] = []

    filter_blocks: dict = {}
    filter_order: list[str] = []
    for cat_key, cat_label, _products in CATEGORIES:
        filter_id = f"filter_{cat_key.replace('-', '_')}"
        filter_blocks[filter_id] = {
            "type": "filter_category",
            "settings": {"label": cat_label, "match_key": cat_key},
        }
        filter_order.append(filter_id)
    all_blocks.update(filter_blocks)
    all_order.extend(filter_order)

    for cat_i, (cat_key, cat_label, products) in enumerate(CATEGORIES):
        meta = CATEGORY_META[cat_key]
        slug = meta["slug"]
        pool = [name for name in meta["pool"] if (ASSETS / name).exists()] or ["ks-mp-bs-01-knee-navy.jpg"]

        cat_blocks: dict = dict(filter_blocks)
        cat_order: list[str] = list(filter_order)

        for local_i, (title, subtitle, t1, t2, t3) in enumerate(products, start=1):
            asset_name = f"ks-mp-p-{slug}-{local_i:02d}.jpg"
            asset_path = ASSETS / asset_name
            if skip_images:
                if not asset_path.exists():
                    raise FileNotFoundError(asset_path)
            else:
                source = ASSETS / pool[(local_i - 1) % len(pool)]
                photo = unique_photo(source, cat_i, local_i)
                photo.save(asset_path, "JPEG", quality=82, optimize=True)
            image_names.append(asset_name)

            sale = random.randint(699, 2499)
            mrp = int(sale * random.uniform(2.4, 3.6))
            item = {
                "type": "catalog_item",
                "settings": {
                    "title": title,
                    "subtitle": subtitle,
                    "list_excerpt": f"{title} — {subtitle}. Medical-grade compression with FLEXORA fit guide on the product page.",
                    "rating": f"4.{random.randint(6, 9)}",
                    "review_count": str(random.randint(48, 320)),
                    "price_text": f"From ₹{sale:,}",
                    "mrp_rupees": str(mrp),
                    "tag": cat_label,
                    "tag_1": t1,
                    "tag_2": t2,
                    "tag_3": t3,
                    "in_stock": True,
                    "link": PRODUCT_BASE,
                    "fallback_asset": asset_name,
                    "fallback_index": f"{local_i:02d}" if local_i <= 8 else "01",
                },
            }
            item_id = f"item_{global_idx:02d}"
            all_blocks[item_id] = item
            all_order.append(item_id)
            cat_item_id = f"item_{local_i:02d}"
            cat_blocks[cat_item_id] = item
            cat_order.append(cat_item_id)
            global_idx += 1

        write_template(
            TEMPLATES / f"collection.{meta['view']}.json",
            cat_blocks,
            cat_order,
            shop_settings(
                cat_label,
                f"10 FLEXORA {cat_label.lower()} picks — unique styles for gym, recovery, and daily wear.",
                cat_key,
                16,
            ),
        )

    write_template(
        SHOP_TEMPLATE,
        all_blocks,
        all_order,
        shop_settings(
            "Shop all support gear",
            "8 Fitness Essentials categories — 10 unique FLEXORA products in each.",
            "",
            40,
        ),
    )
    print(f"Wrote {global_idx - 1} products across {len(CATEGORIES)} categories")
    print("Images:", ", ".join(image_names[:4]), "...")


def regen_images_only() -> None:
    count = 0
    for cat_i, (cat_key, _label, products) in enumerate(CATEGORIES):
        meta = CATEGORY_META[cat_key]
        slug = meta["slug"]
        pool = [name for name in meta["pool"] if (ASSETS / name).exists()] or ["ks-mp-bs-01-knee-navy.jpg"]
        for local_i, _product in enumerate(products, start=1):
            source = ASSETS / pool[(local_i - 1) % len(pool)]
            photo = unique_photo(source, cat_i, local_i)
            photo.save(ASSETS / f"ks-mp-p-{slug}-{local_i:02d}.jpg", "JPEG", quality=82, optimize=True)
            count += 1
    print(f"Regenerated {count} product photos without colored borders")


if __name__ == "__main__":
    if "--images-only" in sys.argv:
        regen_images_only()
    else:
        main(skip_images="--templates-only" in sys.argv)
