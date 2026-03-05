import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // DÜZƏLİŞ: Standart axios silindi
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

  useEffect(() => {
    // DÜZƏLİŞ: api instance istifadə olunur
    api.get('/trades')
      .then(res => {
        setTrades(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Calendar data fetch error:", err);
        setLoading(false);
      });
  }, []); // API_BASE_URL asılılığına ehtiyac yoxdur

  if (loading) return <Loading />;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

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
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-bold">←</button>
          <span className="font-black text-slate-700 min-w-35 text-center uppercase tracking-wider text-sm">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-bold">→</button>
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</div>
          ))}
        </div>

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
                  ${isToday ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}
                `}>
                  {format(day, 'd')}
                </div>

                {stats.count > 0 && isCurrentMonth && (
                  <div className={`mt-2 p-2 rounded-2xl text-center transition-transform group-hover:scale-105
                    ${stats.pnl > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'} border
                  `}>
                    <div className="text-[9px] font-black uppercase opacity-60">{stats.count} Trades</div>
                    <div className="text-xs md:text-sm font-black">
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