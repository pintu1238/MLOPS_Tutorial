"""Add unique rating, review_count, and list_excerpt to catalog_item blocks."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = [
    ROOT / "templates/collection.tc-mp-remote-shop-155057.json",
    ROOT / "templates/collection.tc-mp-drift-155057.json",
]

EXCERPT_TAILS = [
    "Includes 2.4 GHz pistol remote, USB charging, and swap-friendly tyre sets.",
    "Box includes proportional remote, Li-ion pack, and spare wheels as shown.",
    "Ready to run — remote, battery, charger, and tool kit for quick setup.",
    "Hobby-grade radio, drift or grip tyres, and USB charge for daily sessions.",
    "Full RTR kit with steering remote, cones or tools, and backup tyres.",
    "Pan-India ready stock — remote + wheels pictured ship together.",
    "Smooth throttle control, tight steering, and extras for track or home floors.",
    "Great for beginners and hobbyists — remote range suited for apartments and yards.",
]


def rating_for(i: int) -> str:
    stars = [4.9, 4.8, 4.7, 4.9, 4.8, 4.6, 4.9, 4.8, 4.7, 4.9]
    return f"{stars[i % len(stars)]}"


def reviews_for(i: int) -> str:
    base = 52 + (i * 23) + ((i * 7) % 41)
    return str(min(base, 412))


def excerpt_for(i: int, title: str, subtitle: str, tag: str) -> str:
    tail = EXCERPT_TAILS[i % len(EXCERPT_TAILS)]
    bit = subtitle.strip() if subtitle else tag
    return f"{title} — {bit}. {tail}"


def enrich_template(path: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    section = data.get("sections", {}).get("tc_mp_shop_all")
    if not section:
        return 0
    blocks = section.get("blocks", {})
    order = section.get("block_order", list(blocks.keys()))
    count = 0
    idx = 0
    for key in order:
        block = blocks.get(key)
        if not block or block.get("type") != "catalog_item":
            continue
        s = block.setdefault("settings", {})
        title = s.get("title", "RC car")
        subtitle = s.get("subtitle", "")
        tag = s.get("tag", "RC")
        s["rating"] = rating_for(idx)
        s["review_count"] = reviews_for(idx)
        s["list_excerpt"] = excerpt_for(idx, title, subtitle, tag)
        idx += 1
        count += 1
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return count


def main() -> None:
    for tpl in TEMPLATES:
        if tpl.exists():
            n = enrich_template(tpl)
            print(f"{tpl.name}: enriched {n} catalog cards")


if __name__ == "__main__":
    main()
