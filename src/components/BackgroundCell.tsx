import { View, StyleSheet } from "react-native";
import React from "react";
import { MARGIN, theme } from "../constants";
import { useCellSize } from "../hooks";

const BackgroundCell = () => {
  const cellWidth = useCellSize();

  return (
    <View style={[styles.container, { width: cellWidth, height: cellWidth }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundTertiary,
    margin: MARGIN,
    borderRadius: 5,
  },
});

export default BackgroundCell;