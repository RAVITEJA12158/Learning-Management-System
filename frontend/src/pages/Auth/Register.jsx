import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../services/api'

const roles = [
  {
    id: 'student',
    label: 'Student',
    letter: 'S',
    description: 'Learn & manage courses',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    letter: 'F',
    description: 'Teach & assess',
  },
]

function Register() {
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordStrength = getPasswordStrength(password)

  async function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}
    setMessage('')
    setSuccess(false)

    if (!name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must contain at least 2 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Academic email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrorsOrNew('email', 'Enter a valid academic email address', newErrors)
    }

    const cleanedMobile = mobileNumber.replace(/[\s\-()]/g, '')
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\+?\d{10}$/.test(cleanedMobile)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password)) {
      newErrors.password = 'Include uppercase, lowercase, number, and special character (@$!%*?&)'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms to continue'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const generatedUsername =
        email.trim().split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') ||
        name.trim().toLowerCase().replace(/\s+/g, '_')

      await authApi.register({
        name: name.trim(),
        username: generatedUsername,
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        mobile_number: cleanedMobile,
        role: selectedRole.id,
      })

      setSuccess(true)
      setMessage('Account created successfully! Redirecting to sign in...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setMessage(error.message || 'Registration failed. Please check your information.')
    } finally {
      setLoading(false)
    }
  }

  function nextErrorsOrNew(key, val, errs) {
    errs[key] = val
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* =====================================================
            LEFT REGISTER PANEL (FORM ON LEFT SIDE)
        ====================================================== */}
        <main className="animate-auth-fade flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[500px]">
            {/* Mobile Logo */}
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3"
              >
                <BrandMark darkBg />
                <span className="text-xl font-bold text-slate-900">CourseHub</span>
              </button>
            </div>

            {/* Header */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                GET STARTED
              </p>
              <h2 className="mt-1.5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Create account.
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose your workspace and start your academic journey.
              </p>
            </div>

            {/* Card Form */}
            <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-7">
              {/* Workspace Selection */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    SELECT WORKSPACE
                  </p>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                    STEP 01
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
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
                        className={`rounded-2xl p-3.5 text-left transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#48566a] text-white shadow-sm'
                            : 'bg-[#f0f3f6] text-slate-800 hover:bg-[#e7ecf1]'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? 'bg-[#283444] text-white'
                              : 'bg-[#dce2e8] text-slate-500'
                          }`}
                        >
                          {role.letter}
                        </span>

                        <span
                          className={`mt-2.5 block text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {role.label}
                        </span>

                        <span
                          className={`mt-0.5 block text-[9px] leading-tight sm:text-[10px] ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {role.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`mt-4 rounded-xl border p-3 text-xs font-medium ${
                    success
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>
                  )}
                </div>

                {/* Email and Mobile Number (2 columns on sm) */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      ACADEMIC EMAIL
                    </label>
                    <input
                      type="email"
                      placeholder="you@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      MOBILE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1 text-xs font-medium text-rose-600">{errors.mobileNumber}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters (e.g. Pass@123)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>
                  )}

                  {/* Minimalist Password Strength Meter */}
                  {password && (
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex flex-1 items-center gap-1.5">
                        {[1, 2, 3, 4].map((level) => {
                          const active = passwordStrength.score >= level
                          const color =
                            passwordStrength.score <= 1
                              ? 'bg-rose-500'
                              : passwordStrength.score === 2
                              ? 'bg-amber-500'
                              : passwordStrength.score === 3
                              ? 'bg-emerald-500'
                              : 'bg-blue-600'
                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                active ? color : 'bg-slate-200'
                              }`}
                            />
                          )
                        })}
                      </div>
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                          passwordStrength.score <= 1
                            ? 'text-rose-600'
                            : passwordStrength.score === 2
                            ? 'text-amber-600'
                            : passwordStrength.score === 3
                            ? 'text-emerald-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms of Service Checkbox */}
                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#1a6ef5]"
                    />
                    <span className="text-[11px] leading-4 text-slate-600">
                      I agree to the LMS terms of service and acknowledge that my academic information will be securely managed.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.terms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1a6ef5] px-4 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#155bd5] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading
                    ? 'Creating account…'
                    : `Register as ${selectedRole.label} →`}
                </button>
              </form>
            </div>

            {/* Bottom Links */}
            <p className="mt-5 text-center text-xs text-slate-600 sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-3 mx-auto block text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </main>

        {/* =====================================================
            RIGHT BRAND PANEL (DARK NAVY ON RIGHT SIDE)
        ====================================================== */}
        <aside className="animate-panel-right relative hidden flex-col justify-between bg-[#0b1329] p-8 xl:p-12 text-white lg:flex">
          {/* Top Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex w-fit items-center gap-3 transition-opacity hover:opacity-90"
          >
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-white">CourseHub</span>
          </button>

          {/* Middle Content */}
          <div className="max-w-lg py-4">
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[54px]">
              Make space
              <br />
              for learning.
              <br />
              Start today.
            </h1>

            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-slate-300">
              Join CourseHub to access interactive courses, track your academic milestones, and connect with faculty.
            </p>

            {/* Dashboard Highlights Card */}
            <div className="mt-9 w-full max-w-[390px] rounded-2xl bg-white p-5 text-slate-800 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  LEARNING DASHBOARD
                </p>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#1a6ef5]">
                  READY
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  { num: '01', text: 'Curated courses & interactive modules' },
                  { num: '02', text: 'Real-time assignment & quiz tracking' },
                  { num: '03', text: 'Collaborative academic community' },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100"
                  >
                    <span className="text-[11px] font-bold text-[#1a6ef5]">
                      {item.num}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <p className="text-xs text-slate-400">
            Secure access for your academic community.
          </p>
        </aside>
      </div>
    </div>
  )
}

function BrandMark({ darkBg = false }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${
        darkBg ? 'bg-[#0b1329] text-white' : 'bg-white text-slate-900'
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

function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: '',
    }
  }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) {
    return { score: 1, label: 'Weak' }
  }
  if (score === 2) {
    return { score: 2, label: 'Fair' }
  }
  if (score === 3) {
    return { score: 3, label: 'Good' }
  }
  return { score: 4, label: 'Strong' }
}

export default Register