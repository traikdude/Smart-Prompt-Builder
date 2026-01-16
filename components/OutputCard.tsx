import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputCardProps {
  content: string | null;
  onCopy: () => void;
  onClear: () => void;
  onExport: (format: 'txt' | 'md') => void;
}

const FONTS = [
  { name: 'Modern Sans', value: 'font-poppins', family: "'Poppins', sans-serif" },
  { name: 'Clean Inter', value: 'font-inter', family: "'Inter', sans-serif" },
  { name: 'Elegant Serif', value: 'font-playfair', family: "'Playfair Display', serif" },
  { name: 'Readable Serif', value: 'font-merriweather', family: "'Merriweather', serif" },
  { name: 'Bold Oswald', value: 'font-oswald', family: "'Oswald', sans-serif" },
  { name: 'Tech Mono', value: 'font-mono', family: "'Roboto Mono', monospace" }
];

const OutputCard: React.FC<OutputCardProps> = ({ content, onCopy, onClear, onExport }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);

  if (!content) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-0 overflow-hidden animate-fade-in-up mb-24 relative">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#6B7BFF] via-[#FF6B9D] to-[#FF8E53]"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-2xl">📋</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Generated Prompt</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear
            </button>
            
            {/* Font Dropdown */}
            <div className="relative">
               <button
                 onClick={() => setShowFontMenu(!showFontMenu)}
                 className="flex items-center justify-center h-10 px-3 gap-2 bg-gray-50 hover:bg-[#FCE7F3] hover:text-[#FF6B9D] border border-gray-200 hover:border-[#FBCFE8] text-gray-600 rounded-xl transition-all font-medium text-sm"
                 title="Change Font"
               >
                 <span className="text-lg">Aa</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {showFontMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 ring-1 ring-black ring-opacity-5">
                   <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Typography</div>
                   {FONTS.map(font => (
                     <button
                        key={font.value}
                        onClick={() => { setCurrentFont(font); setShowFontMenu(false); }}
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${currentFont.value === font.value ? 'text-[#FF6B9D] bg-pink-50' : 'text-gray-700'}`}
                        style={{ fontFamily: font.family }}
                     >
                       {font.name}
                       {currentFont.value === font.value && (
                         <span className="ml-auto text-[#FF6B9D]">✓</span>
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
                className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-[#E0F2FE] hover:text-[#0284C7] border border-gray-200 hover:border-[#BAE6FD] text-gray-600 rounded-xl transition-all"
                title="Save to file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
              {showExportMenu && (
                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 ring-1 ring-black ring-opacity-5">
                   <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Export As</div>
                   <button
                      onClick={() => { onExport('txt'); setShowExportMenu(false); }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6B7BFF] transition-colors"
                   >
                     <span className="w-6 text-center mr-2 font-mono text-xs border border-gray-200 rounded bg-gray-50">TXT</span> Text File
                   </button>
                   <button
                      onClick={() => { onExport('md'); setShowExportMenu(false); }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF6B9D] transition-colors"
                   >
                     <span className="w-6 text-center mr-2 font-mono text-xs border border-gray-200 rounded bg-gray-50">MD</span> Markdown
                   </button>
                 </div>
              )}
              {showExportMenu && (
                  <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowExportMenu(false)}
                  />
              )}
            </div>

            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
          </div>
        </div>
        
        <div className="bg-[#f8fafc] rounded-xl border border-gray-200 p-6 max-h-[600px] overflow-y-auto shadow-inner transition-all duration-300">
          <div 
            className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-h1:text-[#6B7BFF] prose-h2:text-[#FF6B9D] prose-h3:text-[#FF8E53] prose-a:text-[#6B7BFF] prose-strong:text-gray-900 prose-code:text-[#FF3D7F] prose-pre:bg-[#1e1e1e] prose-pre:shadow-lg prose-pre:rounded-xl"
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
                      customStyle={{ margin: 0, padding: '1.5rem', borderRadius: '0.75rem', fontSize: '0.9rem', fontFamily: "'Fira Code', monospace" }} // Keep code monospace always
                    />
                  ) : (
                    <code {...rest} className={`${className} bg-pink-50 text-[#FF3D7F] px-1.5 py-0.5 rounded border border-pink-100 text-sm font-mono`}>
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
      </div>
    </div>
  );
};

export default OutputCard;