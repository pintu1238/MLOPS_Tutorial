import re, os
html = open(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\product.html", encoding="utf-8", errors="ignore").read()
out = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted"

def extract_div_by_class(html, cls):
    pat = re.compile(r'<div class="' + re.escape(cls) + r'"')
    m = pat.search(html)
    if not m:
        return None
    start = m.start()
    i = start
    depth = 0
    n = len(html)
    while i < n:
        if html.startswith("<div", i) and (i + 4 == n or html[i + 4] in " >\n"):
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
    return html[start:start + 50000]

for cls in ["sc-lp", "ss-lp", "ssbb", "ss-lp2", "ss-sticky"]:
    chunk = extract_div_by_class(html, cls)
    if chunk:
        path = os.path.join(out, f"prod_{cls.replace('-', '_')}.html")
        open(path, "w", encoding="utf-8").write(chunk)
        print(cls, len(chunk))
    else:
        print("MISS", cls)

# shop collection
shop = open(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\shop.html", encoding="utf-8", errors="ignore").read()
for cls in ["sscol", "sira_col", "ssh"]:
    print("shop", cls, shop.find(cls))
# find unique shop classes
print("shop sira", shop.find("sira"))
m = re.search(r'id="shopify-section-template[^"]*sira_col[^"]*"', shop)
print("shop section id", m.group(0) if m else None)
# 4d
p4 = open(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\page4d.html", encoding="utf-8", errors="ignore").read()
print("4d len", len(p4), "main", p4.find("4D"))
