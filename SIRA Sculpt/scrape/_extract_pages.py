import re, os
base = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live'
html = open(os.path.join(base,'shop.html'), encoding='utf-8').read()

# extract sira-collection section
m = re.search(r'(<div[^>]*sira-collection-section[\s\S]*?</div>\s*</div>\s*</div>)', html)
# fallback: from scol__ to footer
idx = html.find('class="scol')
print('scol idx', idx)
start = html.rfind('<', 0, idx)
# find wrapping section
sec = html.find('sira-collection')
print('section idx', sec)
chunk_start = html.rfind('<', 0, sec) if sec>=0 else idx-200
chunk = html[chunk_start:chunk_start+25000]
open(os.path.join(base,'shop_scol.html'),'w',encoding='utf-8').write(chunk)
print('chunk', len(chunk))

# CSS containing scol
css_blocks = re.findall(r'<style[^>]*>([\s\S]*?)</style>', html)
scol_css = []
for b in css_blocks:
    if 'scol' in b:
        scol_css.append(b)
open(os.path.join(base,'shop_scol.css'),'w',encoding='utf-8').write('\n\n/* ---- */\n\n'.join(scol_css))
print('css blocks', len(scol_css), 'chars', sum(len(x) for x in scol_css))

# extract product buy boxes / landing unique classes from each product
for name in ['leggings','shorts','oil','book']:
    h = open(os.path.join(base, name+'.html'), encoding='utf-8').read()
    classes = re.findall(r'class="([^"]+)"', h)
    from collections import Counter
    c = Counter()
    for cl in classes:
        for x in cl.split():
            if x.startswith(('ss','sc-','ssbb','ss-','scol','slp','oil','book','hb-','mbo','chafe','lip-')) or any(k in x for k in ['hero','faq','review','buy','ssbb']):
                c[x]+=1
    print('\n==', name, '==')
    for k,v in c.most_common(25):
        print(v, k)
    # styles with unique prefixes
    cssb = re.findall(r'<style[^>]*>([\s\S]*?)</style>', h)
    keep = [b for b in cssb if any(k in b for k in ['ssbb','sc-lp','ss-lp','chafe','mbo','handbook','hb-','oil-'])]
    open(os.path.join(base, name+'_styles.css'),'w',encoding='utf-8').write('\n\n'.join(keep[:8]))
    print('style chunks', len(keep), 'total styles', len(cssb))
