import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / "templates" / "collection.tc-mp-remote-shop-155057.json"
data = json.loads(src.read_text(encoding="utf-8"))
rows = []

shop = data["sections"]["tc_mp_shop_all"]
for key in shop["block_order"]:
    s = shop["blocks"][key]["settings"]
    digits = "".join(ch for ch in s.get("price_text", "") if ch.isdigit())
    rupees = int(digits) if digits else 0
    asset = s.get("fallback_asset", "")
    seed = asset.replace("tc-mp-shop-", "").replace(".jpg", "")
    try:
        seed = str(int(seed))
    except ValueError:
        seed = "1"
    rows.append(
        (
            s["title"],
            s.get("subtitle", ""),
            s.get("tag", ""),
            rupees,
            asset,
            seed,
            s.get("list_excerpt", ""),
        )
    )

arrivals = data["sections"]["tc_mp_new_arrivals"]
for i, key in enumerate(arrivals["block_order"], 1):
    s = arrivals["blocks"][key]["settings"]
    digits = "".join(ch for ch in s.get("price_text", "") if ch.isdigit())
    rupees = int(digits) if digits else 0
    asset = s.get("fallback_asset", "")
    rows.append(
        (
            s["title"],
            s.get("subtitle", ""),
            s.get("tag", ""),
            rupees,
            asset,
            str(i),
            s.get("list_excerpt", ""),
        )
    )


def jq(value):
    return json.dumps(value, ensure_ascii=False)


lines = [
    "{% comment %}",
    "  JSON catalog for header search typeahead and recently viewed.",
    "{% endcomment %}",
    '<script type="application/json" id="tcMpSearchCatalog">',
    "[",
]

for i, (title, sub, tag, rupees, asset, seed, excerpt) in enumerate(rows):
    compare = int(rupees * 135 / 100) if rupees else 0
    comma = "," if i < len(rows) - 1 else ""
    seed_int = int(seed) if str(seed).isdigit() else 1
    url_var = f"tc_mp_search_url_{i}"
    lines.extend(
        [
            f"  {{% capture {url_var} %}}{{% render 'tc-mp-flytek-preview-url', title: {jq(title)}, image_asset: {jq(asset)}, color_seed: {seed_int}, base_path: '/products/flytek-curve-rc-drift-car-4x4' %}}{{% endcapture %}}",
            "  {",
            f'    "id": {jq(asset.replace(".jpg", ""))},',
            f'    "title": {jq(title)},',
            f'    "subtitle": {jq(sub)},',
            f'    "tag": {jq(tag)},',
            f'    "body": {jq(excerpt)},',
            f'    "price": {rupees},',
            f'    "compare": {compare},',
            f'    "seed": {seed_int},',
            f'    "asset": {jq(asset)},',
            f'    "image": {{{{ {jq(asset)} | asset_url | json }}}},',
            f'    "url": {{{{ {url_var} | strip | json }}}}',
            f"  }}{comma}",
        ]
    )

lines.extend(["]", "</script>", ""])
out = root / "snippets" / "tc-mp-search-catalog.liquid"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {out} ({len(rows)} items)")
