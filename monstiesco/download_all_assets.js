const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const html = fs.readFileSync('monsties.html', 'utf8');

// Find all cdn/shop/files URLs
const regex = /(?:https?:\/\/monstiesco\.com|\/\/cdn\.shopify\.com)?\/cdn\/shop\/files\/([^"'<>\s,?]+)(?:\?[^"'<>\s]*)?/gi;

const uniqueFiles = new Map();
let match;
while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const fullUrl = 'https://monstiesco.com/cdn/shop/files/' + filename;
  uniqueFiles.set(filename, fullUrl);
}

// Also check json
if (fs.existsSync('all_image_urls.json')) {
  const urls = JSON.parse(fs.readFileSync('all_image_urls.json', 'utf8'));
  urls.forEach(u => {
    const cleanUrl = u.split('?')[0].replace('&amp;', '&');
    const filename = path.basename(cleanUrl);
    if (!uniqueFiles.has(filename)) {
      uniqueFiles.set(filename, cleanUrl);
    }
  });
}

const outDir = path.join(__dirname, 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

console.log(`Downloading ${uniqueFiles.size} unique master assets into ${outDir}...`);

async function download(filename, url) {
  const dest = path.join(outDir, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`Already exists: ${filename}`);
    return;
  }
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(filename, res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.error(`Failed ${url} (${res.statusCode})`);
        return resolve();
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error ${filename}:`, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const [filename, url] of uniqueFiles.entries()) {
    await download(filename, url);
  }
  console.log('Finished downloading all assets!');
})();
