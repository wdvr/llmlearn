import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courses, allModules, findModuleCourse } from '../content/courses'
import { glossary } from '../content/glossary'
import { readingTimeFor } from '../content/reading-times'

// Global Cmd/Ctrl-K search. Indexes:
//   - All modules (title + description + section titles)
//   - All glossary entries (term + definition + aliases)
//   - All courses (title + subtitle)
// Results are ranked by a simple score: exact-term-match > prefix-match >
// word-match > substring-match, weighted by where the hit landed
// (title > description > section/definition).

const MAX_RESULTS = 12

function buildIndex() {
  const entries = []
  for (const c of courses) {
    entries.push({
      kind: 'course',
      title: c.title,
      subtitle: c.subtitle,
      href: `#/course/${c.id}`,
      icon: c.icon,
      color: c.color,
      haystack: [c.title, c.subtitle, c.description].filter(Boolean).join(' ').toLowerCase(),
    })
  }
  for (const m of allModules) {
    const course = findModuleCourse(m.id)
    const sectionTitles = (m.sections || []).map(s => s.title).join(' ')
    entries.push({
      kind: 'module',
      title: m.title,
      subtitle: course?.title || '',
      href: `#/module/${m.id}`,
      icon: course?.icon || '📘',
      color: course?.color,
      readingMinutes: readingTimeFor(m.id),
      haystack: [m.title, m.description, sectionTitles].filter(Boolean).join(' ').toLowerCase(),
      titleLc: m.title.toLowerCase(),
    })
  }
  for (const e of glossary) {
    const aliases = (e.aliases || []).join(' ')
    entries.push({
      kind: 'glossary',
      title: e.term,
      subtitle: e.category,
      definition: e.definition,
      href: `#/glossary#${e.slug}`,
      haystack: [e.term, e.definition, aliases].filter(Boolean).join(' ').toLowerCase(),
      titleLc: e.term.toLowerCase(),
    })
  }
  return entries
}

function scoreEntry(entry, queryLc, words) {
  // Quick reject: every search word must appear somewhere.
  for (const w of words) {
    if (!entry.haystack.includes(w)) return -1
  }
  let score = 0
  const title = entry.titleLc || entry.title?.toLowerCase() || ''

  // Exact title match → huge boost.
  if (title === queryLc) score += 1000
  // Title starts with query → big boost.
  else if (title.startsWith(queryLc)) score += 500
  // Query is a whole word inside title.
  else if (new RegExp('\\b' + queryLc.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + '\\b').test(title)) score += 300
  // Each word found in title.
  for (const w of words) if (title.includes(w)) score += 50

  // Kind weights: prefer modules/glossary over courses; users typically know
  // courses already and search for finer-grain things.
  if (entry.kind === 'module') score += 30
  if (entry.kind === 'glossary') score += 20
  if (entry.kind === 'course') score += 10

  // Tighten by total length so concise titles beat long descriptions.
  score -= Math.min(20, Math.floor(title.length / 20))

  return score
}

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const modalRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Empty state: show a curated landing list — first module of each course
      // + a few popular glossary terms. Keeps the palette useful even before
      // typing.
      const starters = courses.flatMap(c => {
        const first = c.modules[0]
        if (!first) return []
        return [{
          kind: 'module',
          title: first.title,
          subtitle: c.title,
          href: `#/module/${first.id}`,
          icon: c.icon,
          color: c.color,
          readingMinutes: readingTimeFor(first.id),
        }]
      })
      return starters.slice(0, MAX_RESULTS)
    }
    const words = q.split(/\s+/).filter(Boolean)
    return index
      .map(e => ({ ...e, _score: scoreEntry(e, q, words) }))
      .filter(e => e._score >= 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, MAX_RESULTS)
  }, [query, index])

  // Reset selection when query changes.
  useEffect(() => { setSelected(0) }, [query])

  // Focus input on open; restore prior focus on close. Also lock body
  // scroll while the palette is open so the underlying page doesn't shift
  // around when the user scrolls inside the modal.
  useEffect(() => {
    if (open) {
      // Remember who had focus so we can return there on close (e.g., the
      // sidebar Search button or the Cmd+K trigger).
      restoreFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setQuery('')
      setSelected(0)
      document.body.style.overflow = ''
      // Return focus to where it was before the modal opened. Skip if the
      // element is no longer focusable (e.g., user clicked a result that
      // navigated to a new route — in that case browser default focus is
      // appropriate).
      const prev = restoreFocusRef.current
      if (prev && typeof prev.focus === 'function' && document.body.contains(prev)) {
        try { prev.focus() } catch {}
      }
      restoreFocusRef.current = null
    }
    return () => {
      // Defensive cleanup: if the component unmounts while open (route
      // change?), restore body scroll.
      document.body.style.overflow = ''
    }
  }, [open])

  // Keep selected item visible.
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector('.cmdk-item.active')
    if (el?.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
  }, [selected, results])

  const choose = (entry) => {
    if (!entry) return
    onClose()
    if (entry.href.startsWith('#')) {
      window.location.hash = entry.href.slice(1)
    } else {
      navigate(entry.href)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(results.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[selected])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="cmdk-backdrop" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="cmdk-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search modules, terms, and courses"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Escape from anywhere inside the dialog closes it (the input
          // already handles its own Esc; this catches Esc when focus is
          // on a result button after Tab navigation).
          if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
            return
          }
          // Tab focus trap: cycle within the modal's focusable elements.
          if (e.key !== 'Tab' || !modalRef.current) return
          const focusable = modalRef.current.querySelectorAll(
            'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }}
      >
        <div className="cmdk-input-row">
          <span className="cmdk-search-icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            type="search"
            placeholder="Search modules, glossary, courses…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Search"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <kbd className="cmdk-esc-hint">Esc</kbd>
        </div>

        <div ref={listRef} className="cmdk-list" role="listbox">
          {results.length === 0 ? (
            <div className="cmdk-empty">
              No matches for <strong>{query}</strong>. Try a different term.
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.kind}-${r.href}-${i}`}
                className={`cmdk-item ${i === selected ? 'active' : ''}`}
                onMouseEnter={() => setSelected(i)}
                onClick={() => choose(r)}
                type="button"
              >
                <span
                  className={`cmdk-kind cmdk-kind-${r.kind}`}
                  style={r.color ? { color: r.color } : undefined}
                  aria-hidden="true"
                >
                  {r.kind === 'glossary' ? '§' : (r.icon || '📘')}
                </span>
                <span className="cmdk-text">
                  <span className="cmdk-title">{r.title}</span>
                  <span className="cmdk-subtitle">
                    <span className="cmdk-kind-tag">{r.kind}</span>
                    {r.subtitle && <> · {r.subtitle}</>}
                    {r.kind === 'module' && r.readingMinutes && <> · {r.readingMinutes} min</>}
                    {r.kind === 'glossary' && r.definition && <> · {r.definition.slice(0, 80)}{r.definition.length > 80 ? '…' : ''}</>}
                  </span>
                </span>
                <span className="cmdk-arrow" aria-hidden="true">↵</span>
              </button>
            ))
          )}
        </div>

        <div className="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
          <span className="cmdk-footer-spacer" />
          <span className="cmdk-footer-count">{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  )
}
