import json
from pathlib import Path

colors = ["Black", "Slate Grey", "Burgundy", "Mocha Brown", "Royal Blue"]
sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
variants = []
for c in colors:
    for s in sizes:
        variants.append({
            "optionValues": [
                {"optionName": "Color", "name": c},
                {"optionName": "Size", "name": s},
            ],
            "price": 64.95,
            "compareAtPrice": 109.95,
            "inventoryPolicy": "CONTINUE",
        })

data = {
    "input": {
        "id": "gid://shopify/Product/8314367672389",
        "title": "Sira Sculpt 4D Lipedema Leggings",
        "handle": "sira-sculpt-4d-lipedema-leggings-offer",
        "vendor": "Sira Sculpt",
        "status": "ACTIVE",
        "productOptions": [
            {"name": "Color", "values": [{"name": c} for c in colors]},
            {"name": "Size", "values": [{"name": s} for s in sizes]},
        ],
        "variants": variants,
    }
}
Path(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme\_tmp_variants.json").write_text(
    json.dumps(data), encoding="utf-8"
)
print("variants", len(variants))
