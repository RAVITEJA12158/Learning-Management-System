import React from 'react';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-xs transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;