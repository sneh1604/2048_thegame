import { PanResponderInstance } from "react-native";
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface UserData {
  displayName: string;
  email: string;
  highScore: number;
  createdAt: string;
  lastUpdated?: string;
}

export interface LeaderboardEntry {
  uid: string;
  rank: number;
  displayName: string;
  highScore: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  highScore: number;
  createdAt: string;
  lastUpdated?: string;
}
  

  export type GameState = {
    currentScore: number;
    highScore: number;
  };
  

  export interface FirebaseError {
    code: string;
    message: string;
  }

  export interface BoardCell {
    id: string;
    value: number;
    x: number;
    y: number;
  } 
  
  export type Direction = 'up' | 'down' | 'left' | 'right';
  
  // Update GameHookReturn interface
export interface GameHookReturn {
  board: BoardCell[];
  move: (direction: Direction) => void;
  panResponder: any;
  startGame: () => Promise<void>;
  gameOver: boolean;
  scores: GameState;
  loading: boolean;
  error: string | null;
  hasWon: boolean;
  continueAfterWin: boolean;
  continueGame: () => void;
}

export interface LeaderboardHookReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export interface AuthHookReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}


export interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}



export interface AuthProviderProps {
  children: React.ReactNode;
}

