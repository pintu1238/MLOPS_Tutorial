// scripts/check-contact-css.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');

// Search for button styling
const btnMatches = html.match(/(\.button[^\{]*\{[^\}]*\})/g) || [];
console.log('Button CSS rules found:', btnMatches.slice(0, 5));

// Search for contact page styles
const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
styleMatches.forEach((s, i) => {
  if (s.includes('contact') || s.includes('button')) {
    console.log(`\n--- Style ${i} ---`);
    console.log(s.replace(/<[^>]+>/g, '').substring(0, 500));
  }
});
