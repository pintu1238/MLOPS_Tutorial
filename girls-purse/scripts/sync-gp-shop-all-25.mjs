/**
 * Sets gp-shop-all collection to 25 bestseller products (gp-* only).
 */
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const SHOPIFY_CLI =
  process.env.SHOPIFY_CLI_PATH ||
  (process.platform === 'win32'
    ? `${process.env.APPDATA}\\npm\\shopify.cmd`
    : 'shopify');

const BESTSELLER_HANDLES = [
  'gp-ella-leather-tote',
  'gp-rose-crossbody',
  'gp-gold-evening-clutch',
  'gp-camel-satchel',
  'gp-burgundy-hobo',
  'gp-chain-shoulder-bag',
  'gp-mini-top-handle',
  'gp-saddle-crossbody',
  'gp-studio-shopper',
  'gp-woven-beach-tote',
  'gp-gianna-sml-black',
  'gp-gianna-sml-cherry',
  'gp-gianna-sml-espresso',
  'gp-luna-grommet',
  'gp-sloane-lock',
  'gp-maren-curve',
  'gp-paloma-raffia',
  'gp-grommet-strap',
  'gp-na-aria-flap',
  'gp-na-belle-chain',
  'gp-na-dahlia-bucket',
  'gp-na-elise-handle',
  'gp-na-greta-hobo',
  'gp-na-hazel-satchel',
  'gp-na-iris-shoulder',
];

function runGraphQL(query, variables = {}) {
  const qPath = join(tmpdir(), `gp-gql-${Date.now()}-${Math.random().toString(36).slice(2)}.graphql`);
  const vPath = join(tmpdir(), `gp-vars-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(qPath, query, 'utf8');
  writeFileSync(vPath, JSON.stringify(variables), 'utf8');
  try {
    const cmd = [
      `"${SHOPIFY_CLI}"`,
      'store',
      'execute',
      '-s',
      STORE,
      '--query-file',
      `"${qPath}"`,
      '--variable-file',
      `"${vPath}"`,
      '--allow-mutations',
      '-j',
    ].join(' ');
    const out = execSync(cmd, {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      shell: true,
    });
    const objects = [];
    for (const line of out.split('\n')) {
      const t = line.trim();
      if (!t.startsWith('{')) continue;
      try {
        objects.push(JSON.parse(t));
      } catch {
        /* skip */
      }
    }
    let result = objects.filter((o) => !o.type && !o.error).pop();
    if (!result) {
      const start = out.indexOf('{\n  "');
      if (start >= 0) {
        try {
          result = JSON.parse(out.slice(start));
        } catch {
          /* fall through */
        }
      }
    }
    if (!result) throw new Error(`No GraphQL result:\n${out.slice(-2000)}`);
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors, null, 2));
    return result.data ?? result;
  } finally {
    try {
      unlinkSync(qPath);
      unlinkSync(vPath);
    } catch {
      /* ignore */
    }
  }
}

function main() {
  const productIds = [];
  for (const handle of BESTSELLER_HANDLES) {
    const data = runGraphQL(
      `query($h: String!) { productByHandle(handle: $h) { id handle } }`,
      { h: handle }
    );
    const id = data.productByHandle?.id;
    if (!id) {
      console.warn('missing product', handle);
      continue;
    }
    productIds.push(id);
  }

  if (productIds.length < 25) {
    throw new Error(`Only resolved ${productIds.length}/25 product IDs`);
  }

  const coll = runGraphQL(`query { collectionByHandle(handle: "gp-shop-all") { id } }`);
  const collectionId = coll.collectionByHandle?.id;
  if (!collectionId) throw new Error('gp-shop-all collection not found');

  const existing = runGraphQL(
    `query($id: ID!) {
      collection(id: $id) {
        products(first: 50) { edges { node { id } } }
      }
    }`,
    { id: collectionId }
  );
  const existingIds = existing.collection?.products?.edges?.map((e) => e.node.id) ?? [];
  const toRemove = existingIds.filter((id) => !productIds.includes(id));
  if (toRemove.length) {
    const rem = runGraphQL(
      `mutation($id: ID!, $productIds: [ID!]!) {
        collectionRemoveProducts(id: $id, productIds: $productIds) {
          userErrors { message }
        }
      }`,
      { id: collectionId, productIds: toRemove }
    );
    const remErr = rem.collectionRemoveProducts?.userErrors ?? [];
    if (remErr.length) console.warn('remove errors', remErr);
  }

  const toAdd = productIds.filter((id) => !existingIds.includes(id));
  if (toAdd.length) {
    const add = runGraphQL(
      `mutation($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          userErrors { message }
        }
      }`,
      { id: collectionId, productIds: toAdd }
    );
    const addErr = add.collectionAddProducts?.userErrors ?? [];
    if (addErr.length) throw new Error(JSON.stringify(addErr));
  }

  runGraphQL(
    `mutation($input: CollectionInput!) {
      collectionUpdate(input: $input) {
        collection { id }
        userErrors { message }
      }
    }`,
    {
      input: {
        id: collectionId,
        title: 'Bestsellers',
        sortOrder: 'MANUAL',
      },
    }
  );

  console.log('gp-shop-all updated:', productIds.length, 'products');
}

main();
