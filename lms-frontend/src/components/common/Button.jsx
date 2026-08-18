function Button({ children, type = 'submit', disabled = false }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export default Button