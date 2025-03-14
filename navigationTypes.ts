import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Game: undefined;
  Leaderboard: undefined;
};

export type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
export type LeaderboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Leaderboard'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;