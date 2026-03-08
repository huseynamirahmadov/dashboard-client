import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks';
import { btnPrimaryClass } from '../utils/styles';

const Home: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-32 left-1/3 w-[600px] h-[600px] bg-amber-brand/[0.03] rounded-full blur-[150px]"></div>
      <div className="absolute bottom-32 right-1/3 w-[400px] h-[400px] bg-amber-brand/[0.02] rounded-full blur-[120px]"></div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-2xl animate-fade-in-up mt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-900 border border-surface-800 px-4 py-2 rounded-full mb-10">
            <span className="w-2 h-2 rounded-full bg-amber-brand animate-pulse"></span>
            <span className="text-xs font-semibold text-surface-400">Trading Performance Tracker</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-100 tracking-tight leading-[1.1] mb-6">
            Master Your
            <br />
            <span className="text-amber-brand">Trading Journey</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-surface-500 max-w-lg mx-auto mb-10 leading-relaxed">
            Track, analyze, and optimize your trades with a professional dashboard.
            Built for serious traders who demand precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {token ? (
              <Link to="/dashboard" className={`${btnPrimaryClass} text-base !px-8 !py-4`}>
                Go to Dashboard
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link to="/register" className={`${btnPrimaryClass} text-base !px-8 !py-4`}>
                  Get Started
                  <span>→</span>
                </Link>
                <Link to="/login" className="bg-surface-900 border border-surface-800 text-surface-300 px-8 py-4 rounded-xl font-semibold hover:bg-surface-800 hover:border-surface-700 transition-all text-base">
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
            {[
              { icon: '📊', text: 'P&L Tracking' },
              { icon: '📈', text: 'Equity Curves' },
              { icon: '📅', text: 'Trade Calendar' },
              { icon: '🎯', text: 'Win Rate Analytics' },
              { icon: '⚡', text: 'Real-time Stats' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 bg-surface-900 border border-surface-800 px-4 py-2.5 rounded-xl hover:border-surface-700 transition-all">
                <span className="text-sm">{feature.icon}</span>
                <span className="text-xs font-semibold text-surface-400">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home