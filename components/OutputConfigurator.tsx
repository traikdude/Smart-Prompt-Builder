import React, { useState } from 'react';
import { CONTEXT_SOURCES, OUTPUT_CATEGORIES } from '../engineConstants';

interface OutputConfiguratorProps {
  selectedSource: string;
  onSourceChange: (sourceId: string) => void;
  selectedFormats: string[];
  onFormatToggle: (formatId: string) => void;
}

export const OutputConfigurator: React.FC<OutputConfiguratorProps> = ({
  selectedSource,
  onSourceChange,
  selectedFormats,
  onFormatToggle
}) => {
  // State for which tab is currently active
  const [activeTabId, setActiveTabId] = useState<string>(OUTPUT_CATEGORIES[0].id);

  return (
    <div className="card p-5 sm:p-6 mb-6 space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
          <span className="text-xl">⚙️</span>
          Universal Output Engine
        </h2>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          PRO CONFIGURATOR
        </div>
      </div>

      {/* COMPONENT 1: CONTEXT SOURCE DROPDOWN */}
      <div className="relative z-10 space-y-2">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          Information Source
        </label>
        <div className="relative">
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="input-field w-full appearance-none pl-10 bg-slate-900/50 border-slate-700/50 focus:border-indigo-500/50 text-white"
          >
            {CONTEXT_SOURCES.map(source => (
              <option key={source.id} value={source.id} className="bg-slate-800">
                {source.icon} {source.name}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none">
            {CONTEXT_SOURCES.find(s => s.id === selectedSource)?.icon || '🔍'}
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 pl-1 mt-1 font-medium">
          {CONTEXT_SOURCES.find(s => s.id === selectedSource)?.description}
        </p>
      </div>

      {/* COMPONENT 2: OUTPUT FORMAT TABS & CHECKBOXES */}
      <div className="relative z-10 pt-2">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          Output Architecture <span className="text-slate-500 text-xs font-normal">(Multi-Select)</span>
        </label>
        
        <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/40">
          {/* TABS HEADER ROW */}
          <div className="flex overflow-x-auto custom-scrollbar border-b border-white/5 bg-slate-800/40">
            {OUTPUT_CATEGORIES.map(category => {
              const isActive = activeTabId === category.id;
              // Count how many options are selected in this category
              const selectedCount = category.options.filter(opt => selectedFormats.includes(opt.id)).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTabId(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'border-b-2 border-indigo-400 text-indigo-300 bg-white/5' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-b-2 border-transparent'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.title}</span>
                  {selectedCount > 0 && (
                    <span className="ml-1 bg-indigo-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="p-4 bg-slate-900/20">
            {OUTPUT_CATEGORIES.map(category => {
              if (activeTabId !== category.id) return null;
              return (
                <div key={category.id} className="animate-fade-in">
                  <p className="text-xs text-slate-400 mb-4 pb-2 border-b border-white/5">{category.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.options.map(option => {
                      const isSelected = selectedFormats.includes(option.id);
                      return (
                        <div 
                          key={option.id}
                          onClick={() => onFormatToggle(option.id)}
                          className={`
                            group cursor-pointer rounded-lg border p-3 transition-all duration-200 flex items-start gap-3
                            ${isSelected 
                              ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                              : 'bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60'
                            }
                          `}
                        >
                          <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded flex-shrink-0 border transition-colors ${
                            isSelected 
                              ? 'bg-indigo-500 border-indigo-400 text-white' 
                              : 'border-slate-600 bg-slate-900/50 text-transparent group-hover:border-slate-500'
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span>{option.icon}</span>
                              <span className={`font-semibold text-sm truncate ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                                {option.name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
