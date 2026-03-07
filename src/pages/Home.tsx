import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks';
import { glassLightClass, btnPrimaryClass, gradientTextClass } from '../utils/styles';

const Home: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-cyan/3 rounded-full blur-[100px]"></div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-3xl animate-fade-in-up mt-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 ${glassLightClass} px-4 py-2 rounded-full mb-10`}>
            <span className="w-2 h-2 rounded-full bg-profit animate-pulse"></span>
            <span className="text-xs font-semibold text-dark-200">Trading Performance Tracker</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-8">
            Master Your
            <br />
            <span className={gradientTextClass}>Trading Journey</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-dark-300 max-w-xl mx-auto mb-12 leading-relaxed">
            Track, analyze, and optimize your trades with a professional dashboard.
            Built for serious traders who demand precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {token ? (
              <Link to="/dashboard" className={`${btnPrimaryClass} text-base !px-8 !py-4`}>
                Go to Dashboard
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link to="/register" className={`${btnPrimaryClass} text-base !px-8 !py-4 shadow-lg hover:shadow-xl transition-shadow`}>
                  Başla
                  <span>→</span>
                </Link>
                <Link to="/login" className={`${glassLightClass} text-white px-8 py-4 rounded-xl font-semibold hover:bg-dark-600 transition-all text-base border-transparent hover:border-dark-500`}>
                  Daxil Ol
                </Link>
              </>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-20">
            {[
              { icon: '📊', text: 'P&L Tracking' },
              { icon: '📈', text: 'Equity Curves' },
              { icon: '📅', text: 'Trade Calendar' },
              { icon: '🎯', text: 'Win Rate Analytics' },
              { icon: '⚡', text: 'Real-time Stats' },
            ].map((feature, i) => (
              <div key={i} className={`${glassLightClass} flex items-center gap-2 px-4 py-2 rounded-xl`}>
                <span className="text-sm">{feature.icon}</span>
                <span className="text-xs font-semibold text-dark-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home