import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PnLChart from '../components/PnLChart';
import Loading from './Loading';
import type { TradeData } from '../types/trade.types';

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/trades`)
      .then(res => {
        setTrades(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  // --- STATİSTİKA HESABLAMALARI ---
  const totalTrades = trades.length;
  const totalPnL = trades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  const winRate = totalTrades > 0 ? (trades.filter(t => Number(t.pnl) > 0).length / totalTrades) * 100 : 0;

  const grossProfit = trades.filter(t => Number(t.pnl) > 0).reduce((acc, t) => acc + Number(t.pnl), 0);
  const grossLoss = Math.abs(trades.filter(t => Number(t.pnl) < 0).reduce((acc, t) => acc + Number(t.pnl), 0));
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

  const bestTrade = totalTrades > 0 ? Math.max(...trades.map(t => Number(t.pnl) || 0)) : 0;
  const worstTrade = totalTrades > 0 ? Math.min(...trades.map(t => Number(t.pnl) || 0)) : 0;
  const avgDurationMin = totalTrades > 0
    ? (trades.reduce((acc, t) => acc + (Number(t.durationSeconds) || 0), 0) / totalTrades / 60).toFixed(1)
    : "0";

  // Consistency Hesablaması
  const consistencyScore = totalTrades > 0
    ? Math.min(100, (winRate * 0.6) + (Math.min(profitFactor, 3) * 13.3))
    : 0;

  const getStreak = () => {
    let streak = 0;
    const sorted = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (let t of sorted) {
      if ((Number(t.pnl) || 0) > 0) streak++;
      else break;
    }
    return streak;
  };
  const currentStreak = getStreak();

  const cardClass = "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden";
  const labelClass = "text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Performance Dashboard</h1>
          <p className="text-slate-500 text-sm">Advanced trading consistency and duration metrics</p>
        </div>
        {currentStreak >= 3 && (
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-bold animate-bounce">
            🔥 {currentStreak} WIN STREAK
          </div>
        )}
      </div>

      {/* 1-ci Sira: Esas Metrikalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={cardClass}>
          <span className={labelClass}>Total Net P&L</span>
          <p className={`text-2xl font-black ${totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${totalPnL.toFixed(2)}
          </p>
        </div>
        <div className={cardClass}>
          <span className={labelClass}>Win Rate</span>
          <p className="text-2xl font-black text-slate-800">{winRate.toFixed(1)}%</p>
        </div>
        <div className={cardClass}>
          <span className={labelClass}>Consistency Score</span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-800">{consistencyScore.toFixed(0)}%</p>
            <span className={`text-[10px] font-bold ${consistencyScore > 50 ? 'text-emerald-500' : 'text-orange-500'}`}>
              {consistencyScore > 70 ? 'STABLE' : 'EVOLVING'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-slate-50 w-full">
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${consistencyScore}%` }}></div>
          </div>
        </div>
        <div className={cardClass}>
          <span className={labelClass}>Profit Factor</span>
          <p className="text-2xl font-black text-indigo-600">{Number(profitFactor).toFixed(2)}</p>
        </div>
      </div>

      {/* 2-ci Sira: Detallar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardClass} border-l-4 border-l-emerald-500`}>
          <span className={labelClass}>Best Trade</span>
          <p className="text-xl font-black text-emerald-600">+${bestTrade.toFixed(2)}</p>
        </div>
        <div className={`${cardClass} border-l-4 border-l-red-500`}>
          <span className={labelClass}>Worst Trade</span>
          <p className="text-xl font-black text-red-600">${worstTrade.toFixed(2)}</p>
        </div>
        <div className={cardClass}>
          <span className={labelClass}>Avg Duration</span>
          <p className="text-xl font-black text-slate-800">{avgDurationMin} min</p>
        </div>
      </div>

      {/* Qrafik */}
      <div className="w-full">
        {totalTrades > 0 ? <PnLChart trades={trades} /> : <div className="p-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">Trade datası gözlənilir...</div>}
      </div>
    </div>
  );
};

export default Dashboard;