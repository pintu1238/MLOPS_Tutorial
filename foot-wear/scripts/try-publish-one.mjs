import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const handle = process.argv[2] || 'cropped-puffer';
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
  `query ($handle: String!) { productByHandle(handle: $handle) { id publishedAt onlineStoreUrl } }`,
  { handle }
);
const id = before.data?.productByHandle?.id;
console.log('before', before.data);

const pub = 'gid://shopify/Publication/201500590149';
const attempt = await gql(
  `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) { userErrors { field message } }
  }`,
  { id, input: [{ publicationId: pub }] }
);
console.log('publish', JSON.stringify(attempt, null, 2));

const productSet = await gql(
  `mutation ($input: ProductSetInput!) {
    productSet(input: $input) { product { publishedAt onlineStoreUrl } userErrors { message } }
  }`,
  {
    input: {
      identifier: { handle },
      product: { status: 'ACTIVE' },
      publishDate: new Date().toISOString(),
    },
  }
);
console.log('productSet', JSON.stringify(productSet, null, 2));

const after = await gql(
  `query ($handle: String!) { productByHandle(handle: $handle) { publishedAt onlineStoreUrl } }`,
  { handle }
);
console.log('after', after.data);
