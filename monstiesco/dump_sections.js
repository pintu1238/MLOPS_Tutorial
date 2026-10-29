const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('monsties.html', 'utf8');

const secDir = path.join(__dirname, 'parsed_sections');
fs.mkdirSync(secDir, { recursive: true });

// Matches each shopify section block
const regex = /<div\s+id=[\"']shopify-section-([^\"']+)[\"'][^>]*>([\s\S]*?)<\/div>\s*<!--\s*\/shopify-section/gi;

// Or find by <div id="shopify-section-...
const sections = [
  'sections--30280083702134__2c2ec774-3430-481f-b927-e9c035b9d24e',
  'sections--30280083702134__header',
  'cart-drawer',
  'template--30280083603830__main',
  'template--30280083603830__facebook_testimonials_RRw9jd',
  'template--30280083603830__logo_list_BttNjW',
  'template--30280083603830__horizontal_ticker_4dbAFk',
  'template--30280083603830__b321ab88-2b59-4dba-bade-54885c874ca5',
  'template--30280083603830__collapsible_content_Uf4pit',
  'template--30280083603830__section_divider_hVmR3F',
  'template--30280083603830__testimonials_zEAEjG',
  'sections--30280083669366__footer'
];

sections.forEach(s => {
  const marker = `id="shopify-section-${s}"`;
  const idx = html.indexOf(marker);
  if (idx !== -1) {
    const endComment = `<!-- /shopify-section -->`;
    const nextIdx = html.indexOf(endComment, idx);
    let chunk = '';
    if (nextIdx !== -1) {
      chunk = html.substring(idx, nextIdx + endComment.length);
    } else {
      chunk = html.substring(idx, idx + 20000);
    }
    const cleanName = s.replace(/[^a-zA-Z0-9_-]/g, '_');
    fs.writeFileSync(path.join(secDir, `${cleanName}.html`), chunk);
    console.log(`Saved ${cleanName}.html (${chunk.length} bytes)`);
  }
});
