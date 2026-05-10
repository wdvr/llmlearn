import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { courses, allModules, findCourse, findModuleCourse } from './content/courses'

const ModulePage = React.lazy(() => import('./components/ModulePage'))
const PRReview = React.lazy(() => import('./components/PRReview'))
const ClaudeChat = React.lazy(() => import('./components/ClaudeChat'))
const Scratch = React.lazy(() => import('./components/Scratch'))

const RouteFallback = () => (
  <div className="content"><p>Loading...</p></div>
)

const STORAGE_VERSION = 2

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(() => readStorage('completed', []))
  const [chatOpen, setChatOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    try { return parseInt(localStorage.getItem('font_size') || '15') } catch { return 15 }
  })
  const [quizScores, setQuizScores] = useState(() => readStorage('quiz_scores', {}))
  const [lastVisited, setLastVisited] = useState(() => readStorage('last_visited', null))
  const [currentSection, setCurrentSection] = useState(null)

  // One-time migration: stamp the schema version so future shape changes can
  // diff against it without silently wiping user progress.
  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('schema_version') || '0')
      if (v < STORAGE_VERSION) {
        localStorage.setItem('schema_version', String(STORAGE_VERSION))
      }
    } catch {}
  }, [])

  // Derive active course from URL
  const activeCourse = useMemo(() => {
    const moduleMatch = location.pathname.match(/^\/module\/(.+)$/)
    if (moduleMatch) return findModuleCourse(moduleMatch[1])
    const courseMatch = location.pathname.match(/^\/course\/(.+)$/)
    if (courseMatch) return findCourse(courseMatch[1])
    return null
  }, [location.pathname])

  const activeModule = useMemo(() => {
    const m = location.pathname.match(/^\/module\/(.+)$/)
    if (!m) return null
    return allModules.find(x => x.id === m[1]) || null
  }, [location.pathname])

  // Build app context for Claude chat
  const appContext = useMemo(() => {
    const path = location.pathname
    const moduleMatch = path.match(/^\/module\/(.+)$/)

    if (moduleMatch) {
      const mod = allModules.find(m => m.id === moduleMatch[1])
      const course = findModuleCourse(moduleMatch[1])
      return {
        currentPage: 'module',
        currentCourse: course ? { id: course.id, title: course.title } : null,
        currentModule: mod ? { title: mod.title, description: mod.description, sections: mod.sections?.map(s => ({ title: s.title })) } : null,
        currentSection,
        completedModules: completed,
        quizScores,
        totalModules: course ? course.modules.length : allModules.length,
      }
    } else if (path.startsWith('/prs')) {
      return {
        currentPage: 'prs',
        completedModules: completed,
        quizScores,
        totalModules: allModules.length,
      }
    }
    return {
      currentPage: 'home',
      currentCourse: activeCourse ? { id: activeCourse.id, title: activeCourse.title } : null,
      completedModules: completed,
      quizScores,
      totalModules: allModules.length,
    }
  }, [location.pathname, completed, quizScores, currentSection, activeCourse])

  useEffect(() => {
    localStorage.setItem('completed', JSON.stringify(completed))
  }, [completed])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
    document.documentElement.style.setProperty('--font-size-code', `${fontSize - 2}px`)
    localStorage.setItem('font_size', fontSize.toString())
  }, [fontSize])

  // Track last-visited module for the "Resume" CTA on the landing page.
  useEffect(() => {
    if (activeModule) {
      const entry = { moduleId: activeModule.id, ts: Date.now() }
      setLastVisited(entry)
      try { localStorage.setItem('last_visited', JSON.stringify(entry)) } catch {}
    }
  }, [activeModule?.id])

  // Close mobile drawer on every navigation.
  useEffect(() => { setNavOpen(false) }, [location.pathname])

  const markComplete = (moduleId) => {
    if (!completed.includes(moduleId)) {
      setCompleted([...completed, moduleId])
    }
  }

  const unmarkComplete = (moduleId) => {
    setCompleted(completed.filter(id => id !== moduleId))
  }

  const resetProgress = () => {
    if (!confirm('Reset all course progress? This clears completed modules and quiz scores. This cannot be undone.')) return
    setCompleted([])
    setQuizScores({})
    setLastVisited(null)
    try {
      localStorage.removeItem('completed')
      localStorage.removeItem('quiz_scores')
      localStorage.removeItem('last_visited')
    } catch {}
  }

  // Progress for active course or global
  const courseModules = activeCourse ? activeCourse.modules : allModules
  const courseCompleted = courseModules.filter(m => completed.includes(m.id)).length
  const progress = Math.round((courseCompleted / courseModules.length) * 100)

  // Show "PR Review" in the global Tools section only if at least one course has curated PRs.
  const anyCuratedPRs = courses.some(c => c.curatedPRs?.length > 0)

  return (
    <div className={`app ${navOpen ? 'nav-open' : ''}`}>
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button
          className="hamburger"
          onClick={() => setNavOpen(o => !o)}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
        >
          <span /><span /><span />
        </button>
        <Link to="/" className="mobile-brand" onClick={() => setNavOpen(false)}>
          <span className="brand-dot" /> LLM Learn
        </Link>
        {activeCourse && (
          <span className="mobile-course-badge" style={{ borderColor: activeCourse.color, color: activeCourse.color }}>
            {activeCourse.icon}
          </span>
        )}
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${navOpen ? 'open' : ''}`} aria-label="Course navigation">
        <div className="sidebar-header">
          <Link to="/" className="brand-link" onClick={() => setNavOpen(false)}>
            <span className="brand-dot" />
            <span>
              <h1>{activeCourse ? activeCourse.title : 'LLM Learn'}</h1>
              <p>{activeCourse ? activeCourse.subtitle : 'GPU programming, end-to-end'}</p>
            </span>
          </Link>
        </div>

        <div className="sidebar-nav">
          {activeCourse ? (
            <>
              <Link to="/" className="nav-item nav-back">
                <span aria-hidden="true">←</span>
                <span>All Courses</span>
              </Link>

              <div className="nav-section">Modules</div>
              <Link
                to={`/course/${activeCourse.id}`}
                className={`nav-item ${location.pathname === `/course/${activeCourse.id}` ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>Overview</span>
              </Link>

              {activeCourse.modules.map((mod) => {
                const isActive = location.pathname === `/module/${mod.id}`
                return (
                  <React.Fragment key={mod.id}>
                    <Link
                      to={`/module/${mod.id}`}
                      className={`nav-item ${isActive ? 'active' : ''} ${completed.includes(mod.id) ? 'completed' : ''}`}
                    >
                      <span className="nav-dot" />
                      <span>{mod.title}</span>
                    </Link>
                    {isActive && mod.sections && mod.sections.length > 1 && (
                      <div className="nav-subsections">
                        {mod.sections.map((s) => {
                          const slug = String(s.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                          const active = currentSection === s.title
                          return (
                            <a
                              key={slug}
                              href={`#${slug}`}
                              className={`nav-subitem ${active ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault()
                                const el = document.getElementById(slug)
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }}
                            >
                              {s.title}
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </React.Fragment>
                )
              })}

              <div className="nav-section">Tools</div>
              <Link
                to="/scratch"
                className={`nav-item ${location.pathname.startsWith('/scratch') ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>Python Scratchpad</span>
              </Link>
              {activeCourse.curatedPRs && activeCourse.curatedPRs.length > 0 && (
                <Link
                  to="/prs"
                  className={`nav-item ${location.pathname.startsWith('/prs') ? 'active' : ''}`}
                >
                  <span className="nav-dot" />
                  <span>PR Review</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <div className="nav-section">Courses</div>
              {courses.map(c => {
                const done = c.modules.filter(m => completed.includes(m.id)).length
                const pct = Math.round((done / c.modules.length) * 100)
                return (
                  <Link
                    key={c.id}
                    to={`/course/${c.id}`}
                    className={`nav-item nav-course ${location.pathname === `/course/${c.id}` ? 'active' : ''}`}
                    style={{ '--course-color': c.color }}
                  >
                    <span className="nav-dot course-dot" />
                    <span className="nav-course-text">
                      <span className="nav-course-title">
                        <span aria-hidden="true">{c.icon}</span> {c.title}
                      </span>
                      <span className="nav-course-meta">
                        {done}/{c.modules.length} · {pct}%
                      </span>
                    </span>
                  </Link>
                )
              })}

              <div className="nav-section">Tools</div>
              <Link
                to="/scratch"
                className={`nav-item ${location.pathname.startsWith('/scratch') ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>Python Scratchpad</span>
              </Link>
              {anyCuratedPRs && (
                <Link
                  to="/prs"
                  className={`nav-item ${location.pathname.startsWith('/prs') ? 'active' : ''}`}
                >
                  <span className="nav-dot" />
                  <span>PR Review</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {activeCourse && (
            <>
              <div className="progress-bar" aria-label={`Course progress ${progress}%`}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-text">
                {courseCompleted}/{courseModules.length} modules — {progress}%
              </div>
            </>
          )}
          <div className="footer-controls">
            <div className="font-controls" role="group" aria-label="Font size">
              <button
                onClick={() => setFontSize(s => Math.max(11, s - 1))}
                aria-label="Decrease font size"
                title="Decrease font size"
              >−</button>
              <span className="font-size-value" aria-live="polite">{fontSize}</span>
              <button
                onClick={() => setFontSize(s => Math.min(20, s + 1))}
                aria-label="Increase font size"
                title="Increase font size"
              >+</button>
            </div>
            <button
              type="button"
              className="reset-btn"
              onClick={resetProgress}
              title="Reset all progress"
              aria-label="Reset all progress"
            >Reset</button>
          </div>
          <div className="footer-meta">
            <span className="footer-build">{__COMMIT_HASH__} · v{__BUILD_NUM__}</span>
            <a
              href="/oauth2/sign_out?rd=https://auth.thelittleone.rocks/oauth2/sign_out?rd=https://llm.thelittleone.rocks"
              className="footer-logout"
            >logout</a>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {navOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  courses={courses}
                  completed={completed}
                  lastVisited={lastVisited}
                />
              }
            />
            <Route path="/course/:courseId" element={<CoursePage courses={courses} completed={completed} />} />
            <Route
              path="/module/:id"
              element={
                <ModulePage
                  modules={allModules}
                  completed={completed}
                  onComplete={markComplete}
                  onUncomplete={unmarkComplete}
                  onQuizScore={(moduleId, score, total) => {
                    const updated = { ...quizScores, [moduleId]: { score, total, ts: Date.now() } }
                    setQuizScores(updated)
                    try { localStorage.setItem('quiz_scores', JSON.stringify(updated)) } catch {}
                    // Auto-mark complete when the user passes (≥ 70%).
                    if (total > 0 && score / total >= 0.7) {
                      markComplete(moduleId)
                    }
                  }}
                  onSectionChange={setCurrentSection}
                />
              }
            />
            <Route
              path="/prs"
              element={<PRReview courses={courses} />}
            />
            <Route path="/scratch" element={<Scratch />} />
          </Routes>
        </Suspense>
      </main>

      {/* Claude Chat */}
      <Suspense fallback={null}>
        <ClaudeChat isOpen={chatOpen} onClose={() => setChatOpen(false)} appContext={appContext} />
      </Suspense>
      <button
        className="chat-toggle"
        onClick={() => setChatOpen(!chatOpen)}
        title="Ask Claude"
        aria-label={chatOpen ? 'Close Claude chat' : 'Open Claude chat'}
        aria-expanded={chatOpen}
      >
        <span aria-hidden="true">💬</span>
      </button>
    </div>
  )
}

function LandingPage({ courses, completed, lastVisited }) {
  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0)
  const totalDone = courses.reduce(
    (acc, c) => acc + c.modules.filter(m => completed.includes(m.id)).length,
    0
  )
  const totalPct = totalModules ? Math.round((totalDone / totalModules) * 100) : 0

  // Resolve last-visited module against the manifest so we can show its title.
  const resumeModule = useMemo(() => {
    if (!lastVisited?.moduleId) return null
    for (const c of courses) {
      const m = c.modules.find(x => x.id === lastVisited.moduleId)
      if (m) return { module: m, course: c }
    }
    return null
  }, [lastVisited, courses])

  return (
    <div className="home">
      <section className="hero">
        <h2>Learn how LLMs <em>actually</em> run on a GPU.</h2>
        <p className="subtitle">
          Three hands-on tracks — CUDA foundations first, then PyTorch for LLMs,
          then Apple MPS if you're on a Mac. Real exercises, quizzes, progress
          tracking. Pick a path below or pick up where you left off.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{courses.length}</div>
            <div className="hero-stat-label">courses</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{totalModules}</div>
            <div className="hero-stat-label">modules</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{totalPct}%</div>
            <div className="hero-stat-label">your progress</div>
          </div>
        </div>
        <div className="hero-progress" aria-label={`Overall progress ${totalPct}%`}>
          <div className="hero-progress-fill" style={{ width: `${totalPct}%` }} />
        </div>
      </section>

      {resumeModule && (
        <Link to={`/module/${resumeModule.module.id}`} className="resume-card">
          <div className="resume-icon" style={{ color: resumeModule.course.color }} aria-hidden="true">↪</div>
          <div className="resume-text">
            <div className="resume-label">Pick up where you left off</div>
            <div className="resume-title">{resumeModule.module.title}</div>
            <div className="resume-meta">{resumeModule.course.icon} {resumeModule.course.title}</div>
          </div>
          <div className="resume-cta">Resume →</div>
        </Link>
      )}

      <Link to="/scratch" className="scratch-card">
        <div className="scratch-card-icon" aria-hidden="true">🐍</div>
        <div className="scratch-card-text">
          <div className="scratch-card-title">Python Scratchpad</div>
          <div className="scratch-card-desc">
            Quick Python 3.12 in your browser — multiple files, autosaved. No login.
          </div>
        </div>
        <div className="scratch-card-cta">Open →</div>
      </Link>

      <h3 className="section-heading">Courses</h3>

      <div className="course-cards">
        {courses.map(course => {
          const done = course.modules.filter(m => completed.includes(m.id)).length
          const pct = Math.round((done / course.modules.length) * 100)
          return (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="course-card"
              style={{ '--course-color': course.color }}
            >
              <div className="course-card-head">
                <div className="course-icon" aria-hidden="true">{course.icon}</div>
                {course.recommendedLabel && (
                  <span className="course-badge">{course.recommendedLabel}</span>
                )}
              </div>
              <h4>{course.title}</h4>
              <p className="course-subtitle">{course.subtitle}</p>
              <p className="course-desc">{course.description}</p>
              <div className="course-meta">
                <span>{course.modules.length} modules</span>
                <span>·</span>
                <span>{course.level}</span>
                <span>·</span>
                <span>{course.hours}</span>
              </div>
              <div className="course-progress">
                <div className="course-progress-bar">
                  <div className="course-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="course-progress-text">
                  {done > 0 ? `${done}/${course.modules.length} · ${pct}%` : 'Not started'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function CoursePage({ courses, completed }) {
  const { courseId } = useParams()
  const course = courses.find(c => c.id === courseId)

  if (!course) {
    return (
      <div className="home">
        <h2>Course not found</h2>
        <Link to="/">Back to courses</Link>
      </div>
    )
  }

  const done = course.modules.filter(m => completed.includes(m.id)).length
  const pct = Math.round((done / course.modules.length) * 100)

  return (
    <div className="home">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Courses</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current">{course.title}</span>
      </nav>
      <div className="course-header" style={{ '--course-color': course.color }}>
        <div className="course-header-icon" aria-hidden="true">{course.icon}</div>
        <div className="course-header-text">
          <h2>{course.title}</h2>
          <p className="subtitle">{course.description}</p>
          <div className="course-meta">
            <span>{course.modules.length} modules</span>
            <span>·</span>
            <span>{course.level}</span>
            <span>·</span>
            <span>{course.hours}</span>
            <span>·</span>
            <span>{done}/{course.modules.length} · {pct}%</span>
          </div>
          <div className="course-progress">
            <div className="course-progress-bar">
              <div className="course-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {course.exerciseRuntime === 'colab' && (
        <div className="callout callout-info">
          <strong>Exercises run on Google Colab</strong> with a free T4 GPU. Code uses{' '}
          <code>numba.cuda</code> — Python CUDA that runs real GPU kernels. No local GPU needed.
        </div>
      )}
      {course.exerciseRuntime === 'local' && (
        <div className="callout callout-info">
          <strong>Exercises run locally</strong> on your Mac. You'll need PyTorch with MPS,
          MLX, and (for some modules) Xcode command-line tools.
        </div>
      )}

      <div className="module-cards">
        {course.modules.map((mod, i) => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className={`module-card ${completed.includes(mod.id) ? 'completed' : ''}`}
          >
            <div className="module-num" style={{ color: course.color }}>
              {completed.includes(mod.id) ? '✓' : i + 1}
            </div>
            <div className="module-card-text">
              <h4>{mod.title}</h4>
              <p>{mod.description}</p>
            </div>
          </Link>
        ))}

        {course.curatedPRs && course.curatedPRs.length > 0 && (
          <Link to="/prs" className="module-card module-card-tool">
            <div className="module-num module-num-tool">PR</div>
            <div className="module-card-text">
              <h4>{course.title} PR Review</h4>
              <p>Browse and study real PyTorch PRs related to the {course.title} backend</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default App
