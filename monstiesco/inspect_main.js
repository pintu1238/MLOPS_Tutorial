const fs = require('fs');

const mainHtml = fs.readFileSync('parsed_sections/template--30280083603830__main.html', 'utf8');

// Find headings, prices, reviews
const titles = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
console.log('Title:', titles);

const prices = mainHtml.match(/class="[^"]*price[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
console.log('Prices count:', prices ? prices.length : 0);

const swatches = mainHtml.match(/<fieldset[^>]*>([\s\S]*?)<\/fieldset>/gi);
console.log('Fieldsets count:', swatches ? swatches.length : 0);
if (swatches) {
  swatches.forEach(s => console.log('Fieldset:', s.substring(0, 300)));
}
