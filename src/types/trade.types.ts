export type TradeDirection = 'Long' | 'Short';
export type TradeStatus = 'TP' | 'SL' | 'BE' | 'MA';

export interface TradeData {
  id: number;
  symbol: string;
  date: string;
  direction: TradeDirection;
  durationSeconds: number;
  quantity: number;
  risk: number;
  riskReward: number;
  range: number;
  pnl: number;
  fee: number;
  status: TradeStatus;
  model: string;
  screenshots: string[];
}

export interface TradeCardProps {
  item: TradeData;
}