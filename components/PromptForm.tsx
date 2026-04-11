import React from 'react';
import { PromptTemplate } from '../types';
import { CHAR_LIMIT_OPTIONS } from '../constants';

interface PromptFormProps {
  templates: PromptTemplate[];
  selectedTemplateId: string;
  userContent: string;
  includeExamples: boolean;
  charLimit?: number | null;
  onTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExamplesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCharLimitChange?: (limit: number | null) => void;
  onGenerate: () => void;
  onAIGenerate: (mode: 'smart' | 'fast' | 'thinking') => void;
  isLoading: boolean;
  onNewTemplate: () => void;
  onLoadSyntaxTest: () => void;
  onDeleteTemplate?: (id: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  templates,
  selectedTemplateId,
  userContent,
  includeExamples,
  charLimit,
  onTemplateChange,
  onContentChange,
  onExamplesChange,
  onCharLimitChange,
  onGenerate,
  onAIGenerate,
  isLoading,
  onNewTemplate,
  onLoadSyntaxTest,
  onDeleteTemplate
}) => {
  const currentTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-8 mb-6 sm:mb-8 border border-white/60 relative overflow-hidden animate-fade-in-up">
      {/* Top decorative gradient line with shimmer */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B9D] via-[#FF8E53] to-[#6B7BFF] animate-pulse"></div>

      {/* Template Selector */}
      <div className="mb-6 sm:mb-8 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="template" className="block text-sm font-bold text-gray-700 tracking-wide flex items-center gap-2">
            SELECT TEMPLATE <span className="text-xl animate-bounce">⚡</span>
          </label>
          <button
            onClick={onNewTemplate}
            className="text-[10px] sm:text-xs font-bold text-[#6B7BFF] hover:text-white hover:bg-[#6B7BFF] flex items-center gap-1 bg-[#6B7BFF]/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            NEW
          </button>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <div className="relative flex-grow group">
            <select
              id="template"
              value={selectedTemplateId}
              onChange={onTemplateChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/50 hover:bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent text-gray-800 font-medium transition-all cursor-pointer group-hover:border-[#FFB3C6] shadow-sm group-hover:shadow-md text-sm sm:text-base"
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.isCustom ? `★ ${template.name}` : template.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#FF6B9D] group-hover:scale-110 transition-transform">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {currentTemplate?.isCustom && onDeleteTemplate && (
            <button
              onClick={() => {
                if(confirm('Are you sure you want to delete this template?')) {
                  onDeleteTemplate(currentTemplate.id);
                }
              }}
              className="px-3 sm:px-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-100 hover:shadow-lg hover:rotate-3"
              title="Delete Custom Template"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Template Preview (Collapsible) - Hidden on very small screens if needed, but kept here for now */}
      {currentTemplate && (
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-[#6B7BFF]/5 to-[#8E53FF]/5 border border-[#6B7BFF]/20 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-inner hover:scale-[1.01] origin-center">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-[#6B7BFF] animate-[bounce_2s_infinite] hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-800 font-bold">{currentTemplate.name}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{currentTemplate.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Content */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="content" className="block text-sm font-bold text-gray-700 tracking-wide flex items-center gap-2">
            YOUR CONTENT <span className="text-xl">✍️</span>
          </label>
          <button
             onClick={onLoadSyntaxTest}
             className="text-[10px] sm:text-xs font-bold text-gray-500 hover:text-white bg-gray-100 hover:bg-[#FF6B9D] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all hover:shadow-md"
          >
            Load Code Example
          </button>
        </div>
        <textarea
          id="content"
          value={userContent}
          onChange={onContentChange}
          placeholder="Paste or type what you need help with here..."
          className="w-full h-40 sm:h-48 px-4 sm:px-5 py-3 sm:py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FF6B9D]/20 focus:border-[#FF6B9D] text-gray-800 placeholder-gray-400 resize-none transition-all font-mono text-sm sm:text-sm shadow-inner hover:bg-white text-[16px] sm:text-sm"
        />
        
        {/* Controls Toolbar - Stacked on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 bg-white/50 p-3 sm:p-2 rounded-xl border border-gray-100">
          
          {/* Include Examples Toggle */}
          <label className="flex items-center gap-2 cursor-pointer group select-none hover:bg-white px-2 py-1 rounded-md transition-all">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={includeExamples} 
                onChange={onExamplesChange} 
                className="sr-only peer"
              />
              <div className="block bg-gray-200 w-10 h-6 rounded-full peer-checked:bg-[#FF6B9D] transition-colors shadow-inner"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow"></div>
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-[#FF6B9D] transition-colors">
              Request Variations
            </span>
          </label>

          {/* Separator - Hidden on mobile */}
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          {/* Character Limiter Dropdown */}
          {onCharLimitChange && (
            <div className="flex items-center justify-between sm:justify-start gap-2 group w-full sm:w-auto">
              <label htmlFor="charLimit" className="text-sm font-medium text-gray-600 group-hover:text-[#6B7BFF] transition-colors whitespace-nowrap">
                Target Length:
              </label>
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  id="charLimit"
                  value={charLimit || ''}
                  onChange={(e) => onCharLimitChange(e.target.value ? Number(e.target.value) : null)}
                  className="w-full sm:w-auto appearance-none bg-gray-100 hover:bg-white border border-gray-200 hover:border-[#6B7BFF] text-gray-700 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6B7BFF] transition-all cursor-pointer font-medium"
                >
                  <option value="">No Limit</option>
                  {CHAR_LIMIT_OPTIONS.map(count => (
                    <option key={count} value={count}>{count.toLocaleString()} chars</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-md transition-colors hidden sm:inline-block ${userContent.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {userContent.length} chars
          </span>
          {/* Mobile Char Count */}
          <div className={`sm:hidden text-xs font-medium text-right mt-1 ${userContent.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {userContent.length} characters
          </div>
        </div>
      </div>

      {/* Standard Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !userContent.trim()}
        className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg tracking-wide relative overflow-hidden group
          ${isLoading || !userContent.trim() 
            ? 'bg-gray-300 cursor-not-allowed shadow-none' 
            : 'btn-joyful'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            GENERATING...
          </>
        ) : (
          <>
            <span className="relative z-10 group-hover:scale-105 transition-transform">GENERATE PROMPT</span>
            <span className="text-xl sm:text-2xl relative z-10 group-hover:rotate-12 transition-transform">✨</span>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
          </>
        )}
      </button>

      {/* AI Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          {/* Gemini Intelligence */}
          <button
              onClick={() => onAIGenerate('smart')}
              disabled={isLoading || !userContent.trim()}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-700 rounded-xl font-bold transition-all shadow-sm hover:shadow border border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
              <span className="group-hover:scale-110 transition-transform">✨</span>
              <span className="text-sm">Smart Generate</span>
          </button>

          {/* Fast AI */}
          <button
              onClick={() => onAIGenerate('fast')}
              disabled={isLoading || !userContent.trim()}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 text-orange-700 rounded-xl font-bold transition-all shadow-sm hover:shadow border border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
              <span className="group-hover:scale-110 transition-transform">⚡</span>
              <span className="text-sm">Fast Generate</span>
          </button>

          {/* Thinking Mode */}
          <button
              onClick={() => onAIGenerate('thinking')}
              disabled={isLoading || !userContent.trim()}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100 text-purple-700 rounded-xl font-bold transition-all shadow-sm hover:shadow border border-purple-100 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
              <span className="group-hover:scale-110 transition-transform">🧠</span>
              <span className="text-sm">Deep Think</span>
          </button>
      </div>

    </div>
  );
};

export default PromptForm;