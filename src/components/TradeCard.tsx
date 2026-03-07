import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { TradeCardProps } from '../types/trade.types'
import { glassLightClass } from '../utils/styles';

const TradeCard: React.FC<TradeCardProps> = ({ item, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isProfitable = Number(item.pnl) >= 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${item.symbol}" trade-ni silmək istəyirsiniz?`)) {
      onDelete?.();
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  }

  return (
    <div
      onClick={() => navigate(`/trades/${item.id}`)}
      className={`${glassLightClass} rounded-2xl p-5 cursor-pointer group hover:border-accent-blue/20 transition-all duration-300 hover:-translate-y-1 min-w-[280px] flex-1`}
    >
      {/* Header */}
      <div className='flex justify-between items-start mb-4'>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black
            ${isProfitable
              ? 'bg-profit/10 text-profit'
              : 'bg-loss/10 text-loss'}`}>
            {item.direction === 'Long' ? '↑' : '↓'}
          </div>
          <div>
            <div className='font-bold text-white text-base tracking-tight'>{item.symbol}</div>
            <div className='text-[10px] text-dark-400 font-medium uppercase tracking-wider'>{item.model} · {item.date?.slice(0, 10)}</div>
          </div>
        </div>

        <div className={`text-lg font-black ${isProfitable ? 'text-profit' : 'text-loss'}`}>
          {isProfitable ? '+' : ''}${Number(item.pnl).toFixed(2)}
        </div>
      </div>

      {/* Stats Row */}
      <div className='grid grid-cols-3 gap-2 mb-4'>
        <div className="bg-dark-800/50 rounded-lg p-2 text-center">
          <span className='text-[8px] font-bold text-dark-400 uppercase tracking-wider block'>Direction</span>
          <span className={`text-xs font-bold ${item.direction === 'Long' ? 'text-profit' : 'text-accent-orange'}`}>
            {item.direction}
          </span>
        </div>
        <div className="bg-dark-800/50 rounded-lg p-2 text-center">
          <span className='text-[8px] font-bold text-dark-400 uppercase tracking-wider block'>RR</span>
          <span className='text-xs font-bold text-white'>{item.riskReward || '-'}</span>
        </div>
        <div className="bg-dark-800/50 rounded-lg p-2 text-center">
          <span className='text-[8px] font-bold text-dark-400 uppercase tracking-wider block'>Status</span>
          <span className={`text-xs font-bold ${item.status === 'TP' ? 'text-profit' : item.status === 'SL' ? 'text-loss' : 'text-dark-200'}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        <button
          onClick={handleEdit}
          className='flex-1 text-[10px] font-bold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider'
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className='flex-1 text-[10px] font-bold text-loss bg-loss/10 hover:bg-loss/20 py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider'
        >
          Delete
        </button>
      </div>

      {/* Screenshots Preview */}
      {item.screenshots && item.screenshots.length > 0 && (
        <div className='grid grid-cols-2 gap-2 mt-3'>
          {item.screenshots.slice(0, 2).map((base64Data, index) => (
            <img
              key={index}
              src={base64Data}
              alt={`Preview ${index + 1}`}
              className='w-full h-16 object-cover rounded-lg border border-dark-600 opacity-60 group-hover:opacity-100 transition-opacity'
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TradeCard;