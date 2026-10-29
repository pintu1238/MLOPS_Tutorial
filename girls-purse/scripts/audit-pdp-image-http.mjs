const HANDLES = [
  'gp-na-june-crescent',
  'gp-ella-leather-tote',
  'gp-gianna-sml-black',
];
const PREVIEW = '154709033029';
const STORE = 'y9yn6k-me.myshopify.com';

async function check(handle) {
  const url = `https://${STORE}/products/${handle}?preview_theme_id=${PREVIEW}`;
  const html = await fetch(url).then((r) => r.text());
  const srcs = [...html.matchAll(/src="([^"]+fw-pdp[^"]+|[^"]+gp-[^"]+studio[^"]+|cdn\/shop\/files[^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(srcs)].slice(0, 12);
  const stats = [];
  for (const s of unique) {
    const full = s.startsWith('//') ? `https:${s}` : s;
    const res = await fetch(full, { method: 'HEAD' });
    stats.push({ status: res.status, len: res.headers.get('content-length'), url: full.slice(0, 100) });
  }
  console.log('\n', handle, 'thumb count', (html.match(/data-gw-gallery-thumb/g) || []).length);
  stats.forEach((x) => console.log(x.status, x.len, x.url));
}

for (const h of HANDLES) await check(h);
