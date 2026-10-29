const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

// Find all section elements
const regex = /<div\s+id=[\"']shopify-section-([^\"']+)[\"'][^>]*>([\s\S]*?)<\/div>\s*<!--\s*\/shopify-section/gi;

let m;
const sectionMap = {};

// Alternatively find by section tag or class
const secRegex = /<section[^>]*id=[\"']shopify-section-([^\"']+)[\"'][^>]*>([\s\S]*?)<\/section>/gi;

// Let's dump all sections
const parts = html.split(/id=[\"']shopify-section-/i);
console.log('Split sections count:', parts.length);

for (let i = 1; i < parts.length; i++) {
  const secId = parts[i].substring(0, parts[i].indexOf('"'));
  const content = parts[i].substring(parts[i].indexOf('>') + 1);
  const endIdx = content.indexOf('shopify-section-');
  const snippet = endIdx !== -1 ? content.substring(0, endIdx) : content.substring(0, 2000);
  console.log(`Section ${i}: ${secId} (length: ${snippet.length})`);
}
