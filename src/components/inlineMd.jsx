import React from 'react'

// Small inline markdown renderer. Handles, in order of priority:
//   **bold**, *italic*, `code`, [text](url)
// Designed for short strings (exercise descriptions, notes, tooltips).
// Newlines become explicit <br/> elements. Does NOT handle fenced code
// blocks, tables, lists, or headings — those need the full ModulePage
// renderMarkdown.
export function inlineMd(text) {
  if (!text) return text
  // First split on newlines so each line is rendered independently.
  const lines = String(text).split('\n')
  return lines.flatMap((line, lineIdx) => {
    const segs = parseInline(line, `${lineIdx}-`)
    if (lineIdx < lines.length - 1) {
      segs.push(<br key={`${lineIdx}-br`} />)
    }
    return segs
  })
}

function parseInline(text, keyPrefix) {
  const tokens = []
  let rest = text
  let key = 0

  while (rest.length) {
    const bold = rest.match(/\*\*(.+?)\*\*/)
    const code = rest.match(/`([^`]+)`/)
    const link = rest.match(/\[([^\]]+)\]\(([^)]+)\)/)
    const italic = rest.match(/(?<!\*)\*(?!\*|\s)([^*\n]+?)(?<!\s|\*)\*(?!\*)/)
    const candidates = [bold, code, link, italic].filter(Boolean)
    if (!candidates.length) { tokens.push(rest); break }

    const next = candidates.sort((a, b) => a.index - b.index)[0]
    if (next.index > 0) tokens.push(rest.slice(0, next.index))

    const k = keyPrefix + (key++)
    if (next === bold) {
      tokens.push(<strong key={k} style={{ color: 'var(--accent)', fontWeight: 600 }}>{bold[1]}</strong>)
    } else if (next === code) {
      tokens.push(<code key={k} style={{
        background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: '3px',
        fontSize: '13px', fontFamily: "'JetBrains Mono', monospace"
      }}>{code[1]}</code>)
    } else if (next === link) {
      tokens.push(
        <a key={k} href={link[2]} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'rgba(88,166,255,0.3)' }}>
          {link[1]}
        </a>
      )
    } else if (next === italic) {
      tokens.push(<em key={k}>{italic[1]}</em>)
    }
    rest = rest.slice(next.index + next[0].length)
  }
  return tokens
}
