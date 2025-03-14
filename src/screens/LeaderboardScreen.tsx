import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { FirebaseService } from '../config/firebase';
import { LeaderboardEntry } from '../types';
import { useFocusEffect } from '@react-navigation/native';

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const leaderboardData = await FirebaseService.db.getLeaderboard();
      console.log('Leaderboard data:', leaderboardData);
      setLeaders(leaderboardData);
      setError(null);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch leaderboard when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  // Also fetch on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Players</Text>
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#776e65" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={leaders}
          keyExtractor={(item) => item.uid}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#776e65"]}
            />
          }
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rank, index < 3 && styles[`top${index + 1}` as keyof typeof styles]]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.name}>{item.displayName}</Text>
                <Text style={styles.score}>{item.highScore}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No scores yet. Be the first!</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#faf8ef',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#776e65',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbada0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#776e65',
    flex: 1,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#776e65',
    marginLeft: 8,
  },
  top1: {
    color: '#FFD700', // Gold
  },
  top2: {
    color: '#C0C0C0', // Silver
  },
  top3: {
    color: '#CD7F32', // Bronze
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e74c3c',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#776e65',
    marginTop: 32,
    fontStyle: 'italic',
  },
});

export default LeaderboardScreen;