import re, os
base = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live'
out = os.path.join(base, 'blocks')

def section_from(html, marker):
    i = html.find(marker)
    if i < 0:
        return None
    # from this shopify-section start
    s = html.rfind('<section', 0, i+10)
    # until next shopify-section or </main>
    nxt = html.find('id="shopify-section-', s+20)
    end = html.find('</main>', s)
    e = min(x for x in [nxt if nxt>0 else 10**12, end if end>0 else 10**12] if x > s+20)
    if e > 10**11:
        e = min(len(html), s+90000)
    return html[s:e]

for name, fname, marker in [
    ('shorts','shorts_main.html','__ss_bottom_b'),
    ('oil','oil_main.html','__ss_bottom_b'),
    ('book','book_main.html','__ss_bottom_b'),
    ('leggings','leggings_main.html','__ss_bottom_offer'),
    ('leggings2','leggings_main.html','__ss_mech_b'),
]:
    h = open(os.path.join(base, fname), encoding='utf-8').read()
    chunk = section_from(h, marker)
    path = os.path.join(out, name+'_bottom.html')
    if chunk:
        open(path,'w',encoding='utf-8').write(chunk)
        print(name, len(chunk))
    else:
        print(name, 'MISSING')

# also extract hb from book main
h = open(os.path.join(base,'book_main.html'), encoding='utf-8').read()
i = h.find('<div class="hb">')
print('hb idx', i)
if i>=0:
    open(os.path.join(out,'book_hb.html'),'w',encoding='utf-8').write(h[i:i+8000])
