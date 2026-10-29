# Pookie Hoodie Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, pixel-accurate Shopify 2.0 replica of the Pookie Hoodie product landing page with modular Liquid sections, scoped CSS, client-side bundle logic, and JSON template for store `y9yn6k-me` (Theme `154203390021`).

**Architecture:** Modular Liquid sections and snippets adhering to Shopify 2.0 theme architecture. Built with vanilla CSS & JS without external dependencies, with schema settings for easy customization in the Shopify Theme Editor.

**Tech Stack:** Shopify Liquid, HTML5, CSS3, Vanilla ES6+ JavaScript, Shopify Theme 2.0 JSON Templates.

**Spec:** `docs/superpowers/specs/2026-09-30-pookie-hoodie-replica-design.md`

## Global Constraints
- Target reference: `https://thepookiewear.com/products/pookie-hoodie`
- Font: `Poppins, sans-serif`
- Primary brand accent: `#bc7c3e`
- All product media extracted directly from high-resolution CDN assets
- Responsive design for mobile and desktop

---

### Task 1: CSS & JavaScript Core Assets (`assets/pookie-styles.css`, `assets/pookie-scripts.js`)

**Files:**
- Create: `assets/pookie-styles.css`
- Create: `assets/pookie-scripts.js`
- Test: `tests/test-assets.js`

**Interfaces:**
- Produces: Global scoped CSS classes (`.pookie-wrap`, `.pookie-btn-primary`, `.pookie-bundle-tier`, `.pookie-gallery`, etc.) and JavaScript controller `PookieController` initializing countdown timers, accordion toggles, thumbnail image switching, bundle price calculations, and sticky footer visibility.

- [ ] **Step 1: Write verification test for asset syntax and integrity**
- [ ] **Step 2: Create `assets/pookie-styles.css` with responsive layout, typography, animations, and color tokens**
- [ ] **Step 3: Create `assets/pookie-scripts.js` with gallery switcher, bundle selector logic, persistent countdown timer, and sticky bar observer**
- [ ] **Step 4: Run test to verify assets**
- [ ] **Step 5: Commit changes**

---

### Task 2: Core Theme Snippets (`snippets/pookie-icons.liquid`, `snippets/pookie-bundle-card.liquid`)

**Files:**
- Create: `snippets/pookie-icons.liquid`
- Create: `snippets/pookie-bundle-card.liquid`
- Test: `tests/test-snippets.js`

**Interfaces:**
- Consumes: Icon names passed via parameter `name` (`truck`, `flame`, `star`, `shield`, `chevron`, `check`, `chat`).
- Produces: Scalable SVG vector icons and dynamic bundle pricing cards.

- [ ] **Step 1: Write test script checking snippet parameters and markup generation**
- [ ] **Step 2: Create `snippets/pookie-icons.liquid` with crisp SVG paths**
- [ ] **Step 3: Create `snippets/pookie-bundle-card.liquid` supporting tier radio selections, variant dropdowns, and upsell addons**
- [ ] **Step 4: Run test to verify snippets**
- [ ] **Step 5: Commit changes**

---

### Task 3: Top Announcement Bar Section (`sections/pookie-top-bar.liquid`)

**Files:**
- Create: `sections/pookie-top-bar.liquid`
- Test: `tests/test-top-bar.js`

**Interfaces:**
- Produces: Countdown bar (`FLASH SALE ENDS IN`) and animated infinite marquee ticker (`50% OFF` / `FREE SHIPPING WORLDWIDE`) with schema settings for timer duration and marquee announcements.

- [ ] **Step 1: Write test for top bar rendering and schema validity**
- [ ] **Step 2: Implement `sections/pookie-top-bar.liquid` with Liquid schema**
- [ ] **Step 3: Run test to verify schema and markup**
- [ ] **Step 4: Commit changes**

---

### Task 4: Main Product Section (`sections/pookie-main-product.liquid`)

**Files:**
- Create: `sections/pookie-main-product.liquid`
- Test: `tests/test-main-product.js`

**Interfaces:**
- Produces: The primary conversion engine containing the 10-image gallery, variant pills (S-XXL), color picker, tiered bundle boxes (1, 2, 3 hoodies), preorder CTA, scarcity box, trust badges, and 5 collapsible accordion drawers.

- [ ] **Step 1: Write test validating required product blocks, variants, and bundle schema**
- [ ] **Step 2: Implement `sections/pookie-main-product.liquid` complete with all 10 CDN image fallbacks, pricing formulas, and interactive controls**
- [ ] **Step 3: Run test to verify section structure**
- [ ] **Step 4: Commit changes**

---

### Task 5: Storytelling Lifestyle Banners (`sections/pookie-story-banners.liquid`)

**Files:**
- Create: `sections/pookie-story-banners.liquid`
- Test: `tests/test-story-banners.js`

**Interfaces:**
- Produces: Two full-bleed media banners featuring the original animated lifestyle GIFs (`banner-1-zip-in-1x1.gif` and `banner-2-cozy-1x1.gif`) with centered frosted white story cards.

- [ ] **Step 1: Write test checking banner block schemas and responsiveness**
- [ ] **Step 2: Implement `sections/pookie-story-banners.liquid`**
- [ ] **Step 3: Run test to verify banner rendering**
- [ ] **Step 4: Commit changes**

---

### Task 6: Verified Customer Reviews (`sections/pookie-reviews.liquid`)

**Files:**
- Create: `sections/pookie-reviews.liquid`
- Test: `tests/test-reviews.js`

**Interfaces:**
- Produces: 3-column customer review section (`What They Said After the First Week`) featuring verified customer photos (Jenna K., Ryan T., Dennis W.), star ratings, and quotes.

- [ ] **Step 1: Write test for review grid schema and cards**
- [ ] **Step 2: Implement `sections/pookie-reviews.liquid`**
- [ ] **Step 3: Run test to verify review output**
- [ ] **Step 4: Commit changes**

---

### Task 7: Guarantee & Sticky ATC Bar (`sections/pookie-guarantee.liquid`, `sections/pookie-sticky-bar.liquid`)

**Files:**
- Create: `sections/pookie-guarantee.liquid`
- Create: `sections/pookie-sticky-bar.liquid`
- Test: `tests/test-guarantee-sticky.js`

**Interfaces:**
- Produces: 30-Day Money-Back Guarantee badge card and the fixed bottom sticky bar triggering smooth scroll to the preorder box.

- [ ] **Step 1: Write test for guarantee and sticky bar components**
- [ ] **Step 2: Implement `sections/pookie-guarantee.liquid`**
- [ ] **Step 3: Implement `sections/pookie-sticky-bar.liquid`**
- [ ] **Step 4: Run test to verify both sections**
- [ ] **Step 5: Commit changes**

---

### Task 8: Template JSON & Integration Package (`templates/product.pookie-hoodie.json`)

**Files:**
- Create: `templates/product.pookie-hoodie.json`
- Create: `package-theme.js` (script to bundle into a ready-to-upload zip for Theme 154203390021)
- Test: `tests/verify-all.js`

**Interfaces:**
- Produces: Valid Shopify 2.0 product template referencing all sections in exact sequence, plus an automated packaging script and local preview file.

- [ ] **Step 1: Write test verifying JSON schema structure and section order**
- [ ] **Step 2: Create `templates/product.pookie-hoodie.json`**
- [ ] **Step 3: Create packaging script and generate `pookie-hoodie-theme.zip`**
- [ ] **Step 4: Run full verification suite across all files**
- [ ] **Step 5: Final commit and deployment guide**
