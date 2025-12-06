export interface Market {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  probability: number; // 0 to 100
  volume: number;
  category: string;
  endDate: string;
  history: number[]; // Array of prices for the chart
  isAiGenerated: boolean;
  type: 'global' | 'social'; // 'global' = public/news, 'social' = friends
  creator?: string; // name of creator for social markets
  aiInsight?: string; // Short snippet for card
  bullCase?: string[]; // List of arguments for YES
  bearCase?: string[]; // List of arguments for NO
}

export interface PortfolioItem {
  marketId: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
  balance: number;
  portfolio: PortfolioItem[];
  winRate?: number;
  pnlDay?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export enum ViewState {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  FRIENDS = 'FRIENDS',
  MARKET_DETAIL = 'MARKET_DETAIL',
  PORTFOLIO = 'PORTFOLIO',
  CREATE = 'CREATE',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}