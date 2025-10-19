# Favicon and Social Media Image Setup

This guide will help you create proper favicon and social media preview images for your portfolio.

## Quick Setup (Recommended)

### Option 1: Use Online Tools (Easiest)

1. **Generate Favicons:**
   - Go to https://realfavicongenerator.net/
   - Upload your profile picture: `public/projects/profile-pic (6).png`
   - Download the generated package
   - Extract all files to `portfolio-react/public/`

2. **Create Social Media Preview:**
   - Go to https://www.canva.com/
   - Create 1200x630px design
   - Add your photo + text: "Aabiskar Regmi - Computer Engineer | Robotics & IoT"
   - Download as PNG → save as `public/og-image.png`

### Option 2: Use Favicon Generator Script

Run this command in your project:

```bash
npm install -g sharp-cli
cd public/projects
sharp -i "profile-pic (6).png" -o ../favicon.ico --resize 32 --format ico
sharp -i "profile-pic (6).png" -o ../favicon-16.png --resize 16
sharp -i "profile-pic (6).png" -o ../favicon-32.png --resize 32
sharp -i "profile-pic (6).png" -o ../favicon-192.png --resize 192
sharp -i "profile-pic (6).png" -o ../favicon-512.png --resize 512
sharp -i "profile-pic (6).png" -o ../apple-touch-icon.png --resize 180
sharp -i "profile-pic (6).png" -o ../og-image.png --resize 1200x630
```

## Files Needed

Place these in `public/` folder:

- `favicon.ico` (32x32) - Main favicon
- `favicon-16.png` (16x16) - Browser tab
- `favicon-32.png` (32x32) - Browser tab
- `favicon-192.png` (192x192) - Android Chrome
- `favicon-512.png` (512x512) - Android Chrome
- `apple-touch-icon.png` (180x180) - iOS Safari
- `og-image.png` (1200x630) - Social media preview

## Manual Creation (Using Paint/Photoshop)

### Favicon (32x32):
1. Open `profile-pic (6).png` in any image editor
2. Resize to 32x32 pixels
3. Save as `favicon.ico`

### Social Preview (1200x630):
1. Create new image: 1200x630 pixels
2. Add your profile photo (centered or left)
3. Add text:
   - **Name:** "Aabiskar Regmi"
   - **Title:** "Computer Engineer | Robotics & IoT Developer"
   - **Location:** "Pokhara, Nepal"
4. Use brand colors (red/purple gradient)
5. Save as `og-image.png`

## Testing

After adding files, test your meta tags:

1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
4. **Google Rich Results:** https://search.google.com/test/rich-results

## What You'll See

✅ **Browser Tab:** Your favicon shows instead of generic icon
✅ **Facebook/LinkedIn:** Preview card with image when sharing link
✅ **Twitter:** Large image card when tweeting link
✅ **WhatsApp/Telegram:** Preview with image and description
✅ **Google Search:** Your image appears in search results
✅ **iOS/Android:** Icon when adding to home screen

## Current Status

Your meta tags are already configured! Just need to:
1. ✅ Meta tags in `index.html` - Already done
2. ⏳ Generate favicon files - **DO THIS**
3. ⏳ Create social preview image - **DO THIS**
4. ✅ Manifest.json - Created
5. ⏳ Test with validators - **AFTER DEPLOY**

## Quick Fix (If you don't have image editor)

Just use your existing profile pic temporarily:

```bash
# Copy profile pic to serve as temporary favicon
cd portfolio-react/public
cp "projects/profile-pic (6).png" favicon.png
cp "projects/profile-pic (6).png" og-image.png
```

Then use online tools later to make proper optimized versions.
