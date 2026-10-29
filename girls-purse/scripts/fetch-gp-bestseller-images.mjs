/**
 * Downloads unique studio + lifestyle images for homepage bestsellers (gp-bs-*).
 */
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'assets');

const cards = [
  {
    id: '01',
    studio:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-ella-tote'),
  },
  {
    id: '02',
    studio:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-rose-crossbody'),
  },
  {
    id: '03',
    studio:
      'https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-gold-clutch'),
  },
  {
    id: '04',
    studio:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-camel-satchel'),
  },
  {
    id: '05',
    studio:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-burgundy-hobo'),
  },
  {
    id: '06',
    studio:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-chain-shoulder'),
  },
  {
    id: '07',
    studio:
      'https://images.unsplash.com/photo-1622560480605-d83c8530a574?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-mini-handle'),
  },
  {
    id: '08',
    studio:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-saddle-cross'),
  },
  {
    id: '09',
    studio:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-studio-shopper'),
  },
  {
    id: '10',
    studio:
      'https://images.unsplash.com/photo-1572635196233-8f7923ba1c3f?auto=format&fit=crop&w=900&h=1200&q=85',
    wear: wearUrl('gp-wear-raffia-tote'),
  },
];

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GirlsPurseTheme/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

function wearUrl(seed) {
  return `https://picsum.photos/seed/${seed}/900/1200`;
}

await mkdir(assetsDir, { recursive: true });

for (const card of cards) {
  const studio = join(assetsDir, `gp-bs-${card.id}-studio.jpg`);
  const wear = join(assetsDir, `gp-bs-${card.id}-wear.jpg`);
  console.log(`gp-bs-${card.id} studio…`);
  await download(card.studio, studio);
  console.log(`gp-bs-${card.id} wear…`);
  await download(card.wear, wear);
}

console.log('Done —', cards.length * 2, 'images in assets/');
