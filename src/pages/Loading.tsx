import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl border-2 border-dark-600 animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple opacity-60 animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-dark-200">Loading</p>
        <p className="text-xs text-dark-400">Please wait...</p>
      </div>
    </div>
  )
}

export default Loading