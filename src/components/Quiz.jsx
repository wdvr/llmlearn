import React, { useState } from 'react'

export default function Quiz({ questions, moduleId, onScore }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

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
      const finalScore = score + (selected === questions[currentQ]?.correct ? 0 : 0) // score already updated
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

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz-section">
        <h3>Quiz Complete</h3>
        <p style={{ fontSize: '18px', marginBottom: '8px' }}>
          Score: <strong style={{ color: pct >= 70 ? 'var(--green)' : 'var(--orange)' }}>
            {score}/{questions.length} ({pct}%)
          </strong>
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
          {pct >= 70 ? 'Great job! You\'re ready to move on.' : 'Review the material and try again.'}
        </p>
        <button className="btn btn-secondary" onClick={handleReset}>
          Retake Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-section">
      <h3>📝 Knowledge Check</h3>
      <div className="quiz-question">
        <div className="quiz-counter">
          Question {currentQ + 1} of {questions.length}
        </div>
        <p>{q.question}</p>
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (answered && i === q.correct) cls += ' correct'
            else if (answered && i === selected && i !== q.correct) cls += ' incorrect'
            else if (!answered && i === selected) cls += ' selected'

            return (
              <div key={i} className={cls} onClick={() => handleSelect(i)}>
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
