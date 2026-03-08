import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-surface-800 py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-brand flex items-center justify-center text-surface-950 font-extrabold text-[7px]">
            TD
          </div>
          <span className="text-xs text-surface-600">
            © {new Date().getFullYear()} TradeDash. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-surface-600">
          <span className="hover:text-surface-400 transition cursor-pointer">Privacy</span>
          <span className="hover:text-surface-400 transition cursor-pointer">Terms</span>
          <span className="hover:text-surface-400 transition cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer