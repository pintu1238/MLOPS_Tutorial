const fs = require('fs');

const mainHtml = fs.readFileSync('parsed_sections/shopify-section-template--30280083603830__main.html', 'utf8');

// Find all text and clean elements
const clean = mainHtml.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
fs.writeFileSync('parsed_sections/main.clean.html', clean);
console.log('Saved main.clean.html:', clean.length);

// Also look for specific product elements
const badges = clean.match(/class="[^"]*badge[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi) || [];
console.log('Badges found:', badges.length);
badges.forEach(b => console.log('Badge:', b.replace(/<[^>]+>/g, '').trim()));
