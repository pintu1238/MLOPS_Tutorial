const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, 'theme_build');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'images') { // avoid duplicate images subfolder in assets
        copyDir(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy theme folders
const themeFolders = ['layout', 'templates', 'sections', 'snippets', 'config', 'locales', 'assets'];
themeFolders.forEach(folder => {
  const p = path.join(__dirname, folder);
  if (fs.existsSync(p)) {
    copyDir(p, path.join(buildDir, folder));
  }
});

console.log('Copied theme files to theme_build folder.');

// Remove any existing zip
const zipPath = path.join(__dirname, 'monsties-theme.zip');
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

// Compress with powershell
const cmd = `powershell -Command "Compress-Archive -Path '${buildDir}\\*' -DestinationPath '${zipPath}' -Force"`;
console.log('Creating ZIP archive...');
execSync(cmd, { stdio: 'inherit' });

console.log('Theme zip successfully created at:', zipPath);
console.log('Size:', (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2), 'MB');
