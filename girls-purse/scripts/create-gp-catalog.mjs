/**
 * Creates Girls Purse catalog (gp-* handles only). Safe for shared store with footwear theme.
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

const products = [
  {
    handle: 'gp-ella-leather-tote',
    title: 'Ella Leather Tote',
    type: 'Tote',
    price: '248.00',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
    description:
      'Structured pebbled leather with magnetic closure and interior zip pocket — your everyday carry, elevated.',
  },
  {
    handle: 'gp-rose-crossbody',
    title: 'Rose Quilted Crossbody',
    type: 'Crossbody',
    price: '168.00',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    description:
      'Soft quilted leather with chain strap and blush hardware — hands-free polish from day to dinner.',
  },
  {
    handle: 'gp-gold-evening-clutch',
    title: 'Gold Evening Clutch',
    type: 'Clutch',
    price: '128.00',
    image:
      'https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=1200&q=80',
    description:
      'Metallic fold-over clutch with detachable wristlet — made for evenings that run late.',
  },
  {
    handle: 'gp-camel-satchel',
    title: 'Camel Top-Handle Satchel',
    type: 'Satchel',
    price: '198.00',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    description:
      'Warm camel leather with dual handles and gold feet — boardroom sharp, weekend soft.',
  },
  {
    handle: 'gp-burgundy-hobo',
    title: 'Burgundy Slouch Hobo',
    type: 'Shoulder Bag',
    price: '178.00',
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80',
    description:
      'Relaxed hobo silhouette in deep burgundy with suede lining — roomy without the bulk.',
  },
  {
    handle: 'gp-chain-shoulder-bag',
    title: 'Chain Shoulder Bag',
    type: 'Shoulder Bag',
    price: '188.00',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80',
    description:
      'Boxy shoulder bag with polished chain strap and turn-lock closure — instant outfit upgrade.',
  },
  {
    handle: 'gp-mini-top-handle',
    title: 'Mini Top-Handle Bag',
    type: 'Mini Bag',
    price: '148.00',
    image:
      'https://images.unsplash.com/photo-1622560480605-d83c8530a574?auto=format&fit=crop&w=1200&q=80',
    description:
      'Petite top-handle with detachable strap — fits phone, keys, and lipstick with room to spare.',
  },
  {
    handle: 'gp-woven-beach-tote',
    title: 'Woven Raffia Beach Tote',
    type: 'Tote',
    price: '98.00',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80&sat=-20',
    description:
      'Breathable woven raffia with leather handles — resort days and farmers-market runs.',
  },
  {
    handle: 'gp-saddle-crossbody',
    title: 'Saddle Crossbody',
    type: 'Crossbody',
    price: '158.00',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    description:
      'Curved saddle flap with adjustable strap — vintage spirit, modern proportions.',
  },
  {
    handle: 'gp-studio-shopper',
    title: 'Studio Leather Shopper',
    type: 'Tote',
    price: '228.00',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Oversized shopper with reinforced base and laptop sleeve — commute-ready luxury.',
  },
];

const collections = [
  {
    handle: 'gp-shop-all',
    title: 'Girls Purse — Shop All',
    handles: products.map((p) => p.handle),
  },
  {
    handle: 'gp-new-arrivals',
    title: 'New Arrivals',
    handles: ['gp-ella-leather-tote', 'gp-rose-crossbody', 'gp-chain-shoulder-bag', 'gp-mini-top-handle'],
  },
  {
    handle: 'gp-totes',
    title: 'Totes',
    handles: ['gp-ella-leather-tote', 'gp-woven-beach-tote', 'gp-studio-shopper'],
  },
  {
    handle: 'gp-crossbody',
    title: 'Crossbody',
    handles: ['gp-rose-crossbody', 'gp-saddle-crossbody'],
  },
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
        /* skip non-JSON log lines */
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
    if (!result) throw new Error(`No GraphQL result in CLI output:\n${out.slice(-2000)}`);
    if (result.errors?.length) {
      throw new Error(JSON.stringify(result.errors, null, 2));
    }
    if (result.error) throw new Error(JSON.stringify(result.error, null, 2));
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

async function main() {
  const pubQuery = `query { publications(first: 20) { edges { node { id name } } } }`;
  const pubData = runGraphQL(pubQuery);
  const onlineStore = pubData.publications.edges.find((e) => e.node.name === 'Online Store');
  if (!onlineStore) throw new Error('Online Store publication not found');
  const publicationId = onlineStore.node.id;

  const productIds = {};

  for (const p of products) {
    const mutation = `mutation ProductSet($input: ProductSetInput!) {
      productSet(synchronous: true, input: $input) {
        product { id handle }
        userErrors { field message }
      }
    }`;
    const input = {
      handle: p.handle,
      title: p.title,
      descriptionHtml: `<p>${p.description}</p>`,
      vendor: 'Girls Purse',
      productType: p.type,
      tags: ['demo-purse', 'gp-purse'],
      status: 'ACTIVE',
      productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
      variants: [
        {
          optionValues: [{ optionName: 'Title', name: 'Default Title' }],
          price: p.price,
          inventoryPolicy: 'CONTINUE',
        },
      ],
      files: [{ originalSource: p.image, alt: p.title, contentType: 'IMAGE' }],
    };
    const result = runGraphQL(mutation, { input });
    const errors = result.productSet?.userErrors ?? [];
    if (errors.length) {
      console.warn(`productSet ${p.handle}:`, errors);
    }
    const id = result.productSet?.product?.id;
    if (id) productIds[p.handle] = id;
    console.log('product', p.handle, id ?? 'existing?');
  }

  for (const c of collections) {
    const createMut = `mutation CollectionCreate($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle }
        userErrors { field message }
      }
    }`;
    const createRes = runGraphQL(createMut, {
      input: {
        handle: c.handle,
        title: c.title,
        descriptionHtml: `<p>Curated ${c.title} from Girls Purse.</p>`,
      },
    });
    let collectionId = createRes.collectionCreate?.collection?.id;
    const createErrors = createRes.collectionCreate?.userErrors ?? [];
    if (createErrors.length && !collectionId) {
      console.warn('collectionCreate', c.handle, createErrors);
      const lookup = runGraphQL(
        `query($h: String!) { collectionByHandle(handle: $h) { id } }`,
        { h: c.handle }
      );
      collectionId = lookup.collectionByHandle?.id;
    }
    if (!collectionId) continue;

    const ids = c.handles.map((h) => productIds[h]).filter(Boolean);
    if (ids.length) {
      const addMut = `mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          collection { id }
          userErrors { field message }
        }
      }`;
      runGraphQL(addMut, { id: collectionId, productIds: ids });
    }

    const pubMut = `mutation Publish($id: ID!, $publicationId: ID!) {
      publishablePublish(id: $id, input: { publicationId: $publicationId }) {
        userErrors { field message }
      }
    }`;
    runGraphQL(pubMut, { id: collectionId, publicationId });

    for (const h of c.handles) {
      const pid = productIds[h];
      if (pid) runGraphQL(pubMut, { id: pid, publicationId });
    }
    console.log('collection', c.handle, collectionId);
  }

  const pages = [
    { title: 'Girls Purse Shop', handle: 'gp-shop', templateSuffix: 'gp-shop' },
    { title: 'About Girls Purse', handle: 'gp-about', templateSuffix: 'gp-about' },
    { title: 'Contact Girls Purse', handle: 'gp-contact', templateSuffix: 'gp-contact' },
  ];

  for (const page of pages) {
    const pageMut = `mutation PageCreate($page: PageCreateInput!) {
      pageCreate(page: $page) {
        page { id handle }
        userErrors { field message }
      }
    }`;
    const res = runGraphQL(pageMut, {
      page: {
        title: page.title,
        handle: page.handle,
        templateSuffix: page.templateSuffix,
        body: `<p>${page.title}</p>`,
      },
    });
    console.log('page', page.handle, res.pageCreate?.userErrors ?? res.pageCreate?.page?.id);
  }

  console.log('Done. Product IDs:', Object.keys(productIds).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
