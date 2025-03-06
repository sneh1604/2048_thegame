import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useGame } from "../hooks/useGame";
import { BOARD_SIZE } from "../constants";
import Cell from "./Cell";
import BackgroundCell from "./BackgroundCell";
import GameOverScreen from "./GameOverScreen";

const { width } = Dimensions.get("window");
const GRID_PADDING = 10;
const CELL_MARGIN = 5;
const CELL_SIZE = (width - GRID_PADDING * 2) / BOARD_SIZE - CELL_MARGIN * 2;

const GameBoard = () => {
  const { board, startGame, logBoard, gameOver, panResponder } = useGame();

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    logBoard();
  }, [board]);

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => (
          <BackgroundCell key={index} />
        ))}
        {board.map((cell) => (
          <Cell key={cell.id} x={cell.x} y={cell.y} value={cell.value} />
        ))}
      </View>
      {gameOver && <GameOverScreen onTryAgain={startGame} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#faf8ef",
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    width: width - GRID_PADDING * 2,
    height: width - GRID_PADDING * 2,
    backgroundColor: "#bbada0",
    borderRadius: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: GRID_PADDING,
  },
});

export default GameBoard;
