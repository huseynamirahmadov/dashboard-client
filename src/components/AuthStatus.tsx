import React from 'react';
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';

const AuthStatus: React.FC = () => {
  // Redux store-dan auth məlumatlarını çəkirik
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Əgər istifadəçi daxil olubsa (token varsa)
  if (token) {
    return (
      <div className="flex items-center gap-4 border-l pl-6 border-blue-400">
        <span className="text-white font-medium italic">
          {/* İndi həm username, həm də name TypeScript tərəfindən tanınır */}
          {user?.username || user?.name || 'User'}
        </span>
        <button 
          onClick={() => dispatch(logout())}
          className="bg-white text-blue-500 px-4 py-1 rounded shadow hover:bg-gray-100 transition text-sm font-semibold"
        >
          Log out
        </button>
      </div>
    );
  }

  // Əgər istifadəçi daxil olmayıbsa (qonaqdırsa)
  return (
    <div className="flex items-center gap-4 border-l pl-6 border-blue-400">
      <NavLink 
        to='/login' 
        className={({ isActive }) => 
          `text-white hover:underline text-lg ${isActive ? 'font-bold' : ''}`
        }
      >
        Login
      </NavLink>
      <NavLink 
        to='/register' 
        className="bg-white text-blue-500 px-4 py-1 rounded shadow hover:bg-gray-100 transition text-sm font-semibold"
      >
        Register
      </NavLink>
    </div>
  );
};

export default AuthStatus;