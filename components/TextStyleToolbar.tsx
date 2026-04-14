import React, { useState, useRef, useEffect } from 'react';
import { MODIFIER_CATEGORIES, ModifierCategory, TextModifier } from '../textModifiers';
import { Tooltip } from './Tooltip';

export interface SelectedModifiers {
  font: string | null;
  emoji: string | null;
  ascii: string | null;
  xml: string[];
  infographic?: string | null;
  slideshow?: string | null;
}

interface TextStyleToolbarProps {
  selectedModifiers: SelectedModifiers;
  onModifierChange: (categoryId: 'font' | 'emoji' | 'ascii' | 'xml' | 'infographic' | 'slideshow', modifierId: string | string[] | null) => void;
  onInsertTag?: (tag: string) => void;
}

/** Single dropdown for a modifier category */
const ModifierDropdown: React.FC<{
  category: ModifierCategory;
  selectedId: string | null;
  onSelect: (modId: string | null) => void;
}> = ({ category, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedMod = category.modifiers.find(m => m.id === selectedId);
  const hasOptions = category.modifiers.length > 0;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${isOpen ? 'z-40' : 'z-10'}`}>
      <Tooltip content={hasOptions ? `${category.label} Styles` : `${category.label} — coming soon`} position="top">
        <button
          onClick={() => hasOptions && setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            border transition-all duration-300 group relative overflow-hidden
            ${selectedId
              ? `${category.bgClass} ${category.textClass} ${category.borderClass} ${category.glowClass}`
              : `bg-slate-800/60 text-slate-400 border-slate-700 ${hasOptions ? 'hover:border-slate-600 hover:text-slate-300 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`
            }
          `}
          disabled={!hasOptions}
        >
          <span className="text-base group-hover:scale-110 transition-transform">{category.emoji}</span>
          <span className="hidden sm:inline whitespace-nowrap">
            {selectedMod ? selectedMod.name : category.label}
          </span>
          {/* Caret */}
          {hasOptions && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {/* Active indicator dot */}
          {selectedId && (
            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${category.textClass.replace('text-', 'bg-')} animate-pulse ring-2 ring-slate-900`}></span>
          )}
        </button>
      </Tooltip>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden animate-fade-in-up"
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
        >
          {/* Header */}
          <div className={`px-4 py-2 border-b border-slate-800 flex items-center gap-2`}>
            <span className="text-lg">{category.emoji}</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${category.textClass}`}>{category.label} Styles</span>
          </div>

          {/* Remove / Revert option */}
          {selectedId && (
            <button
              onClick={() => { onSelect(null); setIsOpen(false); }}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 transition-colors border-b border-slate-800"
            >
              <span className="text-base">✖️</span>
              <div>
                <div className="font-semibold">Remove Style</div>
                <div className="text-[10px] text-slate-500">Revert to default formatting</div>
              </div>
            </button>
          )}

          {/* Scrollable Modifier options */}
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain pb-2">
            {category.modifiers.map(mod => (
              <button
                key={mod.id}
                onClick={() => { onSelect(mod.id); setIsOpen(false); }}
                className={`
                  flex items-center gap-3 w-full text-left px-4 py-3 text-sm transition-all
                  ${selectedId === mod.id
                    ? `${category.bgClass} ${category.textClass}`
                    : 'text-slate-300 hover:bg-slate-800'
                  }
                `}
              >
                <span className="text-lg w-6 text-center">{mod.emoji}</span>
                <div className="flex-grow">
                  <div className="font-semibold">{mod.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{mod.description}</div>
                </div>
                {selectedId === mod.id && (
                  <span className={`${category.textClass} text-sm`}>✓</span>
                )}
              </button>
            ))}

            {/* Empty state */}
            {category.modifiers.length === 0 && (
              <div className="px-4 py-6 text-center text-slate-500 text-xs">
                <div className="text-2xl mb-2 opacity-50">🚧</div>
                <div>Coming soon — prompts pending</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/** Multi-select dropdown for XML extractors with fuzzy search */
const XMLMultiSelectDropdown: React.FC<{
  category: ModifierCategory;
  selectedIds: string[];
  onSelect: (modIds: string[]) => void;
  onInsertTag?: (tag: string) => void;
}> = ({ category, selectedIds, onSelect, onInsertTag }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const hasOptions = category.modifiers.length > 0;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('custom_xml_tags');
    if (saved) {
      try {
        setCustomTags(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Fuzzy match filter
  const filteredModifiers = category.modifiers.filter(mod => 
    mod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (modId: string) => {
    if (selectedIds.includes(modId)) {
      onSelect(selectedIds.filter(id => id !== modId));
    } else {
      onSelect([...selectedIds, modId]);
    }
  };

  const addCustomTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (!searchQuery.trim()) return;
    const cleanTag = searchQuery.trim().replace(/[<>\s]/g, '-').toLowerCase();
    if (!customTags.includes(cleanTag)) {
      const updated = [...customTags, cleanTag];
      setCustomTags(updated);
      localStorage.setItem('custom_xml_tags', JSON.stringify(updated));
    }
    setSearchQuery('');
  };

  const removeCustomTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTags.filter(t => t !== tag);
    setCustomTags(updated);
    localStorage.setItem('custom_xml_tags', JSON.stringify(updated));
  };

  const handleCustomTagClick = (tag: string) => {
    if (onInsertTag) {
      onInsertTag(tag);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${isOpen ? 'z-40' : 'z-10'}`}>
      <Tooltip content={hasOptions ? `Multiple Selection for ${category.label}` : `${category.label} — coming soon`} position="top">
        <button
          onClick={() => {
            if (hasOptions) {
              setIsOpen(!isOpen);
              if (!isOpen) setSearchQuery(''); // Reset search on open
            }
          }}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            border transition-all duration-300 group relative overflow-hidden
            ${selectedIds.length > 0
              ? `${category.bgClass} ${category.textClass} ${category.borderClass} ${category.glowClass}`
              : `bg-slate-800/60 text-slate-400 border-slate-700 ${hasOptions ? 'hover:border-slate-600 hover:text-slate-300 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`
            }
          `}
          disabled={!hasOptions}
        >
          <span className="text-base group-hover:scale-110 transition-transform">{category.emoji}</span>
          <span className="hidden sm:inline whitespace-nowrap">
            {selectedIds.length === 1 
              ? category.modifiers.find(m => m.id === selectedIds[0])?.name || category.label
              : selectedIds.length > 1
                ? `${selectedIds.length} Extractors`
                : category.label
            }
          </span>
          {hasOptions && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {selectedIds.length > 0 && (
            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${category.textClass.replace('text-', 'bg-')} animate-pulse ring-2 ring-slate-900`}></span>
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden animate-fade-in-up flex flex-col"
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)', maxHeight: '60vh' }}
        >
          <div className={`px-4 py-3 border-b border-slate-800 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.emoji}</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${category.textClass}`}>{category.label}</span>
            </div>
            {selectedIds.length > 0 && (
              <button 
                onClick={() => onSelect([])}
                className="text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-0.5 rounded"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search Input and Custom Tag Creator */}
          <div className="px-3 py-3 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-2">
            <div className="relative">
              <input 
                type="text" 
                autoFocus
                placeholder="Search or type a specific custom tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={addCustomTag}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-12 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 text-[10px]">🔍</span>
              {searchQuery.trim() && !filteredModifiers.length && (
                <button
                  onClick={() => addCustomTag()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  ADD
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto overscroll-contain flex-grow">
            {/* Custom tags section */}
            {customTags.length > 0 && (
              <div className="border-b border-indigo-500/20 bg-indigo-500/5 pb-2">
                <div className="px-4 py-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Custom Tags</span>
                  <span className="opacity-60 font-mono text-[8px]">Auto-Format Insert</span>
                </div>
                {customTags.filter(t => t.includes(searchQuery.toLowerCase())).map(tag => (
                  <div
                    key={`custom-${tag}`}
                    className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/80 cursor-pointer group/custom"
                    onClick={() => handleCustomTagClick(tag)}
                  >
                    <div className="flex items-center gap-2 text-indigo-300">
                      <span className="opacity-50 text-xs">{"</>"}</span>
                      <span className="font-mono text-sm font-semibold">{tag}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[9px] text-emerald-400 opacity-0 group-hover/custom:opacity-100 transition-opacity mr-3 font-semibold tracking-wide">
                        INSERT
                      </span>
                      <button
                        onClick={(e) => removeCustomTag(tag, e)}
                        className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover/custom:opacity-100 transition-all rounded hover:bg-red-500/20"
                        title="Delete custom tag"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredModifiers.map(mod => {
              const isSelected = selectedIds.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => toggleSelection(mod.id)}
                  className={`
                    flex items-start gap-3 w-full text-left px-4 py-3 text-sm transition-all
                    ${isSelected ? `${category.bgClass} ${category.textClass}` : 'text-slate-300 hover:bg-slate-800'}
                  `}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500 font-bold text-white' : 'border-slate-600 bg-slate-900'}`}>
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center gap-1.5">
                      {mod.emoji} {mod.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{mod.description}</div>
                  </div>
                </button>
              );
            })}
            
            {filteredModifiers.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500 text-xs">
                <div className="text-2xl mb-2 opacity-50">👻</div>
                <div>No tags match "{searchQuery}"</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN TOOLBAR COMPONENT
// ═══════════════════════════════════════════

const TextStyleToolbar: React.FC<TextStyleToolbarProps> = ({ selectedModifiers, onModifierChange, onInsertTag }) => {
  const activeCount = [
    selectedModifiers.font, 
    selectedModifiers.emoji, 
    selectedModifiers.ascii,
    selectedModifiers.infographic,
    selectedModifiers.slideshow
  ].filter(Boolean).length + (selectedModifiers.xml?.length || 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tooltip content="Apply AI-driven stylistic enhancements to your final text output." position="top">
            <span className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2 cursor-help">
              TEXT STYLING <span className="text-xl">🎨</span>
            </span>
          </Tooltip>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
      </div>

      {/* Dropdown buttons row */}
      <div className="flex flex-wrap gap-2">
        {MODIFIER_CATEGORIES.map(cat => {
          if (cat.id === 'xml') {
            return (
              <XMLMultiSelectDropdown
                key={cat.id}
                category={cat}
                selectedIds={selectedModifiers.xml || []}
                onSelect={(modIds) => onModifierChange('xml', modIds)}
                onInsertTag={onInsertTag}
              />
            );
          }
          return (
            <ModifierDropdown
              key={cat.id}
              category={cat}
              selectedId={selectedModifiers[cat.id] as string | null}
              onSelect={(modId) => onModifierChange(cat.id, modId)}
            />
          );
        })}
      </div>

      {/* Active modifier summary chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {MODIFIER_CATEGORIES.map(cat => {
            if (cat.id === 'xml') {
              const modIds = selectedModifiers.xml || [];
              if (modIds.length === 0) return null;
              
              return modIds.map(modId => {
                const mod = cat.modifiers.find(m => m.id === modId);
                if (!mod) return null;
                return (
                  <div 
                    key={`xml-${mod.id}`}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cat.bgClass} ${cat.textClass} ${cat.borderClass}`}
                  >
                    <span>{mod.emoji}</span>
                    <span>{mod.name}</span>
                    <button 
                      onClick={() => onModifierChange('xml', modIds.filter(id => id !== modId))}
                      className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                );
              });
            } else {
              const modId = selectedModifiers[cat.id] as string | null;
              if (!modId) return null;
              const mod = cat.modifiers.find(m => m.id === modId);
              if (!mod) return null;
              return (
                <div 
                  key={cat.id}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cat.bgClass} ${cat.textClass} ${cat.borderClass}`}
                >
                  <span>{mod.emoji}</span>
                  <span>{mod.name}</span>
                  <button 
                    onClick={() => onModifierChange(cat.id, null)}
                    className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default TextStyleToolbar;
