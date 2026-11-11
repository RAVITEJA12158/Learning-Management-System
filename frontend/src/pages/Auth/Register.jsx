import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SpotlightCard from '../../components/common/SpotlightCard';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';

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
  {
    id: 'admin',
    label: 'Admin',
    letter: 'A',
    description: 'Manage institution',
  },
];

const highlights = [
  { num: '01', text: 'Curated courses & interactive modules' },
  { num: '02', text: 'Real-time assignment & quiz tracking' },
  { num: '03', text: 'Collaborative academic community' },
];

// Matches backend STRONG_PASSWORD_REGEX: 8+ chars, uppercase, lowercase, digit, special character
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [highlightsVisible, setHighlightsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    setMessage('');
    setSuccess(false);

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must contain at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Academic email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid academic email address';
    }

    const cleanedMobile = mobileNumber.replace(/[\s\-()]/g, '');
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?\d{10,15}$/.test(cleanedMobile)) {
      newErrors.mobileNumber = 'Enter a valid 10 to 15 digit mobile number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!STRONG_PASSWORD_REGEX.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special symbol';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (selectedRole.id === 'admin' && !secretCode.trim()) {
      newErrors.secretCode = 'Administrator secret code is required';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms to continue';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const generatedUsername =
        email
          .trim()
          .split('@')[0]
          .replace(/[^a-zA-Z0-9_]/g, '') ||
        name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');

      const data = await authApi.register({
        name: name.trim(),
        username: generatedUsername,
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        mobile_number: cleanedMobile,
        role: selectedRole.id,
        ...(selectedRole.id === 'admin' ? { secretCode: secretCode.trim() } : {}),
      });

      const returnedRole = (data.role || selectedRole.id).toLowerCase();

      // Auto-login immediately using the JWT token returned by POST /api/auth/register
      if (data.token) {
        login({
          token: data.token,
          user: {
            id: data.userId,
            name: data.name || name.trim(),
            username: data.username || generatedUsername,
            email: email.trim().toLowerCase(),
            mobileNumber: cleanedMobile,
            role: returnedRole,
            department: data.department,
            semester: data.semester,
            bio: data.bio,
            profileImage: data.profileImage,
          },
        });
      }

      setSuccess(true);
      setMessage('Account created! Entering your workspace...');

      const targetPath =
        returnedRole === 'admin'
          ? '/admin'
          : returnedRole === 'faculty'
          ? '/faculty'
          : '/student';

      navigate(targetPath, { replace: true });
    } catch (error) {
      setMessage(error.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLoginSuccess(credentialResponse) {
    if (!credentialResponse?.credential) {
      setMessage('Google did not return an ID token. Please try again.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const data = await authApi.googleLogin({
        credential: credentialResponse.credential,
        ...(selectedRole.id === 'admin' ? { secretCode: secretCode.trim() } : {}),
      });
      const returnedRole = (data.role || 'STUDENT').toLowerCase();
      login({
        token: data.token,
        user: {
          id: data.userId,
          name: data.name || 'Scholar',
          username: data.username,
          email: data.email,
          role: returnedRole,
          department: data.department,
          semester: data.semester,
          bio: data.bio,
          profileImage: data.profileImage,
        },
      });
      navigate(returnedRole === 'student' ? '/student' : `/${returnedRole}`, { replace: true });
    } catch (error) {
      setMessage(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const selectedIndex = roles.findIndex((r) => r.id === selectedRole.id);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] dark:bg-[#030712] transition-colors">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <main className="animate-panel-left flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#030712] px-4 py-8 sm:px-8 lg:px-12 transition-colors">
          <div className="w-full max-w-[500px]">
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 cursor-pointer"
              >
                <BrandMark darkBg />
                <span className="text-xl font-bold text-slate-900 dark:text-white">CourseHub</span>
              </button>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-400">
                GET STARTED
              </p>
              <h2 className="animate-heading mt-1.5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Create account.
              </h2>
              <p className="animate-subtext mt-2 text-sm text-slate-500 dark:text-gray-400">
                Choose your workspace and start your academic journey.
              </p>
            </div>

            <div className="animate-card-bloom mt-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] dark:shadow-2xl dark:shadow-black/50 sm:p-7 transition-colors">
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
                  <div
                    className="pointer-events-none absolute inset-y-0 rounded-2xl bg-[#48566a] dark:bg-cyan-500/20 dark:border dark:border-cyan-500/40 shadow-sm transition-transform duration-300 ease-out"
                    style={{
                      width: 'calc((100% - 20px) / 3)',
                      transform: `translateX(calc(${selectedIndex} * (100% + 10px)))`,
                    }}
                  />

                  {roles.map((role) => {
                    const isSelected = selectedRole.id === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setErrors({});
                          setMessage('');
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
                    );
                  })}
                </div>
              </div>

              {message && (
                <div
                  className={`mt-4 rounded-xl border p-3 text-xs font-medium ${
                    success
                      ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : 'border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      ACADEMIC EMAIL
                    </label>
                    <input
                      type="email"
                      placeholder="you@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      MOBILE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.mobileNumber}</p>
                    )}
                  </div>
                </div>

                {selectedRole.id === 'admin' && (
                  <div className="animate-auth-fade">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      ADMIN SECRET CODE
                    </label>
                    <input
                      type="password"
                      placeholder="Enter institutional admin code"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    {errors.secretCode && (
                      <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.secretCode}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars, upper, lower, digit & symbol"
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

                  {password && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-1 items-center gap-1.5">
                          {[1, 2, 3, 4].map((level) => {
                            const active = passwordStrength.score >= level;
                            const color =
                              passwordStrength.score <= 1
                                ? 'bg-rose-500'
                                : passwordStrength.score === 2
                                ? 'bg-amber-500'
                                : passwordStrength.score === 3
                                ? 'bg-emerald-500'
                                : 'bg-blue-600 dark:bg-cyan-400';
                            return (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  active ? color : 'bg-slate-200 dark:bg-white/10'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                            passwordStrength.score <= 1
                              ? 'text-rose-600 dark:text-rose-400'
                              : passwordStrength.score === 2
                              ? 'text-amber-600 dark:text-amber-400'
                              : passwordStrength.score === 3
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-blue-600 dark:text-cyan-400'
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 dark:text-gray-400">
                        <span className={passwordStrength.checks.length ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                          {passwordStrength.checks.length ? '✓' : '○'} 8+ characters
                        </span>
                        <span className={passwordStrength.checks.upper && passwordStrength.checks.lower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                          {passwordStrength.checks.upper && passwordStrength.checks.lower ? '✓' : '○'} Upper & lowercase
                        </span>
                        <span className={passwordStrength.checks.digit ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                          {passwordStrength.checks.digit ? '✓' : '○'} At least 1 number
                        </span>
                        <span className={passwordStrength.checks.special ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                          {passwordStrength.checks.special ? '✓' : '○'} Special symbol (!@#$...)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
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
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 pr-14 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#1a6ef5] dark:accent-cyan-400"
                    />
                    <span className="text-[11px] leading-4 text-slate-600 dark:text-gray-400">
                      I agree to the LMS terms of service and acknowledge that my academic information will be securely managed.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.terms}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a6ef5] dark:bg-[#0066FF] px-4 py-3.5 text-sm font-medium text-white shadow-sm dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#155bd5] dark:hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Creating account…</span>
                    </div>
                  ) : (
                    <div key={selectedRole.id} className="animate-cta-swap flex items-center gap-1.5">
                      <span>Register as {selectedRole.label}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </div>
                  )}
                </button>
              </form>
              <GoogleSignInButton
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setMessage('Google sign-in was cancelled or could not be completed.')}
              />
            </div>

            <p className="mt-5 text-center text-xs text-slate-600 dark:text-gray-400 sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-slate-900 dark:text-cyan-400 transition-colors hover:underline">
                Sign in
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

        <aside className="animate-panel-right relative hidden flex-col justify-between overflow-hidden bg-[#030712] p-8 xl:p-12 text-white lg:flex border-l border-white/5">
          <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

          <button
            onClick={() => navigate('/')}
            className="flex w-fit items-center gap-3 transition-opacity duration-200 hover:opacity-90 relative z-10 cursor-pointer"
          >
            <BrandMark darkBg />
            <span className="text-xl font-bold tracking-tight text-white">CourseHub</span>
          </button>

          <div className="max-w-lg py-4 relative z-10">
            <h1 className="animate-heading text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[54px]">
              Make space
              <br />
              for learning.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                Start today.
              </span>
            </h1>

            <p className="animate-subtext mt-5 max-w-sm text-[15px] leading-relaxed text-gray-400">
              Join CourseHub to access interactive courses, track your academic milestones, and connect with faculty.
            </p>

            <SpotlightCard alwaysDark className="mt-9 w-full max-w-[390px] p-5 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                  LEARNING DASHBOARD
                </p>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  READY
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {highlights.map((item, index) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3.5 py-2.5 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 ease-out"
                    style={{
                      opacity: highlightsVisible ? 1 : 0,
                      transform: highlightsVisible ? 'translateY(0)' : 'translateY(8px)',
                      transitionDelay: `${index * 130}ms`,
                    }}
                  >
                    <span className="text-[11px] font-bold text-cyan-400">{item.num}</span>
                    <span className="text-xs font-semibold text-gray-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          <p className="text-xs text-gray-500 relative z-10 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            Secure access for your academic community.
          </p>
        </aside>
      </div>
    </div>
  );
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
  );
}

function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
  };

  if (!password) {
    return { score: 0, label: '', checks };
  }

  const passedCount = Object.values(checks).filter(Boolean).length;

  if (passedCount <= 2) {
    return { score: 1, label: 'Weak', checks };
  }
  if (passedCount === 3) {
    return { score: 2, label: 'Fair', checks };
  }
  if (passedCount === 4) {
    return { score: 3, label: 'Good', checks };
  }
  return { score: 4, label: 'Strong', checks };
}

export default Register;
