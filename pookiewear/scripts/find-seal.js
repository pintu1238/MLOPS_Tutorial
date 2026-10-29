// scripts/find-seal.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const idx = html.indexOf('30-DAY');
if (idx !== -1) {
  console.log('=== FOUND 30-DAY ===');
  console.log(html.substring(Math.max(0, idx - 400), idx + 800));
} else {
  console.log('30-DAY not found, searching GUARANTEE');
  const gIdx = html.indexOf('GUARANTEE');
  if (gIdx !== -1) {
    console.log(html.substring(Math.max(0, gIdx - 200), gIdx + 500));
  }
}
