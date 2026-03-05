import { useEffect, useState } from 'react';
import React from 'react';
import type { TradeData } from '../types/trade.types';
import TradeCard from '../components/TradeCard';
import axios from 'axios';
import Loading from './Loading';
import AddTrade from './AddTrade';

const TradesComponent: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeData | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/trades`);
      setTrades(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const deleteTrade = async (id: number) => {
    // Burada Azərbaycan dilində olan confirm və alert silsindi
    try {
      await axios.delete(`${API_BASE_URL}/api/trades/${id}`);
      fetchTrades();
    } catch (error) {
      console.error(error);
      alert("Error deleting trade!"); // Mesajı ingilis dilinə çevirdim ki, struktur pozulmasın
    }
  };

  const updateTrade = async (id: number, data: any) => {
    try {
      await axios.put(`${API_BASE_URL}/api/trades/${id}`, data);
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

  if (loading) return <Loading />;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-slate-800'>My Trades</h1>
        <button
          onClick={openCreateModal}
          className='cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg active:scale-95'
        >
          + New Trade
        </button>
      </div>

      <div className='flex items-center gap-6 flex-wrap'>
        {trades.map(item => (
          <TradeCard
            key={item.id}
            item={item}
            onDelete={() => deleteTrade(item.id)}
            onEdit={() => {
              setSelectedTrade(item);
              setIsModalOpen(true);
            }}
          />
        ))}
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