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

const published = await gql(`query {
  products(first: 50, query: "published_status:published") {
    nodes { id handle title onlineStoreUrl tags }
  }
}`);

const footwear = await gql(`query {
  products(first: 50, query: "tag:footwear") {
    nodes { id handle title onlineStoreUrl publishedAt status }
  }
}`);

console.log('PUBLISHED', JSON.stringify(published.data?.products?.nodes, null, 2));
console.log('FOOTWEAR', JSON.stringify(footwear.data?.products?.nodes?.map(p => ({ handle: p.handle, publishedAt: p.publishedAt, url: p.onlineStoreUrl })), null, 2));
