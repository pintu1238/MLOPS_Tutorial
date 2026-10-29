// scripts/extract-contact-markup.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  fs.writeFileSync('contact-main-markup.html', mainMatch[0]);
  console.log('Saved contact-main-markup.html, length:', mainMatch[0].length);
} else {
  console.log('Main tag not found');
}
