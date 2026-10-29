const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

// Find all occurrences of <div id="shopify-section-
const regex = /<div\s+id="shopify-section-([^"]+)"/g;
let m;
const positions = [];
while ((m = regex.exec(html)) !== null) {
  positions.push({ id: m[1], index: m.index });
}

for (let i = 0; i < positions.length; i++) {
  const current = positions[i];
  const next = positions[i + 1];
  const end = next ? next.index : html.length;
  const chunk = html.substring(current.index, end);
  const cleanName = current.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  fs.writeFileSync(`parsed_sections/${cleanName}.full.html`, chunk);
  console.log(`Saved ${cleanName}.full.html (${chunk.length} bytes)`);
}
