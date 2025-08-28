export interface Token {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  price: number;
  change24h: number;
  sparklineData: number[];
}

export interface WatchlistItem extends Token {
  holdings: number;
  value: number;
}

export interface Portfolio {
  total: number;
  tokens: WatchlistItem[];
  lastUpdated: Date;
}

export interface WalletState {
  isConnected: boolean;
  address?: string;
}