function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-md ${className}`}
    >
      {children}
    </div>
  )
}

export default Card