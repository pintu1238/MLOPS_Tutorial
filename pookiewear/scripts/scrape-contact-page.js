// scripts/scrape-contact-page.js
const fs = require('fs');

async function main() {
  try {
    const res = await fetch('https://thepookiewear.com/pages/contact');
    const html = await res.text();
    fs.writeFileSync('contact-page-reference.html', html);
    console.log(`Fetched contact page HTML, size: ${html.length}`);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

main();
