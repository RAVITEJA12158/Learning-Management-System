import React from 'react';

/**
 * Reusable Hollow Glass Input
 * "Midnight Glassmorphism" Spec:
 * - Idle: bg-transparent border border-gray-800 rounded-xl text-white
 * - Focus: focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50
 */
function Input({
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  onCopy,
  onCut,
  onPaste,
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onCopy={onCopy}
      onCut={onCut}
      onPaste={onPaste}
      className={`w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-3 text-sm font-medium text-slate-800 dark:text-white shadow-xs outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder-gray-500 hover:border-slate-300 dark:hover:border-gray-700 focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export default Input;