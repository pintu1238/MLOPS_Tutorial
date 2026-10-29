// scripts/print-guarantee-full.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const idx = html.indexOf('ths-gtee');
if (idx !== -1) {
  const start = html.lastIndexOf('<div', idx);
  const end = html.indexOf('</section>', idx);
  console.log(html.substring(start, end !== -1 ? end + 10 : idx + 3500));
}
