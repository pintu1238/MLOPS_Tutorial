/**
 * Builds 10 visually distinct PDP gallery JPEGs per footwear product from fw-gen-* source (sharp transforms).
 */
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

const OUT_W = 1400;
const OUT_H = 1750;
const BG = { r: 250, g: 248, b: 245 };

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

/** Each slide should read clearly different in the thumbnail strip. */
const TRANSFORMS = [
  (img) =>
    img.resize(OUT_W, OUT_H, { fit: 'contain', background: BG }).modulate({ brightness: 1.02 }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.35), Math.round(OUT_H * 1.35), { fit: 'cover', position: 'left' })
      .extract({ left: Math.round(OUT_W * 0.22), top: Math.round(OUT_H * 0.12), width: OUT_W, height: OUT_H }),
  (img) => img.flop().resize(OUT_W, OUT_H, { fit: 'cover', position: 'right' }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.4), Math.round(OUT_H * 1.4), { fit: 'cover', position: 'top' })
      .extract({ left: 0, top: Math.round(OUT_H * 0.08), width: OUT_W, height: OUT_H }),
  (img) =>
    img
      .resize(Math.round(OUT_W * 1.4), Math.round(OUT_H * 1.4), { fit: 'cover', position: 'bottom' })
      .extract({ left: 0, top: 0, width: OUT_W, height: OUT_H }),
  (img) => img.greyscale().modulate({ brightness: 1.08, contrast: 1.12 }).resize(OUT_W, OUT_H, { fit: 'cover', position: 'centre' }),
  (img) =>
    img
      .rotate(10, { background: BG })
      .resize(OUT_W, OUT_H, { fit: 'inside', background: BG })
      .extend({
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
        background: BG,
      })
      .resize(OUT_W, OUT_H, { fit: 'cover' }),
  (img) =>
    img
      .modulate({ brightness: 0.92, saturation: 1.45, hue: 8 })
      .resize(OUT_W, OUT_H, { fit: 'cover', position: 'centre' }),
  (img) =>
    img
      .modulate({ brightness: 1.12, saturation: 0.65, hue: -12 })
      .resize(OUT_W, OUT_H, { fit: 'cover', position: 'left' }),
  (img) =>
    img
      .resize(960, 1200, { fit: 'inside', background: BG })
      .extend({
        top: 120,
        bottom: 120,
        left: 220,
        right: 220,
        background: { r: 238, g: 232, b: 224 },
      })
      .resize(OUT_W, OUT_H, { fit: 'cover' }),
];

async function buildForHandle(handle) {
  const source = join(assetsDir, `fw-gen-${handle}.jpg`);
  if (!existsSync(source)) {
    console.warn(`skip ${handle}: missing ${source}`);
    return;
  }

  const input = readFileSync(source);
  for (let i = 0; i < 10; i++) {
    const num = String(i + 1).padStart(2, '0');
    const out = join(assetsDir, `fw-pdp-${handle}-${num}.jpg`);
    let pipeline = sharp(input).rotate();
    pipeline = TRANSFORMS[i](pipeline);
    await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(out);
  }

  const swatchTransforms = {
    Black: (img) => img.greyscale().modulate({ brightness: 0.38, saturation: 0.2 }),
    Nude: (img) => img.modulate({ brightness: 1.08, saturation: 0.78 }),
    Tan: (img) => img.modulate({ brightness: 0.92, saturation: 1.25 }).tint({ r: 195, g: 145, b: 85 }),
    Burgundy: (img) => img.modulate({ brightness: 0.72, saturation: 1.55 }).tint({ r: 110, g: 18, b: 42 }),
    White: (img) => img.modulate({ brightness: 1.38, saturation: 0.12 }).tint({ r: 248, g: 246, b: 242 }),
  };

  for (const [color, transform] of Object.entries(swatchTransforms)) {
    const slug = color.toLowerCase();
    const out = join(assetsDir, `fw-swatch-${handle}-${slug}.jpg`);
    let sw = sharp(input).rotate().resize(320, 320, { fit: 'cover', position: 'centre' });
    sw = transform(sw);
    await sw.jpeg({ quality: 86 }).toFile(out);
  }

  console.log(`built gallery: ${handle}`);
}

async function main() {
  mkdirSync(assetsDir, { recursive: true });
  for (const handle of HANDLES) {
    await buildForHandle(handle);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
