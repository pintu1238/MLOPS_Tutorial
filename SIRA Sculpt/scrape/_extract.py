import re, os, json

ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape"
OUT = os.path.join(ROOT, "extracted")
os.makedirs(OUT, exist_ok=True)

def load(name):
    return open(os.path.join(ROOT, name), encoding="utf-8", errors="ignore").read()

def extract_section(html, marker):
    # marker is part of id
    m = re.search(r'<div\s+id="shopify-section-[^"]*%s[^"]*"[^>]*>' % re.escape(marker), html)
    if not m:
        # try contains
        m = re.search(r'<div\s+id="shopify-section-[^"]+"[^>]*class="[^"]*%s[^"]*"' % re.escape(marker), html)
    if not m:
        m = re.search(r'id="shopify-section-[^"]*%s[^"]*"' % re.escape(marker), html)
        if not m:
            return None
        # find start of this div
        start = html.rfind("<div", 0, m.start())
    else:
        start = m.start()
    # naive div depth from start
    i = start
    depth = 0
    n = len(html)
    while i < n:
        if html.startswith("<div", i) and (i+4 >= n or html[i+4] in " >\n\t"):
            depth += 1
            i += 4
            continue
        if html.startswith("</div>", i):
            depth -= 1
            i += 6
            if depth == 0:
                return html[start:i]
            continue
        i += 1
    return html[start:start+5000]

home = load("home.html")
prod = load("product.html")
contact = load("contact.html")
track = load("track.html")
shop = load("shop.html")
page4d = load("page4d.html")
search = load("search.html")

# extract by id substring
ids = {
    "home": (home, "ss_home"),
    "header": (home, "__header"),
    "menu_drawer": (home, "sira_menu_drawer"),
    "footer": (home, "sira_footer"),
    "cart": (home, "sira-cart-drawer"),
    "contact": (contact, "sira_contact"),
    "track": (track, "sira_track"),
    "shop": (shop, "sira_col"),
    "prod_top": (prod, "ss_top_b"),
    "prod_main": (prod, "__main"),
    "prod_bottom": (prod, "ss_bottom_b"),
    "page4d": (page4d, "__main"),
    "search_main": (search, "__main"),
}

for name, (html, marker) in ids.items():
    html2 = html
    # find the exact id
    m = re.search(r'id="(shopify-section-[^"]*%s[^"]*)"' % re.escape(marker), html2)
    if not m:
        print("MISSING", name, marker)
        continue
    sid = m.group(1)
    chunk = extract_section(html2, marker)
    if not chunk:
        print("NO CHUNK", name)
        continue
    path = os.path.join(OUT, f"{name}.html")
    open(path, "w", encoding="utf-8").write(chunk)
    print(f"OK {name:15} {len(chunk):7}  {sid[:70]}")

# dump all style tags separately
styles = re.findall(r"<style[^>]*>(.*?)</style>", home, re.S)
for i, s in enumerate(styles):
    open(os.path.join(OUT, f"home_style_{i:02d}.css"), "w", encoding="utf-8").write(s)
    print(f"style {i:02d} {len(s)}")

# product styles
stylesp = re.findall(r"<style[^>]*>(.*?)</style>", prod, re.S)
print("product styles", len(stylesp), "chars", sum(len(x) for x in stylesp))
open(os.path.join(OUT, "product_all_styles.css"), "w", encoding="utf-8").write("\n\n/* BLOCK */\n".join(stylesp))

# collect urls of images/videos
urls=set()
for html in [home, prod, shop, contact, track, page4d, search]:
    for u in re.findall(r'(?:src|data-src|poster)=["\']([^"\']+)["\']', html):
        if any(ext in u.lower() for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm"]):
            urls.add(u.split("?")[0] if "cdn.shopify" in u or "sirasculpt" in u or "cloudfront" in u else u)
    for u in re.findall(r'url\(([^)]+)\)', html):
        u=u.strip("'\"")
        if any(ext in u.lower() for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4"]):
            urls.add(u)

print("\n=== MEDIA URLS ===")
for u in sorted(urls):
    print(u[:250])
print("count", len(urls))
open(os.path.join(OUT, "media_urls.txt"), "w", encoding="utf-8").write("\n".join(sorted(urls)))
