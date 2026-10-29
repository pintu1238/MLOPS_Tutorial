# Girls Purse PDP — clone pack (dusre theme ke liye)

Yeh folder **product click → Zora-style PDP** (gallery left, bundles Buy 1/2/3, color/size swatches, tabs, reviews, sticky bar) ka **poora code** hai. Koi logic change mat karo — files copy + wiring karo.

## 1. Files copy karo (theme root me same paths)

| Path in pack | Theme destination |
|--------------|-------------------|
| `sections/gw-product.liquid` | `sections/` |
| `sections/gw-confidence.liquid` | `sections/` (optional, `product.json` ke neeche trust bar) |
| `sections/gw-style-motion.liquid` | `sections/` (optional, “Style in Motion” reels) |
| `assets/gw-product-bundle.js` | `assets/` |
| `assets/gw-product-page-luxe.css` | `assets/` |
| `snippets/*.liquid` | `snippets/` |
| `templates/product.json` | `templates/` (ya merge sections) |

### Snippets (zaroori)

- `gw-gp-pdp-gallery.liquid` — purse / `gp-*` gallery slides + thumbs  
- `gw-icon.liquid` — chevrons, trust icons, tab icons  
- `gw-star-rating.liquid`  
- `gw-pdp-tab-multiline.liquid` — Description / Details / Shipping tabs  
- `gw-pdp-gallery-size-overlay.liquid` — footwear size slide (purse par usually off)  
- `gw-pdp-you-may-also-like.liquid` + `gw-pdp-related-card.liquid` — related products row  

## 2. Layout wiring (`layout/theme.liquid`)

Product template par CSS + body class:

```liquid
{%- if template.name == 'product' -%}
  {{ 'gw-product-page-luxe.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

```liquid
<body class="...{% if template.name == 'product' %} gw-product-page{% endif %}">
```

## 3. JavaScript dependency

`gw-product-bundle.js` import karta hai:

```js
import { CartLinesUpdateEvent } from '@shopify/events';
```

Dusre theme me `snippets/scripts.liquid` import map me hona chahiye:

```json
"@shopify/events": "{{ 'events.js' | asset_url }}"
```

(Aur theme ka `assets/events.js` — Shopify Dawn-based themes me hota hai.)

Section end me:

```liquid
<script type="module" src="{{ 'gw-product-bundle.js' | asset_url }}"></script>
```

Custom element: `<gw-product-bundle>` — poora markup `sections/gw-product.liquid` me hai.

## 4. Product JSON (`data-gw-product-json`)

Script tag ke andar product data:

- `gallery_image_urls` — har color ko sahi slide se map (filename `color-01-black`, `color-02-cherry`, …)  
- `swatch_images`, `variants`, `options_with_values`  
- Color picker logic: `assets/gw-product-bundle.js` → `#buildColorGalleryIndex`, `#showGalleryForColor`, `#createColorSwatches`, `#renderLines`, `#bindTiers`

**Color → gallery:** swatch click par left gallery update (`onSelect` → `#showGalleryForColor`). White color UI se hidden (`#filterColorValues`).

## 5. Locales

`locales/girls_winter.product.json` ko apne `locales/en.default.json` me merge karo under key `girls_winter` (product + cart). Section me `t:'girls_winter.product.*'` use hota hai.

## 6. Responsive (recommended)

Is repo me PDP mobile rules `assets/gw-responsive.css` me bhi hain (`gw-pdp`, `gw-product-page`, bundle lines). Agar layout mobile par toota ho to woh file bhi copy karo ya relevant `@media` blocks nikaal ke add karo.

## 7. CSS variables

PDP `--gw-cream`, `--gw-font-ui`, `--gw-charcoal` use karta hai. Agar naye theme me nahi hain to `snippets/theme-styles-variables.liquid` / `base.css` se match karo ya `gw-product-page-luxe.css` ke upar same tokens define karo.

## 8. Architecture (agent ke liye short)

```
templates/product.json
  └── section gw-product (gw-product.liquid)
        └── <gw-product-bundle>
              ├── Gallery: [data-gw-gallery-stage], [data-gw-slide], [data-gw-gallery-thumb]
              ├── Tiers: [data-gw-tier-wrap], [data-gw-tier], [data-gw-bundle-lines]
              ├── Form: [data-gw-product-form] → ATC multi-line cart
              └── JSON: [data-gw-product-json]

assets/gw-product-bundle.js
  ├── #bindGallery — swipe + thumbs
  ├── #bindTiers / #renderLines — Buy 1/2/3 color + size per line
  ├── #showGalleryForColor — color filename aliases
  └── #bindAddToCart, sticky, tabs, mini reviews
```

## 9. Source repo path

Full theme: `C:\Users\pintu\Desktop\shopify_websites\girls-purse`

Main PDP section size: `sections/gw-product.liquid` (~4300 lines — schema + `{% stylesheet %}` included).

## 10. Deploy test

```bash
shopify theme push --store YOUR_STORE --theme THEME_ID --only sections/gw-product.liquid assets/gw-product-bundle.js assets/gw-product-page-luxe.css templates/product.json
```

Preview: `?preview_theme_id=THEME_ID` on any product URL.

---

**Note:** Product images naming `color-01-black`, `color-02-cherry`, `ella-color-01-*` se color sync hota hai. Generic 6 swatches tab bhi chalte hain jab product par sirf `Default Title` variant ho.
