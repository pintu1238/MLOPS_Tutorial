from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\pintu\.cursor\projects\c-Users-pintu-Desktop-shopify-websites-girls-winter\assets\c__Users_pintu_AppData_Roaming_Cursor_User_workspaceStorage_1c21512907390c06a3092db6b5a47c49_images_image-4b9f6df4-bd53-47c0-8565-d5a5f88608a7.jpg")
out_dir = Path(r"C:\Users\pintu\Desktop\shopify_websites\girls winter\assets")
im = Image.open(src).convert("RGB")
w, h = im.size
mid = h // 2
gaps = []
in_gap = False
start = None
for x in range(w):
    r, g, b = im.getpixel((x, mid))
    white = r > 235 and g > 235 and b > 235
    if white and not in_gap:
        in_gap = True
        start = x
    elif not white and in_gap:
        in_gap = False
        if x - start >= 2:
            gaps.append((start, x))
print("size", w, h, "gaps", gaps)

# Content regions are between gaps (and edges)
cuts = [0]
for a, b in gaps:
    cuts.append((a + b) // 2)
cuts.append(w)

# If gap detection failed, split equally
if len(cuts) != 6:
    cuts = [round(i * w / 5) for i in range(6)]
    print("equal fallback", cuts)
else:
    print("cuts", cuts)

names = [
    "gw-pick-01.jpg",
    "gw-pick-02.jpg",
    "gw-pick-03.jpg",
    "gw-pick-04.jpg",
    "gw-pick-05.jpg",
]
for i, name in enumerate(names):
    left, right = cuts[i], cuts[i + 1]
    crop = im.crop((left, 0, right, h))
    # trim remaining white edges
    px = crop.load()
    cw, ch = crop.size
    def col_white(x):
        hits = 0
        for y in range(0, ch, 3):
            r, g, b = px[x, y]
            if r > 235 and g > 235 and b > 235:
                hits += 1
        return hits > (ch / 3) * 0.7
    l = 0
    rgt = cw - 1
    while l < rgt and col_white(l):
        l += 1
    while rgt > l and col_white(rgt):
        rgt -= 1
    crop = crop.crop((l, 0, rgt + 1, ch))
    dest = out_dir / name
    crop.save(dest, "JPEG", quality=92)
    print(name, crop.size)
