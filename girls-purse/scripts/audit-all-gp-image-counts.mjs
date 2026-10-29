const HANDLES = [
  'gp-ella-leather-tote','gp-rose-crossbody','gp-gold-evening-clutch','gp-camel-satchel','gp-burgundy-hobo',
  'gp-chain-shoulder-bag','gp-mini-top-handle','gp-saddle-crossbody','gp-studio-shopper','gp-woven-beach-tote',
  'gp-gianna-sml-black','gp-gianna-sml-cherry','gp-gianna-sml-espresso','gp-luna-grommet','gp-sloane-lock',
  'gp-maren-curve','gp-paloma-raffia','gp-grommet-strap','gp-na-aria-flap','gp-na-belle-chain',
  'gp-na-dahlia-bucket','gp-na-elise-handle','gp-na-greta-hobo','gp-na-hazel-satchel','gp-na-iris-shoulder',
  'gp-na-june-crescent',
];
const bad = [];
for (const h of HANDLES) {
  const j = await fetch(`https://y9yn6k-me.myshopify.com/products/${h}.json`).then((r) => r.json());
  const n = j.product?.images?.length ?? 0;
  if (n < 8) bad.push({ h, n });
  console.log(h.padEnd(28), n);
}
console.log('\n<8 images:', bad.length);
console.log(bad.map((b) => `${b.h}(${b.n})`).join(', '));
