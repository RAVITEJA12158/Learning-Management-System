import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import SpotlightCard from '../../components/common/SpotlightCard'

const roles = [
  {
    id: 'student',
    roleId: 1,
    label: 'Student',
    description: 'Learn & manage courses',
    letter: 'S',
  },
  {
    id: 'faculty',
    roleId: 2,
    label: 'Faculty',
    description: 'Teach & assess',
    letter: 'F',
  },
  {
    id: 'admin',
    roleId: 3,
    label: 'Admin',
    description: 'Manage institution',
    letter: 'A',
  },
]

const barData = [
  { height: 28, color: 'bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.4)]' },
  { height: 52, color: 'bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]' },
  { height: 38, color: 'bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.4)]' },
  { height: 80, color: 'bg-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.4)]' },
  { height: 58, color: 'bg-gradient-to-t from-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]' },
]

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Animated Data Visualization States
  const [progress, setProgress] = useState(0)
  const [count, setCount] = useState(0)
  const [barsVisible, setBarsVisible] = useState(false)

  useEffect(() => {
    // Dynamic Progress Ring & Counter Animation
    const timer = setTimeout(() => {
      setProgress(74)
      setBarsVisible(true)

      const duration = 1500
      const startTime = performance.now()

      const animateCounter = (currentTime) => {
        const elapsed = currentTime - startTime
        const progressRatio = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progressRatio, 3)
        setCount(Math.round(easeOut * 74))

        if (progressRatio < 1) {
          requestAnimationFrame(animateCounter)
        }
      }

      requestAnimationFrame(animateCounter)
    }, 180)

    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    setMessage('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid academic email address'
    }

    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (selectedRole.id === 'admin' && !secretCode.trim()) {
      nextErrors.secretCode = 'Administrator access code is required'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      const data = await authApi.login({
        email: email.trim(),
        password,
        ...(selectedRole.id === 'admin' ? { secretCode: secretCode.trim() } : {}),
      })

      const returnedRole = (data.role || '').toLowerCase()
      if (returnedRole && returnedRole !== selectedRole.id) {
        setMessage(
          `This account belongs to the ${roleName(
            data.role
          )} workspace. Select that role to continue.`
        )
        return
      }

      const user = {
        id: data.userId,
        name: data.name || data.username,
        email: email.trim(),
        role: returnedRole || selectedRole.id,
      }

      login({ token: data.token, user })
      navigate(returnedRole === 'student' ? '/student' : `/${returnedRole}`)
    } catch (error) {
      setMessage(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const selectedIndex = roles.findIndex((r) => r.id === selectedRole.id)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] dark:bg-[#030712] transition-colors">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        {/* =====================================================
            LEFT BRAND PANEL (MIDNIGHT GLASSMORPHISM VOID)
        ====================================================== */}
        <aside className="animate-panel-left relative hidden flex-col justify-between overflow-hidden bg-[#030712] p-8 xl:p-12 text-white lg:flex border-r border-white/5">
          {/* Ambient Cyan & Purple Glowing Blur Orbs */}
          <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

          {/* Top Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex w-fit items-center gap-3 transition-opacity duration-200 hover:opacity-90 relative z-10 cursor-pointer"
          >
            <BrandMark darkBg />
            <span className="text-xl font-bold tracking-tight text-white">CourseHub</span>
          </button>

          {/* Middle Content */}
          <div className="max-w-lg py-4 relative z-10">
            {/* Staggered Heading with Electric Gradient Accent */}
            <h1 className="animate-heading text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[54px]">
              Your learning
              <br />
              space is
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                waiting.
              </span>
            </h1>

            {/* Staggered Sub-text */}
            <p className="animate-subtext mt-5 max-w-sm text-[15px] leading-relaxed text-gray-400">
              Sign in to return to your courses, assignments, progress, and academic community.
            </p>

            {/* Weekly Progress Card with Midnight Glassmorphism & Hover Spotlight Gradient */}
            <SpotlightCard
              alwaysDark
              className="mt-9 w-full max-w-[390px] p-5 shadow-2xl transition-all duration-300"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                WEEKLY PROGRESS
              </p>

              <div className="mt-4 flex items-center justify-between gap-5">
                {/* Circular Gauge */}
                <div className="flex flex-col items-center">
                  <div className="relative flex h-[70px] w-[70px] items-center justify-center">
                    <svg className="h-full w-full -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" viewBox="0 0 76 76">
                      <defs>
                        <linearGradient id="loginGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="38"
                        cy="38"
                        r="30"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="5.5"
                      />
                      <circle
                        cx="38"
                        cy="38"
                        r="30"
                        fill="transparent"
                        stroke="url(#loginGaugeGradient)"
                        strokeWidth="5.5"
                        strokeDasharray="188.5"
                        strokeDashoffset={188.5 * (1 - progress / 100)}
                        strokeLinecap="round"
                        style={{
                          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </svg>
                    <span className="absolute text-xl font-black tracking-tight text-white">
                      {count}%
                    </span>
                  </div>
                  <span className="mt-1.5 text-[11px] font-medium text-gray-400">
                    This week
                  </span>
                </div>

                {/* Sequential Bar Chart */}
                <div className="flex flex-1 flex-col items-end">
                  <div className="flex h-12 w-full items-end justify-end gap-2.5">
                    {barData.map((bar, index) => (
                      <div
                        key={index}
                        className={`w-8 rounded-t-sm ${bar.color}`}
                        style={{
                          height: barsVisible ? `${bar.height}%` : '0%',
                          transitionProperty: 'height',
                          transitionDuration: '750ms',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${index * 130}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="mt-2 text-[11px] font-medium text-gray-400">
                    Goal completion
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Bottom Security Note */}
          <p className="text-xs text-gray-500 relative z-10 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            Secure access for your academic community.
          </p>
        </aside>

        {/* =====================================================
            RIGHT LOGIN PANEL (LIGHT / DARK CANVAS - SPLIT REVEAL FROM RIGHT)
        ====================================================== */}
        <main className="animate-panel-right flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#030712] px-4 py-8 sm:px-8 lg:px-12 transition-colors">
          <div className="w-full max-w-[460px]">
            {/* Mobile Logo */}
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <BrandMark darkBg />
                <span className="text-xl font-bold text-slate-900 dark:text-white">CourseHub</span>
              </button>
            </div>

            {/* Staggered Header */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-400">
                SIGN IN
              </p>
              <h2 className="animate-heading mt-1.5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Welcome back.
              </h2>
              <p className="animate-subtext mt-2 text-sm text-slate-500 dark:text-gray-400">
                Choose your workspace and continue where you left off.
              </p>
            </div>

            {/* Card Form with Soft Elevation & Bloom */}
            <div className="animate-card-bloom mt-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl p-6 sm:p-7 shadow-xs dark:shadow-2xl dark:shadow-black/50 transition-colors">
              {/* Workspace Segmented Control with Smooth Sliding Pill */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    SELECT WORKSPACE
                  </p>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500">
                    STEP 01
                  </span>
                </div>

                <div className="relative grid grid-cols-3 gap-2.5">
                  {/* Sliding Active Indicator Pill */}
                  <div
                    className="pointer-events-none absolute inset-y-0 rounded-2xl bg-[#48566a] dark:bg-cyan-500/20 dark:border dark:border-cyan-500/40 shadow-sm transition-transform duration-300 ease-out"
                    style={{
                      width: 'calc((100% - 20px) / 3)',
                      transform: `translateX(calc(${selectedIndex} * (100% + 10px)))`,
                    }}
                  />

                  {roles.map((role) => {
                    const isSelected = selectedRole.id === role.id
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role)
                          setErrors({})
                          setMessage('')
                        }}
                        className={`relative z-10 rounded-2xl p-3.5 text-left transition-colors duration-200 cursor-pointer ${
                          isSelected
                            ? 'text-white'
                            : 'bg-[#f0f3f6] dark:bg-white/5 text-slate-800 dark:text-gray-300 hover:bg-[#e7ecf1] dark:hover:bg-white/10'
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'transparent' : undefined,
                        }}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                            isSelected
                              ? 'bg-[#283444] dark:bg-cyan-500 text-white'
                              : 'bg-[#dce2e8] dark:bg-white/10 text-slate-500 dark:text-gray-400'
                          }`}
                        >
                          {role.letter}
                        </span>

                        <span
                          className={`mt-2.5 block text-xs font-bold transition-colors duration-200 ${
                            isSelected ? 'text-white' : 'text-slate-800 dark:text-gray-200'
                          }`}
                        >
                          {role.label}
                        </span>

                        <span
                          className={`mt-0.5 block text-[9px] leading-tight transition-colors duration-200 sm:text-[10px] ${
                            isSelected ? 'text-slate-300 dark:text-gray-300' : 'text-slate-400 dark:text-gray-500'
                          }`}
                        >
                          {role.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Error Message */}
              {message && (
                <div className="mt-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-medium text-rose-700 dark:text-rose-400">
                  {message}
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Academic Email with Smooth Focus Stroke */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    ACADEMIC EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="shreetheja.vasala@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.email}</p>
                  )}
                </div>

                {/* Password with Smooth Focus Stroke */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 pr-14 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.password}</p>
                  )}
                </div>

                {/* Admin Access Code */}
                {selectedRole.id === 'admin' && (
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      ADMINISTRATOR ACCESS CODE
                    </label>
                    <input
                      type="password"
                      placeholder="Enter secure access code"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    {errors.secretCode && (
                      <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                        {errors.secretCode}
                      </p>
                    )}
                  </div>
                )}

                {/* Forgot Password */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setMessage('Password recovery will be available soon.')
                    }
                    className="text-xs font-medium text-[#1a6ef5] dark:text-cyan-400 transition-colors hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button with Hover Scale, Dynamic CTA Text & Spinner */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a6ef5] dark:bg-[#0066FF] px-4 py-3.5 text-sm font-medium text-white shadow-sm dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#155bd5] dark:hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing you in…</span>
                    </div>
                  ) : (
                    <div
                      key={selectedRole.id}
                      className="animate-cta-swap flex items-center gap-1.5"
                    >
                      <span>Enter {selectedRole.label} workspace</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Links */}
            <p className="mt-5 text-center text-xs text-slate-600 dark:text-gray-400 sm:text-sm">
              New to CourseHub?{' '}
              <Link to="/register" className="font-bold text-slate-900 dark:text-cyan-400 transition-colors hover:underline">
                Create your account
              </Link>
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-3 mx-auto block text-xs font-medium text-slate-500 dark:text-gray-500 transition-colors hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
            >
              ← Back to home
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

function BrandMark({ darkBg = false }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${
        darkBg
          ? 'bg-white/10 backdrop-blur-md border border-white/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          : 'bg-white text-slate-900 border border-slate-200'
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    </div>
  )
}

function roleName(role) {
  if (typeof role === 'string') {
    const found = roles.find((r) => r.id === role.toLowerCase())
    return found ? found.label : role
  }
  return roles.find((r) => r.roleId === role)?.label || 'correct'
}

export default Login