import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import BrandMark from '../components/common/BrandMark'
import {
  SunIcon,
  MoonIcon,
  BookIcon,
  ChartIcon,
  DocumentIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '../components/common/Icons'

const featureCards = [
  {
    number: '01',
    icon: BookIcon,
    title: 'Everything in its place.',
    text: 'Lectures, resources, assignments, and recordings organized seamlessly around the way you actually study.',
  },
  {
    number: '02',
    icon: ChartIcon,
    title: 'Know what matters next.',
    text: 'A focused overview of upcoming deadlines, lectures, progress metrics, and priorities without clutter.',
  },
  {
    number: '03',
    icon: DocumentIcon,
    title: 'Progress with purpose.',
    text: 'Turn grades, quiz feedback, and milestones into actionable roadmaps that keep you moving forward.',
  },
  {
    number: '04',
    icon: ClipboardCheckIcon,
    title: 'Academic integrity & control.',
    text: 'Seamless collaboration between students, faculty, and administrators with granular role management.',
  },
]

const previewCourses = [
  {
    code: 'CS 302',
    name: 'Data Structures & Algorithms',
    lesson: '12 lessons',
    progress: 74,
    instructor: 'Dr. Sarah Wilson',
    category: 'Computer Science',
  },
  {
    code: 'CS 341',
    name: 'Modern Web Systems',
    lesson: '08 lessons',
    progress: 52,
    instructor: 'Prof. Alex Chen',
    category: 'Software Engineering',
  },
  {
    code: 'DS 220',
    name: 'Relational Database Architecture',
    lesson: '10 lessons',
    progress: 88,
    instructor: 'Dr. Michael Kumar',
    category: 'Data Systems',
  },
]

function Landing() {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const to = (path) => navigate(path)

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F6FA] dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200 font-sans">
      {/* =====================================================
          1. STICKY NAVIGATION BAR (MATCHING DASHBOARD)
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xs transition-colors duration-200">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollTo('home')}
              className="hub-lift flex items-center gap-3 cursor-pointer"
            >
              <BrandMark dark={isDark} />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                CourseHub
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-6 lg:flex">
              {[
                ['Discover', 'home'],
                ['Experience', 'experience'],
                ['Features', 'features'],
                ['For Educators', 'educators'],
                ['Stories', 'stories'],
              ].map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Theme Toggle & Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button (Same as Dashboard) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              {isDark ? (
                <SunIcon className="h-4 w-4 text-amber-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => to('/login')}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Sign in
              </button>

              <button
                onClick={() => to('/register')}
                className="hub-lift flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]"
              >
                Get started
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 sm:hidden"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 sm:hidden">
            <div className="grid gap-1">
              {[
                ['Discover', 'home'],
                ['Experience', 'experience'],
                ['Features', 'features'],
                ['For Educators', 'educators'],
                ['Stories', 'stories'],
              ].map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  className="rounded-lg px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200/80 dark:border-zinc-800 pt-3">
              <button
                onClick={() => to('/login')}
                className="rounded-xl border border-slate-200 dark:border-zinc-700 py-2.5 text-center text-xs font-bold text-slate-800 dark:text-zinc-200"
              >
                Sign in
              </button>
              <button
                onClick={() => to('/register')}
                className="rounded-xl bg-blue-600 py-2.5 text-center text-xs font-bold text-white shadow-sm"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          2. HERO SECTION
      ====================================================== */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 lg:pb-28">
        {/* Subtle Ambient Backdrops */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />
        <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left Hero Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                The modern academic workspace
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Study with{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  your flow.
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
                CourseHub brings your courses, assignments, quizzes, and academic community into one beautifully focused hub—engineered for clarity, speed, and real mastery.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => to('/register')}
                  className="hub-lift inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 transition"
                >
                  Begin your journey
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <button
                  onClick={() => scrollTo('experience')}
                  className="hub-lift inline-flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  Explore preview
                </button>
              </div>

              {/* Proof Badges */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-zinc-800 pt-6">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">10k+</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Active Learners</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">4.9/5</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Student Rating</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">95%</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Completion Rate</p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Dashboard Preview Card */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl shadow-slate-900/5 transition-colors">
                {/* Header in Preview */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                      <BookIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Active Courses</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Spring Semester 2026</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                    Live Sync
                  </span>
                </div>

                {/* Course List in Preview */}
                <div className="mt-4 space-y-3">
                  {previewCourses.map((c) => (
                    <div
                      key={c.code}
                      className="rounded-xl border border-slate-100 dark:border-zinc-800/60 bg-slate-50/70 dark:bg-zinc-800/40 p-4 transition hover:border-slate-300 dark:hover:border-zinc-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {c.code}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                            {c.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                            {c.instructor} · {c.lesson}
                          </p>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-zinc-100">
                          {c.progress}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer in Preview */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50/60 dark:bg-blue-950/30 p-3.5 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center gap-2.5">
                    <ChartIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      Overall Semester Progress
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    71.3% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          3. FEATURES SECTION ("MORE THAN AN LMS")
      ====================================================== */}
      <section id="features" className="py-20 border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                CORE CAPABILITIES
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                The academic hub you’ll actually want to open.
              </h2>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-zinc-400">
                A fast, uncluttered home for coursework, submissions, assessments, and real-time collaboration.
              </p>
            </div>
            <p className="max-w-xs border-l-2 border-blue-600 dark:border-blue-500 pl-4 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Engineered around high focus, not administrative overhead.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card) => {
              const IconComponent = card.icon
              return (
                <div
                  key={card.title}
                  className="hub-lift rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-[#F3F6FA] dark:bg-zinc-900 p-6 shadow-xs transition hover:border-blue-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <IconComponent className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-extrabold text-slate-400 dark:text-zinc-500">
                      {card.number}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-zinc-100">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                    {card.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          4. INTERACTIVE COCKPIT SECTION
      ====================================================== */}
      <section id="experience" className="py-20 bg-[#F3F6FA] dark:bg-zinc-950 border-t border-slate-200/80 dark:border-zinc-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                YOUR LEARNING COCKPIT
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                See your day. Own your pace.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-zinc-400">
                No endless tab switching. CourseHub turns submissions, announcements, and deadlines into a calm, structured workflow.
              </p>
            </div>

            {/* Quick Metrics (Dashboard Style) */}
            <div className="grid gap-3.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Focus Time</p>
                <p className="mt-1 text-2xl font-black text-slate-900 dark:text-zinc-50">14.5h</p>
                <p className="mt-0.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Active this week</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Pending Tasks</p>
                <p className="mt-1 text-2xl font-black text-slate-900 dark:text-zinc-50">03</p>
                <p className="mt-0.5 text-amber-600 dark:text-amber-400 font-semibold">Due this week</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Class Standing</p>
                <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">Top 12%</p>
                <p className="mt-0.5 text-slate-500 dark:text-zinc-400 font-medium">Semester ranking</p>
              </div>
            </div>
          </div>

          {/* Interactive Row: Timeline & Notifications */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Timeline Widget */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  Today&apos;s Academic Schedule
                </p>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  3 Sessions
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { time: '09:00 AM', title: 'Data Structures & Algorithms', tag: 'Lecture', hall: 'Hall B-201', active: false },
                  { time: '11:30 AM', title: 'Modern Web Systems Lab', tag: 'Hands-on Lab', hall: 'Tech Lab 4', active: true },
                  { time: '02:00 PM', title: 'Database Design Seminar', tag: 'Tutorial', hall: 'Virtual Room', active: false },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`flex items-center justify-between rounded-xl p-3.5 transition ${
                      item.active
                        ? 'border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30'
                        : 'border border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 w-16">
                        {item.time}
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full ${item.active ? 'bg-blue-600 ring-4 ring-blue-500/20' : 'bg-slate-300 dark:bg-zinc-600'}`} />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">{item.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">{item.hall}</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stack: Notifications & Study Session */}
            <div className="space-y-6">
              {/* Notification Box */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-3.5">
                  Recent Alerts
                </p>
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/30 p-3">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Assignment due tomorrow</p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">Database Systems — Normalized ER Schema</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/30 p-3">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">New grade published</p>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Web Systems — Quiz 3: 94% (Score: A)</p>
                  </div>
                </div>
              </div>

              {/* Study Sprint Focus Box */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Study Session</p>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-zinc-50">2h 14m</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Algorithms deep-dive in progress</p>
                <div className="mt-3.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600 w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          5. ROLE TAILORING ("WHERE EVERY ROLE FEELS AT HOME")
      ====================================================== */}
      <section id="educators" className="py-20 border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              BUILT FOR YOUR CAMPUS
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Where every role feels at home.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-zinc-400">
              One unified architecture tailored specifically for each academic persona.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                role: 'Students',
                badge: 'LEARNER WORKSPACE',
                tagline: 'Stay in the academic flow',
                desc: 'Organized course catalogs, interactive assignment dropboxes, live progress trackers, and direct faculty feedback.',
                features: ['Instant grade visibility', 'Assignment deadlines timeline', 'Curated course catalog'],
              },
              {
                role: 'Faculty',
                badge: 'INSTRUCTOR WORKSPACE',
                tagline: 'Teach with complete clarity',
                desc: 'Effortless module creation, flexible grading rubrics, announcements broadcast, and student progress oversight.',
                features: ['Comprehensive rubric grading', 'Content module builder', 'Student performance analytics'],
              },
              {
                role: 'Administrators',
                badge: 'CAMPUS WORKSPACE',
                tagline: 'See the big picture',
                desc: 'Institutional analytics, role permissions governance, audit visibility, and course lifecycle orchestration.',
                features: ['Campus-wide enrollment logs', 'Access codes governance', 'Secure role provisioning'],
              },
            ].map((item) => (
              <div
                key={item.role}
                className="hub-lift rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-[#F3F6FA] dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-xs hover:border-blue-500/40 transition"
              >
                <div>
                  <span className="inline-block rounded-md bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                    {item.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-zinc-100">{item.role}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{item.tagline}</p>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-400">{item.desc}</p>
                </div>

                <div className="mt-6 border-t border-slate-200/80 dark:border-zinc-800 pt-4 space-y-2">
                  {item.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-zinc-300">
                      <CheckCircleIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          6. TESTIMONIALS SECTION ("LOVED BY LEARNERS")
      ====================================================== */}
      <section id="stories" className="py-20 border-t border-slate-200/80 dark:border-zinc-800 bg-[#F3F6FA] dark:bg-zinc-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              COMMUNITY VOICES
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Loved by learners & faculty.
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400">
              Thoughtful technology that fades into the background and lets learning shine.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Ishita Nair',
                role: 'Student · Visual Communication',
                quote: 'CourseHub finally made my academic workload feel possible. It is genuinely the first thing I open every morning.',
              },
              {
                name: 'Arjun Rao',
                role: 'Student · Computer Science',
                quote: 'The calm dashboard layout is unmatched. Deadlines and lecture resources never get lost in browser tabs anymore.',
              },
              {
                name: 'Dr. Meera Shah',
                role: 'Faculty · Department of Economics',
                quote: 'It is intuitive enough that students get started immediately with zero training required. Grading and rubric distribution is seamless.',
              },
            ].map((q) => (
              <div
                key={q.name}
                className="hub-lift rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-zinc-300 italic">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{q.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{q.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          7. FINAL CTA BANNER
      ====================================================== */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-14 text-center text-white shadow-xl shadow-blue-500/10 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl" />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              YOUR NEXT CHAPTER STARTS TODAY
            </p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Learning can feel this good.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100 leading-relaxed">
              Start your CourseHub journey today and build the academic habits that take you further.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => to('/register')}
                className="hub-lift inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-md hover:bg-slate-50 transition"
              >
                Create your account
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => to('/login')}
                className="hub-lift rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                I have an account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          8. FOOTER (MATCHING DASHBOARD STYLING)
      ====================================================== */}
      <footer className="border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark dark={isDark} />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                CourseHub
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
              The modern academic platform where focused learning and clean collaboration take shape.
            </p>
          </div>

          {[
            {
              title: 'Platform',
              links: ['Course Catalog', 'Assignments', 'Student Dashboard', 'Faculty Portal'],
            },
            {
              title: 'Organization',
              links: ['About CourseHub', 'For Educators', 'Administration', 'Security & Access'],
            },
            {
              title: 'Account',
              links: ['Sign In', 'Create Account', 'Help & Docs', 'Terms of Service'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => to('/login')}
                      className="text-xs text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-zinc-800/80 py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between items-center gap-2 px-4 sm:px-8 text-xs text-slate-400 dark:text-zinc-500">
            <span>© 2026 CourseHub. Built for modern academic communities.</span>
            <div className="flex gap-4">
              <span className="hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing