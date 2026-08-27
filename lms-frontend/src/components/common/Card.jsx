function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[1.75rem] border border-violet-200/80 bg-white/75 p-6 shadow-xl shadow-violet-200/35 backdrop-blur ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
