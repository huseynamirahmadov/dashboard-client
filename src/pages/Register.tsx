import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/slices/authSlice';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
      <div className="max-w-md w-full bg-[#161b22] p-8 rounded-xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Qeydiyyat</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-900/20 p-2 rounded border border-red-800 text-center">
              {typeof error === 'string' ? error : "Məlumatları yoxlayın"}
            </div>
          )}

          <input
            name="username"
            type="text"
            placeholder="İstifadəçi adı"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Şifrə"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            name="password_confirmation"
            type="password"
            placeholder="Şifrəni təkrarla"
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Hesab yaradılır...' : 'Qeydiyyatı Tamamla'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Artıq hesabın var? <Link to="/login" className="text-blue-500">Daxil ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;