import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Chart from './pages/Chart';
import TradeCalendar from './pages/TradeCalendar';
import Trades from './pages/Trades';
import TradeDetail from './pages/TradeDetail';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/calendar" element={<TradeCalendar />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/trades/:tradeId" element={<TradeDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;