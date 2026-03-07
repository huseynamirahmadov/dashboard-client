import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { TradeData } from '../types/trade.types';
import Loading from './Loading';
import AddTrade from './AddTrade';
import { btnPrimaryClass, glassLightClass } from '../utils/styles';

const TradeDetail: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<TradeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchTradeDetails = () => {
    if (!tradeId) return;
    setLoading(true);
    api.get<TradeData>(`/trades/${tradeId}`)
      .then(res => { setTrade(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchTradeDetails(); }, [tradeId]);

  const handleDelete = async () => {
    if (window.confirm(`"${trade?.symbol}" trade-ni silmək istəyirsiniz?`)) {
      try {
        await api.delete(`/trades/${tradeId}`);
        navigate('/trades');
      } catch { alert("Silinmə zamanı xəta ❌"); }
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await api.put(`/trades/${id}`, data);
      fetchTradeDetails();
    } catch { alert("Yenilənmə zamanı xəta!"); }
  };

  if (loading) return <Loading />;
  if (!trade) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="text-4xl opacity-30">🔍</div>
      <p className="text-dark-300 font-medium">Trade tapılmadı</p>
      <button onClick={() => navigate('/trades')} className={btnPrimaryClass}>Trades-ə qayıt</button>
    </div>
  );

  const isProfitable = Number(trade.pnl) >= 0;

  const stats = [
    { label: 'Date', value: trade.date?.slice(0, 10) },
    { label: 'Model', value: trade.model },
    { label: 'Direction', value: trade.direction, color: trade.direction === 'Long' ? 'text-profit' : 'text-accent-orange' },
    { label: 'PNL', value: `$${Number(trade.pnl).toFixed(2)}`, color: isProfitable ? 'text-profit' : 'text-loss' },
    { label: 'Fee', value: `$${Number(trade.fee).toFixed(2)}` },
    { label: 'RR', value: trade.riskReward?.toString() || '-' },
    { label: 'Status', value: trade.status, color: trade.status === 'TP' ? 'text-profit' : trade.status === 'SL' ? 'text-loss' : 'text-dark-200' },
    { label: 'Risk', value: `$${Number(trade.risk).toFixed(2)}` },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Nav */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-dark-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer text-sm font-medium">
          ← Back to Trades
        </button>
        <div className="flex gap-2">
          <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider">
            Edit
          </button>
          <button onClick={handleDelete} className="text-[10px] font-bold text-loss bg-loss/10 hover:bg-loss/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider">
            Delete
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black
          ${isProfitable ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
          {trade.direction === 'Long' ? '↑' : '↓'}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{trade.symbol}</h1>
          <p className="text-dark-400 text-sm">{trade.model} · {trade.date?.slice(0, 10)}</p>
        </div>
        <div className={`ml-auto text-3xl font-black ${isProfitable ? 'text-profit' : 'text-loss'}`}>
          {isProfitable ? '+' : ''}${Number(trade.pnl).toFixed(2)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`${glassLightClass} rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4`}>
        {stats.map((stat, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[9px] font-bold text-dark-400 uppercase tracking-[0.15em] block">{stat.label}</span>
            <p className={`text-base font-bold ${stat.color || 'text-dark-200'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Screenshots */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          Screenshots
          <span className={`${glassLightClass} text-dark-400 text-xs py-1 px-2.5 rounded-lg font-bold`}>{trade.screenshots?.length || 0}</span>
        </h3>

        {trade.screenshots && trade.screenshots.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {trade.screenshots.map((base64Data, index) => (
              <div key={index} className={`${glassLightClass} rounded-2xl overflow-hidden p-3 group`}>
                <img
                  src={base64Data}
                  alt={`Analysis ${index + 1}`}
                  className="w-full h-auto rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`${glassLightClass} rounded-2xl p-16 text-center`}>
            <div className="text-3xl mb-3 opacity-20">📸</div>
            <p className="text-dark-400">Bu trade üçün şəkil yüklənməyib</p>
          </div>
        )}
      </div>

      <AddTrade
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editTrade={trade}
        onUpdate={handleUpdate}
        onSuccess={fetchTradeDetails}
      />
    </div>
  );
};

export default TradeDetail;