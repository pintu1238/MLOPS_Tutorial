import json, urllib.request

handles = [
    "sirasculpt-3d-lipedema-leggings-drain-lighten",
    "sira-sculpt-4d-lipedema-leggings-offer",
    "sira-sculpt-3d-anti-cellulite-leggings-sculpt-smooth",
    "sira-sculpt-4d-compression-leggings-for-lymphedema",
    "sira-sculpt-4d-compression-leggings-for-varicose-veins",
    "sira-sculpt-4d-compression-leggings-for-tired-swollen-legs",
    "sira-sculpt-4d-compression-leggings-for-nurses",
    "sira-sculpt-anti-chafing-3d-shorts",
    "sira-sculpt-magic-body-oil",
    "the-lipedema-handbook",
    "sira-sculpt-belly-brief-offer",
    "sira-sculpt-belly-brief-c-section-offer",
    "sira-sculpt-belly-brief-mom-pooch-offer",
    "sira-sculpt-belly-brief-meno-offer",
]
out = []
for h in handles:
    url = f"https://sirasculpt.com/products/{h}.js"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            p = json.loads(r.read().decode())
        img = p.get("featured_image") or ""
        title = p.get("title")
        price = p.get("price")
        cmp = p.get("compare_at_price")
        print(f"{h}\n  {title}\n  {img[:90]}\n  {price} vs {cmp}")
        out.append({"handle": h, "title": title, "image": img, "price": price, "compare": cmp})
    except Exception as e:
        print("FAIL", h, e)
open(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted\sira_catalog.json","w",encoding="utf-8").write(json.dumps(out, indent=2))
