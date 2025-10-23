# 🐛 Debugging Online Chess - Step by Step

## **IMPORTANT: Check This First!**

### ✅ Step 1: Verify Pusher Environment Variables in Netlify

Go to: https://app.netlify.com/ → Your Site → **Site settings** → **Environment variables**

Make sure these **4 variables** are there:
```
PUSHER_APP_ID = 2067592
PUSHER_KEY = 2a33370c77c42dc75b2c
PUSHER_SECRET = a98aa0a231b5e4d547a7
PUSHER_CLUSTER = ap1
```

**If they're NOT there, ADD them now!**

Then: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 🔍 Step 2: Test and Check Console

### Open Browser Console (F12):

**Chrome/Edge:** F12 → Console tab  
**Firefox:** F12 → Console tab

### Test the feature:

1. Go to your site: https://aabiskarregmi.com.np/#fun-zone
2. Open **Console** (F12)
3. Click "🌐 Online" button
4. Click "🔍 Find Online Match"

### What to look for in console:

✅ **Good signs (should see these):**
```
Initializing Pusher with cluster: ap1
Pusher connected successfully!
Subscribing to player channel: player-xxxxx
Successfully subscribed to player channel
Starting matchmaking for player: player-xxxxx Name: Player
Calling matchmaking API...
API Response status: 200
API Response data: {status: 'waiting'}
Waiting in queue...
```

❌ **Bad signs (problems):**
```
Pusher key not found in environment variables
Pusher connection error: ...
Failed to subscribe to player channel: ...
API Response status: 404 or 500
Failed to connect...
```

---

## 🧪 Step 3: Test with 2 Browsers (For Real Matching)

### Quick Test:

1. **Browser 1 (Chrome):**
   - Go to https://aabiskarregmi.com.np/#fun-zone
   - Open Console (F12)
   - Click "🌐 Online" → "Find Match"
   - Watch console logs

2. **Browser 2 (Firefox or Chrome Incognito):**
   - Go to https://aabiskarregmi.com.np/#fun-zone
   - Open Console (F12)  
   - Click "🌐 Online" → "Find Match"
   - Watch console logs

3. **What should happen:**
   - Both consoles should show: `Match found event received:`
   - Game starts automatically
   - Both see the chess board
   - One is white, one is black

---

## 📱 Step 4: Test Mobile + Laptop

Same as above, but:
- **Mobile:** Open site in Chrome/Safari
- **Laptop:** Open site in any browser
- Both click "Find Match" at roughly same time
- They should pair!

---

## 🚨 Common Issues & Fixes:

### Issue 1: "Pusher key not found in environment variables"
**Fix:** Add environment variables to Netlify (see Step 1)

### Issue 2: "API Response status: 404"
**Fix:** 
- Netlify Functions not deployed
- Check: https://app.netlify.com/ → Functions tab
- Should see: `chess-matchmaking` function

### Issue 3: "Failed to subscribe to player channel"
**Fix:**
- Wrong Pusher credentials
- Check Pusher cluster is `ap1` (not `us2` or `eu`)
- Verify keys in Netlify match Pusher dashboard

### Issue 4: Stuck on "Searching for opponent..."
**Possible causes:**
- Only one browser open (need 2 for matching!)
- Pusher not sending notifications
- Check both consoles for `Match found event received:`

### Issue 5: Moves not syncing
**Fix:**
- Check game channel subscription in console
- Look for: `Subscribing to game channel: game-xxxxx`
- Check Pusher Debug Console: https://dashboard.pusher.com/

---

## 🎯 Quick Checklist:

- [ ] Environment variables added to Netlify
- [ ] Site redeployed after adding variables
- [ ] Browser console open (F12)
- [ ] Testing with 2 browsers (not just 1!)
- [ ] Both browsers on same site URL
- [ ] Both click "Find Match" within 30 seconds

---

## 💡 Pro Tips:

1. **Use Pusher Dashboard:**
   - Go to: https://dashboard.pusher.com/
   - Click your app → **Debug Console**
   - You'll see real-time events as they happen!

2. **Check Netlify Functions:**
   - Go to: https://app.netlify.com/
   - Your site → **Functions** tab
   - Click `chess-matchmaking` to see logs

3. **Test Locally First:**
   - Run `npm run dev` in terminal
   - Open http://localhost:5173/#fun-zone
   - Test with 2 tabs in same browser

---

## 📞 Report Back:

After following these steps, tell me:

1. What do you see in the console? (Copy/paste the logs)
2. Are the environment variables in Netlify?
3. Are you testing with 2 browsers?
4. What error messages appear?

This will help me pinpoint the exact issue! 🎮
