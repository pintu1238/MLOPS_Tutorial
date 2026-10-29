// scripts/find-guarantee-html.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const idx = html.indexOf('Wear it for 30 days');
if (idx !== -1) {
  console.log('=== FOUND Wear it for 30 days ===');
  console.log(html.substring(Math.max(0, idx - 600), idx + 1500));
} else {
  console.log('Not found');
}
