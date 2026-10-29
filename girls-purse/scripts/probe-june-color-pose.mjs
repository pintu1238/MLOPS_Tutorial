const names = [];
for (let i = 1; i <= 5; i++) {
  names.push(`color-0${i}-black.png`, `color-0${i}-navy.png`, `color-0${i}-cream.png`);
  names.push(`june-color-0${i}.png`, `gp-na25-color-0${i}.png`);
}
for (let i = 1; i <= 5; i++) names.push(`pose-0${i}-standing.png`, `june-pose-0${i}.png`);
for (const f of names) {
  const res = await fetch(`https://y9yn6k-me.myshopify.com/cdn/shop/files/${f}`, { method: 'HEAD' });
  if (res.ok) console.log('OK', f);
}
