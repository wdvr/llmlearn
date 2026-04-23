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
    currentCourse,     // { id, title } of the active course
    currentModule,     // module object if on a module page
    currentSection,    // which section they're viewing
    completedModules,  // array of completed module IDs
    quizScores,        // { moduleId: { score, total } }
    totalModules,
  } = appContext || {};

  const isCuda = currentCourse?.id === 'cuda-parallel';

  let prompt = `You are an expert GPU programming, parallel computing, and deep learning tutor embedded in a learning app. The app has two courses:

## Course 1: PyTorch & LLMs (Apple Silicon)
9 modules covering tensors, autograd, nn.Module, attention, transformers, training, modern architectures, MoE/MLA. Exercises run in-browser with Pyodide. Also has a PR Review section for PyTorch MPS pull requests.

## Course 2: CUDA & Parallel Computing (based on PMPP book)
12 modules covering GPU architecture, CUDA programming model (using numba.cuda in Python), memory hierarchy, tiling, warps, performance optimization, convolution, reduction, scan, histogram/sorting, sparse computation, and a GEMM capstone. Exercises run on Google Colab with T4 GPU.

## Your Teaching Style
- Be concise but thorough. Prefer code examples over long explanations.
- When explaining a concept, ALWAYS show the implementation alongside.
- Use analogies when introducing new concepts.
- If the student has a misconception, correct it directly — don't sugarcoat.
- Relate everything back to practical usage. Theory only matters if it informs the code.
- Use markdown formatting: code blocks with \`\`\`python, **bold** for key terms, etc.
${isCuda ? `- For CUDA topics, use numba.cuda Python syntax (not raw C CUDA) since that's what the course uses.
- When discussing GPU concepts, relate them to the T4 GPU specs (2560 CUDA cores, 40 SMs, 64 warps/SM, 48KB shared mem/SM).` : `- When discussing MPS, note any gotchas, unsupported ops, or performance implications.`}`;

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
- If they're stuck on an exercise, give hints before the full solution.`;

  if (isCuda) {
    prompt += `
- CUDA exercises use numba.cuda on Google Colab with T4 GPU (free tier).
- Always use numba.cuda syntax: @cuda.jit, cuda.grid(1), cuda.shared.array(), cuda.syncthreads().
- If they ask about raw C CUDA, relate it to the numba.cuda equivalent they're learning.`;
  } else {
    prompt += `
- Assume they have a Mac with Apple Silicon (M-series) and PyTorch installed.
- They can run code locally — suggest they try things in a Python REPL or Jupyter notebook.`;
  }

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
        console.error(`Claude exited: code=${code} signal=${signal} ${error.slice(0, 200)}`);
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

    // Clean up if client disconnects (use res, not req — req 'close' fires after body is consumed)
    res.on('close', () => {
      if (!finished) {
        clientDisconnected = true;
        clearInterval(heartbeat);
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
