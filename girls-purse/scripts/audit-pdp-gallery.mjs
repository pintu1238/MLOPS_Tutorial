/**
 * Audit PDP gallery thumb count per product (Girls Purse preview theme).
 */
const HANDLES = [
  'gp-ella-leather-tote',
  'gp-rose-crossbody',
  'gp-gold-evening-clutch',
  'gp-camel-satchel',
  'gp-burgundy-hobo',
  'gp-chain-shoulder-bag',
  'gp-mini-top-handle',
  'gp-saddle-crossbody',
  'gp-studio-shopper',
  'gp-woven-beach-tote',
  'gp-gianna-sml-black',
  'gp-gianna-sml-cherry',
  'gp-gianna-sml-espresso',
  'gp-luna-grommet',
  'gp-sloane-lock',
  'gp-maren-curve',
  'gp-paloma-raffia',
  'gp-grommet-strap',
  'gp-na-aria-flap',
  'gp-na-belle-chain',
  'gp-na-dahlia-bucket',
  'gp-na-elise-handle',
  'gp-na-greta-hobo',
  'gp-na-hazel-satchel',
  'gp-na-iris-shoulder',
  'gp-na-june-crescent',
];

const PREVIEW = '154709033029';
const STORE = 'y9yn6k-me.myshopify.com';

async function audit(handle, preview) {
  const q = preview ? `?preview_theme_id=${PREVIEW}` : '';
  const url = `https://${STORE}/products/${handle}${q}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'GirlsPurseAudit/1.0' } });
  const html = await res.text();
  const thumbs = (html.match(/data-gw-gallery-thumb/g) || []).length;
  const slides = (html.match(/data-gw-slide/g) || []).length;
  const themeGallery = html.includes(`fw-pdp-${handle}-01`);
  const singleShopify = thumbs === 1 && !themeGallery;
  return { handle, status: res.status, thumbs, slides, themeGallery, singleShopify };
}

const mode = process.argv.includes('--live') ? 'live' : 'preview';
const preview = mode === 'preview';

console.log(`Mode: ${mode}\n`);
const results = [];
for (const handle of HANDLES) {
  try {
    const row = await audit(handle, preview);
    results.push(row);
    const flag = row.thumbs < 8 ? ' NEEDS FIX' : '';
    console.log(
      `${row.handle.padEnd(28)} thumbs=${row.thumbs} slides=${row.slides} themeAssets=${row.themeGallery}${flag}`
    );
  } catch (e) {
    console.log(`${handle} ERROR ${e.message}`);
  }
}
const bad = results.filter((r) => r.thumbs < 8);
console.log(`\n${bad.length}/${results.length} with fewer than 8 thumbs`);
