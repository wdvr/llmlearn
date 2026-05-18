import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { courses, allModules, findCourse, findModuleCourse } from './content/courses'
import { readingTimeFor, courseTotalMinutes, formatMinutes } from './content/reading-times'

const ModulePage = React.lazy(() => import('./components/ModulePage'))
const PRReview = React.lazy(() => import('./components/PRReview'))
const ClaudeChat = React.lazy(() => import('./components/ClaudeChat'))
const Scratch = React.lazy(() => import('./components/Scratch'))
const Glossary = React.lazy(() => import('./components/Glossary'))
const CommandPalette = React.lazy(() => import('./components/CommandPalette'))
const KeyboardShortcuts = React.lazy(() => import('./components/KeyboardShortcuts'))
const NotFound = React.lazy(() => import('./components/NotFound'))

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
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    try { return parseInt(localStorage.getItem('font_size') || '15') } catch { return 15 }
  })
  const [quizScores, setQuizScores] = useState(() => readStorage('quiz_scores', {}))
  const [lastVisited, setLastVisited] = useState(() => readStorage('last_visited', null))
  const [recentlyVisited, setRecentlyVisited] = useState(() => readStorage('recently_visited', []))
  const [scrollPositions, setScrollPositions] = useState(() => readStorage('scroll_positions', {}))
  const [currentSection, setCurrentSection] = useState(null)
  const [syncUser, setSyncUser] = useState(null)
  const [syncStatus, setSyncStatus] = useState('idle') // idle | syncing | error | offline

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

  // -------------------------------------------------------------------------
  // Cross-device progress sync
  // -------------------------------------------------------------------------
  // On mount: GET /api/progress. If authenticated:
  //   - Server has data → merge into local (union of completed, max-by-ts of
  //     quizScores, latest of lastVisited). Server wins ties.
  //   - Server is empty → POST current local snapshot (migration).
  // If 401 (no auth), stay anonymous — local-only mode.
  // Then: whenever completed/quizScores/lastVisited change, debounced POST.
  // -------------------------------------------------------------------------
  const initialSyncDone = React.useRef(false)
  const syncTimer = React.useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/progress', { credentials: 'include' })
        if (res.status === 401) {
          if (!cancelled) setSyncStatus('offline')
          initialSyncDone.current = true
          return
        }
        if (!res.ok) {
          if (!cancelled) setSyncStatus('error')
          initialSyncDone.current = true
          return
        }
        const { user, data } = await res.json()
        if (cancelled) return
        setSyncUser(user)

        const haveServer = data && Object.keys(data).length > 0
        if (haveServer) {
          // Merge: union of completed module IDs.
          const serverCompleted = Array.isArray(data.completed) ? data.completed : []
          const merged = Array.from(new Set([...completed, ...serverCompleted]))
          setCompleted(merged)
          try { localStorage.setItem('completed', JSON.stringify(merged)) } catch {}

          // Quiz scores: keep higher score per module.
          if (data.quizScores && typeof data.quizScores === 'object') {
            const mergedQ = { ...quizScores }
            for (const [mid, s] of Object.entries(data.quizScores)) {
              const cur = mergedQ[mid]
              if (!cur || (s.total > 0 && s.score / s.total > cur.score / cur.total)) {
                mergedQ[mid] = s
              }
            }
            setQuizScores(mergedQ)
            try { localStorage.setItem('quiz_scores', JSON.stringify(mergedQ)) } catch {}
          }

          // Last-visited: latest by timestamp.
          if (data.lastVisited && data.lastVisited.ts) {
            const localTs = lastVisited?.ts || 0
            if (data.lastVisited.ts > localTs) {
              setLastVisited(data.lastVisited)
              try { localStorage.setItem('last_visited', JSON.stringify(data.lastVisited)) } catch {}
            }
          }

          // Recently-visited list: merge by moduleId, keep latest ts per id,
          // sort desc, cap at 10.
          if (Array.isArray(data.recentlyVisited)) {
            const byId = new Map()
            for (const e of [...recentlyVisited, ...data.recentlyVisited]) {
              if (!e?.moduleId || typeof e.ts !== 'number') continue
              const cur = byId.get(e.moduleId)
              if (!cur || e.ts > cur.ts) byId.set(e.moduleId, e)
            }
            const merged = [...byId.values()].sort((a, b) => b.ts - a.ts).slice(0, 10)
            setRecentlyVisited(merged)
            try { localStorage.setItem('recently_visited', JSON.stringify(merged)) } catch {}
          }

          // Scroll positions: per-module latest-ts wins.
          if (data.scrollPositions && typeof data.scrollPositions === 'object') {
            const mergedPos = { ...scrollPositions }
            for (const [mid, pos] of Object.entries(data.scrollPositions)) {
              if (!pos || typeof pos.ts !== 'number') continue
              const cur = mergedPos[mid]
              if (!cur || pos.ts > (cur.ts || 0)) {
                mergedPos[mid] = pos
              }
            }
            setScrollPositions(mergedPos)
            try { localStorage.setItem('scroll_positions', JSON.stringify(mergedPos)) } catch {}
          }
        } else {
          // Server empty — push local state up as one-time migration.
          const snapshot = {
            completed,
            quizScores,
            lastVisited,
            recentlyVisited,
            scrollPositions,
            schema_version: STORAGE_VERSION,
          }
          if (snapshot.completed.length > 0 || Object.keys(snapshot.quizScores).length > 0 || Object.keys(snapshot.scrollPositions).length > 0 || (snapshot.recentlyVisited && snapshot.recentlyVisited.length > 0)) {
            await fetch('/api/progress', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: snapshot }),
            })
          }
        }
        if (!cancelled) setSyncStatus('idle')
      } catch (err) {
        if (!cancelled) setSyncStatus('error')
      } finally {
        initialSyncDone.current = true
      }
    })()
    return () => { cancelled = true }
    // run once on mount — completed/quizScores/lastVisited are read inside via
    // the closure at mount time, which is exactly what we want.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced sync on change. Only writes if we have an authenticated user.
  useEffect(() => {
    if (!initialSyncDone.current || !syncUser) return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(async () => {
      setSyncStatus('syncing')
      try {
        const snapshot = {
          completed,
          quizScores,
          lastVisited,
          scrollPositions,
          schema_version: STORAGE_VERSION,
        }
        const res = await fetch('/api/progress', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: snapshot }),
        })
        setSyncStatus(res.ok ? 'idle' : 'error')
      } catch {
        setSyncStatus('error')
      }
    }, 800)
    return () => clearTimeout(syncTimer.current)
  }, [completed, quizScores, lastVisited, recentlyVisited, scrollPositions, syncUser])

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
    try { localStorage.setItem('scroll_positions', JSON.stringify(scrollPositions)) } catch {}
  }, [scrollPositions])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
    document.documentElement.style.setProperty('--font-size-code', `${fontSize - 2}px`)
    localStorage.setItem('font_size', fontSize.toString())
  }, [fontSize])

  // Track last-visited module + a rolling recent-history list. The single
  // "lastVisited" stays for the top-of-page Resume CTA; "recentlyVisited"
  // is a deduped list (most-recent-first, max 10) used to populate the
  // "Continue learning" section under the resume card.
  useEffect(() => {
    if (!activeModule) return
    const ts = Date.now()
    const entry = { moduleId: activeModule.id, ts }
    setLastVisited(entry)
    try { localStorage.setItem('last_visited', JSON.stringify(entry)) } catch {}
    setRecentlyVisited(prev => {
      const filtered = (prev || []).filter(e => e.moduleId !== activeModule.id)
      const next = [entry, ...filtered].slice(0, 10)
      try { localStorage.setItem('recently_visited', JSON.stringify(next)) } catch {}
      return next
    })
  }, [activeModule?.id])

  // Close mobile drawer on every navigation.
  useEffect(() => { setNavOpen(false) }, [location.pathname])

  // Global keyboard shortcuts:
  //   Cmd/Ctrl+K → command palette (anywhere)
  //   ?          → shortcut reference modal (when no input is focused)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setCmdkOpen(o => !o)
        return
      }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
          e.preventDefault()
          setShortcutsOpen(o => !o)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const markComplete = (moduleId) => {
    if (!completed.includes(moduleId)) {
      setCompleted([...completed, moduleId])
    }
  }

  const unmarkComplete = (moduleId) => {
    setCompleted(completed.filter(id => id !== moduleId))
  }

  // Save the user's current scroll position for a module. Called from ModulePage
  // on debounced scroll. Skipped when the position is near the top of the page
  // — no need to clutter sync with "you started reading" entries.
  const saveScrollPosition = (moduleId, scroll, sectionTitle) => {
    if (!moduleId) return
    if (scroll < 200) {
      // Below threshold: don't save. If a bookmark already exists, leave it
      // alone — the user might have come back and scrolled to the top briefly.
      return
    }
    setScrollPositions(prev => ({
      ...prev,
      [moduleId]: { scroll: Math.round(scroll), sectionTitle: sectionTitle || null, ts: Date.now() },
    }))
  }

  const clearScrollPosition = (moduleId) => {
    if (!moduleId) return
    setScrollPositions(prev => {
      if (!(moduleId in prev)) return prev
      const next = { ...prev }
      delete next[moduleId]
      return next
    })
  }

  const resetProgress = () => {
    if (!confirm('Reset all course progress? This clears completed modules, quiz scores, and bookmarks. This cannot be undone.')) return
    setCompleted([])
    setQuizScores({})
    setLastVisited(null)
    setRecentlyVisited([])
    setScrollPositions({})
    try {
      localStorage.removeItem('completed')
      localStorage.removeItem('quiz_scores')
      localStorage.removeItem('last_visited')
      localStorage.removeItem('recently_visited')
      localStorage.removeItem('scroll_positions')
    } catch {}
    // Also push the empty state to the server so the reset propagates to
    // other devices. Fire-and-forget; the post-change sync effect will also
    // run, but doing it explicitly here makes the intent clear.
    if (syncUser) {
      fetch('/api/progress', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { completed: [], quizScores: {}, lastVisited: null, recentlyVisited: [], scrollPositions: {}, schema_version: STORAGE_VERSION } }),
      }).catch(() => {})
    }
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
          <button
            type="button"
            className="sidebar-search"
            onClick={() => setCmdkOpen(true)}
            aria-label="Search (Cmd/Ctrl+K)"
            title="Search modules, glossary, courses (Cmd/Ctrl+K)"
          >
            <span aria-hidden="true">🔍</span>
            <span className="sidebar-search-label">Search</span>
            <kbd className="sidebar-search-kbd">⌘K</kbd>
          </button>
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
              <Link
                to="/glossary"
                className={`nav-item ${location.pathname.startsWith('/glossary') ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>Glossary</span>
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
              <Link
                to="/glossary"
                className={`nav-item ${location.pathname.startsWith('/glossary') ? 'active' : ''}`}
              >
                <span className="nav-dot" />
                <span>Glossary</span>
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
          <div className="footer-sync" title={syncUser ? `Synced as ${syncUser}` : 'Progress saved locally only (sign in to sync across devices)'}>
            <span className={`sync-dot sync-${syncStatus} ${syncUser ? 'synced' : 'local'}`} aria-hidden="true" />
            <span className="sync-label">
              {syncUser
                ? (syncStatus === 'syncing' ? 'Syncing…' : syncStatus === 'error' ? 'Sync error' : 'Synced')
                : 'Local only'}
            </span>
          </div>
          <div className="footer-meta">
            <button
              type="button"
              className="footer-kbd"
              onClick={() => setShortcutsOpen(true)}
              title="Keyboard shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              <span aria-hidden="true">⌨</span>
              <kbd>?</kbd>
            </button>
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
                  recentlyVisited={recentlyVisited}
                />
              }
            />
            <Route path="/course/:courseId" element={<CoursePage courses={courses} completed={completed} recentlyVisited={recentlyVisited} />} />
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
                  scrollPositions={scrollPositions}
                  onSaveScrollPosition={saveScrollPosition}
                  onClearScrollPosition={clearScrollPosition}
                />
              }
            />
            <Route
              path="/prs"
              element={<PRReview courses={courses} />}
            />
            <Route path="/scratch" element={<Scratch />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="*" element={<NotFound />} />
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

      {/* Global Cmd/Ctrl-K command palette */}
      <Suspense fallback={null}>
        <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
      </Suspense>

      {/* `?` keyboard-shortcut reference modal */}
      <Suspense fallback={null}>
        <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      </Suspense>
    </div>
  )
}

function humanAgoShort(ms) {
  if (ms < 60_000) return 'just now'
  const min = Math.floor(ms / 60_000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.floor(day / 30)
  return `${mo}mo ago`
}

function LandingPage({ courses, completed, lastVisited, recentlyVisited }) {
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

  // Resolve up to 4 additional recently-visited modules (skipping the one
  // already shown as the "Pick up where you left off" resume card).
  const recentList = useMemo(() => {
    if (!Array.isArray(recentlyVisited) || recentlyVisited.length === 0) return []
    const skipId = resumeModule?.module?.id
    const out = []
    for (const entry of recentlyVisited) {
      if (entry.moduleId === skipId) continue
      for (const c of courses) {
        const m = c.modules.find(x => x.id === entry.moduleId)
        if (m) {
          out.push({ module: m, course: c, ts: entry.ts })
          break
        }
      }
      if (out.length >= 4) break
    }
    return out
  }, [recentlyVisited, courses, resumeModule])

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

      {recentList.length > 0 && (
        <section className="recent-section" aria-labelledby="recent-heading">
          <h3 id="recent-heading" className="section-heading">Recently studied</h3>
          <div className="recent-list">
            {recentList.map(({ module, course, ts }) => {
              const isCompleted = completed.includes(module.id)
              return (
                <Link
                  key={module.id}
                  to={`/module/${module.id}`}
                  className="recent-card"
                  style={{ '--course-color': course.color }}
                >
                  <span className="recent-icon" aria-hidden="true">{course.icon}</span>
                  <div className="recent-text">
                    <div className="recent-title">
                      {isCompleted && <span className="recent-check" aria-hidden="true">✓ </span>}
                      {module.title}
                    </div>
                    <div className="recent-meta">
                      {course.title} · {humanAgoShort(Date.now() - ts)}
                    </div>
                  </div>
                  <span className="recent-arrow" aria-hidden="true">→</span>
                </Link>
              )
            })}
          </div>
        </section>
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

      <Link to="/glossary" className="scratch-card glossary-card">
        <div className="scratch-card-icon" aria-hidden="true">📖</div>
        <div className="scratch-card-text">
          <div className="scratch-card-title">Glossary</div>
          <div className="scratch-card-desc">
            ~150 key technical terms used across the courses — quick definitions and links to canonical sources.
          </div>
        </div>
        <div className="scratch-card-cta">Browse →</div>
      </Link>

      <h3 className="section-heading">Courses</h3>

      <div className="course-cards">
        {courses.map(course => {
          const done = course.modules.filter(m => completed.includes(m.id)).length
          const pct = Math.round((done / course.modules.length) * 100)
          const totalMin = courseTotalMinutes(course)
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
                <span>{course.modules.length} module{course.modules.length === 1 ? '' : 's'}</span>
                <span>·</span>
                <span>{course.level}</span>
                {totalMin && (
                  <>
                    <span>·</span>
                    <span title="Sum of reading-time estimates across all modules">≈ {formatMinutes(totalMin)} reading</span>
                  </>
                )}
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

function CoursePage({ courses, completed, recentlyVisited = [] }) {
  const { courseId } = useParams()
  const course = courses.find(c => c.id === courseId)

  if (!course) {
    // Lazy NotFound; outer Suspense in App handles the fallback.
    return <NotFound what="course" detail={`No course with id "${courseId}".`} />
  }

  const done = course.modules.filter(m => completed.includes(m.id)).length
  const pct = Math.round((done / course.modules.length) * 100)
  const totalMin = courseTotalMinutes(course)

  // Find the most-recent visited module that belongs to THIS course, so we
  // can surface a "Continue this course" CTA. Falls back to the first
  // incomplete module if no recent visit (the natural next-step).
  const resumeInCourse = (() => {
    const moduleIds = new Set(course.modules.map(m => m.id))
    for (const e of recentlyVisited || []) {
      if (moduleIds.has(e.moduleId)) {
        const mod = course.modules.find(m => m.id === e.moduleId)
        if (mod) return { module: mod, ts: e.ts, reason: 'recent' }
      }
    }
    // Fallback: first not-yet-completed module is a reasonable next step.
    const firstIncomplete = course.modules.find(m => !completed.includes(m.id))
    if (firstIncomplete && done > 0) {
      // Only suggest "next up" if user has made some progress in this course;
      // a fresh course doesn't need a "continue here" callout pushing them.
      return { module: firstIncomplete, ts: null, reason: 'next' }
    }
    return null
  })()

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
            <span>{course.modules.length} module{course.modules.length === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>{course.level}</span>
            {totalMin && (
              <>
                <span>·</span>
                <span title="Sum of reading-time estimates across all modules">≈ {formatMinutes(totalMin)} reading</span>
              </>
            )}
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

      {resumeInCourse && (
        <Link
          to={`/module/${resumeInCourse.module.id}`}
          className="course-resume"
          style={{ '--course-color': course.color }}
        >
          <span className="course-resume-icon" aria-hidden="true">
            {resumeInCourse.reason === 'recent' ? '↪' : '▶'}
          </span>
          <span className="course-resume-text">
            <span className="course-resume-label">
              {resumeInCourse.reason === 'recent'
                ? `Continue this course · ${humanAgoShort(Date.now() - resumeInCourse.ts)}`
                : 'Next up'}
            </span>
            <span className="course-resume-title">{resumeInCourse.module.title}</span>
          </span>
          <span className="course-resume-cta">Open →</span>
        </Link>
      )}

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
        {course.modules.map((mod, i) => {
          const minutes = readingTimeFor(mod.id)
          return (
            <Link
              key={mod.id}
              to={`/module/${mod.id}`}
              className={`module-card ${completed.includes(mod.id) ? 'completed' : ''}`}
            >
              <div className="module-num" style={{ color: course.color }}>
                {completed.includes(mod.id) ? '✓' : i + 1}
              </div>
              <div className="module-card-text">
                <div className="module-card-title-row">
                  <h4>{mod.title}</h4>
                  {minutes && (
                    <span className="module-card-time" aria-label={`${minutes} minute read`}>
                      <span aria-hidden="true">⏱</span> {minutes} min
                    </span>
                  )}
                </div>
                <p>{mod.description}</p>
              </div>
            </Link>
          )
        })}

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
