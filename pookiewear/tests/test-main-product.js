// tests/test-main-product.js
const fs = require('fs');
const path = require('path');

function testMainProduct() {
  const filePath = path.join(__dirname, '..', 'sections', 'pookie-main-product.liquid');

  if (!fs.existsSync(filePath)) throw new Error(`Missing section: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify schema block
  const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) throw new Error('pookie-main-product.liquid missing schema block');

  try {
    const schema = JSON.parse(schemaMatch[1]);
    if (!schema.name) throw new Error('Schema missing name');
  } catch (e) {
    throw new Error('Invalid JSON in schema: ' + e.message);
  }

  // Key IDs and classes
  const requiredTokens = [
    'id="pookie-main-image"',
    'pookie-gallery-thumb',
    'HOT PRODUCT | LOW STOCK',
    'pookie-size-pill',
    'pookie-bundle-container',
    'id="pookie-atc-button"',
    'pookie-urgency-alert',
    'pookie-social-quote',
    'pookie-accordion',
    'id="pookie-size-chart-modal"'
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`pookie-main-product.liquid missing required token: ${token}`);
    }
  }

  // Verify all 5 accordions exist
  const accordions = [
    'Description',
    'How fast will it ship?',
    'What size baby does it fit?',
    'Which size should I order?',
    'What actually holds my baby?'
  ];

  for (const acc of accordions) {
    if (!content.includes(acc)) {
      throw new Error(`Missing accordion item: ${acc}`);
    }
  }

  console.log('✅ Task 4 verification passed: Main product section contains all components!');
}

try {
  testMainProduct();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
