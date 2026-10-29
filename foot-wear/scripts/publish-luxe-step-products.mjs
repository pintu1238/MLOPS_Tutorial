import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
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
  return session.applications[storeKey].accessToken;
}

async function adminGraphql(token, query, variables = {}) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

async function main() {
  const token = getStoreAccessToken();

  const pubData = await adminGraphql(
    token,
    `query {
      publications(first: 20) {
        nodes { id name catalog { title } }
      }
    }`
  ).catch(() => null);

  let publicationId = pubData?.publications?.nodes?.find(
    (p) => p.name === 'Online Store' || p.catalog?.title === 'Online Store'
  )?.id;

  if (!publicationId) {
    const ch = await adminGraphql(
      token,
      `query { channels(first: 10) { nodes { id name } } }`
    );
    const online = ch.channels?.nodes?.find((c) => c.name === 'Online Store');
    if (online) publicationId = online.id;
  }

  for (const handle of HANDLES) {
    const productData = await adminGraphql(
      token,
      `query ($handle: String!) {
        productByHandle(handle: $handle) {
          id
          status
          onlineStoreUrl
        }
      }`,
      { handle }
    );
    const product = productData.productByHandle;
    if (!product?.id) {
      console.log('missing:', handle);
      continue;
    }

    if (product.onlineStoreUrl) {
      console.log('already public:', handle);
      continue;
    }

    if (publicationId) {
      await adminGraphql(
        token,
        `mutation ($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) {
            userErrors { message }
          }
        }`,
        { id: product.id, input: [{ publicationId }] }
      );
      console.log('published via publication:', handle);
    } else {
      await adminGraphql(
        token,
        `mutation ($product: ProductUpdateInput!) {
          productUpdate(product: $product) {
            userErrors { message }
          }
        }`,
        {
          product: {
            id: product.id,
            status: 'ACTIVE',
          },
        }
      );
      console.log('updated status:', handle);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
