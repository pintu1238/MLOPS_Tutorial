import re, urllib.request
from pathlib import Path

root = Path(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt")
out = root / "scrape" / "live"
out.mkdir(parents=True, exist_ok=True)

urls = {
    "cellulite": "https://sirasculpt.com/products/sira-sculpt-3d-anti-cellulite-leggings-sculpt-smooth",
    "nurses": "https://sirasculpt.com/products/sira-sculpt-4d-compression-leggings-for-nurses",
    "briefs": "https://sirasculpt.com/products/sira-sculpt-belly-brief-offer",
}

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")

def extract_section(html, key):
    # shopify-section-template--NNNN__key
    pat = re.compile(
        rf'(<div id="shopify-section-template--\d+__{re.escape(key)}"[^>]*>)([\s\S]*?)(?=<div id="shopify-section-)',
        re.I,
    )
    m = pat.search(html)
    if not m:
        return ""
    return m.group(0)

for name, url in urls.items():
    print("FETCH", name)
    html = fetch(url)
    (out / f"{name}.html").write_text(html, encoding="utf-8")
    # list sections
    secs = re.findall(r'shopify-section-template--\d+__([A-Za-z0-9_-]+)', html)
    print("  sections", secs)
    for key in sorted(set(secs)):
        chunk = extract_section(html, key)
        if chunk:
            p = out / "blocks" / f"{name}_{key}.html"
            p.write_text(chunk, encoding="utf-8")
            print("  wrote", p.name, len(chunk))

print("done")
