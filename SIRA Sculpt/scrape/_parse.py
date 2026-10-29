import re, os, json
from html.parser import HTMLParser

ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape"
html = open(os.path.join(ROOT, "home.html"), encoding="utf-8", errors="ignore").read()
print("len", len(html))
m = re.search(r"<title>(.*?)</title>", html, re.I)
print("TITLE", m.group(1) if m else None)

print("\n=== SHOPIFY SECTIONS ===")
for m in re.finditer(r'id="shopify-section-([^"]+)"([^>]*)>', html):
    sid = m.group(1)
    attrs = m.group(2)
    cm = re.search(r'class="([^"]*)"', attrs)
    print(sid, "|", (cm.group(1) if cm else "")[:100])

print("\n=== CSS HREFS ===")
for m in re.finditer(r'href="([^"]+\.css[^"]*)"', html):
    print(m.group(1)[:220])

styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)
print("\nstyle count", len(styles), "chars", sum(len(s) for s in styles))
open(os.path.join(ROOT, "home_styles.css"), "w", encoding="utf-8").write("\n\n/* BLOCK */\n".join(styles))

# extract inline custom css likely in data-css or :root
root_vars = re.findall(r"--[a-zA-Z0-9_-]+\s*:\s*[^;}{]+", html[:80000])
print("\n=== EARLY VARS sample ===")
for v in root_vars[:80]:
    print(v[:140])

print("\n=== HEADER SNIPPET ===")
hm = re.search(r"<sticky-header[\s\S]{0,400}", html) or re.search(r"<header[\s\S]{0,400}", html)
print((hm.group(0) if hm else "NO HEADER")[:400])

print("\n=== MARQUEE / TICKER ===")
for pat in ["marquee", "announcement", "ticker", "ss-"]:
    print(pat, html.lower().count(pat))

# all unique image urls
imgs = re.findall(r'(?:src|srcset)="([^"]+)"', html)
print("\n=== IMG URLS ===")
seen=set()
for u in imgs:
    u=u.split()[0]
    if u not in seen and ("http" in u or u.startswith("//") or "/cdn/" in u):
        seen.add(u)
        print(u[:220])

print("IMG unique", len(seen))

# product page sections
prod = open(os.path.join(ROOT, "product.html"), encoding="utf-8", errors="ignore").read()
print("\n=== PRODUCT SECTIONS ===")
for m in re.finditer(r'id="shopify-section-([^"]+)"', prod):
    print(m.group(1))

print("\n=== CONTACT SECTIONS ===")
c = open(os.path.join(ROOT, "contact.html"), encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'id="shopify-section-([^"]+)"', c):
    print(m.group(1))

print("\n=== TRACK SECTIONS ===")
t = open(os.path.join(ROOT, "track.html"), encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'id="shopify-section-([^"]+)"', t):
    print(m.group(1))

print("\n=== SHOP SECTIONS ===")
s = open(os.path.join(ROOT, "shop.html"), encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'id="shopify-section-([^"]+)"', s):
    print(m.group(1))

print("\n=== 4D PAGE SECTIONS ===")
p4 = open(os.path.join(ROOT, "page4d.html"), encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'id="shopify-section-([^"]+)"', p4):
    print(m.group(1))

print("\n=== SEARCH SECTIONS ===")
se = open(os.path.join(ROOT, "search.html"), encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'id="shopify-section-([^"]+)"', se):
    print(m.group(1))
