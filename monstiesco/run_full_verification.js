const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- STARTING VERIFICATION ---');

let passed = true;

// 1. Check sections/monsties-landing.liquid
const liquidPath = path.join(__dirname, 'sections', 'monsties-landing.liquid');
if (fs.existsSync(liquidPath) && fs.statSync(liquidPath).size > 10000) {
  console.log(`[PASS] sections/monsties-landing.liquid (${fs.statSync(liquidPath).size} bytes)`);
  // Validate schema JSON
  const content = fs.readFileSync(liquidPath, 'utf8');
  const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (schemaMatch) {
    try {
      JSON.parse(schemaMatch[1]);
      console.log('[PASS] Schema JSON is valid');
    } catch (e) {
      console.error('[FAIL] Schema JSON invalid:', e.message);
      passed = false;
    }
  } else {
    console.error('[FAIL] No schema tag found');
    passed = false;
  }
} else {
  console.error('[FAIL] monsties-landing.liquid missing or too small');
  passed = false;
}

// 2. Check preview.html
const previewPath = path.join(__dirname, 'preview.html');
if (fs.existsSync(previewPath) && fs.statSync(previewPath).size > 10000) {
  console.log(`[PASS] preview.html exists (${fs.statSync(previewPath).size} bytes)`);
} else {
  console.error('[FAIL] preview.html missing or too small');
  passed = false;
}

// 3. Check assets
const assetsDir = path.join(__dirname, 'assets');
const assetFiles = fs.readdirSync(assetsDir);
console.log(`[PASS] assets directory contains ${assetFiles.length} files`);
if (assetFiles.length < 30) {
  console.error('[FAIL] Not enough assets');
  passed = false;
}

// 4. Check monsties-theme.zip
const zipPath = path.join(__dirname, 'monsties-theme.zip');
if (fs.existsSync(zipPath) && fs.statSync(zipPath).size > 1000000) {
  console.log(`[PASS] monsties-theme.zip exists (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.error('[FAIL] monsties-theme.zip missing or too small');
  passed = false;
}

// 5. Check theme structure files
const reqFiles = [
  'layout/theme.liquid',
  'templates/index.json',
  'templates/product.json',
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json'
];
reqFiles.forEach(rf => {
  const p = path.join(__dirname, rf);
  if (fs.existsSync(p)) {
    console.log(`[PASS] Required file exists: ${rf}`);
  } else {
    console.error(`[FAIL] Missing required file: ${rf}`);
    passed = false;
  }
});

console.log('--- VERIFICATION RESULT ---');
if (passed) {
  console.log('ALL VERIFICATIONS PASSED (0 FAILURES)');
} else {
  console.log('VERIFICATION FAILED');
  process.exit(1);
}
