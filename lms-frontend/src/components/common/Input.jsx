function Input({ placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
    />
  )
}

export default Input