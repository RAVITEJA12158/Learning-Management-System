import React from 'react';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;