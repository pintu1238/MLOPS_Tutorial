// scripts/check-contact-sections.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');

// Check sections
const sectionIds = [];
const secMatches = html.matchAll(/id="shopify-section-([^"]+)"/g);
for (const m of secMatches) {
  sectionIds.push(m[1]);
}
console.log('Sections on contact page:', sectionIds);

// Check if countdown or top bar is on contact page
console.log('Has countdown?', /FLASH SALE ENDS IN/i.test(html));
console.log('Has announcement?', /FREE SHIPPING WORLDWIDE/i.test(html));
console.log('Has footer?', /footer/i.test(html));
