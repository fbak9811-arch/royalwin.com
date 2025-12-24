
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'rejected';
export type TransactionType = 'deposit' | 'withdrawal' | 'win' | 'loss' | 'bet' | 'bonus_credit';

export interface User {
  id: string;
  mobile: string;
  username: string;
  balance: number;
  bonusBalance: number;
  kycStatus: 'unverified' | 'pending' | 'verified';
  referralCode: string;
  isNewUser?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  gameName?: string;
  timestamp: number;
  referenceId?: string; // Often used as UTR for deposits
  utr?: string;
  upiId?: string;
  walletType?: 'main' | 'bonus';
}

export interface Game {
  id: string;
  name: string;
  category: 'chance' | 'skill' | 'cards' | 'slots';
  icon: string;
  path: string;
  popular?: boolean;
}

export enum GameView {
  HOME = 'home',
  WALLET = 'wallet',
  ACTIVITY = 'activity',
  PROFILE = 'profile',
  LEADERBOARD = 'leaderboard',
  CHICKEN_ROAD = 'game_chicken',
  COLOUR_PREDICTION = 'game_colour',
  ADMIN = 'admin',
  AUTH = 'auth'
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalWinnings: number;
  avatarSeed: string;
}
