function Button({
  children,
  type = 'submit',
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="hub-lift w-full rounded-2xl bg-[#151515] px-4 py-4 text-sm font-black text-white shadow-[0_15px_30px_rgba(21,21,21,.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#292929] focus:outline-none focus:ring-4 focus:ring-[#151515]/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export default Button