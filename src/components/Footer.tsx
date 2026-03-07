import React from 'react'
import { glassClass } from '../utils/styles';

const Footer: React.FC = () => {
  return (
    <footer className={`${glassClass} mt-auto py-6`}>
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-black text-[8px]">
            TD
          </div>
          <span className="text-xs text-dark-300">
            © {new Date().getFullYear()} TradeDash. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-dark-400">
          <span className="hover:text-dark-200 transition cursor-pointer">Privacy</span>
          <span className="hover:text-dark-200 transition cursor-pointer">Terms</span>
          <span className="hover:text-dark-200 transition cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer