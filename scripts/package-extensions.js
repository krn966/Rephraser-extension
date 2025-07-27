/**
 * Package extensions into zip files
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function packageExtension(extensionName, sourceDir) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, `../dist/${extensionName}-extension.zip`);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✓ ${extensionName} extension packaged: ${outputPath}`);
      console.log(`  Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function packageAll() {
  console.log('Packaging extensions...');
  
  try {
    // Package Chrome extension
    const chromeDir = path.join(__dirname, '../dist/chrome');
    if (fs.existsSync(chromeDir)) {
      await packageExtension('chrome', chromeDir);
    } else {
      console.log('⚠ Chrome build directory not found. Run "npm run build:chrome" first.');
    }
    
    // Package Firefox extension
    const firefoxDir = path.join(__dirname, '../dist/firefox');
    if (fs.existsSync(firefoxDir)) {
      await packageExtension('firefox', firefoxDir);
    } else {
      console.log('⚠ Firefox build directory not found. Run "npm run build:firefox" first.');
    }
    
    console.log('All extensions packaged successfully!');
  } catch (error) {
    console.error('Error packaging extensions:', error);
    process.exit(1);
  }
}

packageAll(); 