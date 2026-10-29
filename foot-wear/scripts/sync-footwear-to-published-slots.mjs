/**
 * DEPRECATED — overwrites winter product handles on the same store and breaks Girls Winter theme.
 * Use seed-luxe-step-catalog.mjs + restore-winter-catalog.mjs instead (separate product sets).
 * Only run with --force-overwrite if you intentionally want to remap slots again.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'y9yn6k-me.myshopify.com';
const API_VERSION = '2025-01';
const THEME_ID = '154579402821';

const WINTER_SLOT_HANDLES = [
  'belted-wool-jacket',
  'camel-parka',
  'cropped-puffer',
  'chocolate-wool-jacket',
  'cream-fleece-hoodie',
  'black-zip-hoodie',
  'grey-oversized-hoodie',
  'burgundy-hoodie',
  'white-turtleneck',
  'camel-crewneck',
  'black-rib-turtleneck',
  'ivory-rollneck',
  'long-black-coat',
  'aurelle-all-in-one-styler',
  'schicht-schnee™-reactive-jacket',
  'schicht-schnee™-reactive-mask',
  'mystery-box',
  'shipping-protection',
  'curvd-cozy-suede-look-slippers',
  'curvd-cozy-fall-slouch-socks',
];

const CATALOG = [
  {
    handle: 'womens-black-stiletto-heel',
    title: "Women's Black Stiletto Heel",
    price: '6090.00',
    gender: 'Women',
    type: 'Heels',
    imageAsset: 'fw-gen-womens-black-stiletto-heel.jpg',
  },
  {
    handle: 'womens-nude-court-pump',
    title: "Women's Nude Court Pump",
    price: '5490.00',
    gender: 'Women',
    type: 'Heels',
    imageAsset: 'fw-gen-womens-nude-court-pump.jpg',
  },
  {
    handle: 'womens-block-heel-mule',
    title: "Women's Block Heel Mule",
    price: '5390.00',
    gender: 'Women',
    type: 'Heels',
    imageAsset: 'fw-gen-womens-block-heel-mule.jpg',
  },
  {
    handle: 'womens-satin-evening-heel',
    title: "Women's Satin Evening Heel",
    price: '7190.00',
    gender: 'Women',
    type: 'Heels',
    imageAsset: 'fw-gen-womens-satin-evening-heel.jpg',
  },
  {
    handle: 'womens-tan-ankle-boot',
    title: "Women's Tan Ankle Boot",
    price: '6490.00',
    gender: 'Women',
    type: 'Boots',
    imageAsset: 'fw-gen-womens-tan-ankle-boot.jpg',
  },
  {
    handle: 'mens-black-chelsea-boot',
    title: "Men's Black Chelsea Boot",
    price: '6390.00',
    gender: 'Men',
    type: 'Boots',
    imageAsset: 'fw-gen-mens-black-chelsea-boot.jpg',
  },
  {
    handle: 'womens-knee-high-boot',
    title: "Women's Knee-High Boot",
    price: '7490.00',
    gender: 'Women',
    type: 'Boots',
    imageAsset: 'fw-gen-womens-knee-high-boot.jpg',
  },
  {
    handle: 'mens-lace-up-combat-boot',
    title: "Men's Lace-Up Combat Boot",
    price: '6990.00',
    gender: 'Men',
    type: 'Boots',
    imageAsset: 'fw-gen-mens-lace-up-combat-boot.jpg',
  },
  {
    handle: 'mens-brown-leather-loafer',
    title: "Men's Brown Leather Loafer",
    price: '4890.00',
    gender: 'Men',
    type: 'Loafers',
    imageAsset: 'fw-gen-mens-brown-leather-loafer.jpg',
  },
  {
    handle: 'womens-penny-loafer',
    title: "Women's Penny Loafer",
    price: '4690.00',
    gender: 'Women',
    type: 'Loafers',
    imageAsset: 'fw-gen-womens-penny-loafer.jpg',
  },
  {
    handle: 'mens-black-tassel-loafer',
    title: "Men's Black Tassel Loafer",
    price: '5190.00',
    gender: 'Men',
    type: 'Loafers',
    imageAsset: 'fw-gen-mens-black-tassel-loafer.jpg',
  },
  {
    handle: 'womens-horsebit-loafer',
    title: "Women's Horsebit Loafer",
    price: '4990.00',
    gender: 'Women',
    type: 'Loafers',
    imageAsset: 'fw-gen-womens-horsebit-loafer.jpg',
  },
  {
    handle: 'womens-gold-strappy-sandal',
    title: "Women's Gold Strappy Sandal",
    price: '4490.00',
    gender: 'Women',
    type: 'Sandals',
    imageAsset: 'fw-gen-womens-gold-strappy-sandal.jpg',
  },
  {
    handle: 'mens-leather-slide-sandal',
    title: "Men's Leather Slide Sandal",
    price: '3990.00',
    gender: 'Men',
    type: 'Sandals',
    imageAsset: 'fw-gen-mens-leather-slide-sandal.jpg',
  },
  {
    handle: 'womens-platform-wedge-sandal',
    title: "Women's Platform Wedge Sandal",
    price: '4990.00',
    gender: 'Women',
    type: 'Sandals',
    imageAsset: 'fw-gen-womens-platform-wedge-sandal.jpg',
  },
  {
    handle: 'mens-sport-sandal',
    title: "Men's Sport Sandal",
    price: '3690.00',
    gender: 'Men',
    type: 'Sandals',
    imageAsset: 'fw-gen-mens-sport-sandal.jpg',
  },
  {
    handle: 'white-luxury-low-sneaker',
    title: 'White Luxury Low Sneaker',
    price: '5790.00',
    gender: 'Unisex',
    type: 'Sneakers',
    imageAsset: 'fw-gen-white-luxury-low-sneaker.jpg',
  },
  {
    handle: 'mens-court-sneaker',
    title: "Men's Court Sneaker",
    price: '5390.00',
    gender: 'Men',
    type: 'Sneakers',
    imageAsset: 'fw-gen-mens-court-sneaker.jpg',
  },
  {
    handle: 'womens-knit-runner',
    title: "Women's Knit Runner",
    price: '5190.00',
    gender: 'Women',
    type: 'Sneakers',
    imageAsset: 'fw-gen-womens-knit-runner.jpg',
  },
  {
    handle: 'mens-retro-leather-sneaker',
    title: "Men's Retro Leather Sneaker",
    price: '5590.00',
    gender: 'Men',
    type: 'Sneakers',
    imageAsset: 'fw-gen-mens-retro-leather-sneaker.jpg',
  },
];

function getToken() {
  const configPath = join(homedir(), 'AppData', 'Roaming', 'shopify-cli-kit-nodejs', 'Config', 'config.json');
  const raw = JSON.parse(readFileSync(configPath, 'utf8'));
  const sessions = JSON.parse(raw.sessionStore);
  const k = `${STORE}-7ee65a63608843c577db8b23c4d7316ea0a01bd2f7594f8a9c06ea668c1b775c`;
  return sessions['accounts.shopify.com'][raw.currentSessionId].applications[k].accessToken;
}

async function gql(token, query, variables = {}) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

function themeAssetUrl(asset) {
  return `https://${STORE}/cdn/shop/t/${THEME_ID}/assets/${asset}?v=${Date.now()}`;
}

async function getProductByHandle(token, handle) {
  const data = await gql(
    token,
    `query ($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        onlineStoreUrl
        variants(first: 1) { nodes { id } }
      }
    }`,
    { handle }
  );
  return data.productByHandle;
}

async function deleteProduct(token, id) {
  await gql(
    token,
    `mutation ($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors { message }
      }
    }`,
    { input: { id } }
  );
}

async function convertSlot(token, slotHandle, footwear) {
  const slot = await getProductByHandle(token, slotHandle);
  if (!slot?.id) {
    console.log(`  skip slot missing: ${slotHandle}`);
    return;
  }

  const draft = await getProductByHandle(token, footwear.handle);
  if (draft?.id && draft.id !== slot.id) {
    await deleteProduct(token, draft.id);
    console.log(`  removed draft duplicate: ${footwear.handle}`);
  }

  const tags = ['solmarch', 'footwear', footwear.gender.toLowerCase()];
  const update = await gql(
    token,
    `mutation ($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id handle onlineStoreUrl }
        userErrors { message }
      }
    }`,
    {
      product: {
        id: slot.id,
        handle: footwear.handle,
        title: footwear.title,
        vendor: 'Solmarch',
        productType: footwear.type,
        tags,
        status: 'ACTIVE',
      },
    }
  );

  const errs = update.productUpdate.userErrors;
  if (errs?.length) {
    console.log(`  update error ${footwear.handle}:`, errs.map((e) => e.message).join(', '));
    return;
  }

  const variantId = slot.variants?.nodes?.[0]?.id;
  if (variantId) {
    await gql(
      token,
      `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors { message }
        }
      }`,
      {
        productId: slot.id,
        variants: [{ id: variantId, price: footwear.price }],
      }
    );
  }

  await gql(
    token,
    `mutation ($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
      productUpdate(product: $product, media: $media) {
        userErrors { message }
      }
    }`,
    {
      product: { id: slot.id },
      media: [
        {
          originalSource: themeAssetUrl(footwear.imageAsset),
          mediaContentType: 'IMAGE',
          alt: footwear.title,
        },
      ],
    }
  );

  const check = await getProductByHandle(token, footwear.handle);
  console.log(`  live: ${footwear.handle} → ${check?.onlineStoreUrl || 'no url'}`);
}

async function main() {
  if (!process.argv.includes('--force-overwrite')) {
    console.error(
      'Blocked: sync-footwear-to-published-slots overwrites shared winter URLs.\n' +
        'Use: node scripts/restore-winter-catalog.mjs && node scripts/tag-footwear-demo.mjs'
    );
    process.exit(1);
  }
  const token = getToken();
  if (CATALOG.length > WINTER_SLOT_HANDLES.length) {
    throw new Error('Not enough published slots for footwear catalog');
  }

  for (let i = 0; i < CATALOG.length; i++) {
    console.log(`\n[${i + 1}/${CATALOG.length}] ${CATALOG[i].handle}`);
    await convertSlot(token, WINTER_SLOT_HANDLES[i], CATALOG[i]);
  }

  console.log('\nAll footwear URLs should work on Online Store now.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
