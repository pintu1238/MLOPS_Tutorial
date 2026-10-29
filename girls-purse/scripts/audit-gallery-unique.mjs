import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const handles = readFileSync(join(root, 'scripts', 'audit-pdp-gallery.mjs'), 'utf8')
  .match(/'gp-[^']+'/g)
  .map((s) => s.slice(1, -1));

const PREVIEW = '154709033029';

for (const handle of handles) {
  const url = `https://y9yn6k-me.myshopify.com/products/${handle}?preview_theme_id=${PREVIEW}`;
  const html = await fetch(url).then((r) => r.text());
  const re = new RegExp(`fw-pdp-${handle}-(\\d{2})_2000x\\.jpg[^"'\\s]*`, 'g');
  const urls = [...new Set(html.match(re) || [])];
  const uniqueNums = new Set(urls.map((u) => u.match(/-(\d{2})_/)?.[1]));
  console.log(handle, 'uniqueSlots', uniqueNums.size, uniqueNums.size < 8 ? 'MISSING' : '');
}
