/**
 * Batch-generate ORVIANE product images (9 angles per product).
 *
 * Requires: GEMINI_API_KEY in environment (Google AI Studio).
 * Usage:
 *   node scripts/generate-orviane-images.mjs
 *   node scripts/generate-orviane-images.mjs --product noir-oud
 *   node scripts/generate-orviane-images.mjs --limit 2
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const manifestPath = path.join(__dirname, 'orviane-image-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const args = process.argv.slice(2);
const productFilter = args.includes('--product') ? args[args.indexOf('--product') + 1] : null;
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : null;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Set GEMINI_API_KEY (https://aistudio.google.com/apikey) then re-run.');
  process.exit(1);
}

const outRoot = path.join(root, manifest.outputDir);
fs.mkdirSync(outRoot, { recursive: true });

const style =
  'Ultra-premium luxury perfume product photography, dark charcoal studio background, soft gold rim light, glass bottle with black and gold accents, clear readable ORVIANE wordmark on the bottle, photorealistic, no watermark, no extra text besides ORVIANE on bottle.';

function buildPrompt(productName, angleLabel) {
  return `${style} Product: ${productName}. Camera angle: ${angleLabel}.`;
}

async function generateImage(prompt) {
  const model = 'gemini-2.0-flash-preview-image-generation';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 400)}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) throw new Error('No image in response');
  return Buffer.from(imagePart.inlineData.data, 'base64');
}

let products = manifest.products;
if (productFilter) products = products.filter((p) => p.slug === productFilter);
if (limit) products = products.slice(0, limit);

let done = 0;
let skipped = 0;
const total = products.length * manifest.angles.length;

for (const product of products) {
  for (const angle of manifest.angles) {
    const filename = `orviane-${product.slug}-${angle.id}.jpg`;
    const filepath = path.join(outRoot, filename);
    if (fs.existsSync(filepath)) {
      skipped += 1;
      continue;
    }
    const prompt = buildPrompt(product.name, angle.label);
    process.stdout.write(`Generating ${filename}... `);
    try {
      const buf = await generateImage(prompt);
      fs.writeFileSync(filepath, buf);
      done += 1;
      console.log('ok');
    } catch (err) {
      console.log('failed');
      console.error(err.message);
      process.exitCode = 1;
      break;
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  if (process.exitCode) break;
}

console.log(`Finished. generated=${done} skipped=${skipped} planned=${total}`);
