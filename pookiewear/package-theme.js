// package-theme.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Pookie Hoodie Theme files...');

const folders = ['assets', 'sections', 'snippets', 'templates'];
const targetZip = path.join(__dirname, 'pookie-hoodie-theme.zip');

try {
  // Use PowerShell's built-in Compress-Archive
  const cmd = `powershell -Command "Compress-Archive -Path assets, sections, snippets, templates -DestinationPath '${targetZip}' -Force"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`✅ Theme zip created successfully: ${targetZip}`);
} catch (e) {
  console.error('Packaging failed:', e.message);
  process.exit(1);
}
