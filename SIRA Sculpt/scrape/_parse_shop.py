import re, os
from collections import Counter
base = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live'
html = open(os.path.join(base, 'shop.html'), encoding='utf-8').read()
out = os.path.join(base, 'shop_report.txt')
lines = []
lines.append('len %d' % len(html))
for pat in ['card-wrapper','product-card','collection','grid__item','ss-shop','shop-card','pcard','save','badge','Shop Now','card__media']:
    lines.append('%s %d' % (pat, html.lower().count(pat.lower())))
classes = re.findall(r'class="([^"]+)"', html)
c = Counter()
for cl in classes:
    for x in cl.split():
        if any(k in x.lower() for k in ['card','product','grid','collect','badge','price','save','shop','media']):
            c[x] += 1
lines.append('--- classes ---')
for k,v in c.most_common(50):
    lines.append('%d %s' % (v,k))
# product images
imgs = re.findall(r'(https?:)?//[^"\s>]+\.(?:jpg|jpeg|png|webp)[^"\s>]*', html, re.I)
uniq = []
for u in imgs:
    if u not in uniq:
        uniq.append(u)
lines.append('--- imgs %d ---' % len(uniq))
for u in uniq[:80]:
    lines.append(u[:200])
# shop-now context
idx = html.find('Shop Now')
lines.append('--- shop now ctx ---')
if idx>=0:
    lines.append(html[max(0,idx-400):idx+200])
# save badge
idx = html.lower().find('save 41')
lines.append('--- save41 ---')
if idx>=0:
    lines.append(html[max(0,idx-500):idx+300])
open(out,'w',encoding='utf-8').write('\n'.join(lines))
print('wrote', out, 'lines', len(lines))
