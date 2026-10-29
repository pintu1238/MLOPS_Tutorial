# Design Spec: Pookie Hoodie Storefront Replica

**Date:** 2026-09-30  
**Target Store:** `y9yn6k-me`  
**Theme ID:** `154203390021`  
**Reference Storefront:** [The Pookie Wear - Pookie Hoodie](https://thepookiewear.com/products/pookie-hoodie)  
**Architecture:** Modular Shopify 2.0 Theme Sections + JSON Template (`Approach 1`)

---

## 1. Overview & Objectives
Build a pixel-accurate, high-converting replica of the Pookie Hoodie product landing page for Shopify. The replica includes all product media, variant selectors, interactive bundle tiers, urgency widgets, lifestyle banners, verified customer reviews, guarantees, and sticky add-to-cart functionality.

All sections will be modular Liquid sections with full Shopify theme editor schema controls, styled using custom scoped CSS and responsive vanilla JavaScript.

---

## 2. Visual & Brand Specs
- **Font Family:** `Poppins`, sans-serif (primary body & headings).
- **Primary Accent / Brand Color:** `#bc7c3e` (Caramel / Sherpa brown).
- **Secondary Accent:** `#8a5726` (Dark caramel hover/active).
- **Highlight Badges:** `#e48f45` / Soft warm yellow-orange `#fbf0e4`.
- **Urgency Alert Box:** `#ffebeb` background with `#d93838` text / borders.
- **Card Backgrounds:** `#faf7f2` and `#ffffff` with subtle borders (`#e8dfd5`).
- **Typography Sizing:**
  - Product Title: `32px` / `2rem`, weight 700.
  - Section Headings: `28px` / `1.75rem`, weight 700.
  - Body Text: `15px` / `0.9375rem`, line height 1.6.

---

## 3. Directory & File Manifest
```
assets/
  ├── pookie-styles.css
  └── pookie-scripts.js
sections/
  ├── pookie-top-bar.liquid
  ├── pookie-main-product.liquid
  ├── pookie-story-banners.liquid
  ├── pookie-reviews.liquid
  ├── pookie-guarantee.liquid
  └── pookie-sticky-bar.liquid
snippets/
  ├── pookie-icons.liquid
  └── pookie-bundle-card.liquid
templates/
  └── product.pookie-hoodie.json
```

---

## 4. Section Details & Features

### 4.1 `pookie-top-bar.liquid`
- **Announcement Countdown Timer:**
  - Top black bar with white text: `FLASH SALE ENDS IN: 00 DAYS 00 HRS 42 MIN 38 SEC`.
  - Timer counts down every second and resets/persists in browser `localStorage`.
- **Marquee Ticker:**
  - Rich caramel background (`#bc7c3e`).
  - Seamless CSS marquee animation looping:
    - `🔥 50% OFF — LIMITED TIME`
    - `🚚 FREE SHIPPING WORLDWIDE`

### 4.2 `pookie-main-product.liquid`
- **Product Gallery (Desktop & Mobile):**
  - Main responsive image display.
  - Scraped CDN URLs for all 10 product gallery angles and model shots.
  - Clickable horizontal thumbnail row with smooth slide navigation.
- **Product Details & Badging:**
  - Pill badge: `HOT PRODUCT | LOW STOCK`.
  - Product Title: `Pookie Hoodie`.
  - Star ratings: 5 gold stars with `(1131 Reviews)`.
  - Price: Current discounted price + strikethrough comparison price + `-50%` badge.
  - Three emoji value propositions:
    - 🤱 Baby on your chest, hands free
    - 🧸 One cozy hug for the two of you
    - 🪑 A hidden seat does the carrying
- **Variant Selectors:**
  - Size pills: `S`, `M`, `L`, `XL`, `XXL` with active selection highlighting.
  - Color dropdown: `Cream`, `Rose`, `Caramel`.
  - "Size chart" trigger opening a modal with measurements (Chest, Length, Sleeve).
- **Bundle & Save Widget:**
  - Multi-tier radio selection:
    1. **1 Hoodie:** Standard price.
    2. **2 Hoodies (Most Popular):** 55% OFF. Displays dual variant selectors (Size & Color for Hoodie 1 & 2) and optional upsell checkboxes (Hat & Mittens, Mystery Box, Shipping Protection).
    3. **3 Hoodies:** 58% OFF. Includes free Hat & Mittens bonus.
- **Call to Action:**
  - Full-width `PREORDER NOW` button (`#bc7c3e`).
  - Sub-text / urgency callout: `54 people ordered this recently... Preorder now to secure yours!`.
  - Brianna L. testimonial snippet with customer photo.
  - Trust badge bar (30-Day Money-Back, Free Shipping Worldwide, #1 Selling Babywear).
- **Accordion Drawers:**
  - 5 interactive drawers with toggle state (+/- or check icons):
    1. Description
    2. How fast will it ship?
    3. What size baby does it fit?
    4. Which size should I order?
    5. What actually holds my baby?

### 4.3 `pookie-story-banners.liquid`
- Banner 1: Background animated GIF (`banner-1-zip-in-1x1.gif`) with centered floating rounded card:
  - Heading: `🧸 One Hoodie Instead of a Carrier, a Blanket and a Sweater`
  - Body: Story of the chest arc zipper and built-in weight-bearing seat.
- Banner 2: Background animated GIF (`banner-2-cozy-1x1.gif`) with centered floating rounded card:
  - Heading: `☕ For the Days They Only Want to Be on You`
  - Body: Emotional copy about keeping baby warm and snug during chores and outings.

### 4.4 `pookie-reviews.liquid`
- Section Title: `What They Said After the First Week`
- 3 Customer Review Cards:
  1. Jenna K. (Charlotte, NC) — *She naps on me and I finally get my hands back*
  2. Ryan T. (Columbus, OH) — *Bought it for my wife, now she won't take it off*
  3. Dennis W. (Tulsa, OK) — *My daughter sent me the photo and I framed it*
- Each card has customer picture, quote icon, 5 gold stars, title, review body, and author badge.

### 4.5 `pookie-guarantee.liquid`
- Warm beige rounded card container (`#faf7f2`).
- Left: Circular 30-Day Money-Back Guarantee stamp badge.
- Right:
  - Small eyebrow: `OUR PROMISE TO YOU`
  - Heading: `Cozy for Both of You — Or You Get Your Rs. 5,900.00 Back`
  - Description: 30-day wear and test guarantee.
  - 3 checklist items with checkmarks:
    - 30 days to try it
    - Full refund if it's not for you
    - Real humans reply within 48h

### 4.6 `pookie-sticky-bar.liquid`
- Fixed bottom bar appearing on scroll past the main buy button.
- Product thumbnail + title + "Choose bundle" CTA button that smoothly scrolls back to the buy options.

---

## 5. Extracted High-Resolution Media Assets
- Logo: `https://thepookiewear.com/cdn/shop/files/logo.png?v=1789575905&width=500`
- Gallery Image 1: `https://thepookiewear.com/cdn/shop/files/01-main-white_c64b1d83-69ec-47f7-a2e1-03d89d8845a7.png?v=1789668683&width=1946`
- Gallery Image 2: `https://thepookiewear.com/cdn/shop/files/hf_20260919_000903_4a793c9f-1927-4e4e-81a2-4680f06db150.png?v=1789776709&width=1946`
- Gallery Image 3: `https://thepookiewear.com/cdn/shop/files/hf_20260919_001029_16dfebf9-bb7c-4f05-8df3-1e762efa0af2.png?v=1789776708&width=1946`
- Gallery Image 4: `https://thepookiewear.com/cdn/shop/files/hf_20260919_000856_b1116b3d-b92c-4af7-ad45-ec2e29756e6f.png?v=1789776709&width=1946`
- Gallery Image 5: `https://thepookiewear.com/cdn/shop/files/hf_20260919_124448_91ce7a24-a8d4-4328-a54f-62d9651d293b.png?v=1789821945&width=1946`
- Gallery Image 6: `https://thepookiewear.com/cdn/shop/files/hf_20260919_000916_9d1c6e2f-df59-4f06-a869-f3c06d284dae.png?v=1789776706&width=1946`
- Gallery Image 7: `https://thepookiewear.com/cdn/shop/files/hf_20260919_001039_c4c7de6f-ce3a-4d58-ad65-c5d4adeee04f.png?v=1789776703&width=1946`
- Gallery Image 8: `https://thepookiewear.com/cdn/shop/files/hf_20260917_180142_c1a772d9-3adc-4018-9d30-0417a90d671c_1.png?v=1789668905&width=1946`
- Gallery Image 9: `https://thepookiewear.com/cdn/shop/files/hf_20260917_151918_ca38ed71-295a-415c-a57d-df0952d52043_2.png?v=1789668907&width=1946`
- Gallery Image 10: `https://thepookiewear.com/cdn/shop/files/hf_20260917_175802_6da7b4d6-582a-4a51-b0db-5cd9a7ce87ea.png?v=1789668906&width=1946`
- Story Banner 1 GIF: `https://thepookiewear.com/cdn/shop/files/banner-1-zip-in-1x1.gif?v=1789670780&width=3840`
- Story Banner 2 GIF: `https://thepookiewear.com/cdn/shop/files/banner-2-cozy-1x1.gif?v=1789670779&width=3840`
- Review 1 Photo: `https://thepookiewear.com/cdn/shop/files/t1-laptop-nap.png?v=1789577377&width=1420`
- Review 2 Photo: `https://thepookiewear.com/cdn/shop/files/t2-selfie.png?v=1789661833&width=1420`
- Review 3 Photo: `https://thepookiewear.com/cdn/shop/files/t3-window-camera.png?v=1789662419&width=1420`
- Upsell 1 (Hat & Mittens): `https://thepookiewear.com/cdn/shop/files/O1CN017lkZbS1FjZqKlWEL2__2211016570523-0-cib.jpg?height=200&v=1789669568`
- Upsell 2 (Mystery Box): `https://thepookiewear.com/cdn/shop/files/mystery-box_ae5b955a-0e30-477e-9f81-6e939e13c01c.png?height=200&v=1789575376`
- Upsell 3 (Shipping Protection): `https://thepookiewear.com/cdn/shop/files/package-protection_56d05921-9757-411b-9882-d62d7dfa82dc.png?height=200&v=1789575388`

---

## 6. Implementation Stages
1. **Assets & Styles (`pookie-styles.css`, `pookie-scripts.js`):** Responsive grid, typography, carousel controllers, countdown timer, accordion handlers, bundle discount calculator, sticky bar observer.
2. **Icons & Helpers (`snippets/pookie-icons.liquid`, `snippets/pookie-bundle-card.liquid`):** Crisp SVGs and reusable bundle card snippet.
3. **Sections:**
   - `pookie-top-bar.liquid`
   - `pookie-main-product.liquid`
   - `pookie-story-banners.liquid`
   - `pookie-reviews.liquid`
   - `pookie-guarantee.liquid`
   - `pookie-sticky-bar.liquid`
4. **Template:**
   - `templates/product.pookie-hoodie.json` registering the exact section sequence.
5. **Validation:**
   - Liquid syntax and schema verification.
   - Browser rendering verification against reference website.
