import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants';

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
  isOffline?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentScore, highScore, isOffline }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{currentScore}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>BEST</Text>
        <Text style={styles.scoreValue}>{highScore}</Text>
      </View>
      {isOffline && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  scoreContainer: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  offlineIndicator: {
    backgroundColor: '#f59563',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    top: -20,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ScoreBoard;