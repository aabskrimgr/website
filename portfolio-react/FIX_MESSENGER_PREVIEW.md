# 🔧 URGENT FIX - Force Facebook/Messenger to Update Preview

## 🐛 The Problem

Facebook Messenger was showing the **old micromouse.jpg** image because:
1. The structured data (Schema.org JSON-LD) had the old image URL
2. Facebook cached that preview weeks/months ago
3. Facebook doesn't automatically refresh - you need to force it

## ✅ What I Just Fixed

Changed this in `index.html`:
```json
// BEFORE (Line 92):
"image": "https://aabiskarregmi.com.np/projects/micromouse.jpg"

// AFTER (Now):
"image": "https://aabiskarregmi.com.np/og-image.png"
```

All image references now point to the correct `og-image.png`!

## 🚀 How to Force Facebook to Update (DO THIS NOW)

### Step 1: Wait for Netlify Deploy
Check: https://app.netlify.com/sites/aabiskarregmi-com-np/deploys

Wait until it shows **"Published"** (about 2 minutes)

### Step 2: Use Facebook Debugger (CRITICAL!)

**This is the ONLY way to force Facebook/Messenger to update:**

1. Go to: **https://developers.facebook.com/tools/debug/**

2. Enter your URL: `https://aabiskarregmi.com.np`

3. Click **"Debug"** button

4. You'll see the current cached version (might still show micromouse)

5. Click **"Scrape Again"** button (you may need to click it 2-3 times)

6. Wait 10 seconds and click **"Scrape Again"** one more time

7. The preview should now show your **new og-image.png** with:
   - Gradient background
   - Your profile photo in circle
   - Your name and title

### Step 3: Verify the Change

After scraping, check the debugger shows:
```
Image URL: https://aabiskarregmi.com.np/og-image.png
Dimensions: 1200 x 630
Image Type: image/png
```

### Step 4: Test in Messenger

1. Open Facebook Messenger
2. Send the link to yourself: `https://aabiskarregmi.com.np`
3. Should now show the NEW preview image

**If it still shows old image:**
- Wait 5 more minutes
- Use debugger and "Scrape Again" once more
- Try sending link in a NEW conversation (not the same chat)

## 🕒 Why This Happened

Facebook aggressively caches link previews for:
- **7 days minimum** for frequently shared links
- **30+ days** for infrequently shared links
- Sometimes **indefinitely** until you force refresh

The Facebook Debugger is the ONLY way to clear their cache!

## 📱 Other Platforms

### WhatsApp
- Uses Facebook's cache system
- After fixing in Facebook Debugger, WhatsApp will update too
- Might take up to 1 hour

### Messenger
- Updates immediately after Facebook Debugger scrape
- If old preview persists, try in a new conversation

### LinkedIn
- Has separate cache
- Use: https://www.linkedin.com/post-inspector/
- Enter your URL and inspect

### Twitter/X
- Has separate cache  
- Use: https://cards-dev.twitter.com/validator
- Enter your URL to refresh

## ✅ Quick Checklist

- [ ] Wait for Netlify deploy to finish (2 min)
- [ ] Go to Facebook Debugger
- [ ] Enter: `https://aabiskarregmi.com.np`
- [ ] Click "Debug"
- [ ] Click "Scrape Again" (2-3 times)
- [ ] Verify shows og-image.png (not micromouse.jpg)
- [ ] Test sending link in Messenger
- [ ] Should show NEW preview! ✨

## 🎯 Expected Result

After following above steps, when you share your link, people will see:

```
┌────────────────────────────────┐
│ [Gradient Background]          │
│  [Your Photo]  Aabiskar Regmi  │
│   in Circle    Computer Eng    │
│                Robotics & IoT  │
│                📍 Pokhara      │
│                                │
│  aabiskarregmi.com.np         │
└────────────────────────────────┘
```

**NOT the micromouse robot anymore!** 🎉

## 🔗 Important Links

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Netlify Deploy:** https://app.netlify.com/sites/aabiskarregmi-com-np/deploys
- **LinkedIn Inspector:** https://www.linkedin.com/post-inspector/
- **Twitter Validator:** https://cards-dev.twitter.com/validator

## ⏰ Do This Right Now!

1. ✅ Code is fixed and pushed
2. ⏳ Wait 2 minutes for deploy
3. 🔧 Use Facebook Debugger and click "Scrape Again"
4. ✅ Test in Messenger
5. 🎉 Enjoy your new preview!

**The fix is deployed, you just need to force Facebook to refresh its cache!**
