/**
 * Build script for Firefox extension
 */

const fs = require('fs');
const path = require('path');

const FIREFOX_DIR = path.join(__dirname, '../extensions/firefox');

console.log('Building Firefox extension...');

// Create build directory
const buildDir = path.join(__dirname, '../dist/firefox');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy Firefox-specific files
const firefoxFiles = ['manifest.json', 'background.js', 'content.js', 'icon.png'];
firefoxFiles.forEach(file => {
  const sourcePath = path.join(FIREFOX_DIR, file);
  const destPath = path.join(buildDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${file}`);
  } else {
    console.log(`⚠ Warning: ${file} not found`);
  }
});

console.log('Firefox extension build completed!');
console.log(`Build directory: ${buildDir}`); 