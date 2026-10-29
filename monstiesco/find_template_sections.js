const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

const regex = /shopify-section-template--[^\s"'>]+/gi;
const matches = html.match(regex);
console.log('Matches:', matches);
