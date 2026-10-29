from pathlib import Path
import re
import unittest


SECTION = Path(__file__).parents[1] / "sections" / "monsties-landing.liquid"
UTILITY = Path(__file__).parents[1] / "sections" / "monsties-utility-pages.liquid"
HEADER = Path(__file__).parents[1] / "snippets" / "monsties-site-header.liquid"
FOOTER = Path(__file__).parents[1] / "snippets" / "monsties-site-footer.liquid"
SEARCH = Path(__file__).parents[1] / "sections" / "monsties-search.liquid"
ROOT = Path(__file__).parents[1]


class MonstiesLandingRequirements(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = SECTION.read_text(encoding="utf-8")

    def test_uses_inr_prices_everywhere(self):
        self.assertNotIn("$", self.source)
        self.assertIn("Rs. 6,299.97", self.source)
        self.assertIn("Rs. 4,799.99", self.source)
        self.assertIn("Rs. 4,800.00", self.source)
        self.assertIn("Rs. 9,119.99", self.source)
        self.assertIn("Rs. 9,600.00", self.source)
        self.assertIn("Rs. 12,959.99", self.source)
        self.assertIn("Rs. 14,400.00", self.source)

    def test_guarantee_rows_use_inline_icons(self):
        self.assertGreaterEqual(self.source.count('class="mn-acc-icon"'), 3)
        guarantee = self.source.split("mn-faq-section", 1)[0]
        self.assertNotIn("verified_user", guarantee)
        self.assertNotIn("local_shipping", guarantee)
        self.assertNotIn(">redeem<", guarantee)

    def test_bundle_selection_is_single_open_and_reveals_details(self):
        self.assertGreaterEqual(self.source.count("data-bundle-details"), 3)
        self.assertRegex(
            self.source,
            r"bundleCards\.forEach[\s\S]+?classList\.toggle\('open', card === selectedCard\)",
        )

    def test_original_feature_section_is_removed(self):
        self.assertNotIn("Designed for Pure Cosiness & Attitude", self.source)
        self.assertNotIn("mn-features-section", self.source)

    def test_footer_contains_complete_payment_card_set(self):
        footer = FOOTER.read_text(encoding="utf-8")
        brands = (
            "AMEX", "Apple Pay", "Contactless", "Discover", "Google Pay",
            "Bancontact", "Diners Club", "Klarna", "Maestro", "Mastercard",
            "MB WAY", "PayPal", "Shop Pay", "UnionPay", "Visa",
        )
        for brand in brands:
            self.assertIn(brand, footer)

    def test_all_pages_reuse_the_same_home_footer(self):
        utility = UTILITY.read_text(encoding="utf-8")
        search = SEARCH.read_text(encoding="utf-8")
        footer = FOOTER.read_text(encoding="utf-8")
        self.assertIn("render 'monsties-site-footer'", self.source)
        self.assertIn("render 'monsties-site-footer'", utility)
        self.assertIn("render 'monsties-site-footer'", search)
        self.assertIn('class="mn-footer"', footer)
        self.assertIn("Privacy policy", footer)
        self.assertIn("Terms of service", footer)
        self.assertIn("Refund policy", footer)
        self.assertNotIn("mn-u-footer", utility)
        self.assertNotIn("mn-u-payments", utility)

    def test_gallery_is_portrait(self):
        self.assertIn("aspect-ratio: 3 / 4", self.source)

    def test_bundle_cards_have_original_dropdown_and_addon_layout(self):
        self.assertEqual(self.source.count('class="mn-bundle-color-select"'), 6)
        self.assertEqual(self.source.count('class="mn-bundle-size-select"'), 6)
        self.assertEqual(self.source.count('class="mn-bundle-addon-row"'), 9)
        self.assertIn("+ Shipping Protection", self.source)
        self.assertIn("+ 90-Day Warranty", self.source)
        self.assertIn("+ Priority Handling", self.source)
        self.assertGreaterEqual(self.source.count("+ FREE Monster Plush"), 2)
        self.assertIn("max-width: 158px", self.source)
        self.assertIn("grid-template-columns: 42px 158px 64px", self.source)

    def test_review_quotes_are_a_slidable_carousel(self):
        self.assertIn('class="mn-review-carousel"', self.source)
        self.assertEqual(self.source.count("<article class=\"mn-review-slide"), 3)
        self.assertIn("mnReviewNext", self.source)
        self.assertIn("mnReviewPrev", self.source)

    def test_faq_matches_reference_wave_layout(self):
        self.assertIn('class="mn-faq-wave mn-faq-wave--top"', self.source)
        self.assertIn('class="mn-faq-wave mn-faq-wave--bottom"', self.source)
        self.assertIn('viewBox="0 24 150 28"', self.source)
        self.assertIn("scaleX(-1) scaleY(-1)", self.source)
        self.assertIn("M-160 44c30 0", self.source)
        self.assertGreaterEqual(self.source.count('class="mn-faq-parallax1"'), 2)

    def test_catalog_and_contact_templates_use_utility_pages(self):
        utility = UTILITY.read_text(encoding="utf-8")
        catalog = (ROOT / "templates" / "collection.json").read_text(encoding="utf-8")
        contact = (ROOT / "templates" / "page.contact.json").read_text(encoding="utf-8")
        self.assertIn("Subscribe to our emails", utility)
        self.assertIn("Get in touch", utility)
        self.assertIn('"page_type": "catalog"', catalog)
        self.assertIn('"page_type": "contact"', contact)
        self.assertIn('form \'contact\'', utility)

    def test_utility_catalog_uses_normal_page_scale(self):
        utility = UTILITY.read_text(encoding="utf-8")
        self.assertIn("max-width: 1240px", utility)
        self.assertIn("font-size: 16px;", utility)
        self.assertIn("font-size: 15px;", utility)
        self.assertIn("height: 108px", utility)

    def test_catalog_and_contact_reuse_home_header(self):
        utility = UTILITY.read_text(encoding="utf-8")
        header = HEADER.read_text(encoding="utf-8")
        landing = SECTION.read_text(encoding="utf-8")
        self.assertIn("render 'monsties-site-header'", landing)
        self.assertIn("render 'monsties-site-header'", utility)
        self.assertIn('class="mn-header"', header)
        self.assertIn('class="mn-nav-links"', header)
        self.assertIn('class="mn-logo"', header)
        self.assertIn('id="mnSearchBtn"', header)
        self.assertIn('id="mnCartBtn"', header)
        self.assertNotIn("mn-u-header", utility)
        self.assertNotIn("mn-u-nav a.active", utility)

    def test_utility_catalog_and_contact_use_readable_responsive_scale(self):
        utility = UTILITY.read_text(encoding="utf-8")
        self.assertIn(".mn-u-field,", utility)
        self.assertIn(".mn-u-contact-form input,", utility)
        self.assertIn(".mn-u-contact-form textarea {", utility)
        self.assertIn("font-size: 16px;", utility)
        self.assertIn("height: 48px;", utility)
        self.assertIn("width: calc(100% - 32px);", utility)
        self.assertIn("mn-u-newsletter-form", utility)
        self.assertIn("mn-u-contact-form", utility)

    def test_uses_shopify_routes_for_navigation(self):
        header = HEADER.read_text(encoding="utf-8")
        combined = self.source + header
        for route_name in (
            "routes.root_url",
            "routes.all_products_collection_url",
            "routes.search_url",
            "routes.account_login_url",
        ):
            self.assertIn(route_name, combined)
        self.assertNotIn('href="/search"', header)
        self.assertNotIn('href="/cart"', header)

    def test_add_to_cart_uses_real_shopify_variant_api(self):
        self.assertIn('"type": "product"', self.source)
        self.assertIn("mnVariants", self.source)
        self.assertIn("collections.all.products", self.source)
        self.assertIn("default: product", self.source)
        self.assertIn("products/' + mnProductHandle + '.js", self.source)
        self.assertIn("function isMonstiesCatalogProduct", self.source)
        self.assertIn("function loadVariants()", self.source)
        self.assertIn("cart/add.js", self.source)
        self.assertIn("selectedVariant.id", self.source)
        self.assertNotIn("collections.all.products.first", self.source)
        self.assertNotIn("|| products[0]", self.source)
        self.assertNotIn("mnFallbackVariantIds", self.source)
        self.assertNotIn("58841572704630", self.source)
        self.assertNotIn("setTimeout(function() {", self.source)

    def test_missing_product_urls_render_monsties_landing(self):
        not_found = (ROOT / "templates" / "404.json").read_text(encoding="utf-8")
        self.assertIn('"type": "monsties-landing"', not_found)
        self.assertIn("params.get('color')", self.source)

    def test_social_actions_have_interaction_hooks(self):
        self.assertGreaterEqual(self.source.count('data-social-action="like"'), 3)
        self.assertGreaterEqual(self.source.count('data-social-action="comment"'), 3)
        self.assertGreaterEqual(self.source.count('data-social-action="share"'), 3)

    def test_desktop_gallery_is_viewport_sticky(self):
        self.assertIn("@media (min-width: 901px)", self.source)
        self.assertIn("height: calc(100vh - 120px)", self.source)
        self.assertIn("align-self: start", self.source)
        self.assertIn("aspect-ratio: auto", self.source)

    def test_gallery_wrapper_does_not_trap_sticky_scroll(self):
        self.assertIn("overflow-x: clip", self.source)

    def test_mobile_product_layout_shows_gallery_then_buy_box(self):
        self.assertIn("object-fit: contain", self.source)
        self.assertIn(".mn-hero-grid {\n      display: flex;\n      flex-direction: column;", self.source)
        self.assertIn("class=\"mn-info-card\"", self.source)
        self.assertIn("class=\"mn-menu-btn\"", HEADER.read_text(encoding="utf-8"))
        self.assertNotIn("margin: -42vh 12px 0", self.source)
        self.assertNotIn(".mn-thumb-carousel {\n      display: none;", self.source)
        self.assertNotIn("max-width: 360px", self.source)
        self.assertNotIn("max-height: 46vh", self.source)
        self.assertIn("grid-template-columns: 36px minmax(0, 1fr) 58px", self.source)
        self.assertIn("padding-bottom: calc(12px + env(safe-area-inset-bottom)", self.source)

    def test_cart_drawer_is_connected_to_shopify_cart(self):
        header = HEADER.read_text(encoding="utf-8")
        self.assertIn('id="mnCartBtn"', header)
        self.assertIn('id="mnCartDrawer"', header)
        self.assertIn("cart/update.js", self.source)
        self.assertIn("mnCartLine", self.source)

    def test_search_opens_reference_style_overlay(self):
        header = HEADER.read_text(encoding="utf-8")
        self.assertIn('id="mnSearchBtn"', header)
        self.assertIn('id="mnSearchOverlay"', header)
        self.assertIn('id="mnSearchInput"', header)
        self.assertIn("routes.search_url", header)
        self.assertIn("products/monsties", header)
        self.assertIn("mn-search-submit-icon", self.source)
        self.assertIn(".mn-search-close {\n    position: absolute;", self.source)

    def test_search_shows_only_homepage_products_ranked(self):
        header = HEADER.read_text(encoding="utf-8")
        catalog = (ROOT / "snippets" / "monsties-search-catalog.liquid").read_text(encoding="utf-8")
        search_section = (ROOT / "sections" / "monsties-search.liquid").read_text(encoding="utf-8")
        search_template = (ROOT / "templates" / "search.json").read_text(encoding="utf-8")
        self.assertIn('"type": "monsties-search"', search_template)
        self.assertIn("render 'monsties-site-header'", search_section)
        self.assertIn("render 'monsties-search-catalog'", header)
        self.assertIn("render 'monsties-search-catalog'", search_section)
        for name in (
            "Monsties Onesie",
            "White Ultra",
            "Original Green",
            "Mango Loco",
            "Pipeline Punch",
            "Monster Plush",
        ):
            self.assertIn(name, catalog)
        self.assertNotIn("search.results", search_section)
        self.assertNotIn("collections.all", search_section)
        self.assertNotIn("Darbesh", catalog)
        self.assertIn("rankHomepageProducts", header)
        self.assertIn("id=\"mnHomepageProducts\"", catalog)
        self.assertIn("searchForm.addEventListener('submit'", header)
        self.assertIn("ranked[0].url", header)
        self.assertNotIn("Chena Tost", self.source)
        self.assertNotIn("chena", catalog.lower())

    def test_highlight_bullets_use_svg_icons_not_emoji(self):
        self.assertIn("Every Claw Detail Where It Should Be", self.source)
        self.assertIn("Griffin Print Chest to Back", self.source)
        self.assertIn("Pull Ring Canister, Not a Boring Box", self.source)
        self.assertIn("mn-bullet-icon", self.source)
        self.assertNotIn("🪶", self.source)
        self.assertNotIn("🫳", self.source)
        self.assertNotIn("⚡", self.source)

    def test_facebook_heading_does_not_use_unsupported_emoji(self):
        self.assertIn("Love from Our Facebook Community</h2>", self.source)
        self.assertNotIn("mn-heading-heart", self.source)
        self.assertNotIn("🫶", self.source)

    def test_faq_has_continuous_wave_transition(self):
        self.assertIn("@keyframes mnMoveForever1", self.source)
        self.assertIn("@keyframes mnMoveForever2", self.source)
        self.assertIn("@keyframes mnMoveForever3", self.source)
        self.assertIn("@keyframes mnMoveForever4", self.source)
        self.assertIn("animation: mnMoveForever1 10s linear infinite", self.source)
        self.assertIn("animation: mnMoveForever4 4s linear infinite", self.source)

    def test_all_dropdowns_open_with_slide_animation(self):
        self.assertIn(".mn-dropdown-menu", self.source)
        self.assertIn("transform: translateY(-8px)", self.source)
        self.assertIn(".mn-dropdown.open .mn-dropdown-menu", self.source)
        self.assertIn("enhanceAnimatedDropdowns", self.source)
        self.assertIn(".mn-bundle-color-select, .mn-bundle-size-select", self.source)
        self.assertIn("mn-dropdown-chevron", self.source)

    def test_dropdowns_have_hover_and_click_animation(self):
        self.assertIn(".mn-dropdown-trigger:hover", self.source)
        self.assertIn(".mn-dropdown-trigger:active", self.source)
        self.assertIn("transform: scale(0.97)", self.source)
        self.assertIn(".mn-dropdown.open .mn-dropdown-trigger", self.source)
        self.assertIn("transition: background 0.18s ease", self.source)


if __name__ == "__main__":
    unittest.main()
