import os, re
root = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme'
def strip_schema(txt):
    return re.sub(r'\n\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}\s*', '\n', txt)

parts = []
for fn in ['ss-product-hero.liquid','ss-product-story.liquid']:
    parts.append(strip_schema(open(os.path.join(root,'sections',fn),encoding='utf-8').read()))
parts.append('\n{% render \'ss-buybox\' %}\n')
parts.append(strip_schema(open(os.path.join(root,'sections','ss-product-extra.liquid'),encoding='utf-8').read()))
open(os.path.join(root,'snippets','ss-pdp-leggings.liquid'),'w',encoding='utf-8').write('\n'.join(parts))
print('leggings snippet', sum(len(p) for p in parts))

# handle replacements in theme
repls = [
    ('/products/sirasculpt-3d-lipedema-leggings-drain-lighten', '/products/sira-sculpt-4d-lipedema-leggings-offer'),
    ('/products/sira-anti-cellulite-oil', '/products/sira-sculpt-magic-body-oil'),
    ('/products/sira-sculpt-3d-sculpting-sleeves', '/products/the-lipedema-handbook'),
    ("'sirasculpt-3d-lipedema-leggings-drain-lighten'", "'sira-sculpt-4d-lipedema-leggings-offer'"),
    ("'sira-anti-cellulite-oil'", "'sira-sculpt-magic-body-oil'"),
    ("'sira-sculpt-3d-sculpting-sleeves'", "'the-lipedema-handbook'"),
]
skip_ext = {'.png','.jpg','.jpeg','.gif','.webp','.mp4','.woff','.woff2'}
count = 0
for dirpath, dirs, files in os.walk(root):
    if 'node_modules' in dirpath: continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in skip_ext: continue
        if ext not in {'.liquid','.js','.json','.css'}: continue
        p = os.path.join(dirpath, f)
        t = open(p, encoding='utf-8', errors='ignore').read()
        nt = t
        for a,b in repls:
            nt = nt.replace(a,b)
        if nt != t:
            open(p,'w',encoding='utf-8').write(nt)
            count += 1
            print('updated', os.path.relpath(p, root))
print('files', count)
