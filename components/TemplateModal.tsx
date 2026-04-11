import React, { useState } from 'react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, content: string) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3 || name.length > 30) {
      setError('Name must be between 3 and 30 characters');
      return;
    }
    if (description.length > 100) {
      setError('Description must be less than 100 characters');
      return;
    }
    if (!content.trim()) {
      setError('Template content is required');
      return;
    }
    onSave(name, description, content);
    setName('');
    setDescription('');
    setContent('');
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05050A]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.2)] w-[95%] sm:w-full max-w-lg p-5 sm:p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-cyan-400 font-mono tracking-wide">INITIALIZE PROTOCOL</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 text-sm rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Protocol Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-base text-slate-200 placeholder-slate-500"
              placeholder="e.g., My SEO Template"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-base text-slate-200 placeholder-slate-500"
              placeholder="Short description of what this does"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Protocol Directives</label>
            <p className="text-xs text-slate-400 mb-2">
              Use <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded border border-slate-700/50 font-mono">{`{{content}}`}</code> to indicate where input payload goes.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none font-mono text-sm sm:text-sm text-[16px] text-slate-200 placeholder-slate-500"
              placeholder="Example: SYSTEM OVERRIDE: {{content}}"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-semibold uppercase tracking-wide text-sm"
            >
              Abort
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono font-bold rounded-lg hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all uppercase tracking-widest text-sm"
            >
              Commit Protocol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;