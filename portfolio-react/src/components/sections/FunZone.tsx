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
        // Fallback to localStorage
        const stored = localStorage.getItem('portfolioVisitorCount');
        const count = stored ? parseInt(stored) : 1000;
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
    
    // Simple AI: random move
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

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
        </div>
      </div>
    </section>
  );
}
