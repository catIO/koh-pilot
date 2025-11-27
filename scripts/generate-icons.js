import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// This script generates PNG icons from SVG
// Run with: node scripts/generate-icons.js
// Note: Requires sharp to be installed: npm install --save-dev sharp

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 167, name: 'apple-touch-icon-167x167.png' }, // iPad Pro
  { size: 1024, name: 'icon-1024x1024.png' }, // macOS
];

const svgPath = './public/icons/icon.svg';
const outputDir = './public/icons/';

async function generateIcons() {
  try {
    const sharp = require('sharp');
    const svgBuffer = fs.readFileSync(svgPath);
    
    console.log('Generating icons...');
    
    for (const { size, name } of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(`${outputDir}${name}`);
      console.log(`✓ Generated ${name}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Error: sharp module not found. Install it with: npm install --save-dev sharp');
      console.log('\nAlternatively, you can use an online tool to convert the SVG to PNGs:');
      console.log('1. Open public/icons/icon.svg');
      console.log('2. Convert to PNG at the following sizes:');
      sizes.forEach(({ size, name }) => console.log(`   - ${size}x${size} -> ${name}`));
    } else {
      console.error('Error generating icons:', error);
    }
  }
}

generateIcons();


