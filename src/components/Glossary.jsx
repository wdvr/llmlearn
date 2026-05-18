import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { glossary, glossaryCategories } from '../content/glossary'
import { findModule, findModuleCourse } from '../content/courses'

// Group entries by category, preserving insertion order within each group so
// callers can rely on the file order being meaningful.
function groupByCategory(entries) {
  const groups = new Map()
  for (const e of entries) {
    if (!groups.has(e.category)) groups.set(e.category, [])
    groups.get(e.category).push(e)
  }
  return groups
}

function normalize(s) {
  return String(s || '').toLowerCase().trim()
}

// Returns true if `query` matches the entry on term, aliases, definition, or
// category. Case-insensitive. Whitespace-trimmed. A multi-word query matches
// only if every word appears in at least one of those fields.
function matchesQuery(entry, query) {
  if (!query) return true
  const haystack = [
    entry.term,
    entry.category,
    entry.definition,
    ...(entry.aliases || []),
  ].map(normalize).join('  ')
  const words = query.split(/\s+/).filter(Boolean)
  return words.every(w => haystack.includes(w))
}

export default function Glossary() {
  const [filter, setFilter] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const sectionRefs = useRef({})
  const filterRef = useRef(null)

  // Press '/' anywhere on the page to jump-focus the filter input.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        filterRef.current?.focus()
        filterRef.current?.select()
      } else if (e.key === 'Escape' && document.activeElement === filterRef.current) {
        e.preventDefault()
        if (filter) setFilter('')
        else filterRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filter])

  // Initial scroll to hash if the URL has one (e.g. /glossary#kv-cache)
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    // react-router parses everything after # — but our anchor lives after a
    // second # in /#/glossary#kv-cache. The slug we care about is whatever
    // comes after the LAST '#' in the raw URL.
    const raw = window.location.href
    const lastHash = raw.lastIndexOf('#')
    const slug = lastHash >= 0 ? raw.slice(lastHash + 1) : ''
    if (slug && document.getElementById(slug)) {
      // Defer to let the page paint first so getBoundingClientRect is correct.
      setTimeout(() => {
        const el = document.getElementById(slug)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = normalize(filter)
    return glossary.filter(e => matchesQuery(e, q))
  }, [filter])

  const grouped = useMemo(() => groupByCategory(filtered), [filtered])

  // Only show categories that have at least one matching entry — keeps the
  // sidebar tight while filtering.
  const visibleCategories = useMemo(
    () => glossaryCategories.filter(c => grouped.has(c) && grouped.get(c).length > 0),
    [grouped]
  )

  // Track which category is in the viewport — used to highlight the sidebar.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('data-category')
          if (id) setActiveCategory(id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    visibleCategories.forEach(c => {
      const el = sectionRefs.current[c]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [visibleCategories])

  const handleJumpTo = (category) => {
    const el = sectionRefs.current[category]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalCount = glossary.length
  const visibleCount = filtered.length

  return (
    <div className="content glossary-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Courses</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current">Glossary</span>
      </nav>

      <div className="glossary-hero">
        <h2>Glossary</h2>
        <p className="subtitle">
          Quick reference for the key terms used across the courses.
        </p>
        <div className="glossary-meta">
          <span>{totalCount} terms</span>
          <span aria-hidden="true">·</span>
          <span>{glossaryCategories.length} categories</span>
        </div>
      </div>

      <div className="glossary-toolbar">
        <input
          ref={filterRef}
          type="search"
          className="glossary-filter"
          placeholder="Filter — e.g. KV cache, RoPE, BF16, occupancy (press / to focus)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter glossary"
        />
        {filter && (
          <button
            type="button"
            className="glossary-filter-clear"
            onClick={() => setFilter('')}
            aria-label="Clear filter"
          >
            Clear · {visibleCount}/{totalCount}
          </button>
        )}
      </div>

      {/* Mobile-only horizontal category strip */}
      <div className="glossary-categories-strip" aria-label="Categories (mobile)">
        {visibleCategories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`glossary-cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleJumpTo(cat)}
          >
            {cat}
            <span className="glossary-cat-count">{grouped.get(cat).length}</span>
          </button>
        ))}
      </div>

      <div className="glossary-layout">
        {/* Desktop sticky sidebar */}
        <aside className="glossary-sidebar" aria-label="Categories">
          <div className="glossary-sidebar-title">Categories</div>
          <ul>
            {visibleCategories.map(cat => (
              <li key={cat}>
                <button
                  type="button"
                  className={`glossary-cat-link ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleJumpTo(cat)}
                >
                  <span>{cat}</span>
                  <span className="glossary-cat-count">{grouped.get(cat).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="glossary-content">
          {visibleCategories.length === 0 && (
            <div className="glossary-empty">
              No terms match <strong>"{filter}"</strong>.
              <button
                type="button"
                className="glossary-link-btn"
                onClick={() => setFilter('')}
              >Clear filter</button>
            </div>
          )}

          {visibleCategories.map(cat => (
            <section
              key={cat}
              data-category={cat}
              ref={el => { sectionRefs.current[cat] = el }}
              className="glossary-category"
            >
              <h3 className="glossary-category-title">{cat}</h3>
              <div className="glossary-entries">
                {grouped.get(cat).map(entry => (
                  <GlossaryEntry key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function GlossaryEntry({ entry }) {
  const intro = entry.introducedIn
  const introModule = intro ? findModule(intro) : null
  const introCourse = intro ? findModuleCourse(intro) : null

  return (
    <article id={entry.slug} className="glossary-entry">
      <h4 className="glossary-term">
        {entry.term}
        <a
          href={`#${entry.slug}`}
          className="glossary-permalink"
          aria-label={`Copy link to ${entry.term}`}
          title="Copy link"
          onClick={(e) => {
            e.preventDefault()
            const url = `${window.location.origin}${window.location.pathname}${window.location.search}#/glossary#${entry.slug}`
            navigator.clipboard?.writeText(url).catch(() => {})
          }}
        >#</a>
      </h4>
      <p className="glossary-definition">{entry.definition}</p>
      {entry.aliases && entry.aliases.length > 0 && (
        <div className="glossary-aliases">
          Also: {entry.aliases.map((a, i) => (
            <React.Fragment key={a}>
              {i > 0 && ', '}
              <span className="glossary-alias">{a}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="glossary-footer">
        {entry.links && entry.links.length > 0 && (
          <div className="glossary-links">
            {entry.links.map(l => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glossary-chip"
                title={l.title}
              >
                {l.title}
                <span className="glossary-chip-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
        {introModule && introCourse && (
          <Link
            to={`/module/${introModule.id}`}
            className="glossary-introduced"
            title={`First introduced in ${introCourse.title}`}
          >
            <span className="glossary-introduced-label">Introduced in</span>
            <span className="glossary-introduced-module">
              {introCourse.icon} {introModule.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  )
}
