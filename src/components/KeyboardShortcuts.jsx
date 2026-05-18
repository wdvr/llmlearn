import React, { useEffect, useRef } from 'react'

// Lightweight reference card of every keyboard shortcut on the site.
// Opened from anywhere via `?` (when no input is focused) or the sidebar
// footer button. Esc closes. Focus trap + restoration + scroll lock,
// matching the CommandPalette modal pattern for consistency.

const SHORTCUTS = [
  {
    category: 'Global',
    items: [
      { keys: ['⌘ K', 'Ctrl K'], label: 'Open command palette (search modules, glossary, courses)' },
      { keys: ['?'], label: 'Show this shortcut reference' },
      { keys: ['Esc'], label: 'Close any open modal / dialog' },
    ],
  },
  {
    category: 'Reading a module',
    items: [
      { keys: ['Scroll'], label: 'Scroll position is auto-saved per module and synced across devices' },
      { keys: ['Click', '✓ Completed'], label: 'Mark / un-mark module complete' },
      { keys: ['Click', '🔗 next to a heading'], label: 'Copy a permalink to the section' },
      { keys: ['Hover', 'a blue-dotted term'], label: 'Show inline glossary definition popover' },
    ],
  },
  {
    category: 'Quiz',
    items: [
      { keys: ['↑', '↓', '←', '→'], label: 'Move between answer options' },
      { keys: ['Enter', 'Space'], label: 'Select the highlighted option' },
      { keys: ['Click', 'Next Question →'], label: 'Advance after answering' },
    ],
  },
  {
    category: 'Scratchpad',
    items: [
      { keys: ['⌘ Enter', 'Ctrl Enter'], label: 'Run the current Python code' },
      { keys: ['Tab'], label: 'Indent (inserts 4 spaces)' },
      { keys: ['Click', '+ New'], label: 'Create a new file tab' },
      { keys: ['Double-click', 'tab title'], label: 'Rename a file' },
    ],
  },
  {
    category: 'Glossary',
    items: [
      { keys: ['/'], label: 'Focus the filter input' },
      { keys: ['Esc'], label: 'Clear the filter (or blur if already empty)' },
      { keys: ['Click', 'sidebar category'], label: 'Jump to that category' },
    ],
  },
]

export default function KeyboardShortcuts({ open, onClose }) {
  const modalRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    } else {
      document.body.style.overflow = ''
      const prev = restoreFocusRef.current
      if (prev && typeof prev.focus === 'function' && document.body.contains(prev)) {
        try { prev.focus() } catch {}
      }
      restoreFocusRef.current = null
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="cmdk-backdrop" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="cmdk-modal kbd-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
            return
          }
          if (e.key !== 'Tab' || !modalRef.current) return
          const focusable = modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus()
          }
        }}
      >
        <div className="cmdk-input-row kbd-header">
          <span className="kbd-icon" aria-hidden="true">⌨</span>
          <span className="kbd-title">Keyboard shortcuts</span>
          <button
            ref={closeBtnRef}
            type="button"
            className="cmdk-esc-hint kbd-close"
            onClick={onClose}
            aria-label="Close"
          >Esc</button>
        </div>

        <div className="kbd-body">
          {SHORTCUTS.map(group => (
            <section key={group.category} className="kbd-group">
              <h4 className="kbd-group-title">{group.category}</h4>
              <ul className="kbd-list">
                {group.items.map((item, idx) => (
                  <li key={idx} className="kbd-row">
                    <span className="kbd-keys">
                      {item.keys.map((k, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="kbd-or">or</span>}
                          <kbd>{k}</kbd>
                        </React.Fragment>
                      ))}
                    </span>
                    <span className="kbd-desc">{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
