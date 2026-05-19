import React, { useState, useRef, useEffect } from 'react'
import { inlineMd } from './inlineMd'

// Per-module quiz state is persisted in localStorage so the user's answers
// + score stick around when they navigate away and come back. The state is
// cleared only when the user explicitly hits "Redo quiz". Keyed by moduleId.
const QUIZ_STATE_KEY = 'quiz_state'

function loadQuizState(moduleId) {
  if (!moduleId) return null
  try {
    const all = JSON.parse(localStorage.getItem(QUIZ_STATE_KEY) || '{}')
    return all[moduleId] || null
  } catch { return null }
}

function saveQuizState(moduleId, state) {
  if (!moduleId) return
  try {
    const all = JSON.parse(localStorage.getItem(QUIZ_STATE_KEY) || '{}')
    if (state == null) delete all[moduleId]
    else all[moduleId] = state
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(all))
  } catch {}
}

export default function Quiz({ questions, moduleId, onScore }) {
  // Lazy-init from saved state. `selections` is the chosen-option index per
  // question (or null if unanswered); `currentQ` is where the user was when
  // they last navigated away; `finished` is whether they reached the results.
  const initial = (() => {
    const saved = loadQuizState(moduleId)
    if (saved && Array.isArray(saved.selections) && saved.selections.length === questions.length) {
      return saved
    }
    return { selections: questions.map(() => null), currentQ: 0, finished: false }
  })()

  const [selections, setSelections] = useState(initial.selections)
  const [currentQ, setCurrentQ] = useState(initial.currentQ)
  const [finished, setFinished] = useState(initial.finished)
  const optionRefs = useRef([])

  const q = questions[currentQ]
  const letters = ['A', 'B', 'C', 'D']

  // Derived state — keeps the persisted shape lean (only selections + cursor).
  const answered = selections[currentQ] != null
  const selected = selections[currentQ]
  const score = selections.reduce((acc, sel, i) => acc + (sel != null && sel === questions[i].correct ? 1 : 0), 0)
  const outcomes = selections.map((sel, i) => sel == null ? null : sel === questions[i].correct)

  // Persist every state change so a reload restores exactly what you saw.
  useEffect(() => {
    saveQuizState(moduleId, { selections, currentQ, finished })
  }, [moduleId, selections, currentQ, finished])

  const handleSelect = (index) => {
    if (answered) return
    setSelections(prev => {
      const next = prev.slice()
      next[currentQ] = index
      return next
    })
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setFinished(true)
      onScore?.(score, questions.length)
    }
  }

  const handleReset = () => {
    setSelections(questions.map(() => null))
    setCurrentQ(0)
    setFinished(false)
    saveQuizState(moduleId, null)
  }

  const handleKey = (e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(i)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (i + 1) % q.options.length
      optionRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (i - 1 + q.options.length) % q.options.length
      optionRefs.current[prev]?.focus()
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const passed = pct >= 70
    return (
      <div className="quiz-section">
        <h3>Quiz Complete</h3>
        <p style={{ fontSize: '18px', marginBottom: '8px' }}>
          Score: <strong style={{ color: passed ? 'var(--green)' : 'var(--orange)' }}>
            {score}/{questions.length} ({pct}%)
          </strong>
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
          {passed
            ? '✓ You passed — this module has been marked complete.'
            : 'Review the material and try again. You need 70% to pass.'}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            Redo quiz
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => { setFinished(false); setCurrentQ(0) }}
            title="Walk through your answers again without resetting them"
          >
            Review answers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-section">
      <div className="quiz-header-row">
        <h3>Knowledge Check</h3>
        {selections.some(s => s != null) && (
          <button
            type="button"
            className="quiz-redo-btn"
            onClick={handleReset}
            title="Clear all saved answers and start over"
          >
            ↻ Redo quiz
          </button>
        )}
      </div>

      {/* Progress segments: one per question. Colored by outcome so you can
          see which you got right/wrong as you go. */}
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label={`Question ${currentQ + 1} of ${questions.length}`}
        aria-valuenow={currentQ + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        {outcomes.map((o, i) => (
          <button
            key={i}
            type="button"
            className={
              'quiz-progress-seg' +
              (o === true ? ' correct' : o === false ? ' incorrect' : '') +
              (i === currentQ ? ' current' : '')
            }
            onClick={() => setCurrentQ(i)}
            aria-label={`Jump to question ${i + 1}${o === true ? ' (correct)' : o === false ? ' (incorrect)' : ''}`}
          />
        ))}
      </div>

      <div className="quiz-question">
        <div className="quiz-counter">
          Question {currentQ + 1} of {questions.length}
          {selections.filter(s => s != null).length > 0 && (
            <span className="quiz-counter-saved" title="Your answers are saved automatically"> · saved</span>
          )}
        </div>
        <p>{inlineMd(q.question)}</p>
        <div
          className="quiz-options"
          role="radiogroup"
          aria-label={`Answers for: ${q.question}`}
        >
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (answered && i === q.correct) cls += ' correct'
            else if (answered && i === selected && i !== q.correct) cls += ' incorrect'
            else if (!answered && i === selected) cls += ' selected'

            return (
              <div
                key={i}
                ref={el => (optionRefs.current[i] = el)}
                className={cls}
                role="radio"
                aria-checked={selected === i}
                tabIndex={answered ? -1 : (selected === i || (selected === null && i === 0) ? 0 : -1)}
                onClick={() => handleSelect(i)}
                onKeyDown={(e) => handleKey(e, i)}
              >
                <span className="option-letter">{letters[i]}</span>
                <span>{inlineMd(opt)}</span>
              </div>
            )
          })}
        </div>

        {answered && (
          <div className="quiz-explanation">
            <strong>{selected === q.correct ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
            {inlineMd(q.explanation)}
          </div>
        )}
      </div>

      <div className="quiz-nav">
        <span className="quiz-score">
          Score: {score}/{selections.filter(s => s != null).length}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentQ > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentQ(currentQ - 1)}
            >
              ← Previous
            </button>
          )}
          {answered && (
            <button className="btn btn-primary" onClick={handleNext}>
              {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
