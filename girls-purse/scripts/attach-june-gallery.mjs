/**
 * Attach gp-na25-* and color/pose gallery files to gp-na-june-crescent.
 */
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const SHOPIFY_CLI = `${process.env.APPDATA}\\npm\\shopify.cmd`;
const HANDLE = 'gp-na-june-crescent';
const BASE = 'https://cdn.shopify.com/s/files/1/0764/9715/8213/files';

const MEDIA_FILES = [
  'gp-na25-01.jpg',
  'gp-na25-02.jpg',
  'gp-na25-03.jpg',
  'gp-na25-04.jpg',
  'gp-na25-05.jpg',
  'gp-na25-06.jpg',
  'gp-na25-07.jpg',
  'gp-na25-08.jpg',
  'color-02-black.png',
  'color-03-cream.png',
  'color-04-blush.png',
  'color-05-camel.png',
  'pose-01-standing.png',
  'pose-02-walking.png',
  'pose-03-seated.png',
  'pose-04-profile.png',
  'pose-05-close.png',
];

function runGraphQL(query, variables = {}) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const qPath = join(tmpdir(), `gp-gql-${stamp}.graphql`);
  const vPath = join(tmpdir(), `gp-vars-${stamp}.json`);
  writeFileSync(qPath, query, 'utf8');
  writeFileSync(vPath, JSON.stringify(variables), 'utf8');
  try {
    const cmd = `"${SHOPIFY_CLI}" store execute -s ${STORE} --query-file "${qPath}" --variable-file "${vPath}" --allow-mutations -j`;
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: true });
    const objects = [];
    for (const line of out.split('\n')) {
      const t = line.trim();
      if (!t.startsWith('{')) continue;
      try {
        objects.push(JSON.parse(t));
      } catch {
        /* skip */
      }
    }
    let result = objects.filter((o) => !o.type && !o.error).pop();
    if (!result) {
      const start = out.indexOf('{\n  "');
      if (start >= 0) result = JSON.parse(out.slice(start));
    }
    if (!result) throw new Error(`No GraphQL result:\n${out.slice(-2000)}`);
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
    return result.data ?? result;
  } finally {
    try {
      unlinkSync(qPath);
      unlinkSync(vPath);
    } catch {
      /* ignore */
    }
  }
}

const product = runGraphQL(
  `query($q: String!) {
    products(first: 1, query: $q) {
      nodes {
        id
        media(first: 50) { nodes { alt } }
      }
    }
  }`,
  { q: `handle:${HANDLE}` }
).products?.nodes?.[0];

if (!product) throw new Error('Product not found');

const existing = new Set((product.media?.nodes ?? []).map((n) => n.alt).filter(Boolean));
const pending = MEDIA_FILES.filter((name) => !existing.has(name));
console.log('existing alts', existing.size, 'pending', pending.length);

if (!pending.length) {
  console.log('Nothing to attach');
  process.exit(0);
}

for (const name of pending) {
  const head = await fetch(`${BASE}/${name}`, { method: 'HEAD' });
  if (!head.ok) console.warn('skip missing', name, head.status);
}

const media = pending.map((name) => ({
  originalSource: `${BASE}/${name}`,
  alt: name,
  mediaContentType: 'IMAGE',
}));

const created = runGraphQL(
  `mutation Attach($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { alt status }
      mediaUserErrors { field message }
    }
  }`,
  { productId: product.id, media }
);
const userErrors = created.productCreateMedia?.mediaUserErrors ?? [];
if (userErrors.length) throw new Error(JSON.stringify(userErrors));
console.log('attached', created.productCreateMedia?.media?.length ?? media.length);
