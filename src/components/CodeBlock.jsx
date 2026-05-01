import React, { useState, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pyodideRef = useRef(null)
  const outputRef = useRef(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadPyodide = async () => {
    if (pyodideRef.current || isLoading) return

    try {
      setIsLoading(true)
      setOutput('Loading Python runtime...\n')

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js'

      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide()
          pyodideRef.current = pyodide
          await pyodide.loadPackage('numpy')
          setOutput('Python runtime ready!\n\n')
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

  const handleRun = async () => {
    if (language !== 'python') {
      setOutput('Only Python code can be executed.\n')
      setShowOutput(true)
      return
    }

    if (!pyodideRef.current) {
      await loadPyodide()
      // Wait for Pyodide to load
      if (!pyodideRef.current) {
        const maxWait = 30000
        const startTime = Date.now()
        while (!pyodideRef.current && Date.now() - startTime < maxWait) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      if (!pyodideRef.current) {
        setOutput('Failed to load Python runtime')
        setShowOutput(true)
        return
      }
    }

    setIsRunning(true)
    setShowOutput(true)

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

      pyodide.runPython(wrappedCode)

      const stdout = pyodide.globals.get('_final_stdout')
      const stderr = pyodide.globals.get('_final_stderr')

      let result = ''
      if (stdout) result += stdout
      if (stderr) result += stderr

      if (!result) result = 'Code executed successfully with no output.\n'

      setOutput(result)
      setIsRunning(false)

      if (outputRef.current) {
        setTimeout(() => {
          outputRef.current.scrollTop = outputRef.current.scrollHeight
        }, 0)
      }
    } catch (err) {
      const errorMsg = err.toString()
      setOutput(`Error executing code:\n${errorMsg}\n`)
      setIsRunning(false)
    }
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{language}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {language === 'python' && (
            <button
              className="copy-btn"
              onClick={handleRun}
              disabled={isRunning || isLoading}
              title="Run Python code"
            >
              {isRunning || isLoading ? '...' : '▶ Run'}
            </button>
          )}
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language === 'cuda' || language === 'cu' ? 'cpp' : language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '12px 16px', fontSize: '13px', lineHeight: '1.5', background: 'var(--code-bg, #1e1e1e)' }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>

      {showOutput && (
        <div className="code-output">
          <div className="output-header-mini">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Output</span>
          </div>
          <div className="output-terminal-mini" ref={outputRef}>
            <pre>{output}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
