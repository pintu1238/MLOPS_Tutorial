// scripts/inspect-ref.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

console.log('--- TIMER / TOP BAR ---');
const idx = html.indexOf('FLASH SALE ENDS');
if (idx !== -1) {
  console.log('Context of FLASH SALE ENDS:');
  console.log(html.substring(Math.max(0, idx - 400), idx + 1000));
} else {
  console.log('FLASH SALE ENDS not found directly, looking for countdown:');
  const cdIdx = html.indexOf('countdown');
  if (cdIdx !== -1) {
    console.log(html.substring(Math.max(0, cdIdx - 200), cdIdx + 800));
  }
}

console.log('\n--- BUNDLE / TIERS ---');
const bundleIdx = html.indexOf('BUNDLE & SAVE');
if (bundleIdx !== -1) {
  console.log('Context of BUNDLE & SAVE:');
  console.log(html.substring(Math.max(0, bundleIdx - 100), bundleIdx + 3000));
}

console.log('\n--- GUARANTEE ---');
const guarIdx = html.indexOf('OUR PROMISE TO YOU');
if (guarIdx !== -1) {
  console.log('Context of GUARANTEE:');
  console.log(html.substring(Math.max(0, guarIdx - 200), guarIdx + 1500));
}

console.log('\n--- FOOTER ---');
const footerIdx = html.indexOf('<footer');
if (footerIdx !== -1) {
  console.log('Footer tag found:');
  console.log(html.substring(footerIdx, footerIdx + 1500));
}
