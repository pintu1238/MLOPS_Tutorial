// tests/test-story-banners.js
const fs = require('fs');
const path = require('path');

function testStoryBanners() {
  const filePath = path.join(__dirname, '..', 'sections', 'pookie-story-banners.liquid');

  if (!fs.existsSync(filePath)) throw new Error(`Missing section: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify schema block
  const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) throw new Error('pookie-story-banners.liquid missing schema block');

  try {
    const schema = JSON.parse(schemaMatch[1]);
    if (!schema.name) throw new Error('Schema missing name');
  } catch (e) {
    throw new Error('Invalid JSON in schema: ' + e.message);
  }

  // Key tokens
  const requiredTokens = [
    'banner-1-zip-in-1x1.gif',
    'banner-2-cozy-1x1.gif',
    'One Hoodie Instead of a Carrier, a Blanket and a Sweater',
    'For the Days They Only Want to Be on You',
    'pookie-story-banner',
    'pookie-story-card'
  ];

  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`pookie-story-banners.liquid missing token: ${token}`);
    }
  }

  console.log('✅ Task 5 verification passed: Story banners section is valid!');
}

try {
  testStoryBanners();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
