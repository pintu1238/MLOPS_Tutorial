/**
 * Publishes demo-winter products to Online Store (channels API — no read_publications).
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';
const SHOP_JSON = join(__dirname, '..', '..', 'girls-winter-boutique', 'templates', 'page.shop.json');

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

function winterHandles() {
  let raw = readFileSync(SHOP_JSON, 'utf8');
  const page = JSON.parse(raw.slice(raw.indexOf('{')));
  const handles = new Set();
  for (const section of Object.values(page.sections)) {
    for (const block of Object.values(section.blocks || {})) {
      if (block.type !== 'look') continue;
      const link = block.settings?.link || '';
      const h = link.replace(/^\/products\//, '').split(/[?#]/)[0];
      if (h) handles.add(h);
    }
  }
  return [...handles];
}

async function getPublicationCandidates(token) {
  const data = await gql(
    token,
    `query { channels(first: 10) { nodes { id name } } }`
  );
  const online = data.channels?.nodes?.find((n) => n.name === 'Online Store');
  if (!online?.id) return ['gid://shopify/Publication/1', 'gid://shopify/Publication/2'];
  const n = online.id.split('/').pop();
  return [`gid://shopify/Publication/${n}`, 'gid://shopify/Publication/1', 'gid://shopify/Publication/2'];
}

async function publishHandle(token, _publicationIds, handle) {
  const data = await gql(
    token,
    `query ($handle: String!) { productByHandle(handle: $handle) { id onlineStoreUrl publishedAt } }`,
    { handle }
  );
  const product = data.productByHandle;
  if (!product?.id) {
    console.log(`  missing: ${handle}`);
    return false;
  }
  if (product.onlineStoreUrl || product.publishedAt) {
    console.log(`  already live: ${handle}`);
    return true;
  }

  const result = await gql(
    token,
    `mutation ($input: ProductInput!) {
      productUpdate(input: $input) {
        product { publishedAt onlineStoreUrl }
        userErrors { message }
      }
    }`,
    { input: { id: product.id, published: true } }
  );
  const errs = result.productUpdate?.userErrors;
  if (errs?.length) {
    console.log(`  could not publish: ${handle} — ${errs.map((e) => e.message).join(', ')}`);
    return false;
  }
  if (result.productUpdate?.product?.publishedAt || result.productUpdate?.product?.onlineStoreUrl) {
    console.log(`  published: ${handle}`);
    return true;
  }
  console.log(`  could not publish: ${handle}`);
  return false;
}

async function main() {
  const token = getToken();
  const publicationIds = await getPublicationCandidates(token);
  console.log('Publication candidates:', publicationIds.join(', '));
  const handles = winterHandles();
  for (const handle of handles) {
    await publishHandle(token, publicationIds, handle);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
