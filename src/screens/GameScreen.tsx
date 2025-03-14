import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GameScreenNavigationProp } from '../../navigationTypes';
import Board from '../components/Board';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants';
import { useGame } from '../hooks/useGame';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import YouWinScreen from '../components/YouWinScreen';


const GameScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { board, panResponder, startGame, gameOver, scores, loading, error, hasWon, continueGame, continueAfterWin } = useGame();
  const [isRestarting, setIsRestarting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  const openWebsite = () => {
    Linking.openURL('https://sneh-shah.vercel.app/');
  };

  const handleRestartGame = () => {
    setIsRestarting(true);
    // Add a small delay to ensure the game over screen is hidden before starting a new game
    setTimeout(() => {
      startGame();
      setIsRestarting(false);
    }, 300);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#faf8ef" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={["#FAF8EF", "#F3E9D2"]} style={styles.container}>
          <View style={styles.header}>
            <Animatable.Text 
              animation="pulse" 
              iterationCount="infinite" 
              duration={2000} 
              style={styles.heading}
            >
              2048
            </Animatable.Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation.navigate('Leaderboard')}
              >
                <FontAwesome5 name="trophy" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          
          <Text style={styles.gameDescription}>
            Join the tiles, get to <Text style={styles.highlightText}>2048!</Text>
          </Text>

          <View style={styles.boardContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#776e65" />
                <Text style={styles.loadingText}>Starting game...</Text>
              </View>
            ) : (
              <Board board={board} panResponder={panResponder} />
            )}
          </View>

          <TouchableOpacity 
            style={styles.newGameButton}
            onPress={handleRestartGame}
            disabled={loading || isRestarting}
          >
            <Text style={styles.newGameText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerContainer}
            onPress={openWebsite}
          >
            <Text style={styles.footerText}>
              Created by <Text style={styles.creditName}>Sneh Shah</Text>
            </Text>
          </TouchableOpacity>

          {hasWon && !continueAfterWin && !gameOver && (
            <YouWinScreen 
              score={scores.currentScore}
              onContinue={continueGame}
              onRestart={handleRestartGame}
            />
          )}


          {gameOver && !isRestarting && (
            <Animatable.View 
              animation="fadeIn" 
              style={styles.gameOverContainer}
            >
              <View style={styles.gameOverModal}>
                <Text style={styles.gameOverText}>Game Over</Text>
                <Text style={styles.finalScoreText}>Score: {scores.currentScore}</Text>
                <TouchableOpacity 
                  style={styles.restartButton} 
                  onPress={handleRestartGame}
                  disabled={isRestarting}
                >
                  <Text style={styles.restartButtonText}>
                    {isRestarting ? "Starting..." : "Try Again"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf8ef',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  heading: {
    fontSize: 52,
    fontWeight: '900',
    color: theme.textPrimary,
    fontFamily: theme.fonts.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scoresWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: "#bbada0",
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  scoreValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  gameDescription: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.textPrimary,
    marginBottom: 20,
    fontFamily: theme.fonts.regular,
  },
  highlightText: {
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 300, // Ensure consistent height
  },
  loadingContainer: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#776e65',
  },
  newGameButton: {
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  newGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: 'transparent',
  },
  footerText: {
    fontSize: 12,
    color: '#776e65',
    fontFamily: theme.fonts.regular,
  },
  creditName: {
    fontWeight: 'bold',
    color: theme.textPrimary,
    fontFamily: theme.fonts.bold,
    textDecorationLine: 'underline',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gameOverModal: {
    width: '80%',
    backgroundColor: '#faf8ef',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 15,
    fontFamily: theme.fonts.bold,
  },
  finalScoreText: {
    fontSize: 20,
    color: theme.textPrimary,
    marginBottom: 20,
    fontFamily: theme.fonts.regular,
  },
  restartButton: {
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    elevation: 3,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});

export default GameScreen;