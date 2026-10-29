import re
from pathlib import Path
t = Path(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live\leggings.html").read_text(encoding="utf-8", errors="ignore")
# unique files/ URLs in product gallery region
start = t.find('GalleryViewer-')
end = t.find('window.SS_V', start)
chunk = t[start:end] if start != -1 else t
urls = re.findall(r'//sirasculpt.com/cdn/shop/files/[^\"\'\s?]+\.(?:jpg|jpeg|png|webp)', chunk)
seen = []
for u in urls:
    if u not in seen:
        seen.append(u)
for i, u in enumerate(seen, 1):
    print(f"{i:02d} {u}")
print("TOTAL", len(seen))
