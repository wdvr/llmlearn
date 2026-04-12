import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve static frontend (production)
app.use(express.static(path.join(__dirname, 'dist')));

// Build the system prompt with full app context
function buildSystemPrompt(appContext) {
  const {
    currentPage,       // 'home' | 'module' | 'prs'
    currentModule,     // module object if on a module page
    currentSection,    // which section they're viewing
    completedModules,  // array of completed module IDs
    quizScores,        // { moduleId: { score, total } }
    totalModules,
  } = appContext || {};

  let prompt = `You are an expert PyTorch, deep learning, and LLM architecture tutor embedded in a learning app. Your student is working through a hands-on course on PyTorch, LLM architectures, and Apple MPS (Metal Performance Shaders) backend on Apple Silicon.

## Your Teaching Style
- Be concise but thorough. Prefer code examples over long explanations.
- When explaining a concept, ALWAYS show the PyTorch implementation alongside.
- Use analogies when introducing new concepts.
- If the student has a misconception, correct it directly — don't sugarcoat.
- Relate everything back to practical usage. Theory only matters if it informs the code.
- When discussing MPS, note any gotchas, unsupported ops, or performance implications.
- Use markdown formatting: code blocks with \`\`\`python, **bold** for key terms, etc.

## Course Structure
The app has 6 sequential modules:
1. Tensors & PyTorch Basics — tensors, ops, MPS device, autograd
2. Forward & Backward Pass — training loop, loss, backpropagation
3. Attention & Transformer Architecture — self-attention, multi-head, transformer blocks
4. LLM Architecture Deep Dive — GPT, tokenization, positional encoding, KV cache
5. Apple MPS Backend Deep Dive — internals, debugging, performance tuning, limitations
6. Build & Train a Small LLM — end-to-end character-level GPT on MPS

There is also a PR Review section for browsing real PyTorch MPS pull requests.`;

  // Add progress context
  if (completedModules && completedModules.length > 0) {
    prompt += `\n\n## Student Progress
- Completed ${completedModules.length}/${totalModules || 6} modules: ${completedModules.join(', ')}`;
  }
  if (quizScores && Object.keys(quizScores).length > 0) {
    prompt += `\n- Quiz scores: ${Object.entries(quizScores).map(([mod, s]) => `${mod}: ${s.score}/${s.total}`).join(', ')}`;
  }

  // Add current location context
  if (currentPage === 'module' && currentModule) {
    prompt += `\n\n## Current Context
The student is currently on **Module: ${currentModule.title}**`;
    if (currentSection) {
      prompt += `, reading the section **"${currentSection}"**`;
    }
    prompt += `.

The module covers: ${currentModule.description}.`;

    // Include section titles so Claude knows what's in scope
    if (currentModule.sections) {
      prompt += `\nSections in this module: ${currentModule.sections.map(s => s.title).join(' → ')}`;
    }

    prompt += `\n\nTailor your answers to this module's topic. If they ask about something from a later module, give a brief answer but note they'll cover it in depth later. If they're confused about something from an earlier module, help them review.`;

  } else if (currentPage === 'prs') {
    prompt += `\n\n## Current Context
The student is browsing **PyTorch MPS pull requests**. Help them understand PR diffs, the MPS backend codebase structure, Metal Performance Shaders internals, and how PyTorch dispatches operations to MPS. Key source paths:
- \`aten/src/ATen/native/mps/\` — MPS op implementations
- \`aten/src/ATen/mps/\` — MPS runtime, allocator, streams
- \`torch/backends/mps/\` — Python MPS backend interface`;

  } else {
    prompt += `\n\n## Current Context
The student is on the home page. They may be deciding what to study next. Help them navigate the course or answer general questions.`;
  }

  prompt += `\n\n## Important
- If the student shares code, review it carefully and point out issues.
- If they're stuck on an exercise, give hints before the full solution.
- Assume they have a Mac with Apple Silicon (M-series) and PyTorch installed.
- They can run code locally — suggest they try things in a Python REPL or Jupyter notebook.`;

  return prompt;
}

// Format conversation history for claude -p
function formatConversation(history, systemPrompt) {
  let prompt = systemPrompt + '\n\n---\n\n';

  if (history && history.length > 0) {
    // Include recent conversation for context (last 20 turns max to avoid token limits)
    const recent = history.slice(-20);
    prompt += '## Conversation so far:\n\n';
    for (const msg of recent) {
      if (msg.role === 'user') {
        prompt += `**Student:** ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `**You (tutor):** ${msg.content}\n\n`;
      }
    }
    prompt += '---\n\n';
  }

  return prompt;
}

// Claude chat endpoint — streams response via SSE
app.post('/api/claude', async (req, res) => {
  const { message, appContext, history, model } = req.body;

  const systemPrompt = buildSystemPrompt(appContext);
  const conversationContext = formatConversation(history, systemPrompt);
  const fullPrompt = conversationContext + `**Student:** ${message}\n\n**You (tutor):**`;

  // Build claude CLI args
  const args = ['-p'];
  if (model === 'opus') {
    args.push('--model', 'claude-opus-4-6');
  } else if (model === 'sonnet') {
    args.push('--model', 'claude-sonnet-4-6');
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.flushHeaders();

  // Send initial keepalive so proxies don't timeout waiting for first byte
  res.write(': keepalive\n\n');

  try {
    const claude = spawn('claude', args, {
      env: { ...process.env, PATH: `/root/.local/bin:${process.env.PATH}` },
    });

    let error = '';
    let finished = false;
    let clientDisconnected = false;

    const finish = (eventData) => {
      if (finished) return;
      finished = true;
      if (!clientDisconnected) {
        if (eventData) res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
    };

    claude.stdout.on('data', (data) => {
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ chunk: data.toString() })}\n\n`);
      }
    });

    claude.stderr.on('data', (data) => { error += data.toString(); });

    claude.stdin.write(fullPrompt);
    claude.stdin.end();

    // Send periodic keepalive comments while waiting for response
    const heartbeat = setInterval(() => {
      if (!clientDisconnected && !finished) {
        res.write(': keepalive\n\n');
      }
    }, 15000);

    claude.on('close', (code, signal) => {
      clearInterval(heartbeat);
      if (code !== 0 && !clientDisconnected) {
        console.error(`Claude exited with code ${code} signal ${signal}: ${error}`);
        finish({ error: `Claude exited (code ${code}, signal ${signal}): ${error.slice(0, 500)}` });
      } else {
        finish();
      }
    });

    claude.on('error', (err) => {
      clearInterval(heartbeat);
      console.error('Failed to spawn claude:', err.message);
      finish({ error: `Failed to start claude: ${err.message}` });
    });

    // Clean up if client disconnects
    req.on('close', () => {
      clientDisconnected = true;
      clearInterval(heartbeat);
      if (!finished) {
        claude.kill();
      }
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// GitHub PR endpoint
app.get('/api/prs', async (req, res) => {
  const { page = 1, state = 'all', search = '' } = req.query;

  try {
    const query = search || 'mps';
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+repo:pytorch/pytorch+is:pr&sort=updated&order=desc&per_page=20&page=${page}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'pytorch-learning-app'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a specific PR's diff/files
app.get('/api/prs/:number', async (req, res) => {
  try {
    const url = `https://api.github.com/repos/pytorch/pytorch/pulls/${req.params.number}`;
    const [prRes, filesRes] = await Promise.all([
      fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'pytorch-learning-app' }
      }),
      fetch(`${url}/files?per_page=30`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'pytorch-learning-app' }
      })
    ]);

    const pr = await prRes.json();
    const files = await filesRes.json();
    res.json({ pr, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
