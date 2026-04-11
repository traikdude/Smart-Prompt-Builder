import React from 'react';
import { RecentPrompt } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recentPrompts: RecentPrompt[];
  onRestore: (prompt: RecentPrompt) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, recentPrompts, onRestore }) => {
  
  // Helper to remove markdown characters for preview
  const getPreviewText = (text: string) => {
    // Basic strip of #, *, `, and newlines
    return text.replace(/[#*_`]/g, '').replace(/\n/g, ' ').trim();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#05050A]/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] transform transition-transform duration-300 ease-in-out z-50 border-l border-slate-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-lg font-bold text-cyan-400 font-mono tracking-wide flex items-center gap-2">
            <span className="text-2xl">🕒</span> Recent Prompts
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-cyan-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] p-4 space-y-4 bg-slate-900/50">
          {recentPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-5xl mb-3 opacity-80 animate-pulse">🕸️</div>
                <p className="text-slate-400 text-sm font-medium">No recent prompts found.</p>
                <p className="text-slate-500 text-xs mt-1">Generate something awesome!</p>
            </div>
          ) : (
            recentPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-slate-800 border border-slate-700/80 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all p-4 group cursor-pointer hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] relative overflow-hidden"
                   onClick={() => {
                        onRestore(prompt);
                    }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <span className="text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded-md truncate max-w-[150px] uppercase">
                    {prompt.templateName}
                  </span>
                  <button
                    className="text-slate-500 group-hover:text-cyan-400 hover:bg-cyan-900/30 rounded-full p-1 transition-all"
                    title="Restore Prompt"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2 break-all font-mono bg-slate-900/50 p-2 rounded-lg border border-slate-700/50 pl-2">
                  {getPreviewText(prompt.generatedContent).slice(0, 80)}...
                </p>
                <div className="flex justify-between items-center pl-2">
                    <div className="text-xs text-slate-500 font-medium font-mono">
                      {new Date(prompt.timestamp).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </div>
                    <span className="text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        Restore →
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;