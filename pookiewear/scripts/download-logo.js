// scripts/download-logo.js
const fs = require('fs');

async function main() {
  const url = 'https://thepookiewear.com/cdn/shop/files/logo.png?v=1789575905&width=500';
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('assets/pookie-logo.png', Buffer.from(buffer));
  console.log('Saved assets/pookie-logo.png, size:', buffer.byteLength);
}

main().catch(console.error);
