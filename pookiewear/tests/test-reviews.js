// tests/test-reviews.js
const fs = require('fs');
const path = require('path');

function testReviews() {
  const filePath = path.join(__dirname, '..', 'sections', 'pookie-reviews.liquid');

  if (!fs.existsSync(filePath)) throw new Error(`Missing section: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify schema block
  const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) throw new Error('pookie-reviews.liquid missing schema block');

  try {
    const schema = JSON.parse(schemaMatch[1]);
    if (!schema.name) throw new Error('Schema missing name');
  } catch (e) {
    throw new Error('Invalid JSON in schema: ' + e.message);
  }

  // Verify images & reviewers
  const requiredTokens = [
    'What They Said After the First Week',
    't1-laptop-nap.png',
    't2-selfie.png',
    't3-window-camera.png',
    'Jenna K.',
    'Ryan T.',
    'Dennis W.',
    'pookie-reviews-grid',
    'pookie-review-card'
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`pookie-reviews.liquid missing token: ${token}`);
    }
  }

  console.log('✅ Task 6 verification passed: Reviews section contains all cards and reviewers!');
}

try {
  testReviews();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
