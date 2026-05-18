import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { courses } from '../content/courses'

// Reusable "page not found" component for 404s and broken module/course IDs.
// Shown for: unknown routes (catch-all), unknown course IDs, unknown module
// IDs. Variants only differ in the title; the body (suggestion + course
// shortcuts + global search hint) is identical so the page stays helpful.
export default function NotFound({ what = 'page', detail = '' }) {
  const location = useLocation()
  return (
    <div className="content notfound">
      <div className="notfound-icon" aria-hidden="true">🧭</div>
      <h2 className="notfound-title">{capitalize(what)} not found</h2>
      {detail ? (
        <p className="notfound-detail">{detail}</p>
      ) : (
        <p className="notfound-detail">
          The {what} you tried to reach{location.pathname && location.pathname !== '/' ? (
            <> (<code>{location.pathname}</code>)</>
          ) : null} doesn't exist (or was renamed).
        </p>
      )}

      <p className="notfound-cta">Try one of these instead:</p>

      <div className="notfound-courses">
        {courses.map(c => (
          <Link
            key={c.id}
            to={`/course/${c.id}`}
            className="notfound-course"
            style={{ '--course-color': c.color }}
          >
            <span className="notfound-course-icon" aria-hidden="true">{c.icon}</span>
            <span className="notfound-course-title">{c.title}</span>
          </Link>
        ))}
      </div>

      <p className="notfound-tips">
        Or press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> to search,
        browse the <Link to="/glossary">glossary</Link>,
        or open the <Link to="/scratch">Python scratchpad</Link>.
      </p>

      <div className="notfound-back">
        <Link to="/" className="btn btn-secondary">← Back to home</Link>
      </div>
    </div>
  )
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
