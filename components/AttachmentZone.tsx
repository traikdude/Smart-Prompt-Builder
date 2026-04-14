import React, { useRef, useState, useEffect } from 'react';
import { AttachmentInput } from '../types';

interface AttachmentZoneProps {
  attachments: AttachmentInput[];
  onAttachmentsChange: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export const AttachmentZone: React.FC<AttachmentZoneProps> = ({ attachments, onAttachmentsChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Global Drag and Drop handlers
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (dragCounter === 1) setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [attachments]); // Add attachments to avoid stale state in closure if necessary, though set state usually handles func updater

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    if (!files.length) return;

    const newAttachments: AttachmentInput[] = [];
    
    files.forEach(file => {
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

    onAttachmentsChange(prev => [...prev, ...newAttachments]);
    
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

    onAttachmentsChange(prev => [...prev, newAttachment]);
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
    onAttachmentsChange(prev => prev.filter(a => a.id !== id));
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Global Drag & Drop Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md border-4 border-dashed border-cyan-500/50 pointer-events-none transition-all duration-300">
          <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)] pointer-events-auto">
            <div className="text-5xl mb-4 animate-bounce">📁</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Drop files anywhere to attach
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Images, Docs, and Audio supported</p>
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-slate-700/50 pt-4 relative">
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
              className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded text-xs font-bold transition-all shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm hover:border-slate-500 focus:ring-2 focus:ring-cyan-500/50"
            title="Attach Images, Audio, or PDFs (Processed Locally)"
          >
            <span className="text-cyan-400">📎</span> Attach File
          </button>
          <button 
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm hover:border-slate-500 focus:ring-2 focus:ring-pink-500/50"
            title="Scrape text from a web URL"
          >
            <span className="text-pink-400">🌐</span> Add URL
          </button>
        </div>

        {/* Attachment Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            {attachments.map(att => {
              const isImage = att.type === 'file' && att.mimeType?.includes('image');
              const isAudio = att.type === 'file' && att.mimeType?.includes('audio');
              const isUrl = att.type === 'url';

              return (
                <div key={att.id} className="group relative flex items-center gap-3 bg-slate-800/80 border border-slate-600 px-3 py-2 rounded-xl max-w-[200px] sm:max-w-xs transition-all hover:bg-slate-700/80 hover:border-cyan-500/50 hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                  
                  {/* Media / Icon Indicator */}
                  <div className="flex-shrink-0 relative flex items-center justify-center">
                    {isImage && att.base64 ? (
                      <img src={att.base64} alt={att.name} className="w-9 h-9 object-cover rounded-lg border border-slate-600/50 shadow-sm transition-transform group-hover:scale-105" />
                    ) : isAudio ? (
                      <div className="w-9 h-9 rounded-lg bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
                        <div className="flex gap-1 items-end h-5">
                          <div className="w-[3px] bg-emerald-400 rounded-t animate-[pulse_1s_ease-in-out_infinite]"></div>
                          <div className="w-[3px] bg-emerald-400 rounded-t animate-[pulse_1.2s_ease-in-out_infinite_200ms]"></div>
                          <div className="w-[3px] bg-emerald-400 rounded-t animate-[pulse_0.8s_ease-in-out_infinite_400ms]"></div>
                          <div className="w-[3px] bg-emerald-400 rounded-t animate-[pulse_1.1s_ease-in-out_infinite_100ms]"></div>
                        </div>
                      </div>
                    ) : isUrl ? (
                      <div className="w-9 h-9 rounded-lg bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center overflow-hidden p-1.5">
                        <img 
                          src={getFaviconUrl(att.name) || ''} 
                          alt="Web" 
                          className="w-full h-full object-contain" 
                          onError={(e) => { 
                            e.currentTarget.style.display = 'none'; 
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block'; 
                          }} 
                        />
                        <span className="text-xl hidden" style={{ display: 'none' }}>🌐</span>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
                        <span className="text-xl opacity-80">📄</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-6 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-slate-200 truncate">{att.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {att.status === 'loading' && <span className="text-[10px] text-amber-400 font-medium animate-pulse flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Loading</span>}
                      {att.status === 'error' && <span className="text-[10px] text-red-400 font-medium truncate" title={att.errorMessage}>Failed</span>}
                      {att.status === 'ready' && <span className="text-[10px] text-cyan-400 font-medium">Ready</span>}
                      {att.type === 'file' && att.size && <span className="text-[10px] text-slate-500">{formatSize(att.size)}</span>}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(att.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white hover:bg-red-500/80 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Remove attachment"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
