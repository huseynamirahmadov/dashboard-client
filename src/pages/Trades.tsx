import { useEffect, useState } from 'react';
import React from 'react';
import type { TradeData } from '../types/trade.types';
import TradeCard from '../components/TradeCard';
import axios from 'axios';

const TradesComponent: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);

  useEffect(() => {
    axios('http://127.0.0.1:8000/api/trades')
      .then(res => setTrades(res.data))
      .catch(err => console.log(err))
  },[])
  console.log(trades)

  return <div className='flex items-center justify-between flex-wrap'>
    {
      trades?.map(item => {
        return <TradeCard key={item.id} item={item} />
      })
    }
  </div>;
};

export default TradesComponent;