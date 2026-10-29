/**
 * Remove placeholder Unsplash hero images from gp-* products (wrong clothing photos).
 */
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const SHOPIFY_CLI = `${process.env.APPDATA}\\npm\\shopify.cmd`;
const BAD = /photo-1590874103328|photo-1490481651871|unsplash/i;

function runGraphQL(query, variables = {}) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const qPath = join(tmpdir(), `gp-gql-${stamp}.graphql`);
  const vPath = join(tmpdir(), `gp-vars-${stamp}.json`);
  writeFileSync(qPath, query, 'utf8');
  writeFileSync(vPath, JSON.stringify(variables), 'utf8');
  try {
    const cmd = `"${SHOPIFY_CLI}" store execute -s ${STORE} --query-file "${qPath}" --variable-file "${vPath}" --allow-mutations -j`;
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: true });
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
      if (start >= 0) result = JSON.parse(out.slice(start));
    }
    if (!result) throw new Error(`No GraphQL result:\n${out.slice(-1500)}`);
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
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

const handles = process.argv.slice(2);
const targets =
  handles.length > 0
    ? handles
    : ['gp-studio-shopper'];

for (const handle of targets) {
  const product = runGraphQL(
    `query($q: String!) {
      products(first: 1, query: $q) {
        nodes {
          id
          handle
          media(first: 20) {
            nodes {
              id
              ... on MediaImage {
                image { url }
              }
            }
          }
        }
      }
    }`,
    { q: `handle:${handle}` }
  ).products?.nodes?.[0];

  if (!product) {
    console.log(handle, 'not found');
    continue;
  }

  const badIds = (product.media?.nodes ?? [])
    .filter((n) => BAD.test(n.image?.url ?? ''))
    .map((n) => n.id);

  if (!badIds.length) {
    console.log(handle, 'no stock hero');
    continue;
  }

  const del = runGraphQL(
    `mutation($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        mediaUserErrors { field message }
      }
    }`,
    { productId: product.id, mediaIds: badIds }
  );
  const errs = del.productDeleteMedia?.mediaUserErrors ?? [];
  if (errs.length) throw new Error(JSON.stringify(errs));
  console.log(handle, 'deleted', del.productDeleteMedia?.deletedMediaIds?.length ?? 0);
}
