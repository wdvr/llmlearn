import React, { useState, useRef, useEffect } from 'react'
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
import CodeBlock from './CodeBlock'
import * as CudaDiagrams from './CudaDiagrams'
import { findModuleCourse, loadModule } from '../content/courses'

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

// Render markdown-ish content: fenced code blocks, **bold**, `code`, [text](url), lists, tables
function renderMarkdown(text) {
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
      // Plain (no-lang) fences are usually ASCII diagrams or output — render unhighlighted.
      if (lang === 'text') {
        return (
          <div key={i} className="code-block" style={{ margin: '12px 0' }}>
            <pre style={{ padding: '12px 16px', fontSize: '13px', lineHeight: '1.5', overflow: 'auto' }}>
              <code>{tok.body.replace(/\n$/, '')}</code>
            </pre>
          </div>
        );
      }
      return (
        <div key={i} style={{ margin: '12px 0', borderRadius: '6px', overflow: 'hidden' }}>
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '12px 16px', fontSize: '13px', lineHeight: '1.5', background: 'var(--code-bg, #1e1e1e)' }}
            wrapLongLines={false}
          >
            {tok.body.replace(/\n$/, '')}
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
                      {inlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '6px 10px', fontSize: '13px' }}>
                        {inlineMarkdown(cell)}
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
            {inlineMarkdown(quoteText)}
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
                {inlineMarkdown(l.replace(/^\s*-\s+/, ''))}
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
                {inlineMarkdown(l.replace(/^\s*\d+\.\s+/, ''))}
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
        return <Tag key={`${i}-${j}`} id={subSlug} style={{...styles[level] || styles[4], scrollMarginTop: '20px'}} className="heading-with-permalink">{inlineMarkdown(text)}<PermalinkIcon slug={subSlug} /></Tag>;
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
                return <Tag key={k} style={styles[lvl] || styles[4]}>{inlineMarkdown(hm[2])}</Tag>;
              }
              if (line.trim()) {
                return <p key={k} style={{ marginBottom: '8px', lineHeight: '1.75' }}>{inlineMarkdown(line)}</p>;
              }
              return null;
            })}
          </div>
        );
      }

      // Regular paragraph — handle embedded list items with \n-
      return <p key={`${i}-${j}`} style={{ marginBottom: '12px', lineHeight: '1.75' }}>{inlineMarkdown(trimmed.replace(/\n/g, ' '))}</p>;
    });
  });
}

// Handle inline formatting: **bold**, `code`, [text](url)
function inlineMarkdown(text) {
  if (!text) return text;
  const tokens = [];
  let rest = text;
  let key = 0;

  while (rest.length) {
    const bold = rest.match(/\*\*(.+?)\*\*/);
    const code = rest.match(/`([^`]+)`/);
    const link = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const candidates = [bold, code, link].filter(Boolean);
    if (!candidates.length) { tokens.push(rest); break; }

    const next = candidates.sort((a, b) => a.index - b.index)[0];
    if (next.index > 0) tokens.push(rest.slice(0, next.index));

    if (next === bold) {
      tokens.push(<strong key={key++} style={{ color: 'var(--accent)', fontWeight: 600 }}>{bold[1]}</strong>);
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
    }
    rest = rest.slice(next.index + next[0].length);
  }
  return tokens;
}

export default function ModulePage({ modules, completed, onComplete, onQuizScore, onSectionChange }) {
  const { id } = useParams()
  const navigate = useNavigate()

  // Scope navigation to the module's course (manifest data only).
  const course = findModuleCourse(id)
  const courseModules = course ? course.modules : modules
  const manifestModule = courseModules.find(m => m.id === id) || modules.find(m => m.id === id)
  const moduleIndex = courseModules.findIndex(m => m.id === id)
  const isColab = course?.exerciseRuntime === 'colab'

  // Full module content (sections.content, quiz, exercise) is dynamic-imported on demand.
  const [fullModule, setFullModule] = useState(null)
  const [loadError, setLoadError] = useState(null)

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Track which section is visible via IntersectionObserver
  useEffect(() => {
    if (!fullModule) return
    const sections = document.querySelectorAll('.section h3')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && onSectionChange) {
            onSectionChange(entry.target.textContent)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    sections.forEach(el => observer.observe(el))
    // Set initial section
    if (onSectionChange && fullModule.sections?.[0]) {
      onSectionChange(fullModule.sections[0].title)
    }

    return () => observer.disconnect()
  }, [id, fullModule])

  if (!manifestModule && loadError === 'not-found') {
    return <div className="content"><p>Module not found.</p></div>
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
      <div className="module-header">
        <h2>{module.title}</h2>
        <p>{module.description}</p>
      </div>

      {module.sections.map((section, i) => {
        const slug = slugify(section.title)
        return (
        <div key={i} className="section">
          <h3 id={slug} style={{ scrollMarginTop: '20px' }} className="heading-with-permalink">
            {section.title}
            <PermalinkIcon slug={slug} />
          </h3>
          <div className="section-content">
            {renderMarkdown(section.content)}
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

      {module.exercise && (
        isColab || module.exercise.colabUrl
          ? <ColabExercise exercise={module.exercise} />
          : <Exercise exercise={module.exercise} />
      )}

      <div className="module-nav">
        {prevModule ? (
          <Link to={`/module/${prevModule.id}`} className="btn btn-secondary">
            ← {prevModule.title}
          </Link>
        ) : <div />}

        {completed.includes(module.id) ? (
          <span className="btn btn-success" style={{ cursor: 'default' }}>
            ✓ Completed
          </span>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => onComplete(module.id)}
          >
            Mark as Complete
          </button>
        )}

        {nextModule ? (
          <Link to={`/module/${nextModule.id}`} className="btn btn-secondary">
            {nextModule.title} →
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
