# Chess Game - Advanced Features

## Overview
The Mini Chess game in the Fun Zone section now includes professional chess rules including **en passant**, **check**, **checkmate**, and **stalemate** detection. Players can choose between **1-Player** (vs Computer) or **2-Player** (vs Friend) modes with a complete scoring system that tracks captured pieces.

## Features Implemented

### 1. Game Modes

#### 1-Player Mode (vs Computer)
- Player controls white pieces (bottom)
- Computer controls black pieces (top) with random valid moves
- Player labeled as "You" with white king icon (♔)
- Computer labeled as "Computer" with black king icon (♚)

#### 2-Player Mode (vs Friend)
- Two players take turns on the same device
- White player goes first (bottom)
- Black player goes second (top)
- Turn-based gameplay with automatic turn switching
- Players labeled as "White" and "Black"

### 2. Scoring System

**Piece Values:**
- Pawn: 1 point
- Knight: 3 points
- Bishop: 3 points
- Rook: 5 points
- Queen: 9 points
- King: Not capturable (game ends in checkmate)

**Display:**
- Points shown next to each player's name
- Real-time score updates when pieces are captured
- Includes en passant captures (pawn value = 1)

### 3. Player Information

**Layout (Chess.com style):**
- **Top Left:** Computer/Black player with king icon and score
- **Bottom Left:** You/White player with king icon and score
- Each player display shows:
  - Player icon (♚ for black, ♔ for white)
  - Player name (Computer/You or Black/White)
  - Current points from captured pieces

### 4. En Passant Capture
**What it is:** A special pawn capture that can only occur under specific conditions.

**When it happens:**
- A pawn moves 2 squares forward from its starting position
- An enemy pawn is on an adjacent file on the same rank
- On the very next move, the enemy pawn can capture "in passing" (en passant)

**Example:**
```
1. White pawn moves from row 6 to row 4 (2 squares)
2. Black pawn is on row 4, adjacent column
3. Black pawn can capture diagonally to row 5, removing white pawn
```

### 5. Check Detection
**What it is:** When a king is under direct attack by an enemy piece.

**Behavior:**
- Player receives message: "Check! Your turn" or "Check! Computer is thinking..."
- King must move out of check or block the attack
- Cannot make moves that leave your own king in check

### 6. Checkmate
**What it is:** King is in check AND has no legal moves to escape.

**Game Over Conditions:**
- Player wins: "Checkmate! You win! 🎉"
- Computer wins: "Checkmate! Computer wins!"
- Board becomes locked after checkmate

### 7. Stalemate (Draw)
**What it is:** Player has no legal moves BUT king is NOT in check.

**Result:**
- Game ends in a draw
- Message: "Stalemate! It's a draw."
- Neither player wins

## Technical Implementation

### State Management
```typescript
- chessBoard: 8x8 array representing the board
- selectedSquare: Currently selected piece position
- chessMessage: Game status and turn information
- lastMove: Tracks previous move for en passant validation
- gameOver: Prevents moves after checkmate/stalemate
- chessMode: '1-player' or '2-player' mode selection
- whiteScore: Points accumulated by white player
- blackScore: Points accumulated by black player
- currentTurn: 'white' or 'black' (for 2-player mode)
```

### Key Functions

#### `findKingPosition(board, isWhite)`
Locates the king on the board for the specified color.

#### `isSquareUnderAttack(board, row, col, byWhite)`
Checks if a square is being attacked by any piece of the specified color.

#### `isKingInCheck(board, isWhite)`
Determines if the king is currently in check.

#### `wouldBeInCheck(board, from, to, isWhite)`
Simulates a move to check if it would result in check (prevents illegal moves).

#### `isValidMoveSimple(board, from, to)`
Validates piece movement rules including en passant logic.

#### `isValidMove(board, from, to)`
Validates moves AND ensures they don't leave the king in check.

#### `hasValidMoves(board, isWhite)`
Checks if a player has any legal moves available.

#### `isCheckmate(board, isWhite)`
Returns true if king is in check AND no legal moves exist.

#### `isStalemate(board, isWhite)`
Returns true if king is NOT in check BUT no legal moves exist.

#### `getPieceValue(piece)`
Returns the point value of a captured chess piece.

## Game Flow

### 1-Player Mode:

#### Player Move (White):
1. Select white piece
2. Select destination square
3. Validate move (including check prevention)
4. Execute move and update score if capture
5. Check for checkmate/stalemate for opponent
6. Display check warning if applicable
7. Computer's turn

#### Computer Move (Black):
1. Find all legal moves for black pieces
2. Randomly select valid move
3. Execute move and update score if capture
4. Check for checkmate/stalemate for player
5. Display check warning if applicable
6. Player's turn

### 2-Player Mode:

#### Player Move:
1. Current turn player selects their piece (white/black)
2. Select destination square
3. Validate move (including check prevention)
4. Execute move and update score if capture
5. Check for checkmate/stalemate for opponent
6. Display check warning if applicable
7. Switch turn to other player
8. Repeat

## Mode Selection
Two buttons allow players to switch between modes:
- **1 Player:** Play against computer AI (random valid moves)
- **2 Player:** Play against a friend on the same device

Switching modes automatically resets the game.

## Reset Functionality
The "Reset" button now properly clears:
- Chess board to initial position
- Last move tracking
- Game over state
- Selected square
- Message display
- Both player scores (reset to 0)
- Current turn (reset to white)

## Testing Scenarios

### Test 1-Player Mode:
1. Select "1 Player" button
2. Play as white pieces (bottom)
3. Computer plays as black automatically
4. Verify scores update when pieces are captured
5. Computer should only make legal moves

### Test 2-Player Mode:
1. Select "2 Player" button
2. White player (bottom) goes first
3. After white's move, black player (top) can move
4. Verify turn switching works correctly
5. Both players' scores update properly

### Test Scoring System:
1. Capture a pawn → Check score increases by 1
2. Capture a knight/bishop → Score increases by 3
3. Capture a rook → Score increases by 5
4. Capture a queen → Score increases by 9
5. En passant capture → Score increases by 1

### Test En Passant:
1. Move white pawn 2 squares forward
2. Opponent moves pawn adjacent
3. Capture en passant on next move
4. Verify score updates correctly

### Test Check:
1. Expose your king to enemy piece
2. Message should show "Check!"
3. Try illegal moves (should be blocked)
4. Move king to safety or block attack

### Test Checkmate:
1. Corner the opponent's king
2. Attack with queen/rook
3. Ensure king has no escape squares
4. Game should end with victory message
5. Verify correct winner displayed

### Test Stalemate:
1. Reduce opponent to only king
2. Control board so king can't move
3. Ensure king is NOT in check
4. Game should end in draw

### Test Mode Switching:
1. Start a game in 1-player mode
2. Make some moves to get scores
3. Switch to 2-player mode
4. Verify board resets and scores go to 0

## Browser Console Testing
You can verify game states by checking the console during gameplay. The functions evaluate the board state in real-time.

## UI Features

### Chess.com Style Layout
- **Top Player Area:** 
  - Black king icon (♚)
  - Player name (Computer/Black)
  - Points display
  
- **Chess Board:**
  - 8x8 grid with alternating amber colors
  - Selected piece highlighted with green ring
  - Hover effects and click animations
  
- **Bottom Player Area:**
  - White king icon (♔)
  - Player name (You/White)
  - Points display

### Mode Selection Buttons
- Two toggle buttons below the board
- Active mode highlighted in blue gradient
- Inactive mode in gray
- Smooth transitions and hover effects

### Game Status
- Dynamic messages above the board
- Shows current turn, check warnings, and game results
- Clear instructions for beginners

## Future Enhancements (Optional)
- [ ] Pawn promotion (pawn reaches opposite end → becomes queen)
- [ ] Castling (special king-rook move)
- [ ] Move history display
- [ ] Undo/Redo functionality
- [ ] Difficulty levels for computer AI (Easy/Medium/Hard)
- [ ] Highlight legal moves when piece selected
- [ ] Move animation with smooth transitions
- [ ] Captured pieces display (graveyard)
- [ ] Timer/Clock for each player
- [ ] Save/Load game state
- [ ] Online multiplayer with WebSocket
- [ ] Game replay functionality
- [ ] Opening book for computer AI
- [ ] Chess notation display (algebraic notation)

## Credits
Implemented with React TypeScript using functional components and hooks. Chess logic follows official FIDE rules for en passant, check, checkmate, and stalemate. Scoring system uses standard chess piece values. UI design inspired by Chess.com layout.
