import re
from pathlib import Path
p = Path(r"C:\Users\PINTU\AppData\Local\Temp\curvd-home.html")
if not p.exists():
    p = Path.home() / "AppData/Local/Temp/curvd-home.html"
t = p.read_text(encoding="utf-8", errors="ignore")
urls = sorted(set(re.findall(r"https?:[^\"'\\s]+(?:webp|jpg|jpeg|png|mp4)[^\"'\\s]*", t, re.I)))
print("count", len(urls))
for u in urls[:50]:
    print(u[:200])
