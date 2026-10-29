import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const sections = {
  gw_shop_hero: {
    type: 'gw-shop-hero',
    settings: {
      eyebrow: 'Luxe Step',
      title: 'Shop',
      lead:
        "Men's and women's footwear in one place — heels, boots, loafers, sandals, and sneakers. Curated pairs for work, weekends, and nights out.",
      trust_line: 'Secure checkout · Easy returns · New styles weekly',
    },
  },
  gw_shop_nav: {
    type: 'gw-shop-nav',
    blocks: {
      nav_heels: { type: 'link', settings: { label: 'Heels', link: '#shop-heels' } },
      nav_boots: { type: 'link', settings: { label: 'Boots', link: '#shop-boots' } },
      nav_loafers: { type: 'link', settings: { label: 'Loafers', link: '#shop-loafers' } },
      nav_sandals: { type: 'link', settings: { label: 'Sandals', link: '#shop-sandals' } },
      nav_sneakers: { type: 'link', settings: { label: 'Sneakers', link: '#shop-sneakers' } },
    },
    block_order: ['nav_heels', 'nav_boots', 'nav_loafers', 'nav_sandals', 'nav_sneakers'],
    settings: { title: 'Categories', nav_label: 'Shop categories' },
  },
};

const groups = [
  {
    id: 'gw_edit_heels',
    handle: 'heels',
    eyebrow: 'Women',
    heading: 'Heels',
    script: 'Lift every look.',
    subheading: "Stilettos, pumps, and evening heels — women's styles sized for US fit.",
    layout: 'feature',
    background: '#f7f4ef',
    products: [
      ['heel_1', 'womens-black-stiletto-heel', "Women's Black Stiletto Heel", '15990'],
      ['heel_2', 'womens-nude-court-pump', "Women's Nude Court Pump", '14290'],
      ['heel_3', 'womens-block-heel-mule', "Women's Block Heel Mule", '13890'],
      ['heel_4', 'womens-satin-evening-heel', "Women's Satin Evening Heel", '18990'],
    ],
  },
  {
    id: 'gw_edit_boots',
    handle: 'boots',
    eyebrow: 'Men & women',
    heading: 'Boots',
    script: 'Built for cold streets.',
    subheading: 'Ankle boots, Chelseas, and lace-ups for her and him.',
    layout: 'next',
    background: '#ffffff',
    products: [
      ['boot_1', 'womens-tan-ankle-boot', "Women's Tan Ankle Boot", '17290'],
      ['boot_2', 'mens-black-chelsea-boot', "Men's Black Chelsea Boot", '16890'],
      ['boot_3', 'womens-knee-high-boot', "Women's Knee-High Boot", '19990'],
      ['boot_4', 'mens-lace-up-combat-boot', "Men's Lace-Up Combat Boot", '18490'],
    ],
  },
  {
    id: 'gw_edit_loafers',
    handle: 'loafers',
    eyebrow: 'Men & women',
    heading: 'Loafers',
    script: 'Slip on, step out.',
    subheading: 'Leather loafers and penny styles for office and off-duty.',
    layout: 'next',
    background: '#f7f4ef',
    products: [
      ['loafer_1', 'mens-brown-leather-loafer', "Men's Brown Leather Loafer", '12490'],
      ['loafer_2', 'womens-penny-loafer', "Women's Penny Loafer", '11890'],
      ['loafer_3', 'mens-black-tassel-loafer', "Men's Black Tassel Loafer", '13490'],
      ['loafer_4', 'womens-horsebit-loafer', "Women's Horsebit Loafer", '12990'],
    ],
  },
  {
    id: 'gw_edit_sandals',
    handle: 'sandals',
    eyebrow: 'Men & women',
    heading: 'Sandals',
    script: 'Open-air ease.',
    subheading: 'Strappy heels, slides, and sport sandals for warm days and travel.',
    layout: 'next',
    background: '#ffffff',
    products: [
      ['sandal_1', 'womens-gold-strappy-sandal', "Women's Gold Strappy Sandal", '11290'],
      ['sandal_2', 'mens-leather-slide-sandal', "Men's Leather Slide Sandal", '9990'],
      ['sandal_3', 'womens-platform-wedge-sandal', "Women's Platform Wedge Sandal", '12890'],
      ['sandal_4', 'mens-sport-sandal', "Men's Sport Sandal", '8990'],
    ],
  },
  {
    id: 'gw_edit_sneakers',
    handle: 'sneakers',
    eyebrow: 'Men & women',
    heading: 'Sneakers',
    script: 'Everyday luxury.',
    subheading: 'Clean court silhouettes, knit runners, and retro leather pairs.',
    layout: 'next',
    background: '#f7f4ef',
    products: [
      ['sneaker_1', 'white-luxury-low-sneaker', 'White Luxury Low Sneaker', '14990'],
      ['sneaker_2', 'mens-court-sneaker', "Men's Court Sneaker", '13990'],
      ['sneaker_3', 'womens-knit-runner', "Women's Knit Runner", '13490'],
      ['sneaker_4', 'mens-retro-leather-sneaker', "Men's Retro Leather Sneaker", '14490'],
    ],
  },
];

for (const g of groups) {
  const blocks = {};
  const block_order = [];
  for (const [key, handle, title, price] of g.products) {
    const asset = `fw-gen-${handle}.jpg`;
    const brand = title.startsWith("Men's")
      ? 'Luxe Step · Men'
      : title.startsWith("Women's")
        ? 'Luxe Step · Women'
        : 'Luxe Step';
    blocks[key] = {
      type: 'look',
      settings: {
        title,
        price: `Rs. ${Number(price).toLocaleString('en-IN')}.00`,
        brand,
        alt: title,
        link: `/products/${handle}`,
        image_asset: asset,
      },
    };
    block_order.push(key);
  }
  sections[g.id] = {
    type: 'gw-edit',
    blocks,
    block_order,
    settings: {
      eyebrow: g.eyebrow,
      heading: g.heading,
      script: g.script,
      subheading: g.subheading,
      shop_label: '',
      shop_link: `/pages/shop#shop-${g.handle}`,
      collection: g.handle,
      prefer_look_blocks: true,
      layout: g.layout,
      background: g.background,
    },
  };
}

const template = {
  sections,
  order: [
    'gw_shop_hero',
    'gw_shop_nav',
    'gw_edit_heels',
    'gw_edit_boots',
    'gw_edit_loafers',
    'gw_edit_sandals',
    'gw_edit_sneakers',
  ],
};

const header = `/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
`;

writeFileSync(
  join(root, 'templates', 'page.shop.json'),
  header + JSON.stringify(template, null, 2) + '\n',
  'utf8'
);
console.log('Wrote templates/page.shop.json');
