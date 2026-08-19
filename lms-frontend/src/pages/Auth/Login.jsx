import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}
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
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setMessage(
          'Please verify your email before signing in. Check your inbox for the confirmation link.',
        )
      } else if (error.message.toLowerCase().includes('invalid login')) {
        setMessage('Incorrect email or password. Please try again.')
      } else {
        setMessage(error.message)
      }

      return
    }

    const user = {
      id: data.user.id,
      name: data.user.user_metadata?.name || email.split('@')[0],
      email: data.user.email,
      role: 'student',
    }

    login(user)
    navigate('/student')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-blue-600/10" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <button
              onClick={() => navigate('/')}
              className="w-fit text-2xl font-bold"
            >
              LMS<span className="text-blue-500">.</span>
            </button>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
                Learning Management System
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Welcome back to your learning journey.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Access your courses, assignments, learning resources,
                and academic progress from one centralized platform.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <InfoCard value="50+" label="Courses" />
                <InfoCard value="1.2K+" label="Students" />
                <InfoCard value="80+" label="Faculty" />
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Secure authentication powered by Supabase
            </p>
          </div>
        </div>

        {/* Login panel */}
        <div className="flex items-center justify-center px-6 py-12">
          <Card>
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <div className="mb-6 lg:hidden">
                  <button
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold"
                  >
                    LMS<span className="text-blue-500">.</span>
                  </button>
                </div>

                <h2 className="text-3xl font-bold">Sign in</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Enter your credentials to continue.
                </p>
              </div>

              {message && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
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

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setMessage('Password reset will be available soon.')}
                      className="text-xs font-medium text-blue-400 hover:text-blue-300"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-white"
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

                <Button disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-600">OR</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Create one
                </Link>
              </p>

              <button
                onClick={() => navigate('/')}
                className="mt-5 w-full text-center text-sm text-slate-600 hover:text-slate-400"
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

function InfoCard({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  )
}

export default Login