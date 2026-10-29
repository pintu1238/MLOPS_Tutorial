// scripts/find-exact-snippets.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

function showSection(name, re) {
  const match = html.match(re);
  console.log(`=== ${name} ===`);
  if (match) {
    console.log(match[0].substring(0, 1500));
  } else {
    console.log('Not found');
  }
}

// Timer
const timerIdx = html.indexOf('fsc-clock');
if (timerIdx !== -1) {
  const start = html.lastIndexOf('<style', timerIdx);
  const end = html.indexOf('</script>', timerIdx);
  console.log('=== TIMER ===');
  console.log(html.substring(start, end + 9));
}

// Guarantee
const guarIdx = html.indexOf('OUR PROMISE TO YOU');
if (guarIdx !== -1) {
  const start = html.lastIndexOf('<div', guarIdx - 50);
  console.log('=== GUARANTEE ===');
  console.log(html.substring(start, guarIdx + 1200));
}
