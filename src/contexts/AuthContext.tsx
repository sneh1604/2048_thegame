import { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseService } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthError, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AuthContextType, UserProfile } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        const unsubscribe = FirebaseService.auth.onAuthStateChanged(async (currentUser) => {
          try {
            if (currentUser) {
              const userProfile: UserProfile = {
                uid: currentUser.uid,
                displayName: currentUser.displayName || 'Anonymous',
                email: currentUser.email || '',
                highScore: 0,
                createdAt: new Date().toISOString(),
              };

              await FirebaseService.db.createUserProfile(currentUser.uid, userProfile);
              setUser(currentUser);
              await AsyncStorage.setItem('user', JSON.stringify(currentUser));
            } else {
              setUser(null);
              await AsyncStorage.removeItem('user');
            }
          } catch (err) {
            console.error('Error updating user profile:', err);
            setError('Failed to update user profile');
          } finally {
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleAuthError = (error: unknown) => {
    const authError = error as AuthError;
    let errorMessage = 'An unexpected error occurred';

    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
    }

    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(FirebaseService.auth, email, password);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseService.auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        const userProfile: UserProfile = {
          uid: userCredential.user.uid,
          displayName,
          email,
          highScore: 0,
          createdAt: new Date().toISOString(),
        };

        await FirebaseService.db.createUserProfile(userCredential.user.uid, userProfile);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await FirebaseService.auth.signOut();
      await AsyncStorage.removeItem('user');
    } catch (err) {
      setError('Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};