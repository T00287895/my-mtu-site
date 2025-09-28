const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.resolve(__dirname, '../app-icon.png');
const outputDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(sourceIcon)) {
  console.error(`Source icon not found at ${sourceIcon}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [192, 512];

async function generateIcons() {
  try {
    console.log('Generating standard icons...');
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `app-icon-${size}.png`);
      await sharp(sourceIcon)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(outputPath);
      console.log(`✓ Generated ${outputPath}`);
    }

    console.log('\nGenerating maskable icons...');
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `app-icon-${size}-maskable.png`);
      // A common practice for maskable icons is to ensure the main content
      // is within a "safe zone", typically a circle with a radius of 40% of the canvas size.
      // Here, we resize the icon to 80% of the canvas and center it on a transparent background.
      const innerSize = Math.floor(size * 0.8);
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: await sharp(sourceIcon).resize(innerSize, innerSize).toBuffer(),
            gravity: 'center',
          },
        ])
        .toFile(outputPath);
      console.log(`✓ Generated ${outputPath}`);
    }
    console.log('\nIcon generation complete!');

    console.log('\nGenerating favicon.ico...');
    const faviconPath = path.join(outputDir, '../favicon.ico');
    await sharp(sourceIcon).resize(32, 32).toFile(faviconPath);
    console.log(`✓ Generated ${faviconPath}`);

    console.log('\nGenerating solid-background icon for Apple...');
    const solidIconPath = path.join(outputDir, 'app-icon-192-solid.png');
    await sharp(sourceIcon)
      .resize(192, 192)
      .flatten({ background: '#ffffff' }) // Add white background
      .toFile(solidIconPath);
    console.log(`✓ Generated ${solidIconPath}`);
  } catch (error) {
    console.error('Error during icon generation:', error);
    process.exit(1);
  }
}

generateIcons();
