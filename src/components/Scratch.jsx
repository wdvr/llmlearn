import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

const PYODIDE_VERSION = '0.27.0'
const STORAGE_FILES = 'scratch_files_v2'
const STORAGE_ACTIVE = 'scratch_active_v2'
const STORAGE_PACKAGES = 'scratch_packages_v2'
const STORAGE_LEGACY_CODE = 'scratch_code_v1'

const SNIPPET_TEMPLATES = {
  hello: {
    name: 'hello.py',
    code: `print("Hello, Python", end=" ")
import sys
print(sys.version.split()[0])
`,
  },
  twosum: {
    name: 'two_sum.py',
    code: `# LeetCode 1: Two Sum
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
print(two_sum([3, 2, 4], 6))         # [1, 2]
`,
  },
  numpy: {
    name: 'numpy_demo.py',
    code: `import numpy as np

a = np.arange(12).reshape(3, 4)
print(a)
print("col sums:", a.sum(axis=0))
print("row sums:", a.sum(axis=1))
`,
  },
  bench: {
    name: 'timeit.py',
    code: `import timeit

def slow():
    return sum(i*i for i in range(10_000))

def fast():
    n = 10_000
    return n * (n - 1) * (2 * n - 1) // 6

print("slow:", timeit.timeit(slow, number=100), "s / 100 runs")
print("fast:", timeit.timeit(fast, number=100), "s / 100 runs")
print("equal:", slow() == fast())
`,
  },
}

const DEFAULT_FILES = () => {
  const id = makeId()
  return [{ id, name: 'scratch.py', code: SNIPPET_TEMPLATES.hello.code }]
}

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function loadFiles() {
  try {
    const raw = localStorage.getItem(STORAGE_FILES)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
    // Migration from v1 single-buffer
    const legacy = localStorage.getItem(STORAGE_LEGACY_CODE)
    if (legacy) {
      return [{ id: makeId(), name: 'scratch.py', code: legacy }]
    }
  } catch {}
  return DEFAULT_FILES()
}

function loadActive(files) {
  try {
    const id = localStorage.getItem(STORAGE_ACTIVE)
    if (id && files.some(f => f.id === id)) return id
  } catch {}
  return files[0]?.id
}

// Module-level singleton: navigating away and back doesn't re-init Pyodide.
let pyodideSingleton = null
let pyodideLoading = null
async function getPyodide(onProgress) {
  if (pyodideSingleton) return pyodideSingleton
  if (pyodideLoading) return pyodideLoading
  pyodideLoading = (async () => {
    if (!window.loadPyodide) {
      onProgress?.('Loading Pyodide runtime…')
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
        s.onload = resolve
        s.onerror = () => reject(new Error('Failed to load Pyodide CDN script'))
        document.head.appendChild(s)
      })
    }
    onProgress?.('Initializing Python interpreter…')
    pyodideSingleton = await window.loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
    })
    return pyodideSingleton
  })()
  try { return await pyodideLoading } finally { pyodideLoading = null }
}

function openInColab(code) {
  try { navigator.clipboard?.writeText(code) } catch {}
  window.open('https://colab.research.google.com/#create=true&language=python', '_blank', 'noopener,noreferrer')
}

function downloadFile(name, code) {
  const blob = new Blob([code], { type: 'text/x-python' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

export default function Scratch() {
  const [files, setFiles] = useState(loadFiles)
  const [activeId, setActiveId] = useState(() => loadActive(loadFiles()))
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [loadingPy, setLoadingPy] = useState(false)
  const [pyVersion, setPyVersion] = useState(null)
  const [packages, setPackages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PACKAGES) || '[]') } catch { return [] }
  })
  const [packageInput, setPackageInput] = useState('')
  const [installing, setInstalling] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [copyToast, setCopyToast] = useState(false)
  const taRef = useRef(null)
  const outRef = useRef(null)
  const tabBarRef = useRef(null)

  const activeFile = useMemo(
    () => files.find(f => f.id === activeId) || files[0],
    [files, activeId]
  )

  // Persist files / active id / packages on change.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_FILES, JSON.stringify(files)) } catch {}
  }, [files])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_ACTIVE, activeId || '') } catch {}
  }, [activeId])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_PACKAGES, JSON.stringify(packages)) } catch {}
  }, [packages])

  // If files becomes empty (last tab deleted), recreate a default.
  useEffect(() => {
    if (files.length === 0) {
      const fresh = DEFAULT_FILES()
      setFiles(fresh)
      setActiveId(fresh[0].id)
    } else if (!files.some(f => f.id === activeId)) {
      setActiveId(files[0].id)
    }
  }, [files, activeId])

  // Auto-scroll output.
  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }, [output])

  // Scroll active tab into view.
  useEffect(() => {
    if (!tabBarRef.current) return
    const el = tabBarRef.current.querySelector('.scratch-tab.active')
    if (el?.scrollIntoView) {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    }
  }, [activeId])

  const append = useCallback((text) => setOutput(prev => prev + text), [])

  const updateActiveCode = useCallback((newCode) => {
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, code: newCode } : f))
  }, [activeId])

  const run = useCallback(async () => {
    if (running || !activeFile) return
    setRunning(true)
    setOutput('')
    try {
      setLoadingPy(true)
      const pyodide = await getPyodide((msg) => append(`[runtime] ${msg}\n`))
      setLoadingPy(false)
      if (!pyVersion) {
        const v = pyodide.runPython('import sys; sys.version.split()[0]')
        setPyVersion(v)
      }
      if (packages.length) {
        try { await pyodide.loadPackage(packages) }
        catch (e) { append(`[packages] failed to load: ${e?.message || e}\n`) }
      }
      pyodide.setStdout({ batched: (s) => append(s + '\n') })
      pyodide.setStderr({ batched: (s) => append(s + '\n') })

      const t0 = performance.now()
      try {
        await pyodide.runPythonAsync(activeFile.code)
      } catch (e) {
        append(String(e?.message || e) + '\n')
      }
      const dt = performance.now() - t0
      append(`\n[done in ${dt.toFixed(0)} ms]\n`)
    } catch (e) {
      append(`[error] ${e?.message || e}\n`)
    } finally {
      setRunning(false); setLoadingPy(false)
    }
  }, [running, activeFile, packages, append, pyVersion])

  const installPackage = useCallback(async () => {
    const name = packageInput.trim()
    if (!name) return
    setInstalling(true)
    setOutput(prev => prev + `[install] loading ${name}…\n`)
    try {
      const pyodide = await getPyodide((msg) => append(`[runtime] ${msg}\n`))
      await pyodide.loadPackage(name)
      if (!packages.includes(name)) setPackages([...packages, name])
      append(`[install] ${name} ready.\n`)
      setPackageInput('')
    } catch (e) {
      append(`[install] failed: ${e?.message || e}\n`)
    } finally {
      setInstalling(false)
    }
  }, [packageInput, packages, append])

  // Editor key handling: Cmd/Ctrl+Enter run, Tab indent, smart Enter
  const onEditorKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault(); run(); return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart, end = el.selectionEnd
      const indent = '    '
      const next = activeFile.code.slice(0, start) + indent + activeFile.code.slice(end)
      updateActiveCode(next)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + indent.length })
      return
    }
    if (e.key === 'Enter') {
      const el = e.currentTarget
      const start = el.selectionStart
      const before = activeFile.code.slice(0, start)
      const lineStart = before.lastIndexOf('\n') + 1
      const currentLine = before.slice(lineStart)
      const leading = (currentLine.match(/^[ \t]*/) || [''])[0]
      const extra = currentLine.trimEnd().endsWith(':') ? '    ' : ''
      if (leading || extra) {
        e.preventDefault()
        const insert = '\n' + leading + extra
        const next = before + insert + activeFile.code.slice(start)
        updateActiveCode(next)
        requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + insert.length })
      }
    }
  }

  // File operations
  const newFile = () => {
    const id = makeId()
    const used = new Set(files.map(f => f.name))
    let n = 1, name
    do { name = n === 1 ? 'untitled.py' : `untitled-${n}.py`; n++ } while (used.has(name))
    setFiles([...files, { id, name, code: '# new file\n' }])
    setActiveId(id)
    setTimeout(() => taRef.current?.focus(), 0)
  }

  const closeFile = (id) => {
    if (files.length === 1) {
      if (!confirm('This is your last file. Reset it to the default starter?')) return
      const fresh = DEFAULT_FILES()
      setFiles(fresh); setActiveId(fresh[0].id); return
    }
    if (!confirm('Delete this file?')) return
    const idx = files.findIndex(f => f.id === id)
    const remaining = files.filter(f => f.id !== id)
    setFiles(remaining)
    if (id === activeId) {
      setActiveId(remaining[Math.max(0, idx - 1)].id)
    }
  }

  const startRename = (file) => {
    setRenamingId(file.id); setRenameValue(file.name)
  }
  const commitRename = () => {
    const v = renameValue.trim()
    if (v) {
      setFiles(prev => prev.map(f => f.id === renamingId ? { ...f, name: v.endsWith('.py') ? v : v + '.py' } : f))
    }
    setRenamingId(null); setRenameValue('')
  }

  const loadSnippet = (key) => {
    const tpl = SNIPPET_TEMPLATES[key]
    if (!tpl) return
    // Add as a new file rather than overwriting current — non-destructive.
    const id = makeId()
    setFiles([...files, { id, name: uniqueName(files, tpl.name), code: tpl.code }])
    setActiveId(id)
  }

  const copyCode = async () => {
    if (!activeFile) return
    try {
      await navigator.clipboard.writeText(activeFile.code)
      setCopyToast(true)
      setTimeout(() => setCopyToast(false), 1200)
    } catch {}
  }

  return (
    <div className="content scratch-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current">Scratchpad</span>
      </nav>

      <div className="module-header scratch-header">
        <h2>Python Scratchpad</h2>
        <p>
          Python 3.12 in your browser via Pyodide — no backend, no login. Multiple
          files, autosaved to localStorage. <kbd>⌘ Enter</kbd> /{' '}
          <kbd>Ctrl Enter</kbd> to run.
        </p>
      </div>

      <div className="scratch-tabs-row">
        <div ref={tabBarRef} className="scratch-tabs" role="tablist" aria-label="Files">
          {files.map(f => (
            <div
              key={f.id}
              className={`scratch-tab ${f.id === activeId ? 'active' : ''}`}
              role="tab"
              aria-selected={f.id === activeId}
            >
              {renamingId === f.id ? (
                <input
                  className="scratch-tab-rename"
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); commitRename() }
                    else if (e.key === 'Escape') { setRenamingId(null); setRenameValue('') }
                  }}
                  aria-label="Rename file"
                />
              ) : (
                <button
                  type="button"
                  className="scratch-tab-name"
                  onClick={() => setActiveId(f.id)}
                  onDoubleClick={() => startRename(f)}
                  title="Click to switch · double-click to rename"
                >
                  {f.name}
                </button>
              )}
              <button
                type="button"
                className="scratch-tab-close"
                onClick={(e) => { e.stopPropagation(); closeFile(f.id) }}
                aria-label={`Close ${f.name}`}
                title="Close file"
              >×</button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="scratch-tab-new"
          onClick={newFile}
          aria-label="New file"
          title="New file"
        >+ New</button>
      </div>

      <div className="scratch-toolbar" role="toolbar" aria-label="Scratchpad actions">
        <button
          className="btn btn-primary scratch-run"
          onClick={run}
          disabled={running}
        >
          {running ? (loadingPy ? 'Loading Python…' : 'Running…') : '▶  Run'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => activeFile && openInColab(activeFile.code)}
          title="Copies this file's code to clipboard and opens a fresh Colab tab. Paste with Cmd/Ctrl+V."
        >⇗ Open in Colab</button>
        <button
          className="btn btn-ghost"
          onClick={copyCode}
          title="Copy this file's code to clipboard"
        >{copyToast ? '✓ Copied' : 'Copy'}</button>
        <button
          className="btn btn-ghost"
          onClick={() => activeFile && downloadFile(activeFile.name, activeFile.code)}
          title="Download as .py"
        >Download</button>
        <button
          className="btn btn-ghost"
          onClick={() => setOutput('')}
        >Clear output</button>
        <button
          className="btn btn-ghost"
          onClick={() => startRename(activeFile)}
          title="Rename current file"
        >Rename</button>
      </div>

      <div className="scratch-snippets">
        <span className="scratch-snippets-label">Insert as new file:</span>
        {Object.entries(SNIPPET_TEMPLATES).map(([key, s]) => (
          <button
            key={key}
            className="scratch-snippet-chip"
            onClick={() => loadSnippet(key)}
          >+ {s.name}</button>
        ))}
      </div>

      <textarea
        ref={taRef}
        key={activeFile?.id}
        className="scratch-editor"
        value={activeFile?.code ?? ''}
        onChange={(e) => updateActiveCode(e.target.value)}
        onKeyDown={onEditorKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        aria-label="Python code editor"
        placeholder="# type Python here. Cmd/Ctrl+Enter to run."
      />

      <div className="scratch-output-head">
        <strong>Output</strong>
        <span className="scratch-output-meta">
          {pyVersion ? `Python ${pyVersion}` : 'Python (loads on first run)'}
          {packages.length > 0 && ` · pkgs: ${packages.join(', ')}`}
        </span>
      </div>
      <pre ref={outRef} className="scratch-output" aria-live="polite">
        {output || (running ? '' : '(no output yet — run something)')}
      </pre>

      <details className="scratch-packages">
        <summary>Add a package (numpy, sympy, scipy, requests…)</summary>
        <p className="scratch-packages-help">
          Pyodide ships a curated wheel index. Most pure-Python packages and a
          handful of compiled ones (numpy, scipy, pandas, matplotlib, sympy,
          networkx) work. Try the name and see.
        </p>
        <form
          className="scratch-package-row"
          onSubmit={(e) => { e.preventDefault(); installPackage() }}
        >
          <input
            className="scratch-package-input"
            value={packageInput}
            onChange={(e) => setPackageInput(e.target.value)}
            placeholder="numpy"
            disabled={installing}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={installing || !packageInput.trim()}
          >{installing ? 'Installing…' : 'Add'}</button>
        </form>
        {packages.length > 0 && (
          <div className="scratch-package-list">
            {packages.map(p => (
              <span key={p} className="scratch-package-chip">
                {p}
                <button
                  className="scratch-package-remove"
                  onClick={() => setPackages(packages.filter(x => x !== p))}
                  aria-label={`Remove ${p}`}
                >×</button>
              </span>
            ))}
          </div>
        )}
      </details>
    </div>
  )
}

function uniqueName(files, suggested) {
  const used = new Set(files.map(f => f.name))
  if (!used.has(suggested)) return suggested
  const dot = suggested.lastIndexOf('.')
  const base = dot > 0 ? suggested.slice(0, dot) : suggested
  const ext = dot > 0 ? suggested.slice(dot) : ''
  let n = 2
  while (used.has(`${base}-${n}${ext}`)) n++
  return `${base}-${n}${ext}`
}
