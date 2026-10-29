"""Download CURVD product and homepage media with curl (Windows-safe)."""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
DEST = ROOT / "media" / "downloads"
DEST.mkdir(parents=True, exist_ok=True)

HOME = [
    ("hero-home.jpg", "https://curvdlondon.com/cdn/shop/files/hero.jpg"),
]

products = json.loads((ROOT / "_scrape_products_json_limit_250.txt").read_text(encoding="utf-8"))["products"]


def curl(url: str, out: pathlib.Path) -> bool:
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and out.stat().st_size > 2000:
        print("skip", out, flush=True)
        return True
    cmd = [
        "curl.exe", "-L", "--fail", "--retry", "2", "-sS",
        "-A", "Mozilla/5.0",
        "-o", str(out),
        url,
    ]
    proc = subprocess.run(cmd)
    ok = proc.returncode == 0 and out.exists() and out.stat().st_size > 500
    print(("ok" if ok else "FAIL"), out.name, out.stat().st_size if out.exists() else 0, flush=True)
    if not ok and out.exists():
        out.unlink(missing_ok=True)
    return ok


def main():
    count = 0
    for prod in products:
        folder = DEST / "products" / prod["handle"]
        for i, img in enumerate(prod.get("images", []), 1):
            src = img["src"]
            ext = pathlib.Path(src.split("?")[0]).suffix or ".jpg"
            if curl(src, folder / f"{i:02d}{ext}"):
                count += 1
    print("product images", count, flush=True)


if __name__ == "__main__":
    main()
    sys.exit(0)
