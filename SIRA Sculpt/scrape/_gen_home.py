# -*- coding: utf-8 -*-
import os
ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme"
SEC = os.path.join(ROOT, "sections")
TPL = os.path.join(ROOT, "templates")
EXT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted"

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

# TICKER
w(os.path.join(SEC, "ss-ticker.liquid"), r"""
<div class="ssh">
  <div class="trust" aria-label="Why women love Sira Sculpt">
    <div class="trust-track">
      <span>✅ <b>90-Day</b> Money-Back Guarantee</span><span>🩳 <b>Squat-Proof</b> · S–5XL</span><span>⭐ Loved by <b>25,000+</b> Women</span><span>✨ Instantly Smoother & Lifted</span><span>🤍 Soft, All-Day Comfort</span><span>🍑 3D Sculpting Knit</span>
      <span aria-hidden="true">✅ <b>90-Day</b> Money-Back Guarantee</span><span aria-hidden="true">🩳 <b>Squat-Proof</b> · S–5XL</span><span aria-hidden="true">⭐ Loved by <b>25,000+</b> Women</span><span aria-hidden="true">✨ Instantly Smoother & Lifted</span><span aria-hidden="true">🤍 Soft, All-Day Comfort</span><span aria-hidden="true">🍑 3D Sculpting Knit</span>
    </div>
  </div>
</div>
""" + schema("Sira Ticker", "ss-ticker"))

# HERO
w(os.path.join(SEC, "ss-hero.liquid"), r"""
<div class="ssh">
  <section class="hero">
    <div class="hero-txt reveal">
      <div class="eyebrow">Sira Sculpt · 3D Compression</div>
      <h1>Smoother, lifted legs the <span class="accent">second</span> you pull them on.</h1>
      <p>Firmer-looking thighs, a lifted booty and a held-in tummy, instantly. No creams, no routines, no waiting. Just pull them on and walk out feeling snatched.</p>
      <a class="btn" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">Shop Sira Sculpt →</a>
      <div class="rating"><span class="stars">★★★★★</span> &nbsp;Loved by 25,000+ women</div>
    </div>
    <img src="{{ 'ss_hero_leggings.png' | asset_url }}" alt="Sira Sculpt 3D Anti-Cellulite Leggings">
  </section>
</div>
""" + schema("Sira Hero", "ss-hero"))

# BENEFITS
w(os.path.join(SEC, "ss-benefits.liquid"), r"""
<div class="ssh">
  <div class="wrap">
    <div class="ben">
      <div class="card reveal"><div class="ic">🍑</div><h3>Instantly lifted</h3><p>The sculpt-seam cradles and lifts for a rounder, perkier shape the moment they are on.</p></div>
      <div class="card reveal"><div class="ic">✨</div><h3>Visibly smoother</h3><p>3D micro-massage compression softens the look of dimples and cellulite on sight.</p></div>
      <div class="card reveal"><div class="ic">🫶</div><h3>Snatched & comfy</h3><p>A high, stay-put waistband flattens your tummy without digging, rolling or sliding down.</p></div>
    </div>
  </div>
</div>
""" + schema("Sira Benefits", "ss-benefits"))

# SPLIT how it works
w(os.path.join(SEC, "ss-how-it-works.liquid"), r"""
<div class="ssh">
  <div class="band clay"><div class="wrap"><div class="split reveal">
    <img src="{{ 'ss_split_zones.png' | asset_url }}" alt="Graduated compression zones">
    <div>
      <div class="eyebrow">How it works</div>
      <h2>A legging that works while you walk.</h2>
      <p>Hundreds of raised 3D contact points give a gentle micro-massage with every step, supporting healthy circulation and lymphatic drainage so your skin looks firmer and smoother over time. Not a cream. Not a cure. Real, visible sculpting.</p>
      <a class="btn" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">See the leggings →</a>
    </div>
  </div></div></div>
</div>
""" + schema("Sira How It Works", "ss-how"))

# ZONES
w(os.path.join(SEC, "ss-zones.liquid"), r"""
<div class="ssh">
  <div class="wrap"><div class="split rev reveal" style="padding:60px 0">
    <img src="{{ 'ss_split_knit.png' | asset_url }}" alt="3D sculpting knit texture">
    <div>
      <div class="eyebrow">Engineered, not printed</div>
      <h2>Four sculpting zones in one seamless knit.</h2>
      <p>A scrunch-lift seam to round the glutes, 3D micro-massage bands across the thighs, graduated compression from ankle to waist, and a second-skin waistband that never rolls. S–5XL, squat-proof and 100% opaque.</p>
    </div>
  </div></div>
</div>
""" + schema("Sira Sculpting Zones", "ss-zones"))

# RANGE
w(os.path.join(SEC, "ss-range.liquid"), r"""
<div class="ssh">
  <div class="wrap" style="padding:46px 0 6px">
    <div style="text-align:center;max-width:600px;margin:0 auto 26px">
      <div class="eyebrow">The full range</div>
      <h2 style="font-size:clamp(26px,4vw,32px);margin:0 0 8px">Complete your Sira Sculpt routine</h2>
      <p style="color:#5a4c44">Everything to smooth, support and love your body, honestly.</p>
    </div>
    <div class="shopgrid">
      <a class="pcard" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">
        <img src="{{ 'ss_hero_leggings.png' | asset_url }}" alt="Sira Sculpt 3D Lipedema Leggings" loading="lazy">
        <div class="pc-b"><h3>3D Lipedema Leggings</h3><div class="pc-p">$64.95 <s>$109.95</s></div><span class="pc-cta">Shop →</span></div>
      </a>
      <a class="pcard" href="/products/sira-sculpt-anti-chafing-3d-shorts">
        <img src="{{ 'ss_prod_shorts.png' | asset_url }}" alt="Sira Sculpt Anti-Chafing 3D Shorts" loading="lazy">
        <div class="pc-b"><h3>Anti-Chafing 3D Shorts</h3><div class="pc-p">$49.95 <s>$89.95</s></div><span class="pc-cta">Shop →</span></div>
      </a>
      <a class="pcard" href="/products/sira-anti-cellulite-oil">
        <img src="{{ 'ss_prod_oil.png' | asset_url }}" alt="Sira Sculpt Anti-Cellulite Oil" loading="lazy">
        <div class="pc-b"><h3>Anti-Cellulite Oil</h3><div class="pc-p">$40.95 <s>$69.95</s></div><span class="pc-cta">Shop →</span></div>
      </a>
      <a class="pcard" href="/products/sira-sculpt-3d-sculpting-sleeves">
        <img src="{{ 'ss_prod_sleeve.png' | asset_url }}" alt="Sira Sculpt 3D Sculpting Sleeves" loading="lazy">
        <div class="pc-b"><h3>3D Sculpting Sleeves</h3><div class="pc-p">$33.95 <s>$59.95</s></div><span class="pc-cta">Shop →</span></div>
      </a>
    </div>
  </div>
</div>
""" + schema("Sira Product Range", "ss-range"))

# GUARANTEE
w(os.path.join(SEC, "ss-guarantee.liquid"), r"""
<div class="ssh">
  <div class="guar">
    <h2 class="reveal">Wear them 90 days. Love them or your money back.</h2>
    <p class="reveal">Free easy returns and free size swaps. Zero risk, the only thing you have to lose is the dimples.</p>
    <a class="btn reveal" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">Try Sira Sculpt Risk-Free →</a>
  </div>
</div>
""" + schema("Sira Guarantee", "ss-guarantee"))

# CTA
w(os.path.join(SEC, "ss-cta.liquid"), r"""
<div class="ssh">
  <div class="cta"><div class="wrap reveal" style="max-width:640px">
    <div class="pill">Best-Seller · 40% Off This Week</div>
    <h2>Ready to feel snatched?</h2>
    <p style="margin-bottom:24px;color:#5a4c44">Join 25,000+ women who smoothed, lifted and sculpted the easy way.</p>
    <a class="btn" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">Shop Now →</a>
  </div></div>
</div>
""" + schema("Sira Final CTA", "ss-cta"))

print("homepage sections done")
