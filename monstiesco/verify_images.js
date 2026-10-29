const fs = require('fs');
const path = require('path');

const localImages = new Set(fs.readdirSync('assets/images'));

const checkFiles = [
  'shopify-section-template--30280083603830__main.html',
  'shopify-section-template--30280083603830__facebook_testimonials_RRw9jd.html',
  'shopify-section-template--30280083603830__testimonials_zEAEjG.html',
  'shopify-section-template--30280083603830__collapsible_content_Uf4pit.html',
  'sections--30280083702134__header.full.html',
  'sections--30280083669366__footer.full.html'
];

checkFiles.forEach(cf => {
  const p = path.join('parsed_sections', cf);
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  const m = content.match(/cdn\/shop\/files\/([^"'<>\s,?]+)/g) || [];
  const found = new Set(m.map(x => x.replace('cdn/shop/files/', '')));
  console.log(`\n=== Images in ${cf} (${found.size}) ===`);
  found.forEach(img => {
    const exists = localImages.has(img);
    console.log(`  ${img}: ${exists ? 'EXISTS LOCALLY' : 'MISSING'}`);
  });
});
