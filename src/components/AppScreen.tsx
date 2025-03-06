import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Board from "./Board";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants";

const AppScreen = () => {
  return (
    <LinearGradient colors={["#FAF8EF", "#EDE0C8"]} style={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>2048</Text>
        <Text style={styles.subtitle}>
          Join the tiles, get to <Text style={styles.bold}>2048!</Text>
        </Text>
      </View>

      {/* Game Board */}
      <Board />

      {/* Footer with Clickable Link */}
      <TouchableOpacity
        style={styles.footer}
        onPress={() => Linking.openURL("https://sneh-shah.vercel.app/")}
      >
        <Text style={styles.footerText}>Made by Sneh Shah ✨</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 64,
    fontWeight: "900",
    color: theme.textPrimary,
    fontFamily: theme.fonts.bold,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: "400",
    fontFamily: theme.fonts.regular,
  },
  bold: {
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: "700",
    fontFamily: theme.fonts.bold,
  },
  footer: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#bbada0",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export default  AppScreen;
