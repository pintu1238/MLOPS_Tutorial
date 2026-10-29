const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

// Find all CSS files
const cssRegex = /href=[\"']([^\"']+\.css(?:\?[^\"']*)?)[\"']/gi;
const cssFiles = [];
let m;
while ((m = cssRegex.exec(html)) !== null) {
  cssFiles.push(m[1]);
}
console.log('CSS files:', cssFiles);

// Find Shopify sections
const sectionRegex = /id=[\"']shopify-section-([^\"']+)[\"']/gi;
const sections = new Set();
while ((m = sectionRegex.exec(html)) !== null) {
  sections.add(m[1]);
}
console.log('Shopify sections on page:', Array.from(sections));

// Check theme name or schema
const themeRegex = /Shopify\.theme\s*=\s*({[^}]+})/i;
const themeMatch = html.match(themeRegex);
if (themeMatch) console.log('Theme info:', themeMatch[1]);
