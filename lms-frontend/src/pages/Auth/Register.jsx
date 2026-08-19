import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import { supabase } from '../../services/supabase'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    })

    setLoading(false)

    if (error) {
      const errorText = error.message.toLowerCase()

      if (errorText.includes('rate limit')) {
        setMessage(
          'Too many registration attempts. Please wait a few minutes before trying again.',
        )
      } else if (errorText.includes('already registered')) {
        setMessage(
          'An account with this email may already exist. Try signing in instead.',
        )
      } else {
        setMessage(error.message)
      }

      return
    }

    setSuccess(true)

    setMessage(
      'Account created successfully! Check your email to confirm your account before signing in.',
    )

    setTimeout(() => {
      navigate('/login')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden overflow-hidden lg:flex lg:order-2">
          <div className="absolute inset-0 bg-blue-600/10" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <button
              onClick={() => navigate('/')}
              className="ml-auto w-fit text-2xl font-bold"
            >
              LMS<span className="text-blue-500">.</span>
            </button>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
                Start Learning
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Build your future with better learning.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Join the LMS platform and manage your courses, assignments,
                resources, and academic progress from one place.
              </p>

              <div className="mt-8 space-y-4">
                <Benefit text="Access your courses anytime" />
                <Benefit text="Track your academic progress" />
                <Benefit text="Manage assignments efficiently" />
                <Benefit text="Learn from experienced faculty" />
              </div>
            </div>

            <p className="text-right text-sm text-slate-600">
              Secure authentication powered by Supabase
            </p>
          </div>
        </div>

        {/* Register panel */}
        <div className="flex items-center justify-center px-6 py-12 lg:order-1">
          <Card>
            <div className="w-full max-w-md">
              <div className="mb-7">
                <div className="mb-6 lg:hidden">
                  <button
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold"
                  >
                    LMS<span className="text-blue-500">.</span>
                  </button>
                </div>

                <h2 className="text-3xl font-bold">Create your account</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Join the Learning Management System.
                </p>
              </div>

              {message && (
                <div
                  className={`mb-5 rounded-xl border p-4 text-sm ${
                    success
                      ? 'border-green-500/20 bg-green-500/10 text-green-300'
                      : 'border-red-500/20 bg-red-500/10 text-red-300'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full name
                  </label>

                  <Input
                    placeholder="Karthik Madipalli"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

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
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      placeholder="Create a password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-3">
                      <div className="flex gap-1">
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            passwordStrength.score >= 1
                              ? 'bg-red-500'
                              : 'bg-slate-800'
                          }`}
                        />
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            passwordStrength.score >= 2
                              ? 'bg-yellow-500'
                              : 'bg-slate-800'
                          }`}
                        />
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            passwordStrength.score >= 3
                              ? 'bg-green-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Input
                      placeholder="Repeat your password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />

                    <span className="text-xs leading-5 text-slate-400">
                      I agree to the LMS terms of service and understand
                      that my account information will be securely stored.
                    </span>
                  </label>

                  {errors.terms && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.terms}
                    </p>
                  )}
                </div>

                <Button disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Sign in
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

function Benefit({ text }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-sm text-blue-400">
        ✓
      </span>

      <span>{text}</span>
    </div>
  )
}

function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'Not entered',
    }
  }

  let score = 0

  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1

  if (score === 1) {
    return {
      score,
      label: 'Weak',
    }
  }

  if (score === 2) {
    return {
      score,
      label: 'Moderate',
    }
  }

  return {
    score: 3,
    label: 'Strong',
  }
}

export default Register