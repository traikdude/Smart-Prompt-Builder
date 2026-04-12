import React, { useRef, useState } from 'react';
import { AttachmentInput } from '../types';

interface AttachmentZoneProps {
  attachments: AttachmentInput[];
  onAttachmentsChange: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export const AttachmentZone: React.FC<AttachmentZoneProps> = ({ attachments, onAttachmentsChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentInput[] = [];
    
    Array.from(files).forEach(file => {
      // Create a pending attachment
      const attachmentId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newAttachment: AttachmentInput = {
        id: attachmentId,
        type: 'file',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        file: file,
        status: 'loading'
      };
      
      newAttachments.push(newAttachment);

      // Process file to Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        onAttachmentsChange(prev => 
          prev.map(att => 
            att.id === attachmentId 
              ? { ...att, base64: base64Data, status: 'ready' }
              : att
          )
        );
      };
      reader.onerror = () => {
        onAttachmentsChange(prev => 
          prev.map(att => 
            att.id === attachmentId 
              ? { ...att, status: 'error', errorMessage: 'Failed to read file' }
              : att
          )
        );
      };
      reader.readAsDataURL(file);
    });

    onAttachmentsChange([...attachments, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlValue.trim()) {
      setShowUrlInput(false);
      return;
    }

    let parsedUrl = urlValue.trim();
    if (!parsedUrl.startsWith('http')) {
      parsedUrl = 'https://' + parsedUrl;
    }

    const attachmentId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAttachment: AttachmentInput = {
      id: attachmentId,
      type: 'url',
      name: parsedUrl,
      status: 'loading'
    };

    onAttachmentsChange([...attachments, newAttachment]);
    setUrlValue('');
    setShowUrlInput(false);

    // Call GAS backend to scrape URL
    // @ts-ignore
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      // @ts-ignore
      google.script.run
        .withSuccessHandler((response: any) => {
          if (response.success) {
            onAttachmentsChange(prev => 
              prev.map(att => 
                att.id === attachmentId 
                  ? { ...att, urlContent: response.content, status: 'ready' }
                  : att
              )
            );
          } else {
            onAttachmentsChange(prev => 
              prev.map(att => 
                att.id === attachmentId 
                  ? { ...att, status: 'error', errorMessage: response.error || 'Failed to scrape URL' }
                  : att
              )
            );
          }
        })
        .withFailureHandler((error: any) => {
          onAttachmentsChange(prev => 
            prev.map(att => 
              att.id === attachmentId 
                ? { ...att, status: 'error', errorMessage: error.toString() }
                : att
            )
          );
        })
        .fetchPageContent(parsedUrl);
    } else {
      // Local dev mock
      setTimeout(() => {
        onAttachmentsChange(prev => 
          prev.map(att => 
            att.id === attachmentId 
              ? { ...att, urlContent: 'Mock scraped content for ' + parsedUrl, status: 'ready' }
              : att
          )
        );
      }, 1500);
    }
  };

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter(a => a.id !== id));
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="mt-4 border-t border-slate-700/50 pt-4">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple
        accept="image/*, audio/*, application/pdf" 
      />

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="flex items-center gap-2 mb-3 bg-slate-900/60 p-2 rounded-lg border border-slate-700">
          <input
            type="text"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1 bg-transparent border-none text-sm text-slate-200 focus:outline-none focus:ring-0 px-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddUrl();
              if (e.key === 'Escape') setShowUrlInput(false);
            }}
          />
          <button 
            onClick={handleAddUrl}
            className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded text-xs font-bold transition-colors"
          >
            Scrape
          </button>
          <button 
            onClick={() => setShowUrlInput(false)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Context Files:</span>
        <button 
          onClick={handleFileClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm hover:border-slate-500"
          title="Attach Images, Audio, or PDFs (Processed Locally)"
        >
          <span>📎</span> Attach File
        </button>
        <button 
          onClick={() => setShowUrlInput(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm hover:border-slate-500"
          title="Scrape text from a web URL"
        >
          <span>🌐</span> Add URL
        </button>
      </div>

      {/* Attachment Chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
          {attachments.map(att => (
            <div key={att.id} className="group relative flex items-center gap-2 bg-slate-800 border border-slate-600 px-3 py-1.5 rounded-lg max-w-[200px] sm:max-w-xs transition-all hover:bg-slate-700 hover:border-slate-500">
              <div className="text-sm">
                {att.type === 'file' ? (att.mimeType?.includes('image') ? '🖼️' : att.mimeType?.includes('audio') ? '🎵' : '📄') : '🌐'}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-xs font-medium text-slate-200 truncate">{att.name}</p>
                <div className="flex items-center gap-2">
                  {att.status === 'loading' && <span className="text-[10px] text-amber-400 animate-pulse">Processing...</span>}
                  {att.status === 'error' && <span className="text-[10px] text-red-400 truncate" title={att.errorMessage}>Error</span>}
                  {att.status === 'ready' && <span className="text-[10px] text-emerald-400">Ready</span>}
                  {att.type === 'file' && att.size && <span className="text-[10px] text-slate-500">{formatSize(att.size)}</span>}
                </div>
              </div>
              
              <button 
                onClick={() => handleRemove(att.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-70 group-hover:opacity-100"
                title="Remove attachment"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
