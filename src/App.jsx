import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { courses, allModules, findCourse, findModuleCourse } from './content/courses'
import ModulePage from './components/ModulePage'
import PRReview from './components/PRReview'
import ClaudeChat from './components/ClaudeChat'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('completed') || '[]')
    } catch { return [] }
  })
  const [chatOpen, setChatOpen] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    try { return parseInt(localStorage.getItem('font_size') || '15') } catch { return 15 }
  })
  const [quizScores, setQuizScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quiz_scores') || '{}')
    } catch { return {} }
  })
  const [currentSection, setCurrentSection] = useState(null)

  // Derive active course from URL
  const activeCourse = useMemo(() => {
    const moduleMatch = location.pathname.match(/^\/module\/(.+)$/)
    if (moduleMatch) return findModuleCourse(moduleMatch[1])
    const courseMatch = location.pathname.match(/^\/course\/(.+)$/)
    if (courseMatch) return findCourse(courseMatch[1])
    return null
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

  const markComplete = (moduleId) => {
    if (!completed.includes(moduleId)) {
      setCompleted([...completed, moduleId])
    }
  }

  // Progress for active course or global
  const courseModules = activeCourse ? activeCourse.modules : allModules
  const courseCompleted = courseModules.filter(m => completed.includes(m.id)).length
  const progress = Math.round((courseCompleted / courseModules.length) * 100)

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>{activeCourse ? activeCourse.title : 'LLM Learn'}</h1>
          <p>{activeCourse ? activeCourse.subtitle : 'Choose a course'}</p>
        </div>

        <div className="sidebar-nav">
          {activeCourse ? (
            <>
              <Link
                to="/"
                className="nav-item"
                style={{ fontSize: '12px', color: 'var(--text-muted)', opacity: 0.7 }}
              >
                <span className="nav-dot" style={{ opacity: 0.4 }} />
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

              {activeCourse.curatedPRs && activeCourse.curatedPRs.length > 0 && (
                <>
                  <div className="nav-section">Tools</div>
                  <Link
                    to="/prs"
                    className={`nav-item ${location.pathname.startsWith('/prs') ? 'active' : ''}`}
                  >
                    <span className="nav-dot" />
                    <span>PR Review</span>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <div className="nav-section">Courses</div>
              {courses.map(c => {
                const done = c.modules.filter(m => completed.includes(m.id)).length
                return (
                  <Link
                    key={c.id}
                    to={`/course/${c.id}`}
                    className={`nav-item ${location.pathname === `/course/${c.id}` ? 'active' : ''}`}
                  >
                    <span className="nav-dot" />
                    <span>{c.icon} {c.title}</span>
                    {done > 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {done}/{c.modules.length}
                      </span>
                    )}
                  </Link>
                )
              })}

              <div className="nav-section">Tools</div>
              <Link
                to="/prs"
                className={`nav-item ${location.pathname.startsWith('/prs') ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>PR Review</span>
              </Link>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {activeCourse && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-text">
                {courseCompleted}/{courseModules.length} modules — {progress}%
              </div>
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => setFontSize(s => Math.max(11, s - 1))} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '3px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '22px', textAlign: 'center' }}>{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(20, s + 1))} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '3px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5 }}>{__COMMIT_HASH__} — v{__BUILD_NUM__}</span>
          </div>
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <a
              href="/oauth2/sign_out?rd=https://auth.thelittleone.rocks/oauth2/sign_out?rd=https://llm.thelittleone.rocks"
              style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '10px', opacity: 0.5 }}
            >
              logout
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/" element={<LandingPage courses={courses} completed={completed} />} />
          <Route path="/course/:courseId" element={<CoursePage courses={courses} completed={completed} />} />
          <Route
            path="/module/:id"
            element={
              <ModulePage
                modules={allModules}
                completed={completed}
                onComplete={markComplete}
                onQuizScore={(moduleId, score, total) => {
                  const updated = { ...quizScores, [moduleId]: { score, total } }
                  setQuizScores(updated)
                  localStorage.setItem('quiz_scores', JSON.stringify(updated))
                }}
                onSectionChange={setCurrentSection}
              />
            }
          />
          <Route path="/prs" element={<PRReview />} />
        </Routes>
      </main>

      {/* Claude Chat */}
      <ClaudeChat isOpen={chatOpen} onClose={() => setChatOpen(false)} appContext={appContext} />
      <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)} title="Ask Claude">
        💬
      </button>
    </div>
  )
}

function LandingPage({ courses, completed }) {
  return (
    <div className="home">
      <h2>Choose a Course</h2>
      <p className="subtitle">
        Hands-on GPU programming courses — from PyTorch on Apple Silicon to CUDA parallel computing.
      </p>

      <div className="module-cards">
        {courses.map(course => {
          const done = course.modules.filter(m => completed.includes(m.id)).length
          const pct = Math.round((done / course.modules.length) * 100)
          return (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="module-card"
              style={{ borderLeft: `3px solid ${course.color}` }}
            >
              <div className="module-num" style={{ color: course.color, fontSize: '24px' }}>
                {course.icon}
              </div>
              <div className="module-card-text">
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {course.modules.length} modules
                  {done > 0 && ` — ${done} completed (${pct}%)`}
                </div>
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

  return (
    <div className="home">
      <h2>{course.icon} {course.title}</h2>
      <p className="subtitle">{course.description}</p>

      {course.exerciseRuntime === 'colab' && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-tertiary)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px',
          border: '1px solid var(--border)',
          lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--text)' }}>Exercises run on Google Colab</strong> with a free T4 GPU.
          Code uses <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: '3px' }}>numba.cuda</code> — Python CUDA that runs real GPU kernels.
          No local GPU needed.
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
          <Link to="/prs" className="module-card">
            <div className="module-num" style={{ color: '#bc8cff' }}>PR</div>
            <div className="module-card-text">
              <h4>PyTorch MPS PR Review</h4>
              <p>Browse and study real PyTorch PRs related to MPS backend</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default App
