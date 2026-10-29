import json, re, urllib.request
from pathlib import Path
from html.parser import HTMLParser

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
    "sira-anti-cellulite-oil",
    "sira-sculpt-3d-sculpting-sleeves",
    "the-lipedema-handbook",
    "sira-sculpt-belly-brief-offer",
    "sira-sculpt-belly-brief-c-section-offer",
    "sira-sculpt-belly-brief-mom-pooch-offer",
    "sira-sculpt-belly-brief-meno-offer",
    "anti-cellulite-oil-and-lymphatic-drainage-massager-kit",
]

out = Path(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted\product_page_map.json")
rows = []

for h in handles:
    url = f"https://sirasculpt.com/products/{h}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            html = r.read().decode("utf-8", "replace")
            final = r.geturl()
            status = 200
    except Exception as e:
        rows.append({"handle": h, "error": str(e)})
        print("FAIL", h, e)
        continue

    title_m = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
    title = re.sub(r"\s+", " ", title_m.group(1) if title_m else "").strip()
    body_m = re.search(r"<body[^>]*class=\"([^\"]+)\"", html, re.I)
    body_class = body_m.group(1) if body_m else ""
    tmpl_m = re.search(r"data-template=\"([^\"]+)\"", html)
    template = tmpl_m.group(1) if tmpl_m else ""
    suffix_m = re.search(r"template['\"]?\s*[:=]\s*['\"]product\.?([^'\"]*)", html)
    sections = sorted(set(re.findall(r"shopify-section-template--\d+__([A-Za-z0-9_-]+)", html)))
    custom_sec = sorted(set(re.findall(r"shopify-section-(?:template--\d+__)?(ss[a-z0-9_-]+|sira[a-z0-9_-]+|prod_[a-z0-9_-]+)", html, re.I)))
    h1s = [re.sub(r"<[^>]+>", "", x).strip()[:90] for x in re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)]
    h2s = [re.sub(r"<[^>]+>", "", x).strip()[:80] for x in re.findall(r"<h2[^>]*>(.*?)</h2>", html, re.I | re.S)]
    h2s = [x for x in h2s if x][:12]
    has_video = bool(re.search(r"\.(mp4|webm)|<video", html, re.I))
    sticky = "ss-sticky" in html or "ssbb" in html or "sticky" in html.lower()
    unique_classes = []
    for cls in ["ssbb", "ss-lp", "ss-lp2", "prod_ss", "p-hero", "ss-buy", "ss-zones", "sc-lp"]:
        if cls in html:
            unique_classes.append(cls)
    row = {
        "handle": h,
        "final_url": final,
        "title": title[:120],
        "body_class": body_class[:200],
        "data_template": template,
        "sections": sections[:40],
        "custom": custom_sec[:20],
        "h1": h1s[:4],
        "h2": h2s,
        "has_video": has_video,
        "classes": unique_classes,
        "bytes": len(html),
    }
    rows.append(row)
    print(h, "| tmpl=", template, "| secs=", ",".join(sections[:10]), "| h1=", h1s[:1])

out.write_text(json.dumps(rows, indent=2), encoding="utf-8")
print("WROTE", out)
