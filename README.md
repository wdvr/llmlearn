# PyTorch & LLM Learning App

A self-contained learning app for mastering PyTorch, LLM architecture, and Apple MPS backend.

## Features

- **6 modules**: Tensors → Forward/Backward → Attention/Transformers → LLM Architecture → MPS Deep Dive → Build & Train LLM
- **Interactive quizzes** with explanations
- **Code exercises** with starter code and solutions
- **Claude AI tutor** (uses `claude -p` CLI on your machine)
- **PR Review** — browse live PyTorch MPS PRs from GitHub + curated annotated ones

## Quick Start

```bash
npm install
npm run dev
```

This starts both the Vite dev server (port 3000) and the Express backend (port 3001).

Open **http://localhost:3000**

## Requirements

- Node.js 18+
- `claude` CLI installed and logged in (for the Ask Claude feature)
- Internet connection (for GitHub PR fetching)

## Architecture

- **Frontend**: React + Vite (port 3000)
- **Backend**: Express (port 3001)
  - `/api/claude` — proxies questions to `claude -p`
  - `/api/prs` — fetches PyTorch MPS PRs from GitHub API
  - `/api/prs/:number` — fetches PR details and file diffs
