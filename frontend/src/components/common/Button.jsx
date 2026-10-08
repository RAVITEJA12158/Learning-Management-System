import React from 'react';

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-[#0066FF] hover:bg-blue-600 text-white focus:ring-blue-500 shadow-[0_0_15px_rgba(0,102,255,0.4)]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white focus:ring-cyan-400',
    outline:
      'bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 focus:ring-cyan-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 focus:ring-cyan-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;