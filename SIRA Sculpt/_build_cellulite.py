# -*- coding: utf-8 -*-
import re, urllib.request
from pathlib import Path

root = Path(r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt")
theme = root / "theme"
live = root / "scrape" / "live"
blocks = live / "blocks"
blocks.mkdir(parents=True, exist_ok=True)

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read().decode("utf-8", "replace")

def grab(html, start_pat, end_pat):
    m = re.search(start_pat, html)
    if not m:
        return ""
    start = m.start()
    em = re.search(end_pat, html[m.end():])
    if not em:
        return html[start:]
    return html[start:m.end() + em.start()]

def inner_div(html, cls):
    m = re.search(r'<div class="%s">' % re.escape(cls), html)
    if not m:
        return ""
    chunk = html[m.start():]
    cut = chunk.find('<section id="shopify-section')
    if cut > 200:
        chunk = chunk[:cut]
    cut = chunk.find('<div id="shopify-section')
    if 200 < cut < len(chunk):
        chunk = chunk[:cut]
    return chunk.strip()

cell_html = (live / "cellulite.html").read_text(encoding="utf-8")

# CSS from live top + bottom
css_parts = []
for st in re.findall(r"<style>([\s\S]*?)</style>", cell_html):
    if ".sc-lp" in st or ".sc-lp2" in st or ".ssc-sticky" in st:
        # drop shopify padding wrappers
        if "section-template--" in st and len(st) < 400:
            continue
        css_parts.append(st.strip())

extra_css = r"""
/* cellulite extras that oil CSS does not cover */
.sc-lp .tick-item img{width:22px;height:22px;object-fit:contain;filter:brightness(0) saturate(100%);opacity:.65}
.sc-lp .how-card .icq img{width:26px;height:26px;object-fit:contain;filter:brightness(0) invert(1);opacity:.9}
.sc-lp .how-visual{max-width:none;margin-bottom:18px}
.sc-lp .tl{margin-top:26px}
.sc-lp .tl-k{text-align:center;font-size:11.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#E8C7D1;margin-bottom:14px}
.sc-lp .tl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.sc-lp .tl-i{background:#F8F5F1;border-radius:14px;padding:16px;box-shadow:0 6px 18px rgba(0,0,0,.25)}
.sc-lp .tl-i .d{display:inline-block;background:var(--cm,#7E3B4C);color:#fff;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:100px;padding:4px 11px;margin-bottom:9px}
.sc-lp .tl-i p{font-size:13px;font-weight:400;color:#6A625D;line-height:1.5}
.sc-lp .tl-i p b{color:#211C1A;font-weight:600}
@media(max-width:860px){.sc-lp .tl-grid{grid-template-columns:1fr 1fr;gap:10px}.sc-lp .tl-i{padding:14px}}
@media(max-width:460px){.sc-lp .tl-i p{font-size:12px}}
.sc-lp2 .tick-item img{width:22px;height:22px;object-fit:contain;filter:brightness(0) saturate(100%);opacity:.65}
.sc-lp2 .zigs{padding:60px 0;background:#fff}
.sc-lp2 .zig{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;margin-bottom:52px}
.sc-lp2 .zig:last-of-type{margin-bottom:0}
.sc-lp2 .zig.flip .z-img{order:2}
.sc-lp2 .zig .z-img{overflow:hidden;border-radius:16px}
.sc-lp2 .zig .z-img img{border-radius:16px;box-shadow:0 14px 36px rgba(33,28,26,.12);width:100%}
.sc-lp2 .zig .z-num{font-size:11.5px;font-weight:600;letter-spacing:.14em;color:var(--cm,#7E3B4C);text-transform:uppercase;margin-bottom:9px}
.sc-lp2 .zig h3{font-size:23px;margin-bottom:11px}
.sc-lp2 .zig h3 .em{color:var(--cm,#7E3B4C)}
.sc-lp2 .zig p{font-size:15px;font-weight:300;color:var(--sub,#6A625D);margin-bottom:13px}
.sc-lp2 .zig p b{color:var(--ink,#211C1A);font-weight:600}
.sc-lp2 .zig .zc{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:var(--cm-2,#5F2C39);background:var(--chip,#F4EBE6);border-radius:100px;padding:6px 14px}
@media(max-width:860px){.sc-lp2 .zigs{padding:42px 0}.sc-lp2 .zig{grid-template-columns:1fr;gap:16px;margin-bottom:38px}.sc-lp2 .zig.flip .z-img{order:0}.sc-lp2 .zig h3{font-size:19px}}
.sc-lp2 .basics{max-width:720px;margin:48px auto 0;background:var(--soft,#F8F5F1);border:1px solid var(--line,#ECE6E0);border-radius:16px;padding:22px 24px}
.sc-lp2 .basics b.t{display:block;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--cm,#7E3B4C);margin-bottom:11px}
.sc-lp2 .basics li{list-style:none;display:flex;gap:10px;font-size:14px;font-weight:300;margin-bottom:7px;color:var(--ink,#211C1A)}
.sc-lp2 .basics li:last-child{margin-bottom:0}
.sc-lp2 .basics .ck{color:#3f7d5a;font-weight:700;flex:none}
.sc-lp2 .router{padding:56px 0;background:#fff}
.sc-lp2 .rt-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.sc-lp2 .rt{background:#fff;border:1px solid var(--line,#ECE6E0);border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(33,28,26,.04);transition:.25s}
.sc-lp2 .rt:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(33,28,26,.09)}
.sc-lp2 .rt .tag{display:inline-block;background:var(--chip,#F4EBE6);color:var(--cm-2,#5F2C39);font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:100px;margin-bottom:11px}
.sc-lp2 .rt h3{font-size:17px;margin-bottom:7px;line-height:1.3}
.sc-lp2 .rt p{font-size:13.5px;font-weight:300;color:var(--sub,#6A625D)}
@media(max-width:760px){.sc-lp2 .router{padding:42px 0}.sc-lp2 .rt-grid{grid-template-columns:1fr;gap:10px}}
.sc-lp2 .honest{padding:56px 0;background:var(--soft,#F8F5F1);border-top:1px solid var(--line,#ECE6E0)}
.sc-lp2 .hn-card{max-width:820px;margin:0 auto;background:#fff;border:1px solid var(--line,#ECE6E0);border-left:4px solid var(--cm,#7E3B4C);border-radius:16px;padding:26px 28px;box-shadow:0 2px 12px rgba(33,28,26,.04)}
.sc-lp2 .hn-card h2{font-size:21px;margin-bottom:16px}
.sc-lp2 .hn-grid{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.sc-lp2 .hn h3{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:var(--cm,#7E3B4C);margin-bottom:10px}
.sc-lp2 .hn li{list-style:none;padding:5px 0 5px 26px;position:relative;font-size:13.5px;font-weight:300;color:var(--sub,#6A625D)}
.sc-lp2 .hn.no-l li:before{content:"✕";position:absolute;left:2px;color:#b56;font-weight:700}
.sc-lp2 .hn.yes-l li:before{content:"✓";position:absolute;left:2px;color:#3f7d5a;font-weight:700}
@media(max-width:760px){.sc-lp2 .honest{padding:42px 0}.sc-lp2 .hn-grid{grid-template-columns:1fr;gap:16px}.sc-lp2 .hn-card{padding:20px}}
.ss-cell-gal{max-width:1120px;margin:0 auto;padding:8px 20px 28px}
.ss-cell-gal__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.ss-cell-gal__grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;background:#f6ecef}
@media(max-width:700px){.ss-cell-gal__grid{grid-template-columns:repeat(2,1fr)}}
#ssc-buy{height:auto!important;min-height:0}
"""

css_out = "\n\n".join(css_parts) + "\n\n" + extra_css
(theme / "assets" / "ss-pdp-cellulite.css").write_text(css_out, encoding="utf-8")
print("css", len(css_out))

# TOP: sc-lp through empty ssc-buy
top = grab(cell_html, r'<div class="sc-lp">', r'<div id="ssc-buy"></div>')
if not top.endswith('<div id="ssc-buy"></div>'):
    top = top + '\n<div id="ssc-buy"></div>'

sticky = grab(cell_html, r'<div class="ssc-sticky">', r'</script>')
# include the script that follows sticky
sm = re.search(r'<div class="ssc-sticky">[\s\S]*?</script>', cell_html)
sticky = sm.group(0) if sm else sticky

bot = grab(cell_html, r'<div class="sc-lp2">', r'</script>')
bm = re.search(r'<div class="sc-lp2">[\s\S]*?</script>\s*</div>', cell_html)
if bm:
    bot = bm.group(0)
else:
    bot = inner_div(cell_html, "sc-lp2")

gallery = r'''
<div class="ss-cell-gal">
  <div class="ss-cell-gal__grid">
    {% if product.media.size > 0 %}
      {% for media in product.media limit: 8 %}
        {% if media.media_type == 'image' %}
          <img src="{{ media | image_url: width: 600 }}" alt="{{ media.alt | escape }}" loading="lazy" width="280" height="280">
        {% elsif media.media_type == 'video' or media.media_type == 'external_video' %}
          {{ media | video_tag: image_size: '600x', autoplay: true, loop: true, muted: true, controls: false }}
        {% endif %}
      {% endfor %}
    {% else %}
      <img src="//sirasculpt.com/cdn/shop/files/ssc_pushup.jpg?v=1786770771" alt="Knit-in lift" loading="lazy">
      <img src="//sirasculpt.com/cdn/shop/files/ssc_knit.jpg?v=1786770763" alt="Raised 3D knit" loading="lazy">
      <img src="//sirasculpt.com/cdn/shop/files/ssc_graduated.jpg?v=1786770748" alt="Graduated compression" loading="lazy">
      <img src="//sirasculpt.com/cdn/shop/files/ssc_pocket.jpg?v=1786770766" alt="Side pocket" loading="lazy">
    {% endif %}
  </div>
</div>
'''

# Keep live #ssc-buy as a scroll target; buybox sits under gallery so height:42px cannot clip it.
top = top.replace(
    '<div id="ssc-buy"></div>',
    '<div id="ssc-buy"></div>\n</div>\n' + gallery + '\n{% render \'ss-buybox\' %}\n'
)
# top already opened <div class="sc-lp"> — we closed it before gallery. Good.

liquid = (
    "{{ 'ss-pdp-cellulite.css' | asset_url | stylesheet_tag }}\n"
    + top
    + "\n"
    + sticky
    + "\n"
    + bot
    + "\n"
)
outp = theme / "snippets" / "ss-pdp-cellulite.liquid"
outp.write_text(liquid, encoding="utf-8")
print("wrote", outp, len(liquid))

# -------- offer pages --------
offers = {
    "lipedema-offer": "https://sirasculpt.com/products/sira-sculpt-4d-lipedema-leggings-offer",
    "lymphedema": "https://sirasculpt.com/products/sira-sculpt-4d-compression-leggings-for-lymphedema",
    "varicose": "https://sirasculpt.com/products/sira-sculpt-4d-compression-leggings-for-varicose-veins",
    "tired": "https://sirasculpt.com/products/sira-sculpt-4d-compression-leggings-for-tired-swollen-legs",
    "nurses": "https://sirasculpt.com/products/sira-sculpt-4d-compression-leggings-for-nurses",
    "brief": "https://sirasculpt.com/products/sira-sculpt-belly-brief-offer",
    "csection": "https://sirasculpt.com/products/sira-sculpt-belly-brief-c-section-offer",
    "mom-pooch": "https://sirasculpt.com/products/sira-sculpt-belly-brief-mom-pooch-offer",
    "meno": "https://sirasculpt.com/products/sira-sculpt-belly-brief-meno-offer",
}

# reuse already fetched nurses/briefs
cached = {
    "nurses": live / "nurses.html",
    "brief": live / "briefs.html",
}

offer_keys = []
for key, url in offers.items():
    p = cached.get(key)
    if p and p.exists():
        html = p.read_text(encoding="utf-8")
        print("cache", key)
    else:
        print("FETCH", key)
        html = fetch(url)
        (live / f"{key}.html").write_text(html, encoding="utf-8")
    m = re.search(r'<div class="ss-lp2">[\s\S]*?(?=<div id="shopify-section-promo-popup"|</main>)', html)
    body = m.group(0) if m else inner_div(html, "ss-lp2")
    # trim leftover wrappers
    body = re.split(r'<div id="shopify-section', body)[0].strip()
    snip = theme / "snippets" / f"ss-pdp-offer-{key}.liquid"
    snip.write_text(body + "\n", encoding="utf-8")
    offer_keys.append(key)
    print("  offer snippet", snip.name, len(body))

router = r'''{% comment %} Offer landings: gallery + buy + audience-specific story. {% endcomment %}
{% liquid
  assign h = product.handle | downcase
%}
<div class="ss-cell-gal">
  <div class="ss-cell-gal__grid">
    {% if product.media.size > 0 %}
      {% for media in product.media limit: 8 %}
        {% if media.media_type == 'image' %}
          <img src="{{ media | image_url: width: 600 }}" alt="{{ media.alt | escape }}" loading="lazy" width="280" height="280">
        {% endif %}
      {% endfor %}
    {% endif %}
  </div>
</div>
<div id="ss-buy">{% render 'ss-buybox' %}</div>
<div class="ss-sticky"><div class="in"><div class="info"><div class="name">{{ product.title }}</div><div class="sub"><span class="st">★★★★★</span> 4.7 · Buy 1, Get 1 FREE Today</div></div><a class="cta" href="#ss-buy">Check Availability</a></div></div>
<script>(function(){var b=document.querySelector('.ss-sticky');if(b&&!b.dataset.ss){b.dataset.ss=1;var t=function(){b.classList.toggle('show',window.scrollY>480);};window.addEventListener('scroll',t,{passive:true});t();}
if(!window.__ssScroll){window.__ssScroll=1;document.addEventListener('click',function(e){var a=e.target.closest('a[href="#ss-buy"], .ss-sticky a.cta');if(!a)return;var tg=document.getElementById('ssTiers')||document.querySelector('.ssbb')||document.getElementById('ss-buy');if(tg){e.preventDefault();window.scrollTo({top:tg.getBoundingClientRect().top+window.pageYOffset-72,behavior:'smooth'});}},false);}})();</script>
{% if h contains 'nurses' %}
  {% render 'ss-pdp-offer-nurses' %}
{% elsif h contains 'lymphedema' %}
  {% render 'ss-pdp-offer-lymphedema' %}
{% elsif h contains 'varicose' %}
  {% render 'ss-pdp-offer-varicose' %}
{% elsif h contains 'tired' or h contains 'swollen' %}
  {% render 'ss-pdp-offer-tired' %}
{% elsif h contains 'c-section' or h contains 'csection' %}
  {% render 'ss-pdp-offer-csection' %}
{% elsif h contains 'mom-pooch' or h contains 'mom_pooch' %}
  {% render 'ss-pdp-offer-mom-pooch' %}
{% elsif h contains 'meno' %}
  {% render 'ss-pdp-offer-meno' %}
{% elsif h contains 'brief' %}
  {% render 'ss-pdp-offer-brief' %}
{% else %}
  {% render 'ss-pdp-offer-lipedema-offer' %}
{% endif %}
'''
(theme / "snippets" / "ss-pdp-offer.liquid").write_text(router, encoding="utf-8")
print("offer router written")
print("done")
