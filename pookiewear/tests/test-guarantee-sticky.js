// tests/test-guarantee-sticky.js
const fs = require('fs');
const path = require('path');

function testGuaranteeSticky() {
  const guaranteePath = path.join(__dirname, '..', 'sections', 'pookie-guarantee.liquid');
  const stickyPath = path.join(__dirname, '..', 'sections', 'pookie-sticky-bar.liquid');

  if (!fs.existsSync(guaranteePath)) throw new Error(`Missing section: ${guaranteePath}`);
  if (!fs.existsSync(stickyPath)) throw new Error(`Missing section: ${stickyPath}`);

  const guaranteeContent = fs.readFileSync(guaranteePath, 'utf8');
  const stickyContent = fs.readFileSync(stickyPath, 'utf8');

  // Verify guarantee content
  const requiredGuarantee = [
    'OUR PROMISE TO YOU',
    '30 days to try it',
    'Full refund if it\'s not for you',
    'Real humans reply within 48h',
    'pookie-guarantee-card'
  ];

  for (const token of requiredGuarantee) {
    if (!guaranteeContent.includes(token)) {
      throw new Error(`pookie-guarantee.liquid missing token: ${token}`);
    }
  }

  // Verify sticky content
  const requiredSticky = [
    'pookie-sticky-bar',
    'id="pookie-sticky-bar"',
    'id="pookie-sticky-btn"',
    'Choose bundle'
  ];

  for (const token of requiredSticky) {
    if (!stickyContent.includes(token)) {
      throw new Error(`pookie-sticky-bar.liquid missing token: ${token}`);
    }
  }

  console.log('✅ Task 7 verification passed: Guarantee and Sticky bar sections are valid!');
}

try {
  testGuaranteeSticky();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
