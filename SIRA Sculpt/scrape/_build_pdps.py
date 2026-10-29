import os, re, shutil

root = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt'
blocks = os.path.join(root, 'scrape', 'live', 'blocks')
snip = os.path.join(root, 'theme', 'snippets')
assets = os.path.join(root, 'theme', 'assets')

def read(p):
    return open(p, encoding='utf-8').read()

def write(p, s):
    open(p, 'w', encoding='utf-8').write(s)
    print('wrote', p, len(s))

def inner_div(html, cls):
    m = re.search(r'<div class="%s"[\s\S]*' % re.escape(cls), html)
    if not m:
        return html
    chunk = m.group(0)
    # cut at next shopify-section
    cut = chunk.find('<section id="shopify-section')
    if cut > 200:
        chunk = chunk[:cut]
    # also cut product-modal
    cut = chunk.find('<product-modal')
    if cut > 200:
        chunk = chunk[:cut]
    return chunk.strip()

# CSS concat
css_parts = []
for fn in ['shorts_css.css']:
    p = os.path.join(blocks, fn)
    if os.path.exists(p):
        css_parts.append(read(p))
# from bottoms extract <style>
for fn in ['shorts_bottom.html','oil_bottom.html','book_bottom.html']:
    h = read(os.path.join(blocks, fn))
    for st in re.findall(r'<style>([\s\S]*?)</style>', h):
        if len(st) > 200:
            css_parts.append(st)
# oil top css
oil_css = os.path.join(root, 'scrape', 'live', 'oil_styles.css')
if os.path.exists(oil_css):
    css_parts.append(read(oil_css))
# hb styles from book_main
book_main = read(os.path.join(root, 'scrape', 'live', 'book_main.html'))
for st in re.findall(r'<style>([\s\S]*?)</style>', book_main):
    if '.hb{' in st or '.hb ' in st[:200]:
        css_parts.append(st)

css = '\n\n'.join(css_parts)
# strip @import duplicates later ok
write(os.path.join(assets, 'ss-pdp.css'), css)

# shorts snippet
shorts_top = inner_div(read(os.path.join(blocks, 'shorts_ss-lp.html')), 'ss-lp')
shorts_bot = inner_div(read(os.path.join(blocks, 'shorts_bottom.html')), 'ss-lp2')
# insert buybox render at #ss-buy
shorts_top = shorts_top.replace('<div id="ss-buy"></div>', '{% render \'ss-buybox\' %}')
if '{% render' not in shorts_top:
    shorts_top += '\n{% render \'ss-buybox\' %}\n'
write(os.path.join(snip, 'ss-pdp-shorts.liquid'), shorts_top + '\n' + shorts_bot)

# oil
oil_main = read(os.path.join(root, 'scrape', 'live', 'oil_main.html'))
oil_top = inner_div(oil_main, 'sc-lp')
# oil_top may be huge including ticker etc - good
oil_bot = inner_div(read(os.path.join(blocks, 'oil_bottom.html')), 'sc-lp2')
if 'ss-buybox' not in oil_top:
    oil_top += '\n{% render \'ss-buybox\' %}\n'
write(os.path.join(snip, 'ss-pdp-oil.liquid'), oil_top + '\n' + oil_bot)

# book
hb = inner_div(read(os.path.join(blocks, 'book_hb.html')), 'hb')
# clean dawn leftovers
hb = re.split(r'<a href="/products/the-lipedema-handbook" class="link', hb)[0]
hb2 = inner_div(read(os.path.join(blocks, 'book_bottom.html')), 'hb2')
# replace hardcoded form with buybox
hb = re.sub(r'<form method="post" action="/cart/add">[\s\S]*?</form>', '{% render \'ss-buybox\' %}', hb, count=1)
book_gal = '''
<div class="ss-bookgal">
  <div class="ss-bookgal__main">
    <img src="//sirasculpt.com/cdn/shop/files/handbook_main.png?v=1788885331&width=900" alt="The Lipedema Handbook" width="600" height="600">
  </div>
  <div class="ss-bookgal__thumbs">
    <img src="//sirasculpt.com/cdn/shop/files/handbook_main.png?v=1788885331&width=200" alt="">
    <img src="//sirasculpt.com/cdn/shop/files/handbook_inside.png?v=1788885331&width=200" alt="">
    <img src="//sirasculpt.com/cdn/shop/files/handbook_devices.png?v=1788885331&width=200" alt="">
    <img src="//sirasculpt.com/cdn/shop/files/handbook_angle.png?v=1788885331&width=200" alt="">
  </div>
</div>
<style>
.ss-bookgal{max-width:520px;margin:0 auto;padding:18px 16px 0}
.ss-bookgal__main img{width:100%;border-radius:16px;background:#f6ecef}
.ss-bookgal__thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.ss-bookgal__thumbs img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px}
@media(min-width:900px){
  .ss-bookwrap{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;max-width:1120px;margin:0 auto;padding:28px 20px}
}
</style>
<div class="ss-bookwrap">
'''
write(os.path.join(snip, 'ss-pdp-book.liquid'), book_gal + hb + '</div>\n' + hb2)

print('done')
