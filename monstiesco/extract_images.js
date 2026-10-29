const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

const regex = /(?:https?:\/\/monstiesco\.com|\/\/cdn\.shopify\.com)?\/cdn\/shop\/files\/[^"'<>\s,]+/gi;
const matches = html.match(regex) || [];

// Also find any shopify image URLs
const anyShopify = /(?:https?:)?\/\/[^"'<>\s]+\.(?:png|jpg|jpeg|webp|svg|gif)(?:\?[^"'<>\s]*)?/gi;
const allMatches = html.match(anyShopify) || [];

const set = new Set();
matches.forEach(m => {
  let url = m;
  if (url.startsWith('//')) url = 'https:' + url;
  else if (url.startsWith('/')) url = 'https://monstiesco.com' + url;
  set.add(url);
});

allMatches.forEach(m => {
  let url = m;
  if (url.startsWith('//')) url = 'https:' + url;
  set.add(url);
});

// Also look inside scripts, JSON, window objects in html
const scriptMatches = html.match(/[\"']([^\"']+\.(?:png|jpg|jpeg|webp|svg))[\"']/gi) || [];
scriptMatches.forEach(m => {
  let clean = m.replace(/['"]/g, '');
  if (clean.includes('/cdn/shop/files/')) {
    if (clean.startsWith('//')) clean = 'https:' + clean;
    else if (clean.startsWith('/')) clean = 'https://monstiesco.com' + clean;
    set.add(clean);
  }
});

const list = Array.from(set).sort();
console.log(`Found ${list.length} images/assets.`);
fs.writeFileSync('all_image_urls.json', JSON.stringify(list, null, 2));
list.forEach(u => console.log(u));
