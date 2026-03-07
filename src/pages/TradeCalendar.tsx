import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import type { TradeData } from '../types/trade.types';
import Loading from './Loading';
import { glassLightClass, gradientTextClass } from '../utils/styles';

const TradeCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trades')
      .then(res => { setTrades(res.data); setLoading(false); })
      .catch(err => { console.error("Calendar data fetch error:", err); setLoading(false); });
  }, []);

  if (loading) return <Loading />;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayStats = (day: Date) => {
    const dayTrades = trades.filter(t => isSameDay(new Date(t.date), day));
    const totalPnL = dayTrades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);
    return { pnl: totalPnL, count: dayTrades.length };
  };

  const handleDayClick = (day: Date) => {
    navigate(`/trades?date=${format(day, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Trading <span className={gradientTextClass}>Calendar</span>
          </h1>
          <p className="text-dark-300 text-sm mt-1">Visualizing your daily performance</p>
        </div>

        <div className={`flex items-center gap-1 ${glassLightClass} p-1.5 rounded-2xl`}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl hover:bg-dark-600 text-dark-300 hover:text-white transition-all flex items-center justify-center cursor-pointer font-bold">←</button>
          <span className="font-bold text-white min-w-[150px] text-center text-sm uppercase tracking-wider">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl hover:bg-dark-600 text-dark-300 hover:text-white transition-all flex items-center justify-center cursor-pointer font-bold">→</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`${glassLightClass} rounded-2xl overflow-hidden`}>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-dark-600">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[9px] font-bold text-dark-400 uppercase tracking-[0.2em]">{day}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const stats = getDayStats(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                onClick={() => isCurrentMonth && handleDayClick(day)}
                className={`h-28 sm:h-32 md:h-36 border-r border-b border-dark-700/50 p-2 transition-all relative group
                  ${!isCurrentMonth ? 'opacity-15 cursor-default' : 'cursor-pointer hover:bg-dark-700/30'}
                `}
              >
                <div className={`text-xs font-bold mb-1 w-7 h-7 flex items-center justify-center rounded-lg transition-all
                  ${isToday
                    ? 'bg-gradient-to-br from-accent-blue to-accent-purple text-white shadow-lg'
                    : 'text-dark-400 group-hover:text-dark-200'}
                `}>
                  {format(day, 'd')}
                </div>

                {stats.count > 0 && isCurrentMonth && (
                  <div className={`mt-1 p-2 rounded-xl text-center transition-transform group-hover:scale-[1.03]
                    ${stats.pnl > 0
                      ? 'bg-profit/10 border border-profit/10'
                      : 'bg-loss/10 border border-loss/10'}
                  `}>
                    <div className="text-[8px] font-bold uppercase opacity-60 text-dark-200">{stats.count} trades</div>
                    <div className={`text-xs sm:text-sm font-black ${stats.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {stats.pnl >= 0 ? `+$${stats.pnl.toFixed(0)}` : `-$${Math.abs(stats.pnl).toFixed(0)}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TradeCalendar;