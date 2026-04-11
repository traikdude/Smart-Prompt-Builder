import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="mt-12 text-center text-xs text-slate-500 tracking-wider flex items-center justify-center gap-3">
      <span className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></span>
      <span>Engineered with</span>
      <span className="inline-flex gap-1 text-base">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>💖</span>
        <span className="animate-bounce" style={{ animationDelay: '100ms' }}>✨</span>
        <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🚀</span>
      </span>
      <span>by <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Elite Architect</span></span>
      <span className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></span>
    </div>
  );
};

export default Footer;