import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const featureCards = [
  {
    number: '01',
    title: 'Everything in its place.',
    text: 'Lectures, resources, assignments, recordings, and announcements organized around the way you actually study.',
  },
  {
    number: '02',
    title: 'Know what matters next.',
    text: 'A focused overview of deadlines, upcoming classes, progress, and priorities without the usual dashboard noise.',
  },
  {
    number: '03',
    title: 'Progress with purpose.',
    text: 'Turn grades, feedback, and learning activity into a clearer picture of where you are going next.',
  },
]

const courses = [
  {
    code: 'CS 302',
    name: 'Data Structures',
    lesson: '12 lessons',
    progress: 72,
    accent: 'bg-[#DFFF63]',
    text: 'text-[#1A2414]',
    icon: 'code',
  },
  {
    code: 'CS 341',
    name: 'Web Systems',
    lesson: '08 lessons',
    progress: 46,
    accent: 'bg-[#A9E8D5]',
    text: 'text-[#102A24]',
    icon: 'browser',
  },
  {
    code: 'DS 220',
    name: 'Database Design',
    lesson: '10 lessons',
    progress: 89,
    accent: 'bg-[#FFB39E]',
    text: 'text-[#321D18]',
    icon: 'database',
  },
]

function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const to = (path) => navigate(path)

  const scrollTo = (id) => {
    setMenuOpen(false)

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
      })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F2E9] text-[#151515]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="relative overflow-hidden bg-[#F6F2E9]"
      >

        <div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#DFFF63]/30 blur-[100px]" />

        <div className="absolute left-[-180px] top-[35%] h-[430px] w-[430px] rounded-full bg-[#A9E8D5]/25 blur-[110px]" />

        <header className="relative z-30 border-b border-[#151515]/10">

          <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">

            <button
              onClick={() => scrollTo('home')}
              className="hub-lift flex items-center gap-3"
            >
              <BrandMark />

              <span className="text-lg font-black tracking-[-.06em]">
                CourseHub
              </span>
            </button>

            <nav className="hidden items-center gap-8 lg:flex">

              {[
                ['Discover', 'home'],
                ['Experience', 'experience'],
                ['For educators', 'educators'],
                ['Stories', 'stories'],
              ].map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  className="text-sm font-bold text-[#151515]/55 transition hover:text-[#151515]"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden items-center gap-3 sm:flex">

              <button
                onClick={() => to('/login')}
                className="hub-lift rounded-full px-4 py-2.5 text-sm font-black hover:bg-black/5"
              >
                Sign in
              </button>

              <button
                onClick={() => to('/register')}
                className="hub-lift rounded-full bg-[#151515] px-5 py-2.5 text-sm font-black text-white shadow-lg hover:bg-[#292929]"
              >
                Get started
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-[#151515]/15 p-2.5 sm:hidden"
              aria-label="Open menu"
            >
              <Glyph
                name={menuOpen ? 'close' : 'menu'}
                size={20}
              />
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#151515]/10 bg-[#F6F2E9] px-5 py-4 sm:hidden">

              <div className="grid gap-1">

                {[
                  ['Discover', 'home'],
                  ['Experience', 'experience'],
                  ['For educators', 'educators'],
                  ['Stories', 'stories'],
                ].map(([label, id]) => (
                  <button
                    key={label}
                    onClick={() => scrollTo(id)}
                    className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-black/5"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-black/10 pt-4">

                <button
                  onClick={() => to('/login')}
                  className="rounded-xl border border-black/15 py-3 text-sm font-black"
                >
                  Sign in
                </button>

                <button
                  onClick={() => to('/register')}
                  className="rounded-xl bg-[#151515] py-3 text-sm font-black text-white"
                >
                  Get started
                </button>
              </div>
            </div>
          )}
        </header>

        {/* HERO */}

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#151515]/10 bg-white/50 px-3.5 py-2 text-[11px] font-black uppercase tracking-[.15em]">

                <span className="h-2 w-2 rounded-full bg-[#E85B43]" />

                The learning operating system
              </div>

              <h1 className="mt-7 text-[58px] font-black leading-[.9] tracking-[-.075em] sm:text-[76px] lg:text-[88px]">

                Learning
                <br />

                without the
                <br />

                <span className="relative inline-block">

                  <span className="relative z-10">
                    clutter.
                  </span>

                  <span className="absolute bottom-1 left-0 z-0 h-5 w-full -rotate-1 rounded-full bg-[#DFFF63] sm:h-7" />
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#151515]/58 sm:text-lg sm:leading-8">
                CourseHub gives students, faculty, and academic teams one
                beautifully focused place to learn, teach, organize, and move
                forward.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <button
                  onClick={() => to('/register')}
                  className="hub-lift inline-flex items-center gap-3 rounded-full bg-[#151515] px-6 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)]"
                >
                  Start learning

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFFF63] text-[#151515]">
                    →
                  </span>
                </button>

                <button
                  onClick={() => scrollTo('experience')}
                  className="hub-lift rounded-full border border-[#151515]/15 bg-white/50 px-6 py-4 text-sm font-black"
                >
                  See how it works
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">

                <MiniProof
                  value="10k+"
                  label="active learners"
                />

                <MiniProof
                  value="95%"
                  label="completion rate"
                />

                <MiniProof
                  value="4.9"
                  label="student rating"
                />
              </div>
            </div>

            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#151515] py-24 text-white lg:py-32">

        <div className="absolute right-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-[#DFFF63]/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#DFFF63]">
                More than an LMS
              </p>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
                Designed around attention, not administration.
              </p>
            </div>

            <div>

              <h2 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-.055em] sm:text-5xl lg:text-6xl">
                The academic space you actually want to open.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
                No more digging through menus, scattered resources, or
                overloaded dashboards. CourseHub puts the important things
                directly in front of you.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-3">

            {featureCards.map((card) => (
              <article
                key={card.number}
                className="group bg-[#1C1C1C] p-7 transition hover:bg-[#222]"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-black text-white/30">
                    {card.number}
                  </span>

                  <span className="text-xl transition group-hover:translate-x-1">
                    ↗
                  </span>
                </div>

                <h3 className="mt-16 max-w-xs text-2xl font-black leading-tight tracking-[-.04em]">
                  {card.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/45">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
      ====================================================== */}

      <section
        id="experience"
        className="relative overflow-hidden bg-[#F6F2E9] py-24 lg:py-32"
      >

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#A9E8D5]/30 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
                Your learning cockpit
              </p>

              <h2 className="mt-4 max-w-lg text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
                See your day.
                <br />
                Own your pace.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-[#151515]/55">
                A quiet overview of the work that matters, the deadlines
                coming up, and the progress you've already made.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#151515]/10 bg-white/60 px-4 py-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFFF63] text-xs font-black">
                  ✓
                </span>

                <span className="text-xs font-black">
                  Built around your attention
                </span>
              </div>
            </div>

            <LearningCockpit />
          </div>
        </div>
      </section>

      {/* =====================================================
          COURSES
      ====================================================== */}

      <section
        id="educators"
        className="bg-[#E9E4DA] py-24 lg:py-32"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.8fr]">

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
                Your courses
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl lg:text-6xl">
                Your whole semester,
                <br />
                beautifully within reach.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#151515]/55 lg:justify-self-end">
              Browse your courses visually, understand your progress instantly,
              and jump directly into the work that needs you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">

            {courses.map((course, index) => (
              <CourseCard
                key={course.code}
                course={course}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ROLES
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#DFFF63] py-24 lg:py-32">

        <div className="absolute right-[-100px] top-[-200px] h-[500px] w-[500px] rounded-full bg-white/40 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-end gap-10 lg:grid-cols-[.9fr_1.1fr]">

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#344018]">
                One system. Every role.
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-black leading-[.98] tracking-[-.06em] sm:text-5xl lg:text-6xl">
                Everyone gets a space that makes sense.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <RoleTile
                number="01"
                title="Students"
                text="Stay ahead of classes, assignments, and goals."
              />

              <RoleTile
                number="02"
                title="Faculty"
                text="Teach, assess, and communicate with clarity."
              />

              <RoleTile
                number="03"
                title="Teams"
                text="Keep the academic picture connected."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORIES
      ====================================================== */}

      <section
        id="stories"
        className="bg-[#F6F2E9] py-24 lg:py-32"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
                Learner stories
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
                Less chaos.
                <br />
                More progress.
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-6 text-[#151515]/45">
              Thoughtful technology should disappear into the background and
              let the work shine.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_.85fr_.85fr]">

            <Quote
              featured
              name="Ishita Nair"
              course="B.Des · Visual Communication"
              quote="CourseHub finally made my workload feel possible. It is the first thing I open when I start studying."
            />

            <Quote
              name="Arjun Rao"
              course="B.Tech · Computer Science"
              quote="I love the calm overview. Deadlines no longer sneak up on me."
            />

            <Quote
              name="Dr. Meera Shah"
              course="Faculty · Economics"
              quote="It is intuitive enough that students just get started."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="bg-[#F6F2E9] px-5 pb-24 sm:px-8 lg:pb-32">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[34px] bg-[#151515] px-6 py-16 text-white sm:px-12 lg:py-24">

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#DFFF63]/20 blur-[90px]" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#A9E8D5]/15 blur-[100px]" />

          <div className="relative mx-auto max-w-3xl text-center">

            <p className="text-xs font-black uppercase tracking-[.18em] text-[#DFFF63]">
              Your next chapter
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">
              Make learning feel
              <br />
              lighter.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Create your CourseHub account and bring your academic life into
              one focused space.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <button
                onClick={() => to('/register')}
                className="hub-lift rounded-full bg-[#DFFF63] px-6 py-4 text-sm font-black text-[#151515]"
              >
                Create your account →
              </button>

              <button
                onClick={() => to('/login')}
                className="hub-lift rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-black"
              >
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#151515] text-white">

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.7fr_repeat(3,1fr)]">

          <div>

            <div className="flex items-center gap-3">

              <BrandMark dark />

              <span className="text-lg font-black tracking-[-.05em]">
                CourseHub
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/40">
              The place where better learning takes shape.
            </p>
          </div>

          <FooterColumn
            title="Platform"
            items={[
              'Courses',
              'Assignments',
              'Progress',
              'Calendar',
            ]}
          />

          <FooterColumn
            title="Company"
            items={[
              'About CourseHub',
              'For faculty',
              'For institutions',
              'Contact',
            ]}
          />

          <FooterColumn
            title="Account"
            items={[
              'Sign in',
              'Create account',
              'Help center',
              'Privacy',
            ]}
          />
        </div>

        <div className="border-t border-white/10">

          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-5 text-xs text-white/25 sm:px-8">

            <span>
              © 2026 CourseHub. Thoughtfully made for learning.
            </span>

            <span>
              Privacy · Terms
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ============================================================
   HERO DASHBOARD
============================================================ */

function HeroDashboard() {
  return (
    <div className="relative">

      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#DFFF63]/40 blur-[70px]" />

      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#A9E8D5]/35 blur-[80px]" />

      <div className="relative rounded-[30px] border border-[#151515]/10 bg-[#151515] p-3 shadow-[0_35px_90px_rgba(21,21,21,.20)] sm:p-5">

        <div className="rounded-[22px] bg-[#F8F5EF] p-4 sm:p-5">

          <div className="flex items-center justify-between border-b border-black/10 pb-4">

            <div className="flex items-center gap-3">

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DFFF63] text-[#151515]">
                <Glyph
                  name="layers"
                  size={18}
                />
              </span>

              <div>
                <p className="text-xs font-black">
                  Good morning, Aarav
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-black/35">
                  Here's your learning rhythm
                </p>
              </div>
            </div>

            <span className="rounded-xl border border-black/10 p-2 text-black/45">
              <Glyph
                name="bell"
                size={16}
              />
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1.25fr_.75fr]">

            <div className="rounded-[20px] bg-[#151515] p-5 text-white">

              <div className="flex items-center justify-between">

                <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#DFFF63]">
                  Your week
                </p>

                <span className="text-[10px] font-bold text-white/30">
                  +12%
                </span>
              </div>

              <p className="mt-3 text-4xl font-black tracking-[-.05em]">
                78%
              </p>

              <p className="mt-1 text-[10px] text-white/35">
                of your goal completed
              </p>

              <div className="mt-6 flex h-16 items-end gap-1.5">

                {[35, 58, 42, 73, 50, 92, 67].map(
                  (height, index) => (
                    <span
                      key={index}
                      style={{
                        height: `${height}%`,
                      }}
                      className={`w-full rounded-t-sm ${
                        index === 5
                          ? 'bg-[#DFFF63]'
                          : 'bg-white/15'
                      }`}
                    />
                  )
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-black/10 bg-white p-4">

              <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/30">
                Up next
              </p>

              <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB39E]/30 text-[#D45A40]">
                <Glyph
                  name="calendar"
                  size={18}
                />
              </div>

              <p className="mt-3 text-xs font-black">
                Algorithms quiz
              </p>

              <p className="mt-1 text-[10px] text-black/35">
                Today · 2:00 PM
              </p>

              <span className="mt-3 inline-block rounded-full bg-[#FFB39E]/30 px-2 py-1 text-[9px] font-black text-[#B64A34]">
                Due today
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-[20px] border border-black/10 bg-white p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[9px] font-black uppercase tracking-[.14em] text-black/30">
                  Current focus
                </p>

                <p className="mt-1 text-xs font-black">
                  Data Structures & Algorithms
                </p>
              </div>

              <span className="text-xs font-black">
                72%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">

              <div className="h-full w-[72%] rounded-full bg-[#151515]" />
            </div>

            <div className="mt-3 flex justify-between text-[9px] font-bold text-black/30">

              <span>
                9 of 12 lessons
              </span>

              <span>
                Keep going →
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_15px_35px_rgba(0,0,0,.12)] sm:block">

        <div className="flex items-center gap-3">

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFFF63] text-xs font-black">
            ✓
          </span>

          <div>
            <p className="text-[10px] font-black">
              Assignment submitted
            </p>

            <p className="text-[9px] text-black/35">
              Nice work!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   LEARNING COCKPIT
============================================================ */

function LearningCockpit() {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_25px_70px_rgba(21,21,21,.08)] sm:p-7">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#E85B43]">
            Wednesday · Sept 18
          </p>

          <h3 className="mt-1 text-xl font-black tracking-[-.03em]">
            Make today count.
          </h3>
        </div>

        <span className="rounded-xl bg-[#F3EFE7] p-2 text-black/45">
          <Glyph
            name="calendar"
            size={18}
          />
        </span>
      </div>

      <div className="mt-7 space-y-4">

        {[
          [
            '10:00',
            'Web systems lecture',
            'Live class · Room 204',
            'bg-[#151515]',
          ],
          [
            '14:00',
            'Algorithms quiz',
            'Assessment · 45 minutes',
            'bg-[#E85B43]',
          ],
          [
            '17:30',
            'Study sprint',
            'Personal goal · 60 minutes',
            'bg-[#59BFA2]',
          ],
        ].map(([time, title, sub, dot]) => (
          <div
            key={time}
            className="flex gap-4"
          >

            <span className="w-10 pt-1 text-xs font-black text-black/30">
              {time}
            </span>

            <span
              className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${dot}`}
            />

            <div className="min-w-0 flex-1 border-b border-black/8 pb-4">

              <p className="text-sm font-black">
                {title}
              </p>

              <p className="mt-1 text-xs text-black/35">
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">

        <div className="rounded-2xl bg-[#DFFF63] p-4">

          <p className="text-[9px] font-black uppercase tracking-[.12em]">
            Focus time
          </p>

          <p className="mt-2 text-2xl font-black">
            14.5h
          </p>

          <p className="mt-1 text-[9px] font-bold text-black/40">
            This week
          </p>
        </div>

        <div className="rounded-2xl bg-[#151515] p-4 text-white">

          <p className="text-[9px] font-black uppercase tracking-[.12em] text-white/35">
            Class standing
          </p>

          <p className="mt-2 text-2xl font-black">
            Top 12%
          </p>

          <p className="mt-1 text-[9px] font-bold text-white/35">
            Looking good
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  course,
  index,
}) {
  return (
    <article
      className={`hub-lift overflow-hidden rounded-[26px] ${course.accent} ${course.text} p-6 shadow-[0_20px_45px_rgba(21,21,21,.08)] ${
        index === 1
          ? 'lg:translate-y-8'
          : ''
      }`}
    >

      <div className="flex items-start justify-between">

        <span className="rounded-full bg-black/10 px-3 py-1.5 text-[10px] font-black">
          {course.code}
        </span>

        <span className="rounded-xl bg-black/10 p-2">
          <Glyph
            name={course.icon}
            size={18}
          />
        </span>
      </div>

      <div className="mt-20">

        <h3 className="text-2xl font-black tracking-[-.04em]">
          {course.name}
        </h3>

        <div className="mt-5 flex items-center justify-between text-xs font-black">

          <span>
            {course.lesson}
          </span>

          <span>
            {course.progress}%
          </span>
        </div>

        <div className="mt-2 h-1.5 rounded-full bg-black/10">

          <div
            style={{
              width: `${course.progress}%`,
            }}
            className="h-full rounded-full bg-[#151515]"
          />
        </div>
      </div>
    </article>
  )
}

/* ============================================================
   ROLE TILE
============================================================ */

function RoleTile({
  number,
  title,
  text,
}) {
  return (
    <div className="hub-lift rounded-[22px] border border-black/10 bg-black/[0.05] p-5">

      <p className="text-[10px] font-black text-black/35">
        {number}
      </p>

      <h3 className="mt-12 text-lg font-black tracking-[-.03em]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-black/50">
        {text}
      </p>
    </div>
  )
}

/* ============================================================
   QUOTE
============================================================ */

function Quote({
  quote,
  name,
  course,
  featured = false,
}) {
  return (
    <figure
      className={`hub-lift rounded-[26px] p-7 ${
        featured
          ? 'bg-[#151515] text-white shadow-[0_20px_50px_rgba(21,21,21,.14)]'
          : 'border border-black/10 bg-white'
      }`}
    >

      <div
        className={`text-sm tracking-[.15em] ${
          featured
            ? 'text-[#DFFF63]'
            : 'text-[#E85B43]'
        }`}
      >
        ★★★★★
      </div>

      <blockquote className="mt-7 text-xl font-black leading-8 tracking-[-.025em]">
        “{quote}”
      </blockquote>

      <figcaption
        className={`mt-9 border-t pt-5 ${
          featured
            ? 'border-white/10'
            : 'border-black/10'
        }`}
      >

        <b className="block text-sm">
          {name}
        </b>

        <span
          className={`mt-1 block text-xs ${
            featured
              ? 'text-white/35'
              : 'text-black/35'
          }`}
        >
          {course}
        </span>
      </figcaption>
    </figure>
  )
}

/* ============================================================
   MINI PROOF
============================================================ */

function MiniProof({
  value,
  label,
}) {
  return (
    <div className="flex items-center gap-2">

      <strong className="text-sm font-black">
        {value}
      </strong>

      <span className="text-xs font-semibold text-black/40">
        {label}
      </span>
    </div>
  )
}

/* ============================================================
   BRAND
============================================================ */

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

      <span className="absolute h-1.5 w-1.5 translate-x-2.5 -translate-y-2.5 rounded-full bg-[#E85B43]" />
    </span>
  )
}

/* ============================================================
   GLYPH
============================================================ */

function Glyph({
  name,
  size = 20,
}) {
  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    check: (
      <path d="m5 12 4 4L19 6" />
    ),

    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),

    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),

    bell: (
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    ),

    calendar: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
        />

        <path d="M16 3v4" />

        <path d="M8 3v4" />

        <path d="M3 10h18" />
      </>
    ),

    code: (
      <>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="M14 5l-4 14" />
      </>
    ),

    browser: (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
        />

        <path d="M3 8h18" />

        <path d="M7 6h.01" />

        <path d="M10 6h.01" />
      </>
    ),

    database: (
      <>
        <ellipse
          cx="12"
          cy="5"
          rx="7"
          ry="3"
        />

        <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />

        <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
      </>
    ),

    student: (
      <>
        <circle
          cx="12"
          cy="8"
          r="3"
        />

        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),

    faculty: (
      <>
        <path d="M3 10 12 5l9 5-9 5-9-5Z" />

        <path d="M7 12v5c3 2 7 2 10 0v-5" />

        <path d="M21 10v5" />
      </>
    ),

    building: (
      <>
        <path d="M3 21h18" />

        <path d="M5 21V8l7-4 7 4v13" />

        <path d="M9 21v-5h6v5" />

        <path d="M9 11h.01" />

        <path d="M15 11h.01" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

/* ============================================================
   FOOTER COLUMN
============================================================ */

function FooterColumn({
  title,
  items,
}) {
  return (
    <div>

      <h3 className="text-sm font-black">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">

        {items.map((item) => (
          <li key={item}>

            <a
              href="#home"
              className="text-sm text-white/35 transition hover:text-[#DFFF63]"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Landing