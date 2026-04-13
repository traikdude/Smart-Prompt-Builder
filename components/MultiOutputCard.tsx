import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import confetti from 'canvas-confetti';

// ═══════════════════════════════════════════
// 🎛️ Types
// ═══════════════════════════════════════════

export interface OutputPayload {
  id: string;
  label: string;
  icon: string;
  content: string;
}

interface MultiOutputCardProps {
  payloads: OutputPayload[];
  onClear: () => void;
  onExport: (format: 'txt' | 'md') => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

// ═══════════════════════════════════════════
// 🎯 Individual Payload Card
// ═══════════════════════════════════════════

const FONTS = [
  { name: 'Inter', value: 'font-inter', family: "'Inter', sans-serif" },
  { name: 'Fira Code', value: 'font-fira', family: "'Fira Code', monospace" },
];

const PayloadCard: React.FC<{
  payload: OutputPayload;
  index: number;
  total: number;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ payload, index, total, showToast }) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (vote: 'up' | 'down') => {
    if (feedback) return;
    setFeedback(vote);
    showToast(vote === 'up' ? `Rated helpful! 🙌` : `Got it — we'll keep improving! 🛠️`, 'info');
  };

  const wordCount = payload.content.trim().split(/\s+/).length;
  const charCount = payload.content.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload.content);
      showToast(`Copied "${payload.label}" payload! ✅`);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#6B7BFF', '#A5B4FC', '#818CF8'],
        disableForReducedMotion: true,
      });
    } catch {
      showToast('Failed to copy payload', 'error');
    }
  };

  const handleExport = (format: 'txt' | 'md') => {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const safeName = payload.label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const blob = new Blob([payload.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload_${safeName}_${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported "${payload.label}" as .${format}`);
  };

  // Gradient color rotation for visual distinction between cards
  const gradientColors = [
    { from: '#FF6B9D', to: '#A855F7', accent: 'pink' },
    { from: '#22D3EE', to: '#6366F1', accent: 'cyan' },
    { from: '#FBBF24', to: '#F97316', accent: 'amber' },
    { from: '#34D399', to: '#059669', accent: 'emerald' },
    { from: '#A78BFA', to: '#EC4899', accent: 'violet' },
    { from: '#F472B6', to: '#FB923C', accent: 'rose' },
  ];
  const colorSet = gradientColors[index % gradientColors.length];

  const accentClasses: Record<string, { badge: string; border: string; glow: string }> = {
    pink:    { badge: 'bg-pink-500/15 text-pink-400 border-pink-500/30', border: 'border-pink-500/20', glow: 'shadow-[0_0_20px_rgba(255,107,157,0.08)]' },
    cyan:    { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', border: 'border-cyan-500/20', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.08)]' },
    amber:   { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', border: 'border-amber-500/20', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.08)]' },
    emerald: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', border: 'border-emerald-500/20', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.08)]' },
    violet:  { badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30', border: 'border-violet-500/20', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.08)]' },
    rose:    { badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30', border: 'border-rose-500/20', glow: 'shadow-[0_0_20px_rgba(244,114,182,0.08)]' },
  };
  const accent = accentClasses[colorSet.accent];

  return (
    <div
      className={`glass-panel rounded-2xl overflow-hidden animate-fade-in-up relative transition-all duration-300 hover:scale-[1.005] ${accent.glow}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Colored accent bar at top */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${colorSet.from}, ${colorSet.to})` }}
      />

      <div className="p-4 sm:p-6">
        {/* ── Header Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Payload icon/index badge */}
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl text-lg font-bold flex-shrink-0 border"
              style={{
                background: `linear-gradient(135deg, ${colorSet.from}22, ${colorSet.to}22)`,
                borderColor: `${colorSet.from}44`,
              }}
            >
              {payload.icon || `${index + 1}`}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate flex items-center gap-2">
                {payload.label}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${accent.badge}`}>
                  {index + 1}/{total}
                </span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
              </span>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-2 justify-end flex-shrink-0">
            {/* Collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-9 h-9 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-xl transition-all"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Font selector */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="flex items-center justify-center w-9 h-9 bg-slate-800/80 hover:bg-slate-700 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 text-slate-400 rounded-xl transition-all text-sm font-bold"
                title="Change Font"
              >
                Aa
              </button>
              {showFontMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] py-2 z-20 border border-slate-700">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Typography</div>
                  {FONTS.map(font => (
                    <button
                      key={font.value}
                      onClick={() => { setCurrentFont(font); setShowFontMenu(false); }}
                      className={`flex items-center w-full text-left px-3 py-2 text-sm hover:bg-slate-800 transition-colors ${currentFont.value === font.value ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'}`}
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                      {currentFont.value === font.value && <span className="ml-auto text-amber-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
              {showFontMenu && <div className="fixed inset-0 z-10" onClick={() => setShowFontMenu(false)} />}
            </div>

            {/* Export dropdown */}
            <ExportDropdown onExport={handleExport} />

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${colorSet.from}33, ${colorSet.to}33)`,
                border: `1px solid ${colorSet.from}55`,
                color: '#E9D5FF',
                boxShadow: `0 0 12px ${colorSet.from}22`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
          </div>
        </div>

        {/* ── Content Body ── */}
        <div
          className={`transition-all duration-400 ease-in-out overflow-hidden ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
          }`}
        >
          <div className={`bg-slate-900/80 rounded-xl border ${accent.border} p-4 sm:p-5 max-h-[500px] overflow-y-auto shadow-inner`}>
            <div
              className="prose prose-sm max-w-none text-slate-300 prose-headings:font-bold prose-headings:text-slate-100 prose-h1:text-pink-400 prose-h2:text-purple-400 prose-h3:text-amber-400 prose-a:text-cyan-400 prose-strong:text-slate-100 prose-code:text-amber-400 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-700/50 prose-pre:shadow-lg prose-pre:rounded-xl prose-p:text-slate-300"
              style={{ fontFamily: currentFont.family }}
            >
              <ReactMarkdown
                components={{
                  code(props) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.85rem',
                          fontFamily: "'Fira Code', monospace",
                        }}
                      />
                    ) : (
                      <code
                        {...rest}
                        className={`${className} bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700/50 text-sm font-mono`}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {payload.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* ── Feedback Row ── */}
        <div className={`flex items-center justify-between mt-4 pt-4 border-t border-slate-700/20 ${isCollapsed ? 'hidden' : ''}`}>
          <span className="text-xs text-slate-500 font-medium">
            {feedback ? (
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className={feedback === 'up' ? 'text-emerald-400' : 'text-pink-400'}>
                  {feedback === 'up' ? '👍' : '👎'}
                </span>
                Feedback recorded!
              </span>
            ) : 'Rate this payload'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleFeedback('up')}
              disabled={!!feedback}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                feedback === 'up'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 scale-110'
                  : feedback === 'down'
                  ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400 hover:scale-105'
              }`}
              title="This was helpful"
            >
              👍
            </button>
            <button
              onClick={() => handleFeedback('down')}
              disabled={!!feedback}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                feedback === 'down'
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 scale-110'
                  : feedback === 'up'
                  ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-pink-500/10 hover:border-pink-500/40 hover:text-pink-400 hover:scale-105'
              }`}
              title="This needs improvement"
            >
              👎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// 📦 Export Dropdown sub-component
// ═══════════════════════════════════════════

const ExportDropdown: React.FC<{ onExport: (format: 'txt' | 'md') => void }> = ({ onExport }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center justify-center w-9 h-9 bg-slate-800/80 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50 text-slate-400 rounded-xl transition-all"
        title="Export"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-36 bg-slate-900 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.15)] py-2 z-20 border border-slate-700">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Export As</div>
          <button
            onClick={() => { onExport('txt'); setShowMenu(false); }}
            className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          >
            <span className="w-5 text-center mr-2 font-mono text-[10px] border border-slate-700 rounded bg-slate-800 text-slate-400">TXT</span> Text
          </button>
          <button
            onClick={() => { onExport('md'); setShowMenu(false); }}
            className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-purple-400 transition-colors"
          >
            <span className="w-5 text-center mr-2 font-mono text-[10px] border border-slate-700 rounded bg-slate-800 text-slate-400">MD</span> Markdown
          </button>
        </div>
      )}
      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />}
    </div>
  );
};

// ═══════════════════════════════════════════
// 🎛️ Master Multi-Output Card Container
// ═══════════════════════════════════════════

const MultiOutputCard: React.FC<MultiOutputCardProps> = ({ payloads, onClear, onExport, showToast }) => {
  if (payloads.length === 0) return null;

  const totalWords = payloads.reduce((acc, p) => acc + p.content.trim().split(/\s+/).length, 0);
  const totalChars = payloads.reduce((acc, p) => acc + p.content.length, 0);

  const handleCopyAll = async () => {
    const fullText = payloads
      .map(p => `━━━ ${p.icon} ${p.label} ━━━\n\n${p.content}`)
      .join('\n\n\n');
    try {
      await navigator.clipboard.writeText(fullText);
      showToast('All payloads copied! ✅');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B9D', '#FF8E53', '#6B7BFF', '#FF3D7F', '#FFB3C6'],
        disableForReducedMotion: true,
      });
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="space-y-0 mb-24 animate-fade-in-up">
      {/* ── Aggregate Header ── */}
      <div className="glass-panel rounded-t-2xl p-4 sm:p-5 border-b border-slate-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
            <span className="text-xl sm:text-2xl">📋</span>
            <span
              className="bg-clip-text text-transparent font-mono tracking-wide uppercase text-sm sm:text-base"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF6B9D, #A855F7, #22D3EE)' }}
            >
              Output Payloads
            </span>
            {/* Count badge */}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {payloads.length} {payloads.length === 1 ? 'payload' : 'payloads'}
            </span>
            {/* Aggregate stats */}
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full hidden sm:inline-block">
              {totalWords.toLocaleString()} words · {totalChars.toLocaleString()} chars
            </span>
          </h2>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
            >
              Clear All
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(255,107,157,0.2))',
                border: '1px solid rgba(168,85,247,0.3)',
                color: '#E9D5FF',
                boxShadow: '0 0 12px rgba(168,85,247,0.15)',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy All
            </button>
          </div>
        </div>
      </div>

      {/* ── Individual Payload Cards ── */}
      <div className="space-y-4 pt-4">
        {payloads.map((payload, i) => (
          <PayloadCard
            key={payload.id}
            payload={payload}
            index={i}
            total={payloads.length}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiOutputCard;
