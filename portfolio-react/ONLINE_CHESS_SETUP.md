# Online Multiplayer Chess Setup

## Pusher Configuration

### 1. Get Your Pusher Credentials

1. Go to https://pusher.com/ and sign up (FREE)
2. Create a new app:
   - Name: Portfolio Chess
   - Cluster: Choose closest to you (e.g., `us2`, `eu`, `ap1`)
   - Tech: React
3. Go to "App Keys" tab and copy these values:
   - `app_id`
   - `key` (public key)
   - `secret` (private key - keep secure!)
   - `cluster`

### 2. Add Environment Variables to Netlify

Go to your Netlify dashboard:
1. Navigate to: Site settings → Environment variables
2. Add these 4 variables:

```
PUSHER_APP_ID=your_app_id_here
PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
PUSHER_CLUSTER=your_cluster_here (e.g., us2, eu, ap1)
```

### 3. Also Create a .env File Locally (for testing)

Create `portfolio-react/.env` with:

```env
VITE_PUSHER_KEY=your_key_here
VITE_PUSHER_CLUSTER=your_cluster_here

# For Netlify Functions (local testing)
PUSHER_APP_ID=your_app_id_here
PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
PUSHER_CLUSTER=your_cluster_here
```

**Important:** The `.env` file is already in `.gitignore` - DO NOT commit it!

## How It Works

1. **Matchmaking:**
   - Player clicks "Find Online Match"
   - System adds them to waiting queue
   - When another player joins, they're automatically paired
   - Random color assignment (white/black)

2. **Real-time Moves:**
   - When a player moves, it's sent to Netlify Function
   - Function validates and updates game state in Netlify Blobs
   - Pusher instantly broadcasts move to opponent
   - Both players see the move in real-time

3. **Features:**
   - Random matchmaking
   - Real-time move synchronization
   - Turn validation
   - Resign option
   - Player presence indicators
   - Automatic color assignment

## Free Tier Limits (Plenty for a portfolio!)

- 200,000 messages per day
- 100 max concurrent connections
- Unlimited channels

## Testing

1. Open your site in two different browsers (or incognito + normal)
2. Click "Find Online Match" in both
3. They'll be paired automatically
4. Play chess in real-time!

## API Endpoints

- `POST /api/chess-matchmaking` - Find match, make move, resign
- `GET /api/chess-matchmaking?gameId=xxx` - Get game state

## Troubleshooting

If moves aren't syncing:
1. Check Netlify environment variables are set
2. Check browser console for errors
3. Verify Pusher app is active in dashboard
4. Check Pusher Debug Console for real-time events
