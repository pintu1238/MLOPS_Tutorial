// tests/test-assets.js
const fs = require('fs');
const path = require('path');

function testAssets() {
  const cssPath = path.join(__dirname, '..', 'assets', 'pookie-styles.css');
  const jsPath = path.join(__dirname, '..', 'assets', 'pookie-scripts.js');

  if (!fs.existsSync(cssPath)) throw new Error(`Missing CSS: ${cssPath}`);
  if (!fs.existsSync(jsPath)) throw new Error(`Missing JS: ${jsPath}`);

  const css = fs.readFileSync(cssPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  // Check CSS critical tokens
  const requiredCss = [
    '--pookie-caramel: #bc7c3e',
    '--pookie-font: \'Poppins\'',
    '.pookie-top-bar',
    '.pookie-marquee',
    '.pookie-gallery',
    '.pookie-bundle-tier',
    '.pookie-btn-preorder',
    '.pookie-accordion',
    '.pookie-story-banner',
    '.pookie-review-card',
    '.pookie-guarantee-card',
    '.pookie-sticky-bar'
  ];

  for (const token of requiredCss) {
    if (!css.includes(token)) {
      throw new Error(`CSS missing required selector or token: ${token}`);
    }
  }

  // Check JS critical logic
  const requiredJs = [
    'PookieController',
    'initCountdown',
    'initGallery',
    'initBundles',
    'initAccordions',
    'initStickyBar'
  ];

  for (const token of requiredJs) {
    if (!js.includes(token)) {
      throw new Error(`JS missing required method: ${token}`);
    }
  }

  console.log('✅ Task 1 verification passed: assets exist and contain all required tokens!');
}

try {
  testAssets();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
