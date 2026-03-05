import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { TradeData } from '../types/trade.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTrade?: TradeData | null;
  onUpdate?: (id: number, data: any) => void;
}

const AddTrade: React.FC<Props> = ({ isOpen, onClose, onSuccess, editTrade, onUpdate }) => {
  const initialState = {
    symbol: '',
    date: new Date().toISOString().split('T')[0],
    direction: 'Long',
    durationSeconds: '',
    quantity: '',
    risk: '',
    riskReward: '',
    range: '',
    pnl: '',
    fee: '',
    status: 'TP',
    model: 'ARK'
  };

  const [formData, setFormData] = useState(initialState);
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([null]);

  useEffect(() => {
    if (editTrade) {
      setFormData({
        symbol: editTrade.symbol || '',
        date: editTrade.date?.slice(0, 10) || '',
        direction: editTrade.direction || 'Long',
        durationSeconds: editTrade.durationSeconds?.toString() || '',
        quantity: editTrade.quantity?.toString() || '',
        risk: editTrade.risk?.toString() || '',
        riskReward: editTrade.riskReward?.toString() || '',
        range: editTrade.range?.toString() || '',
        pnl: editTrade.pnl?.toString() || '',
        fee: editTrade.fee?.toString() || '',
        status: editTrade.status || 'TP',
        model: editTrade.model || 'ARK'
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
        fileInputs
          .filter((file): file is File => file !== null)
          .map(file => toBase64(file))
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
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white px-8 py-5 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-black text-slate-800">{editTrade ? "Edit Trade" : "New Trade"}</h2>
          <button onClick={onClose} className="text-3xl font-light hover:text-red-500 cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Symbol</label>
              <input name="symbol" value={formData.symbol} onChange={handleChange} className="w-full border p-2.5 rounded-lg" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Direction</label>
              <select name="direction" value={formData.direction} onChange={handleChange} className="w-full border p-2.5 rounded-lg">
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">PNL ($)</label>
              <input type="number" step="0.01" name="pnl" value={formData.pnl} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Risk ($)</label>
              <input type="number" step="0.01" name="risk" value={formData.risk} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">RR</label>
              <input type="number" step="0.1" name="riskReward" value={formData.riskReward} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Fee ($)</label>
              <input type="number" step="0.01" name="fee" value={formData.fee} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Quantity</label>
              <input type="number" step="0.00001" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Duration (s)</label>
              <input type="number" name="durationSeconds" value={formData.durationSeconds} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2.5 rounded-lg">
                <option value="TP">TP</option>
                <option value="SL">SL</option>
                <option value="BE">BE</option>
                <option value="Open">Open</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Model</label>
              <input name="model" value={formData.model} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-slate-700 text-sm">Screenshots</h3>
              <button type="button" onClick={addFileInput} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs">
                + Add Image
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileInputs.map((_, index) => (
                <input key={index} type="file" onChange={(e) => handleFileChange(index, e)} className="text-xs" accept="image/*" />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Cancel</button>
            <button type="submit" className="flex-2 bg-slate-900 text-white py-4 rounded-xl font-bold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrade;