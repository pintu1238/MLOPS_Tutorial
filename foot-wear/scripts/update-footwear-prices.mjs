/**
 * Updates variant price + compare-at for all footwear handles in the sync catalog.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, 'sync-footwear-to-published-slots.mjs');
const catalogSrc = readFileSync(catalogPath, 'utf8');
const catalogMatch = catalogSrc.match(/const CATALOG = (\[[\s\S]*?\]);/);
if (!catalogMatch) throw new Error('Could not parse CATALOG from sync script');
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

async function getProductByHandle(token, handle) {
  const data = await gql(
    token,
    `query ($handle: String!) {
      productByHandle(handle: $handle) {
        id
        variants(first: 1) { nodes { id } }
      }
    }`,
    { handle }
  );
  return data.productByHandle;
}

async function main() {
  const token = getToken();
  for (const item of CATALOG) {
    const product = await getProductByHandle(token, item.handle);
    if (!product?.id) {
      console.warn(`skip missing: ${item.handle}`);
      continue;
    }
    const variantId = product.variants?.nodes?.[0]?.id;
    if (!variantId) continue;

    const price = item.price;
    const compareAt = (parseFloat(price) * 2).toFixed(2);

    const result = await gql(
      token,
      `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors { message }
        }
      }`,
      {
        productId: product.id,
        variants: [{ id: variantId, price, compareAtPrice: compareAt }],
      }
    );
    const errs = result.productVariantsBulkUpdate?.userErrors;
    if (errs?.length) {
      console.warn(item.handle, errs.map((e) => e.message).join(', '));
    } else {
      console.log(`${item.handle}: ${price} (was compare ${compareAt})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
