const PREVIEW = '154709033029';
const handle = process.argv[2] || 'gp-ella-leather-tote';
const html = await fetch(`https://y9yn6k-me.myshopify.com/products/${handle}?preview_theme_id=${PREVIEW}`).then((r) => r.text());
const parts = html.split('data-gw-gallery-thumb');
console.log('count', parts.length - 1);
for (let i = 1; i < parts.length; i++) {
  const m = parts[i].match(/src="([^"]+)"/);
  console.log(i, m ? m[1].replace(/^\/\//, 'https://') : '?');
}
