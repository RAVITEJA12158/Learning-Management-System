import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import { authApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

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
    label: 'Administrator',
    description: 'Manage institution',
    letter: 'A',
  },
]

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [selectedRole, setSelectedRole] = useState(
    roles[0]
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}

    setMessage('')

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      nextErrors.email =
        'Enter a valid email address'
    }

    if (password.length < 6) {
      nextErrors.password =
        'Password must be at least 6 characters'
    }

    if (
      selectedRole.id === 'admin' &&
      !secretCode.trim()
    ) {
      nextErrors.secretCode =
        'Administrator access code is required'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const data = await authApi.login(
        email.trim(),
        password,
        secretCode.trim()
      )

      if (
        data.role_id !== selectedRole.roleId
      ) {
        setMessage(
          `This account belongs to the ${roleName(
            data.role_id
          )} workspace. Select that role to continue.`
        )

        return
      }

      const user = {
        id: data.userId,
        name: data.username,
        email: email.trim(),
        role: selectedRole.id,
      }

      localStorage.setItem(
        'lms_token',
        data.token
      )

      login(user)

      navigate(
        selectedRole.id === 'student'
          ? '/student'
          : `/${selectedRole.id}`
      )
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F2E9]">

      <div className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">

        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}

        <aside className="relative hidden overflow-hidden bg-[#151515] text-white lg:flex">

          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#DFFF63]/10 blur-[130px]" />

          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#A9E8D5]/10 blur-[130px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            <button
              onClick={() => navigate('/')}
              className="flex w-fit items-center gap-3"
            >
              <BrandMark dark />

              <span className="text-xl font-black tracking-[-.05em]">
                CourseHub
              </span>
            </button>

            <div className="max-w-xl">

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#DFFF63]">
                Welcome back
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[.94] tracking-[-.065em] xl:text-6xl">

                Your learning
                <br />

                space is
                <br />

                <span className="text-[#FF7659]">
                  waiting.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-white/40">
                Sign in to return to your courses, assignments,
                progress, and academic community.
              </p>

              <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.04] p-5">

                <div className="flex items-center justify-between">

                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-white/30">
                    Weekly progress
                  </p>

                  <span className="rounded-full bg-[#DFFF63] px-2.5 py-1 text-[9px] font-black text-black">
                    +12%
                  </span>
                </div>

                <p className="mt-4 text-4xl font-black">
                  78%
                </p>

                <div className="mt-5 flex h-14 items-end gap-1.5">

                  {[30, 55, 42, 72, 50, 90, 68].map(
                    (height, index) => (
                      <span
                        key={index}
                        style={{
                          height: `${height}%`,
                        }}
                        className={`w-full rounded-t-sm ${
                          index === 5
                            ? 'bg-[#DFFF63]'
                            : 'bg-white/10'
                        }`}
                      />
                    )
                  )}
                </div>

                <div className="mt-4 flex justify-between text-[10px] font-bold text-white/30">

                  <span>
                    This week
                  </span>

                  <span>
                    Goal completion
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/20">
              Secure access for your academic community.
            </p>
          </div>
        </aside>

        {/* =====================================================
            LOGIN
        ====================================================== */}

        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14">

          <div className="w-full max-w-[520px]">

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

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
                Sign in
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-[-.06em]">
                Welcome back.
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Choose your workspace and continue where you
                left off.
              </p>
            </div>

            <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_25px_70px_rgba(21,21,21,.07)] sm:p-7">

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-black/40">
                    Select workspace
                  </p>

                  <span className="text-[9px] font-black text-black/25">
                    STEP 01
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">

                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role)
                        setErrors({})
                        setMessage('')
                      }}
                      className={`hub-lift rounded-2xl border p-3 text-left ${
                        selectedRole.id === role.id
                          ? 'border-[#151515] bg-[#151515] text-white shadow-lg'
                          : 'border-black/10 bg-[#FAF8F3] hover:border-black/25'
                      }`}
                    >

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black ${
                          selectedRole.id === role.id
                            ? 'bg-[#DFFF63] text-[#151515]'
                            : 'bg-black/5 text-black/45'
                        }`}
                      >
                        {role.letter}
                      </span>

                      <span className="mt-3 block text-xs font-black">
                        {role.label}
                      </span>

                      <span
                        className={`mt-1 block text-[9px] leading-4 ${
                          selectedRole.id === role.id
                            ? 'text-white/40'
                            : 'text-black/35'
                        }`}
                      >
                        {role.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {message && (
                <div className="mt-5 rounded-2xl border border-[#F2C7BC] bg-[#FFF1ED] p-4 text-xs font-bold leading-5 text-[#B83D29]">
                  {message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >

                <Field
                  label="Academic email"
                  error={errors.email}
                >
                  <Input
                    placeholder="you@college.edu"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </Field>

                <Field
                  label="Password"
                  error={errors.password}
                >
                  <div className="relative">

                    <Input
                      placeholder="Enter your password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-black text-[#E85B43] hover:bg-[#FFF1ED]"
                    >
                      {showPassword
                        ? 'Hide'
                        : 'Show'}
                    </button>
                  </div>
                </Field>

                {selectedRole.id === 'admin' && (
                  <Field
                    label="Administrator access code"
                    error={errors.secretCode}
                  >
                    <Input
                      placeholder="Enter secure access code"
                      type="password"
                      value={secretCode}
                      onChange={(event) =>
                        setSecretCode(
                          event.target.value
                        )
                      }
                    />
                  </Field>
                )}

                <div className="flex justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        'Password recovery will be available soon.'
                      )
                    }
                    className="text-xs font-black text-[#E85B43]"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="hub-lift flex w-full items-center justify-center gap-3 rounded-2xl bg-[#151515] px-4 py-4 text-sm font-black text-white shadow-[0_15px_30px_rgba(21,21,21,.15)] hover:bg-[#292929] disabled:opacity-50"
                >
                  {loading
                    ? 'Signing you in…'
                    : `Enter ${selectedRole.label} workspace`}

                  {!loading && (
                    <span className="text-[#DFFF63]">
                      →
                    </span>
                  )}
                </button>
              </form>
            </div>

            <p className="mt-7 text-center text-sm text-black/45">

              New to CourseHub?{' '}

              <Link
                to="/register"
                className="font-black text-[#E85B43]"
              >
                Create your account
              </Link>
            </p>

            <button
              onClick={() => navigate('/')}
              className="mx-auto mt-5 block text-xs font-bold text-black/30 hover:text-[#E85B43]"
            >
              ← Back to home
            </button>
          </div>
        </main>
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

function BrandMark({
  dark = false,
}) {
  return (
    <span
      className={`relative flex h-10 w-10 items-center justify-center rounded-[13px] ${
        dark
          ? 'bg-white text-[#151515]'
          : 'bg-[#151515] text-white'
      }`}
    >
      <span className="h-3.5 w-3.5 rounded-[4px] border-2 border-current" />

      <span className="absolute h-1.5 w-1.5 translate-x-2.5 -translate-y-2.5 rounded-full bg-[#FF7659]" />
    </span>
  )
}

function roleName(roleId) {
  return (
    roles.find(
      (role) => role.roleId === roleId
    )?.label || 'correct'
  )
}

export default Login