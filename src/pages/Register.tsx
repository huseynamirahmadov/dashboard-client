import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/slices/authSlice';
import { inputClass, btnPrimaryClass, labelClass } from '../utils/styles';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password_confirmation: ''
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden px-4 py-8">
      {/* Subtle glow */}
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-brand/[0.04] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-surface-900 border border-surface-800 w-full max-w-md p-8 sm:p-10 rounded-2xl relative z-10 animate-fade-in-up my-4 sm:my-0">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-brand flex items-center justify-center text-surface-950 font-extrabold text-xl">
            TD
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-surface-100 mb-1">Create Account</h2>
        <p className="text-center text-surface-500 text-sm mb-8">Sign up in seconds</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm bg-loss/10 border border-loss/20 text-loss p-3.5 rounded-xl text-center font-medium">
              {typeof error === 'string' ? error : "Check your details"}
            </div>
          )}

          <div>
            <label className={labelClass}>Username</label>
            <input name="username" type="text" placeholder="username" className={inputClass} value={formData.username} onChange={handleChange} required />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" placeholder="email@example.com" className={inputClass} value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input name="password" type="password" placeholder="••••••••" className={inputClass} value={formData.password} onChange={handleChange} required />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input name="password_confirmation" type="password" placeholder="••••••••" className={inputClass} value={formData.password_confirmation} onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading} className={`${btnPrimaryClass} w-full !py-3.5 mt-2`}>
            {loading ? 'Checking...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-surface-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-brand hover:text-amber-light font-semibold transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;