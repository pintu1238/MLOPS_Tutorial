const bases = [];
for (let i = 1; i <= 8; i++) bases.push(`gp-na25-0${i}.jpg`);
const extras = [
  'color-01-navy.png',
  'color-02-black.png',
  'pose-01-standing.png',
  'june-color-01.png',
];
for (const f of [...bases, ...extras]) {
  const url = `https://y9yn6k-me.myshopify.com/cdn/shop/files/${f}`;
  const res = await fetch(url, { method: 'HEAD' });
  console.log(res.status, f);
}
