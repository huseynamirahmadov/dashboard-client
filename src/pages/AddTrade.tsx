import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { TradeData } from '../types/trade.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTrade?: TradeData | null;
  onUpdate?: (id: number, data: any) => void;
}

const AddTrade: React.FC<Props> = ({ isOpen, onClose, onSuccess, editTrade, onUpdate }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

  const inputStyle = "w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm cursor-pointer transition-all";
  const labelStyle = "block text-xs font-bold text-slate-400 mb-1 uppercase";

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

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
      // Seçilmiş şəkilləri Base64-ə çeviririk
      const base64Images = await Promise.all(
        fileInputs
          .filter((file): file is File => file !== null)
          .map(file => toBase64(file))
      );

      // Göndəriləcək data (JSON formatında)
      const payload = {
        ...formData,
        screenshots: base64Images.length > 0 ? base64Images : (editTrade?.screenshots || [])
      };

      if (editTrade && onUpdate) {
        await onUpdate(editTrade.id, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/trades`, payload);
      }

      alert(editTrade ? "Trade updated ✅" : "Trade created ✅");
      onSuccess?.();
      onClose();
      setFormData(initialState);
      setFileInputs([null]);
    } catch (error) {
      console.error(error);
      alert("Xəta baş verdi ❌");
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl relative">
        <div className="sticky top-0 bg-white px-8 py-5 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-black text-slate-800">{editTrade ? "Edit Trade" : "Register New Trade"}</h2>
          <button onClick={onClose} className="text-3xl font-light hover:text-red-500 cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelStyle}>Symbol</label>
              <input name="symbol" value={formData.symbol} onChange={handleChange} className={inputStyle} placeholder="e.g. NQH26" required />
            </div>
            <div>
              <label className={labelStyle}>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Direction</label>
              <select name="direction" value={formData.direction} onChange={handleChange} className={inputStyle}>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div>
              <label className={labelStyle}>Duration (sec)</label>
              <input type="number" name="durationSeconds" value={formData.durationSeconds} onChange={handleChange} className={inputStyle} placeholder="Duration (sec)" />
            </div>
            <div>
              <label className={labelStyle}>Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={inputStyle} placeholder="Quantity" />
            </div>
            <div>
              <label className={labelStyle}>Risk ($)</label>
              <input type="number" name="risk" value={formData.risk} onChange={handleChange} className={inputStyle} placeholder="Risk ($)" />
            </div>
            <div>
              <label className={labelStyle}>Risk Reward</label>
              <input type="number" name="riskReward" value={formData.riskReward} onChange={handleChange} className={inputStyle} placeholder="Risk Reward" />
            </div>
            <div>
              <label className={labelStyle}>Range</label>
              <input type="number" name="range" value={formData.range} onChange={handleChange} className={inputStyle} placeholder="Range" />
            </div>
            <div>
              <label className={labelStyle}>PNL ($)</label>
              <input type="number" name="pnl" value={formData.pnl} onChange={handleChange} className={inputStyle} placeholder="PNL ($)" />
            </div>
            <div>
              <label className={labelStyle}>Fee ($)</label>
              <input type="number" step="0.01" name="fee" value={formData.fee} onChange={handleChange} className={inputStyle} placeholder="Fee ($)" />
            </div>
            <div>
              <label className={labelStyle}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                <option value="TP">TP</option>
                <option value="SL">SL</option>
                <option value="BE">BE</option>
                <option value="MA">MA</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Model</label>
              <select name="model" value={formData.model} onChange={handleChange} className={inputStyle}>
                <option value="ARK">ARK</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-slate-700 uppercase text-sm tracking-widest">Screenshots Analysis</h3>
              <button type="button" onClick={addFileInput} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-md transition-all active:scale-95">
                + Add Image Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileInputs.map((_, index) => (
                <div key={index} className="cursor-pointer flex flex-col p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:border-indigo-300 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 uppercase mb-2">Slot #{index + 1}</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 cursor-pointer transition-all">Cancel</button>
            <button type="submit" className="flex-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black cursor-pointer shadow-xl transition-all active:scale-[0.98]">
              {editTrade ? "Update Trade Data" : "Save Trade Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrade;