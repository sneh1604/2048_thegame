import { useCallback, useState, useEffect } from "react";
import { BOARD_SIZE } from "../constants";
import { PanResponder, GestureResponderEvent, PanResponderGestureState } from "react-native";
import { useAuth } from '../contexts/AuthContext';
import { FirebaseService } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameHookReturn, BoardCell, Direction, GameState } from '../types/index';

export const useGame = (): GameHookReturn => {
  const [board, setBoard] = useState<BoardCell[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentScore: 0,
    highScore: 0
  });
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [continueAfterWin, setContinueAfterWin] = useState(false);

  const generateId = () => Math.floor(Math.random() * 1000000).toString();

  const getEmptyPositions = useCallback(() => {
    const empty = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (!board.some(cell => cell.x === x && cell.y === y)) {
          empty.push({ x, y });
        }
      }
    }
    return empty;
  }, [board]);

  // Check if there are possible moves left
  const hasPossibleMoves = useCallback(() => {
    // If there are empty cells, moves are possible
    if (getEmptyPositions().length > 0) return true;

    // Check for possible merges horizontally
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 1; y++) {
        const current = board.find(cell => cell.x === x && cell.y === y);
        const next = board.find(cell => cell.x === x && cell.y === y + 1);
        if (current && next && current.value === next.value) {
          return true;
        }
      }
    }

    // Check for possible merges vertically
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 1; x++) {
        const current = board.find(cell => cell.x === x && cell.y === y);
        const next = board.find(cell => cell.x === x + 1 && cell.y === y);
        if (current && next && current.value === next.value) {
          return true;
        }
      }
    }

    // No empty cells and no possible merges
    return false;
  }, [board, getEmptyPositions]);

  // Check for 2048 tile
  const checkWinCondition = useCallback(() => {
    if (hasWon) return false; // Already won, don't trigger again
    
    const has2048 = board.some(cell => cell.value >= 2048);
    if (has2048 && !hasWon) {
      setHasWon(true);
      return true;
    }
    return false;
  }, [board, hasWon]);

  // Check for game over state
  const checkGameOver = useCallback(() => {
    const isGameOver = !hasPossibleMoves();
    
    if (isGameOver && !gameOver) {
      console.log("GAME OVER DETECTED!");
      setGameOver(true);
      
      // Save high score if needed
      if (score > highScore && user) {
        FirebaseService.db.updateUserScore(user.uid, score)
          .catch(err => console.error('Error updating high score:', err));
      }
    }
    
    return isGameOver;
  }, [hasPossibleMoves, gameOver, score, highScore, user]);

  const spawnCell = useCallback(() => {
    const emptyPositions = getEmptyPositions();
    if (emptyPositions.length === 0) return;
    
    const { x, y } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const newCell = { 
      id: generateId(), 
      x, 
      y, 
      value: Math.random() < 0.9 ? 2 : 4 
    };
    
    setBoard(prev => [...prev, newCell]);
    
    // Check for 2048 and game over after adding a cell
    setTimeout(() => {
      checkWinCondition();
      checkGameOver();
    }, 100);
  }, [getEmptyPositions, checkGameOver, checkWinCondition]);

  const updateScore = useCallback(async (newScore: number) => {
    setScore(newScore);
    
    // Update local high score
    if (newScore > highScore) {
      setHighScore(newScore);
      await AsyncStorage.setItem('highScore', newScore.toString());
      
      // Update Firebase high score
      if (user) {
        try {
          await FirebaseService.db.updateUserScore(user.uid, newScore);
          console.log('High score updated in Firebase:', newScore);
        } catch (err) {
          console.error('Failed to update high score in Firebase:', err);
        }
      }
    }
  }, [user, highScore]);

  const moveCells = useCallback((direction: Direction) => {
    let moved = false;
    let newCells: BoardCell[] = [];
    let scoreIncrease = 0;
  
    // Get cells in a line and merge them
    const mergeLine = (line: (BoardCell | null)[]): (BoardCell | null)[] => {
      // First compress the line (remove gaps)
      let compressed = line.filter(Boolean);
      
      // Then merge adjacent same values
      for (let i = 0; i < compressed.length - 1; i++) {
        if (compressed[i] && compressed[i + 1] && 
            typeof compressed[i]?.value === 'number' && 
            compressed[i]?.value === compressed[i + 1]?.value) {
          compressed[i]!.value *= 2;
          scoreIncrease += compressed[i]!.value;
          compressed.splice(i + 1, 1);
          moved = true;
        }
      }
  
      // Fill with nulls to maintain line length
      while (compressed.length < BOARD_SIZE) {
        compressed.push(null);
      }
  
      return compressed;
    };
  
    // Process each row/column
    for (let i = 0; i < BOARD_SIZE; i++) {
      let line: BoardCell[] = [];
  
      // Get cells in current row/column
      if (direction === 'left' || direction === 'right') {
        // For horizontal movement, get cells in the same row
        line = board.filter(cell => cell.x === i)
          .sort((a, b) => a.y - b.y);
      } else {
        // For vertical movement, get cells in the same column
        line = board.filter(cell => cell.y === i)
          .sort((a, b) => a.x - b.x);
      }
  
      // Create array with nulls for empty spaces
      const fullLine: (BoardCell | null)[] = Array(BOARD_SIZE).fill(null);
      line.forEach(cell => {
        if (direction === 'left' || direction === 'right') {
          fullLine[cell.y] = cell;
        } else {
          fullLine[cell.x] = cell;
        }
      });
  
      // Reverse line for right/down movements
      if (direction === 'right' || direction === 'down') {
        fullLine.reverse();
      }
  
      // Merge the line
      const mergedLine = mergeLine(fullLine);
  
      // Reverse back for right/down movements
      if (direction === 'right' || direction === 'down') {
        mergedLine.reverse();
      }
  
      // Update positions and add to new cells
      mergedLine.forEach((cell, index) => {
        if (cell) {
          const newPos = direction === 'left' || direction === 'right'
            ? { x: i, y: index }
            : { x: index, y: i };
  
          if (cell.x !== newPos.x || cell.y !== newPos.y) {
            moved = true;
          }
  
          cell.x = newPos.x;
          cell.y = newPos.y;
          newCells.push(cell);
        }
      });
    }
  
    if (moved) {
      setBoard(newCells);
      if (scoreIncrease > 0) {
        updateScore(score + scoreIncrease);
      }
    }
  
    return moved;
  }, [board, score, updateScore]);

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    const moved = moveCells(direction);
    if (moved) {
      setTimeout(() => {
        spawnCell();
        
        // Check win and game over after adding a new cell and settling
        setTimeout(() => {
          checkGameOver();
        }, 100);
      }, 100);
    } else {
      // If no move was made, still check for game over
      checkGameOver();
    }
  }, [moveCells, gameOver, spawnCell, checkGameOver]);

  const handleGesture = useCallback((gestureState: PanResponderGestureState) => {
    const { dx, dy } = gestureState;
    const dragDistance = 50;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > dragDistance) {
        move(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > dragDistance) {
        move(dy > 0 ? 'down' : 'up');
      }
    }
  }, [move]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      handleGesture(gestureState);
    },
  });

  const startGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setBoard([]);
      setGameOver(false);
      setHasWon(false);
      setContinueAfterWin(false);
      setScore(0);
      
      // Fetch high score from Firebase if user is logged in
      if (user) {
        try {
          const userDoc = await FirebaseService.db.getUserProfile(user.uid);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.highScore) {
              setHighScore(userData.highScore);
              await AsyncStorage.setItem('highScore', userData.highScore.toString());
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
      
      // Spawn initial cells
      setTimeout(() => {
        setBoard([]);
        setTimeout(() => {
          spawnCell();
          setTimeout(() => {
            spawnCell();
            setLoading(false);
          }, 100);
        }, 100);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      setLoading(false);
    }
  }, [spawnCell, user]);

  // Function to continue playing after reaching 2048
  const continueGame = useCallback(() => {
    setContinueAfterWin(true);
  }, []);

  // Load high score on mount
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        // First try from local storage
        const savedScore = await AsyncStorage.getItem('highScore');
        const localHighScore = savedScore ? parseInt(savedScore, 10) : 0;
        
        // Then try from Firebase if user is logged in
        if (user) {
          try {
            const userDoc = await FirebaseService.db.getUserProfile(user.uid);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.highScore && userData.highScore > localHighScore) {
                setHighScore(userData.highScore);
                await AsyncStorage.setItem('highScore', userData.highScore.toString());
              } else if (localHighScore > 0) {
                // Update Firebase if local is higher
                await FirebaseService.db.updateUserScore(user.uid, localHighScore);
              }
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        } else if (localHighScore > 0) {
          setHighScore(localHighScore);
        }
      } catch (err) {
        console.error('Error loading high score:', err);
      }
    };

    loadHighScore();
  }, [user]);

  // Add periodic checking for game over
  useEffect(() => {
    if (board.length > 0 && !loading) {
      const timer = setInterval(() => {
        checkGameOver();
      }, 500);
      
      return () => clearInterval(timer);
    }
  }, [board, loading, checkGameOver]);

  return {
    board,
    move,
    panResponder,
    startGame,
    gameOver,
    scores: { currentScore: score, highScore },
    loading,
    error,
    hasWon,
    continueAfterWin,
    continueGame
  };
};