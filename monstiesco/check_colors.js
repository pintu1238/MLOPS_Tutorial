const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

const colors = html.match(/#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\([^)]+\)|rgba\([^)]+\)/g) || [];
const colorCounts = {};
colors.forEach(c => {
  const norm = c.toLowerCase();
  colorCounts[norm] = (colorCounts[norm] || 0) + 1;
});

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
console.log('Top colors:', sortedColors.slice(0, 20));

// Check body background
const bodyMatch = html.match(/<body[^>]*class="([^"]+)"/i);
if (bodyMatch) console.log('Body class:', bodyMatch[1]);
