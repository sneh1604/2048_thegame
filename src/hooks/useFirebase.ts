import { useState, useCallback } from 'react';
import { FirebaseService } from '../config/firebase';
import { UserProfile, LeaderboardEntry, FirebaseError } from '../types';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Initialize Firebase Services
const auth = getAuth();
const db = getFirestore();

export const useFirebase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FirebaseError | null>(null);

  const handleError = (error: any) => {
    console.error("Firebase Error:", error);
    setError({
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
    });
    setLoading(false);
  };

  /**
   * Sign in a user using email & password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  /**
   * Sign up new user and create Firestore profile
   */
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const newUserProfile: UserProfile = {
        uid: userId,
        displayName,
        email,
        highScore: 0,
        createdAt: new Date().toISOString(),
      };

      await FirebaseService.db.createUserProfile(userId, newUserProfile);
      setLoading(false);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  /**
   * Update user's high score if it's higher than the existing one
   */
  const updateScore = useCallback(async (userId: string, score: number) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User profile not found!");
      }

      const userData = userDoc.data();
      const currentHighScore = userData?.highScore || 0;
      
      if (score > currentHighScore) {
        await FirebaseService.db.updateUserScore(userId, score);
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  /**
   * Fetch leaderboard sorted by high scores
   */
  const getLeaderboard = useCallback(async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    setLoading(true);
    try {
      const leaderboardData = await FirebaseService.db.getLeaderboard(limit);
      setLoading(false);
      return leaderboardData;
    } catch (error) {
      handleError(error);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    signIn,
    signUp,
    updateScore,
    getLeaderboard,
    clearError: () => setError(null),
  };
};
