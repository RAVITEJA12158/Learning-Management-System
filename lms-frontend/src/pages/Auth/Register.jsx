import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { authApi } from '../../services/api'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState('student')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [acceptTerms, setAcceptTerms] =
    useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordStrength =
    getPasswordStrength(password)

  async function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}

    setMessage('')
    setSuccess(false)

    if (!name.trim()) {
      newErrors.name =
        'Full name is required'
    } else if (name.trim().length < 2) {
      newErrors.name =
        'Name must contain at least 2 characters'
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username.trim())) {
      newErrors.username =
        'Use 3–30 letters, numbers, periods, hyphens, or underscores'
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username.trim())) {
      newErrors.username =
        'Use 3–30 letters, numbers, periods, hyphens, or underscores'
    }

    if (!email.trim()) {
      newErrors.email =
        'Email is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        'Enter a valid email address'
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber =
        'Mobile number is required'
    } else if (
      !/^\+?\d{10}$/.test(
        mobileNumber.replace(
          /[\s\-()]/g,
          ''
        )
      )
    ) {
      newErrors.mobileNumber =
        'Enter a valid 10-digit mobile number'
      const cleanMobile = mobile.replace(/\D/g, '')

      if (!mobile.trim()) {
        newErrors.mobile = 'Mobile number is required'
      } else if (cleanMobile.length !== 10) {
        newErrors.mobile = 'Enter a valid 10-digit mobile number'
      }

      if (!role) {
        newErrors.role = 'Please select a role'
      }

      if (!password) {
        newErrors.password =
          'Password is required'
      } else if (password.length < 6) {
        newErrors.password =
          'Password must be at least 6 characters'
      }

      if (!confirmPassword) {
        newErrors.confirmPassword =
          'Please confirm your password'
      } else if (
        password !== confirmPassword
      ) {
        newErrors.confirmPassword =
          'Passwords do not match'
      }

      if (!acceptTerms) {
        newErrors.terms =
          'Please accept the terms to continue'
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        return
      }

      setLoading(true)

      try {
        await authApi.register({
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          mobile_number: cleanMobile,
          role,
        })

        setSuccess(true)

        setMessage(
          'Account created successfully! You can now sign in.'
        )

        setTimeout(
          () => navigate('/login'),
          1800
        )
      } catch (error) {
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-[#F6F2E9]">

        <div className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">

          {/* =====================================================
            REGISTER FORM
        ====================================================== */}

          <main className="order-2 flex items-center justify-center px-5 py-10 sm:px-8 lg:order-1 lg:px-14">

            <div className="w-full max-w-[560px]">

              <div className="mb-8 lg:hidden">

                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3"
                >
                  <BrandMark />

                  <span className="text-xl font-black">
                    CourseHub
                  </span>
                </button>
              </div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
                Get started
              </p>

              <h1 className="mt-3 text-5xl font-black tracking-[-.06em]">
                Make space
                <br />
                for learning.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-black/45">
                Create your CourseHub account and bring your
                academic life into one focused workspace.
              </p>

              <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_25px_70px_rgba(21,21,21,.07)] sm:p-7">

                {message && (
                  <div
                    className={`mb-5 rounded-2xl border p-4 text-xs font-bold leading-5 ${success
                        ? 'border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]'
                        : 'border-[#F2C7BC] bg-[#FFF1ED] text-[#B83D29]'
                      }`}
                  >
                    {message}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  <Field
                    label="Full name"
                    error={errors.name}
                  >
                    <Input
                      placeholder="Your full name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <Field
                      label="Mobile number"
                      error={errors.mobileNumber}
                    >
                      <Input
                        placeholder="9876543210"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNumber(
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field
                      label="Email address"
                      error={errors.email}
                    >
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <Field
                    label="Password"
                    error={errors.password}
                  >
                    <div className="relative">

                      <Input
                        placeholder="Create a password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-black text-[#E85B43]"
                      >
                        {showPassword
                          ? 'Hide'
                          : 'Show'}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-3 rounded-xl bg-[#F7F4EE] p-3">

                        <div className="flex gap-1.5">

                          {[1, 2, 3, 4].map(
                            (level) => (
                              <span
                                key={level}
                                className={`h-1.5 flex-1 rounded-full ${passwordStrength.score >=
                                    level
                                    ? level >= 3
                                      ? 'bg-[#59BFA2]'
                                      : '#E85B43'
                                    : 'bg-black/8'
                                  }`}
                                style={
                                  passwordStrength.score >=
                                    level &&
                                    level < 3
                                    ? {
                                      backgroundColor:
                                        '#E8A13D',
                                    }
                                    : undefined
                                }
                              />
                            )
                          )}
                        </div>

                        <p className="mt-2 text-[10px] font-bold text-black/40">
                          Password strength:{' '}

                          <span className="text-black/70">
                            {
                              passwordStrength.label
                            }
                          </span>
                        </p>
                      </div>
                    )}
                  </Field>

                  <Field
                    label="Confirm password"
                    error={errors.confirmPassword}
                  >
                    <div className="relative">

                      <Input
                        placeholder="Repeat your password"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-black text-[#E85B43]"
                      >
                        {showConfirmPassword
                          ? 'Hide'
                          : 'Show'}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/8 bg-[#FAF8F3] p-3.5">

                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) =>
                          setAcceptTerms(
                            e.target.checked
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-[#151515]"
                      />

                      <span className="text-xs leading-5 text-black/45">
                        I agree to the LMS terms of service
                        and understand that my account
                        information will be securely stored.
                      </span>
                    </label>

                    {errors.terms && (
                      <p className="mt-2 text-xs font-bold text-[#D64C36]">
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  <Button disabled={loading}>
                    {loading
                      ? 'Creating account...'
                      : 'Create account →'}
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-3">

                  <span className="h-px flex-1 bg-black/8" />

                  <span className="text-[9px] font-black uppercase tracking-[.12em] text-black/25">
                    Already registered
                  </span>

                  <span className="h-px flex-1 bg-black/8" />
                </div>

                <p className="text-center text-sm text-black/45">

                  Already have an account?{' '}

                  <Link
                    to="/login"
                    className="font-black text-[#E85B43]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <button
                onClick={() => navigate('/')}
                className="mx-auto mt-6 block text-xs font-bold text-black/30 hover:text-[#E85B43]"
              >
                ← Back to home
              </button>
            </div>
          </main>

          {/* =====================================================
            BRAND PANEL
        ====================================================== */}

          <aside className="relative order-1 hidden overflow-hidden bg-[#DFFF63] lg:order-2 lg:flex">

            <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/45 blur-[100px]" />

            <div className="absolute -bottom-40 -left-40 h-[550px] w-[550px] rounded-full bg-[#A9E8D5]/35 blur-[110px]" />

            <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

              <button
                onClick={() => navigate('/')}
                className="ml-auto flex items-center gap-3"
              >
                <span className="text-xl font-black tracking-[-.05em]">
                  CourseHub
                </span>

                <BrandMark />
              </button>

              <div className="max-w-xl">

                <p className="text-xs font-black uppercase tracking-[.18em] text-[#344018]">
                  Built for your next chapter
                </p>

                <h2 className="mt-5 text-5xl font-black leading-[.94] tracking-[-.065em] xl:text-6xl">

                  One place.
                  <br />

                  Every part of
                  <br />

                  <span className="text-[#E85B43]">
                    learning.
                  </span>
                </h2>

                <p className="mt-7 max-w-md text-base leading-7 text-[#344018]/65">
                  Courses, assignments, resources, progress,
                  and academic connections—all organized around
                  the way you learn.
                </p>

                <div className="mt-9 space-y-3">

                  {[
                    'Access your courses anytime',
                    'Track your academic progress',
                    'Manage assignments efficiently',
                    'Learn from experienced faculty',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.04] px-4 py-3"
                    >

                      <span className="text-[10px] font-black text-[#E85B43]">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-black">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-[26px] bg-[#151515] p-5 text-white shadow-[0_25px_50px_rgba(21,21,21,.15)]">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] font-black uppercase tracking-[.15em] text-white/30">
                        Learning dashboard
                      </p>

                      <p className="mt-1 text-sm font-black">
                        Everything in one rhythm.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#DFFF63] px-3 py-1.5 text-[9px] font-black text-black">
                      READY
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-[#FF7659] p-3">

                      <p className="text-[8px] font-black text-white/60">
                        COURSES
                      </p>

                      <p className="mt-1 text-lg font-black">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#59BFA2] p-3 text-[#123029]">

                      <p className="text-[8px] font-black text-black/40">
                        PROGRESS
                      </p>

                      <p className="mt-1 text-lg font-black">
                        78%
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#9CC5FF] p-3 text-[#102744]">

                      <p className="text-[8px] font-black text-black/40">
                        STREAK
                      </p>

                      <p className="mt-1 text-lg font-black">
                        6d
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-[#344018]/40">
                A calmer way to learn.
              </p>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  function Field({
    label,
    error,
    children,
  }) {
    return (
      <div>

        <label className="mb-2 block text-[10px] font-black uppercase tracking-[.12em] text-black/55">
          {label}
        </label>

        {children}

        {error && (
          <p className="mt-2 text-xs font-bold text-[#D64C36]">
            {error}
          </p>
        )}
      </div>
    )
  }

  function BrandMark() {
    return (
      <span className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#151515] text-white">
        <span className="h-3.5 w-3.5 rounded-[4px] border-2 border-current" />

        <span className="absolute h-1.5 w-1.5 translate-x-2.5 -translate-y-2.5 rounded-full bg-[#FF7659]" />
      </span>
    )
  }

  function getPasswordStrength(password) {
    if (!password) {
      return {
        score: 0,
        label: 'Not set',
      }
    }

    let score = 0

    if (password.length >= 6) {
      score++
    }

    if (password.length >= 10) {
      score++
    }

    if (/[A-Z]/.test(password)) {
      score++
    }

    if (/[0-9]/.test(password)) {
      score++
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++
    }

    if (score <= 1) {
      return {
        score,
        label: 'Weak',
      }
    }

    if (score <= 3) {
      return {
        score,
        label: 'Good',
      }
    }

    return {
      score,
      label: 'Strong',
    }
  }

  export default Register