// scripts/analyze-contact.js
const fs = require('fs');

const html = fs.readFileSync('contact-page-reference.html', 'utf8');

// Find main section
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
const mainContent = mainMatch ? mainMatch[1] : html;

// Extract headings, forms, paragraphs
console.log('=== Title & Meta ===');
const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1].trim() : 'N/A');

console.log('\n=== Headings ===');
const headings = mainContent.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));

console.log('\n=== Form Fields ===');
const inputs = mainContent.match(/<(input|textarea|select)[^>]*>/gi) || [];
inputs.forEach(inp => {
  const name = inp.match(/name="([^"]+)"/)?.[1] || '';
  const type = inp.match(/type="([^"]+)"/)?.[1] || 'textarea';
  const placeholder = inp.match(/placeholder="([^"]+)"/)?.[1] || '';
  console.log(`- [${type}] name="${name}" placeholder="${placeholder}"`);
});

console.log('\n=== Text Excerpt ===');
// Strip scripts & styles
let text = mainContent.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
console.log(text.substring(0, 1500));
