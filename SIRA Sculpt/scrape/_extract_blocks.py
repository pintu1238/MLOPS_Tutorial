import re, os
base = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live'
out_dir = os.path.join(base, 'blocks')
os.makedirs(out_dir, exist_ok=True)

def grab(html, start_pat, end_pat=None, n=1):
    out = []
    pos = 0
    for _ in range(n):
        m = re.search(start_pat, html[pos:], re.I)
        if not m:
            break
        s = pos + m.start()
        if end_pat:
            m2 = re.search(end_pat, html[s+10:], re.I)
            e = s+10+m2.end() if m2 else min(len(html), s+80000)
        else:
            e = min(len(html), s+80000)
        out.append(html[s:e])
        pos = e
    return out

for name in ['leggings','shorts','oil','book']:
    h = open(os.path.join(base, name+'_main.html'), encoding='utf-8').read()
    # all style tags that mention our classes
    styles = re.findall(r'<style[^>]*>([\s\S]*?)</style>', h)
    keep = []
    keys = ['ssbb','ss-lp','sc-lp','ss-lp2','sc-lp2','ss-sticky','ssc-sticky','ssrt','scol','hb-','handbook','.faq','.reviews','.hero']
    for st in styles:
        if any(k in st for k in keys) and 'shopify-section-template' not in st[:80]:
            keep.append(st)
    open(os.path.join(out_dir, name+'_css.css'),'w',encoding='utf-8').write('\n\n/* === */\n\n'.join(keep))
    print(name, 'css chunks', len(keep), 'chars', sum(len(x) for x in keep))

    # custom roots
    for cls in ['ss-lp','sc-lp','ss-lp2','sc-lp2','ssbb','ss-sticky','ssc-sticky','ssrt']:
        idx = h.find('class="'+cls)
        if idx < 0:
            idx = h.find("class='"+cls)
        if idx < 0:
            continue
        # walk back to tag start
        s = h.rfind('<', 0, idx)
        # find matching by looking for next shopify-section or footer-ish
        chunk = h[s:s+120000]
        # trim at next shopify-section if present after 200 chars
        nxt = chunk.find('shopify-section', 200)
        if nxt > 0:
            chunk = chunk[:nxt]
        open(os.path.join(out_dir, f'{name}_{cls}.html'),'w',encoding='utf-8').write(chunk)
        print(' ', cls, len(chunk))

# download shop card images
import urllib.request
imgs = {
    'ss_card_leggings.png': 'https://sirasculpt.com/cdn/shop/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313&width=800',
    'ss_card_shorts.jpg': 'https://sirasculpt.com/cdn/shop/files/1_hero_shorts.jpg?v=1786765044&width=800',
    'ss_card_oil.jpg': 'https://sirasculpt.com/cdn/shop/files/ssm_packshot_f91fc84a-8e27-4131-b404-8dd0a909d2f7.jpg?v=1788861227&width=800',
    'ss_card_handbook.png': 'https://sirasculpt.com/cdn/shop/files/handbook_main.png?v=1788885331&width=800',
}
asset = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme\assets'
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent','Mozilla/5.0')]
for fn, url in imgs.items():
    path = os.path.join(asset, fn)
    try:
        data = opener.open(url, timeout=60).read()
        open(path,'wb').write(data)
        print('img', fn, len(data))
    except Exception as e:
        print('FAIL', fn, e)
