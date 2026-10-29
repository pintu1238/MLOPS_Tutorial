/**
 * Downloads Luxe Step footwear images into theme assets/ (portrait 3:4 product shots).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
mkdirSync(assetsDir, { recursive: true });

/** @type {{ filename: string, url: string }[]} */
const ASSETS = [
  // Shop grid — heels
  {
    filename: 'fw-gen-womens-black-stiletto-heel.jpg',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd3?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-nude-court-pump.jpg',
    url: 'https://images.unsplash.com/photo-1515342870182-75a88d4e9d41?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-block-heel-mule.jpg',
    url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-satin-evening-heel.jpg',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8d077?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  // Boots
  {
    filename: 'fw-gen-womens-tan-ankle-boot.jpg',
    url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-black-chelsea-boot.jpg',
    url: 'https://images.unsplash.com/photo-1638243304067-9a4a4be7e24d?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-knee-high-boot.jpg',
    url: 'https://images.unsplash.com/photo-1608258346330-53b89b3a1ace?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-lace-up-combat-boot.jpg',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  // Loafers
  {
    filename: 'fw-gen-mens-brown-leather-loafer.jpg',
    url: 'https://images.unsplash.com/photo-1614252239476-9a3a5c0b1c0b?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-penny-loafer.jpg',
    url: 'https://images.unsplash.com/photo-1560763189-8f63f6830c5f?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-black-tassel-loafer.jpg',
    url: 'https://images.unsplash.com/photo-1533867610401-7e5b8e8e8f0b?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-horsebit-loafer.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  // Sandals
  {
    filename: 'fw-gen-womens-gold-strappy-sandal.jpg',
    url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-leather-slide-sandal.jpg',
    url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-platform-wedge-sandal.jpg',
    url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-sport-sandal.jpg',
    url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  // Sneakers
  {
    filename: 'fw-gen-white-luxury-low-sneaker.jpg',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-court-sneaker.jpg',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a9?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-womens-knit-runner.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  {
    filename: 'fw-gen-mens-retro-leather-sneaker.jpg',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&h=1200&q=85',
  },
  // Homepage hero & categories
  {
    filename: 'fw-hero-footwear.jpg',
    url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&h=2000&q=85',
  },
  {
    filename: 'fw-cat-heels.jpg',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd3?auto=format&fit=crop&w=800&h=1000&q=85',
  },
  {
    filename: 'fw-cat-boots.jpg',
    url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=800&h=1000&q=85',
  },
  {
    filename: 'fw-cat-loafers.jpg',
    url: 'https://images.unsplash.com/photo-1614252239476-9a3a5c0b1c0b?auto=format&fit=crop&w=800&h=1000&q=85',
  },
  {
    filename: 'fw-cat-sandals.jpg',
    url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=800&h=1000&q=85',
  },
  {
    filename: 'fw-cat-sneakers.jpg',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=1000&q=85',
  },
  // Pick deal row
  { filename: 'fw-pick-01.jpg', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd3?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-pick-02.jpg', url: 'https://images.unsplash.com/photo-1638243304067-9a4a4be7e24d?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-pick-03.jpg', url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-pick-04.jpg', url: 'https://images.unsplash.com/photo-1614252239476-9a3a5c0b1c0b?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-pick-05.jpg', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-01.jpg', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8d077?auto=format&fit=crop&w=600&h=600&q=85' },
  { filename: 'fw-review-02.jpg', url: 'https://images.unsplash.com/photo-1638243304067-9a4a4be7e24d?auto=format&fit=crop&w=600&h=600&q=85' },
  { filename: 'fw-review-03.jpg', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=600&q=85' },
  { filename: 'fw-review-04.jpg', url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=600&h=600&q=85' },
  { filename: 'fw-review-footwear-01.jpg', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd3?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-02.jpg', url: 'https://images.unsplash.com/photo-1638243304067-9a4a4be7e24d?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-03.jpg', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-04.jpg', url: 'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-05.jpg', url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-06.jpg', url: 'https://images.unsplash.com/photo-1614252239476-9a3a5c0b1c0b?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-07.jpg', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8d077?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-review-footwear-08.jpg', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&h=1200&q=85' },
  { filename: 'fw-faq-bg.jpg', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&h=800&q=85' },
  { filename: 'fw-logo.jpg', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&h=400&q=85' },
];

async function downloadOne({ filename, url }) {
  const dest = join(assetsDir, filename);
  if (existsSync(dest)) {
    console.log('skip', filename);
    return;
  }
  const res = await fetch(url, { headers: { 'User-Agent': 'LuxeStepThemeSync/1.0' } });
  if (!res.ok) throw new Error(`${filename}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log('wrote', filename, `(${Math.round(buf.length / 1024)}kb)`);
}

async function main() {
  for (const item of ASSETS) {
    await downloadOne(item);
  }
  console.log(`\n${ASSETS.length} assets in ${assetsDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
