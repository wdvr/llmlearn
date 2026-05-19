import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { glossary, glossaryByTerm, glossaryCategories } from '../content/glossary'
import { findModule, findModuleCourse } from '../content/courses'

// Build a single combined regex that matches any glossary term (or alias) as
// a word, sorted longest-first so "Tensor Core" matches before "Tensor".
// Computed once at module load. Used by renderDefinition() to auto-link
// references to other entries within a definition.
const linkifyRegex = (() => {
  const entries = []
  for (const e of glossary) {
    entries.push({ key: e.term, target: e })
    for (const a of (e.aliases || [])) entries.push({ key: a, target: e })
  }
  // Sort by term length descending so longer terms win the leftmost match.
  entries.sort((a, b) => b.key.length - a.key.length)
  const map = new Map()
  for (const { key, target } of entries) {
    const lc = key.toLowerCase()
    if (!map.has(lc)) map.set(lc, target)
  }
  // Build alternation. Escape regex metacharacters.
  const escaped = [...map.keys()].map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // Word-boundary on both sides — but \b doesn't work with all our keys
  // (e.g., "torch.compile" — the "." isn't a word char). Use lookarounds:
  // not preceded/followed by a letter or digit. Allows symbols/spaces.
  const re = new RegExp(`(?<![a-zA-Z0-9])(${escaped.join('|')})(?![a-zA-Z0-9])`, 'gi')
  return { re, map }
})()

// Render a definition with inline links to any referenced glossary entries.
// Self-references (definition mentioning its own term) are NOT linked. Each
// term is linked at most once per definition (first occurrence wins) so we
// don't visually swamp the text.
function renderDefinition(text, selfSlug) {
  if (!text) return text
  const out = []
  const { re, map } = linkifyRegex
  const seen = new Set()
  let lastIdx = 0
  let match
  re.lastIndex = 0
  while ((match = re.exec(text)) !== null) {
    const key = match[1].toLowerCase()
    const entry = map.get(key)
    if (!entry) continue
    if (entry.slug === selfSlug) continue
    if (seen.has(entry.slug)) continue
    seen.add(entry.slug)
    if (match.index > lastIdx) out.push(text.slice(lastIdx, match.index))
    out.push(
      <a
        key={`${entry.slug}-${match.index}`}
        href={`#/glossary#${entry.slug}`}
        className="glossary-xref"
        title={entry.definition}
      >{match[1]}</a>
    )
    lastIdx = match.index + match[1].length
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx))
  return out
}

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

  // Scroll to the anchored slug both on initial mount AND on any subsequent
  // hashchange — clicking a #/glossary#X link from inside the glossary page
  // doesn't remount the component, so a one-shot mount effect would miss it.
  // We also retry the scroll a few times because on mobile the glossary is
  // large enough that getBoundingClientRect can shift after the first paint.
  useEffect(() => {
    function scrollToHash() {
      // react-router parses everything after # — our anchor lives after a
      // second # in /#/glossary#warp. The slug is everything after the LAST '#'.
      const raw = window.location.href
      const lastHash = raw.lastIndexOf('#')
      const slug = lastHash >= 0 ? raw.slice(lastHash + 1) : ''
      if (!slug) return
      // Retry a few times — on slower devices (mobile) the entry may not be
      // laid out yet when the first attempt fires.
      let tries = 0
      const tryScroll = () => {
        const el = document.getElementById(slug)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // Briefly highlight so the user sees where they landed.
          el.classList.add('glossary-entry-flash')
          setTimeout(() => el.classList.remove('glossary-entry-flash'), 1600)
          return
        }
        if (tries++ < 8) setTimeout(tryScroll, 80)
      }
      // Defer once so the initial render commits.
      requestAnimationFrame(() => requestAnimationFrame(tryScroll))
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
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
      <p className="glossary-definition">{renderDefinition(entry.definition, entry.slug)}</p>
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
