import { getStore } from '@netlify/blobs';
import Pusher from 'pusher';

// Initialize Pusher - credentials will be set via environment variables
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

export default async (req, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const store = getStore('chess-games');

  try {
    if (req.method === 'POST') {
      const { action, playerId, playerName, gameId, move } = await req.json();

      // Join matchmaking queue
      if (action === 'findMatch') {
        // Get waiting players
        let waitingPlayers = await store.get('waiting-players', { type: 'json' }) || [];
        
        // Check if this player is already waiting
        const existingPlayer = waitingPlayers.find(p => p.id === playerId);
        if (existingPlayer) {
          return new Response(JSON.stringify({ 
            status: 'waiting',
            message: 'Already in queue'
          }), { status: 200, headers });
        }

        // If there's someone waiting, match them
        if (waitingPlayers.length > 0) {
          const opponent = waitingPlayers.shift(); // Take first player
          const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Randomly assign colors
          const whitePlayer = Math.random() > 0.5 ? playerId : opponent.id;
          const blackPlayer = whitePlayer === playerId ? opponent.id : playerId;
          
          // Create game
          const gameData = {
            id: gameId,
            white: {
              id: whitePlayer,
              name: whitePlayer === playerId ? playerName : opponent.name
            },
            black: {
              id: blackPlayer,
              name: blackPlayer === playerId ? playerName : opponent.name
            },
            board: createInitialBoard(),
            currentTurn: 'white',
            status: 'active',
            createdAt: Date.now(),
            moves: []
          };

          await store.setJSON(gameId, gameData);
          await store.setJSON('waiting-players', waitingPlayers);

          // Notify both players via Pusher
          await pusher.trigger(`player-${playerId}`, 'match-found', {
            gameId,
            color: whitePlayer === playerId ? 'white' : 'black',
            opponent: whitePlayer === playerId ? opponent.name : playerName
          });

          await pusher.trigger(`player-${opponent.id}`, 'match-found', {
            gameId,
            color: whitePlayer === opponent.id ? 'white' : 'black',
            opponent: whitePlayer === opponent.id ? playerName : opponent.name
          });

          return new Response(JSON.stringify({
            status: 'matched',
            gameId,
            color: whitePlayer === playerId ? 'white' : 'black'
          }), { status: 200, headers });
        } else {
          // Add player to waiting queue
          waitingPlayers.push({
            id: playerId,
            name: playerName,
            joinedAt: Date.now()
          });
          await store.setJSON('waiting-players', waitingPlayers);

          return new Response(JSON.stringify({
            status: 'waiting',
            message: 'Waiting for opponent...'
          }), { status: 200, headers });
        }
      }

      // Cancel matchmaking
      if (action === 'cancelMatch') {
        let waitingPlayers = await store.get('waiting-players', { type: 'json' }) || [];
        waitingPlayers = waitingPlayers.filter(p => p.id !== playerId);
        await store.setJSON('waiting-players', waitingPlayers);

        return new Response(JSON.stringify({
          status: 'cancelled'
        }), { status: 200, headers });
      }

      // Make a move
      if (action === 'makeMove') {
        const gameData = await store.get(gameId, { type: 'json' });
        
        if (!gameData) {
          return new Response(JSON.stringify({ error: 'Game not found' }), { 
            status: 404, 
            headers 
          });
        }

        // Verify it's the player's turn
        const playerColor = gameData.white.id === playerId ? 'white' : 'black';
        if (gameData.currentTurn !== playerColor) {
          return new Response(JSON.stringify({ error: 'Not your turn' }), { 
            status: 400, 
            headers 
          });
        }

        // Update game state
        gameData.board = move.newBoard;
        gameData.currentTurn = playerColor === 'white' ? 'black' : 'white';
        gameData.moves.push({
          from: move.from,
          to: move.to,
          piece: move.piece,
          timestamp: Date.now()
        });

        if (move.winner) {
          gameData.status = 'finished';
          gameData.winner = move.winner;
        }

        await store.setJSON(gameId, gameData);

        // Notify opponent via Pusher
        const opponentId = gameData.white.id === playerId ? gameData.black.id : gameData.white.id;
        await pusher.trigger(`game-${gameId}`, 'move-made', {
          move: move,
          currentTurn: gameData.currentTurn,
          status: gameData.status,
          winner: move.winner
        });

        return new Response(JSON.stringify({
          status: 'success',
          currentTurn: gameData.currentTurn
        }), { status: 200, headers });
      }

      // Resign game
      if (action === 'resign') {
        const gameData = await store.get(gameId, { type: 'json' });
        
        if (gameData) {
          const playerColor = gameData.white.id === playerId ? 'white' : 'black';
          gameData.status = 'finished';
          gameData.winner = playerColor === 'white' ? 'black' : 'white';
          gameData.endReason = 'resignation';
          
          await store.setJSON(gameId, gameData);

          // Notify opponent
          await pusher.trigger(`game-${gameId}`, 'game-ended', {
            winner: gameData.winner,
            reason: 'resignation'
          });
        }

        return new Response(JSON.stringify({ status: 'success' }), { 
          status: 200, 
          headers 
        });
      }
    }

    // GET request - fetch game state
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const gameId = url.searchParams.get('gameId');

      if (!gameId) {
        return new Response(JSON.stringify({ error: 'Game ID required' }), { 
          status: 400, 
          headers 
        });
      }

      const gameData = await store.get(gameId, { type: 'json' });

      if (!gameData) {
        return new Response(JSON.stringify({ error: 'Game not found' }), { 
          status: 404, 
          headers 
        });
      }

      return new Response(JSON.stringify(gameData), { status: 200, headers });
    }

  } catch (error) {
    console.error('Chess matchmaking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error',
      details: error.message 
    }), { 
      status: 500, 
      headers 
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
    status: 405, 
    headers 
  });
};

// Helper function to create initial chess board
function createInitialBoard() {
  return [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];
}

export const config = {
  path: '/api/chess-matchmaking'
};
