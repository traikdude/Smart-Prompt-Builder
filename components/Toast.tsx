import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.show) return null;

  const styles: Record<string, string> = {
    success: 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400/50 shadow-[0_0_25px_rgba(255,107,157,0.4)]',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.4)]',
    error: 'bg-gradient-to-r from-red-500 to-orange-500 border-red-400/50 shadow-[0_0_25px_rgba(239,68,68,0.4)]',
  };

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium text-sm transition-all duration-300 z-50 flex items-center gap-2 border backdrop-blur-md ${styles[toast.type] || styles.success}`}>
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