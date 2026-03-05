import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { TradeData } from '../types/trade.types';
import Loading from './Loading';
import AddTrade from './AddTrade';

const TradeDetail: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  
  const [trade, setTrade] = useState<TradeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const API_BASE_URL = "https://dashboard-server-m86j.onrender.com";

  const fetchTradeDetails = () => {
    if (!tradeId) return;
    setLoading(true);
    axios
      .get<TradeData>(`${API_BASE_URL}/api/trades/${tradeId}`)
      .then(res => {
        setTrade(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTradeDetails();
  }, [tradeId]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${trade?.symbol}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/trades/${tradeId}`);
        alert("Trade deleted successfully ✅");
        navigate('/trades');
      } catch (err) {
        alert("Error deleting trade ❌");
      }
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
        // Base64 metodunda birbaşa PUT ilə JSON göndəririk
        await axios.put(`${API_BASE_URL}/api/trades/${id}`, data);
        fetchTradeDetails();
    } catch (error) {
        console.error("Update error:", error);
        alert("Yenilənmə zamanı xəta!");
    }
  };

  if (loading) return <Loading />;
  if (!trade) return <p className="text-center text-red-500 mt-10">Trade tapılmadı!</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Back to Trades
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-50 text-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-100 transition-all cursor-pointer"
          >
            Edit Trade
          </button>
          <button 
            onClick={handleDelete}
            className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-bold hover:bg-red-100 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-black text-slate-800">{trade.symbol} <span className="text-slate-400 font-normal">Analysis</span></h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Date</span> 
          <p className="text-slate-700 font-medium text-base">{trade.date?.slice(0, 10)}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Model</span> 
          <p className="text-slate-700 font-medium text-base">{trade.model}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Direction</span> 
          <p className={`font-bold text-base ${trade.direction === 'Long' ? 'text-emerald-600' : 'text-orange-600'}`}>{trade.direction}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">PNL</span> 
          <p className={`text-lg font-black ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${Math.round(trade.pnl)}
          </p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Fee</span> 
          <p className="text-slate-700 font-medium text-base">${Number(trade.fee).toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">RR</span> 
          <p className="text-slate-700 font-medium text-base">{trade.riskReward}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Status</span> 
          <p className="text-slate-700 font-medium text-base">{trade.status}</p>
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-slate-400 uppercase text-[10px] tracking-widest">Risk</span> 
          <p className="text-slate-700 font-medium text-base">${Math.round(trade.risk)}</p>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          Screenshots <span className="bg-slate-100 text-slate-500 text-xs py-1 px-2 rounded-full">{trade.screenshots?.length || 0}</span>
        </h3>
        
        {trade.screenshots && trade.screenshots.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {trade.screenshots.map((base64Data, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-white p-3">
                <img
                  src={base64Data}
                  alt={`Analysis ${index + 1}`}
                  className="w-full h-auto rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/1200x600?text=Image+Not+Found";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic">Bu trade üçün şəkil yüklənməyib.</p>
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