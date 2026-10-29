/**
 * Publishes seeded footwear products to the Online Store channel.
 * Uses Shopify CLI token or SHOPIFY_ADMIN_ACCESS_TOKEN (needs write_publications).
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';

const HANDLES = [
  'womens-black-stiletto-heel',
  'womens-nude-court-pump',
  'womens-block-heel-mule',
  'womens-satin-evening-heel',
  'womens-tan-ankle-boot',
  'mens-black-chelsea-boot',
  'womens-knee-high-boot',
  'mens-lace-up-combat-boot',
  'mens-brown-leather-loafer',
  'womens-penny-loafer',
  'mens-black-tassel-loafer',
  'womens-horsebit-loafer',
  'womens-gold-strappy-sandal',
  'mens-leather-slide-sandal',
  'womens-platform-wedge-sandal',
  'mens-sport-sandal',
  'white-luxury-low-sneaker',
  'mens-court-sneaker',
  'womens-knit-runner',
  'mens-retro-leather-sneaker',
];

function getStoreAccessToken() {
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  const configPath = join(
    homedir(),
    'AppData',
    'Roaming',
    'shopify-cli-kit-nodejs',
    'Config',
    'config.json'
  );
  const raw = JSON.parse(readFileSync(configPath, 'utf8'));
  const sessions = JSON.parse(raw.sessionStore);
  const session = sessions['accounts.shopify.com'][raw.currentSessionId];
  const storeKey = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
  const token = session.applications?.[storeKey]?.accessToken;
  if (!token) throw new Error('No Shopify CLI token. Run: shopify theme list --store ' + STORE);
  return token;
}

async function adminGraphql(token, query, variables = {}) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

async function getOnlineStorePublicationId(token) {
  const data = await adminGraphql(
    token,
    `query {
      channels(first: 10) {
        nodes { id name }
      }
    }`
  );

  const online = data.channels.nodes.find((n) => n.name === 'Online Store');
  if (!online?.id) throw new Error('Online Store channel not found');

  const channelNumeric = online.id.split('/').pop();
  const candidates = [
    `gid://shopify/Publication/${channelNumeric}`,
    `gid://shopify/Publication/1`,
    `gid://shopify/Publication/2`,
  ];

  return { candidates, channelId: online.id };
}

async function publishProduct(token, publicationIds, handle) {
  const data = await adminGraphql(
    token,
    `query ($handle: String!) {
      productByHandle(handle: $handle) { id title }
    }`,
    { handle }
  );
  const product = data.productByHandle;
  if (!product) {
    console.log(`  missing: ${handle}`);
    return false;
  }

  for (const publicationId of publicationIds) {
    const result = await adminGraphql(
      token,
      `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors { field message }
        }
      }`,
      {
        id: product.id,
        input: [{ publicationId }],
      }
    );

    const errs = result.publishablePublish.userErrors;
    if (!errs?.length) {
      console.log(`  published: ${handle} (${publicationId})`);
      return true;
    }
  }

  console.log(`  failed: ${handle}`);
  return false;
}

async function verifyPublished(token, handle) {
  const data = await adminGraphql(
    token,
    `query ($handle: String!) {
      productByHandle(handle: $handle) { onlineStoreUrl publishedAt }
    }`,
    { handle }
  );
  return data.productByHandle;
}

async function main() {
  const token = getStoreAccessToken();
  const { candidates, channelId } = await getOnlineStorePublicationId(token);
  console.log('Online Store channel:', channelId);
  console.log('Trying publication IDs:', candidates.join(', '));

  let workingPublication = null;
  for (const publicationId of candidates) {
    const ok = await publishProduct(token, [publicationId], 'womens-nude-court-pump');
    const check = await verifyPublished(token, 'womens-nude-court-pump');
    if (check?.onlineStoreUrl || check?.publishedAt) {
      workingPublication = publicationId;
      console.log('Verified publication ID:', workingPublication);
      break;
    }
    if (ok) {
      workingPublication = publicationId;
      break;
    }
  }

  if (!workingPublication) {
    throw new Error(
      'Could not publish. Create a Custom App in Admin with write_publications scope, set SHOPIFY_ADMIN_ACCESS_TOKEN, and re-run.'
    );
  }

  for (const handle of HANDLES) {
    if (handle === 'womens-nude-court-pump') continue;
    await publishProduct(token, [workingPublication], handle);
  }

  const final = await verifyPublished(token, 'womens-nude-court-pump');
  console.log('\nSample product:', final);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
