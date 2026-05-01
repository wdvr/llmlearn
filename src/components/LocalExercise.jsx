import React, { useState } from 'react'

export default function LocalExercise({ exercise, moduleId }) {
  const [showSolution, setShowSolution] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!exercise) return null

  const filename = `${moduleId || exercise.id || 'exercise'}.py`

  const copyStarter = async () => {
    try {
      await navigator.clipboard.writeText(exercise.starterCode || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const downloadFile = () => {
    const blob = new Blob([exercise.starterCode || ''], { type: 'text/x-python' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="exercise-section">
      <h3>Exercise: {exercise.title}</h3>
      <div className="exercise-description" style={{ marginBottom: '16px', lineHeight: 1.7 }}>
        {exercise.description}
      </div>

      {exercise.starterCode && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <strong style={{ fontSize: '14px' }}>Starter Code</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {filename}
            </span>
          </div>
          <pre style={{
            background: 'var(--code-bg)',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: 'var(--font-size-code)',
            lineHeight: 1.5,
            border: '1px solid var(--border)',
            maxWidth: '100%',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <code>{exercise.starterCode}</code>
          </pre>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={copyStarter}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          {copied ? 'Copied!' : 'Copy starter code'}
        </button>

        <button
          onClick={downloadFile}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-tertiary)',
            color: 'var(--text)',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Download .py file
        </button>

        {exercise.solution && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text)',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        )}
      </div>

      <div style={{
        padding: '14px 16px',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '16px',
        lineHeight: 1.6,
        borderLeft: '3px solid var(--accent)'
      }}>
        <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '8px' }}>
          Run locally on Apple Silicon
        </div>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            Save as <code style={{
              background: 'var(--bg)',
              padding: '1px 6px',
              borderRadius: '3px',
              fontSize: '12px'
            }}>{filename}</code>.
          </li>
          <li>
            Set up a venv:{' '}
            <code style={{
              background: 'var(--bg)',
              padding: '1px 6px',
              borderRadius: '3px',
              fontSize: '12px'
            }}>python3 -m venv .venv && source .venv/bin/activate</code>.
          </li>
          <li>
            Install deps:{' '}
            <code style={{
              background: 'var(--bg)',
              padding: '1px 6px',
              borderRadius: '3px',
              fontSize: '12px'
            }}>pip install torch numpy</code>.
          </li>
          <li>
            Run:{' '}
            <code style={{
              background: 'var(--bg)',
              padding: '1px 6px',
              borderRadius: '3px',
              fontSize: '12px'
            }}>python {filename}</code>.
          </li>
        </ol>
        <div style={{ marginTop: '10px' }}>
          Verify MPS is available:{' '}
          <code style={{
            background: 'var(--bg)',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '12px'
          }}>python -c 'import torch; print(torch.backends.mps.is_available())'</code>{' '}
          should print <code style={{
            background: 'var(--bg)',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '12px'
          }}>True</code> on M-series Macs.
        </div>
      </div>

      {showSolution && exercise.solution && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <strong style={{ fontSize: '14px', color: 'var(--green)' }}>Solution</strong>
            <button
              onClick={() => navigator.clipboard.writeText(exercise.solution)}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Copy
            </button>
          </div>
          <pre style={{
            background: 'var(--code-bg)',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: 'var(--font-size-code)',
            lineHeight: 1.5,
            border: '1px solid var(--green)',
          }}>
            <code>{exercise.solution}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
