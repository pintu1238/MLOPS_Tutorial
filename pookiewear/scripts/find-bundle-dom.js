// scripts/find-bundle-dom.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const matches = html.match(/<div[^>]*class="[^"]*deal[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
console.log('Matches for deal in class:', matches ? matches.length : 0);
if (matches) {
  matches.slice(0, 5).forEach((m, i) => console.log(`--- Match ${i} ---`, m.substring(0, 200)));
}

// Let's check where the text "Buy one, gift the other" appears in HTML outside json
let pos = 0;
while ((pos = html.indexOf('Buy one, gift the other', pos)) !== -1) {
  console.log(`\nOccurrence at ${pos}:`);
  console.log(html.substring(Math.max(0, pos - 150), pos + 250));
  pos += 23;
}
