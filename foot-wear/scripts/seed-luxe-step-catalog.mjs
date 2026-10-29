/**
 * Seeds Luxe Step footwear products and collections on y9yn6k-me.
 * Uses the Shopify CLI session token from the local machine (not committed).
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';

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
  const account = sessions['accounts.shopify.com'];
  const session = account[raw.currentSessionId];
  const storeKey = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
  const token =
    session.applications?.[storeKey]?.accessToken ??
    session.applications?.['7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c']?.accessToken;
  if (!token) throw new Error('No store access token in Shopify CLI config. Run: shopify theme list --store ' + STORE);
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

const CATALOG = [
  {
    collection: 'heels',
    products: [
      {
        handle: 'womens-black-stiletto-heel',
        title: "Women's Black Stiletto Heel",
        price: '15990.00',
        gender: 'Women',
        type: 'Heels',
        image:
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd3?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-black-stiletto-heel.jpg',
      },
      {
        handle: 'womens-nude-court-pump',
        title: "Women's Nude Court Pump",
        price: '14290.00',
        gender: 'Women',
        type: 'Heels',
        image:
          'https://images.unsplash.com/photo-1515342870182-75a88d4e9d41?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-nude-court-pump.jpg',
      },
      {
        handle: 'womens-block-heel-mule',
        title: "Women's Block Heel Mule",
        price: '13890.00',
        gender: 'Women',
        type: 'Heels',
        image:
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-block-heel-mule.jpg',
      },
      {
        handle: 'womens-satin-evening-heel',
        title: "Women's Satin Evening Heel",
        price: '18990.00',
        gender: 'Women',
        type: 'Heels',
        image:
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8d077?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-satin-evening-heel.jpg',
      },
    ],
  },
  {
    collection: 'boots',
    products: [
      {
        handle: 'womens-tan-ankle-boot',
        title: "Women's Tan Ankle Boot",
        price: '17290.00',
        gender: 'Women',
        type: 'Boots',
        image:
          'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-tan-ankle-boot.jpg',
      },
      {
        handle: 'mens-black-chelsea-boot',
        title: "Men's Black Chelsea Boot",
        price: '16890.00',
        gender: 'Men',
        type: 'Boots',
        image:
          'https://images.unsplash.com/photo-1638243304067-9a4a4be7e24d?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-black-chelsea-boot.jpg',
      },
      {
        handle: 'womens-knee-high-boot',
        title: "Women's Knee-High Boot",
        price: '19990.00',
        gender: 'Women',
        type: 'Boots',
        image:
          'https://images.unsplash.com/photo-1608258346330-53b89b3a1ace?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-knee-high-boot.jpg',
      },
      {
        handle: 'mens-lace-up-combat-boot',
        title: "Men's Lace-Up Combat Boot",
        price: '18490.00',
        gender: 'Men',
        type: 'Boots',
        image:
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-lace-up-combat-boot.jpg',
      },
    ],
  },
  {
    collection: 'loafers',
    products: [
      {
        handle: 'mens-brown-leather-loafer',
        title: "Men's Brown Leather Loafer",
        price: '12490.00',
        gender: 'Men',
        type: 'Loafers',
        image:
          'https://images.unsplash.com/photo-1533867610401-7e5b8e8e8f0b?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-brown-leather-loafer.jpg',
      },
      {
        handle: 'womens-penny-loafer',
        title: "Women's Penny Loafer",
        price: '11890.00',
        gender: 'Women',
        type: 'Loafers',
        image:
          'https://images.unsplash.com/photo-1560763189-8f63f6830c5f?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-penny-loafer.jpg',
      },
      {
        handle: 'mens-black-tassel-loafer',
        title: "Men's Black Tassel Loafer",
        price: '13490.00',
        gender: 'Men',
        type: 'Loafers',
        image:
          'https://images.unsplash.com/photo-1614252239476-9a3a5c0b1c0b?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-black-tassel-loafer.jpg',
      },
      {
        handle: 'womens-horsebit-loafer',
        title: "Women's Horsebit Loafer",
        price: '12990.00',
        gender: 'Women',
        type: 'Loafers',
        image:
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-horsebit-loafer.jpg',
      },
    ],
  },
  {
    collection: 'sandals',
    products: [
      {
        handle: 'womens-gold-strappy-sandal',
        title: "Women's Gold Strappy Sandal",
        price: '11290.00',
        gender: 'Women',
        type: 'Sandals',
        image:
          'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-gold-strappy-sandal.jpg',
      },
      {
        handle: 'mens-leather-slide-sandal',
        title: "Men's Leather Slide Sandal",
        price: '9990.00',
        gender: 'Men',
        type: 'Sandals',
        image:
          'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-leather-slide-sandal.jpg',
      },
      {
        handle: 'womens-platform-wedge-sandal',
        title: "Women's Platform Wedge Sandal",
        price: '12890.00',
        gender: 'Women',
        type: 'Sandals',
        image:
          'https://images.unsplash.com/photo-1603487742131-0cf049a36598?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-platform-wedge-sandal.jpg',
      },
      {
        handle: 'mens-sport-sandal',
        title: "Men's Sport Sandal",
        price: '8990.00',
        gender: 'Men',
        type: 'Sandals',
        image:
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-sport-sandal.jpg',
      },
    ],
  },
  {
    collection: 'sneakers',
    products: [
      {
        handle: 'white-luxury-low-sneaker',
        title: 'White Luxury Low Sneaker',
        price: '14990.00',
        gender: 'Unisex',
        type: 'Sneakers',
        image:
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-white-luxury-low-sneaker.jpg',
      },
      {
        handle: 'mens-court-sneaker',
        title: "Men's Court Sneaker",
        price: '13990.00',
        gender: 'Men',
        type: 'Sneakers',
        image:
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-court-sneaker.jpg',
      },
      {
        handle: 'womens-knit-runner',
        title: "Women's Knit Runner",
        price: '13490.00',
        gender: 'Women',
        type: 'Sneakers',
        image:
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-womens-knit-runner.jpg',
      },
      {
        handle: 'mens-retro-leather-sneaker',
        title: "Men's Retro Leather Sneaker",
        price: '14490.00',
        gender: 'Men',
        type: 'Sneakers',
        image:
          'https://images.unsplash.com/photo-1608231387042-66d1773070a9?auto=format&fit=crop&w=900&q=80',
        imageAsset: 'fw-gen-mens-retro-leather-sneaker.jpg',
      },
    ],
  },
];

async function getProductIdByHandle(token, handle) {
  const data = await adminGraphql(
    token,
    `query ($handle: String!) { productByHandle(handle: $handle) { id } }`,
    { handle }
  );
  return data.productByHandle?.id ?? null;
}

async function createOrUpdateProduct(token, product) {
  const existingId = await getProductIdByHandle(token, product.handle);
  if (existingId) {
    console.log(`  skip (exists): ${product.handle}`);
    return existingId;
  }

  const mutation = `
    mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id handle }
        userErrors { field message }
      }
    }
  `;

  const tags = ['demo-footwear', 'solmarch', 'footwear', product.gender.toLowerCase()];
  const data = await adminGraphql(token, mutation, {
    product: {
      title: product.title,
      handle: product.handle,
      vendor: 'Solmarch',
      productType: product.type,
      tags,
      status: 'ACTIVE',
    },
    media: [
      {
        originalSource: product.image,
        mediaContentType: 'IMAGE',
        alt: product.title,
      },
    ],
  });

  const result = data.productCreate;
  if (result.userErrors?.length) {
    throw new Error(`${product.handle}: ${result.userErrors.map((e) => e.message).join(', ')}`);
  }

  const productId = result.product.id;
  console.log(`  created: ${product.handle}`);

  const variantMutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { field message }
      }
    }
  `;

  const variantQuery = `
    query ($id: ID!) {
      product(id: $id) {
        variants(first: 1) { nodes { id } }
      }
    }
  `;
  const variantData = await adminGraphql(token, variantQuery, { id: productId });
  const variantId = variantData.product.variants.nodes[0]?.id;
  if (variantId) {
    await adminGraphql(token, variantMutation, {
      productId,
      variants: [{ id: variantId, price: product.price }],
    });
  }

  return productId;
}

async function ensureCollection(token, handle, title, productIds) {
  const existing = await adminGraphql(
    token,
    `query ($handle: String!) { collectionByHandle(handle: $handle) { id } }`,
    { handle }
  );

  let collectionId = existing.collectionByHandle?.id;

  if (!collectionId) {
    const create = await adminGraphql(
      token,
      `mutation collectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id }
          userErrors { message }
        }
      }`,
      {
        input: {
          title,
          handle,
          ruleSet: null,
        },
      }
    );
    const errs = create.collectionCreate.userErrors;
    if (errs?.length) throw new Error(errs.map((e) => e.message).join(', '));
    collectionId = create.collectionCreate.collection.id;
    console.log(`collection created: ${handle}`);
  } else {
    console.log(`collection exists: ${handle}`);
  }

  await adminGraphql(
    token,
    `mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) {
        userErrors { message }
      }
    }`,
    { id: collectionId, productIds }
  );

  return collectionId;
}

async function main() {
  const token = getStoreAccessToken();
  console.log('Seeding Luxe Step footwear on', STORE);

  const collectionProductIds = {};

  for (const group of CATALOG) {
    console.log(`\n${group.collection}:`);
    collectionProductIds[group.collection] = [];
    for (const product of group.products) {
      const id = await createOrUpdateProduct(token, product);
      collectionProductIds[group.collection].push(id);
    }
  }

  const titles = {
    heels: "Women's & evening heels",
    boots: "Men's & women's boots",
    loafers: "Men's & women's loafers",
    sandals: "Men's & women's sandals",
    sneakers: "Men's & women's sneakers",
  };

  for (const group of CATALOG) {
    await ensureCollection(
      token,
      group.collection,
      titles[group.collection],
      collectionProductIds[group.collection]
    );
  }

  console.log('\nDone. 20 footwear products and 5 collections.');
  console.log(
    '\nIMPORTANT: Publish to Online Store in Admin → Products → filter tag "footwear" → Bulk edit → Sales channels → Online Store.'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
