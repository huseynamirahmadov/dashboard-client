import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux-dan state-i oxuyuruq
  const { loading, error, token } = useAppSelector((state) => state.auth);

  // Əgər giriş uğurludursa (token gəlibsə), dashboard-a yönləndir
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
      <div className="max-w-md w-full bg-[#161b22] p-8 rounded-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Daxil Ol</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-900/20 p-2 rounded border border-red-800">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifrə"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Yüklənir...' : 'Giriş Et'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Hesabın yoxdur? <Link to="/register" className="text-blue-500">Qeydiyyatdan keç</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;