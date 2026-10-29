import pathlib
import re

root = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd\theme")
for path in root.rglob("*.liquid"):
    text = path.read_text(encoding="utf-8")

    def repl(match):
        tag = match.group(0)
        if "width=" in tag:
            return tag
        return tag[:-1] + ' width="800" height="1000">'

    updated = re.sub(r"<img\b[^>]*>", repl, text)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        print(path.name)
