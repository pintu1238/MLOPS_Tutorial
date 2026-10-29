const HANDLES = [
  'gp-ella-leather-tote','gp-rose-crossbody','gp-gold-evening-clutch','gp-camel-satchel','gp-burgundy-hobo',
  'gp-chain-shoulder-bag','gp-mini-top-handle','gp-saddle-crossbody','gp-studio-shopper','gp-woven-beach-tote',
  'gp-gianna-sml-black','gp-gianna-sml-cherry','gp-gianna-sml-espresso','gp-luna-grommet','gp-sloane-lock',
  'gp-maren-curve','gp-paloma-raffia','gp-grommet-strap','gp-na-aria-flap','gp-na-belle-chain',
  'gp-na-dahlia-bucket','gp-na-elise-handle','gp-na-greta-hobo','gp-na-hazel-satchel','gp-na-iris-shoulder',
  'gp-na-june-crescent',
];
const PREVIEW = '154709033029';
let bad = 0;
for (const handle of HANDLES) {
  const html = await fetch(`https://y9yn6k-me.myshopify.com/products/${handle}?preview_theme_id=${PREVIEW}`).then((r) => r.text());
  const parts = html.split('data-gw-gallery-thumb');
  const urls = [];
  for (let i = 1; i < parts.length; i++) {
    const m = parts[i].match(/src="([^"]+)"/);
    if (m) urls.push(m[1].startsWith('//') ? `https:${m[1]}` : m[1]);
  }
  let fail = 0;
  for (const u of urls.slice(0, 8)) {
    const res = await fetch(u.split('&width=')[0], { method: 'HEAD' });
    if (!res.ok) fail++;
  }
  const fw = urls.some((u) => u.includes('fw-pdp-'));
  const flag = fail || fw || urls.length < 8 ? ' BAD' : '';
  if (flag) bad++;
  console.log(handle.padEnd(28), `thumbs=${urls.length}`, `httpFail=${fail}`, `fw-pdp=${fw}${flag}`);
}
console.log('\nProblems:', bad);
