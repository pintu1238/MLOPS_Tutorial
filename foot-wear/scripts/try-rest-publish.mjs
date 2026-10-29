import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const configPath = join(homedir(), 'AppData', 'Roaming', 'shopify-cli-kit-nodejs', 'Config', 'config.json');
const raw = JSON.parse(readFileSync(configPath, 'utf8'));
const sessions = JSON.parse(raw.sessionStore);
const k = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
const token = sessions['accounts.shopify.com'][raw.currentSessionId].applications[k].accessToken;

const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

const list = await fetch(`https://${STORE}/admin/api/2025-01/products.json?handle=womens-nude-court-pump&fields=id,handle,status,published_at`, {
  headers,
});
console.log('GET', await list.json());

const gql = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `mutation {
      productUpdate(product: { id: "gid://shopify/Product/PLACEHOLDER", status: ACTIVE }) {
        product { id status }
        userErrors { message }
      }
    }`,
  }),
});
console.log('gql template', await gql.text());
