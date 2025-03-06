import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const YouWinScreen = ({ onTryAgain }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>🎉 You Win! 🎉</Text>
        <Text style={styles.message}>Congratulations on reaching 2048!</Text>
        <TouchableOpacity style={styles.button} onPress={onTryAgain}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffcc00",
    padding: 24,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  message: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default YouWinScreen;
