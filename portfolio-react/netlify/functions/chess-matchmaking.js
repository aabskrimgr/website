import { getStore } from '@netlify/blobs';
import Pusher from 'pusher';

// Initialize Pusher - credentials will be set via environment variables
let pusher;
try {
  console.log('Initializing Pusher with:', {
    appId: process.env.PUSHER_APP_ID ? 'SET' : 'MISSING',
    key: process.env.PUSHER_KEY ? 'SET' : 'MISSING',
    secret: process.env.PUSHER_SECRET ? 'SET' : 'MISSING',
    cluster: process.env.PUSHER_CLUSTER || 'MISSING'
  });

  if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) {
    console.error('ERROR: Pusher environment variables not set!');
    throw new Error('Pusher environment variables missing');
  }

  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || 'ap1',
    useTLS: true
  });
  
  console.log('Pusher initialized successfully');
} catch (error) {
  console.error('Failed to initialize Pusher:', error);
}

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

  // Check if Pusher is initialized
  if (!pusher) {
    console.error('Pusher not initialized - check environment variables');
    return new Response(JSON.stringify({ 
      error: 'Server configuration error',
      details: 'Pusher not initialized. Check Netlify environment variables.'
    }), { 
      status: 500, 
      headers 
    });
  }

  const store = getStore('chess-games');

  try {
    if (req.method === 'POST') {
      const { action, playerId, playerName, gameId, move } = await req.json();
      
      console.log('Received action:', action, 'from player:', playerId);

      // Join matchmaking queue
      if (action === 'findMatch') {
        console.log('=== MATCHMAKING REQUEST ===');
        console.log('Player ID:', playerId);
        console.log('Player Name:', playerName);
        
        // Get waiting players with retry for eventual consistency
        let waitingPlayers = await store.get('waiting-players', { type: 'json' }) || [];
        
        // If no players, wait a bit and retry (for eventual consistency)
        if (waitingPlayers.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
          waitingPlayers = await store.get('waiting-players', { type: 'json' }) || [];
        }
        
        console.log('Current waiting players:', waitingPlayers.length, waitingPlayers);
        
        // Check if this player is already waiting
        const existingPlayer = waitingPlayers.find(p => p.id === playerId);
        if (existingPlayer) {
          console.log('Player already in queue');
          return new Response(JSON.stringify({ 
            status: 'waiting',
            message: 'Already in queue'
          }), { status: 200, headers });
        }

        // If there's someone waiting, match them
        if (waitingPlayers.length > 0) {
          console.log('MATCH FOUND! Pairing players...');
          const opponent = waitingPlayers.shift(); // Take first player
          const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('Opponent:', opponent);
          console.log('Game ID:', gameId);
          
          // Randomly assign colors
          const whitePlayer = Math.random() > 0.5 ? playerId : opponent.id;
          const blackPlayer = whitePlayer === playerId ? opponent.id : playerId;
          
          console.log('White player:', whitePlayer);
          console.log('Black player:', blackPlayer);
          
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
          
          // Clear the waiting queue
          await store.setJSON('waiting-players', waitingPlayers);
          
          console.log('Game saved, sending Pusher notifications...');

          // Notify both players via Pusher
          try {
            await pusher.trigger(`player-${playerId}`, 'match-found', {
              gameId,
              color: whitePlayer === playerId ? 'white' : 'black',
              opponent: whitePlayer === playerId ? opponent.name : playerName
            });
            console.log('Notified player 1:', playerId);

            await pusher.trigger(`player-${opponent.id}`, 'match-found', {
              gameId,
              color: whitePlayer === opponent.id ? 'white' : 'black',
              opponent: whitePlayer === opponent.id ? playerName : opponent.name
            });
            console.log('Notified player 2:', opponent.id);
          } catch (pusherError) {
            console.error('Pusher notification error:', pusherError);
          }

          console.log('=== MATCH COMPLETE ===');
          return new Response(JSON.stringify({
            status: 'matched',
            gameId,
            color: whitePlayer === playerId ? 'white' : 'black'
          }), { status: 200, headers });
        } else {
          console.log('No players waiting, adding to queue');
          // Add player to waiting queue
          waitingPlayers.push({
            id: playerId,
            name: playerName,
            joinedAt: Date.now()
          });
          
          // Use set with consistency option
          await store.setJSON('waiting-players', waitingPlayers);
          
          // Verify it was saved
          const verify = await store.get('waiting-players', { type: 'json' }) || [];
          console.log('Player added to queue. Total waiting:', waitingPlayers.length);
          console.log('Verified in store:', verify.length);
          console.log('=== END ===');

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

        console.log('Sending move notification...');
        console.log('Player color:', playerColor);
        console.log('Board being sent:', gameData.board);
        console.log('Current turn after move:', gameData.currentTurn);

        // Notify opponent via Pusher
        const opponentId = gameData.white.id === playerId ? gameData.black.id : gameData.white.id;
        await pusher.trigger(`game-${gameId}`, 'move-made', {
          move: move,
          currentTurn: gameData.currentTurn,
          status: gameData.status,
          winner: move.winner
        });
        
        console.log('Move notification sent to game channel');

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
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];
}

export const config = {
  path: '/api/chess-matchmaking'
};
