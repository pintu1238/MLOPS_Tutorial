/**
 * Updates demo-footwear product titles to title case on the store.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';

/** @type {{ handle: string, title: string }[]} */
const TITLES = [
  { handle: 'womens-black-stiletto-heel', title: "Women's Black Stiletto Heel" },
  { handle: 'womens-nude-court-pump', title: "Women's Nude Court Pump" },
  { handle: 'womens-block-heel-mule', title: "Women's Block Heel Mule" },
  { handle: 'womens-satin-evening-heel', title: "Women's Satin Evening Heel" },
  { handle: 'womens-tan-ankle-boot', title: "Women's Tan Ankle Boot" },
  { handle: 'mens-black-chelsea-boot', title: "Men's Black Chelsea Boot" },
  { handle: 'womens-knee-high-boot', title: "Women's Knee-High Boot" },
  { handle: 'mens-lace-up-combat-boot', title: "Men's Lace-Up Combat Boot" },
  { handle: 'mens-brown-leather-loafer', title: "Men's Brown Leather Loafer" },
  { handle: 'womens-penny-loafer', title: "Women's Penny Loafer" },
  { handle: 'mens-black-tassel-loafer', title: "Men's Black Tassel Loafer" },
  { handle: 'womens-horsebit-loafer', title: "Women's Horsebit Loafer" },
  { handle: 'womens-gold-strappy-sandal', title: "Women's Gold Strappy Sandal" },
  { handle: 'mens-leather-slide-sandal', title: "Men's Leather Slide Sandal" },
  { handle: 'womens-platform-wedge-sandal', title: "Women's Platform Wedge Sandal" },
  { handle: 'mens-sport-sandal', title: "Men's Sport Sandal" },
  { handle: 'white-luxury-low-sneaker', title: 'White Luxury Low Sneaker' },
  { handle: 'mens-court-sneaker', title: "Men's Court Sneaker" },
  { handle: 'womens-knit-runner', title: "Women's Knit Runner" },
  { handle: 'mens-retro-leather-sneaker', title: "Men's Retro Leather Sneaker" },
];

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

async function main() {
  const token = getToken();
  for (const item of TITLES) {
    const data = await gql(
      token,
      `query ($handle: String!) { productByHandle(handle: $handle) { id title } }`,
      { handle: item.handle }
    );
    const p = data.productByHandle;
    if (!p?.id) {
      console.warn(`skip missing: ${item.handle}`);
      continue;
    }
    if (p.title === item.title) {
      console.log(`ok: ${item.handle}`);
      continue;
    }
    const upd = await gql(
      token,
      `mutation ($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { title }
          userErrors { message }
        }
      }`,
      { product: { id: p.id, title: item.title } }
    );
    const errs = upd.productUpdate?.userErrors;
    if (errs?.length) {
      console.error(`${item.handle}:`, errs.map((e) => e.message).join(', '));
      continue;
    }
    console.log(`updated: ${item.handle} → ${item.title}`);
    await new Promise((r) => setTimeout(r, 200));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
