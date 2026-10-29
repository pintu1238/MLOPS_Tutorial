// scripts/get-timer-full.js
const fs = require('fs');
const html = fs.readFileSync('product-page-reference.html', 'utf8');

const timerStart = html.indexOf('#fsc-zombie');
if (timerStart !== -1) {
  const styleStart = html.lastIndexOf('<style', timerStart);
  const divEnd = html.indexOf('</div>\n</div>\n</div>', timerStart);
  console.log(html.substring(styleStart, divEnd + 30));
}
