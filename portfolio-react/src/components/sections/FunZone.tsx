import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGamepad } from 'react-icons/fa';

export default function FunZone() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Snake Game state (20 cols x 20 rows for bigger board)
  const SNAKE_COLS = 20;
  const SNAKE_ROWS = 20;
  const [snake, setSnake] = useState<[number, number][]>([[10, 10], [10, 9], [10, 8]]);
  const [food, setFood] = useState<[number, number]>([10, 14]); // Away from right border
  const [snakeDirection, setSnakeDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [snakeGameStarted, setSnakeGameStarted] = useState(false);
  const [snakeSpeed, setSnakeSpeed] = useState(150);

  // Simple Chess state (8x8 board)
  const initialChessBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  ];
  const [chessBoard, setChessBoard] = useState(initialChessBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [chessMessage, setChessMessage] = useState<string>('Your turn! (White pieces)');
  const [lastMove, setLastMove] = useState<[[number, number], [number, number]] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [chessMode, setChessMode] = useState<'1-player' | '2-player'>('1-player');
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  // Castling rights tracking
  const [castlingRights, setCastlingRights] = useState({
    whiteKingMoved: false,
    whiteKingsideRookMoved: false,
    whiteQueensideRookMoved: false,
    blackKingMoved: false,
    blackKingsideRookMoved: false,
    blackQueensideRookMoved: false,
  });

  // Snake Game logic
  useEffect(() => {
    if (!snakeGameStarted || snakeGameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (snakeDirection !== 'DOWN') setSnakeDirection('UP');
          break;
        case 'ArrowDown':
          if (snakeDirection !== 'UP') setSnakeDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (snakeDirection !== 'RIGHT') setSnakeDirection('LEFT');
          break;
        case 'ArrowRight':
          if (snakeDirection !== 'LEFT') setSnakeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [snakeDirection, snakeGameStarted, snakeGameOver]);

  useEffect(() => {
    if (!snakeGameStarted || snakeGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[0];
        let newHead: [number, number];

        switch (snakeDirection) {
          case 'UP':
            newHead = [head[0] - 1, head[1]];
            break;
          case 'DOWN':
            newHead = [head[0] + 1, head[1]];
            break;
          case 'LEFT':
            newHead = [head[0], head[1] - 1];
            break;
          case 'RIGHT':
            newHead = [head[0], head[1] + 1];
            break;
        }

        // Check collision with walls (SNAKE_ROWS x SNAKE_COLS)
        if (newHead[0] < 0 || newHead[0] >= SNAKE_ROWS || newHead[1] < 0 || newHead[1] >= SNAKE_COLS) {
          setSnakeGameOver(true);
          if (snakeScore > snakeHighScore) setSnakeHighScore(snakeScore);
          return prevSnake;
        }

        // Check collision with self
        if (newSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setSnakeGameOver(true);
          if (snakeScore > snakeHighScore) setSnakeHighScore(snakeScore);
          return prevSnake;
        }

        newSnake.unshift(newHead);

        // Check if food eaten
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          const newScore = snakeScore + 10;
          setSnakeScore(newScore);
          // Increase speed slightly every 50 points
          if (newScore % 50 === 0 && snakeSpeed > 50) {
            setSnakeSpeed(prev => Math.max(50, prev - 10));
          }
          // Generate new food position (with 1-cell margin from borders)
          let newFood: [number, number];
          do {
            newFood = [
              1 + Math.floor(Math.random() * (SNAKE_ROWS - 2)), 
              1 + Math.floor(Math.random() * (SNAKE_COLS - 2))
            ];
          } while (newSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, snakeSpeed);
    return () => clearInterval(gameInterval);
  }, [snakeDirection, snakeGameStarted, snakeGameOver, food, snakeScore, snakeHighScore, snakeSpeed, SNAKE_ROWS, SNAKE_COLS]);

  // Tic-Tac-Toe logic
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: (string | null)[]) => {
    return squares.every(square => square !== null);
  };

  const getComputerMove = (squares: (string | null)[]) => {
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null) as number[];
    
    if (emptySquares.length === 0) return -1;
    
    // Easy mode: random move
    if (difficulty === 'easy') {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }
    
    // Medium mode: 70% smart moves, 30% random
    if (difficulty === 'medium') {
      // 30% chance to make a random move
      if (Math.random() < 0.3) {
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
      }
      // Otherwise fall through to smart AI logic
    }
    
    // Hard/Medium (smart) mode: Smart AI
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    
    // 1. Try to win
    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] === 'O' && squares[b] === 'O' && !squares[c]) return c;
      if (squares[a] === 'O' && squares[c] === 'O' && !squares[b]) return b;
      if (squares[b] === 'O' && squares[c] === 'O' && !squares[a]) return a;
    }
    
    // 2. Block player from winning
    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] === 'X' && squares[b] === 'X' && !squares[c]) return c;
      if (squares[a] === 'X' && squares[c] === 'X' && !squares[b]) return b;
      if (squares[b] === 'X' && squares[c] === 'X' && !squares[a]) return a;
    }
    
    // 3. Take center if available
    if (!squares[4]) return 4;
    
    // 4. Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // 5. Take any available space
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    // Player's move
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard([...newBoard]); // Force re-render with new array

    // Check for winner after player's move
    const playerWinner = calculateWinner(newBoard);
    if (playerWinner) {
      setWinner(playerWinner);
      setPlayerScore(prev => prev + 1);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('Draw');
      return;
    }

    // Computer's turn after 500ms delay
    setTimeout(() => {
      const computerMove = getComputerMove(newBoard);
      if (computerMove !== -1) {
        const updatedBoard = [...newBoard];
        updatedBoard[computerMove] = 'O';
        setBoard([...updatedBoard]); // Force re-render with new array

        const computerWinner = calculateWinner(updatedBoard);
        if (computerWinner) {
          setWinner(computerWinner);
          if (computerWinner === 'O') {
            setComputerScore(prev => prev + 1);
          }
        } else if (isBoardFull(updatedBoard)) {
          setWinner('Draw');
        }
      }
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  // Snake Game functions
  const startSnakeGame = () => {
    setSnake([[10, 10], [10, 9], [10, 8]]);
    setFood([10, 14]); // Away from right border
    setSnakeDirection('RIGHT');
    setSnakeGameOver(false);
    setSnakeScore(0);
    setSnakeSpeed(150);
    setSnakeGameStarted(true);
  };

  // Get piece value for scoring
  const getPieceValue = (piece: string): number => {
    const values: { [key: string]: number } = {
      '♙': 1, '♟': 1,  // Pawns
      '♘': 3, '♞': 3,  // Knights
      '♗': 3, '♝': 3,  // Bishops
      '♖': 5, '♜': 5,  // Rooks
      '♕': 9, '♛': 9,  // Queens
    };
    return values[piece] || 0;
  };

  // Chess logic with rules
  const isWhitePiece = (piece: string) => ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
  const isBlackPiece = (piece: string) => ['♟', '♜', '♞', '♝', '♛', '♚'].includes(piece);

  const findKingPosition = (board: string[][], isWhite: boolean): [number, number] | null => {
    const king = isWhite ? '♔' : '♚';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === king) return [i, j];
      }
    }
    return null;
  };

  const isSquareUnderAttack = (board: string[][], row: number, col: number, byWhite: boolean): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (byWhite && isWhitePiece(piece)) {
          if (isValidMoveSimple(board, i, j, row, col)) return true;
        } else if (!byWhite && isBlackPiece(piece)) {
          if (isValidMoveSimple(board, i, j, row, col)) return true;
        }
      }
    }
    return false;
  };

  const isKingInCheck = (board: string[][], isWhite: boolean): boolean => {
    const kingPos = findKingPosition(board, isWhite);
    if (!kingPos) return false;
    return isSquareUnderAttack(board, kingPos[0], kingPos[1], !isWhite);
  };

  const wouldBeInCheck = (board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number, isWhite: boolean): boolean => {
    const newBoard = board.map(r => [...r]);
    const piece = board[fromRow][fromCol];
    
    // Handle castling moves
    const isCastling = (piece === '♔' || piece === '♚') && Math.abs(toCol - fromCol) === 2;
    if (isCastling) {
      // Move king
      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = '';
      
      // Move rook for castling
      if (toCol === 6) {
        // Kingside
        newBoard[fromRow][5] = newBoard[fromRow][7];
        newBoard[fromRow][7] = '';
      } else if (toCol === 2) {
        // Queenside
        newBoard[fromRow][3] = newBoard[fromRow][0];
        newBoard[fromRow][0] = '';
      }
    } else {
      // Normal move
      newBoard[toRow][toCol] = board[fromRow][fromCol];
      newBoard[fromRow][fromCol] = '';
    }
    
    return isKingInCheck(newBoard, isWhite);
  };

  const isValidMoveSimple = (board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Can't capture own pieces
    if (isWhitePiece(piece) && isWhitePiece(target)) return false;
    if (isBlackPiece(piece) && isBlackPiece(target)) return false;

    // Pawn moves
    if (piece === '♙') { // White pawn
      if (fromCol === toCol && !target) {
        if (toRow === fromRow - 1) return true; // Move forward
        if (fromRow === 6 && toRow === 4 && !board[5][fromCol]) return true; // Initial 2-square move
      }
      if (rowDiff === 1 && colDiff === 1 && toRow === fromRow - 1 && target) return true; // Capture diagonally
      // En passant
      if (lastMove && rowDiff === 1 && colDiff === 1 && toRow === fromRow - 1 && !target) {
        const [[lastFromRow, ], [lastToRow, lastToCol]] = lastMove;
        if (board[lastToRow][lastToCol] === '♟' && lastFromRow === 1 && lastToRow === 3 && lastToCol === toCol && fromRow === 3) {
          return true;
        }
      }
    }
    if (piece === '♟') { // Black pawn
      if (fromCol === toCol && !target) {
        if (toRow === fromRow + 1) return true;
        if (fromRow === 1 && toRow === 3 && !board[2][fromCol]) return true;
      }
      if (rowDiff === 1 && colDiff === 1 && toRow === fromRow + 1 && target) return true;
      // En passant
      if (lastMove && rowDiff === 1 && colDiff === 1 && toRow === fromRow + 1 && !target) {
        const [[lastFromRow, ], [lastToRow, lastToCol]] = lastMove;
        if (board[lastToRow][lastToCol] === '♙' && lastFromRow === 6 && lastToRow === 4 && lastToCol === toCol && fromRow === 4) {
          return true;
        }
      }
    }

    // Rook moves
    if (piece === '♖' || piece === '♜') {
      if (fromRow === toRow || fromCol === toCol) {
        // Check path is clear
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        let checkRow = fromRow + rowStep;
        let checkCol = fromCol + colStep;
        while (checkRow !== toRow || checkCol !== toCol) {
          if (board[checkRow][checkCol]) return false;
          checkRow += rowStep;
          checkCol += colStep;
        }
        return true;
      }
    }

    // Knight moves
    if (piece === '♘' || piece === '♞') {
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) return true;
    }

    // Bishop moves
    if (piece === '♗' || piece === '♝') {
      if (rowDiff === colDiff) {
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        let checkRow = fromRow + rowStep;
        let checkCol = fromCol + colStep;
        while (checkRow !== toRow) {
          if (board[checkRow][checkCol]) return false;
          checkRow += rowStep;
          checkCol += colStep;
        }
        return true;
      }
    }

    // Queen moves (combination of rook and bishop)
    if (piece === '♕' || piece === '♛') {
      if (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        let checkRow = fromRow + rowStep;
        let checkCol = fromCol + colStep;
        while (checkRow !== toRow || checkCol !== toCol) {
          if (board[checkRow][checkCol]) return false;
          checkRow += rowStep;
          checkCol += colStep;
        }
        return true;
      }
    }

    // King moves
    if (piece === '♔' || piece === '♚') {
      // Normal king move (one square in any direction)
      if (rowDiff <= 1 && colDiff <= 1) return true;
      
      // Castling logic
      const isWhiteKing = piece === '♔';
      if (colDiff === 2 && rowDiff === 0) {
        // Kingside castling (short castling - O-O)
        if (toCol === 6) {
          if (isWhiteKing) {
            // White kingside: king on e1 (7,4) to g1 (7,6), rook on h1 (7,7)
            if (fromRow === 7 && fromCol === 4 && !castlingRights.whiteKingMoved && !castlingRights.whiteKingsideRookMoved) {
              // Check rook is on h1 and squares between king and rook are empty
              if (board[7][7] === '♖' && board[7][5] === '' && board[7][6] === '') {
                // Check king is not in check, doesn't pass through check, and doesn't end in check
                if (!isSquareUnderAttack(board, 7, 4, false) && 
                    !isSquareUnderAttack(board, 7, 5, false) && 
                    !isSquareUnderAttack(board, 7, 6, false)) {
                  return true;
                }
              }
            }
          } else {
            // Black kingside: king on e8 (0,4) to g8 (0,6), rook on h8 (0,7)
            if (fromRow === 0 && fromCol === 4 && !castlingRights.blackKingMoved && !castlingRights.blackKingsideRookMoved) {
              // Check rook is on h8 and squares between king and rook are empty
              if (board[0][7] === '♜' && board[0][5] === '' && board[0][6] === '') {
                if (!isSquareUnderAttack(board, 0, 4, true) && 
                    !isSquareUnderAttack(board, 0, 5, true) && 
                    !isSquareUnderAttack(board, 0, 6, true)) {
                  return true;
                }
              }
            }
          }
        }
        // Queenside castling (long castling - O-O-O)
        if (toCol === 2) {
          if (isWhiteKing) {
            // White queenside: king on e1 (7,4) to c1 (7,2), rook on a1 (7,0)
            if (fromRow === 7 && fromCol === 4 && !castlingRights.whiteKingMoved && !castlingRights.whiteQueensideRookMoved) {
              // Check rook is on a1 and squares between king and rook are empty
              if (board[7][0] === '♖' && board[7][1] === '' && board[7][2] === '' && board[7][3] === '') {
                if (!isSquareUnderAttack(board, 7, 4, false) && 
                    !isSquareUnderAttack(board, 7, 3, false) && 
                    !isSquareUnderAttack(board, 7, 2, false)) {
                  return true;
                }
              }
            }
          } else {
            // Black queenside: king on e8 (0,4) to c8 (0,2), rook on a8 (0,0)
            if (fromRow === 0 && fromCol === 4 && !castlingRights.blackKingMoved && !castlingRights.blackQueensideRookMoved) {
              // Check rook is on a8 and squares between king and rook are empty
              if (board[0][0] === '♜' && board[0][1] === '' && board[0][2] === '' && board[0][3] === '') {
                if (!isSquareUnderAttack(board, 0, 4, true) && 
                    !isSquareUnderAttack(board, 0, 3, true) && 
                    !isSquareUnderAttack(board, 0, 2, true)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }

    return false;
  };

  const isValidMove = (board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol];
    if (!isValidMoveSimple(board, fromRow, fromCol, toRow, toCol)) return false;
    
    // Check if move would put own king in check
    const isWhite = isWhitePiece(piece);
    return !wouldBeInCheck(board, fromRow, fromCol, toRow, toCol, isWhite);
  };

  const hasValidMoves = (board: string[][], isWhite: boolean): boolean => {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if ((isWhite && isWhitePiece(piece)) || (!isWhite && isBlackPiece(piece))) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (board: string[][], isWhite: boolean): boolean => {
    return isKingInCheck(board, isWhite) && !hasValidMoves(board, isWhite);
  };

  const isStalemate = (board: string[][], isWhite: boolean): boolean => {
    return !isKingInCheck(board, isWhite) && !hasValidMoves(board, isWhite);
  };

  const handleChessSquareClick = (row: number, col: number) => {
    if (gameOver) return;
    
    const piece = chessBoard[row][col];
    
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessBoard[selectedRow][selectedCol];
      
      // In 2-player mode, check turn
      if (chessMode === '2-player') {
        if (currentTurn === 'white' && !isWhitePiece(selectedPiece)) return;
        if (currentTurn === 'black' && !isBlackPiece(selectedPiece)) return;
      }
      
      // Try to move with rules (white in 1-player, or current turn in 2-player)
      const canMove = chessMode === '1-player' 
        ? isWhitePiece(selectedPiece) 
        : (currentTurn === 'white' && isWhitePiece(selectedPiece)) || (currentTurn === 'black' && isBlackPiece(selectedPiece));
      
      if (canMove && isValidMove(chessBoard, selectedRow, selectedCol, row, col)) {
        const newBoard = chessBoard.map(r => [...r]);
        const capturedPiece = chessBoard[row][col];
        
        // Update score if piece captured
        if (capturedPiece) {
          const pieceValue = getPieceValue(capturedPiece);
          if (isWhitePiece(selectedPiece)) {
            setWhiteScore(prev => prev + pieceValue);
          } else {
            setBlackScore(prev => prev + pieceValue);
          }
        }
        
        // Handle en passant capture
        if ((selectedPiece === '♙' || selectedPiece === '♟') && Math.abs(col - selectedCol) === 1 && !chessBoard[row][col]) {
          if (lastMove) {
            const [[, ], [lastToRow, lastToCol]] = lastMove;
            if (selectedPiece === '♙' && chessBoard[lastToRow][lastToCol] === '♟' && lastToCol === col && lastToRow === row + 1) {
              newBoard[row + 1][col] = '';
              setWhiteScore(prev => prev + 1); // Pawn value
            } else if (selectedPiece === '♟' && chessBoard[lastToRow][lastToCol] === '♙' && lastToCol === col && lastToRow === row - 1) {
              newBoard[row - 1][col] = '';
              setBlackScore(prev => prev + 1); // Pawn value
            }
          }
        }
        
        // Handle castling - move both king and rook
        const isCastling = (selectedPiece === '♔' || selectedPiece === '♚') && Math.abs(col - selectedCol) === 2;
        if (isCastling) {
          // Move king
          newBoard[row][col] = selectedPiece;
          newBoard[selectedRow][selectedCol] = '';
          
          // Move rook
          if (col === 6) {
            // Kingside castling
            const rookCol = 7;
            const newRookCol = 5;
            newBoard[row][newRookCol] = newBoard[row][rookCol];
            newBoard[row][rookCol] = '';
          } else if (col === 2) {
            // Queenside castling
            const rookCol = 0;
            const newRookCol = 3;
            newBoard[row][newRookCol] = newBoard[row][rookCol];
            newBoard[row][rookCol] = '';
          }
        } else {
          // Normal move
          newBoard[row][col] = selectedPiece;
          newBoard[selectedRow][selectedCol] = '';
        }
        
        // Update castling rights
        const newCastlingRights = { ...castlingRights };
        if (selectedPiece === '♔') {
          newCastlingRights.whiteKingMoved = true;
        } else if (selectedPiece === '♚') {
          newCastlingRights.blackKingMoved = true;
        } else if (selectedPiece === '♖') {
          if (selectedRow === 7 && selectedCol === 7) newCastlingRights.whiteKingsideRookMoved = true;
          if (selectedRow === 7 && selectedCol === 0) newCastlingRights.whiteQueensideRookMoved = true;
        } else if (selectedPiece === '♜') {
          if (selectedRow === 0 && selectedCol === 7) newCastlingRights.blackKingsideRookMoved = true;
          if (selectedRow === 0 && selectedCol === 0) newCastlingRights.blackQueensideRookMoved = true;
        }
        // Also mark rook as moved if it was captured
        if (capturedPiece === '♖') {
          if (row === 7 && col === 7) newCastlingRights.whiteKingsideRookMoved = true;
          if (row === 7 && col === 0) newCastlingRights.whiteQueensideRookMoved = true;
        } else if (capturedPiece === '♜') {
          if (row === 0 && col === 7) newCastlingRights.blackKingsideRookMoved = true;
          if (row === 0 && col === 0) newCastlingRights.blackQueensideRookMoved = true;
        }
        setCastlingRights(newCastlingRights);
        
        setChessBoard(newBoard);
        setLastMove([[selectedRow, selectedCol], [row, col]]);
        setSelectedSquare(null);
        setValidMoves([]); // Clear valid moves after making a move
        
        // In 2-player mode
        if (chessMode === '2-player') {
          const nextTurn = currentTurn === 'white' ? 'black' : 'white';
          const isNextWhite = nextTurn === 'white';
          
          if (isCheckmate(newBoard, isNextWhite)) {
            setChessMessage(`Checkmate! ${currentTurn === 'white' ? 'White' : 'Black'} wins! 🎉`);
            setGameOver(true);
            return;
          }
          if (isStalemate(newBoard, isNextWhite)) {
            setChessMessage('Stalemate! It\'s a draw.');
            setGameOver(true);
            return;
          }
          
          setCurrentTurn(nextTurn);
          if (isKingInCheck(newBoard, isNextWhite)) {
            setChessMessage(`Check! ${nextTurn === 'white' ? 'White' : 'Black'}'s turn`);
          } else {
            setChessMessage(`${nextTurn === 'white' ? 'White' : 'Black'}'s turn`);
          }
        } else {
          // 1-player mode - check for checkmate/stalemate after player's move
          if (isCheckmate(newBoard, false)) {
            setChessMessage('Checkmate! You win! 🎉');
            setGameOver(true);
            return;
          }
          if (isStalemate(newBoard, false)) {
            setChessMessage('Stalemate! It\'s a draw.');
            setGameOver(true);
            return;
          }
          if (isKingInCheck(newBoard, false)) {
            setChessMessage('Check! Computer is thinking...');
          } else {
            setChessMessage('Computer is thinking...');
          }
          
          // Computer's turn with rules
          setTimeout(() => {
            makeComputerChessMove(newBoard);
          }, 1500);
        }
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
        setChessMessage('Invalid move! Try again.');
      }
    } else {
      // Select a piece and calculate valid moves
      const moves: [number, number][] = [];
      
      if (chessMode === '1-player') {
        // Only white pieces in 1-player mode
        if (isWhitePiece(piece)) {
          // Calculate all valid moves for this piece
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (isValidMove(chessBoard, row, col, r, c)) {
                moves.push([r, c]);
              }
            }
          }
          setSelectedSquare([row, col]);
          setValidMoves(moves);
          setChessMessage('Select where to move');
        }
      } else {
        // 2-player mode - select based on turn
        if (currentTurn === 'white' && isWhitePiece(piece)) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (isValidMove(chessBoard, row, col, r, c)) {
                moves.push([r, c]);
              }
            }
          }
          setSelectedSquare([row, col]);
          setValidMoves(moves);
          setChessMessage('White: Select where to move');
        } else if (currentTurn === 'black' && isBlackPiece(piece)) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (isValidMove(chessBoard, row, col, r, c)) {
                moves.push([r, c]);
              }
            }
          }
          setSelectedSquare([row, col]);
          setValidMoves(moves);
          setChessMessage('Black: Select where to move');
        }
      }
    }
  };

  const makeComputerChessMove = (board: string[][]) => {
    const blackPieces: [number, number][] = [];
    board.forEach((row, i) => {
      row.forEach((piece, j) => {
        if (isBlackPiece(piece)) {
          blackPieces.push([i, j]);
        }
      });
    });
    
    // Find all valid moves for black pieces
    const validMoves: [[number, number], [number, number]][] = [];
    const capturingMoves: [[number, number], [number, number]][] = [];
    
    blackPieces.forEach(([fromRow, fromCol]) => {
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
            const move: [[number, number], [number, number]] = [[fromRow, fromCol], [toRow, toCol]];
            validMoves.push(move);
            
            // Check if this move captures a piece
            if (board[toRow][toCol] && isWhitePiece(board[toRow][toCol])) {
              capturingMoves.push(move);
            }
            // Check for en passant capture
            const movingPiece = board[fromRow][fromCol];
            if (movingPiece === '♟' && Math.abs(toCol - fromCol) === 1 && !board[toRow][toCol]) {
              if (lastMove) {
                const [[, ], [lastToRow, lastToCol]] = lastMove;
                if (board[lastToRow][lastToCol] === '♙' && lastToCol === toCol && lastToRow === toRow - 1) {
                  capturingMoves.push(move);
                }
              }
            }
          }
        }
      }
    });
    
    if (validMoves.length > 0) {
      // Prefer capturing moves if available
      const movesToConsider = capturingMoves.length > 0 ? capturingMoves : validMoves;
      const [[fromRow, fromCol], [toRow, toCol]] = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
      const newBoard = board.map(r => [...r]);
      const movingPiece = board[fromRow][fromCol];
      const capturedPiece = board[toRow][toCol];
      
      // Update score if piece captured
      if (capturedPiece) {
        const pieceValue = getPieceValue(capturedPiece);
        setBlackScore(prev => prev + pieceValue);
      }
      
      // Handle en passant capture for black pawn
      if (movingPiece === '♟' && Math.abs(toCol - fromCol) === 1 && !board[toRow][toCol]) {
        if (lastMove) {
          const [[, ], [lastToRow, lastToCol]] = lastMove;
          if (board[lastToRow][lastToCol] === '♙' && lastToCol === toCol && lastToRow === toRow - 1) {
            newBoard[toRow - 1][toCol] = '';
            setBlackScore(prev => prev + 1); // Pawn value
          }
        }
      }
      
      newBoard[toRow][toCol] = movingPiece;
      newBoard[fromRow][fromCol] = '';
      setChessBoard(newBoard);
      setLastMove([[fromRow, fromCol], [toRow, toCol]]);
      
      // Check for checkmate/stalemate after computer's move
      if (isCheckmate(newBoard, true)) {
        setChessMessage('Checkmate! Computer wins!');
        setGameOver(true);
        return;
      }
      if (isStalemate(newBoard, true)) {
        setChessMessage('Stalemate! It\'s a draw.');
        setGameOver(true);
        return;
      }
      if (isKingInCheck(newBoard, true)) {
        setChessMessage('Check! Your turn (White pieces)');
      } else {
        setChessMessage('Your turn! (White pieces)');
      }
    } else {
      setChessMessage('Computer has no valid moves!');
    }
  };

  const resetChess = () => {
    setChessBoard(initialChessBoard);
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setGameOver(false);
    setWhiteScore(0);
    setBlackScore(0);
    setCurrentTurn('white');
    setCastlingRights({
      whiteKingMoved: false,
      whiteKingsideRookMoved: false,
      whiteQueensideRookMoved: false,
      blackKingMoved: false,
      blackKingsideRookMoved: false,
      blackQueensideRookMoved: false,
    });
    if (chessMode === '1-player') {
      setChessMessage('Your turn! (White pieces)');
    } else {
      setChessMessage('White\'s turn');
    }
  };

  return (
    <section id="fun-zone" className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Fun </span>
            <span className="gradient-text">Zone</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Take a break and have some fun! Challenge yourself with a quick game.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Snake Game */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <FaGamepad className="text-5xl text-green-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Snake Game
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use arrow keys to play!
                </p>
              </div>
            </div>

            {/* Snake Score */}
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {snakeScore}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {snakeHighScore}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">High Score</div>
              </div>
            </div>

            {/* Snake Game Board */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-3 mb-4 border-4 border-green-600/30 shadow-lg shadow-green-600/20">
              <div 
                className="grid gap-[2px] w-full"
                style={{ 
                  gridTemplateColumns: `repeat(${SNAKE_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${SNAKE_ROWS}, 1fr)`,
                  aspectRatio: `${SNAKE_COLS}/${SNAKE_ROWS}`
                }}
              >
                {Array.from({ length: SNAKE_ROWS * SNAKE_COLS }).map((_, index) => {
                  const row = Math.floor(index / SNAKE_COLS);
                  const col = index % SNAKE_COLS;
                  const isSnake = snake.some(segment => segment[0] === row && segment[1] === col);
                  const isHead = snake[0] && snake[0][0] === row && snake[0][1] === col;
                  const isFood = food[0] === row && food[1] === col;
                  
                  // Get snake segment index for gradient effect
                  const segmentIndex = snake.findIndex(segment => segment[0] === row && segment[1] === col);

                  return (
                    <div
                      key={index}
                      className={`w-full h-full rounded-sm transition-all duration-100 ${
                        isSnake
                          ? isHead
                            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50 scale-110'
                            : segmentIndex < 3
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-green-600 to-green-700'
                          : isFood
                          ? 'bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50'
                          : (row + col) % 2 === 0
                          ? 'bg-gray-800/50'
                          : 'bg-gray-800/30'
                      }`}
                    >
                      {isHead && (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white">
                          {snakeDirection === 'UP' ? '▲' : snakeDirection === 'DOWN' ? '▼' : snakeDirection === 'LEFT' ? '◀' : '▶'}
                        </div>
                      )}
                      {isFood && (
                        <div className="w-full h-full flex items-center justify-center text-xs">
                          🍎
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-4">
              {!snakeGameStarted && !snakeGameOver && (
                <div className="text-center">
                  <button
                    onClick={startSnakeGame}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-600/50"
                  >
                    🐍 Start Game
                  </button>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                    Use arrow keys to control the snake!
                  </p>
                </div>
              )}
              {snakeGameOver && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    Game Over! 💀
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white mb-4">
                    Score: <span className="text-green-600 font-bold">{snakeScore}</span>
                  </p>
                  <button
                    onClick={startSnakeGame}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-600/50"
                  >
                    🔄 Play Again
                  </button>
                </div>
              )}
              {snakeGameStarted && !snakeGameOver && (
                <div>
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    ⌨️ Use arrow keys or buttons below
                  </p>
                  {/* Mobile Controls */}
                  <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                    <div></div>
                    <button
                      onClick={() => snakeDirection !== 'DOWN' && setSnakeDirection('UP')}
                      className="aspect-square bg-gray-700 hover:bg-green-600 text-white rounded-lg font-bold text-2xl transition-all duration-200 active:scale-95"
                    >
                      ▲
                    </button>
                    <div></div>
                    <button
                      onClick={() => snakeDirection !== 'RIGHT' && setSnakeDirection('LEFT')}
                      className="aspect-square bg-gray-700 hover:bg-green-600 text-white rounded-lg font-bold text-2xl transition-all duration-200 active:scale-95"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => snakeDirection !== 'UP' && setSnakeDirection('DOWN')}
                      className="aspect-square bg-gray-700 hover:bg-green-600 text-white rounded-lg font-bold text-2xl transition-all duration-200 active:scale-95"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => snakeDirection !== 'LEFT' && setSnakeDirection('RIGHT')}
                      className="aspect-square bg-gray-700 hover:bg-green-600 text-white rounded-lg font-bold text-2xl transition-all duration-200 active:scale-95"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tic-Tac-Toe Game */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <FaGamepad className="text-5xl text-purple-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tic-Tac-Toe
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Challenge the computer!
                </p>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  difficulty === 'easy'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                😊 Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  difficulty === 'medium'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🎯 Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  difficulty === 'hard'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🔥 Hard
              </button>
            </div>

            {/* Score */}
            <div className="flex justify-around mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {playerScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">You (X)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {computerScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Computer (O)</div>
              </div>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!!winner || !!cell}
                  whileHover={!winner && !cell ? { scale: 1.1 } : {}}
                  whileTap={!winner && !cell ? { scale: 0.95 } : {}}
                  className={`aspect-square flex items-center justify-center text-4xl font-bold rounded-xl transition-all duration-300 ${
                    cell === 'X'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : cell === 'O'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${
                    !winner && !cell ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  {cell && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20 
                      }}
                      className={cell === 'X' ? 'animate-pulse-once' : ''}
                    >
                      {cell}
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Game Status */}
            <div className="text-center">
              {winner && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-4"
                >
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {winner === 'Draw'
                      ? "It's a Draw! 🤝"
                      : winner === 'X'
                      ? 'You Win! 🎉'
                      : 'Computer Wins! 🤖'}
                  </p>
                </motion.div>
              )}
              
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {winner ? 'Play Again' : 'Reset Game'}
              </button>
            </div>
          </motion.div>

          {/* Mini Chess Game */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl mr-4">♟️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mini Chess
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {chessMode === '1-player' ? 'Play vs Computer' : 'Play vs Friend'}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {chessMessage}
              </p>
            </div>

            {/* Game Container with Player Labels */}
            <div className="relative">
              {/* Top Player (Computer/Black) */}
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">♚</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {chessMode === '1-player' ? 'Computer' : 'Black'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Points: {blackScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chess Board */}
              <div className="grid grid-cols-8 gap-0 mb-2 border-4 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden">
                {chessBoard.map((row, i) =>
                  row.map((piece, j) => {
                    const isLight = (i + j) % 2 === 0;
                    const isSelected = selectedSquare?.[0] === i && selectedSquare?.[1] === j;
                    const isPieceWhite = isWhitePiece(piece);
                    const isPieceBlack = isBlackPiece(piece);
                    const isValidMove = validMoves.some(([r, c]) => r === i && c === j);
                    
                    return (
                      <motion.button
                        key={`${i}-${j}`}
                        onClick={() => handleChessSquareClick(i, j)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square flex items-center justify-center text-2xl relative ${
                          isLight
                            ? 'bg-amber-200 dark:bg-amber-700'
                            : 'bg-amber-600 dark:bg-amber-900'
                        } ${
                          isSelected
                            ? 'ring-4 ring-green-500'
                            : ''
                        } ${
                          isPieceWhite
                            ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                            : isPieceBlack
                            ? 'text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]'
                            : ''
                        } hover:brightness-110 transition-all`}
                      >
                        {piece}
                        {isValidMove && !piece && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                          </div>
                        )}
                        {isValidMove && piece && (
                          <div className="absolute inset-0 rounded-md ring-2 ring-green-500/70 ring-inset pointer-events-none"></div>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Bottom Player (Visitor/White) */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">♔</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {chessMode === '1-player' ? 'You' : 'White'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Points: {whiteScore}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Selection & Reset */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <button
                  onClick={() => {
                    setChessMode('1-player');
                    resetChess();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    chessMode === '1-player'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  1 Player
                </button>
                <button
                  onClick={() => {
                    setChessMode('2-player');
                    resetChess();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    chessMode === '2-player'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  2 Player
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {chessMode === '1-player' ? 'You play as White pieces' : 'Take turns playing'}
              </p>
              <button
                onClick={resetChess}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Reset Game
              </button>
            </div>
          </motion.div>
        </div>

        {/* Music Zone - Ultra Enhanced Design */}
        <motion.div
          id="music-zone"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 rounded-3xl shadow-2xl p-10 border-2 border-transparent bg-clip-padding backdrop-blur-sm overflow-hidden">
            {/* Animated Decorative Background Elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10"
            />
            
            {/* Header Section with Audio Visualizer */}
            {/* Music Zone Header */}
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <span className="text-3xl">🎵</span>
                <span className="text-gray-900 dark:text-white">Music </span>
                <span className="gradient-text">Lounge</span>
                <span className="text-3xl">🎧</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Curated playlists to enhance your focus, creativity, and relaxation
              </p>
            </div>

            {/* YouTube Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lofi Hip Hop Radio */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Live indicator */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE 24/7
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🎧</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                            Lofi Hip Hop Radio
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">Chill</span>
                            <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded text-xs font-semibold">Study</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      🎶 Chill beats to study, relax, and vibe to • Perfect background music
                    </p>
                    <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/jfKfPfyJRdk?si=QGvO8xZ3YzX5xqVK"
                        title="Lofi Hip Hop Radio"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {/* Stats bar */}
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">👥 60K+ listening</span>
                      <span className="flex items-center gap-1">⭐ Most Popular</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interstellar OST */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Epic badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⚡ EPIC
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🌌</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                            Interstellar - Hans Zimmer
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">Epic</span>
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-semibold">Focus</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      🚀 Epic cinematic soundtrack for deep work • Oscar-winning masterpiece
                    </p>
                    <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/UDVtMYqUAyw?si=x1VGxKxT7xqY8xqY"
                        title="Interstellar OST"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">🎬 Cinematic</span>
                      <span className="flex items-center gap-1">🏆 Award Winner</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Classical Music */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 dark:border-amber-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Classic badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      👑 CLASSIC
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🎼</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                            Classical Masters
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-semibold">Timeless</span>
                            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-semibold">Study</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      🎹 Mozart, Bach, Beethoven • Proven to enhance concentration
                    </p>
                    <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/jgpJVI3tDbY"
                        title="Classical Music for Studying"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">🧠 Mozart Effect</span>
                      <span className="flex items-center gap-1">📚 Study Boost</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Jazz Music */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Relaxed badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🎷 SMOOTH
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">☕</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                            Jazz Café
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold">Smooth</span>
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-semibold">Work</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      🎺 Smooth jazz for productive work sessions • Café ambience
                    </p>
                    <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/Dx5qFachd3A"
                        title="Jazz for Work & Study"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">☕ Café Vibes</span>
                      <span className="flex items-center gap-1">💼 Productivity</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Simple Footer Note */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                🎧 All playlists are free, ad-free, and available 24/7 • Adjust volume to your preference
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
