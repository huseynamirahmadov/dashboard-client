import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/slices/authSlice';

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
    <div className="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden px-4 py-8">
      {/* Background Effects */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-[#0f1220]/60 backdrop-blur-xl border border-white/5 w-full max-w-md p-6 sm:p-8 rounded-2xl relative z-10 animate-fade-in-up my-4 sm:my-0">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-black text-xl shadow-2xl">
            TD
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-center text-white mb-1">Hesab Yarat</h2>
        <p className="text-center text-dark-300 text-xs sm:text-sm mb-6">Bir neçə saniyədə qeydiyyatdan keç</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs sm:text-sm bg-loss/10 border border-loss/20 text-loss p-3 rounded-xl text-center font-medium">
              {typeof error === 'string' ? error : "Məlumatları yoxlayın"}
            </div>
          )}

          <div>
            <label className="block text-[9px] sm:text-[10px] font-bold text-dark-300 mb-1.5 uppercase tracking-[0.15em]">İstifadəçi adı</label>
            <input name="username" type="text" placeholder="username" className="w-full bg-[#0f1220]/80 border border-white/10 rounded-xl px-3.5 py-2 text-white/90 text-[13px] sm:text-sm transition-all duration-200 outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 placeholder:text-dark-300" value={formData.username} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-[9px] sm:text-[10px] font-bold text-dark-300 mb-1.5 uppercase tracking-[0.15em]">Email</label>
            <input name="email" type="email" placeholder="email@example.com" className="w-full bg-[#0f1220]/80 border border-white/10 rounded-xl px-3.5 py-2 text-white/90 text-[13px] sm:text-sm transition-all duration-200 outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 placeholder:text-dark-300" value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-[9px] sm:text-[10px] font-bold text-dark-300 mb-1.5 uppercase tracking-[0.15em]">Şifrə</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full bg-[#0f1220]/80 border border-white/10 rounded-xl px-3.5 py-2 text-white/90 text-[13px] sm:text-sm transition-all duration-200 outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 placeholder:text-dark-300" value={formData.password} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-[9px] sm:text-[10px] font-bold text-dark-300 mb-1.5 uppercase tracking-[0.15em]">Şifrəni təkrarla</label>
            <input name="password_confirmation" type="password" placeholder="••••••••" className="w-full bg-[#0f1220]/80 border border-white/10 rounded-xl px-3.5 py-2 text-white/90 text-[13px] sm:text-sm transition-all duration-200 outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 placeholder:text-dark-300" value={formData.password_confirmation} onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading} className="bg-gradient-to-br from-accent-blue to-accent-purple text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-[13px] sm:text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(67,97,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center w-full mt-2">
            {loading ? 'Yoxlanılır...' : 'Qeydiyyatı Tamamla'}
          </button>
        </form>

        <p className="mt-5 text-center text-dark-400 text-xs sm:text-sm">
          Artıq hesabın var?{' '}
          <Link to="/login" className="text-accent-blue hover:text-accent-purple font-semibold transition-colors">
            Daxil ol
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;