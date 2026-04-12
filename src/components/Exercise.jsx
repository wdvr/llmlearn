import React, { useState, useRef, useEffect } from 'react'
import CodeBlock from './CodeBlock'

export default function Exercise({ exercise }) {
  const [code, setCode] = useState(exercise.starterCode)
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const pyodideRef = useRef(null)
  const outputRef = useRef(null)

  // Load Pyodide on first run
  const loadPyodide = async () => {
    if (pyodideReady || isLoading) return

    try {
      setIsLoading(true)
      setOutput('Loading Python runtime...\n')

      // Load Pyodide from CDN
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js'

      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide()
          pyodideRef.current = pyodide

          // Pre-install packages
          setOutput(prev => prev + 'Installing numpy...\n')
          await pyodide.loadPackage('numpy')

          setOutput(prev => prev + 'Python runtime ready!\n\nNote: torch/PyTorch is not available in browser. Use numpy for array operations.\n\n')
          setPyodideReady(true)
          setIsLoading(false)
        } catch (err) {
          setOutput(`Error initializing Pyodide: ${err.message}`)
          setIsLoading(false)
        }
      }

      script.onerror = () => {
        setOutput('Error loading Pyodide from CDN')
        setIsLoading(false)
      }

      document.head.appendChild(script)
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setIsLoading(false)
    }
  }

  const handleRunCode = async () => {
    // Load Pyodide if not already loaded
    if (!pyodideReady) {
      await loadPyodide()
      // Wait for Pyodide to be ready
      if (!pyodideRef.current) {
        const maxWait = 30000 // 30 seconds
        const startTime = Date.now()
        while (!pyodideRef.current && Date.now() - startTime < maxWait) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      if (!pyodideRef.current) {
        setOutput('Failed to load Python runtime')
        return
      }
    }

    setIsRunning(true)
    setOutput('')

    try {
      const pyodide = pyodideRef.current

      // Wrap user code to capture output
      const wrappedCode = `
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

# Create string buffers for output
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

try:
    with redirect_stdout(_stdout_buffer), redirect_stderr(_stderr_buffer):
${code.split('\n').map(line => '        ' + line).join('\n')}
except Exception as e:
    import traceback
    _stderr_buffer.write(traceback.format_exc())

# Store results
_final_stdout = _stdout_buffer.getvalue()
_final_stderr = _stderr_buffer.getvalue()
`

      try {
        pyodide.runPython(wrappedCode)

        const stdout = pyodide.globals.get('_final_stdout')
        const stderr = pyodide.globals.get('_final_stderr')

        let result = ''
        if (stdout) result += stdout
        if (stderr) result += stderr

        if (!result) result = 'Code executed successfully with no output.\n'

        setOutput(result)
        setIsRunning(false)
      } catch (err) {
        const errorMsg = err.toString()
        setOutput(`Error executing code:\n${errorMsg}\n`)
        setIsRunning(false)
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setIsRunning(false)
    }
  }

  const handleClearOutput = () => {
    setOutput('')
  }

  const handleReset = () => {
    setCode(exercise.starterCode)
    setShowSolution(false)
    setOutput('')
  }

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const val = e.target.value
      setCode(val.substring(0, start) + '    ' + val.substring(end))
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4
      }, 0)
    }
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRunCode()
    }
    handleTab(e)
  }

  // Scroll output to bottom when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className="exercise-section">
      <h3>🔨 Exercise: {exercise.title}</h3>
      <div className="exercise-desc">
        {exercise.description.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>

      <div className="exercise-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Write your Python code here... (Ctrl+Enter or Cmd+Enter to run)"
        />
      </div>

      {/* Output Panel */}
      {output && (
        <div className="exercise-output">
          <div className="output-header">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Output
            </span>
            <button
              className="output-clear-btn"
              onClick={handleClearOutput}
            >
              Clear
            </button>
          </div>
          <div className="output-terminal" ref={outputRef}>
            <pre>{output}</pre>
          </div>
        </div>
      )}

      <div className="exercise-actions">
        <button
          className="btn btn-primary"
          onClick={handleRunCode}
          disabled={isLoading || isRunning}
          title="Run code (Ctrl+Enter or Cmd+Enter)"
        >
          {isLoading || isRunning ? (
            <>
              <span className="spinner-inline"></span>
              {isLoading ? 'Loading...' : 'Running...'}
            </>
          ) : (
            '▶ Run Code'
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const blob = new Blob([code], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `exercise_${exercise.title.toLowerCase().replace(/\s+/g, '_')}.py`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download .py
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {showSolution && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--green)' }}>
            Solution
          </h4>
          <CodeBlock code={exercise.solution} />
        </div>
      )}
    </div>
  )
}
