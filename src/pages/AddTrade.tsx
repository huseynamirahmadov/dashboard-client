import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { TradeData } from '../types/trade.types';
import { inputClass, btnPrimaryClass, glassClass, labelClass } from '../utils/styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTrade?: TradeData | null;
  onUpdate?: (id: number, data: any) => void;
}

const AddTrade: React.FC<Props> = ({ isOpen, onClose, onSuccess, editTrade, onUpdate }) => {
  const initialState = {
    symbol: '', date: new Date().toISOString().split('T')[0], direction: 'Long',
    durationSeconds: '', quantity: '', risk: '', riskReward: '', range: '',
    pnl: '', fee: '', status: 'TP', model: 'ARK'
  };

  const [formData, setFormData] = useState(initialState);
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([null]);

  useEffect(() => {
    if (editTrade) {
      setFormData({
        symbol: editTrade.symbol || '', date: editTrade.date?.slice(0, 10) || '',
        direction: editTrade.direction || 'Long', durationSeconds: editTrade.durationSeconds?.toString() || '',
        quantity: editTrade.quantity?.toString() || '', risk: editTrade.risk?.toString() || '',
        riskReward: editTrade.riskReward?.toString() || '', range: editTrade.range?.toString() || '',
        pnl: editTrade.pnl?.toString() || '', fee: editTrade.fee?.toString() || '',
        status: editTrade.status || 'TP', model: editTrade.model || 'ARK'
      });
    } else {
      setFormData(initialState);
    }
    setFileInputs([null]);
  }, [editTrade, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = [...fileInputs];
      newFiles[index] = e.target.files[0];
      setFileInputs(newFiles);
    }
  };

  const addFileInput = () => setFileInputs([...fileInputs, null]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    try {
      const base64Images = await Promise.all(
        fileInputs.filter((file): file is File => file !== null).map(file => toBase64(file))
      );
      const payload = {
        ...formData,
        screenshots: base64Images.length > 0 ? base64Images : (editTrade?.screenshots || [])
      };

      if (editTrade && onUpdate) {
        await onUpdate(editTrade.id, payload);
      } else {
        await api.post('/trades', payload);
      }

      alert(editTrade ? "Trade updated ✅" : "Trade created ✅");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Xəta baş verdi!");
    }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className={`animate-fade-in-up ${glassClass} w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl border border-dark-600`}>
        {/* Header */}
        <div className={`sticky top-0 ${glassClass} px-8 py-5 border-b border-dark-600 flex justify-between items-center z-10`}>
          <h2 className="text-xl font-black text-white">{editTrade ? "Edit Trade" : "New Trade"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-loss/20 hover:text-loss flex items-center justify-center transition-all cursor-pointer text-dark-300">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Primary Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Symbol</label>
              <input name="symbol" value={formData.symbol} onChange={handleChange} className={inputClass} required placeholder="BTC/USDT" />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Direction</label>
              <select name="direction" value={formData.direction} onChange={handleChange} className={inputClass}>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
          </div>

          {/* Numeric Fields */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'PNL ($)', name: 'pnl', step: '0.01' },
              { label: 'Risk ($)', name: 'risk', step: '0.01' },
              { label: 'RR', name: 'riskReward', step: '0.1' },
              { label: 'Fee ($)', name: 'fee', step: '0.01' },
              { label: 'Quantity', name: 'quantity', step: '0.00001' },
              { label: 'Duration (s)', name: 'durationSeconds', step: '1' },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <input type="number" step={field.step} name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className={inputClass} placeholder="0" />
              </div>
            ))}
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="TP">TP</option>
                <option value="SL">SL</option>
                <option value="BE">BE</option>
                <option value="Open">Open</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <input name="model" value={formData.model} onChange={handleChange} className={inputClass} placeholder="ARK" />
            </div>
          </div>

          {/* Screenshots */}
          <div className="pt-4 border-t border-dark-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Screenshots</h3>
              <button type="button" onClick={addFileInput} className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 px-4 py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider">
                + Add Image
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileInputs.map((file, index) => (
                <div key={index}>
                  <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-dark-600 rounded-xl cursor-pointer hover:border-accent-blue/40 hover:bg-dark-800/50 transition-all">
                    <div className="flex flex-col items-center gap-2 text-center px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-medium text-dark-400">
                        {file ? file.name : "Click to upload"}
                      </span>
                    </div>
                    <input type="file" onChange={(e) => handleFileChange(index, e)} className="hidden" accept="image/*" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-dark-700 hover:bg-dark-600 text-dark-200 py-4 rounded-xl font-bold transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" className={`${btnPrimaryClass} flex-[2]`}>
              {editTrade ? 'Update Trade' : 'Save Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrade;