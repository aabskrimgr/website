import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaGamepad, FaTrophy } from 'react-icons/fa';

export default function FunZone() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [visitorCount, setVisitorCount] = useState(0);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  
  // Rock-Paper-Scissors state
  const [rpsPlayerChoice, setRpsPlayerChoice] = useState<string | null>(null);
  const [rpsComputerChoice, setRpsComputerChoice] = useState<string | null>(null);
  const [rpsResult, setRpsResult] = useState<string | null>(null);
  const [rpsPlayerScore, setRpsPlayerScore] = useState(0);
  const [rpsComputerScore, setRpsComputerScore] = useState(0);

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

  // Initialize visitor count with real API
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Using CountAPI - a free visitor counter service
        const response = await fetch('https://api.countapi.xyz/hit/aabiskarregmi.com.np/visits');
        const data = await response.json();
        
        if (data.value) {
          // Animate the counter
          let current = 0;
          const target = data.value;
          const increment = Math.ceil(target / 50);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setVisitorCount(target);
              clearInterval(timer);
            } else {
              setVisitorCount(current);
            }
          }, 20);

          return () => clearInterval(timer);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        // Fallback to localStorage starting from 0
        const stored = localStorage.getItem('portfolioVisitorCount');
        const count = stored ? parseInt(stored) : 0;
        const newCount = count + 1;
        localStorage.setItem('portfolioVisitorCount', newCount.toString());
        setVisitorCount(newCount);
      }
    };

    fetchVisitorCount();
  }, []);

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
    
    // Hard mode: Smart AI
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

  // Rock-Paper-Scissors logic
  const playRPS = (playerChoice: string) => {
    const choices = ['🪨 Rock', '📄 Paper', '✂️ Scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    setRpsPlayerChoice(playerChoice);
    setRpsComputerChoice(computerChoice);
    
    // Determine winner
    const player = playerChoice.split(' ')[1];
    const computer = computerChoice.split(' ')[1];
    
    if (player === computer) {
      setRpsResult("It's a Tie! 🤝");
    } else if (
      (player === 'Rock' && computer === 'Scissors') ||
      (player === 'Paper' && computer === 'Rock') ||
      (player === 'Scissors' && computer === 'Paper')
    ) {
      setRpsResult('You Win! 🎉');
      setRpsPlayerScore(prev => prev + 1);
    } else {
      setRpsResult('Computer Wins! 🤖');
      setRpsComputerScore(prev => prev + 1);
    }
  };

  const resetRPS = () => {
    setRpsPlayerChoice(null);
    setRpsComputerChoice(null);
    setRpsResult(null);
  };

  // Simple Chess logic
  const isWhitePiece = (piece: string) => ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
  const isBlackPiece = (piece: string) => ['♟', '♜', '♞', '♝', '♛', '♚'].includes(piece);

  const handleChessSquareClick = (row: number, col: number) => {
    const piece = chessBoard[row][col];
    
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessBoard[selectedRow][selectedCol];
      
      // Try to move
      if (isWhitePiece(selectedPiece) && !isWhitePiece(piece)) {
        const newBoard = chessBoard.map(r => [...r]);
        newBoard[row][col] = selectedPiece;
        newBoard[selectedRow][selectedCol] = '';
        setChessBoard(newBoard);
        setSelectedSquare(null);
        setChessMessage('Computer is thinking...');
        
        // Computer's turn (simple random move)
        setTimeout(() => {
          makeComputerChessMove(newBoard);
        }, 500);
      } else {
        setSelectedSquare(null);
      }
    } else {
      // Select a white piece
      if (isWhitePiece(piece)) {
        setSelectedSquare([row, col]);
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
    
    if (blackPieces.length > 0) {
      const [fromRow, fromCol] = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      const possibleMoves: [number, number][] = [];
      
      // Find empty squares or white pieces to capture
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (board[i][j] === '' || isWhitePiece(board[i][j])) {
            possibleMoves.push([i, j]);
          }
        }
      }
      
      if (possibleMoves.length > 0) {
        const [toRow, toCol] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const newBoard = board.map(r => [...r]);
        newBoard[toRow][toCol] = board[fromRow][fromCol];
        newBoard[fromRow][fromCol] = '';
        setChessBoard(newBoard);
      }
    }
    
    setChessMessage('Your turn! (White pieces)');
  };

  const resetChess = () => {
    setChessBoard(initialChessBoard);
    setSelectedSquare(null);
    setChessMessage('Your turn! (White pieces)');
  };

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
          {/* Visitor Counter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <FaUsers className="text-5xl text-primary-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Site Visitors
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You're visitor #{visitorCount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="text-6xl font-bold gradient-text mb-4"
              >
                {visitorCount.toLocaleString()}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for visiting! 🎉
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-yellow-500">
                <FaTrophy className="text-2xl" />
                <span className="text-gray-900 dark:text-white font-semibold">
                  Thanks for stopping by!
                </span>
              </div>
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

          {/* Rock-Paper-Scissors Game */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <FaGamepad className="text-5xl text-orange-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Rock-Paper-Scissors
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Classic game!
                </p>
              </div>
            </div>

            {/* Score */}
            <div className="flex justify-around mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {rpsPlayerScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">You</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {rpsComputerScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Computer</div>
              </div>
            </div>

            {/* Game Choices */}
            <div className="flex justify-center gap-4 mb-6">
              {['🪨 Rock', '📄 Paper', '✂️ Scissors'].map((choice) => (
                <motion.button
                  key={choice}
                  onClick={() => playRPS(choice)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 flex items-center justify-center text-4xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  {choice.split(' ')[0]}
                </motion.button>
              ))}
            </div>

            {/* Game Result */}
            <div className="text-center min-h-[120px]">
              {rpsResult && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">{rpsPlayerChoice?.split(' ')[0]}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">You</div>
                    </div>
                    <div className="text-2xl">VS</div>
                    <div className="text-center">
                      <div className="text-5xl mb-2">{rpsComputerChoice?.split(' ')[0]}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Computer</div>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {rpsResult}
                  </p>
                  <button
                    onClick={resetRPS}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
              {!rpsResult && (
                <p className="text-gray-600 dark:text-gray-400 pt-8">
                  Choose your move!
                </p>
              )}
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
                  Play against computer!
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {chessMessage}
              </p>
            </div>

            {/* Chess Board */}
            <div className="grid grid-cols-8 gap-0 mb-4 border-4 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden">
              {chessBoard.map((row, i) =>
                row.map((piece, j) => {
                  const isLight = (i + j) % 2 === 0;
                  const isSelected = selectedSquare?.[0] === i && selectedSquare?.[1] === j;
                  return (
                    <motion.button
                      key={`${i}-${j}`}
                      onClick={() => handleChessSquareClick(i, j)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square flex items-center justify-center text-2xl ${
                        isLight
                          ? 'bg-amber-200 dark:bg-amber-700'
                          : 'bg-amber-600 dark:bg-amber-900'
                      } ${
                        isSelected
                          ? 'ring-4 ring-green-500'
                          : ''
                      } hover:brightness-110 transition-all`}
                    >
                      {piece}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Instructions & Reset */}
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Click a white piece, then click where to move it
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
      </div>
    </section>
  );
}
