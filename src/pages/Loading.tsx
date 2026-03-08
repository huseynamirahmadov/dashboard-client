import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl border-2 border-surface-800 animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-xl bg-amber-brand opacity-60 animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-surface-300">Loading</p>
        <p className="text-xs text-surface-600">Please wait...</p>
      </div>
    </div>
  )
}

export default Loading