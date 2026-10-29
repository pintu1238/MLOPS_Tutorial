// tests/test-snippets.js
const fs = require('fs');
const path = require('path');

function testSnippets() {
  const iconsPath = path.join(__dirname, '..', 'snippets', 'pookie-icons.liquid');
  const bundleCardPath = path.join(__dirname, '..', 'snippets', 'pookie-bundle-card.liquid');

  if (!fs.existsSync(iconsPath)) throw new Error(`Missing snippet: ${iconsPath}`);
  if (!fs.existsSync(bundleCardPath)) throw new Error(`Missing snippet: ${bundleCardPath}`);

  const iconsContent = fs.readFileSync(iconsPath, 'utf8');
  const bundleCardContent = fs.readFileSync(bundleCardPath, 'utf8');

  // Check icons snippet
  const requiredIcons = ['truck', 'flame', 'star', 'shield', 'check', 'chevron', 'quote', 'close'];
  for (const icon of requiredIcons) {
    if (!iconsContent.includes(`when '${icon}'`) && !iconsContent.includes(`when "${icon}"`)) {
      throw new Error(`pookie-icons.liquid missing icon case: ${icon}`);
    }
  }

  // Check bundle card snippet
  const requiredBundleElements = [
    'pookie-bundle-tier',
    'pookie-bundle-radio',
    'pookie-bundle-title',
    'pookie-bundle-savings',
    'pookie-bundle-price'
  ];

  for (const el of requiredBundleElements) {
    if (!bundleCardContent.includes(el)) {
      throw new Error(`pookie-bundle-card.liquid missing element: ${el}`);
    }
  }

  console.log('✅ Task 2 verification passed: snippets exist and contain all required cases!');
}

try {
  testSnippets();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
