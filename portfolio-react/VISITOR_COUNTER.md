# Visitor Counter System

## Overview
This portfolio uses a reliable, persistent visitor counter that tracks real unique visitors across sessions and browsers.

## How It Works

### 1. **Browser Fingerprinting**
- Creates a unique fingerprint based on browser/device characteristics:
  - Screen resolution and color depth
  - Timezone and language
  - Platform and user agent
  - Hardware specs (CPU cores, memory)
  - Canvas and WebGL fingerprints
- This helps track unique visitors even if localStorage is cleared

### 2. **Persistent Storage**
- Uses **Netlify Blobs** (serverless key-value storage)
- Data persists across deployments and restarts
- No external database needed
- Free tier on Netlify

### 3. **Smart Counting Logic**
- Only counts each unique visitor once per 24 hours
- Uses both localStorage ID and browser fingerprint for accuracy
- Prevents duplicate counts from:
  - Page refreshes
  - Returning visitors (same day)
  - Multiple tabs
  - Cleared cookies (fingerprint catches this)

### 4. **Real-Time Updates**
- Polls the count every 2 minutes
- Shows live visitor numbers
- Smooth animated counter

## Architecture

```
Client (Browser)
    ↓
Generate Fingerprint + Visitor ID
    ↓
POST /.netlify/functions/visitor-count
    ↓
Netlify Function (visitor-count.js)
    ↓
Check Netlify Blobs Storage
    ↓
- If new visitor (or >24h): increment count
- If already counted today: return current count
    ↓
Return count to client
    ↓
Animate display
```

## Files

### `/src/utils/visitorTracking.ts`
- `generateFingerprint()` - Creates browser fingerprint
- `getVisitorId()` - Gets/creates persistent visitor ID
- `hasBeenCounted()` - Checks if visitor was counted today
- `markAsCounted()` - Marks visitor as counted

### `/netlify/functions/visitor-count.js`
- Serverless function handling visitor counting
- GET: Returns current count
- POST: Increments count for new visitors
- Uses Netlify Blobs for storage

### `/src/components/sections/FunZone.tsx`
- Displays the visitor counter
- Handles API calls
- Animates the counter

## Environment Variables (Netlify)

The function automatically uses Netlify's built-in environment variables:
- `NETLIFY_BLOB_TOKEN` - Auto-provided by Netlify
- `SITE_ID` - Auto-provided by Netlify

No manual configuration needed!

## Why This is Better

### Old System (countapi.xyz)
❌ Third-party service (unreliable)
❌ Different starting numbers
❌ No control over data
❌ Can reset unexpectedly
❌ Not truly unique visitors

### New System
✅ Self-hosted on Netlify
✅ Consistent count across all browsers
✅ Full control over data
✅ Persistent across deployments
✅ True unique visitor tracking
✅ 24-hour uniqueness window
✅ Browser fingerprinting backup
✅ Free (Netlify free tier)

## Testing

1. **Local Development**: Uses production API endpoint
2. **Production**: Uses Netlify Function at `/.netlify/functions/visitor-count`

## Monitoring

Check visitor count manually:
```bash
curl https://aabiskarregmi.com.np/.netlify/functions/visitor-count
```

## Future Enhancements

- [ ] Add analytics dashboard
- [ ] Track visitor countries (IP geolocation)
- [ ] Daily/weekly/monthly stats
- [ ] Peak visitor times
- [ ] Referral sources
