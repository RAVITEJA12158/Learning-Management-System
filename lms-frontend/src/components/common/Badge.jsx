function Badge({ children }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
      {children}
    </span>
  )
}

export default Badge