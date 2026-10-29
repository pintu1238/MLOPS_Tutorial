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

async function gql(query) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

const probes = [
  '{ shop { name publicationCount } }',
  '{ publications(first: 5) { nodes { id name } } }',
  '{ catalogs(first: 5) { nodes { id title publication { id } } } }',
  '{ channels(first: 5) { nodes { id name } } }',
];

for (const query of probes) {
  const result = await gql(query);
  console.log(query, JSON.stringify(result, null, 2));
}
