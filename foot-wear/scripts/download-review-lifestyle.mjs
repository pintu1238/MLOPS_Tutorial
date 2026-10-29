/**
 * Lifestyle review photos — women / men wearing footwear (PDP "What Customer say").
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
mkdirSync(assetsDir, { recursive: true });

const crop = 'auto=format&fit=crop&w=900&h=1200&q=85';

const LADIES = [
  'photo-1515372039744-b8f02a3ae446',
  'photo-1594633312681-425c7b97ccd1',
  'photo-1469334031218-e382a71b716b',
  'photo-1524504388940-b1c1722653e1',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1490481651871-ab68de25d43d',
  'photo-1496747611176-843222e1e57c',
  'photo-1487412720507-e7ab37603c6f',
];

const MENS = [
  'photo-1542291026-7eec264c27ff',
  'photo-1560250097-0b93528c311a',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1500648767791-00dcc994a43e',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1517841905240-472988babdf9',
  'photo-1583863788434-e58a36330cf0',
];

/** @type {{ filename: string, url: string }[]} */
const ASSETS = [
  ...LADIES.map((id, i) => ({
    filename: `fw-review-ladies-${String(i + 1).padStart(2, '0')}.jpg`,
    url: `https://images.unsplash.com/${id}?${crop}`,
  })),
  ...MENS.map((id, i) => ({
    filename: `fw-review-mens-${String(i + 1).padStart(2, '0')}.jpg`,
    url: `https://images.unsplash.com/${id}?${crop}`,
  })),
];

async function downloadOne({ filename, url }) {
  const dest = join(assetsDir, filename);
  const res = await fetch(url, { headers: { 'User-Agent': 'LuxeStepThemeSync/1.0' } });
  if (!res.ok) throw new Error(`${filename}: HTTP ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log('saved', filename);
}

for (const item of ASSETS) {
  await downloadOne(item);
}
