const fs = require('fs');
const path = require('path');

function getCleanText(filename) {
  const file = path.join('parsed_sections', filename);
  if (!fs.existsSync(file)) return '';
  const html = fs.readFileSync(file, 'utf8');
  // strip style and script tags
  const noStyle = html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  return noStyle;
}

const sections = [
  'sections--30280083702134__2c2ec774-3430-481f-b927-e9c035b9d24e.full.html',
  'sections--30280083702134__header.full.html',
  'shopify-section-template--30280083603830__facebook_testimonials_RRw9jd.html',
  'shopify-section-template--30280083603830__collapsible_content_Uf4pit.html',
  'shopify-section-template--30280083603830__horizontal_ticker_4dbAFk.html',
  'shopify-section-template--30280083603830__testimonials_zEAEjG.html',
  'sections--30280083669366__footer.full.html'
];

sections.forEach(s => {
  const clean = getCleanText(s);
  fs.writeFileSync(`parsed_sections/${s}.clean.txt`, clean);
  console.log(`Saved ${s}.clean.txt (${clean.length} bytes)`);
});
