import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { modules } from './content/modules'
import ModulePage from './components/ModulePage'
import PRReview from './components/PRReview'
import ClaudeChat from './components/ClaudeChat'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('completed') || '[]')
    } catch { return [] }
  })
  const [chatOpen, setChatOpen] = useState(false)
  const [quizScores, setQuizScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quiz_scores') || '{}')
    } catch { return {} }
  })
  const [currentSection, setCurrentSection] = useState(null)

  // Build app context for Claude chat
  const appContext = useMemo(() => {
    const path = location.pathname
    const moduleMatch = path.match(/^\/module\/(.+)$/)

    if (moduleMatch) {
      const mod = modules.find(m => m.id === moduleMatch[1])
      return {
        currentPage: 'module',
        currentModule: mod ? { title: mod.title, description: mod.description, sections: mod.sections?.map(s => ({ title: s.title })) } : null,
        currentSection,
        completedModules: completed,
        quizScores,
        totalModules: modules.length,
      }
    } else if (path.startsWith('/prs')) {
      return {
        currentPage: 'prs',
        completedModules: completed,
        quizScores,
        totalModules: modules.length,
      }
    }
    return {
      currentPage: 'home',
      completedModules: completed,
      quizScores,
      totalModules: modules.length,
    }
  }, [location.pathname, completed, quizScores, currentSection])

  useEffect(() => {
    localStorage.setItem('completed', JSON.stringify(completed))
  }, [completed])

  const markComplete = (moduleId) => {
    if (!completed.includes(moduleId)) {
      setCompleted([...completed, moduleId])
    }
  }

  const progress = Math.round((completed.length / modules.length) * 100)

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>PyTorch & LLMs</h1>
          <p>Learning on Apple Silicon</p>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">Course</div>
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-dot" />
            <span>Home</span>
          </Link>

          {modules.map((mod) => (
            <Link
              key={mod.id}
              to={`/module/${mod.id}`}
              className={`nav-item ${
                location.pathname === `/module/${mod.id}` ? 'active' : ''
              } ${completed.includes(mod.id) ? 'completed' : ''}`}
            >
              <span className="nav-dot" />
              <span>{mod.title}</span>
            </Link>
          ))}

          <div className="nav-section">Tools</div>
          <Link
            to="/prs"
            className={`nav-item ${location.pathname.startsWith('/prs') ? 'active' : ''}`}
          >
            <span className="nav-dot" />
            <span>PR Review</span>
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            {completed.length}/{modules.length} modules — {progress}%
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage modules={modules} completed={completed} />} />
          <Route
            path="/module/:id"
            element={
              <ModulePage
                modules={modules}
                completed={completed}
                onComplete={markComplete}
                onQuizScore={(moduleId, score, total) => {
                  const updated = { ...quizScores, [moduleId]: { score, total } }
                  setQuizScores(updated)
                  localStorage.setItem('quiz_scores', JSON.stringify(updated))
                }}
                onSectionChange={setCurrentSection}
              />
            }
          />
          <Route path="/prs" element={<PRReview />} />
        </Routes>
      </main>

      {/* Claude Chat */}
      <ClaudeChat isOpen={chatOpen} onClose={() => setChatOpen(false)} appContext={appContext} />
      <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)} title="Ask Claude">
        💬
      </button>
    </div>
  )
}

function HomePage({ modules, completed }) {
  return (
    <div className="home">
      <h2>Learn PyTorch & LLM Architecture</h2>
      <p className="subtitle">
        Hands-on course covering tensors, backprop, transformers, MPS acceleration,
        and building your own language model — all on Apple Silicon.
      </p>

      <div className="module-cards">
        {modules.map((mod, i) => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className={`module-card ${completed.includes(mod.id) ? 'completed' : ''}`}
          >
            <div className="module-num">
              {completed.includes(mod.id) ? '✓' : i + 1}
            </div>
            <div className="module-card-text">
              <h4>{mod.title}</h4>
              <p>{mod.description}</p>
            </div>
          </Link>
        ))}

        <Link to="/prs" className="module-card">
          <div className="module-num" style={{ color: '#bc8cff' }}>PR</div>
          <div className="module-card-text">
            <h4>PyTorch MPS PR Review</h4>
            <p>Browse and study real PyTorch PRs related to MPS backend</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default App
