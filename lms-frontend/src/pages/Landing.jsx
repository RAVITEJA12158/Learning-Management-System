import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import lavenderLandscape from '../assets/ChatGPT Image Aug 27, 2026, 10_27_36 AM.png'
import lavenderWaves from '../assets/ChatGPT Image Aug 27, 2026, 10_27_29 AM.png'

const featureCards = [
  { icon: 'layers', title: 'A calmer course space', text: 'Every lecture, resource, and recording arranged exactly where it belongs.', accent: 'bg-violet-100 text-violet-700' },
  { icon: 'spark', title: 'Momentum, made visible', text: 'See what is next, what is due, and how far you have come—at a glance.', accent: 'bg-amber-100 text-amber-700' },
  { icon: 'target', title: 'Feedback that moves you', text: 'Turn grades, comments, and assessment results into your next best step.', accent: 'bg-emerald-100 text-emerald-700' },
  { icon: 'shield', title: 'Private by default', text: 'Thoughtful role-based access for students, faculty, and administrators.', accent: 'bg-sky-100 text-sky-700' },
]

const courses = [
  { code: 'CS 302', name: 'Data Structures', lesson: '12 lessons', progress: 72, color: 'from-[#8068ff] to-[#5046de]', icon: 'code' },
  { code: 'CS 341', name: 'Web Systems', lesson: '08 lessons', progress: 46, color: 'from-[#1eb99d] to-[#0b8d87]', icon: 'browser' },
  { code: 'DS 220', name: 'Database Design', lesson: '10 lessons', progress: 89, color: 'from-[#fa9961] to-[#ee6d5d]', icon: 'database' },
]

function Landing() {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [cursor, setCursor] = useState({ x: '50%', y: '20%' })

  function requireAuth() {
    setShowAuth(true)
  }

  function goToLogin() {
    setShowAuth(false)
    navigate('/login')
  }

  function goToRegister() {
    setShowAuth(false)
    navigate('/register')
  }

  return (
    <div className="aurora-page min-h-screen bg-[#f8f3ff] text-violet-950" style={{ '--cursor-x': cursor.x, '--cursor-y': cursor.y }} onMouseMove={(event) => setCursor({ x: `${event.clientX}px`, y: `${event.clientY}px` })}>
      <img src={lavenderLandscape} alt="" className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-80" />
      {/* Navbar */}
      <header className="border-b border-violet-200/70 bg-white/35 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold"
          >
            LMS<span className="text-violet-400">.</span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={requireAuth}
              className="text-sm text-violet-700 hover:text-violet-950"
            >
              Courses
            </button>

            <button
              onClick={requireAuth}
              className="text-sm text-violet-700 hover:text-violet-950"
            >
              Features
            </button>

            <button
              onClick={requireAuth}
              className="text-sm text-violet-700 hover:text-violet-950"
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goToLogin}
              className="rounded-lg px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 hover:text-violet-950"
            >
              Login
            </button>

            <button
              onClick={goToRegister}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Register
            </button>
          </div>
          {menuOpen && <div className="border-t border-white/10 bg-[#151b36] px-5 py-4 sm:hidden"><div className="grid gap-1">{['Discover', 'Experience', 'For educators', 'Stories'].map((label, i) => <button key={label} onClick={() => scrollTo(['home', 'experience', 'educators', 'stories'][i])} className="rounded-lg px-3 py-3 text-left text-sm font-bold text-white/75 hover:bg-white/10">{label}</button>)}</div><div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4"><button onClick={() => to('/login')} className="rounded-xl border border-white/20 py-2.5 text-sm font-bold">Sign in</button><button onClick={() => to('/register')} className="rounded-xl bg-[#9df5d8] py-2.5 text-sm font-extrabold text-[#112037]">Create account</button></div></div>}
        </header>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pt-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:pt-24">
          <div className="max-w-xl"><div className="hub-lift inline-flex items-center gap-2 rounded-full border border-[#9df5d8]/20 bg-[#9df5d8]/10 px-3.5 py-2 text-xs font-bold text-[#9df5d8]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#9df5d8]" />The learning space, reimagined</div><h1 className="mt-6 text-5xl font-extrabold tracking-[-.07em] sm:text-6xl lg:text-[72px] lg:leading-[.98]">Study with<br /><span className="text-[#a99aff]">your flow.</span></h1><p className="mt-7 max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8">CourseHub brings your coursework, progress, and people into one beautifully focused space—so you can spend less time organizing and more time learning.</p><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => to('/register')} className="hub-lift inline-flex items-center gap-2 rounded-xl bg-[#705cff] px-5 py-3.5 text-sm font-extrabold shadow-[0_12px_30px_rgba(112,92,255,.35)] hover:bg-[#816dff]">Begin your journey <Glyph name="arrow" size={17}/></button><button onClick={() => scrollTo('experience')} className="hub-lift inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white/85 hover:bg-white/10">Take a look <Glyph name="play" size={16}/></button></div><div className="mt-11 flex flex-wrap gap-x-8 gap-y-3"><MiniProof number="10k+" text="active learners" /><MiniProof number="4.9/5" text="student rating" /><MiniProof number="95%" text="completion rate" /></div></div>
          <HeroProduct />
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
                Learning Management System
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Learn.
                <span className="block text-violet-400">Grow.</span>
                Succeed.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-violet-800/80 md:text-lg">
                Manage courses, assignments, learning materials, and
                academic progress through one centralized platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={goToRegister}
                  className="button-glow rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-fuchsia-500"
                >
                  Get Started
                </button>

                <button
                 type="button"
                 onClick={() => setShowAuth(true)}
                 className="rounded-lg border border-violet-300 bg-white/55 px-6 py-3 font-semibold text-violet-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:bg-white"
                >
                 Explore Courses
                </button>
              </div>

              <div className="mt-10 flex gap-8">
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="mt-1 text-sm text-violet-700/70">Courses</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">1,200+</p>
                  <p className="mt-1 text-sm text-violet-700/70">Students</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">80+</p>
                  <p className="mt-1 text-sm text-violet-700/70">Faculty</p>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="interactive-surface group relative overflow-hidden rounded-[2rem] border border-violet-200 bg-white/65 p-5 shadow-2xl shadow-violet-200/50 backdrop-blur">
              <img src={lavenderWaves} alt="Abstract lavender waves" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/75 to-violet-100/40" />
              <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-700/75">Dashboard</p>
                  <h2 className="text-xl font-semibold">
                    Learning Overview
                  </h2>
                </div>

                <div className="rounded-lg bg-violet-200/70 px-3 py-2 text-sm font-semibold text-violet-800">
                  Student
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DashboardCard
                  title="Enrolled Courses"
                  value="12"
                />

                <DashboardCard
                  title="Overall Progress"
                  value="78%"
                />

                <DashboardCard
                  title="Assignments"
                  value="08"
                />

                <DashboardCard
                  title="Certificates"
                  value="04"
                />
              </div>

              <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-violet-700/75">
                      Current Course
                    </p>

                    <p className="mt-1 font-semibold">
                      Full Stack Development
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-violet-700">
                    78%
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-violet-100">
                  <div className="h-2 w-[78%] rounded-full bg-violet-500" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-violet-200/70 bg-white/35">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Platform Features
              </p>

        <section className="bg-[#151a33] py-20 text-white lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="grid items-end gap-7 lg:grid-cols-[.9fr_1.1fr]"><SectionLead dark label="Made for people" title="Where every role feels at home." copy="One shared system, tailored thoughtfully for the people who use it." /><div className="grid gap-3 sm:grid-cols-3"><RoleTile glyph="student" name="Students" line="Stay in the flow" /><RoleTile glyph="faculty" name="Faculty" line="Teach with clarity" /><RoleTile glyph="building" name="Teams" line="See the big picture" /></div></div></div></section>

              <p className="mx-auto mt-4 max-w-2xl text-violet-800/75">
                A unified platform designed for students, faculty, and
                administrators.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon="📚"
                title="Course Management"
                description="Browse courses, access learning materials, and track your academic progress."
                onClick={requireAuth}
              />

              <FeatureCard
                icon="📝"
                title="Assignments"
                description="Submit assignments, monitor deadlines, and keep track of completed work."
                onClick={requireAuth}
              />

              <FeatureCard
                icon="📊"
                title="Progress Tracking"
                description="Monitor your learning progress and identify areas for improvement."
                onClick={requireAuth}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 px-6 py-14 text-center">
            <h2 className="text-3xl font-bold">
              Start your learning journey
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-violet-800/75">
              Create your account and access your personalized LMS
              dashboard.
            </p>

            <button
              onClick={goToRegister}
              className="button-glow mt-7 rounded-lg bg-violet-600 px-7 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-fuchsia-500"
            >
              Create Account
            </button>
          </div>
        </section>
      </main>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="relative w-full max-w-sm rounded-2xl border border-violet-200 bg-[#fffaff] p-8 shadow-2xl shadow-violet-300/40">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute right-5 top-4 text-2xl text-violet-600 transition hover:rotate-90 hover:text-violet-950"
            >
              ×
            </button>

            <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-400/10 text-2xl">
                🔐
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Login Required
              </h2>

              <p className="mt-3 text-sm leading-6 text-violet-800/75">
                Please login or create an account to access this
                feature.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={goToLogin}
                  className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500"
                >
                  Login
                </button>

                <button
                  onClick={goToRegister}
                  className="flex-1 rounded-lg border border-violet-300 bg-white px-4 py-3 font-semibold text-violet-800 transition hover:bg-violet-100"
                >
                  Register
                </button>
              </div>

              <button
                onClick={() => setShowAuth(false)}
                className="mt-5 text-sm text-violet-600 hover:text-violet-950"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-xl border border-violet-100 bg-white/80 p-4 shadow-sm">
      <p className="text-sm text-violet-700/75">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="interactive-surface rounded-2xl border border-violet-200 bg-white/55 p-6 text-left"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/10 text-xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-violet-800/75">
        {description}
      </p>

      <p className="mt-5 text-sm font-semibold text-violet-700">
        Explore →
      </p>
    </button>
  )
}

export default Landing
