import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { courses, allModules, findModuleCourse } from '../content/courses'
import { readingTimeFor, courseTotalMinutes, formatMinutes } from '../content/reading-times'

// Stats / activity overview page. Single-pane view of the user's progress:
// global summary, per-course breakdown, quiz scores, recent activity. All
// data comes from synced state already in App — this is a render-only view.
//
// Reads localStorage directly (rather than threading another prop chain)
// because:
//   - Data is global to the user, not specific to any route
//   - Lazy-loaded — the prop chain would force eager load on every page
//   - State here is one-way (render only; never write)

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

function ago(ms) {
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

export default function Progress() {
  const completed = read('completed', [])
  const quizScores = read('quiz_scores', {})
  const recentlyVisited = read('recently_visited', [])
  const scrollPositions = read('scroll_positions', {})

  const totals = useMemo(() => {
    const totalMods = allModules.length
    const doneMods = completed.length
    const pct = totalMods ? Math.round((doneMods / totalMods) * 100) : 0
    // Total reading minutes across the site
    const totalMin = courses.reduce((acc, c) => acc + (courseTotalMinutes(c) || 0), 0)
    // Minutes read across completed modules — what the user has consumed
    const consumedMin = completed.reduce((acc, id) => acc + (readingTimeFor(id) || 0), 0)
    return { totalMods, doneMods, pct, totalMin, consumedMin }
  }, [completed])

  const quizCount = Object.keys(quizScores).length
  const passedQuizzes = Object.values(quizScores).filter(s => s && s.total > 0 && s.score / s.total >= 0.7).length

  const bookmarkCount = Object.keys(scrollPositions).length

  return (
    <div className="content progress-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current">Your progress</span>
      </nav>

      <div className="module-header">
        <h2>Your progress</h2>
        <p>
          A summary of where you are across all four tracks. Reading time is the
          sum of the modules you've marked complete; quiz scores are your best
          recorded attempt per module.
        </p>
      </div>

      {/* Top stats row */}
      <div className="progress-tiles">
        <div className="progress-tile">
          <div className="progress-tile-num">{totals.doneMods}<span className="progress-tile-of">/{totals.totalMods}</span></div>
          <div className="progress-tile-label">modules completed</div>
        </div>
        <div className="progress-tile">
          <div className="progress-tile-num">{totals.pct}%</div>
          <div className="progress-tile-label">overall</div>
        </div>
        <div className="progress-tile">
          <div className="progress-tile-num">{formatMinutes(totals.consumedMin) || '0 min'}</div>
          <div className="progress-tile-label">reading consumed</div>
        </div>
        <div className="progress-tile">
          <div className="progress-tile-num">{passedQuizzes}<span className="progress-tile-of">/{quizCount}</span></div>
          <div className="progress-tile-label">quizzes passed (≥70%)</div>
        </div>
      </div>

      {/* Per-course breakdown */}
      <h3 className="progress-section-heading">By course</h3>
      <div className="progress-courses">
        {courses.map(c => {
          const done = c.modules.filter(m => completed.includes(m.id))
          const remaining = c.modules.filter(m => !completed.includes(m.id))
          const pct = Math.round((done.length / c.modules.length) * 100)
          const courseMin = courseTotalMinutes(c) || 0
          const consumed = done.reduce((acc, m) => acc + (readingTimeFor(m.id) || 0), 0)
          return (
            <div key={c.id} className="progress-course" style={{ '--course-color': c.color }}>
              <Link to={`/course/${c.id}`} className="progress-course-head">
                <span className="progress-course-icon" aria-hidden="true">{c.icon}</span>
                <span className="progress-course-title">{c.title}</span>
                <span className="progress-course-counts">
                  {done.length}/{c.modules.length} · {pct}%
                </span>
              </Link>
              <div className="progress-course-bar">
                <div className="progress-course-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-course-meta">
                {formatMinutes(consumed)} of {formatMinutes(courseMin)} read
                {remaining.length > 0 && <> · {remaining.length} module{remaining.length === 1 ? '' : 's'} to go</>}
              </div>
              {remaining.length > 0 && remaining.length <= 6 && (
                <ul className="progress-course-todo">
                  {remaining.slice(0, 6).map(m => (
                    <li key={m.id}>
                      <Link to={`/module/${m.id}`}>{m.title}</Link>
                      {readingTimeFor(m.id) && <span className="progress-course-todo-time"> · ⏱ {readingTimeFor(m.id)}m</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* Quiz scores */}
      {quizCount > 0 && (
        <>
          <h3 className="progress-section-heading">Quiz scores</h3>
          <div className="progress-quiz-list">
            {Object.entries(quizScores)
              .sort(([, a], [, b]) => (b.ts || 0) - (a.ts || 0))
              .map(([mid, s]) => {
                const mod = allModules.find(m => m.id === mid)
                const course = findModuleCourse(mid)
                if (!mod) return null
                const pct = s.total ? Math.round(s.score / s.total * 100) : 0
                const passed = pct >= 70
                return (
                  <Link key={mid} to={`/module/${mid}`} className={`progress-quiz-row ${passed ? 'passed' : 'failed'}`}>
                    <span className="progress-quiz-mod">{mod.title}</span>
                    <span className="progress-quiz-course">{course?.title}</span>
                    <span className="progress-quiz-score">{s.score}/{s.total}</span>
                    <span className="progress-quiz-pct">{pct}%</span>
                  </Link>
                )
              })}
          </div>
        </>
      )}

      {/* Recent activity */}
      {recentlyVisited && recentlyVisited.length > 0 && (
        <>
          <h3 className="progress-section-heading">Recent activity</h3>
          <ul className="progress-recent-list">
            {recentlyVisited.slice(0, 10).map(entry => {
              const mod = allModules.find(m => m.id === entry.moduleId)
              const course = findModuleCourse(entry.moduleId)
              if (!mod) return null
              const isCompleted = completed.includes(mod.id)
              const hasBookmark = !!scrollPositions[mod.id]
              return (
                <li key={entry.moduleId} className="progress-recent-row">
                  <Link to={`/module/${entry.moduleId}`} className="progress-recent-link">
                    {isCompleted && <span className="progress-recent-check" aria-hidden="true">✓</span>}
                    <span className="progress-recent-icon" aria-hidden="true">{course?.icon}</span>
                    <span className="progress-recent-title">{mod.title}</span>
                    <span className="progress-recent-meta">
                      {course?.title} · {ago(Date.now() - entry.ts)}
                      {hasBookmark && <> · 📍 bookmarked</>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {/* Bookmarks (scroll positions) */}
      {bookmarkCount > 0 && (
        <>
          <h3 className="progress-section-heading">Bookmarks</h3>
          <p className="progress-help">
            You have <strong>{bookmarkCount}</strong> bookmark{bookmarkCount === 1 ? '' : 's'} —
            scroll positions that resume when you revisit a module.
          </p>
          <ul className="progress-bookmark-list">
            {Object.entries(scrollPositions)
              .sort(([, a], [, b]) => (b.ts || 0) - (a.ts || 0))
              .slice(0, 10)
              .map(([mid, pos]) => {
                const mod = allModules.find(m => m.id === mid)
                if (!mod) return null
                return (
                  <li key={mid}>
                    <Link to={`/module/${mid}`}>{mod.title}</Link>
                    {pos.sectionTitle && <span className="progress-bookmark-sec"> · at {pos.sectionTitle}</span>}
                    <span className="progress-bookmark-ago"> · {ago(Date.now() - (pos.ts || 0))}</span>
                  </li>
                )
              })}
          </ul>
        </>
      )}

      {totals.doneMods === 0 && quizCount === 0 && bookmarkCount === 0 && (
        <div className="progress-empty">
          <p>You haven't started reading yet. Pick a course on the <Link to="/">home page</Link> to begin.</p>
        </div>
      )}
    </div>
  )
}
