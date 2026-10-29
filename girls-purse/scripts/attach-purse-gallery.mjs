/**
 * Attach generated purse gallery photos to the matching Shopify products.
 * Reads purse-images/<handle>/*.jpg and adds any that are not already on the product.
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const SHOPIFY_CLI = `${process.env.APPDATA}\\npm\\shopify.cmd`;
const ROOT =
  process.env.PURSE_IMAGES ??
  'C:\\Users\\pintu\\AppData\\Local\\Cursor\\AgentStores\\cursor_agent_stores\\fec5a65a-5f01-4d76-a4db-b55f616f8414\\files\\purse-images';

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
        /* log line */
      }
    }
    let result = objects.filter((o) => !o.type && !o.error).pop();
    if (!result) {
      const start = out.indexOf('{\n  "');
      if (start >= 0) result = JSON.parse(out.slice(start));
    }
    if (!result) throw new Error(`No GraphQL result:\n${out.slice(-1500)}`);
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
    if (result.error) throw new Error(JSON.stringify(result.error));
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

function mimeFor(filename) {
  return filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
}

async function stageAndUploadMany(filePaths) {
  const staged = runGraphQL(
    `mutation Stage($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    {
      input: filePaths.map((filePath) => {
        const filename = basename(filePath);
        return {
          filename,
          mimeType: mimeFor(filename),
          resource: 'PRODUCT_IMAGE',
          httpMethod: 'POST',
        };
      }),
    }
  );
  const targets = staged.stagedUploadsCreate?.stagedTargets ?? [];
  const errors = staged.stagedUploadsCreate?.userErrors ?? [];
  if (errors.length || targets.length !== filePaths.length) {
    throw new Error(`stage: ${JSON.stringify(errors)} targets=${targets.length}`);
  }

  return Promise.all(
    filePaths.map(async (filePath, index) => {
      const target = targets[index];
      const filename = basename(filePath);
      const body = new FormData();
      for (const param of target.parameters) body.append(param.name, param.value);
      const bytes = readFileSync(filePath);
      body.append('file', new Blob([bytes], { type: mimeFor(filename) }), filename);
      const response = await fetch(target.url, { method: 'POST', body });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`upload ${filename} ${response.status}: ${text.slice(0, 300)}`);
      }
      return target.resourceUrl;
    })
  );
}

function productByHandle(handle) {
  const data = runGraphQL(
    `query($q: String!) {
      products(first: 1, query: $q) {
        nodes {
          id
          handle
          media(first: 50) { nodes { alt } }
        }
      }
    }`,
    { q: `handle:${handle}` }
  );
  return data.products?.nodes?.[0] ?? null;
}

const FOLDER_HANDLES = {
  'gp-gianna-sml': ['gp-gianna-sml-black', 'gp-gianna-sml-cherry', 'gp-gianna-sml-espresso'],
};

function galleryFiles(folder) {
  const dir = join(ROOT, folder);
  return readdirSync(dir)
    .filter((name) => /\.(jpe?g|png)$/i.test(name))
    .map((name) => join(dir, name))
    .filter((file) => statSync(file).size > 10000)
    .sort();
}

async function attachToProduct(folder, handle) {
  const files = galleryFiles(folder);
  if (!files.length) return { handle, skipped: 'no files' };

  const product = productByHandle(handle);
  if (!product) return { handle, skipped: 'product missing' };
  const existing = new Set((product.media?.nodes ?? []).map((node) => node.alt).filter(Boolean));
  const pending = files.filter((file) => !existing.has(basename(file)));
  if (!pending.length) return { handle, skipped: 'already attached', count: files.length };

  const sources = await stageAndUploadMany(pending);
  const media = pending.map((file, index) => ({
    originalSource: sources[index],
    alt: basename(file),
    mediaContentType: 'IMAGE',
  }));

  const created = runGraphQL(
    `mutation Attach($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { alt status }
        mediaUserErrors { field message }
      }
    }`,
    { productId: product.id, media }
  );
  const userErrors = created.productCreateMedia?.mediaUserErrors ?? [];
  if (userErrors.length) throw new Error(`${handle}: ${JSON.stringify(userErrors)}`);
  return { handle, added: media.length, onDisk: files.length };
}

async function attachFolder(folder) {
  const handles = FOLDER_HANDLES[folder] ?? [folder];
  const results = [];
  for (const handle of handles) results.push(await attachToProduct(folder, handle));
  return results.length === 1 ? results[0] : results;
}

const only = process.argv.slice(2);
const handles = (only.length ? only : readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)).filter(
  (name) => name.startsWith('gp-')
);

for (const handle of handles) {
  try {
    const result = await attachFolder(handle);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(handle, error.message);
  }
}
