// scripts/find-reviews-html.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const idx = html.indexOf('What They Said After the First Week');
if (idx !== -1) {
  const start = html.lastIndexOf('<div', idx - 200);
  const end = html.indexOf('</section>', idx);
  console.log(html.substring(start, end !== -1 ? end + 10 : idx + 3500));
}
