const handle = 'gp-na-june-crescent';
const base = 'https://y9yn6k-me.myshopify.com/cdn/shop/t/22/assets';
const nums = ['01', '02', '03', '04', '05'];
for (const n of nums) {
  const url = `${base}/fw-pdp-${handle}-${n}_2000x.jpg?v=2297`;
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  console.log(n, res.status, buf.byteLength);
}
