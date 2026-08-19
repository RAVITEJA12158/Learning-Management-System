import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold"
          >
            LMS<span className="text-blue-500">.</span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={requireAuth}
              className="text-sm text-slate-300 hover:text-white"
            >
              Courses
            </button>

            <button
              onClick={requireAuth}
              className="text-sm text-slate-300 hover:text-white"
            >
              Features
            </button>

            <button
              onClick={requireAuth}
              className="text-sm text-slate-300 hover:text-white"
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goToLogin}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Login
            </button>

            <button
              onClick={goToRegister}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                Learning Management System
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Learn.
                <span className="block text-blue-500">Grow.</span>
                Succeed.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                Manage courses, assignments, learning materials, and
                academic progress through one centralized platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={goToRegister}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                >
                  Get Started
                </button>

                <button
                 type="button"
                 onClick={() => setShowAuth(true)}
                 className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-900"
                >
                 Explore Courses
                </button>
              </div>

              <div className="mt-10 flex gap-8">
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="mt-1 text-sm text-slate-500">Courses</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">1,200+</p>
                  <p className="mt-1 text-sm text-slate-500">Students</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">80+</p>
                  <p className="mt-1 text-sm text-slate-500">Faculty</p>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Dashboard</p>
                  <h2 className="text-xl font-semibold">
                    Learning Overview
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
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

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Current Course
                    </p>

                    <p className="mt-1 font-semibold">
                      Full Stack Development
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-blue-400">
                    78%
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-[78%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-slate-800 bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Everything in one place
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
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
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-14 text-center">
            <h2 className="text-3xl font-bold">
              Start your learning journey
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Create your account and access your personalized LMS
              dashboard.
            </p>

            <button
              onClick={goToRegister}
              className="mt-7 rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500"
            >
              Create Account
            </button>
          </div>
        </section>
      </main>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute right-5 top-4 text-2xl text-slate-500 hover:text-white"
            >
              ×
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-2xl">
                🔐
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Login Required
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Please login or create an account to access this
                feature.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={goToLogin}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
                >
                  Login
                </button>

                <button
                  onClick={goToRegister}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-3 font-semibold hover:bg-slate-800"
                >
                  Register
                </button>
              </div>

              <button
                onClick={() => setShowAuth(false)}
                className="mt-5 text-sm text-slate-500 hover:text-slate-300"
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
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/40"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <p className="mt-5 text-sm font-semibold text-blue-400">
        Explore →
      </p>
    </button>
  )
}

export default Landing