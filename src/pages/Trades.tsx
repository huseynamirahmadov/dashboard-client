import { useState } from 'react';
import React from 'react';
import type { TradeData } from '../types/trade.types';
import TradeCard from '../components/TradeCard';

const TradesComponent: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([
    {
      id: 1,
      date: '2026-03-02',
      symbol: 'MNQH26',
      direction: 'Long',
      durationSeconds: 90,
      quantity: 2,
      risk: 200,
      riskReward: 1,
      range: 50,
      pnl: 200,
      fee: -1.48,
      status: 'TP',
      model: 'ARK',
      screenshots: ['screenshot1.png'],
    },
  ]);

  return <div className='flex items-center justify-between flex-wrap'>
    {
      trades?.map(item => {
        return <TradeCard item={item} />
      })
    }
  </div>;
};

export default TradesComponent;