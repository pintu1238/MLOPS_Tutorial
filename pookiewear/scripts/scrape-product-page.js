// scripts/scrape-product-page.js
const fs = require('fs');

async function main() {
  const url = 'https://thepookiewear.com/products/pookie-hoodie';
  const res = await fetch(url);
  const html = await res.text();
  fs.writeFileSync('product-page-reference.html', html);
  console.log('Saved product-page-reference.html, size:', html.length);
}

main().catch(console.error);
