import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  DocumentData
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Import from correct module

const firebaseConfig = {
  apiKey: "AIzaSyCgBn04UL4HPMNFd5q9mlTSDs_fJg1gRn8",
  authDomain: "two048-26212.firebaseapp.com",
  projectId: "two048-26212",
  storageBucket: "two048-26212.firebasestorage.app",
  messagingSenderId: "218312473285",
  appId: "1:218312473285:web:2b1930ae3020acd6d54eac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence, 
});

// Initialize Firestore
const db = getFirestore(app);

interface UserData {
  displayName: string;
  email: string;
  highScore: number;
  createdAt: string;
  lastUpdated?: string;
}

interface LeaderboardEntry extends DocumentData {
  uid: string;
  rank: number;
  displayName: string;
  highScore: number;
}

export const FirebaseService = {
  auth,
  db: {
    createUserProfile: async (uid: string, userData: UserData): Promise<void> => {
      try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          ...userData,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    },

    updateUserScore: async (uid: string, newScore: number): Promise<void> => {
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          highScore: newScore,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating user score:', error);
        throw error;
      }
    },

    getUserProfile: async (uid: string): Promise<DocumentData> => {
      try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        return userDoc;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },

    getLeaderboard: async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          orderBy('highScore', 'desc'),
          limit(limitCount)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc, index) => ({
          uid: doc.id,
          rank: index + 1,
          displayName: doc.data().displayName,
          highScore: doc.data().highScore
        })) as LeaderboardEntry[];
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }
    },

    initializeDatabase: async (): Promise<void> => {
      try {
        const usersRef = collection(db, 'users');
        await Promise.all([
          query(usersRef, orderBy('highScore', 'desc')),
          query(usersRef, orderBy('createdAt', 'desc'))
        ]);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
      }
    }
  }
};

export { db, auth };