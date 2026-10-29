const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'assets', 'images');
const destDir = path.join(__dirname, 'assets');

const files = fs.readdirSync(srcDir);
files.forEach(f => {
  fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
});
console.log(`Copied ${files.length} images to ${destDir}`);
