import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  wrapperClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  className = '',
  wrapperClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when tapping outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className={`group relative inline-flex items-center gap-1.5 ${wrapperClassName}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={className} 
        onClick={() => {
          // Toggle on click for touch devices where hover isn't triggering fast
          if (window.innerWidth < 768) setIsOpen(!isOpen);
        }}
      >
        {children}
      </div>
      
      {/* Mobile info icon - only shows on small screens */}
      <span 
        className="md:hidden flex-shrink-0 opacity-60 hover:opacity-100 cursor-pointer text-sm font-sans flex items-center justify-center bg-white/10 rounded-full w-5 h-5 -ml-0.5"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        i
      </span>

      {/* Popover */}
      <div 
        className={`
          absolute z-[100] transition-all duration-200 pointer-events-none md:pointer-events-auto
          ${isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-1 md:translate-y-0 md:scale-95'}
          bg-[#1E1E2E] text-slate-300 px-3 py-2.5 rounded shadow-2xl border border-slate-700/60
          w-64 text-xs sm:text-[13px] font-normal text-left tracking-wide
          ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
          ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
          ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
          ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
        `}
      >
        <div className="relative z-10 leading-relaxed font-inter">{content}</div>
        
        {/* Triangle Arrow */}
        <div 
          className={`
            absolute w-2 h-2 bg-[#1E1E2E] border-slate-700/60 transform rotate-45 z-0
            ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
            ${position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
            ${position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' : ''}
            ${position === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l' : ''}
          `}
        />
      </div>
    </div>
  );
};
