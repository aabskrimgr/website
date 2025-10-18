# Chess Game - Advanced Features

## Overview
The Mini Chess game in the Fun Zone section now includes professional chess rules including **en passant**, **check**, **checkmate**, and **stalemate** detection.

## Features Implemented

### 1. En Passant Capture
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

### 2. Check Detection
**What it is:** When a king is under direct attack by an enemy piece.

**Behavior:**
- Player receives message: "Check! Your turn" or "Check! Computer is thinking..."
- King must move out of check or block the attack
- Cannot make moves that leave your own king in check

### 3. Checkmate
**What it is:** King is in check AND has no legal moves to escape.

**Game Over Conditions:**
- Player wins: "Checkmate! You win! 🎉"
- Computer wins: "Checkmate! Computer wins!"
- Board becomes locked after checkmate

### 4. Stalemate (Draw)
**What it is:** Player has no legal moves BUT king is NOT in check.

**Result:**
- Game ends in a draw
- Message: "Stalemate! It's a draw."
- Neither player wins

## Technical Implementation

### State Management
```typescript
- lastMove: Tracks previous move for en passant validation
- gameOver: Prevents moves after checkmate/stalemate
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

## Game Flow

### Player Move:
1. Select white piece
2. Select destination square
3. Validate move (including check prevention)
4. Execute move (handle en passant if applicable)
5. Check for checkmate/stalemate for opponent
6. Display check warning if applicable
7. Computer's turn

### Computer Move:
1. Find all legal moves for black pieces
2. Randomly select valid move
3. Execute move (handle en passant if applicable)
4. Check for checkmate/stalemate for player
5. Display check warning if applicable
6. Player's turn

## Reset Functionality
The "Reset" button now properly clears:
- Chess board to initial position
- Last move tracking
- Game over state
- Selected square
- Message display

## Testing Scenarios

### Test En Passant:
1. Move white pawn 2 squares forward
2. Computer moves black pawn adjacent
3. Move same white pawn 1 square
4. Computer should be able to capture en passant

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

### Test Stalemate:
1. Reduce opponent to only king
2. Control board so king can't move
3. Ensure king is NOT in check
4. Game should end in draw

## Browser Console Testing
You can verify game states by checking the console during gameplay. The functions evaluate the board state in real-time.

## Future Enhancements (Optional)
- [ ] Pawn promotion (pawn reaches opposite end → becomes queen)
- [ ] Castling (special king-rook move)
- [ ] Move history display
- [ ] Undo/Redo functionality
- [ ] Difficulty levels for computer AI
- [ ] Highlight legal moves when piece selected
- [ ] Move animation
- [ ] Captured pieces display

## Credits
Implemented with React TypeScript using functional components and hooks. Chess logic follows official FIDE rules for en passant, check, checkmate, and stalemate.
