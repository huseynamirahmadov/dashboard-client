import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TradeData } from '../types/trade.types';
import { glassClass, glassLightClass } from '../utils/styles';

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
                <div className={`${glassClass} rounded-xl px-4 py-3 shadow-2xl border border-dark-600`}>
                    <p className="text-[10px] font-bold text-dark-300 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-lg font-black ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
                        ${Number(value).toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${glassLightClass} rounded-2xl p-6 sm:p-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                    <h3 className="text-sm font-bold text-white">Equity Growth</h3>
                    <p className="text-[10px] text-dark-400 uppercase tracking-wider mt-0.5">Cumulative P&L over time</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-profit"></span>
                        <span className="text-dark-300">Profit</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-loss"></span>
                        <span className="text-dark-300">Loss</span>
                    </span>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={`${off}%`} stopColor="#00e676" stopOpacity={0.15} />
                                <stop offset={`${off}%`} stopColor="#ff1744" stopOpacity={0.15} />
                            </linearGradient>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={`${off}%`} stopColor="#00e676" stopOpacity={1} />
                                <stop offset={`${off}%`} stopColor="#ff1744" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />

                        <XAxis
                            dataKey="date"
                            stroke="#3a4570"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            fontWeight={600}
                        />

                        <YAxis
                            stroke="#3a4570"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                            fontWeight={600}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="cumulativePnL"
                            stroke="url(#lineColor)"
                            strokeWidth={3}
                            fill="url(#splitColor)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PnLChart;