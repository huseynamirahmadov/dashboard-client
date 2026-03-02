import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Chart from './pages/Chart';
import Calendar from './pages/Calendar';
import Trades from './pages/Trades';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;