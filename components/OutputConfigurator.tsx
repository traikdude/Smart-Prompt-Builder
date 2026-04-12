import React, { useState } from 'react';
import { CONTEXT_SOURCES, OUTPUT_CATEGORIES } from '../engineConstants';
import { Tooltip } from './Tooltip';

interface OutputConfiguratorProps {
  selectedSource: string;
  onSourceChange: (sourceId: string) => void;
  selectedFormats: string[];
  onFormatToggle: (formatId: string) => void;
  onFormatQuantityChange: (formatId: string, quantity: number) => void;
}

export const OutputConfigurator: React.FC<OutputConfiguratorProps> = ({
  selectedSource,
  onSourceChange,
  selectedFormats,
  onFormatToggle,
  onFormatQuantityChange
}) => {
  // State for which tab is currently active
  const [activeTabId, setActiveTabId] = useState<string>(OUTPUT_CATEGORIES[0].id);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

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
        <Tooltip content="Tell the AI where your content came from so it can apply the right parsing rules before transforming it." position="top">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 cursor-help">
            Information Source
          </label>
        </Tooltip>
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
        <Tooltip content="Select one or more content formats. The AI will output each selected format in its own dedicated, copyable payload card." position="top" wrapperClassName="mb-3 block">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 cursor-help">
            Output Architecture <span className="text-slate-500 text-xs font-normal">(Multi-Select)</span>
          </label>
        </Tooltip>
        
        <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/40">
          {/* TABS HEADER ROW */}
          <div className="relative group/scroll">
            
            {/* Left Scroll Gradient & Button */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent flex items-center justify-start z-10 opacity-0 group-hover/scroll:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={scrollLeft}
                className="ml-1 p-1 bg-slate-800 hover:bg-indigo-500 rounded-full text-slate-300 hover:text-white pointer-events-auto shadow-lg border border-white/10 transition-colors"
                title="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto custom-scrollbar border-b border-white/5 bg-slate-800/40 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {OUTPUT_CATEGORIES.map(category => {
                const isActive = activeTabId === category.id;
                // Count how many options are selected in this category
                const selectedCount = category.options.filter(opt => selectedFormats.includes(opt.id)).length;
                
                return (
                  <Tooltip key={category.id} content={category.description} position="top">
                    <button
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
                  </Tooltip>
                );
              })}
            </div>

            {/* Right Scroll Gradient & Button */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent flex items-center justify-end z-10 opacity-0 group-hover/scroll:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={scrollRight}
                className="mr-1 p-1 bg-slate-800 hover:bg-indigo-500 rounded-full text-slate-300 hover:text-white pointer-events-auto shadow-lg border border-white/10 transition-colors"
                title="Scroll Right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
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
                      const count = selectedFormats.filter(id => id === option.id).length;
                      const isSelected = count > 0;
                      return (
                        <div 
                          key={option.id}
                          onClick={() => {
                            // If it's pure toggle (no quantity selected by user explicitly yet, just on/off)
                            if (isSelected) {
                              onFormatQuantityChange(option.id, 0); // turn off completely
                            } else {
                              onFormatQuantityChange(option.id, 1); // turn on to 1
                            }
                          }}
                          className={`
                            relative group cursor-pointer rounded-lg border p-3 transition-all duration-200 flex flex-col items-start gap-3
                            ${isSelected 
                              ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                              : 'bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60'
                            }
                          `}
                        >
                          {/* Quantity Multiplier Quick-Action */}
                          {isSelected && (!option.subOptions || option.subOptions.length === 0) && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900 border border-indigo-500/30 rounded-md p-0.5" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => onFormatQuantityChange(option.id, count - 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              >
                                −
                              </button>
                              <span className="text-xs font-mono font-bold text-indigo-300 w-3 text-center">{count}</span>
                              <button 
                                onClick={() => onFormatQuantityChange(option.id, count + 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                          )}

                          <div className="flex items-start gap-3 w-full">
                            <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded flex-shrink-0 border transition-colors ${
                              isSelected 
                                ? 'bg-indigo-500 border-indigo-400 text-white' 
                                : 'border-slate-600 bg-slate-900/50 text-transparent group-hover:border-slate-500'
                            }`}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0 pr-12">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span>{option.icon}</span>
                                <span className={`font-semibold text-sm truncate ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                                  {option.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-snug">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Nested Sub-Options Array */}
                          {isSelected && option.subOptions && option.subOptions.length > 0 && (
                            <div className="mt-1 pt-3 border-t border-indigo-500/20 w-full flex flex-col gap-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                              {option.subOptions.map(sub => {
                                const subCount = selectedFormats.filter(id => id === sub.id).length;
                                const isSubSelected = subCount > 0;
                                return (
                                  <div key={sub.id} className="flex items-center justify-between group/sub">
                                    <button
                                      onClick={() => onFormatQuantityChange(sub.id, isSubSelected ? 0 : 1)}
                                      className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium transition-colors border max-w-[70%] truncate ${
                                        isSubSelected
                                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                                          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                                      }`}
                                    >
                                      {sub.name}
                                    </button>
                                    
                                    {/* Sub-option specific quantity controls */}
                                    {isSubSelected && (
                                      <div className="flex items-center gap-1 bg-slate-900 border border-indigo-500/30 rounded-md p-0.5 animate-fade-in">
                                        <button 
                                          onClick={() => onFormatQuantityChange(sub.id, subCount - 1)}
                                          className="w-4 h-4 text-[10px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                        >
                                          −
                                        </button>
                                        <span className="text-[10px] font-mono font-bold text-indigo-300 w-3 text-center">{subCount}</span>
                                        <button 
                                          onClick={() => onFormatQuantityChange(sub.id, subCount + 1)}
                                          className="w-4 h-4 text-[10px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
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
