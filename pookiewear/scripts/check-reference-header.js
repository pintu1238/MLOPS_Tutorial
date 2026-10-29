// scripts/check-reference-header.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');

// Find header
const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
if (headerMatch) {
  console.log('--- Reference Header ---');
  // Strip SVG paths for brevity
  const clean = headerMatch[0].replace(/<path[^>]*>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG]');
  console.log(clean.substring(0, 2000));
} else {
  console.log('No <header> tag found');
}
