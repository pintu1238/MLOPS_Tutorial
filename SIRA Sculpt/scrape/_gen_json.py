# -*- coding: utf-8 -*-
import os, json, re
ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme"

def w(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)
        f.write("\n")
    print("json", os.path.basename(path))

# header group
w(os.path.join(ROOT, "sections", "header-group.json"), {
  "type": "header",
  "name": "Header",
  "sections": {
    "ss_header": { "type": "ss-header", "settings": {} },
    "ss_cart": { "type": "ss-cart-drawer", "settings": {} }
  },
  "order": ["ss_header", "ss_cart"]
})

w(os.path.join(ROOT, "sections", "footer-group.json"), {
  "type": "footer",
  "name": "Footer",
  "sections": {
    "ss_footer": { "type": "ss-footer", "settings": {} }
  },
  "order": ["ss_footer"]
})

w(os.path.join(ROOT, "templates", "index.json"), {
  "sections": {
    "ss_ticker": {"type": "ss-ticker", "settings": {}},
    "ss_hero": {"type": "ss-hero", "settings": {}},
    "ss_benefits": {"type": "ss-benefits", "settings": {}},
    "ss_how": {"type": "ss-how-it-works", "settings": {}},
    "ss_zones": {"type": "ss-zones", "settings": {}},
    "ss_range": {"type": "ss-range", "settings": {}},
    "ss_guarantee": {"type": "ss-guarantee", "settings": {}},
    "ss_cta": {"type": "ss-cta", "settings": {}}
  },
  "order": ["ss_ticker","ss_hero","ss_benefits","ss_how","ss_zones","ss_range","ss_guarantee","ss_cta"]
})

# keep product-information from original if possible by reading it
def loadj(path):
    raw = open(path, encoding="utf-8").read()
    i = raw.find("{")
    return json.loads(raw[i:])
orig = loadj(os.path.join(ROOT, "templates", "product.json"))
print("product json keys", list(orig.keys())[:5])

prod_sections = {
  "ss_product_hero": {"type": "ss-product-hero", "settings": {}},
  "ss_product_story": {"type": "ss-product-story", "settings": {}},
}
# insert original main
if "sections" in orig and "main" in orig["sections"]:
    prod_sections["main"] = orig["sections"]["main"]
prod_sections["ss_product_buy"] = {"type": "ss-product-buy", "settings": {}}
prod_sections["ss_product_extra"] = {"type": "ss-product-extra", "settings": {}}

order = ["ss_product_hero","ss_product_story"]
if "main" in prod_sections:
    order.append("main")
order += ["ss_product_buy","ss_product_extra"]
w(os.path.join(ROOT, "templates", "product.json"), {"sections": prod_sections, "order": order})

w(os.path.join(ROOT, "templates", "collection.json"), {
  "sections": {"ss_collection": {"type": "ss-collection", "settings": {}}},
  "order": ["ss_collection"]
})
w(os.path.join(ROOT, "templates", "page.contact.json"), {
  "sections": {"ss_contact": {"type": "ss-contact", "settings": {}}},
  "order": ["ss_contact"]
})
w(os.path.join(ROOT, "templates", "page.track-order.json"), {
  "sections": {"ss_track": {"type": "ss-track", "settings": {}}},
  "order": ["ss_track"]
})
w(os.path.join(ROOT, "templates", "page.json"), {
  "sections": {"ss_page": {"type": "ss-page", "settings": {}}},
  "order": ["ss_page"]
})
w(os.path.join(ROOT, "templates", "search.json"), {
  "sections": {"ss_search": {"type": "ss-search-results", "settings": {}}},
  "order": ["ss_search"]
})
w(os.path.join(ROOT, "templates", "cart.json"), {
  "sections": {"ss_cart_page": {"type": "ss-cart-page", "settings": {}}},
  "order": ["ss_cart_page"]
})

# patch theme.liquid
p = os.path.join(ROOT, "layout", "theme.liquid")
t = open(p, encoding="utf-8").read()
if "ss-core.css" not in t:
    t = t.replace("{%- render 'stylesheets' -%}",
                  "{%- render 'stylesheets' -%}\n    {{ 'ss-core.css' | asset_url | stylesheet_tag }}\n    {{ 'ss-product.css' | asset_url | stylesheet_tag }}")
if "ss-core.js" not in t:
    t = t.replace("{%- render 'scripts' -%}",
                  "{%- render 'scripts' -%}\n    <script src=\"{{ 'ss-core.js' | asset_url }}\" defer></script>")
open(p, "w", encoding="utf-8").write(t)
print("patched theme.liquid")

# settings colors
sp = os.path.join(ROOT, "config", "settings_data.json")
raw = open(sp, encoding="utf-8").read()
# strip comment header
m = re.search(r"\{[\s\S]*\}\s*$", raw)
data = json.loads(m.group(0) if m else raw)
cur = data.get("current") or {}
cur["page_background_color"] = "#faf6ef"
cur["page_text_color"] = "#2c2c2c"
cur["color_palette"] = {
  "background": "#faf6ef",
  "foreground": "#2c2c2c",
  "color1": "#4A2E3A",
  "color2": "#EDE3D8"
}
cur["logo_height"] = 51
cur["logo_height_mobile"] = 36
cur["type_heading_font"] = "poppins_n7"
data["current"] = cur
# keep comment
open(sp, "w", encoding="utf-8").write(raw[:raw.find("{")] + json.dumps(data, indent=2) + "\n")
print("settings_data patched")
