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
          {menuOpen && <div className="border-t border-white/10 bg-[#151b36] px-5 py-4 sm:hidden"><div className="grid gap-1">{['Discover', 'Experience', 'For educators', 'Stories'].map((label, i) => <button key={label} onClick={() => scrollTo(['home', 'experience', 'educators', 'stories'][i])} className="rounded-lg px-3 py-3 text-left text-sm font-bold text-white/75 hover:bg-white/10">{label}</button>)}</div><div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4"><button onClick={() => to('/login')} className="rounded-xl border border-white/20 py-2.5 text-sm font-bold">Sign in</button><button onClick={() => to('/register')} className="rounded-xl bg-[#9df5d8] py-2.5 text-sm font-extrabold text-[#112037]">Create account</button></div></div>}
        </header>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pt-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:pt-24">
          <div className="max-w-xl"><div className="hub-lift inline-flex items-center gap-2 rounded-full border border-[#9df5d8]/20 bg-[#9df5d8]/10 px-3.5 py-2 text-xs font-bold text-[#9df5d8]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#9df5d8]" />The learning space, reimagined</div><h1 className="mt-6 text-5xl font-extrabold tracking-[-.07em] sm:text-6xl lg:text-[72px] lg:leading-[.98]">Study with<br /><span className="text-[#a99aff]">your flow.</span></h1><p className="mt-7 max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8">CourseHub brings your coursework, progress, and people into one beautifully focused space—so you can spend less time organizing and more time learning.</p><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => to('/register')} className="hub-lift inline-flex items-center gap-2 rounded-xl bg-[#705cff] px-5 py-3.5 text-sm font-extrabold shadow-[0_12px_30px_rgba(112,92,255,.35)] hover:bg-[#816dff]">Begin your journey <Glyph name="arrow" size={17}/></button><button onClick={() => scrollTo('experience')} className="hub-lift inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white/85 hover:bg-white/10">Take a look <Glyph name="play" size={16}/></button></div><div className="mt-11 flex flex-wrap gap-x-8 gap-y-3"><MiniProof number="10k+" text="active learners" /><MiniProof number="4.9/5" text="student rating" /><MiniProof number="95%" text="completion rate" /></div></div>
          <HeroProduct />
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"><SectionLead label="More than an LMS" title="The academic hub you’ll actually want to open." copy="A fast, uncluttered home for everything learning asks of you." /><p className="max-w-xs border-l-2 border-[#705cff] pl-4 text-sm leading-6 text-slate-500">Designed around attention, not administration.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{featureCards.map((card) => <FeatureCard key={card.title} {...card} />)}</div></section>

        <section id="experience" className="bg-[#ecebff] py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="grid items-end gap-7 lg:grid-cols-[.75fr_1.25fr]"><SectionLead label="Your learning cockpit" title="See your day. Own your pace." copy="No hunting through tabs. CourseHub turns the important stuff into a quiet, clear plan." /><div className="grid gap-4 sm:grid-cols-3"><TinyMetric label="Focus time" value="14.5h" note="This week" color="bg-[#232a4b] text-white" /><TinyMetric label="Assignments" value="03" note="Due this week" color="bg-white text-[#151933]" /><TinyMetric label="Class standing" value="Top 12%" note="Looking good" color="bg-[#9df5d8] text-[#123029]" /></div></div><div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><Timeline /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1"><Notification /><FocusCard /></div></div></div></section>

        <section id="educators" className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-28"><CourseGallery /><div><SectionLead label="For every kind of learner" title="Built to move with your ambition." copy="Explore a course catalogue that feels visual, personal, and alive—then keep every learning thread in reach." /><ul className="mt-7 space-y-4">{['Personal course roadmap', 'Smart deadlines and announcements', 'Progress you can act on', 'A single home on every device'].map((text) => <li key={text} className="hub-lift flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-bold shadow-sm"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ecebff] text-[#705cff]"><Glyph name="check" size={15}/></span>{text}</li>)}</ul><button onClick={() => to('/login')} className="hub-lift mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#5945dd]">Explore courses <Glyph name="arrow" size={17}/></button></div></section>

        <section className="bg-[#151a33] py-20 text-white lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="grid items-end gap-7 lg:grid-cols-[.9fr_1.1fr]"><SectionLead dark label="Made for people" title="Where every role feels at home." copy="One shared system, tailored thoughtfully for the people who use it." /><div className="grid gap-3 sm:grid-cols-3"><RoleTile glyph="student" name="Students" line="Stay in the flow" /><RoleTile glyph="faculty" name="Faculty" line="Teach with clarity" /><RoleTile glyph="building" name="Teams" line="See the big picture" /></div></div></div></section>

        <section id="stories" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><SectionLead label="Loved by learners" title="A little less chaos. A lot more progress." copy="Thoughtful technology fades into the background and lets the work shine." /><div className="mt-11 grid gap-5 lg:grid-cols-[1.1fr_.9fr_.9fr]"><Quote featured name="Ishita Nair" course="B.Des · Visual Communication" quote="CourseHub finally made my workload feel possible. It is the first thing I open when I start studying." /><Quote name="Arjun Rao" course="B.Tech · Computer Science" quote="I love the calm overview. Deadlines no longer sneak up on me." /><Quote name="Dr. Meera Shah" course="Faculty · Economics" quote="It is intuitive enough that students just get started." /></div></section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28"><div className="relative overflow-hidden rounded-[30px] bg-[#705cff] px-6 py-14 text-center text-white shadow-[0_26px_70px_rgba(112,92,255,.3)] sm:px-12 sm:py-20"><div className="absolute -left-14 top-0 h-60 w-60 rounded-full bg-[#9df5d8]/25 blur-3xl" /><div className="absolute -right-14 bottom-0 h-60 w-60 rounded-full bg-[#ffbf81]/25 blur-3xl" /><div className="relative mx-auto max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-white/70">Your next chapter starts here</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">Learning can feel this good.</h2><p className="mt-5 text-lg leading-7 text-white/80">Start your CourseHub journey and build the habits that take you further.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button onClick={() => to('/register')} className="hub-lift inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#5140d3] shadow-lg">Create your account <Glyph name="arrow" size={17}/></button><button onClick={() => to('/login')} className="hub-lift rounded-xl border border-white/30 px-5 py-3.5 text-sm font-bold hover:bg-white/10">I have an account</button></div></div></div></section>
      </main>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.7fr_repeat(3,1fr)]"><div><div className="flex items-center gap-2.5"><Mark /><span className="text-lg font-extrabold tracking-[-.04em]">Course<span className="text-[#705cff]">Hub</span></span></div><p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">The place where better learning takes shape.</p></div><FooterColumn title="Platform" items={['Courses', 'Assignments', 'Progress', 'Calendar']} /><FooterColumn title="Company" items={['About CourseHub', 'For faculty', 'For institutions', 'Contact']} /><FooterColumn title="Account" items={['Sign in', 'Create account', 'Help center', 'Privacy']} /></div><div className="border-t border-slate-100"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-slate-400 sm:px-8"><span>© 2026 CourseHub. Thoughtfully made for learning.</span><span>Privacy · Terms</span></div></div></footer>
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