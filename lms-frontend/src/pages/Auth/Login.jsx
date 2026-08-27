import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import { supabase } from '../../services/supabase'

const roles = [
  { id: 'student', roleId: 1, label: 'Student', detail: 'Access learning space', badge: 'S' },
  { id: 'faculty', roleId: 2, label: 'Faculty', detail: 'Teach and guide', badge: 'F' },
  { id: 'admin', roleId: 3, label: 'Administrator', detail: 'Manage your institution', badge: 'A' },
]

function Login() {
  const navigate = useNavigate()

  const [loginRole, setLoginRole] = useState('student')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showSecretCode] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    setMessage('')

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (loginRole === 'admin' && !secretCode.trim()) {
      newErrors.secretCode = 'Admin secret code is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      const errorText = error.message.toLowerCase()

      if (errorText.includes('email not confirmed')) {
        setMessage(
          'Please verify your email before signing in. Check your inbox for the confirmation link.',
        )
      } else if (errorText.includes('invalid login')) {
        setMessage('Incorrect email or password. Please try again.')
      } else {
        setMessage(error.message)
      }

      return
    }

    const actualRole = data.user.user_metadata?.role

    if (actualRole !== loginRole) {
      await supabase.auth.signOut()

      setMessage(
        `This account is registered as ${
          actualRole || 'another role'
        }. Please select the correct login type.`,
      )

      return
    }

    navigate(`/${loginRole}`)
  }

  return (
    <div className="aurora-page min-h-screen bg-[radial-gradient(circle_at_8%_10%,_#ddd6fe_0,_transparent_28%),radial-gradient(circle_at_92%_18%,_#f5d0fe_0,_transparent_24%),linear-gradient(135deg,_#faf5ff,_#ede9fe_55%,_#fdf4ff)] text-violet-950">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Branding panel */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-300/40 to-fuchsia-200/30" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <button
              onClick={() => navigate('/')}
              className="w-fit text-2xl font-bold"
            >
              LMS<span className="text-violet-400">.</span>
            </button>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-violet-300">
                Learning Management System
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Welcome back to your learning journey.
              </h1>

              <p className="mt-6 text-lg leading-8 text-violet-800/70">
                Access your courses, assignments, learning resources,
                and academic progress from one centralized platform.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <InfoCard value="50+" label="Courses" />
                <InfoCard value="1.2K+" label="Students" />
                <InfoCard value="80+" label="Faculty" />
              </div>
            </div>

            <p className="text-sm text-violet-600">
              Secure authentication powered by Supabase
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="flex items-center justify-center px-6 py-12">
          <Card>
            <div className="w-full max-w-md">

              <div className="mb-8 text-center lg:text-left">
                <div className="mb-6 lg:hidden">
                  <button
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold"
                  >
                    LMS<span className="text-violet-400">.</span>
                  </button>
                </div>

                <h2 className="text-3xl font-bold">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-violet-800/75">
                  Select your account type and sign in.
                </p>
              </div>

              {/* Role switch */}
              <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
                <RoleButton
                  active={loginRole === 'student'}
                  onClick={() => {
                    setLoginRole('student')
                    setErrors({})
                    setMessage('')
                  }}
                >
                  Student
                </RoleButton>

                <RoleButton
                  active={loginRole === 'faculty'}
                  onClick={() => {
                    setLoginRole('faculty')
                    setErrors({})
                    setMessage('')
                  }}
                >
                  Faculty
                </RoleButton>

                <RoleButton
                  active={loginRole === 'admin'}
                  onClick={() => {
                    setLoginRole('admin')
                    setErrors({})
                    setMessage('')
                  }}
                >
                  Admin
                </RoleButton>
              </div>

              {message && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-violet-900">
                    Email address
                  </label>

                  <Input
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-violet-900">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setMessage(
                          'Password reset will be available soon.',
                        )
                      }
                      className="text-xs font-medium text-violet-300 hover:text-violet-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-violet-600 hover:text-violet-950"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Admin secret code */}
                {loginRole === 'admin' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-violet-900">
                      Admin secret code
                    </label>

                    <div className="relative">
                      <Input
                        placeholder="Enter admin secret code"
                        type={showSecretCode ? 'text' : 'password'}
                        value={secretCode}
                        onChange={(e) =>
                          setSecretCode(e.target.value)
                        }
                      />
                    </div>

                    {errors.secretCode && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.secretCode}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-violet-700/75">
                      Admin access requires additional verification.
                    </p>
                  </div>
                )}

                <Button disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <>
                  <div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-800" />
                    <span className="text-xs text-slate-600">
                      OR
                    </span>
                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <p className="text-center text-sm text-violet-800/75">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-violet-300 hover:text-violet-200"
                    >
                      Create one
                    </Link>
                  </p>
                </>

              <button
                onClick={() => navigate('/')}
                className="mt-5 w-full text-center text-sm text-violet-700 transition hover:text-violet-950"
              >
                ← Back to home
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function RoleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-violet-600 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  )
}

function InfoCard({ value, label }) {
  return (
    <div className="rounded-xl border border-violet-200 bg-white/50 p-4 shadow-sm">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  )
}

export default Login
