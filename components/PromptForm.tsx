import React, { useState, useRef, useEffect } from 'react';
import { PromptTemplate, AttachmentInput } from '../types';
import { CHAR_LIMIT_OPTIONS, FORMAT_STYLES } from '../constants';
import TextStyleToolbar, { SelectedModifiers } from './TextStyleToolbar';
import { OutputConfigurator } from './OutputConfigurator';
import { Tooltip } from './Tooltip';
import { AttachmentZone } from './AttachmentZone';

interface PromptFormProps {
  templates: PromptTemplate[];
  selectedTemplateIds: string[];
  selectedFormatId: string;
  userContent: string;
  includeExamples: boolean;
  charLimit?: number | null;
  onTemplateToggle: (templateId: string) => void;
  onFormatChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExamplesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCharLimitChange?: (limit: number | null) => void;
  onGenerate: () => void;
  onAIGenerate: (mode: 'smart' | 'fast' | 'thinking') => void;
  isLoading: boolean;
  onNewTemplate: () => void;
  onAIRewrite?: (action: 'expand' | 'compress') => void;
  onLoadSyntaxTest: () => void;
  onDeleteTemplate?: (id: string) => void;
  selectedModifiers: SelectedModifiers;
  onModifierChange: (categoryId: 'font' | 'emoji' | 'ascii' | 'xml' | 'infographic' | 'slideshow', modifierId: string | string[] | null) => void;
  selectedEngineSource: string;
  onEngineSourceChange: (sourceId: string) => void;
  selectedEngineFormats: string[];
  onEngineFormatToggle: (formatId: string) => void;
  onEngineFormatQuantityChange: (formatId: string, quantity: number) => void;
  attachments: AttachmentInput[];
  onAttachmentsChange: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
  onInsertTag: (tag: string) => void;
  modelFamily: '2.5' | '3.1';
  onModelFamilyChange: (family: '2.5' | '3.1') => void;
}

/** Color config for each category */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; label: string; emoji: string }> = {
  communication: { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-[0_0_8px_rgba(255,107,157,0.2)]', label: 'Communication', emoji: '💬' },
  technical:     { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-[0_0_8px_rgba(34,211,238,0.2)]', label: 'Technical', emoji: '⚙️' },
  creative:      { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-[0_0_8px_rgba(251,191,36,0.2)]', label: 'Creative', emoji: '🎨' },
  analysis:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_8px_rgba(52,211,153,0.2)]', label: 'Analysis', emoji: '🔍' },
  development:   { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'shadow-[0_0_8px_rgba(99,102,241,0.2)]', label: 'Development', emoji: '💻' },
  custom:        { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-[0_0_8px_rgba(168,85,247,0.2)]', label: 'Custom', emoji: '★' },
};

const PromptForm: React.FC<PromptFormProps> = ({
  templates,
  selectedTemplateIds,
  selectedFormatId,
  userContent,
  includeExamples,
  charLimit,
  onTemplateToggle,
  onFormatChange,
  onContentChange,
  onExamplesChange,
  onCharLimitChange,
  onGenerate,
  onAIGenerate,
  isLoading,
  onNewTemplate,
  onAIRewrite,
  onLoadSyntaxTest,
  onDeleteTemplate,
  selectedModifiers,
  onModifierChange,
  selectedEngineSource,
  onEngineSourceChange,
  selectedEngineFormats,
  onEngineFormatToggle,
  onEngineFormatQuantityChange,
  attachments,
  onAttachmentsChange,
  onInsertTag,
  modelFamily,
  onModelFamilyChange
}) => {
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setIsTemplateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTemplates = templates.filter(t => selectedTemplateIds.includes(t.id));
  
  // Compute input analytics
  const wordCount = userContent.trim() ? userContent.trim().split(/\s+/).length : 0;
  const sentenceCount = userContent.trim() ? (userContent.match(/[.!?]+/g) || []).length || (userContent.trim() ? 1 : 0) : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden animate-fade-in-up">
      {/* 🌈 Animated rainbow top bar */}
      <div className="rainbow-bar absolute top-0 left-0 w-full"></div>

      {/* Dual Axis Selectors: Template & Formatting */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-30">
        
        {/* The Engine: Template Selector */}
        <div className="group/engine">
          <div className="flex justify-between items-center mb-3">
            <Tooltip content="Select a transformation template to process your input through." position="top">
              <label htmlFor="template" className="block text-xs font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2 cursor-help group-hover/engine:text-purple-400 transition-colors">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                THE ENGINE <span className="text-sm sm:text-xl ml-1 animate-bounce">⚡</span>
              </label>
            </Tooltip>
            <button
              onClick={onNewTemplate}
              className="text-[10px] sm:text-xs font-bold text-purple-400 hover:text-white hover:bg-purple-500 flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              NEW
            </button>
          </div>
          <div className="flex gap-2 sm:gap-3 items-start">
            <div className="relative flex-grow group" ref={templateDropdownRef}>
              <div 
                onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent text-slate-200 font-medium transition-all cursor-pointer group-hover:border-purple-500/40 text-sm sm:text-base flex justify-between items-center shadow-inner"
              >
                <div className="truncate pr-4 flex flex-wrap gap-1">
                  {selectedTemplates.length === 0 ? (
                    <span className="text-slate-500 font-mono text-xs uppercase tracking-wider">— System Default —</span>
                  ) : (
                    <div className="flex items-center gap-2">
                       {selectedTemplates.length === 1 ? (
                         <span className="flex items-center gap-2">
                           <span className="text-lg">{CATEGORY_COLORS[selectedTemplates[0].category || 'custom']?.emoji}</span>
                           <span>{selectedTemplates[0].name}</span>
                         </span>
                       ) : (
                         <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">{selectedTemplates.length} Engines Active</span>
                       )}
                    </div>
                  )}
                </div>
                <div className="text-purple-400 group-hover:scale-110 group-hover:rotate-180 transition-all duration-300">
                  <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              {isTemplateDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto">
                  <div className="p-2 space-y-1">
                     <div 
                        onClick={() => {
                           if (selectedTemplateIds.length > 0) {
                              // If any are selected, unselect all (set to none implicitly by calling parent if needed, or parent handles empty array)
                              templates.forEach(t => {
                                if(selectedTemplateIds.includes(t.id)) onTemplateToggle(t.id);
                              });
                           }
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${selectedTemplateIds.length === 0 ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-slate-700/50 text-slate-300'}`}
                     >
                       <div className={`w-4 h-4 rounded border flex mt-0.5 items-center justify-center ${selectedTemplateIds.length === 0 ? 'bg-purple-500 border-purple-400' : 'border-slate-500 bg-slate-900'}`}>
                         {selectedTemplateIds.length === 0 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                       </div>
                       <span className="font-medium">— Default (No Engine) —</span>
                     </div>
                     <div className="h-px bg-slate-700/50 my-1"></div>
                    {templates.map(template => {
                      const tCat = CATEGORY_COLORS[template.category || 'custom'] || CATEGORY_COLORS.custom;
                      const isSelected = selectedTemplateIds.includes(template.id);
                      return (
                        <div 
                          key={template.id} 
                          onClick={() => onTemplateToggle(template.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-purple-500/10 text-purple-300 border-l-2 border-purple-400' : 'hover:bg-slate-700/50 text-slate-300 border-l-2 border-transparent'}`}
                        >
                          <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-400' : 'border-slate-500 bg-slate-900'}`}>
                            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="flex-shrink-0">{tCat.emoji}</span>
                          <span className="font-medium truncate">{template.isCustom ? `★ ${template.name}` : template.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {selectedTemplates.some(t => t.isCustom) && onDeleteTemplate && (
              <button
                onClick={() => {
                  if(confirm('Are you sure you want to delete the selected custom templates?')) {
                    selectedTemplates.filter(t => t.isCustom).forEach(t => onDeleteTemplate(t.id));
                  }
                }}
                className="px-3 sm:px-4 mt-1 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:rotate-3 self-stretch"
                title="Delete Selected Custom Templates"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* The Lens: Formatting Selector */}
        <div className="group/lens">
          <div className="flex justify-between items-center mb-3">
            <Tooltip content="Apply a structural format override to your output." position="top">
              <label htmlFor="format" className="block text-xs font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2 cursor-help group-hover/lens:text-pink-400 transition-colors">
                 <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(244,114,182,0.6)]"></span>
                 THE LENS <span className="text-sm sm:text-xl ml-1 animate-pulse">🎛️</span>
              </label>
            </Tooltip>
          </div>
          <div className="relative flex-grow group">
            <select
              id="format"
              value={selectedFormatId}
              onChange={onFormatChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent text-slate-200 font-medium transition-all cursor-pointer group-hover:border-pink-500/40 text-sm sm:text-base shadow-inner"
            >
              {FORMAT_STYLES.map(format => (
                <option key={format.id} value={format.id}>
                  {format.id === 'none' ? '— ' : '🎨 '} {format.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview with Color-Coded Category Badge */}
      {selectedTemplates.length > 0 && (
        <div className="mb-6 sm:mb-8 flex flex-col gap-3">
          {selectedTemplates.map(template => {
            const cat = CATEGORY_COLORS[template.category || 'custom'] || CATEGORY_COLORS.custom;
            return (
              <div key={template.id} className={`bg-slate-800/20 backdrop-blur-sm border rounded-xl p-3 sm:p-4 transition-all duration-300 hover:bg-slate-800/40 hover:scale-[1.01] origin-center ${cat.border}`} style={{ borderLeftWidth: '4px' }}>
                 <div className="flex items-start gap-3 sm:gap-4">
                   <div className={`p-1.5 rounded-lg hidden sm:flex items-center justify-center text-lg border ${cat.bg} ${cat.border} ${cat.glow}`}>
                     {cat.emoji}
                   </div>
                   <div className="flex-grow">
                     <div className="flex items-center gap-2 flex-wrap mb-1">
                       <p className="text-sm font-bold text-slate-200">{template.name}</p>
                       <span className={`text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                         {cat.label}
                       </span>
                     </div>
                     <p className="text-xs text-slate-400 line-clamp-2" title={template.description}>{template.description}</p>
                   </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🎨 Text Style Toolbar — Font / Emoji / ASCII dropdowns */}
      <div className="relative z-20 mb-6 sm:mb-8 bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-xl p-4 shadow-inner">
        <TextStyleToolbar
          selectedModifiers={selectedModifiers}
          onModifierChange={onModifierChange}
          onInsertTag={onInsertTag}
        />
      </div>

      {/* User Content */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <Tooltip content="Paste the raw text, code, or context you want the AI to analyze and transform." position="top">
            <label htmlFor="content" className="block text-xs font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2 cursor-help">
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
              YOUR CONTENT <span className="text-sm sm:text-xl ml-1">✍️</span>
            </label>
          </Tooltip>
          <Tooltip content="Populates the form with a demo payload so you can test how the agent processes inputs." position="top">
            <button
               onClick={onLoadSyntaxTest}
               className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700 hover:bg-amber-500/20 hover:border-amber-500/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all hover:shadow-[0_0_10px_rgba(251,191,36,0.3)] active:scale-95"
            >
              Load Example
            </button>
          </Tooltip>
        </div>
        <textarea
          id="content"
          value={userContent}
          onChange={onContentChange}
          placeholder="Paste or type what you need help with here..."
          className="w-full h-40 sm:h-48 px-4 sm:px-5 py-3 sm:py-4 bg-slate-900/60 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500/50 text-slate-200 placeholder-slate-500 resize-none transition-all font-mono text-sm shadow-inner hover:bg-slate-900/80 text-[16px] sm:text-sm"
        />
        
        {/* 📊 Input Intelligence Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 bg-slate-900/40 p-3 sm:p-2.5 rounded-xl border border-slate-700/30 shadow-inner backdrop-blur-sm">
          
          <div className="flex-1 flex flex-wrap gap-2 items-center">
            <span className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all ${wordCount > 0 ? 'bg-pink-500/15 text-pink-400 border-pink-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              📝 {wordCount} words
            </span>
            <span className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all ${sentenceCount > 0 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              📖 {sentenceCount} sentences
            </span>
            <span className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all hidden sm:inline-flex ${userContent.length > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              ⏱️ ~{readingTime}m read
            </span>
            <span className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all ${userContent.length > 0 ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              ⌨️ {userContent.length.toLocaleString()} chars
            </span>
          </div>

          {/* Spacer */}
          <div className="hidden sm:block flex-grow"></div>

          {/* Include Examples Toggle */}
          <Tooltip content="Generate 4 distinct numbered variations of the result, varying in tone, style, or approach to help you choose the best one." position="top">
            <label className="flex items-center gap-2 cursor-pointer group select-none hover:bg-slate-800/80 px-2 py-1 rounded-md transition-all">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={includeExamples} 
                  onChange={onExamplesChange} 
                  className="sr-only peer"
                />
                <div className="block bg-slate-700 w-10 h-6 rounded-full peer-checked:bg-pink-500 transition-colors shadow-inner border border-slate-600 peer-checked:border-pink-400"></div>
                <div className="dot absolute left-1 top-1 bg-slate-300 peer-checked:bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow-lg"></div>
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-pink-400 transition-colors whitespace-nowrap">
                Variations
              </span>
            </label>
          </Tooltip>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

          {/* Character Limiter Dropdown */}
          {onCharLimitChange && (
            <div className="flex items-center gap-2 group">
              <Tooltip content="Constrain the AI response to generate text approximately equal to this number of characters." position="top">
                <label flex-shrink-0 htmlFor="charLimit" className="text-xs font-medium text-slate-400 group-hover:text-cyan-400 transition-colors whitespace-nowrap cursor-help">
                  Length:
                </label>
              </Tooltip>
              <div className="relative">
                <select
                  id="charLimit"
                  value={charLimit || ''}
                  onChange={(e) => onCharLimitChange(e.target.value ? Number(e.target.value) : null)}
                  className="appearance-none bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 text-xs rounded-lg pl-2 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer font-medium"
                >
                  <option value="">No Limit</option>
                  {CHAR_LIMIT_OPTIONS.map(count => (
                    <option key={count} value={count}>{count.toLocaleString()}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* AI Content Rewrite Tools */}
          {onAIRewrite && (
            <div className="flex items-center gap-1.5 sm:ml-2">
              <Tooltip content="Synthesize and truncate your specific input text in-place using AI before generation." position="top">
                <button 
                  onClick={() => onAIRewrite('compress')}
                  disabled={isLoading || !userContent.trim()}
                  className="p-1 sm:px-2 rounded-md bg-slate-800/80 border border-slate-700 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 group/tool"
                >
                  <span className="text-[10px] sm:text-xs font-bold leading-none">📉</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:block">Compress</span>
                </button>
              </Tooltip>

              <Tooltip content="Flesh out, lengthen, and elaborate your specific input text in-place using AI before generation." position="top">
                <button 
                  onClick={() => onAIRewrite('expand')}
                  disabled={isLoading || !userContent.trim()}
                  className="p-1 sm:px-2 rounded-md bg-slate-800/80 border border-slate-700 hover:bg-pink-500/20 hover:border-pink-500/50 hover:text-pink-400 text-slate-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 group/tool"
                >
                  <span className="text-[10px] sm:text-xs font-bold leading-none">📈</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:block">Expand</span>
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Phase 7: Multimedia Attachment Zone */}
        <AttachmentZone attachments={attachments} onAttachmentsChange={onAttachmentsChange} />
        
      </div>

      <OutputConfigurator 
        selectedSource={selectedEngineSource}
        onSourceChange={onEngineSourceChange}
        selectedFormats={selectedEngineFormats}
        onFormatToggle={onEngineFormatToggle}
        onFormatQuantityChange={onEngineFormatQuantityChange}
      />

      {/* 🌈 Generate Button — vibrant gradient */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !userContent.trim()}
        className={`w-full py-3.5 sm:py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg tracking-wide relative overflow-hidden group
          ${isLoading || !userContent.trim() 
            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed shadow-none' 
            : 'btn-joyful'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            SUBMITTING...
          </>
        ) : (
          <>
            <span className="relative z-10 group-hover:scale-105 transition-transform">SUBMIT TO GEMINI</span>
            <span className="text-xl sm:text-2xl relative z-10 group-hover:rotate-12 transition-transform">✨</span>
          </>
        )}
      </button>

      {/* AI Generation Options — Model Selector + Mode Buttons */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">

        {/* Model Generation Selector */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Model</span>
          <div className="flex items-center bg-slate-800/60 rounded-lg border border-slate-700/50 p-0.5">
            {/* ── Gemini 2.5 Flash — Standard tier ── */}
            <button
              onClick={() => onModelFamilyChange('2.5')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                modelFamily === '2.5'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="⚡ Gemini 2.5 Flash — Standard tier | $0.30/1M input · $2.50/1M output tokens"
            >
              ⚡ 2.5
            </button>

            {/* ── Gemini 2.5 Pro — Premium / higher cost ── */}
            <button
              onClick={() => onModelFamilyChange('3.1')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                modelFamily === '3.1'
                  ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 border border-amber-500/40 shadow-[0_0_14px_rgba(251,191,36,0.25)]'
                  : 'text-slate-500 hover:text-amber-400/70'
              }`}
              title="💰 Gemini 2.5 Pro — Premium tier | $1.25–2.50/1M input · $10–15/1M output tokens (8–10× more expensive than Flash)"
            >
              💰 3.1
              {/* Cost-tier badge — only visible when Pro is the active selection */}
              {modelFamily === '3.1' && (
                <span className="absolute -top-2.5 -right-2 bg-amber-500 text-black text-[8px] font-black px-1 py-0.5 rounded-full leading-none tracking-tight shadow-lg animate-pulse">
                  PRO
                </span>
              )}
            </button>
          </div>

          {/* Contextual label — shows cost warning when Pro is active */}
          <span className={`text-[10px] font-semibold hidden sm:inline transition-colors ${
            modelFamily === '3.1' ? 'text-amber-400/80' : 'text-slate-600'
          }`}>
            {modelFamily === '2.5' ? 'Stable' : '⚠️ Premium Cost'}
          </span>
        </div>

        {/* Cost-warning banner — only visible when Pro is selected */}
        {modelFamily === '3.1' && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300/90 text-[11px]">
            <span className="text-base leading-none">💰</span>
            <span>
              <strong>Pro model active.</strong> Output tokens cost ~6× more than Flash.
              Switch to <button onClick={() => onModelFamilyChange('2.5')} className="underline underline-offset-2 hover:text-amber-200 font-bold">⚡ 2.5</button> for standard tasks.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Smart Generate */}
          {/* Smart Generate */}
          <Tooltip content="Standard AI generation. Best balance of speed and reasoning for most tasks." position="bottom">
            <button
                onClick={() => onAIGenerate('smart')}
                disabled={isLoading || !userContent.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-purple-500/20 hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
                <span className="group-hover:scale-125 transition-transform">✨</span>
                <span className="text-sm">Smart Analysis</span>
            </button>
          </Tooltip>

          {/* Fast Generate */}
          {/* Fast Generate */}
          <Tooltip content="Rapid AI generation optimized for speed. Use for simple formatting or short text tasks." position="bottom">
            <button
                onClick={() => onAIGenerate('fast')}
                disabled={isLoading || !userContent.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] border border-amber-500/20 hover:border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
                <span className="group-hover:scale-125 transition-transform">⚡</span>
                <span className="text-sm">Fast Compile</span>
            </button>
          </Tooltip>

          {/* Deep Think */}
          {/* Deep Think */}
          <Tooltip content={`Advanced AI reasoning using Gemini ${modelFamily === '2.5' ? '2.5 Pro' : '3.1 Pro'} with extended thinking. Best for complex logic, algorithms, and deep analysis.`} position="bottom">
            <button
                onClick={() => onAIGenerate('thinking')}
                disabled={isLoading || !userContent.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.2)] border border-emerald-500/20 hover:border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
                <span className="group-hover:scale-125 transition-transform">🧠</span>
                <span className="text-sm">Deep Think</span>
            </button>
          </Tooltip>
      </div>
      </div>

    </div>
  );
};

export default React.memo(PromptForm);