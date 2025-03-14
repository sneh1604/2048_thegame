import { Text, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  ZoomOut,
  ZoomIn,
} from "react-native-reanimated";
import {
  ANIMATION_DURATION,
  CELL_COLORS,
  CELL_NUMBER_COLORS,
  MARGIN,
} from "../constants";

interface Props {
  x: number;
  y: number;
  value: number;
  size: number;
}

const Cell = ({ x, y, value, size }: Props) => {
  const prevValue = useRef(value);
  const scaleUp = useSharedValue(false);

  const getFontSize = (value: number) => {
    const length = value.toString().length;
    if (length <= 2) return size * 0.45;
    if (length <= 3) return size * 0.35;
    return size * 0.25;
  };

  const getCellPosition = (coordinate: number) => {
    return coordinate * (size + MARGIN);
  };

  const top = useSharedValue(getCellPosition(x));
  const left = useSharedValue(getCellPosition(y));

  useEffect(() => {
    top.value = getCellPosition(x);
    left.value = getCellPosition(y);
  }, [x, y]);

  const animatedStyles = useAnimatedStyle(() => ({
    top: withTiming(top.value, { duration: ANIMATION_DURATION }),
    left: withTiming(left.value, { duration: ANIMATION_DURATION }),
    transform: [{
      scale: withTiming(scaleUp.value ? 1.1 : 1, { duration: ANIMATION_DURATION }, 
        (finished) => {
          if (finished) {
            scaleUp.value = false;
          }
        })
    }],
  }));

  if (prevValue.current !== value) {
    scaleUp.value = true;
    prevValue.current = value;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: CELL_COLORS[value],
        },
        animatedStyles,
      ]}
      entering={ZoomIn.duration(ANIMATION_DURATION)}
      exiting={ZoomOut.duration(ANIMATION_DURATION)}
    >
      <Text
        style={[
          styles.number,
          {
            color: CELL_NUMBER_COLORS[value],
            fontSize: getFontSize(value),
            fontFamily: 'ClearSans-Bold',
          },
        ]}
      >
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  number: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Cell;