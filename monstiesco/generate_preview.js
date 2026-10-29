const fs = require('fs');

let liquid = fs.readFileSync('sections/monsties-landing.liquid', 'utf8');

// Strip liquid comments and schema
let html = liquid.replace(/{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/gi, '');
html = html.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/gi, '');

// Replace asset_url filters with local image paths
// e.g. {{ 'dz.webp' | asset_url | default: '...' }} -> assets/images/dz.webp
html = html.replace(/\{\{\s*'([^']+)'\s*\|\s*asset_url\s*\|\s*default:[^}]+\}\}/gi, 'assets/images/$1');
html = html.replace(/\{\{\s*'([^']+)'\s*\|\s*asset_url\s*\}\}/gi, 'assets/images/$1');
html = html.replace(/\{\{\s*section\.settings\.product_title[^}]+\}\}/gi, 'Monsties Onesie');
html = html.replace(/\{\{\s*'now'[^}]+\}\}/gi, '2026');
html = html.replace(/\{\{\s*cart\.item_count[^}]+\}\}/gi, '0');

const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monsties Onesie – Official Replica Preview</title>
  <link rel="icon" href="assets/images/efe.webp" type="image/webp">
</head>
<body style="background:#100f0d; margin:0; padding:0;">
${html}
</body>
</html>`;

fs.writeFileSync('preview.html', fullPage);
console.log('Saved preview.html (' + fullPage.length + ' bytes)');
