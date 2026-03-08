import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { cardClass, inputClass, labelClass } from '../utils/styles';

const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-surface-100 tracking-tight">
          <span className="text-amber-brand">Settings</span>
        </h1>
        <p className="text-surface-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className={`${cardClass} p-6 space-y-6`}>
        <h3 className="text-sm font-bold text-surface-200 flex items-center gap-2">
          <span className="text-base">👤</span> Profile
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-brand flex items-center justify-center text-2xl font-extrabold text-surface-950">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-surface-100 font-bold text-lg">{user?.username || 'User'}</p>
            <p className="text-surface-600 text-sm">{user?.email || 'No email'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-surface-800">
          <div>
            <label className={labelClass}>Username</label>
            <div className={`${inputClass} opacity-50 cursor-not-allowed`}>{user?.username || '-'}</div>
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <div className={`${inputClass} opacity-50 cursor-not-allowed`}>{user?.email || '-'}</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${cardClass} p-6 !border-red-brand/15`}>
        <h3 className="text-sm font-bold text-red-brand flex items-center gap-2 mb-4">
          <span className="text-base">⚠️</span> Danger Zone
        </h3>
        <p className="text-surface-600 text-sm mb-4">Logging out removes all local session data.</p>
        <button
          onClick={() => dispatch(logout())}
          className="text-xs font-bold text-red-brand bg-red-brand/10 hover:bg-red-brand/20 px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Settings