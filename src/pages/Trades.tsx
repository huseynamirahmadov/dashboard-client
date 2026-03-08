import { useEffect, useState } from 'react';
import React from 'react';
import type { TradeData } from '../types/trade.types';
import TradeCard from '../components/TradeCard';
import api from '../api/axios';
import Loading from './Loading';
import AddTrade from './AddTrade';
import { useLocation, useNavigate } from 'react-router-dom';
import { btnPrimaryClass, cardClass } from '../utils/styles';

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
    <div className='space-y-6 animate-fade-in-up'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-extrabold text-surface-100 tracking-tight'>
            My <span className="text-amber-brand">Trades</span>
          </h1>
          {filterDate && (
            <p className='text-sm text-surface-500 mt-1'>
              Filtering: <span className='font-bold text-amber-brand'>{filterDate}</span>
            </p>
          )}
        </div>
        <button
          onClick={openCreateModal}
          className={btnPrimaryClass}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Trade
        </button>
      </div>

      {/* Filter Banner */}
      {filterDate && (
        <div className={`flex items-center justify-between ${cardClass} p-4`}>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-amber-brand animate-pulse"></span>
            <span className="text-sm font-medium text-surface-400">
              Showing {displayedTrades.length} trades for {filterDate}
            </span>
          </div>
          <button
            onClick={() => navigate('/trades')}
            className="text-xs font-bold text-amber-brand hover:bg-surface-800 px-3 py-2 rounded-lg transition-all cursor-pointer"
          >
            Clear ✕
          </button>
        </div>
      )}

      {/* Trade List */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
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
          <div className={`col-span-full ${cardClass} p-16 text-center`}>
            <div className="text-4xl mb-4 opacity-20">📊</div>
            <p className="text-surface-500 font-medium">No trades found</p>
            <p className="text-surface-600 text-sm mt-1">Click "New Trade" to add your first trade</p>
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