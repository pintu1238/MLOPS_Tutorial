/**
 * Replaces product media on demo-footwear handles with Luxe Step shoe images (local assets).
 * Fixes search/shop showing winter photos on footwear titles after slot remap.
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';

const catalogPath = join(__dirname, 'sync-footwear-to-published-slots.mjs');
const catalogSrc = readFileSync(catalogPath, 'utf8');
const catalogMatch = catalogSrc.match(/const CATALOG = (\[[\s\S]*?\]);/);
if (!catalogMatch) throw new Error('Could not parse CATALOG');
const CATALOG = eval(catalogMatch[1]);

function getToken() {
  const configPath = join(homedir(), 'AppData', 'Roaming', 'shopify-cli-kit-nodejs', 'Config', 'config.json');
  const raw = JSON.parse(readFileSync(configPath, 'utf8'));
  const sessions = JSON.parse(raw.sessionStore);
  const k = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
  return sessions['accounts.shopify.com'][raw.currentSessionId].applications[k].accessToken;
}

async function gql(token, query, variables = {}) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

async function stagedUploadProductImage(token, filename) {
  const filePath = join(assetsDir, filename);
  if (!existsSync(filePath)) throw new Error(`Missing asset: ${filePath}`);
  const buffer = readFileSync(filePath);

  const stagedData = await gql(
    token,
    `mutation StagedUploads($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType: 'image/jpeg',
          resource: 'PRODUCT_IMAGE',
          fileSize: String(buffer.length),
          httpMethod: 'POST',
        },
      ],
    }
  );

  const target = stagedData.stagedUploadsCreate?.stagedTargets?.[0];
  const stagedErrs = stagedData.stagedUploadsCreate?.userErrors;
  if (stagedErrs?.length) throw new Error(stagedErrs.map((e) => e.message).join('; '));
  if (!target?.url) throw new Error(`No staged target for ${filename}`);

  const form = new FormData();
  for (const param of target.parameters) {
    form.append(param.name, param.value);
  }
  form.append('file', new Blob([buffer], { type: 'image/jpeg' }), filename);

  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Upload failed ${filename}: HTTP ${uploadRes.status} ${text.slice(0, 200)}`);
  }

  return target.resourceUrl;
}

async function waitForFeaturedImage(token, handle, attempts = 12) {
  for (let i = 0; i < attempts; i++) {
    const data = await gql(
      token,
      `query ($handle: String!) {
        productByHandle(handle: $handle) {
          featuredMedia { preview { image { url } } }
        }
      }`,
      { handle }
    );
    const url = data.productByHandle?.featuredMedia?.preview?.image?.url;
    if (url) return url;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return null;
}

async function getProductMedia(token, handle) {
  const data = await gql(
    token,
    `query ProductMedia($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        media(first: 50) {
          nodes {
            id
            ... on MediaImage {
              image { url }
            }
          }
        }
      }
    }`,
    { handle }
  );
  return data.productByHandle;
}

async function deleteAllMedia(token, productId, mediaIds) {
  if (!mediaIds.length) return;
  const data = await gql(
    token,
    `mutation ProductDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        mediaUserErrors { message }
      }
    }`,
    { productId, mediaIds }
  );
  const errs = data.productDeleteMedia?.mediaUserErrors;
  if (errs?.length) throw new Error(errs.map((e) => e.message).join('; '));
}

async function setFeaturedImage(token, productId, footwear) {
  const resourceUrl = await stagedUploadProductImage(token, footwear.imageAsset);
  const data = await gql(
    token,
    `mutation ProductUpdateMedia($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
      productUpdate(product: $product, media: $media) {
        userErrors { message }
      }
    }`,
    {
      product: { id: productId },
      media: [
        {
          originalSource: resourceUrl,
          mediaContentType: 'IMAGE',
          alt: footwear.title,
        },
      ],
    }
  );
  const errs = data.productUpdate?.userErrors;
  if (errs?.length) throw new Error(errs.map((e) => e.message).join('; '));
  return waitForFeaturedImage(token, footwear.handle);
}

async function main() {
  const token = getToken();
  const dryRun = process.argv.includes('--dry-run');

  for (const item of CATALOG) {
    const product = await getProductMedia(token, item.handle);
    if (!product?.id) {
      console.warn(`skip missing: ${item.handle}`);
      continue;
    }

    const mediaIds = (product.media?.nodes || []).map((m) => m.id).filter(Boolean);
    console.log(`\n${item.handle}: ${mediaIds.length} media`);

    if (dryRun) continue;

    await deleteAllMedia(token, product.id, mediaIds);
    const url = await setFeaturedImage(token, product.id, item);
    console.log(`  featured: ${url || '(pending)'}`);
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
