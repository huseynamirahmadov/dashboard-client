import { useEffect, useState } from 'react';
import React from 'react';
import type { TradeData } from '../types/trade.types';
import TradeCard from '../components/TradeCard';
import api from '../api/axios'; // DÜZƏLİŞ: axios yerinə api instance
import Loading from './Loading';
import AddTrade from './AddTrade';
import { useLocation, useNavigate } from 'react-router-dom';

const TradesComponent: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeData | null>(null);

  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const filterDate = queryParams.get('date');

  const fetchTrades = async () => {
    try {
      setLoading(true);
      // DÜZƏLİŞ: api instance istifadə olunur, /api/trades artıq baseURL-də var
      const res = await api.get('/trades');
      setTrades(res.data);
    } catch (err) {
      console.error("Trades fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const deleteTrade = async (id: number) => {
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      await api.delete(`/trades/${id}`);
      fetchTrades();
    } catch (error) {
      console.error(error);
      alert("Error deleting trade!");
    }
  };

  const updateTrade = async (id: number, data: any) => {
    try {
      await api.put(`/trades/${id}`, data);
      setIsModalOpen(false);
      setSelectedTrade(null);
      fetchTrades();
    } catch (error) {
      console.error(error);
      alert("Update error!");
    }
  };

  const openCreateModal = () => {
    setSelectedTrade(null);
    setIsModalOpen(true);
  };

  const displayedTrades = filterDate
    ? trades.filter(t => t.date === filterDate)
    : trades;

  if (loading) return <Loading />;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>My Trades</h1>
          {filterDate && (
            <p className='text-sm text-slate-500 mt-1'>
              Filtering for date: <span className='font-bold text-indigo-600'>{filterDate}</span>
            </p>
          )}
        </div>
        <button
          onClick={openCreateModal}
          className='cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg active:scale-95'
        >
          + New Trade
        </button>
      </div>

      {filterDate && (
        <div className="mb-6 flex items-center justify-between bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-indigo-700 text-sm font-medium">
              Showing {displayedTrades.length} trades for {filterDate}
            </span>
          </div>
          <button
            onClick={() => navigate('/trades')}
            className="text-xs font-bold text-indigo-600 hover:bg-white px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-indigo-100 cursor-pointer"
          >
            Clear Filter ✕
          </button>
        </div>
      )}

      <div className='flex items-center gap-6 flex-wrap'>
        {displayedTrades.length > 0 ? (
          displayedTrades.map(item => (
            <TradeCard
              key={item.id}
              item={item}
              onDelete={() => deleteTrade(item.id)}
              onEdit={() => {
                setSelectedTrade(item);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="w-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No trades found for this period.</p>
          </div>
        )}
      </div>

      <AddTrade
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrade(null);
        }}
        onSuccess={fetchTrades}
        editTrade={selectedTrade}
        onUpdate={updateTrade}
      />
    </div>
  );
};

export default TradesComponent;