import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('snake-game');
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // GET - Fetch current high score
    if (req.method === 'GET') {
      const data = await store.get('leaderboard', { type: 'json' });
      
      if (!data) {
        return new Response(
          JSON.stringify({
            highScore: 0,
            playerName: 'Anonymous',
            date: new Date().toISOString(),
          }),
          { status: 200, headers }
        );
      }

      return new Response(JSON.stringify(data), { status: 200, headers });
    }

    // POST - Submit new high score
    if (req.method === 'POST') {
      const body = await req.json();
      const { score, playerName = 'Anonymous' } = body;

      if (typeof score !== 'number' || score < 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid score' }),
          { status: 400, headers }
        );
      }

      // Get current high score
      const currentData = await store.get('leaderboard', { type: 'json' });
      const currentHighScore = currentData?.highScore || 0;

      // Only update if new score is higher
      if (score > currentHighScore) {
        const newData = {
          highScore: score,
          playerName: playerName.substring(0, 20), // Limit name length
          date: new Date().toISOString(),
        };

        await store.setJSON('leaderboard', newData);

        return new Response(
          JSON.stringify({ 
            success: true, 
            isNewRecord: true,
            ...newData 
          }),
          { status: 200, headers }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          isNewRecord: false,
          currentHighScore,
        }),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );

  } catch (error) {
    console.error('Snake leaderboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/snake-leaderboard',
};
