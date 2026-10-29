// scripts/find-bundle-code.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

// Search for "Two Hoodies" or "Three Hoodies"
const t2 = html.indexOf('Two Hoodies');
if (t2 !== -1) {
  console.log('=== FOUND TWO HOODIES ===');
  console.log(html.substring(Math.max(0, t2 - 600), t2 + 2000));
} else {
  console.log('Two Hoodies not found');
}
