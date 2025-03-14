import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface YouWinScreenProps {
  score: number;
  onContinue: () => void;
  onRestart: () => void;
}

const YouWinScreen: React.FC<YouWinScreenProps> = ({ score, onContinue, onRestart }) => {
  return (
    <Animatable.View 
      animation="fadeIn"
      style={styles.container}
    >
      <View style={styles.modal}>
        <Text style={styles.title}>You Win!</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.message}>You've reached 2048!</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Keep Playing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.restartButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 248, 239, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '80%',
    backgroundColor: '#edc22e',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#f65e3b',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginRight: 10,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#8f7a66',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default YouWinScreen;