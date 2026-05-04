import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { courses as defaultCourses } from '../content/courses'

export default function PRReview({ courses = defaultCourses }) {
  // Pick the first course that has curated PRs as the focus.
  const prCourse = useMemo(
    () => courses.find(c => c.curatedPRs && c.curatedPRs.length > 0),
    [courses]
  )
  const curatedPRs = prCourse?.curatedPRs || []
  const defaultSearch = prCourse?.id === 'apple-mps' ? 'mps' : ''

  const [tab, setTab] = useState('curated')
  const [prs, setPrs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState(defaultSearch)
  const [selectedPR, setSelectedPR] = useState(null)
  const [prDetail, setPrDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchLivePRs = async (query) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/prs?search=${encodeURIComponent(query || defaultSearch)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPrs(data.items || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch PRs')
      setPrs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPRDetail = async (number) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/prs/${number}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPrDetail(data)
    } catch (err) {
      setPrDetail({ error: err.message || 'Failed to fetch PR detail' })
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'live' && prs.length === 0 && !loading) {
      fetchLivePRs(search)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchLivePRs(search)
  }

  const handleSelectLivePR = (pr) => {
    setSelectedPR(pr)
    fetchPRDetail(pr.number)
  }

  if (!prCourse) {
    return (
      <div className="content">
        <div className="module-header">
          <h2>PR Review</h2>
          <p>No curated PRs are available yet.</p>
        </div>
        <Link to="/" className="btn btn-secondary">← Back to courses</Link>
      </div>
    )
  }

  if (selectedPR) {
    return (
      <div className="content">
        <button
          className="btn btn-secondary"
          onClick={() => { setSelectedPR(null); setPrDetail(null); }}
          style={{ marginBottom: '20px' }}
        >
          ← Back to PR list
        </button>

        <div className="pr-detail">
          <h3>#{selectedPR.number}: {selectedPR.title}</h3>
          <div className="pr-meta" style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            {selectedPR.user?.login && <>by {selectedPR.user.login} · </>}
            {selectedPR.state}
            {selectedPR.updated_at && <> · updated {new Date(selectedPR.updated_at).toLocaleDateString()}</>}
          </div>

          {selectedPR.body && (
            <div style={{
              padding: '16px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.7',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {selectedPR.body.slice(0, 2000)}
              {selectedPR.body.length > 2000 && '...'}
            </div>
          )}

          {selectedPR.html_url && (
            <a
              href={selectedPR.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-block', marginBottom: '24px', textDecoration: 'none' }}
            >
              View on GitHub →
            </a>
          )}

          {detailLoading && (
            <div className="loading"><div className="spinner" /> Loading files...</div>
          )}

          {prDetail?.error && (
            <div className="callout callout-info" style={{ borderLeftColor: 'var(--red)' }}>
              {prDetail.error}
            </div>
          )}

          {prDetail?.files && (
            <>
              <h4 style={{ marginBottom: '12px' }}>
                Changed Files ({prDetail.files.length})
              </h4>
              {prDetail.files.slice(0, 15).map((file, i) => (
                <div key={i} className="pr-file">
                  <div className="pr-file-header">
                    <span>{file.filename}</span>
                    <span>
                      <span style={{ color: 'var(--green)' }}>+{file.additions}</span>
                      {' '}
                      <span style={{ color: 'var(--red)' }}>-{file.deletions}</span>
                    </span>
                  </div>
                  {file.patch && (
                    <div className="pr-file-diff">
                      {file.patch.split('\n').slice(0, 50).map((line, j) => (
                        <div
                          key={j}
                          className={`line ${
                            line.startsWith('+') ? 'add' :
                            line.startsWith('-') ? 'del' : ''
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                      {file.patch.split('\n').length > 50 && (
                        <div className="line" style={{ color: 'var(--text-muted)', padding: '8px 16px' }}>
                          ... {file.patch.split('\n').length - 50} more lines (view on GitHub)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Courses</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <Link to={`/course/${prCourse.id}`}>{prCourse.title}</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current">PR Review</span>
      </nav>

      <div className="module-header">
        <h2>{prCourse.title} — PR Review</h2>
        <p>Learn from real PyTorch pull requests related to {prCourse.title}.</p>
      </div>

      <div className="tab-bar">
        <button
          className={`tab ${tab === 'curated' ? 'active' : ''}`}
          onClick={() => setTab('curated')}
        >
          Curated & Annotated
        </button>
        <button
          className={`tab ${tab === 'live' ? 'active' : ''}`}
          onClick={() => setTab('live')}
        >
          Live from GitHub
        </button>
      </div>

      {tab === 'curated' && (
        <div className="pr-list">
          {curatedPRs.map((pr) => (
            <div key={pr.number} className="pr-card" onClick={() => {
              setSelectedPR(pr)
              fetchPRDetail(pr.number)
            }}>
              <h4>#{pr.number}: {pr.title}</h4>
              <p className="pr-meta">{pr.description}</p>
              <div className="pr-tags">
                {pr.tags?.map(t => <span key={t} className="pr-tag">{t}</span>)}
              </div>
              <div className="pr-learning-points">
                <h4>What you'll learn:</h4>
                <ul>
                  {pr.learningPoints?.map((lp, i) => (
                    <li key={i}>{lp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'live' && (
        <>
          <form onSubmit={handleSearch} className="search-bar">
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search PyTorch PRs (e.g., "mps", "metal", "apple silicon")'
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {error && (
            <div className="callout callout-info" style={{ borderLeftColor: 'var(--red)' }}>
              {error} — try again, or check your connection.
            </div>
          )}

          {loading ? (
            <div className="loading"><div className="spinner" /> Fetching PRs...</div>
          ) : (
            <div className="pr-list">
              {prs.length === 0 && !error && (
                <p style={{ color: 'var(--text-muted)' }}>
                  No PRs found. Try searching for "mps", "metal", or "apple".
                </p>
              )}
              {prs.map((pr) => (
                <div
                  key={pr.number}
                  className="pr-card"
                  onClick={() => handleSelectLivePR(pr)}
                >
                  <h4>
                    #{pr.number}: {pr.title}
                  </h4>
                  <p className="pr-meta">
                    by {pr.user?.login} · {pr.state} ·
                    updated {new Date(pr.updated_at).toLocaleDateString()}
                  </p>
                  <div className="pr-tags">
                    {pr.labels?.slice(0, 5).map(l => (
                      <span key={l.id} className="pr-tag">{l.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
