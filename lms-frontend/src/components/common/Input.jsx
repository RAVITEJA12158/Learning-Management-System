function Input({ placeholder, type = 'text', value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
    />
  )
}

export default Input