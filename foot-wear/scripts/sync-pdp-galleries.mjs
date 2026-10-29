/**
 * Builds 8 PDP gallery JPEGs per handle — SAME product only (from fw-gen-{handle}.jpg).
 * No cross-gender / cross-SKU stock photos.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
const OUT_W = 1400;
const OUT_H = 1750;
const BG = { r: 250, g: 248, b: 245 };
const SLIDE_COUNT = 8;

const HANDLES = [
  'womens-black-stiletto-heel',
  'womens-nude-court-pump',
  'womens-block-heel-mule',
  'womens-satin-evening-heel',
  'womens-tan-ankle-boot',
  'mens-black-chelsea-boot',
  'womens-knee-high-boot',
  'mens-lace-up-combat-boot',
  'mens-brown-leather-loafer',
  'womens-penny-loafer',
  'mens-black-tassel-loafer',
  'womens-horsebit-loafer',
  'womens-gold-strappy-sandal',
  'mens-leather-slide-sandal',
  'womens-platform-wedge-sandal',
  'mens-sport-sandal',
  'white-luxury-low-sneaker',
  'mens-court-sneaker',
  'womens-knit-runner',
  'mens-retro-leather-sneaker',
];

function genPath(handle) {
  return join(assetsDir, `fw-gen-${handle}.jpg`);
}

function loadInput(handle) {
  const path = genPath(handle);
  if (!existsSync(path)) throw new Error(`missing ${path}`);
  return readFileSync(path);
}

/** @type {(img: sharp.Sharp) => sharp.Sharp}[] */
const TRANSFORMS = [
  (img) => img.resize(OUT_W, OUT_H, { fit: 'contain', background: BG }).modulate({ brightness: 1.03 }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.45), Math.round(OUT_H * 1.45), { fit: 'cover', position: 'left' })
      .extract({ left: Math.round(OUT_W * 0.18), top: Math.round(OUT_H * 0.05), width: OUT_W, height: OUT_H }),
  (img) =>
    img
      .flop()
      .resize(Math.round(OUT_W * 1.45), Math.round(OUT_H * 1.45), { fit: 'cover', position: 'right' })
      .extract({ left: 0, top: Math.round(OUT_H * 0.08), width: OUT_W, height: OUT_H }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.55), Math.round(OUT_H * 1.55), { fit: 'cover', position: 'top' })
      .extract({ left: Math.round(OUT_W * 0.12), top: Math.round(OUT_H * 0.02), width: OUT_W, height: OUT_H }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.55), Math.round(OUT_H * 1.55), { fit: 'cover', position: 'bottom' })
      .extract({ left: Math.round(OUT_W * 0.08), top: 0, width: OUT_W, height: OUT_H }),
  (img) => img.greyscale().modulate({ brightness: 1.08, contrast: 1.1 }).resize(OUT_W, OUT_H, { fit: 'cover', position: 'centre' }),
  (img) =>
    img
      .rotate(-11, { background: BG })
      .resize(OUT_W, OUT_H, { fit: 'inside', background: BG })
      .extend({ top: 48, bottom: 48, left: 48, right: 48, background: BG })
      .resize(OUT_W, OUT_H, { fit: 'cover' }),
  (img) =>
    img
      .modulate({ brightness: 1.06, saturation: 1.18 })
      .resize(Math.round(OUT_W * 0.62), Math.round(OUT_H * 0.62), { fit: 'inside', background: BG })
      .extend({
        top: 180,
        bottom: 180,
        left: 280,
        right: 280,
        background: { r: 236, g: 230, b: 222 },
      })
      .resize(OUT_W, OUT_H, { fit: 'cover' }),
];

async function writePairSlide(handle, outPath) {
  const input = loadInput(handle);
  const single = await sharp(input)
    .rotate()
    .resize(Math.round(OUT_W * 0.38), Math.round(OUT_H * 0.38), { fit: 'inside', background: BG })
    .toBuffer();

  await sharp({
    create: { width: OUT_W, height: OUT_H, channels: 3, background: BG },
  })
    .composite([
      { input: single, left: Math.round(OUT_W * 0.1), top: Math.round(OUT_H * 0.42) },
      { input: single, left: Math.round(OUT_W * 0.52), top: Math.round(OUT_H * 0.42) },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
}

async function buildHandle(handle) {
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outPath = join(assetsDir, `fw-pdp-${handle}-${num}.jpg`);

    if (i === 6) {
      await writePairSlide(handle, outPath);
      continue;
    }

    let pipeline = sharp(loadInput(handle)).rotate();
    pipeline = TRANSFORMS[i](pipeline);
    await pipeline.jpeg({ quality: 90, mozjpeg: true }).toFile(outPath);
  }
  console.log('gallery', handle, SLIDE_COUNT);
}

async function main() {
  mkdirSync(assetsDir, { recursive: true });
  for (const handle of HANDLES) {
    try {
      await buildHandle(handle);
    } catch (err) {
      console.warn(handle, err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
