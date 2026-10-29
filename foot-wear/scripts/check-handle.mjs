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

const query = `query ($handle: String!) {
  productByHandle(handle: $handle) {
    id handle title status publishedAt onlineStoreUrl tags vendor productType
  }
}`;

const res = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ query, variables: { handle } }),
});
console.log(JSON.stringify(await res.json(), null, 2));
