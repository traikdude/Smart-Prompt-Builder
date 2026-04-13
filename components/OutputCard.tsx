import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputCardProps {
  content: string | null;
  onCopy: () => void;
  onClear: () => void;
  onExport: (format: 'txt' | 'md') => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const FONTS = [
  { name: 'Inter', value: 'font-inter', family: "'Inter', sans-serif" },
  { name: 'Fira Code', value: 'font-fira', family: "'Fira Code', monospace" },
];

const OutputCard: React.FC<OutputCardProps> = ({ content, onCopy, onClear, onExport, showToast }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (vote: 'up' | 'down') => {
    if (feedback) return; // Already voted
    setFeedback(vote);
    if (showToast) {
      showToast(vote === 'up' ? 'Thanks for the positive feedback! 🙌' : 'Got it — we\'ll keep improving! 🛠️', 'info');
    }
  };

  if (!content) return null;

  // Content analytics
  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;

  return (
    <div className="glass-panel rounded-2xl p-0 overflow-hidden animate-fade-in-up mb-24 relative">
      {/* 🌈 Rainbow top bar */}
      <div className="rainbow-bar"></div>
      
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
            <span className="text-xl sm:text-2xl">📋</span> 
            <span 
              className="bg-clip-text text-transparent font-mono tracking-wide uppercase text-sm sm:text-base"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FF6B9D, #A855F7, #22D3EE)',
              }}
            >Output Payload</span>
            {/* Output stats */}
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full hidden sm:inline-block">
              {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
            </span>
          </h2>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
            >
              Clear
            </button>
            
            {/* Font Dropdown */}
            <div className="relative">
               <button
                 onClick={() => setShowFontMenu(!showFontMenu)}
                 className="flex items-center justify-center h-10 px-3 gap-2 bg-slate-800 hover:bg-slate-700 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 text-slate-300 rounded-xl transition-all font-medium text-sm"
                 title="Change Font"
               >
                 <span className="text-lg">Aa</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {showFontMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] py-2 z-20 border border-slate-700">
                   <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography</div>
                   {FONTS.map(font => (
                     <button
                        key={font.value}
                        onClick={() => { setCurrentFont(font); setShowFontMenu(false); }}
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition-colors ${currentFont.value === font.value ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'}`}
                        style={{ fontFamily: font.family }}
                     >
                       {font.name}
                       {currentFont.value === font.value && (
                         <span className="ml-auto text-amber-400">✓</span>
                       )}
                     </button>
                   ))}
                 </div>
               )}
               {showFontMenu && <div className="fixed inset-0 z-10" onClick={() => setShowFontMenu(false)} />}
            </div>

            {/* Export Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50 text-slate-300 rounded-xl transition-all"
                title="Save to file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
              {showExportMenu && (
                 <div className="absolute right-0 mt-2 w-40 bg-slate-900 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.15)] py-2 z-20 border border-slate-700">
                   <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Export As</div>
                   <button
                      onClick={() => { onExport('txt'); setShowExportMenu(false); }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                   >
                     <span className="w-6 text-center mr-2 font-mono text-xs border border-slate-700 rounded bg-slate-800 text-slate-400">TXT</span> Text File
                   </button>
                   <button
                      onClick={() => { onExport('md'); setShowExportMenu(false); }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-purple-400 transition-colors"
                   >
                     <span className="w-6 text-center mr-2 font-mono text-xs border border-slate-700 rounded bg-slate-800 text-slate-400">MD</span> Markdown
                   </button>
                 </div>
              )}
              {showExportMenu && (
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              )}
            </div>

            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(255,107,157,0.2))',
                border: '1px solid rgba(168,85,247,0.3)',
                color: '#E9D5FF',
                boxShadow: '0 0 12px rgba(168,85,247,0.15)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 p-4 sm:p-6 max-h-[600px] overflow-y-auto shadow-inner transition-all duration-300">
          <div 
            className="prose prose-sm sm:prose-base max-w-none text-slate-300 prose-headings:font-bold prose-headings:text-slate-100 prose-h1:text-pink-400 prose-h2:text-purple-400 prose-h3:text-amber-400 prose-a:text-cyan-400 prose-strong:text-slate-100 prose-code:text-amber-400 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-700/50 prose-pre:shadow-lg prose-pre:rounded-xl prose-p:text-slate-300"
            style={{ fontFamily: currentFont.family }}
          >
            <ReactMarkdown
              components={{
                code(props) {
                  const {children, className, node, ...rest} = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontFamily: "'Fira Code', monospace" }}
                    />
                  ) : (
                    <code {...rest} className={`${className} bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700/50 text-sm font-mono`}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* ── Feedback Row ── */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-700/30">
          <span className="text-xs text-slate-500 font-medium">
            {feedback ? (
              <span className="flex items-center gap-1.5 text-slate-400 animate-fade-in-up">
                <span className={feedback === 'up' ? 'text-emerald-400' : 'text-pink-400'}>
                  {feedback === 'up' ? '👍' : '👎'}
                </span>
                Feedback recorded — thank you!
              </span>
            ) : 'Was this output helpful?'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback('up')}
              disabled={!!feedback}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                feedback === 'up'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 scale-110'
                  : feedback === 'down'
                  ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400 hover:scale-105'
              }`}
              title="This was helpful"
            >
              👍 <span className="hidden sm:inline">Helpful</span>
            </button>
            <button
              onClick={() => handleFeedback('down')}
              disabled={!!feedback}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                feedback === 'down'
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 scale-110'
                  : feedback === 'up'
                  ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-pink-500/10 hover:border-pink-500/40 hover:text-pink-400 hover:scale-105'
              }`}
              title="This needs improvement"
            >
              👎 <span className="hidden sm:inline">Improve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputCard;