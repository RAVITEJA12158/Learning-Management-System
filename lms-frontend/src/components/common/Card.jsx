function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[#C7B5E8]/70 bg-gradient-to-br from-[#FFF7E8] via-[#F1EAFF] to-[#EAF6FF] p-6 shadow-xl shadow-[#42227F]/10 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card