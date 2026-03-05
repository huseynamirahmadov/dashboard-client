import React from 'react';
import { NavLink } from "react-router-dom";
import NavLogo from '../assets/img/no-bg-main-logo.png';
// Səhvən authSlice-ı AuthStatus adı ilə import etmisən
import AuthStatus from "./AuthStatus"; // Birbaşa komponenti çağır

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500">
      <nav className="flex items-center justify-between container mx-auto p-4">
        <div>
          <NavLink to='/'>
            <img className="w-32" src={NavLogo} alt="Logo" />
          </NavLink>
        </div>

        <div className="flex items-center gap-8">
          <ul className="flex gap-5 text-xl text-white font-medium">
            <li className="hover:underline">
              <NavLink to='/dashboard' className={({ isActive }) => isActive ? "underline font-bold" : ""}>
                Dashboard
              </NavLink>
            </li>
            <li className="hover:underline">
              <NavLink to='/trades' className={({ isActive }) => isActive ? "underline font-bold" : ""}>
                Trades
              </NavLink>
            </li>
            <li className="hover:underline">
              <NavLink to='/calendar' className={({ isActive }) => isActive ? "underline font-bold" : ""}>
                Calendar
              </NavLink>
            </li>
            <li className="hover:underline">
              <NavLink to='/settings' className={({ isActive }) => isActive ? "underline font-bold" : ""}>
                Settings
              </NavLink>
            </li>
          </ul>

          {/* Dinamik Login/Logout düymələri */}
          <AuthStatus />
        </div>
      </nav>
    </header>
  );
}

export default Header;