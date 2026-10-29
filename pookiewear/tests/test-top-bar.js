// tests/test-top-bar.js
const fs = require('fs');
const path = require('path');

function testTopBar() {
  const filePath = path.join(__dirname, '..', 'sections', 'pookie-top-bar.liquid');

  if (!fs.existsSync(filePath)) throw new Error(`Missing section: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify schema tag exists and parses as JSON
  const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) throw new Error('pookie-top-bar.liquid missing schema block');

  try {
    const schema = JSON.parse(schemaMatch[1]);
    if (!schema.name) throw new Error('Schema missing name property');
  } catch (e) {
    throw new Error('Invalid JSON in schema: ' + e.message);
  }

  // Verify timer id hooks
  const requiredHooks = ['pookie-cd-days', 'pookie-cd-hours', 'pookie-cd-mins', 'pookie-cd-secs'];
  for (const hook of requiredHooks) {
    if (!content.includes(`id="${hook}"`)) {
      throw new Error(`pookie-top-bar.liquid missing hook: ${hook}`);
    }
  }

  // Verify marquee markup
  if (!content.includes('pookie-marquee-track')) {
    throw new Error('pookie-top-bar.liquid missing marquee track');
  }

  console.log('✅ Task 3 verification passed: Top bar section is valid and has all hooks!');
}

try {
  testTopBar();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
