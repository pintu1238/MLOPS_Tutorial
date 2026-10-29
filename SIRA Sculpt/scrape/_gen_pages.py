# -*- coding: utf-8 -*-
import os, json, shutil
ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme"
SEC = os.path.join(ROOT, "sections")
TPL = os.path.join(ROOT, "templates")
EXT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted"
LAY = os.path.join(ROOT, "layout")

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", os.path.basename(path), len(content))

def schema(name, cls):
    return """
{%% schema %%}
{
  "name": "%s",
  "tag": "section",
  "class": "%s",
  "settings": [],
  "presets": [{ "name": "%s" }]
}
{%% endschema %%}
""" % (name, cls, name)

# CONTACT - reuse extracted markup without outer shopify-section wrapper
contact = open(os.path.join(EXT, "contact.html"), encoding="utf-8").read()
# strip outer shopify-section div
i = contact.find("<section")
j = contact.rfind("</section>")
contact_inner = contact[i:j+10] if i>=0 else contact
w(os.path.join(SEC, "ss-contact.liquid"), contact_inner + "\n" + schema("Sira Contact", "ss-contact"))

track = open(os.path.join(EXT, "track.html"), encoding="utf-8").read()
i = track.find("<section")
j = track.rfind("</script>")
# include section + scripts
k = track.find("<section")
# take from section through last script
scripts_end = track.rfind("</script>")
track_inner = track[k:scripts_end+9] if k>=0 else track
# keep style too
style_i = track.find("<style>")
style_j = track.rfind("</style>")
track_css = track[style_i:style_j+8] if style_i>=0 else ""
w(os.path.join(SEC, "ss-track.liquid"), track_inner + "\n" + track_css + "\n" + schema("Sira Track Order", "ss-track"))

# COLLECTION
w(os.path.join(SEC, "ss-collection.liquid"), r"""
<section class="sscol">
  <div class="sscol__wrap">
    <header class="sscol__head">
      <p class="sscol__eyebrow">Shop</p>
      <h1>{{ collection.title | default: 'Best Sellers' }}</h1>
      {% if collection.description != blank %}
        <div class="sscol__sub">{{ collection.description }}</div>
      {% else %}
        <p class="sscol__sub">The Sira Sculpt essentials women with heavy, achy legs keep reaching for. Real support for real bodies, sizes S to 5XL.</p>
      {% endif %}
    </header>
    <div class="sscol__grid">
      {% for product in collection.products %}
        <a class="pcard" href="{{ product.url }}">
          {% if product.featured_image %}
            <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.featured_image.alt | escape }}" loading="lazy">
          {% endif %}
          <div class="pc-b">
            <h3>{{ product.title }}</h3>
            <div class="pc-p">
              {{ product.price | money }}
              {% if product.compare_at_price > product.price %}
                <s>{{ product.compare_at_price | money }}</s>
              {% endif %}
            </div>
            <span class="pc-cta">Shop →</span>
          </div>
        </a>
      {% else %}
        {% assign handles = 'sirasculpt-3d-lipedema-leggings-drain-lighten,sira-sculpt-anti-chafing-3d-shorts,sira-anti-cellulite-oil,sira-sculpt-3d-sculpting-sleeves' | split: ',' %}
        {% for h in handles %}
          {% assign p = all_products[h] %}
          {% if p != empty %}
            <a class="pcard" href="{{ p.url }}">
              {% if p.featured_image %}<img src="{{ p.featured_image | image_url: width: 800 }}" alt="{{ p.title | escape }}" loading="lazy">{% endif %}
              <div class="pc-b"><h3>{{ p.title }}</h3><div class="pc-p">{{ p.price | money }}{% if p.compare_at_price > p.price %} <s>{{ p.compare_at_price | money }}</s>{% endif %}</div><span class="pc-cta">Shop →</span></div>
            </a>
          {% endif %}
        {% endfor %}
      {% endfor %}
    </div>
  </div>
</section>
""" + schema("Sira Collection", "ss-collection"))

# SEARCH RESULTS
w(os.path.join(SEC, "ss-search-results.liquid"), r"""
<section class="sssr">
  <h1>
    {% if search.performed %}
      {{ search.results_count }} results for “{{ search.terms | escape }}”
    {% else %}
      Search
    {% endif %}
  </h1>
  <form action="{{ routes.search_url }}" method="get" role="search" class="ss-search__row" style="max-width:560px;margin:18px 0 8px">
    <input class="ss-search__input" type="search" name="q" value="{{ search.terms | escape }}" placeholder="Search">
    <input type="hidden" name="type" value="product">
    <button class="ss-search__go" type="submit" aria-label="Search">Go</button>
  </form>
  <div class="sssr__grid">
    {% for item in search.results %}
      {% if item.object_type == 'product' %}
        <a class="pcard" href="{{ item.url }}" style="display:flex;flex-direction:column;text-decoration:none;color:inherit;background:#fff;border:1px solid #EDE3D8;border-radius:16px;overflow:hidden">
          {% if item.featured_image %}<img src="{{ item.featured_image | image_url: width: 800 }}" alt="{{ item.title | escape }}" style="width:100%;aspect-ratio:1/1;object-fit:cover">{% endif %}
          <div style="padding:14px">
            <h3 style="font-family:Poppins,sans-serif;font-size:15px;margin:0 0 6px;color:#4A2E3A">{{ item.title }}</h3>
            <div>{{ item.price | money }}</div>
            <span style="color:#B0654A;font-weight:700;font-size:13px">Shop →</span>
          </div>
        </a>
      {% endif %}
    {% else %}
      <p>No products found. Try another search.</p>
    {% endfor %}
  </div>
</section>
""" + schema("Sira Search Results", "ss-search-results"))

# GENERIC PAGE
w(os.path.join(SEC, "ss-page.liquid"), r"""
<section class="sspol">
  <div class="sspol__wrap">
    <h1>{{ page.title }}</h1>
    <div class="rte">{{ page.content }}</div>
  </div>
</section>
""" + schema("Sira Page", "ss-page"))

# PRODUCT HERO / STORY / DETAILS from extracted HTML
for src, dest, name, cls in [
    ("prod_sc_lp.html", "ss-product-hero.liquid", "Sira Product Hero", "ss-product-hero"),
    ("prod_ss_lp.html", "ss-product-story.liquid", "Sira Product Story", "ss-product-story"),
    ("prod_ss_lp2.html", "ss-product-extra.liquid", "Sira Product Extra", "ss-product-extra"),
]:
    html = open(os.path.join(EXT, src), encoding="utf-8").read()
    w(os.path.join(SEC, dest), html + "\n" + schema(name, cls))

# PRODUCT BUY - working ATC using current product
w(os.path.join(SEC, "ss-product-buy.liquid"), r"""
{% liquid
  assign current = product.selected_or_first_available_variant
  assign opt1 = product.options_with_values[0]
  assign opt2 = product.options_with_values[1]
%}
<link rel="stylesheet" href="{{ 'ss-product.css' | asset_url }}" media="all">
<div class="ssbb" id="ss-buy">
  <div class="ss-buybox" style="max-width:520px;margin:0 auto;padding:28px 18px 40px;font-family:Inter,sans-serif">
    <h2 style="font-family:Poppins,sans-serif;font-size:22px;color:#4A2E3A;margin:0 0 8px">{{ product.title }}</h2>
    <div style="font-size:22px;font-weight:800;margin:0 0 16px">
      {{ current.price | money }}
      {% if current.compare_at_price > current.price %}<s style="color:#ab9c92;font-size:15px;margin-left:6px">{{ current.compare_at_price | money }}</s>{% endif %}
    </div>
    {% form 'product', product, data-ss-atc-form: '' %}
      <input type="hidden" name="id" value="{{ current.id }}" data-ss-variant-id>
      {% if opt1 %}
        <label style="display:block;font-weight:600;margin:0 0 6px;color:#4A2E3A">{{ opt1.name }}</label>
        <select name="options[{{ opt1.name }}]" data-ss-opt="0" style="width:100%;margin:0 0 14px;padding:12px;border-radius:10px;border:1.5px solid #ece2d7;background:#fff">
          {% for v in opt1.values %}
            <option value="{{ v | escape }}" {% if current.option1 == v %}selected{% endif %}>{{ v }}</option>
          {% endfor %}
        </select>
      {% endif %}
      {% if opt2 %}
        <label style="display:block;font-weight:600;margin:0 0 6px;color:#4A2E3A">{{ opt2.name }}</label>
        <select name="options[{{ opt2.name }}]" data-ss-opt="1" style="width:100%;margin:0 0 14px;padding:12px;border-radius:10px;border:1.5px solid #ece2d7;background:#fff">
          {% for v in opt2.values %}
            <option value="{{ v | escape }}" {% if current.option2 == v %}selected{% endif %}>{{ v }}</option>
          {% endfor %}
        </select>
      {% endif %}
      <button class="atc" type="submit" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:#4A2E3A;color:#fff;border:0;border-radius:99px;padding:16px;font-weight:800;font-size:16px;cursor:pointer">Add to Cart</button>
      <p style="text-align:center;margin:12px 0 0;font-size:13px;color:#6a5c53">🔒 Secure Checkout · <b>90-Day</b> Money-Back Guarantee</p>
    {% endform %}
  </div>
</div>
<script>
  (function(){
    var map = {
      {% for v in product.variants %}
        {{ v.option1 | json }} + '||' + {{ v.option2 | json }}: {{ v.id }}{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
    var root = document.getElementById('ss-buy');
    if(!root) return;
    var idInput = root.querySelector('[data-ss-variant-id]');
    function sync(){
      var o0 = (root.querySelector('[data-ss-opt="0"]')||{}).value || 'null';
      var o1 = (root.querySelector('[data-ss-opt="1"]')||{}).value || 'null';
      var id = map[o0 + '||' + o1] || map[o0 + '||null'];
      if(id && idInput) idInput.value = id;
    }
    root.addEventListener('change', sync);
  })();
</script>
""" + schema("Sira Product Buy", "ss-product-buy"))

# CART PAGE
w(os.path.join(SEC, "ss-cart-page.liquid"), r"""
<section class="ss-cartpage">
  <h1>Your bag</h1>
  {% if cart.item_count == 0 %}
    <p>Your bag is empty.</p>
    <a class="ssh btn" href="/collections/best-sellers" style="display:inline-block;margin-top:16px">Shop Sira Sculpt →</a>
  {% else %}
    <form action="{{ routes.cart_url }}" method="post">
      {% for item in cart.items %}
        <div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #ece2d7">
          <a href="{{ item.url }}">{% if item.image %}<img src="{{ item.image | image_url: width: 160 }}" alt="" width="72" height="88" style="object-fit:cover;border-radius:8px">{% endif %}</a>
          <div style="flex:1">
            <a href="{{ item.url }}" style="font-weight:700;color:#26201C;text-decoration:none">{{ item.product.title }}</a>
            <div style="font-size:13px;color:#6a5c53">{{ item.variant.title }}</div>
            <div>{{ item.final_line_price | money }}</div>
          </div>
        </div>
      {% endfor %}
      <p style="font-weight:800;margin:18px 0">Subtotal {{ cart.total_price | money }}</p>
      <button type="submit" name="checkout" style="background:#4A2E3A;color:#fff;border:0;border-radius:99px;padding:14px 28px;font-weight:800;cursor:pointer">Checkout</button>
    </form>
  {% endif %}
</section>
""" + schema("Sira Cart Page", "ss-cart-page"))

print("pages/product done")
