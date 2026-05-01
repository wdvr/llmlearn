import React, { useState, useRef, useEffect } from 'react'

export default function ClaudeChat({ isOpen, onClose, appContext }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('chat_history') || '[]')
      return saved.length > 0 ? saved : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(() => localStorage.getItem('chat_model') || 'sonnet')
  const [needsAuth, setNeedsAuth] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const signInUrl = 'https://auth.thelittleone.rocks/oauth2/start?rd=https://llm.thelittleone.rocks/'

  // Persist messages
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages))
  }, [messages])

  // Persist model choice
  useEffect(() => {
    localStorage.setItem('chat_model', model)
  }, [model])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setNeedsAuth(false)

    try {
      const history = updatedMessages.filter(m => m.role !== 'system')

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          appContext,
          history: history.slice(-20),
          model
        })
      })

      // Detect auth-required responses. oauth2-proxy redirects unauthenticated
      // requests to the sign-in page; fetch follows the 302 transparently and
      // we end up with an HTML body instead of an SSE stream. Treat anything
      // that isn't text/event-stream as needing auth — this is more reliable
      // than relying on status codes (could be 200 from the OAuth page).
      const contentType = res.headers.get('content-type') || ''
      const isSSE = contentType.toLowerCase().startsWith('text/event-stream')

      if (!isSSE) {
        // Roll back the optimistic user message so re-sending after sign-in works.
        setMessages(messages)
        setNeedsAuth(true)
        return
      }

      if (!res.ok) {
        throw new Error('Request failed')
      }

      // Stream SSE response
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.chunk) {
              assistantContent += parsed.chunk
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
                return updated
              })
            } else if (parsed.error) {
              throw new Error(parsed.error)
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Error: ${err.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('chat_history')
  }

  const formatContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```\w*\n?/, '').replace(/```$/, '')
        return <pre key={i}><code>{code}</code></pre>
      }
      const segments = part.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={j}>{seg.slice(2, -2)}</strong>
        }
        const inlined = seg.split(/(`[^`]+`)/g).map((s, k) => {
          if (s.startsWith('`') && s.endsWith('`')) {
            return <code key={k} style={{
              background: 'var(--bg)',
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '12px'
            }}>{s.slice(1, -1)}</code>
          }
          return s
        })
        return <span key={j}>{inlined}</span>
      })
      return <span key={i}>{segments}</span>
    })
  }

  const contextLabel = appContext?.currentPage === 'module' && appContext?.currentModule
    ? appContext.currentModule.title
    : appContext?.currentPage === 'prs'
    ? 'PR Review'
    : 'Home'

  return (
    <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>
          <span style={{ fontSize: '18px' }}>🤖</span>
          Ask Claude
        </h3>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      {/* Model selector + context bar */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Model:</span>
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <button
              onClick={() => setModel('sonnet')}
              style={{
                padding: '4px 10px',
                background: model === 'sonnet' ? 'var(--accent-dark)' : 'transparent',
                color: model === 'sonnet' ? 'white' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: model === 'sonnet' ? 600 : 400
              }}
            >
              Sonnet
            </button>
            <button
              onClick={() => setModel('opus')}
              style={{
                padding: '4px 10px',
                background: model === 'opus' ? 'var(--accent-dark)' : 'transparent',
                color: model === 'opus' ? 'white' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: model === 'opus' ? 600 : 400
              }}
            >
              Opus
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'inline-block'
            }} />
            {contextLabel}
          </span>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 4px'
              }}
              title="Clear chat history"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !needsAuth && (
          <div className="chat-msg system">
            Ask me anything about PyTorch, LLM architecture, or MPS.
            I know which module you're on and adapt my answers.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
          </div>
        ))}
        {needsAuth && (
          <div
            className="chat-msg system"
            style={{
              padding: '16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>
              Sign in to chat
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
              You need to sign in to use the chat. After signing in you'll
              return here and your message will be ready to send again.
            </div>
            <a
              href={signInUrl}
              style={{
                display: 'inline-block',
                background: 'var(--accent)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Sign in
            </a>
          </div>
        )}
        {loading && (
          <div className="chat-msg assistant">
            <div className="loading" style={{ padding: '4px 0' }}>
              <div className="spinner" /> Thinking ({model})...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={`Ask about ${contextLabel.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className="chat-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
