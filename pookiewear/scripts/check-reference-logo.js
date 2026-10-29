// scripts/check-reference-logo.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');

const logoMatch = html.match(/<a[^>]*class="[^"]*header__heading-link[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
if (logoMatch) {
  console.log('--- Reference Logo Element ---');
  console.log(logoMatch[0]);
} else {
  // Search for logo img
  const imgs = html.match(/<img[^>]*logo[^>]*>/gi);
  console.log('Logo images:', imgs);
}
