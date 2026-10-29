import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const configPath = join(homedir(), 'AppData', 'Roaming', 'shopify-cli-kit-nodejs', 'Config', 'config.json');
const raw = JSON.parse(readFileSync(configPath, 'utf8'));
const sessions = JSON.parse(raw.sessionStore);
const k = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
const token =
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
  sessions['accounts.shopify.com'][raw.currentSessionId].applications[k].accessToken;

async function gql(query, variables) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

const handle = 'womens-nude-court-pump';
const idQ = await gql(`query { productByHandle(handle: "${handle}") { id } }`);
const id = idQ.data?.productByHandle?.id;
console.log('id', id);

const attempts = [
  [
    `mutation ($input: ProductSetInput!) { productSet(input: $input) { product { publishedAt onlineStoreUrl } userErrors { message } } }`,
    {
      input: {
        identifier: { handle },
        product: { status: 'ACTIVE' },
        publishDate: new Date().toISOString(),
      },
    },
  ],
  [
    `mutation ($id: ID!) { productChangeStatus(productId: $id, status: ACTIVE) { product { status } userErrors { message } } }`,
    { id },
  ],
];

for (const [query, variables] of attempts) {
  const result = await gql(query, variables);
  console.log(JSON.stringify(result, null, 2));
}

const after = await gql(`query { productByHandle(handle: "${handle}") { publishedAt onlineStoreUrl } }`);
console.log('after', after.data);
