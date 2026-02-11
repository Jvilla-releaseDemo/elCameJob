
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const styles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-secondary text-white',
    warning: 'bg-yellow-500 text-white'
  };

  return (
    <div 
      className={`
        ${styles[type]} p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 
        min-w-[300px] animate-slideUp pointer-events-auto
      `}
      role="alert"
    >
      <p className="font-medium">{message}</p>
      <button 
        onClick={() => onClose(id)} 
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Cerrar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
