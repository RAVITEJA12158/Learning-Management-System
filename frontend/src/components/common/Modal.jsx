import React, { useEffect } from 'react';

function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-5 sm:p-8 shadow-2xl transition-colors my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10 mb-4">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white break-words">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 break-words">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 sm:h-9 sm:w-9 shrink-0 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white text-base font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
