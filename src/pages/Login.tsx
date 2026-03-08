import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { inputClass, btnPrimaryClass, labelClass } from '../utils/styles';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden px-4 py-8">
      {/* Subtle glow */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-brand/[0.04] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-surface-900 border border-surface-800 w-full max-w-md p-8 sm:p-10 rounded-2xl relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-brand flex items-center justify-center text-surface-950 font-extrabold text-xl">
            TD
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-surface-100 mb-1">Welcome Back!</h2>
        <p className="text-center text-surface-500 text-sm mb-8">Log in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm bg-loss/10 border border-loss/20 text-loss p-3.5 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={`${btnPrimaryClass} w-full !py-3.5`}>
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-surface-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-brand hover:text-amber-light font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;