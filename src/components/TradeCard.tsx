import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { TradeCardProps } from '../types/trade.types'

const TradeCard: React.FC<TradeCardProps> = ({ item, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kartın daxilinə keçid etməsinin qarşısını alır
    if (confirm(`Are you sure you want to delete trade ${item.symbol}?`)) {
      onDelete?.();
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kartın daxilinə keçid etməsinin qarşısını alır
    onEdit?.();
  }

  return (
    <div 
      onClick={() => navigate(`/trades/${item.id}`)} // Detal səhifəsinə yönləndirmə
      className='border p-5 rounded-xl shadow hover:shadow-lg transition-all bg-white cursor-pointer group border-slate-100 hover:border-indigo-200 min-w-75'
    >
      <div className='flex justify-between items-start mb-3'>
        <div className='space-y-1 text-sm text-slate-600'>
          <div className='font-bold text-slate-800 text-lg mb-2'>
            {item.symbol} <span className='text-xs font-normal text-slate-400'>| {item.model}</span>
          </div>
          <div><span className='font-semibold'>Date:</span> {item.date?.slice(0,10)}</div>
          <div><span className='font-semibold'>Direction:</span> {item.direction}</div>
          <div>
            <span className='font-semibold'>PNL:</span> 
            <span className={item.pnl >= 0 ? "text-green-600" : "text-red-600"}>
              ${Math.round(item.pnl)}
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <button onClick={handleEdit} className='cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium p-1 transition-colors'>Edit</button>
          <button onClick={handleDelete} className='cursor-pointer text-red-600 hover:text-red-800 text-sm font-medium p-1 transition-colors'>Delete</button>
        </div>
      </div>

      {/* Şəkillərin Base64 olaraq göstərilməsi */}
      {item.screenshots && item.screenshots.length > 0 && (
        <div className='grid grid-cols-2 gap-2 mt-4'>
          {item.screenshots.slice(0, 2).map((base64Data, index) => (
            <img
              key={index}
              src={base64Data} // Artıq URL deyil, birbaşa Base64 string istifadə olunur
              alt={`Preview ${index + 1}`}
              className='w-full h-20 object-cover rounded-lg border border-slate-100'
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TradeCard;