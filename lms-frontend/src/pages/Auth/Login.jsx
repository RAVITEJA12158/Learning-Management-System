import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import { authApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const roles = [
  { id: 'student', roleId: 1, label: 'Student', detail: 'Access learning space', badge: 'S' },
  { id: 'faculty', roleId: 2, label: 'Faculty', detail: 'Teach and guide', badge: 'F' },
  { id: 'admin', roleId: 3, label: 'Administrator', detail: 'Manage your institution', badge: 'A' },
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

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    setMessage('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    if (selectedRole.id === 'admin' && !secretCode.trim()) nextErrors.secretCode = 'Administrator access code is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const data = await authApi.login(email.trim(), password, secretCode.trim())
      if (data.role_id !== selectedRole.roleId) {
        setMessage(`This account belongs to the ${roleName(data.role_id)} workspace. Select that role to continue.`)
        return
      }

      const user = { id: data.userId, name: data.username, email: email.trim(), role: selectedRole.id }
      localStorage.setItem('lms_token', data.token)
      login(user)
      navigate(selectedRole.id === 'student' ? '/student' : `/${selectedRole.id}`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#edf4ff] text-[#10213b]">
      <div className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#0b1930] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:38px_38px]" />
          <div className="absolute -right-28 top-24 h-72 w-72 rounded-full bg-[#2563eb]/35 blur-3xl" /><div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#14b8a6]/20 blur-3xl" />
          <button onClick={() => navigate('/')} className="relative z-10 hub-lift flex w-fit items-center gap-2.5"><CourseHubMark /><span className="text-xl font-extrabold tracking-[-.045em]">Course<span className="text-[#69e0d0]">Hub</span></span></button>
          <div className="relative z-10 max-w-md"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#69e0d0]">One connected workspace</p><h1 className="mt-4 text-5xl font-extrabold leading-[1.04] tracking-[-.06em]">The right space for your next move.</h1><p className="mt-6 text-lg leading-8 text-white/65">Pick your workspace, sign in securely, and return to the learning that matters.</p><div className="mt-10 grid grid-cols-3 gap-3"><Proof value="10k+" label="Learners" /><Proof value="500+" label="Courses" /><Proof value="4.9" label="Rating" /></div></div>
          <p className="relative z-10 text-xs text-white/40">Protected access for your academic community.</p>
        </aside>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[520px] rounded-[28px] border border-[#dce7f8] bg-white p-6 shadow-[0_24px_70px_rgba(20,56,105,.12)] sm:p-9">
            <div className="lg:hidden"><button onClick={() => navigate('/')} className="hub-lift flex items-center gap-2.5"><CourseHubMark /><span className="text-lg font-extrabold tracking-[-.045em]">Course<span className="text-[#2563eb]">Hub</span></span></button></div>
            <div className="mt-7 lg:mt-0"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#2563eb]">Welcome back</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.045em] text-[#10213b]">Sign in to CourseHub</h2><p className="mt-2 text-sm leading-6 text-slate-500">Choose your role first so we can take you to the right workspace.</p></div>

            <div className="mt-7"><p className="mb-3 text-xs font-extrabold uppercase tracking-[.13em] text-slate-500">I am signing in as</p><div className="grid gap-2 sm:grid-cols-3">{roles.map((role) => <RoleCard key={role.id} role={role} selected={selectedRole.id === role.id} onSelect={() => { setSelectedRole(role); setErrors({}); setMessage('') }} />)}</div></div>
            {message && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium leading-6 text-rose-700">{message}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field label="Academic email" error={errors.email}><Input placeholder="you@college.edu" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
              <Field label="Password" error={errors.password}><div className="relative"><Input placeholder="Enter your password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="hub-lift absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 text-xs font-bold text-[#2563eb]">{showPassword ? 'Hide' : 'Show'}</button></div></Field>
              {selectedRole.id === 'admin' && <Field label="Administrator access code" error={errors.secretCode}><Input placeholder="Enter your secure access code" type="password" value={secretCode} onChange={(event) => setSecretCode(event.target.value)} /></Field>}
              <div className="flex items-center justify-between pt-1"><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#2563eb]" />Keep me signed in</label><button type="button" onClick={() => setMessage('Password recovery will be available soon.')} className="hub-lift text-xs font-extrabold text-[#2563eb]">Forgot password?</button></div>
              <button disabled={loading} className="hub-lift mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(37,99,235,.23)] hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing you in…' : `Enter ${selectedRole.label} workspace`} <span>→</span></button>
            </form>
            <div className="my-7 h-px bg-slate-100" /><p className="text-center text-sm text-slate-500">New to CourseHub? <Link to="/register" className="hub-lift inline-block font-extrabold text-[#2563eb]">Create your account</Link></p><button onClick={() => navigate('/')} className="hub-lift mx-auto mt-5 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#2563eb]">← Back to home</button>
          </div>
        </main>
      </div>
    </div>
  )
}

function RoleCard({ role, selected, onSelect }) { return <button type="button" onClick={onSelect} className={`hub-lift rounded-xl border p-3 text-left ${selected ? 'border-[#2563eb] bg-[#eff6ff] shadow-[0_7px_16px_rgba(37,99,235,.1)]' : 'border-slate-200 bg-white hover:border-[#9cc0ff]'}`}><span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold ${selected ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-500'}`}>{role.badge}</span><span className="mt-3 block text-xs font-extrabold text-[#10213b]">{role.label}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{role.detail}</span></button> }
function Field({ label, error, children }) { return <div><label className="mb-2 block text-sm font-bold text-[#263550]">{label}</label>{children}{error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}</div> }
function Proof({ value, label }) { return <div className="hub-lift rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-lg font-extrabold">{value}</p><p className="mt-1 text-[10px] font-semibold text-white/45">{label}</p></div> }
function CourseHubMark() { return <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-[0_8px_16px_rgba(37,99,235,.3)]"><span className="h-3.5 w-3.5 rounded-[4px] border-2 border-white"/><span className="absolute h-1.5 w-1.5 translate-x-2.5 -translate-y-2.5 rounded-full bg-[#69e0d0]"/></span> }
function roleName(roleId) { return roles.find((role) => role.roleId === roleId)?.label || 'correct' }

export default Login
