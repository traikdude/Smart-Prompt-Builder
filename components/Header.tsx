import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl font-extrabold pb-2 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          🗣️ Elite Multi-Channel Architect
        </span>
      </h1>
      <p className="text-slate-400 mt-2 text-xs sm:text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Unified Analysis & Implementation System
      </p>
    </div>
  );
};

export default Header;