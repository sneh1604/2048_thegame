import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from "react-native";
import Animated from 'react-native-reanimated';
import { useGame } from "../hooks/useGame";
import { BOARD_SIZE, MARGIN, BOARD_PADDING } from "../constants";
import Cell from "./Cell";
import BackgroundCell from "./BackgroundCell";
import GameOverScreen from "./GameOverScreen";
import ScoreBoard from "./ScoreBoard";
import { useNetInfo } from "@react-native-community/netinfo";
import { BoardCell } from "../types";

const { width } = Dimensions.get("window");
const BOARD_WIDTH = Math.min(width - 32, 400);
const CELL_SIZE = (BOARD_WIDTH - (BOARD_PADDING * 2) - ((BOARD_SIZE - 1) * MARGIN)) / BOARD_SIZE;

interface BoardProps {
  board: BoardCell[];
  panResponder: any;
}

const Board: React.FC<BoardProps> = ({ board: initialBoard, panResponder: initialPanResponder }) => {
  const { 
    board, 
    startGame,
    gameOver, 
    panResponder, 
    scores, 
    loading, 
    error 
  } = useGame();
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const netInfo = useNetInfo();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await startGame();
      } catch (error) {
        console.error('Game initialization error:', error);
      } finally {
        setIsFirstLoad(false);
      }
    };

    if (isFirstLoad || (netInfo.isConnected && error)) {
      initializeGame();
    }
  }, [netInfo.isConnected, retryAttempt, isFirstLoad]);

  if (loading && isFirstLoad) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#776e65" />
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScoreBoard 
        currentScore={scores.currentScore}
        highScore={scores.highScore}
        isOffline={!netInfo.isConnected}
      />

      <View style={styles.gameContainer}>
        <Animated.View {...panResponder.panHandlers} style={styles.grid}>
          <View style={styles.backgroundGrid}>
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => (
              <BackgroundCell 
                key={`bg-${index}`}
                size={CELL_SIZE}
              />
            ))}
          </View>
          <View style={[StyleSheet.absoluteFill, styles.cellContainer]}>
            {board.map((cell) => (
              <Cell 
                key={cell.id} 
                x={cell.x} 
                y={cell.y} 
                value={cell.value}
                size={CELL_SIZE}
              />
            ))}
          </View>
        </Animated.View>

        {gameOver && (
      <GameOverScreen
        score={scores.currentScore}
        highScore={scores.highScore}
        onRestart={startGame}
      />
    )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  gameContainer: {
    width: BOARD_WIDTH,
    aspectRatio: 1,
    marginTop: 20,
  },
  grid: {
    width: '100%',
    height: '100%',
    backgroundColor: "#bbada0",
    borderRadius: 6,
    padding: BOARD_PADDING,
  },
  backgroundGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: MARGIN,
  },
  cellContainer: {
    padding: BOARD_PADDING,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#776e65',
  },
});

export default Board;