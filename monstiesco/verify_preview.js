const fs = require('fs');
const path = require('path');

const preview = fs.readFileSync('preview.html', 'utf8');

const imgRegex = /src=["'](assets\/images\/[^"']+)["']/g;
let m;
const missing = [];
let count = 0;

while ((m = imgRegex.exec(preview)) !== null) {
  count++;
  const filePath = path.join(__dirname, m[1]);
  if (!fs.existsSync(filePath)) {
    missing.push(m[1]);
  }
}

console.log(`Verified ${count} local image tags in preview.html.`);
if (missing.length === 0) {
  console.log('✅ ALL images exist and are verified locally!');
} else {
  console.error('❌ Missing images:', missing);
}
