const sharp = require('sharp');
const path = require('path');

const inputImage = path.join(__dirname, '../public/projects/profile-pic (6).png');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateFavicons() {
  console.log('🎨 Generating favicons...\n');

  for (const { name, size } of sizes) {
    const outputPath = path.join(outputDir, name);
    
    try {
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error creating ${name}:`, error.message);
    }
  }

  // Create favicon.ico (32x32)
  try {
    await sharp(inputImage)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    console.log('✅ Created favicon.ico (32x32)');
  } catch (error) {
    console.error('❌ Error creating favicon.ico:', error.message);
  }
}

async function generateSocialImage() {
  console.log('\n🎨 Generating social media preview image...\n');

  const width = 1200;
  const height = 630;

  try {
    // Create a gradient background
    const svgBackground = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#312e81;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c2d12;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
        
        <!-- Profile circle placeholder -->
        <circle cx="250" cy="315" r="180" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="8"/>
        
        <!-- Text -->
        <text x="500" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">
          Aabiskar Regmi
        </text>
        <text x="500" y="280" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ef4444">
          Computer Engineer
        </text>
        <text x="500" y="340" font-family="Arial, sans-serif" font-size="32" fill="#e2e8f0">
          Robotics &amp; IoT Developer
        </text>
        <text x="500" y="400" font-family="Arial, sans-serif" font-size="28" fill="#94a3b8">
          📍 Pokhara, Nepal
        </text>
        <text x="500" y="460" font-family="Arial, sans-serif" font-size="24" fill="#cbd5e1">
          🤖 Autonomous Systems • 🔧 Embedded Systems • 🏆 Award Winner
        </text>
        
        <!-- Bottom bar -->
        <rect y="570" width="${width}" height="60" fill="rgba(239, 68, 68, 0.2)"/>
        <text x="600" y="605" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
          aabiskarregmi.com.np
        </text>
      </svg>
    `;

    // Create base image from SVG
    const background = await sharp(Buffer.from(svgBackground))
      .png()
      .toBuffer();

    // Resize and circle-crop the profile picture
    const profileCircle = await sharp(inputImage)
      .resize(360, 360, { fit: 'cover', position: 'center' })
      .composite([{
        input: Buffer.from(`
          <svg width="360" height="360">
            <circle cx="180" cy="180" r="180" fill="white"/>
          </svg>
        `),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    // Composite the profile image onto the background
    await sharp(background)
      .composite([{
        input: profileCircle,
        top: 135,
        left: 70
      }])
      .png()
      .toFile(path.join(outputDir, 'og-image.png'));

    console.log('✅ Created og-image.png (1200x630)');
    console.log('\n✨ All images generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated images in the public/ folder');
    console.log('2. Run: git add . && git commit -m "Generate optimized favicons and social image" && git push');
    console.log('3. Wait for Netlify to deploy (~2-3 minutes)');
    console.log('4. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/\n');

  } catch (error) {
    console.error('❌ Error creating social image:', error.message);
  }
}

(async () => {
  await generateFavicons();
  await generateSocialImage();
})();
