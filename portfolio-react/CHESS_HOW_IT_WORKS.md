# How Online Chess Works - Technical Documentation

## Core Concept

**ONE BOARD STATE** (server maintains white's perspective)
**TWO VIEWS** (black player sees flipped display)

## The Single Source of Truth

### Server Board (Always White Perspective):
```
Row 0: [♜, ♞, ♝, ♛, ♚, ♝, ♞, ♜]  <- Black pieces (rank 8)
Row 1: [♟, ♟, ♟, ♟, ♟, ♟, ♟, ♟]  <- Black pawns (rank 7)
Row 2: [ ,  ,  ,  ,  ,  ,  ,  ]  <- Empty (rank 6)
Row 3: [ ,  ,  ,  ,  ,  ,  ,  ]  <- Empty (rank 5)
Row 4: [ ,  ,  ,  ,  ,  ,  ,  ]  <- Empty (rank 4)
Row 5: [ ,  ,  ,  ,  ,  ,  ,  ]  <- Empty (rank 3)
Row 6: [♙, ♙, ♙, ♙, ♙, ♙, ♙, ♙]  <- White pawns (rank 2)
Row 7: [♖, ♘, ♗, ♕, ♔, ♗, ♘, ♖]  <- White pieces (rank 1)
       a  b  c  d  e  f  g  h
```

## How Each Player Sees It

### White Player View (Normal):
```
Shows exactly what server has - no transformation
Row 0 = Black pieces at top
Row 7 = White pieces at bottom
```

### Black Player View (Flipped):
```
Displays server board REVERSED:
Row 0 = Black pieces at bottom (server Row 7 reversed)
Row 7 = White pieces at top (server Row 0 reversed)

Visual board[i][j] = Server board[7-i][7-j]
```

## Move Flow Example

### Example: White plays e2-e4

1. **White Player (makes move):**
   - Clicks visual position [6, 4] → [4, 4]
   - Already in white perspective, so real coords = visual coords
   - Converts to notation: "e2-e4"
   - Sends to server: `{from: [6,4], to: [4,4], board: <updated>, notation: "e2-e4"}`

2. **Server:**
   - Receives move with notation "e2-e4"
   - Updates board[6][4] → board[4][4]
   - Broadcasts via Pusher: `{notation: "e2-e4", board: <new_board>}`

3. **Black Player (receives move):**
   - Receives server board (white perspective)
   - Parses notation "e2-e4" → coords [6,4] → [4,4]
   - Flips board for display: `flipBoardForBlack(serverBoard)`
   - Flips highlight coords for display: [6,4]→[1,3], [4,4]→[3,3]
   - Shows updated board with black at bottom

### Example: Black plays e7-e5

1. **Black Player (makes move):**
   - Clicks visual position [1, 4] → [3, 4] (sees black at bottom)
   - Unflips to real coords: [7-1, 7-4] = [6, 4] → [7-3, 7-4] = [4, 4]
   - Real board position: Row 6 Col 4 (e7) → Row 4 Col 4 (e5)
   - Converts to notation: "e7-e5"
   - Unflips entire board back to white perspective
   - Sends to server: `{from: [6,4], to: [4,4], board: <updated_white_perspective>, notation: "e7-e5"}`

2. **Server:**
   - Receives move with notation "e7-e5"
   - Updates board[6][4] → board[4][4]
   - Broadcasts: `{notation: "e7-e5", board: <new_board>}`

3. **White Player (receives move):**
   - Receives server board (already white perspective)
   - No flipping needed
   - Parses notation "e7-e5" → highlights [6,4] → [4,4]
   - Shows updated board directly

## Coordinate System

### Chess Notation Mapping:
```
   a  b  c  d  e  f  g  h
8  [0,0][0,1][0,2][0,3][0,4][0,5][0,6][0,7]  <- Black back rank
7  [1,0][1,1][1,2][1,3][1,4][1,5][1,6][1,7]  <- Black pawns
6  [2,0]...                                   <- Empty
5  [3,0]...                                   <- Empty
4  [4,0]...                                   <- Empty
3  [5,0]...                                   <- Empty
2  [6,0][6,1][6,2][6,3][6,4][6,5][6,6][6,7]  <- White pawns
1  [7,0][7,1][7,2][7,3][7,4][7,5][7,6][7,7]  <- White back rank
```

### Conversion Functions:
```typescript
// Array coords → Chess notation
coordsToChessNotation(6, 4) → "e2"
coordsToChessNotation(4, 4) → "e4"

// Chess notation → Array coords
chessNotationToCoords("e2") → [6, 4]
chessNotationToCoords("e4") → [4, 4]

// Flip for black display
flipBoardForBlack(board) → board.reverse().map(row => row.reverse())
```

## Key Rules

1. ✅ **Server ALWAYS stores white perspective**
2. ✅ **White player uses board directly (no transformation)**
3. ✅ **Black player FLIPS for display only**
4. ✅ **Black player UNFLIPS before sending moves**
5. ✅ **Chess notation is universal (both players use same notation)**
6. ✅ **All game logic runs on white-perspective board**

## Why This Works

- **Single board state** = No synchronization issues
- **Visual flip only** = Simple transform, no logic changes
- **Standard notation** = Easy debugging (e2-e4 means same thing for everyone)
- **No coordinate confusion** = Server never needs to know player colors for moves

## What You'll See in Logs

### White Player Console:
```
My color: white
Visual coords - From: [6,4] To: [4,4]
Real board coords - From: [6,4] To: [4,4]
Chess notation: e2-e4
```

### Black Player Console (making move):
```
My color: black
Visual coords - From: [1,4] To: [3,4]
Real board coords - From: [6,4] To: [4,4]  <- Unflipped!
Chess notation: e7-e5
```

### Black Player Console (receiving move):
```
Move received: {notation: "e2-e4", ...}
Received board: [[♜,♞,...], ...]  <- White perspective
Display board (flipped for black): [[♖,♘,...], ...]  <- Flipped
```
