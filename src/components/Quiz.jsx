import React, { useState, useRef } from 'react'

export default function Quiz({ questions, moduleId, onScore }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const optionRefs = useRef([])

  const q = questions[currentQ]
  const letters = ['A', 'B', 'C', 'D']

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === q.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
      onScore?.(score, questions.length)
    }
  }

  const handleReset = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
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
        <button className="btn btn-secondary" onClick={handleReset}>
          Retake Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-section">
      <h3>Knowledge Check</h3>
      <div className="quiz-question">
        <div className="quiz-counter">
          Question {currentQ + 1} of {questions.length}
        </div>
        <p>{q.question}</p>
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
                <span>{opt}</span>
              </div>
            )
          })}
        </div>

        {answered && (
          <div className="quiz-explanation">
            {selected === q.correct ? '✓ Correct! ' : '✗ Incorrect. '}
            {q.explanation}
          </div>
        )}
      </div>

      <div className="quiz-nav">
        <span className="quiz-score">Score: {score}/{currentQ + (answered ? 1 : 0)}</span>
        {answered && (
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}
