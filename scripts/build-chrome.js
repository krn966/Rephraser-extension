/**
 * Build script for Chrome extension
 */

const fs = require('fs');
const path = require('path');

const CHROME_DIR = path.join(__dirname, '../extensions/chrome');
const SHARED_DIR = path.join(__dirname, '../extensions/shared');

console.log('Building Chrome extension...');

// Create build directory
const buildDir = path.join(__dirname, '../dist/chrome');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy Chrome-specific files
const chromeFiles = ['manifest.json', 'background.js', 'content.js', 'popup.html', 'popup.js', 'icon.png'];
chromeFiles.forEach(file => {
  const sourcePath = path.join(CHROME_DIR, file);
  const destPath = path.join(buildDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${file}`);
  } else {
    console.log(`⚠ Warning: ${file} not found`);
  }
});

// Copy shared files
const sharedFiles = [
  'constants.js',
  'utils/textUtils.js',
  'utils/selectionUtils.js',
  'utils/visualUtils.js',
  'content/contentScript.js',
  'background/backgroundScript.js'
];

sharedFiles.forEach(file => {
  const sourcePath = path.join(SHARED_DIR, file);
  const destDir = path.join(buildDir, 'shared', path.dirname(file));
  const destPath = path.join(buildDir, 'shared', file);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied shared/${file}`);
  } else {
    console.log(`⚠ Warning: shared/${file} not found`);
  }
});

console.log('Chrome extension build completed!');
console.log(`Build directory: ${buildDir}`); 