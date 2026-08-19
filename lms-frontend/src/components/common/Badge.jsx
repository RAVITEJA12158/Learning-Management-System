function Badge({ children, variant = 'success' }) {
  const variants = {
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    danger: 'bg-red-50 text-red-700 ring-red-600/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

export default Badge