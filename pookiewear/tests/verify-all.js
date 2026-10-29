// tests/verify-all.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Starting Full Verification Suite...');

// 1. Run all individual tests
const tests = [
  'test-assets.js',
  'test-snippets.js',
  'test-top-bar.js',
  'test-main-product.js',
  'test-story-banners.js',
  'test-reviews.js',
  'test-guarantee-sticky.js'
];

for (const test of tests) {
  process.stdout.write(`Running ${test}... `);
  execSync(`node tests/${test}`, { stdio: 'pipe' });
  console.log('PASSED ✅');
}

// 2. Verify templates/product.pookie-hoodie.json
const templatePath = path.join(__dirname, '..', 'templates', 'product.pookie-hoodie.json');
if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing template: ${templatePath}`);
}

const templateJson = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
if (!templateJson.sections || !templateJson.order) {
  throw new Error('Invalid Shopify 2.0 template structure');
}

const expectedSections = ['top_bar', 'main', 'story_banners', 'reviews', 'guarantee', 'sticky_bar'];
for (const sec of expectedSections) {
  if (!templateJson.order.includes(sec)) {
    throw new Error(`Template order missing section: ${sec}`);
  }
}

console.log('Template structure PASSED ✅');
console.log('🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
