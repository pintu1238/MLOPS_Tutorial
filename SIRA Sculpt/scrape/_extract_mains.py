import re, os
base = r'C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\live'

def extract_main(name):
    h = open(os.path.join(base, name+'.html'), encoding='utf-8').read()
    m = re.search(r'<main[\s\S]*?</main>', h, re.I)
    if not m:
        print(name, 'NO MAIN')
        return
    main = m.group(0)
    # strip header-group leftovers if any
    open(os.path.join(base, name+'_main.html'),'w',encoding='utf-8').write(main)
    print(name, 'main', len(main))
    # list shopify sections inside main
    secs = re.findall(r'class="shopify-section[^"]*"', main)
    print('  sections', len(secs))
    ids = re.findall(r'id="shopify-section-([^"]+)"', main)
    for i in ids[:20]:
        print('   ', i[:80])

for n in ['leggings','shorts','oil','book']:
    extract_main(n)
