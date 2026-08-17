function Button({ children }) {
  return (
    <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
      {children}
    </button>
  )
}

export default Button