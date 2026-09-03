function Input({
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-2xl border border-[#DDD7CE] bg-[#FFFEFB] px-4 py-3.5 text-sm font-medium text-[#151515] shadow-[0_3px_10px_rgba(21,21,21,.025)] outline-none transition-all duration-200 placeholder:text-[#AAA39A] hover:border-[#BEB6AA] focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05] disabled:cursor-not-allowed disabled:bg-[#F3EFE8]"
    />
  )
}

export default Input