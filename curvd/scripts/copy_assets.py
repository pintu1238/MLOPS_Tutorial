"""Copy replica media into theme/assets with the filenames Liquid expects."""
import shutil
from pathlib import Path

ROOT = Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
ASSETS = ROOT / "theme" / "assets"
IMG = ROOT / "media" / "images"
PROD = IMG / "products"
SITE = IMG / "site"
ASSETS.mkdir(parents=True, exist_ok=True)

MAP = {
    ASSETS / "capri-hero.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "HERO_IMAGE.webp",
    ASSETS / "capri-black.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "capri_black.webp",
    ASSETS / "capri-navy.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "capri_navy.webp",
    ASSETS / "capri-taupe.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "capri_taupe.webp",
    ASSETS / "pants-front.webp": PROD / "performance-work-trousers" / "02-curvd-black-long-pants-front-silhouette.webp",
    ASSETS / "pants-rear.webp": PROD / "performance-work-trousers" / "03-curvd-black-long-pants-rear-fit-closeup.webp",
    ASSETS / "pants-move.webp": PROD / "performance-work-trousers" / "08-curvd-black-long-pants-movement-and-drape.webp",
    ASSETS / "tank-1.png": PROD / "tank-top-bra" / "1_6f4a9e1a-7f91-48d3-beca-d126b85a9ebe.png",
    ASSETS / "tank-2.png": PROD / "tank-top-bra" / "2_1481d0b3-ce22-44c1-835f-edddae08fcc2.png",
    ASSETS / "leggings-hero.webp": PROD / "sherpa-fur-leggings-toasty-warm-figure-shaping" / "00-CURVD-Sherpa-Leggings-Benefits-Hero.webp",
    ASSETS / "leggings-navy.webp": PROD / "sherpa-fur-leggings-toasty-warm-figure-shaping" / "navy.webp",
    ASSETS / "leggings-burgundy.webp": PROD / "sherpa-fur-leggings-toasty-warm-figure-shaping" / "burgundy.webp",
    ASSETS / "socks-five.jpg": PROD / "curvd-cozy-fall-slouch-socks" / "curvd-cozy-fall-slouch-socks-five-colors.jpg",
    ASSETS / "slippers-hero.webp": PROD / "curvd-cozy-suede-look-slippers" / "04_af14311d-78fa-4417-9e28-6b82b8744373.webp",
    ASSETS / "slide-a.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "HERO_IMAGE.webp",
    ASSETS / "slide-b.webp": PROD / "performance-work-trousers" / "hf_20260903_195550_722abe0b-9d4f-4a28-aad9-277bf45d9642.webp",
    ASSETS / "slide-c.webp": PROD / "sherpa-fur-leggings-toasty-warm-figure-shaping" / "01-CURVD-Sherpa-Leggings-Full-Length-Hero.webp",
    ASSETS / "card-comfort.webp": PROD / "performance-work-trousers" / "02-curvd-black-long-pants-front-silhouette.webp",
    ASSETS / "card-flatter.webp": PROD / "performance-work-trousers" / "03-curvd-black-long-pants-rear-fit-closeup.webp",
    ASSETS / "review-1.webp": PROD / "performance-work-trousers" / "hf_20260903_195550_722abe0b-9d4f-4a28-aad9-277bf45d9642.webp",
    ASSETS / "review-2.webp": PROD / "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort" / "6_0cea1f16-59cb-43b2-8ed5-77b56e24c9b0.png",
    ASSETS / "review-3.webp": PROD / "sherpa-fur-leggings-toasty-warm-figure-shaping" / "01-CURVD-Sherpa-Leggings-Full-Length-Hero.webp",
}

copied = 0
for dest, src in MAP.items():
    if not src.exists():
        print("MISSING", src)
        continue
    shutil.copy2(src, dest)
    copied += 1
    print("copied", dest.name, dest.stat().st_size)
print("copied", copied)
