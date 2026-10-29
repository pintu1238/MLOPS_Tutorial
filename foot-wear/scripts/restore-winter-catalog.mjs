/**
 * Creates Girls Winter demo products (separate handles) from girls-winter theme shop page.
 * Does NOT overwrite footwear products. Tags: demo-winter, girls-winter
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';
const WINTER_THEME_ID = '154447118405';

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

function parsePrice(display) {
  if (!display) return '0.00';
  const m = String(display).match(/([\d,]+)\.(\d{2})/);
  if (!m) return '0.00';
  return `${m[1].replace(/,/g, '')}.${m[2]}`;
}

function loadWinterProductsFromShopPage() {
  let raw = readFileSync(SHOP_JSON, 'utf8');
  const jsonStart = raw.indexOf('{');
  const page = JSON.parse(raw.slice(jsonStart));
  const map = new Map();

  for (const section of Object.values(page.sections)) {
    if (!section?.blocks) continue;
    const productType = section.settings?.heading || 'Winter';
    for (const block of Object.values(section.blocks)) {
      if (block.type !== 'look') continue;
      const s = block.settings || {};
      const link = s.link || '';
      if (!link.includes('/products/')) continue;
      const handle = link.replace(/^\/products\//, '').split(/[?#]/)[0];
      if (!handle) continue;
      map.set(handle, {
        handle,
        title: s.title || handle,
        price: parsePrice(s.price),
        imageAsset: s.image_asset,
        productType,
      });
    }
  }
  return [...map.values()];
}

function themeAssetUrl(asset) {
  return `https://${STORE}/cdn/shop/t/${WINTER_THEME_ID}/assets/${asset}?v=${Date.now()}`;
}

async function getProductByHandle(token, handle) {
  const data = await gql(
    token,
    `query ($handle: String!) {
      productByHandle(handle: $handle) { id handle onlineStoreUrl variants(first: 1) { nodes { id } } }
    }`,
    { handle }
  );
  return data.productByHandle;
}

async function ensureWinterProduct(token, item) {
  const existing = await getProductByHandle(token, item.handle);
  if (existing?.id) {
    await gql(
      token,
      `mutation ($product: ProductUpdateInput!) {
        productUpdate(product: $product) { userErrors { message } }
      }`,
      {
        product: {
          id: existing.id,
          title: item.title,
          vendor: 'Girls Winter',
          productType: item.productType,
          tags: ['demo-winter', 'girls-winter'],
          status: 'ACTIVE',
        },
      }
    );
    const variantId = existing.variants?.nodes?.[0]?.id;
    if (variantId) {
      await gql(
        token,
        `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            userErrors { message }
          }
        }`,
        { productId: existing.id, variants: [{ id: variantId, price: item.price }] }
      );
    }
    console.log(`  exists (updated tags/price): ${item.handle}`);
    return existing.id;
  }

  const media = item.imageAsset
    ? [{ originalSource: themeAssetUrl(item.imageAsset), mediaContentType: 'IMAGE', alt: item.title }]
    : [];

  const created = await gql(
    token,
    `mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id handle }
        userErrors { field message }
      }
    }`,
    {
      product: {
        title: item.title,
        handle: item.handle,
        vendor: 'Girls Winter',
        productType: item.productType,
        tags: ['demo-winter', 'girls-winter'],
        status: 'ACTIVE',
      },
      media,
    }
  );

  const errs = created.productCreate.userErrors;
  if (errs?.length) throw new Error(`${item.handle}: ${errs.map((e) => e.message).join(', ')}`);

  const productId = created.productCreate.product.id;
  const variantData = await gql(
    token,
    `query ($id: ID!) { product(id: $id) { variants(first: 1) { nodes { id } } } }`,
    { id: productId }
  );
  const variantId = variantData.product.variants.nodes[0]?.id;
  if (variantId) {
    await gql(
      token,
      `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors { message }
        }
      }`,
      { productId, variants: [{ id: variantId, price: item.price }] }
    );
  }

  console.log(`  created: ${item.handle}`);
  return productId;
}

async function tryPublish(token, productId, handle) {
  const check = await gql(
    token,
    `query ($id: ID!) { product(id: $id) { publishedAt onlineStoreUrl } }`,
    { id: productId }
  );
  if (check.product?.publishedAt || check.product?.onlineStoreUrl) {
    console.log(`  publish: already live`);
    return;
  }
  const result = await gql(
    token,
    `mutation ($input: ProductInput!) {
      productUpdate(input: $input) {
        product { publishedAt }
        userErrors { message }
      }
    }`,
    { input: { id: productId, published: true } }
  );
  const errs = result.productUpdate?.userErrors;
  if (errs?.length) {
    console.log(`  publish: failed — ${errs.map((e) => e.message).join(', ')}`);
    return;
  }
  console.log(`  publish: online store`);
}

async function main() {
  const products = loadWinterProductsFromShopPage();
  console.log(`Winter products from shop page: ${products.length}`);
  const token = getToken();

  for (const item of products) {
    console.log(`\n${item.handle}`);
    const id = await ensureWinterProduct(token, item);
    await tryPublish(token, id, item.handle);
  }

  console.log('\nDone. Girls Winter theme links should resolve when products are published to Online Store.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
