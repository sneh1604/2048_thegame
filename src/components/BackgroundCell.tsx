import { View, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../constants";

interface Props {
  size: number;
}

const BackgroundCell = ({ size }: Props) => {
  return (
    <View 
      style={[
        styles.container, 
        { width: size, height: size }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 6,
  },
});

export default BackgroundCell;