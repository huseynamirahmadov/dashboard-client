import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { glassClass, btnPrimaryClass, gradientTextClass, glassLightClass } from '../utils/styles';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/trades', label: 'Trades', icon: '📈' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const Header: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <header className={`${glassClass} sticky top-0 z-50`}>
      <nav className="flex items-center justify-between max-w-[1600px] mx-auto px-6 py-3">
        {/* Logo */}
        <NavLink to='/dashboard' className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-105 transition-transform">
            TD
          </div>
          <span className="text-lg font-bold text-white hidden sm:block">
            Trade<span className={gradientTextClass}>Dash</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-gradient-to-r after:from-accent-blue after:to-accent-purple after:transition-all after:duration-300 after:rounded-full ${isActive ? 'after:w-full text-white bg-dark-700' : 'after:w-0 hover:after:w-full text-dark-200 hover:text-white hover:bg-dark-800'}`
              }
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-700/50">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-[10px] font-bold text-white">
                  {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-dark-200">
                  {user?.username || user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="text-xs font-semibold text-dark-300 hover:text-accent-pink px-3 py-2 rounded-xl hover:bg-dark-700/50 transition-all cursor-pointer"
              >
                Çıxış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to='/login'
                className="text-sm font-medium text-dark-200 hover:text-white px-4 py-2 rounded-xl hover:bg-dark-700/50 transition-all"
              >
                Daxil ol
              </NavLink>
              <NavLink
                to='/register'
                className={`${btnPrimaryClass} text-xs !py-2 !px-4`}
              >
                Qeydiyyat
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-dark-200 hover:text-white p-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 animate-fade-in">
          <div className={`flex flex-col gap-1 ${glassLightClass} rounded-2xl p-3`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive ? 'text-white bg-dark-600' : 'text-dark-200 hover:text-white hover:bg-dark-700'}`
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