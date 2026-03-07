import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Chart from './pages/Chart';
import TradeCalendar from './pages/TradeCalendar';
import Trades from './pages/Trades';
import TradeDetail from './pages/TradeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getUser } from './redux/slices/authSlice';


function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getUser()).unwrap().catch(() => {
        // Server əlçatan deyilsə və ya token keçərsizdirsə, köhnə tokeni sil
        localStorage.removeItem('token');
      });
    }
  }, [token, user, dispatch]);

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Hər kəs üçün açıq səhifələr */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Yalnız giriş edənlər üçün qorunan səhifələr */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/calendar" element={<TradeCalendar />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/trades/:tradeId" element={<TradeDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;