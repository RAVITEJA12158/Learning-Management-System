function Card({ children }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      {children}
    </div>
  )
}

export default Card