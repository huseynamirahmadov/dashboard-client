import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PnLChart from '../components/PnLChart';
import Loading from './Loading';
import type { TradeData } from '../types/trade.types';
import { glassLightClass, gradientTextClass } from '../utils/styles';

const StatCard: React.FC<{
  label: string;
  value: string;
  accent?: string;
  icon: string;
  delay?: number;
  bar?: number;
}> = ({ label, value, accent = 'text-white', icon, delay = 0, bar }) => (
  <div
    className={`transition-all duration-300 hover:-translate-y-1 ${glassLightClass} rounded-2xl p-5 relative overflow-hidden group`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-[10px] font-bold text-dark-300 uppercase tracking-[0.15em]">{label}</span>
      <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform transition-transform">{icon}</span>
    </div>
    <p className={`text-2xl font-black ${accent} tracking-tight`}>{value}</p>
    {bar !== undefined && (
      <div className="mt-3 h-1 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(bar, 100)}%` }}
        ></div>
      </div>
    )}
    {/* Decorative gradient corner */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 rounded-full blur-2xl group-hover:from-accent-blue/10 group-hover:to-accent-purple/10 transition-all"></div>
  </div>
);

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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

  const totalTrades = trades.length;
  const totalPnL = trades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  const winCount = trades.filter(t => Number(t.pnl) > 0).length;
  const lossCount = trades.filter(t => Number(t.pnl) < 0).length;
  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
  const grossProfit = trades.filter(t => Number(t.pnl) > 0).reduce((acc, t) => acc + Number(t.pnl), 0);
  const grossLoss = Math.abs(trades.filter(t => Number(t.pnl) < 0).reduce((acc, t) => acc + Number(t.pnl), 0));
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99 : 0) : grossProfit / grossLoss;
  const consistencyScore = totalTrades > 0 ? Math.min(100, (winRate * 0.6) + (Math.min(profitFactor, 3) * 13.3)) : 0;
  const avgWin = winCount > 0 ? grossProfit / winCount : 0;
  const avgLoss = lossCount > 0 ? grossLoss / lossCount : 0;
  const totalFees = trades.reduce((acc, t) => acc + (Number(t.fee) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Performance <span className={gradientTextClass}>Dashboard</span>
          </h1>
          <p className="text-dark-300 text-sm mt-1">Advanced metrics and consistency tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${totalPnL >= 0 ? 'bg-profit' : 'bg-loss'} animate-pulse`}></div>
          <span className="text-xs font-medium text-dark-300">{totalTrades} total trades</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Net P&L"
          value={`$${totalPnL.toFixed(2)}`}
          accent={totalPnL >= 0 ? 'text-profit' : 'text-loss'}
          icon="💰"
          delay={0}
        />
        <StatCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          accent="text-white"
          icon="🎯"
          delay={100}
          bar={winRate}
        />
        <StatCard
          label="Consistency"
          value={`${consistencyScore.toFixed(0)}%`}
          accent="text-white"
          icon="📐"
          delay={200}
          bar={consistencyScore}
        />
        <StatCard
          label="Profit Factor"
          value={profitFactor.toFixed(2)}
          accent="text-accent-blue"
          icon="⚡"
          delay={300}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Wins', value: winCount.toString(), color: 'text-profit' },
          { label: 'Losses', value: lossCount.toString(), color: 'text-loss' },
          { label: 'Avg Win', value: `$${avgWin.toFixed(2)}`, color: 'text-profit' },
          { label: 'Avg Loss', value: `$${avgLoss.toFixed(2)}`, color: 'text-loss' },
          { label: 'Gross Profit', value: `$${grossProfit.toFixed(2)}`, color: 'text-profit' },
          { label: 'Total Fees', value: `$${totalFees.toFixed(2)}`, color: 'text-accent-orange' },
        ].map((stat, i) => (
          <div key={i} className={`${glassLightClass} rounded-xl p-3 text-center`}>
            <span className="text-[9px] font-bold text-dark-400 uppercase tracking-wider block mb-1">{stat.label}</span>
            <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div>
        {totalTrades > 0 ? (
          <PnLChart trades={trades} />
        ) : (
          <div className={`${glassLightClass} rounded-2xl p-16 text-center`}>
            <div className="text-4xl mb-4 opacity-30">📊</div>
            <p className="text-dark-400 font-medium">No trade data available to visualize</p>
            <p className="text-dark-500 text-sm mt-1">Start adding trades to see your equity curve</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;