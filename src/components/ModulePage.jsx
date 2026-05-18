import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import mermaid from 'mermaid'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import Quiz from './Quiz'
import Exercise from './Exercise'
import ColabExercise from './ColabExercise'
import LocalExercise from './LocalExercise'
import CodeBlock from './CodeBlock'
import * as CudaDiagrams from './CudaDiagrams'
import { findModuleCourse, findModule, loadModule } from '../content/courses'
import { glossaryByTerm } from '../content/glossary'
import { readingTimeFor } from '../content/reading-times'
import NotFound from './NotFound'

SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('javascript', javascript)

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: "'Inter', -apple-system, sans-serif",
  themeVariables: {
    background: 'transparent',
    primaryColor: '#1f2937',
    primaryTextColor: '#e5e7eb',
    primaryBorderColor: '#58a6ff',
    lineColor: '#58a6ff',
    secondaryColor: '#374151',
    tertiaryColor: '#111827',
  },
})

let mermaidIdCounter = 0
function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++mermaidIdCounter}`
    mermaid.render(id, chart).then(({ svg }) => {
      if (cancelled) return
      // Mermaid sets max-width to the diagram's natural width, which makes
      // small diagrams render tiny. Strip that and let the diagram scale to
      // the container width.
      const scaled = svg
        .replace(/max-width:\s*[\d.]+px;?/g, '')
        .replace(/<svg /, '<svg style="width:100%;height:auto;max-height:600px;" ')
      setSvg(scaled)
    }).catch(err => {
      if (!cancelled) setError(err.message || String(err))
    })
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div style={{ margin: '12px 0', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
        <div style={{ marginBottom: '6px', color: '#f85149' }}>Mermaid render error:</div>
        <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{error}</pre>
        <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', marginTop: '8px' }}>{chart}</pre>
      </div>
    )
  }

  return (
    <div
      style={{
        margin: '16px 0',
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        textAlign: 'center',
        overflowX: 'auto',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Small copy button rendered at the top-right of a fenced code block. Pure
// presentational; the copy uses the Clipboard API with a textarea fallback
// for older browsers. Shows a brief "Copied" confirmation.
function CopyButton({ getText, lang }) {
  const [copied, setCopied] = useState(false)
  const handle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = typeof getText === 'function' ? getText() : String(getText || '')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="fenced-meta">
      {lang && <span className="fenced-lang" aria-hidden="true">{lang}</span>}
      <button
        type="button"
        className={`fenced-copy ${copied ? 'copied' : ''}`}
        onClick={handle}
        aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
        title={copied ? 'Copied!' : 'Copy'}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

function PermalinkIcon({ slug }) {
  const [copied, setCopied] = useState(false)
  const onClick = (e) => {
    e.preventDefault()
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${slug}`
    history.replaceState(null, '', `#${slug}`)
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <a
      href={`#${slug}`}
      onClick={onClick}
      className="permalink"
      aria-label={copied ? `Link to ${slug} copied` : `Copy link to ${slug}`}
      title={copied ? 'Link copied!' : 'Copy link to this section'}
      style={{
        marginLeft: '8px',
        opacity: copied ? 1 : 0.25,
        textDecoration: 'none',
        fontSize: '0.7em',
        verticalAlign: 'middle',
        transition: 'opacity 0.15s',
        color: copied ? 'var(--green, #3fb950)' : 'var(--text-muted)',
      }}
      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.opacity = '0.25' }}
    >
      <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
    </a>
  )
}

// Resume-reading banner shown when the user returns to a module where they
// previously had a scroll position bookmarked. Three actions:
//   - Resume: smooth-scroll to the saved offset.
//   - Start over: do nothing (banner already-dismissed, page already at top).
//   - Clear bookmark: explicitly remove the saved position so it doesn't
//     resurface on this device or others (sync drops it next tick).
function ResumeBanner({ bookmark, onResume, onDismiss, onClear }) {
  const ts = bookmark?.ts
  const section = bookmark?.sectionTitle
  const ago = ts ? humanAgo(Date.now() - ts) : ''
  return (
    <div className="resume-banner" role="status" aria-label="Bookmark from previous visit">
      <div className="resume-banner-icon" aria-hidden="true">📍</div>
      <div className="resume-banner-text">
        <strong>Pick up where you left off</strong>
        <div className="resume-banner-meta">
          {section ? <>at <em>{section}</em></> : 'at your last scroll position'}
          {ago && <> · {ago}</>}
        </div>
      </div>
      <div className="resume-banner-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onResume}>
          Resume →
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onDismiss}
          title="Start reading from the top; the bookmark is kept for next time"
        >
          Start over
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm resume-banner-clear"
          onClick={onClear}
          title="Forget this bookmark"
          aria-label="Forget bookmark"
        >×</button>
      </div>
    </div>
  )
}

function humanAgo(ms) {
  if (ms < 60_000) return 'moments ago'
  const min = Math.floor(ms / 60_000)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.floor(day / 30)
  return `${mo} mo ago`
}

// Estimate reading time in minutes. Technical reading runs ~800-1000 chars/min;
// we use 850 to be slightly conservative. Code blocks contribute at half rate
// (they're slower to read carefully) but we keep it simple and treat all
// characters equally for now — the noise floor of estimates makes a more
// elaborate model not worth it.
function estimateReadingMinutes(fullModule) {
  if (!fullModule) return null
  let chars = 0
  for (const s of fullModule.sections || []) {
    chars += (s.content || '').length + (s.code || '').length
  }
  const minutes = Math.max(1, Math.round(chars / 850))
  return minutes
}

// Look up a `**bold**` inner string in the curated glossary. Case-insensitive,
// trims surrounding whitespace and a trailing colon/period (so "**KV cache:**"
// still matches the "KV cache" entry). Returns the glossary entry or null.
function lookupGlossaryTerm(inner) {
  if (!inner) return null
  const key = String(inner).toLowerCase().trim().replace(/[:.]+$/, '')
  // Multi-word entries with extra punctuation inside are rare; one direct hit is enough.
  return glossaryByTerm.get(key) || null
}

// Render markdown-ish content: fenced code blocks, **bold**, `code`, [text](url), lists, tables.
// `linkifiedSlugs` is a Set used to ensure we only auto-link the FIRST occurrence
// of each glossary term per render pass (typically per section). Callers that
// don't care about linkification can pass undefined.
function renderMarkdown(text, linkifiedSlugs) {
  // Tokenize fences while preserving language tags. Each fenced block becomes
  // {lang, body}; surrounding prose stays as plain strings.
  const tokens = [];
  const fenceRe = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIdx = 0;
  let match;
  while ((match = fenceRe.exec(text)) !== null) {
    if (match.index > lastIdx) tokens.push({ type: 'prose', text: text.slice(lastIdx, match.index) });
    tokens.push({ type: 'fence', lang: match[1] || '', body: match[2] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) tokens.push({ type: 'prose', text: text.slice(lastIdx) });

  return tokens.map((tok, i) => {
    if (tok.type === 'fence') {
      if (tok.lang === 'mermaid') {
        return <MermaidDiagram key={i} chart={tok.body.trim()} />;
      }
      // ```cudadiagram\nName\n``` -> render the named React SVG component from CudaDiagrams
      if (tok.lang === 'cudadiagram') {
        const name = tok.body.trim().split('\n')[0].trim();
        const Cmp = CudaDiagrams[name];
        if (Cmp) return <div key={i} style={{ margin: '16px 0', display: 'flex', justifyContent: 'center', overflow: 'auto' }}><Cmp /></div>;
        return <div key={i} style={{ margin: '12px 0', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', color: '#f85149', fontSize: '13px' }}>Unknown diagram: <code>{name}</code></div>;
      }
      // Map common aliases to Prism language names. Only python, cpp, bash, javascript
      // are registered with PrismLight — anything else falls back to plain text.
      const langMap = { cuda: 'cpp', cu: 'cpp', c: 'cpp', 'c++': 'cpp', shell: 'bash', sh: 'bash', js: 'javascript', '': 'text', text: 'text' };
      const lang = langMap[tok.lang.toLowerCase()] ?? tok.lang.toLowerCase();
      const body = tok.body.replace(/\n$/, '');
      // Plain (no-lang) fences are usually ASCII diagrams or output — render unhighlighted.
      if (lang === 'text') {
        return (
          <div key={i} className="fenced-wrap fenced-wrap-text">
            <CopyButton getText={() => body} />
            <div className="code-block" style={{ margin: 0 }}>
              <pre style={{ padding: '12px 16px', fontSize: '13px', lineHeight: '1.5', overflow: 'auto' }}>
                <code>{body}</code>
              </pre>
            </div>
          </div>
        );
      }
      return (
        <div key={i} className="fenced-wrap" style={{ margin: '12px 0', borderRadius: '6px', overflow: 'hidden' }}>
          <CopyButton getText={() => body} lang={tok.lang || undefined} />
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '12px 16px', fontSize: '13px', lineHeight: '1.5', background: 'var(--code-bg, #1e1e1e)' }}
            wrapLongLines={false}
          >
            {body}
          </SyntaxHighlighter>
        </div>
      );
    }
    // Strip HTML comments (e.g. <!-- TODO: SVG -->) from prose
    const part = tok.text.replace(/<!--[\s\S]*?-->/g, '');
    // Even parts are regular content
    const blocks = part.split('\n\n');
    return blocks.map((block, j) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Check for table
      if (/^\|.*\|/.test(trimmed) && trimmed.includes('---')) {
        const rows = trimmed.split('\n').filter(r => r.trim());
        const header = rows[0].split('|').map(s => s.trim()).filter(Boolean);
        const body = rows.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));
        return (
          <div key={`${i}-${j}`} style={{ overflowX: 'auto', margin: '12px 0' }}>
            <table style={{ fontSize: '13px', borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {header.map((h, k) => (
                    <th key={k} style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {inlineMarkdown(h, linkifiedSlugs)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '6px 10px', fontSize: '13px' }}>
                        {inlineMarkdown(cell, linkifiedSlugs)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Check for blockquote
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ');
        return (
          <blockquote key={`${i}-${j}`} style={{
            margin: '12px 0', padding: '12px 16px', borderLeft: '3px solid var(--accent)',
            background: 'var(--bg-tertiary)', borderRadius: '0 6px 6px 0', fontStyle: 'italic',
            color: 'var(--text-muted)', lineHeight: '1.65'
          }}>
            {inlineMarkdown(quoteText, linkifiedSlugs)}
          </blockquote>
        );
      }

      // Check for list block (lines starting with -)
      const lines = trimmed.split('\n');
      if (lines.every(l => /^\s*-\s+/.test(l) || l.trim() === '')) {
        return (
          <ul key={`${i}-${j}`} style={{ margin: '8px 0 8px 20px', listStyle: 'disc' }}>
            {lines.filter(l => l.trim()).map((l, k) => (
              <li key={k} style={{ marginBottom: '4px', fontSize: '15px', lineHeight: '1.65' }}>
                {inlineMarkdown(l.replace(/^\s*-\s+/, ''), linkifiedSlugs)}
              </li>
            ))}
          </ul>
        );
      }

      // Check for numbered list
      if (lines.every(l => /^\s*\d+\.\s+/.test(l) || l.trim() === '')) {
        return (
          <ol key={`${i}-${j}`} style={{ margin: '8px 0 8px 20px' }}>
            {lines.filter(l => l.trim()).map((l, k) => (
              <li key={k} style={{ marginBottom: '4px', fontSize: '15px', lineHeight: '1.65' }}>
                {inlineMarkdown(l.replace(/^\s*\d+\.\s+/, ''), linkifiedSlugs)}
              </li>
            ))}
          </ol>
        );
      }

      // Check for heading (## ... #### supported)
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const styles = {
          1: { fontSize: '22px', fontWeight: 700, marginTop: '28px', marginBottom: '14px', color: 'var(--accent)' },
          2: { fontSize: '19px', fontWeight: 700, marginTop: '24px', marginBottom: '12px', color: 'var(--text)' },
          3: { fontSize: '16px', fontWeight: 600, marginTop: '20px', marginBottom: '10px', color: 'var(--text-muted)' },
          4: { fontSize: '14px', fontWeight: 600, marginTop: '16px', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
        };
        const Tag = `h${Math.min(level + 2, 6)}`; // offset since section already uses h3
        const subSlug = slugify(text);
        return <Tag key={`${i}-${j}`} id={subSlug} style={{...styles[level] || styles[4], scrollMarginTop: '20px'}} className="heading-with-permalink">{inlineMarkdown(text, linkifiedSlugs)}<PermalinkIcon slug={subSlug} /></Tag>;
      }

      // Check for block with mixed content (headers + paragraphs in same block)
      if (lines.some(l => /^#{1,4}\s+/.test(l)) && lines.length > 1) {
        return (
          <div key={`${i}-${j}`}>
            {lines.map((line, k) => {
              const hm = line.match(/^(#{1,4})\s+(.+)/);
              if (hm) {
                const lvl = hm[1].length;
                const styles = {
                  1: { fontSize: '22px', fontWeight: 700, marginTop: '28px', marginBottom: '14px', color: 'var(--accent)' },
                  2: { fontSize: '19px', fontWeight: 700, marginTop: '24px', marginBottom: '12px', color: 'var(--text)' },
                  3: { fontSize: '16px', fontWeight: 600, marginTop: '20px', marginBottom: '10px', color: 'var(--text-muted)' },
                  4: { fontSize: '14px', fontWeight: 600, marginTop: '16px', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
                };
                const Tag = `h${Math.min(lvl + 2, 6)}`;
                return <Tag key={k} style={styles[lvl] || styles[4]}>{inlineMarkdown(hm[2], linkifiedSlugs)}</Tag>;
              }
              if (line.trim()) {
                return <p key={k} style={{ marginBottom: '8px', lineHeight: '1.75' }}>{inlineMarkdown(line, linkifiedSlugs)}</p>;
              }
              return null;
            })}
          </div>
        );
      }

      // Regular paragraph — handle embedded list items with \n-
      return <p key={`${i}-${j}`} style={{ marginBottom: '12px', lineHeight: '1.75' }}>{inlineMarkdown(trimmed.replace(/\n/g, ' '), linkifiedSlugs)}</p>;
    });
  });
}

// Handle inline formatting: **bold**, `code`, [text](url).
// `linkifiedSlugs` is an optional Set tracking which glossary slugs have
// already been auto-linked in this render pass — we only linkify the FIRST
// occurrence of each term per pass so e.g. a CUDA module doesn't turn every
// **kernel** into a link.
function inlineMarkdown(text, linkifiedSlugs) {
  if (!text) return text;
  const tokens = [];
  let rest = text;
  let key = 0;

  while (rest.length) {
    const bold = rest.match(/\*\*(.+?)\*\*/);
    const code = rest.match(/`([^`]+)`/);
    const link = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Italic: single * not adjacent to another * and not intraword. The
    // opening * must not be preceded by a word character (so math like
    // `2*X*y` doesn't match), and the closing * must not be followed by
    // a word character. Content must not start or end with whitespace.
    const italic = rest.match(/(?<![\w\*])\*(?!\*|\s)([^*\n]+?)(?<!\s|\*)\*(?![\w\*])/);
    const candidates = [bold, code, link, italic].filter(Boolean);
    if (!candidates.length) { tokens.push(rest); break; }

    const next = candidates.sort((a, b) => a.index - b.index)[0];
    if (next.index > 0) tokens.push(rest.slice(0, next.index));

    if (next === bold) {
      const inner = bold[1];
      const entry = lookupGlossaryTerm(inner);
      if (entry && linkifiedSlugs && !linkifiedSlugs.has(entry.slug)) {
        linkifiedSlugs.add(entry.slug);
        // Wrap link in a span so we can sibling-position a hover popover
        // that shows the definition inline (desktop hover, keyboard focus).
        // The href still works for click/tap, jumping to /#/glossary#slug.
        tokens.push(
          <span key={key++} className="glossary-link-wrap">
            <a
              href={`#/glossary#${entry.slug}`}
              className="glossary-link"
              aria-describedby={`glossary-pop-${entry.slug}`}
            >{inner}</a>
            <span className="glossary-popover" id={`glossary-pop-${entry.slug}`} role="tooltip">
              <span className="glossary-popover-term">{entry.term}</span>
              <span className="glossary-popover-def">{entry.definition}</span>
              <span className="glossary-popover-cta">Open in glossary →</span>
            </span>
          </span>
        );
      } else {
        tokens.push(<strong key={key++} style={{ color: 'var(--accent)', fontWeight: 600 }}>{inner}</strong>);
      }
    } else if (next === code) {
      tokens.push(<code key={key++} style={{
        background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: '3px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace"
      }}>{code[1]}</code>);
    } else if (next === link) {
      tokens.push(
        <a key={key++} href={link[2]} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'rgba(88,166,255,0.3)' }}>
          {link[1]}
        </a>
      );
    } else if (next === italic) {
      tokens.push(<em key={key++}>{italic[1]}</em>);
    }
    rest = rest.slice(next.index + next[0].length);
  }
  return tokens;
}

export default function ModulePage({
  modules,
  completed,
  onComplete,
  onUncomplete,
  onQuizScore,
  onSectionChange,
  scrollPositions = {},
  onSaveScrollPosition,
  onClearScrollPosition,
}) {
  const { id } = useParams()

  // Scope navigation to the module's course (manifest data only).
  const course = findModuleCourse(id)
  const courseModules = course ? course.modules : modules
  const manifestModule = courseModules.find(m => m.id === id) || modules.find(m => m.id === id)
  const moduleIndex = courseModules.findIndex(m => m.id === id)
  const isColab = course?.exerciseRuntime === 'colab'
  const isLocal = course?.exerciseRuntime === 'local'

  // Full module content (sections.content, quiz, exercise) is dynamic-imported on demand.
  const [fullModule, setFullModule] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // Bookmark UX state: the saved position for THIS module (captured at mount
  // before any scroll handlers fire), and whether the banner is dismissed.
  const initialBookmark = useRef(null)
  const [showResumeBanner, setShowResumeBanner] = useState(false)
  const currentSectionRef = useRef(null)

  // Scroll progress (0..100) shown as a thin bar at the top of the page.
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    setFullModule(null)
    setLoadError(null)
    if (!id) return
    loadModule(id).then(data => {
      if (cancelled) return
      if (!data) setLoadError('not-found')
      else setFullModule(data)
    }).catch(err => {
      if (!cancelled) setLoadError(err?.message || String(err))
    })
    return () => { cancelled = true }
  }, [id])

  // Use full content once loaded, fall back to manifest while pending.
  const module = fullModule || manifestModule

  // On every module change, scroll to top and capture the existing bookmark
  // (if any) so we can offer a "Resume from §X" affordance. We deliberately
  // start at the top — users find it disorienting to land mid-page.
  useEffect(() => {
    window.scrollTo(0, 0)
    const saved = scrollPositions?.[id]
    if (saved && typeof saved.scroll === 'number' && saved.scroll > 200) {
      initialBookmark.current = saved
      setShowResumeBanner(true)
    } else {
      initialBookmark.current = null
      setShowResumeBanner(false)
    }
    // We intentionally don't depend on scrollPositions — only re-capture on
    // module change. Subsequent saves shouldn't re-show the banner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Save scroll position as the user reads + update scroll-progress bar.
  // Two cadences: the progress bar updates immediately every scroll event for
  // smooth UI; the bookmark save is debounced (500ms trailing) since each
  // call goes to localStorage and potentially syncs to the server.
  useEffect(() => {
    if (!fullModule) return
    let saveTimer = null
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0
      setScrollProgress(pct)
      if (onSaveScrollPosition) {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          onSaveScrollPosition(id, y, currentSectionRef.current)
        }, 500)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(saveTimer)
    }
  }, [id, fullModule, onSaveScrollPosition])

  // Reading-time estimate. Prefer the pre-computed value (built once via
  // scripts/compute-reading-times.py and bundled), fall back to on-the-fly
  // estimation if the module isn't in the map (e.g., during local content
  // editing before the script is re-run).
  const readingMinutes = useMemo(
    () => readingTimeFor(id) || estimateReadingMinutes(fullModule),
    [id, fullModule]
  )

  // Track which section is visible via IntersectionObserver
  useEffect(() => {
    if (!fullModule) return
    const sections = document.querySelectorAll('.section h3')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // The h3 contains the section title text followed by the
            // PermalinkIcon (🔗 / ✓). Strip those so the bookmark and
            // the sidebar both show the clean title.
            const raw = entry.target.textContent || ''
            const title = raw.replace(/[🔗✓]\s*$/u, '').trim()
            currentSectionRef.current = title
            if (onSectionChange) onSectionChange(title)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    sections.forEach(el => observer.observe(el))
    // Set initial section
    if (fullModule.sections?.[0]) {
      currentSectionRef.current = fullModule.sections[0].title
      if (onSectionChange) onSectionChange(fullModule.sections[0].title)
    }

    return () => observer.disconnect()
  }, [id, fullModule])

  if (!manifestModule && loadError === 'not-found') {
    return <NotFound what="module" detail={`No module with id "${id}".`} />
  }
  if (!module) {
    return <div className="content"><p>Loading...</p></div>
  }
  if (!fullModule) {
    // Manifest known but content still fetching — show header + skeleton.
    return (
      <div className="content">
        <div className="module-header">
          <h2>{module.title}</h2>
          <p>{module.description}</p>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Loading module content...</p>
      </div>
    )
  }

  const prevModule = moduleIndex > 0 ? courseModules[moduleIndex - 1] : null
  const nextModule = moduleIndex < courseModules.length - 1 ? courseModules[moduleIndex + 1] : null

  return (
    <div className="content">
      <div
        className="scroll-progress-bar"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>
      {course && (
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Courses</Link>
          <span className="breadcrumb-sep" aria-hidden="true">/</span>
          <Link to={`/course/${course.id}`}>{course.title}</Link>
          <span className="breadcrumb-sep" aria-hidden="true">/</span>
          <span className="breadcrumb-current">
            {moduleIndex >= 0 ? `${moduleIndex + 1}. ` : ''}{module.title}
          </span>
        </nav>
      )}
      <div className="module-header">
        <h2>{module.title}</h2>
        <p>{module.description}</p>
        {readingMinutes && (
          <div className="module-meta" aria-label={`Estimated reading time ${readingMinutes} minutes`}>
            <span className="module-meta-icon" aria-hidden="true">⏱</span>
            <span>{readingMinutes} min read</span>
            <span className="module-meta-sep" aria-hidden="true">·</span>
            <span>{module.sections.length} sections</span>
            {module.quiz && (
              <>
                <span className="module-meta-sep" aria-hidden="true">·</span>
                <span>{module.quiz.length} quiz q's</span>
              </>
            )}
          </div>
        )}
      </div>

      {showResumeBanner && initialBookmark.current && (
        <ResumeBanner
          bookmark={initialBookmark.current}
          onResume={() => {
            window.scrollTo({ top: initialBookmark.current.scroll, behavior: 'smooth' })
            setShowResumeBanner(false)
          }}
          onDismiss={() => setShowResumeBanner(false)}
          onClear={() => {
            onClearScrollPosition?.(id)
            setShowResumeBanner(false)
          }}
        />
      )}

      {module.sections.map((section, i) => {
        const slug = slugify(section.title)
        return (
        <div key={i} className="section">
          <h3 id={slug} style={{ scrollMarginTop: '20px' }} className="heading-with-permalink">
            {section.title}
            <PermalinkIcon slug={slug} />
          </h3>
          <div className="section-content">
            {renderMarkdown(section.content, new Set())}
          </div>
          {section.code && <CodeBlock code={section.code} />}
          {section.references && section.references.length > 0 && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--purple)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--purple)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Further Reading
              </div>
              {section.references.map((ref, j) => (
                <div key={j} style={{ marginBottom: '4px' }}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '13px' }}
                  >
                    {ref.title} →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        )
      })}

      {module.quiz && (
        <Quiz
          questions={module.quiz}
          moduleId={module.id}
          onScore={(score, total) => onQuizScore?.(module.id, score, total)}
        />
      )}

      {manifestModule?.relatedModules && manifestModule.relatedModules.length > 0 && (
        <section className="related-modules" aria-labelledby="related-heading">
          <h3 id="related-heading">Related across courses</h3>
          <div className="related-list">
            {manifestModule.relatedModules.map(({ id: relId, note }) => {
              const rel = findModule(relId)
              const relCourse = findModuleCourse(relId)
              if (!rel || !relCourse) return null
              const relMinutes = readingTimeFor(relId)
              return (
                <Link
                  key={relId}
                  to={`/module/${relId}`}
                  className="related-card"
                  style={{ '--course-color': relCourse.color }}
                >
                  <div className="related-icon" aria-hidden="true">{relCourse.icon}</div>
                  <div className="related-text">
                    <div className="related-course-tag">
                      {relCourse.title}
                      {relMinutes && <span className="related-time"> · ⏱ {relMinutes} min</span>}
                    </div>
                    <div className="related-title">{rel.title}</div>
                    {note && <div className="related-note">{note}</div>}
                  </div>
                  <div className="related-arrow" aria-hidden="true">→</div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {module.exercise && (() => {
        // Per-exercise opt-in via `runtime: 'local' | 'colab'` overrides the course default.
        const runtime = module.exercise.runtime || (isLocal ? 'local' : null)
        if (runtime === 'local') {
          return <LocalExercise exercise={module.exercise} moduleId={module.id} />
        }
        if (runtime === 'colab' || isColab || module.exercise.colabUrl) {
          return <ColabExercise exercise={module.exercise} />
        }
        return <Exercise exercise={module.exercise} />
      })()}

      <div className="module-nav">
        {prevModule ? (
          <Link to={`/module/${prevModule.id}`} className="btn btn-secondary module-nav-btn">
            <span className="module-nav-arrow" aria-hidden="true">←</span>
            <span className="module-nav-text">
              <span className="module-nav-label">Previous</span>
              <span className="module-nav-title">{prevModule.title}</span>
              {readingTimeFor(prevModule.id) && (
                <span className="module-nav-time">⏱ {readingTimeFor(prevModule.id)} min</span>
              )}
            </span>
          </Link>
        ) : <div />}

        {completed.includes(module.id) ? (
          <div className="complete-cluster">
            <span className="btn btn-success btn-static" aria-label="Module completed">
              ✓ Completed
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm complete-undo"
              onClick={() => onUncomplete?.(module.id)}
              title="Re-add this module to your to-do list"
            >
              Mark as not read
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => onComplete(module.id)}
          >
            Mark as Complete
          </button>
        )}

        {nextModule ? (
          <Link to={`/module/${nextModule.id}`} className="btn btn-secondary module-nav-btn module-nav-btn-next">
            <span className="module-nav-text">
              <span className="module-nav-label">Next up</span>
              <span className="module-nav-title">{nextModule.title}</span>
              {readingTimeFor(nextModule.id) && (
                <span className="module-nav-time">⏱ {readingTimeFor(nextModule.id)} min</span>
              )}
            </span>
            <span className="module-nav-arrow" aria-hidden="true">→</span>
          </Link>
        ) : course ? (
          <Link to={`/course/${course.id}`} className="btn btn-secondary">
            Course Overview →
          </Link>
        ) : (
          <Link to="/" className="btn btn-secondary">
            Home →
          </Link>
        )}
      </div>
    </div>
  )
}
