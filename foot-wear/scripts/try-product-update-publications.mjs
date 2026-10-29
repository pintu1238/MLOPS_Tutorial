import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const id = process.argv[2] || 'gid://shopify/Product/8327941881925';
const configPath = join(homedir(), 'AppData', 'Roaming', 'shopify-cli-kit-nodejs', 'Config', 'config.json');
const raw = JSON.parse(readFileSync(configPath, 'utf8'));
const sessions = JSON.parse(raw.sessionStore);
const k = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
const token = sessions['accounts.shopify.com'][raw.currentSessionId].applications[k].accessToken;

async function gql(query, variables) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, status: res.status };
  }
}

const pub = 'gid://shopify/Publication/201500590149';
const attempts = [
  [
    `mutation ($product: ProductUpdateInput!) {
      productUpdate(product: $product) { product { publishedAt onlineStoreUrl } userErrors { message } }
    }`,
    { product: { id, publications: [{ publicationId: pub }] } },
  ],
  [
    `mutation ($input: ProductInput!) {
      productUpdate(input: $input) { product { publishedAt } userErrors { message } }
    }`,
    { input: { id, published: true } },
  ],
];

for (const [query, variables] of attempts) {
  const result = await gql(query, variables);
  console.log(JSON.stringify(result, null, 2));
}
