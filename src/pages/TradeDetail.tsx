import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { TradeData } from '../types/trade.types';
import Loading from './Loading';
import AddTrade from './AddTrade';
import { btnPrimaryClass, cardClass } from '../utils/styles';

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
      <div className="text-4xl opacity-20">🔍</div>
      <p className="text-surface-500 font-medium">Trade tapılmadı</p>
      <button onClick={() => navigate('/trades')} className={btnPrimaryClass}>Trades-ə qayıt</button>
    </div>
  );

  const isProfitable = Number(trade.pnl) >= 0;

  const stats = [
    { label: 'Date', value: trade.date?.slice(0, 10) },
    { label: 'Model', value: trade.model },
    { label: 'Direction', value: trade.direction, color: trade.direction === 'Long' ? 'text-profit' : 'text-amber-brand' },
    { label: 'PNL', value: `$${Number(trade.pnl).toFixed(2)}`, color: isProfitable ? 'text-profit' : 'text-loss' },
    { label: 'Fee', value: `$${Number(trade.fee).toFixed(2)}` },
    { label: 'RR', value: trade.riskReward?.toString() || '-' },
    { label: 'Status', value: trade.status, color: trade.status === 'TP' ? 'text-profit' : trade.status === 'SL' ? 'text-loss' : 'text-surface-400' },
    { label: 'Risk', value: `$${Number(trade.risk).toFixed(2)}` },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Nav */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-surface-500 hover:text-surface-200 flex items-center gap-2 transition-colors cursor-pointer text-sm font-medium">
          ← Back to Trades
        </button>
        <div className="flex gap-2">
          <button onClick={() => setIsEditModalOpen(true)} className="text-xs font-bold text-amber-brand bg-amber-brand/10 hover:bg-amber-brand/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider">
            Edit
          </button>
          <button onClick={handleDelete} className="text-xs font-bold text-loss bg-loss/10 hover:bg-loss/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider">
            Delete
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold
          ${isProfitable ? 'bg-profit/15 text-profit' : 'bg-loss/15 text-loss'}`}>
          {trade.direction === 'Long' ? '↑' : '↓'}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-surface-100 tracking-tight">{trade.symbol}</h1>
          <p className="text-surface-600 text-sm">{trade.model} · {trade.date?.slice(0, 10)}</p>
        </div>
        <div className={`ml-auto text-3xl font-extrabold ${isProfitable ? 'text-profit' : 'text-loss'}`}>
          {isProfitable ? '+' : ''}${Number(trade.pnl).toFixed(2)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`${cardClass} p-6 grid grid-cols-2 md:grid-cols-4 gap-5`}>
        {stats.map((stat, i) => (
          <div key={i} className="space-y-1.5">
            <span className="text-[10px] font-semibold text-surface-600 uppercase tracking-wider block">{stat.label}</span>
            <p className={`text-base font-bold ${stat.color || 'text-surface-300'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Screenshots */}
      <div>
        <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
          Screenshots
          <span className="bg-surface-800 text-surface-500 text-xs py-1 px-2.5 rounded-lg font-bold">{trade.screenshots?.length || 0}</span>
        </h3>

        {trade.screenshots && trade.screenshots.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {trade.screenshots.map((base64Data, index) => (
              <div key={index} className={`${cardClass} overflow-hidden p-3`}>
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
          <div className={`${cardClass} p-16 text-center`}>
            <div className="text-3xl mb-3 opacity-15">📸</div>
            <p className="text-surface-600">Bu trade üçün şəkil yüklənməyib</p>
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