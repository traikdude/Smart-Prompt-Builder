import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 animate-fade-in-up">
      {/* Animated emoji orbit */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>🗣️</span>
        <span className="text-lg animate-bounce" style={{ animationDelay: '150ms' }}>✨</span>
        <span className="text-2xl animate-bounce" style={{ animationDelay: '300ms' }}>🎨</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold pb-2 tracking-tight">
        <span 
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #FF6B9D, #FF8E53, #FBBF24, #34D399, #22D3EE, #6366F1, #A855F7)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 5s ease infinite',
          }}
        >
          Elite Multi-Channel Architect
        </span>
      </h1>
      <p className="text-slate-400 mt-3 text-xs sm:text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '300ms' }}></span>
        <span>Unified Analysis & Implementation System</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '600ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '900ms' }}></span>
      </p>
    </div>
  );
};

export default Header;