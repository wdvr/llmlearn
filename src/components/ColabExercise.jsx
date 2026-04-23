import React, { useState } from 'react'

export default function ColabExercise({ exercise }) {
  const [showSolution, setShowSolution] = useState(false)

  if (!exercise) return null

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
            <button
              onClick={() => {
                navigator.clipboard.writeText(exercise.starterCode)
              }}
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
        <a
          href={exercise.colabUrl || 'https://colab.research.google.com/'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f9ab00',
            color: '#1a1a1a',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          Open in Google Colab
        </a>

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
        padding: '12px 16px',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '16px',
        lineHeight: 1.5
      }}>
        <strong>How to use:</strong> Open Google Colab, paste the starter code, and select
        <strong> Runtime → Change runtime type → T4 GPU</strong>. Free tier includes T4 access.
        Copy the starter code above into a Colab cell, or click the button to open Colab directly.
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
