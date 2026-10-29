/**
 * Builds homepage 9-to-5 comfort panel images from footwear hero sources.
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assets = join(__dirname, '..', 'assets');

async function buildPanel(output, input, position) {
  await sharp(join(assets, input))
    .rotate()
    .resize(1200, 1500, { fit: 'cover', position })
    .modulate({ brightness: 1.03, saturation: 1.05 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(assets, output));
  console.log('wrote', output);
}

await buildPanel('fw-comfort-women-9to5.jpg', 'fw-hero-slide-02.jpg', 'right');
await buildPanel('fw-comfort-men-9to5.jpg', 'fw-hero-slide-03.jpg', 'left');
