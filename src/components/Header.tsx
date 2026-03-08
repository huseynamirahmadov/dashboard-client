import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { btnPrimaryClass } from '../utils/styles';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/trades', label: 'Trades', icon: '◎' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

const Header: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <header className="bg-surface-900/80 backdrop-blur-lg border-b border-surface-800 sticky top-0 z-50">
      <nav className="flex items-center justify-between max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <NavLink to='/dashboard' className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-amber-brand flex items-center justify-center text-surface-950 font-extrabold text-sm">
            TD
          </div>
          <span className="text-lg font-bold text-surface-100 hidden sm:block tracking-tight">
            Trade<span className="text-amber-brand">Dash</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-surface-800/50 rounded-xl p-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-surface-700 text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-surface-800'
                }`
              }
            >
              <span className="text-xs opacity-70">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-brand/20 text-amber-brand flex items-center justify-center text-xs font-bold">
                  {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-surface-400">
                  {user?.username || user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="text-xs font-medium text-surface-500 hover:text-red-brand px-3 py-2 rounded-lg hover:bg-red-brand/10 transition-all cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to='/login'
                className="text-sm font-medium text-surface-400 hover:text-surface-200 px-4 py-2 rounded-lg hover:bg-surface-800 transition-all"
              >
                Log in
              </NavLink>
              <NavLink
                to='/register'
                className={`${btnPrimaryClass} !text-xs !py-2 !px-4`}
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-surface-400 hover:text-surface-200 p-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 animate-fade-in border-t border-surface-800">
          <div className="flex flex-col gap-1 pt-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive ? 'text-amber-brand bg-amber-brand/10' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'}`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;