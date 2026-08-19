function Button({
  children,
  type = 'submit',
  disabled = false,
  variant = 'primary',
}) {
  const variants = {
    primary:
      'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20',
    secondary:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-4 focus:ring-slate-500/10',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-500/20',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button