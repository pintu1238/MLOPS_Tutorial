const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

const list = [
  'shopify-section-template--30280083603830__main',
  'shopify-section-template--30280083603830__facebook_testimonials_RRw9jd',
  'shopify-section-template--30280083603830__logo_list_BttNjW',
  'shopify-section-template--30280083603830__horizontal_ticker_4dbAFk',
  'shopify-section-template--30280083603830__b321ab88-2b59-4dba-bade-54885c874ca5',
  'shopify-section-template--30280083603830__collapsible_content_Uf4pit',
  'shopify-section-template--30280083603830__section_divider_hVmR3F',
  'shopify-section-template--30280083603830__testimonials_zEAEjG'
];

list.forEach(id => {
  const start = html.indexOf(id);
  if (start !== -1) {
    // find closing tag or next section
    let nextStart = html.length;
    list.forEach(otherId => {
      if (otherId !== id) {
        const oIdx = html.indexOf(otherId);
        if (oIdx > start && oIdx < nextStart) {
          nextStart = oIdx;
        }
      }
    });
    const content = html.substring(start, nextStart);
    fs.writeFileSync(`parsed_sections/${id}.html`, content);
    console.log(`Saved ${id}.html (${content.length} chars)`);
  }
});
