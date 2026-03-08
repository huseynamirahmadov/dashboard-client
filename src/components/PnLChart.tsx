import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TradeData } from '../types/trade.types';
import { cardClass } from '../utils/styles';

interface Props {
    trades: TradeData[];
}

const PnLChart: React.FC<Props> = ({ trades }) => {
    const data = [...trades]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce((acc: any[], trade, index) => {
            const prevPnL = index > 0 ? acc[index - 1].cumulativePnL : 0;
            acc.push({
                date: trade.date.slice(5, 10),
                cumulativePnL: prevPnL + (Number(trade.pnl) || 0)
            });
            return acc;
        }, []);

    const maxPnL = Math.max(...data.map((d) => d.cumulativePnL));
    const minPnL = Math.min(...data.map((d) => d.cumulativePnL));
    const off = maxPnL > 0 && minPnL < 0
        ? (maxPnL / (maxPnL - minPnL)) * 100
        : maxPnL > 0 ? 100 : 0;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            return (
                <div className="bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 shadow-xl">
                    <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-lg font-extrabold ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
                        ${Number(value).toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${cardClass} p-6 sm:p-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                    <h3 className="text-base font-bold text-surface-100">Equity Growth</h3>
                    <p className="text-xs text-surface-600 mt-0.5">Cumulative P&L over time</p>
                </div>
                <div className="flex gap-5 text-xs font-semibold">
                    <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-profit"></span>
                        <span className="text-surface-500">Profit</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-loss"></span>
                        <span className="text-surface-500">Loss</span>
                    </span>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={`${off}%`} stopColor="#22c55e" stopOpacity={0.12} />
                                <stop offset={`${off}%`} stopColor="#ef4444" stopOpacity={0.12} />
                            </linearGradient>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={`${off}%`} stopColor="#22c55e" stopOpacity={1} />
                                <stop offset={`${off}%`} stopColor="#ef4444" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />

                        <XAxis
                            dataKey="date"
                            stroke="#57534e"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            fontWeight={500}
                        />

                        <YAxis
                            stroke="#57534e"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                            fontWeight={500}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="cumulativePnL"
                            stroke="url(#lineColor)"
                            strokeWidth={2.5}
                            fill="url(#splitColor)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PnLChart;