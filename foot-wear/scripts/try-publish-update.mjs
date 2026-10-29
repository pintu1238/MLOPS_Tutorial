import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
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
  return res.json();
}

const before = await gql(
  `query { productByHandle(handle: "womens-nude-court-pump") { id status publishedAt onlineStoreUrl } }`
);
console.log('before', before.data);

const id = before.data?.productByHandle?.id;
const update = await gql(
  `mutation ($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product { status publishedAt onlineStoreUrl }
      userErrors { message }
    }
  }`,
  { product: { id, status: 'ACTIVE', vendor: 'Solmarch' } }
);
console.log('update', JSON.stringify(update, null, 2));

const publishTry = await gql(
  `mutation ($id: ID!) {
    publishablePublish(id: $id, input: [{ publicationId: "gid://shopify/Publication/1" }]) {
      userErrors { message }
    }
  }`,
  { id }
);
console.log('publishTry', JSON.stringify(publishTry, null, 2));
