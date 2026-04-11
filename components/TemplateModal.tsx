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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A12]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-[95%] sm:w-full max-w-lg p-5 sm:p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 0 40px rgba(168,85,247,0.15), 0 0 80px rgba(255,107,157,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Rainbow top bar */}
        <div className="rainbow-bar -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 rounded-t-2xl"></div>
        
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🆕</span>
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF6B9D, #A855F7, #22D3EE)' }}
            >Create Template</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-pink-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/30 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-base text-slate-200 placeholder-slate-500 transition-all hover:border-slate-600"
              placeholder="e.g., My SEO Template"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-base text-slate-200 placeholder-slate-500 transition-all hover:border-slate-600"
              placeholder="Short description of what this does"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Template Content</label>
            <p className="text-xs text-slate-400 mb-2">
              Use <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50 font-mono">{`{{content}}`}</code> to mark where input goes.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm sm:text-sm text-[16px] text-slate-200 placeholder-slate-500 transition-all hover:border-slate-600"
              placeholder="Example: Rewrite this text: {{content}}"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 btn-joyful rounded-xl text-sm tracking-wide"
            >
              ✨ Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;