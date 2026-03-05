import React, { useEffect, useState } from 'react';
import api from '../api/axios'; // DÜZƏLİŞ: axios yerinə api instance
import PnLChart from '../components/PnLChart';
import Loading from './Loading';
import type { TradeData } from '../types/trade.types';

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // DÜZƏLİŞ: api.get istifadəsi
    api.get('/trades')
      .then(res => {
        setTrades(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  // --- STATİSTİKA HESABLAMALARI (Struktur qorundu) ---
  const totalTrades = trades.length;
  const totalPnL = trades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  const winRate = totalTrades > 0 ? (trades.filter(t => Number(t.pnl) > 0).length / totalTrades) * 100 : 0;
  const grossProfit = trades.filter(t => Number(t.pnl) > 0).reduce((acc, t) => acc + Number(t.pnl), 0);
  const grossLoss = Math.abs(trades.filter(t => Number(t.pnl) < 0).reduce((acc, t) => acc + Number(t.pnl), 0));
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99 : 0) : grossProfit / grossLoss;
  const consistencyScore = totalTrades > 0 ? Math.min(100, (winRate * 0.6) + (Math.min(profitFactor, 3) * 13.3)) : 0;

  const cardClass = "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden";
  const labelClass = "text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Performance Dashboard</h1>
        <p className="text-slate-500 text-sm">Advanced metrics and consistency tracking</p>
      </div>

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
          <p className="text-2xl font-black text-slate-800">{consistencyScore.toFixed(0)}%</p>
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all" style={{ width: `${consistencyScore}%` }}></div>
        </div>
        <div className={cardClass}>
          <span className={labelClass}>Profit Factor</span>
          <p className="text-2xl font-black text-indigo-600">{profitFactor.toFixed(2)}</p>
        </div>
      </div>

      <div className="w-full">
        {totalTrades > 0 ? (
          <PnLChart trades={trades} />
        ) : (
          <div className="p-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            No trade data available to visualize.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;