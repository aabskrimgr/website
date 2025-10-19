# Netlify Blobs Setup Guide

## Automatic Setup (Recommended)

Netlify Blobs is **automatically available** for all sites on Netlify! No manual configuration needed.

## What Happens When You Deploy

1. **Netlify detects the function** (`visitor-count.js`)
2. **Blobs storage is auto-enabled** for your site
3. **Environment variables are injected** automatically:
   - `NETLIFY_BLOB_TOKEN`
   - `SITE_ID`

## First Deploy

When your site deploys for the first time with this code:

1. The visitor counter starts at **0**
2. First visitor increments it to **1**
3. Each unique visitor adds to the count
4. Count persists forever (stored in Netlify Blobs)

## Verify It's Working

After deployment, test the function:

```bash
# Get current count
curl https://aabiskarregmi.com.np/.netlify/functions/visitor-count

# Should return:
# {"count": X}
```

## View Netlify Blobs Dashboard

1. Go to your Netlify dashboard
2. Select your site: **aabiskarregmi-com-np**
3. Click **"Blobs"** in the left sidebar
4. You'll see your stored data:
   - `visitor-count` - The current count
   - `unique-visitors` - List of visitor fingerprints

## Pricing

- **Free Tier**: 
  - 1 GB storage
  - 100 GB bandwidth/month
  - Unlimited reads/writes

Your visitor counter uses **~1-2 KB** total, so you're well within limits!

## Reset Count (If Needed)

If you ever need to reset the counter:

1. Go to Netlify Dashboard → Your Site → Blobs
2. Delete the `visitor-count` blob
3. Delete the `unique-visitors` blob
4. Next visitor will start count at 1

Or use the Netlify CLI:
```bash
netlify blobs:delete visitor-count --store production
netlify blobs:delete unique-visitors --store production
```

## Monitoring

Check your Netlify Function logs:
1. Netlify Dashboard → Your Site → Functions
2. Click on `visitor-count`
3. View logs to see requests

## Troubleshooting

### Function not appearing?
- Check `netlify.toml` has correct functions directory
- Redeploy the site

### Count not increasing?
- Check browser console for errors
- Verify function URL in Network tab
- Check Netlify function logs

### Count reset to 0?
- Blobs were deleted
- Check Netlify Blobs dashboard

## Success Indicators

✅ Function appears in Netlify Functions dashboard
✅ Blobs appear in Netlify Blobs dashboard  
✅ Count increases with new visitors
✅ Returning visitors (same day) don't increase count
✅ Count persists across deployments
✅ All browsers show same count

## No Action Required!

Just deploy and it works automatically! 🎉
