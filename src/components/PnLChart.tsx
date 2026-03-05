import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TradeData } from '../types/trade.types';

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

    // Gradientin keçid nöqtəsini (0 nöqtəsini) hesablamaq üçün
    const maxPnL = Math.max(...data.map((d) => d.cumulativePnL));
    const minPnL = Math.min(...data.map((d) => d.cumulativePnL));

    // 0 nöqtəsinin qrafikdəki faizini tapırıq
    const off = maxPnL > 0 && minPnL < 0
        ? (maxPnL / (maxPnL - minPnL)) * 100
        : maxPnL > 0 ? 100 : 0;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[450px] w-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Equity Growth Analysis</h3>
                <div className="flex gap-4 text-[10px] font-bold">
                    <span className="text-emerald-500 uppercase">● Profit Zone</span>
                    <span className="text-red-500 uppercase">● Loss Zone</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={`${off}%`} stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset={`${off}%`} stopColor="#ef4444" stopOpacity={0.4} />
                        </linearGradient>
                        {/* Xəttin özü üçün kəskin keçidli gradient */}
                        <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={`${off}%`} stopColor="#10b981" stopOpacity={1} />
                            <stop offset={`${off}%`} stopColor="#ef4444" stopOpacity={1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />

                    <XAxis
                        dataKey="date"
                        stroke="#cbd5e1"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        stroke="#cbd5e1"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                    />

                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Equity'] as any}
                    />

                    <Area
                        type="monotone"
                        dataKey="cumulativePnL"
                        stroke="url(#lineColor)" // Xəttin rəngi gradientlə
                        strokeWidth={4}
                        fill="url(#splitColor)"   // Arxa fonun rəngi gradientlə
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PnLChart;