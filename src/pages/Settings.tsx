import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { glassLightClass, inputClass, gradientTextClass } from '../utils/styles';

const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          <span className={gradientTextClass}>Settings</span>
        </h1>
        <p className="text-dark-300 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className={`${glassLightClass} rounded-2xl p-6 space-y-6`}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="text-base">👤</span> Profile
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{user?.username || 'User'}</p>
            <p className="text-dark-400 text-sm">{user?.email || 'No email'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dark-700">
          <div>
            <label className="block text-[10px] font-bold text-dark-400 mb-1.5 uppercase tracking-[0.15em]">Username</label>
            <div className={`${inputClass} opacity-60 cursor-not-allowed`}>{user?.username || '-'}</div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-dark-400 mb-1.5 uppercase tracking-[0.15em]">Email</label>
            <div className={`${inputClass} opacity-60 cursor-not-allowed`}>{user?.email || '-'}</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${glassLightClass} rounded-2xl p-6 border border-loss/10`}>
        <h3 className="text-sm font-bold text-loss flex items-center gap-2 mb-4">
          <span className="text-base">⚠️</span> Danger Zone
        </h3>
        <p className="text-dark-400 text-sm mb-4">Hesabdan çıxış etmək bütün lokal məlumatları silir.</p>
        <button
          onClick={() => dispatch(logout())}
          className="text-[11px] font-bold text-loss bg-loss/10 hover:bg-loss/20 px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          Çıxış Et
        </button>
      </div>
    </div>
  )
}

export default Settings