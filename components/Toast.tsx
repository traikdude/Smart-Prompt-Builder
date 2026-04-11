import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.show) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-mono font-medium text-sm transition-all duration-300 z-50 flex items-center gap-2 backdrop-blur-md uppercase tracking-wider ${
      toast.type === 'success' ? 'bg-cyan-500/90 shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-cyan-400' : 'bg-purple-500/90 shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400'
    }`}>
      {toast.type === 'success' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {toast.message}
    </div>
  );
};

export default Toast;