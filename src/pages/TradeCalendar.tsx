import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import type { TradeData } from '../types/trade.types';
import Loading from './Loading';

const TradeCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/trades`)
      .then(res => {
        setTrades(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Calendar data fetch error:", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  if (loading) return <Loading />;

  // Təqvim Hesablamaları
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Günlük PnL-i hesablamaq
  const getDayStats = (day: Date) => {
    const dayTrades = trades.filter(t => isSameDay(new Date(t.date), day));
    const totalPnL = dayTrades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);
    return {
      pnl: totalPnL,
      count: dayTrades.length
    };
  };

  const handleDayClick = (day: Date) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    navigate(`/trades?date=${formattedDate}`);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Trading Calendar</h1>
          <p className="text-slate-500 text-sm">Visualizing your daily performance</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={prevMonth} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-bold"
          >
            ←
          </button>
          <span className="font-black text-slate-700 min-w-[140px] text-center uppercase tracking-wider text-sm">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-bold"
          >
            →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
        {/* Header: Həftəlik Günlər */}
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const stats = getDayStats(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={idx} 
                onClick={() => isCurrentMonth && handleDayClick(day)}
                className={`h-32 md:h-40 border-r border-b border-slate-50 p-2 transition-all relative group
                  ${!isCurrentMonth ? 'bg-slate-50/50 opacity-20 cursor-default' : 'bg-white cursor-pointer hover:bg-slate-50/80'}
                `}
              >
                <div className={`text-xs font-bold mb-1 w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}
                `}>
                  {format(day, 'd')}
                </div>
                
                {stats.count > 0 && isCurrentMonth && (
                  <div className={`mt-2 p-2 rounded-2xl text-center transition-transform group-hover:scale-105
                    ${stats.pnl > 0 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-red-50 text-red-600 border border-red-100'
                    }
                  `}>
                    <div className="text-[9px] font-black uppercase opacity-60 tracking-tighter">
                      {stats.count} {stats.count === 1 ? 'Trade' : 'Trades'}
                    </div>
                    <div className="text-xs md:text-sm font-black">
                      {stats.pnl >= 0 ? `+$${stats.pnl.toFixed(2)}` : `-$${Math.abs(stats.pnl).toFixed(2)}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rəng Açıqlaması (Legend) */}
      <div className="flex gap-6 justify-center py-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Winning Day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Losing Day</span>
        </div>
      </div>
    </div>
  );
};

export default TradeCalendar;