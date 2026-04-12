# LLM Learn

Personal learning app for PyTorch, LLM architecture, and Apple MPS. 9 interactive modules with quizzes, runnable Python exercises (Pyodide + torch shim), Claude AI chat, and PyTorch MPS PR review.

**Live**: https://llm.thelittleone.rocks (Google auth required)

## Quick Reference

```bash
# Local dev (frontend + backend with hot reload)
npm run dev          # http://localhost:3000

# Deploy immediately (push + trigger rebuild on n100w)
npm run push         # = git push && ssh n100w 'bash auto-update.sh'

# Full deploy (SSH into n100w, pull, rebuild)
npm run deploy       # = bash deploy.sh
```

## Architecture

```
┌─────────────┐    ┌──────────────────────────────────┐
│   Browser    │───>│  Nginx Proxy Manager (n100w)      │
│              │    │  llm.thelittleone.rocks            │
└─────────────┘    │  - oauth2-proxy (Google auth)      │
                   │  - forward to llmlearn:3001        │
                   └──────────────────────────────────┘
                              │
                   ┌──────────v──────────────────────┐
                   │  Docker: llmlearn                 │
                   │  - Express (port 3001)            │
                   │    - Static frontend (Vite)       │
                   │    - /api/claude (claude -p)      │
                   │    - /api/prs (GitHub API)        │
                   │  - opt_default network            │
                   └──────────────────────────────────┘
```

## Deploy Pipeline

### Auto-deploy (cron)
A cron job on n100w runs `auto-update.sh` every 2 minutes. It does `git fetch`, compares HEAD to origin -- if different, pulls and rebuilds the Docker container. **Worst case latency: ~4 min** (2 min cron interval + ~2 min build).

```
*/2 * * * * /bin/bash /home/wouter/llmlearn/auto-update.sh
```

### Manual deploy
```bash
npm run push         # Fastest: push + trigger immediately
npm run deploy       # Alternative: full SSH deploy script
```

### What happens on deploy
1. `git pull --ff-only` on n100w
2. `docker compose build --build-arg COMMIT_HASH=... --build-arg BUILD_NUM=...`
3. `docker compose up -d`
4. `docker image prune -f`

Build number and commit hash appear in the sidebar footer.

## Setup (one-time)

### n100w

```bash
# Clone repo
git clone git@github.com:wdvr/llmlearn.git ~/llmlearn

# First deploy
cd ~/llmlearn
HASH=$(git rev-parse --short HEAD)
NUM=$(git rev-list --count HEAD)
docker compose build --build-arg COMMIT_HASH=$HASH --build-arg BUILD_NUM=$NUM
docker compose up -d

# Set up auto-deploy cron
(crontab -l 2>/dev/null; echo '*/2 * * * * /bin/bash /home/wouter/llmlearn/auto-update.sh') | crontab -

# Install claude CLI (needed for auth config)
curl -fsSL https://claude.ai/install.sh | bash
claude  # login once to create ~/.claude credentials
```

### Nginx Proxy Manager

Create proxy host:
- **Domain**: `llm.thelittleone.rocks`
- **Forward hostname**: `llmlearn`
- **Forward port**: `3001`
- **SSL**: Let's Encrypt

**Advanced config** (Google auth via oauth2-proxy):
```nginx
location /oauth2/ {
    proxy_pass http://oauth2-proxy:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Auth-Request-Redirect $scheme://$host$request_uri;
}
location = /oauth2/auth {
    internal;
    proxy_pass http://oauth2-proxy:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Content-Length "";
    proxy_pass_request_body off;
}
auth_request /oauth2/auth;
auth_request_set $auth_cookie $upstream_http_set_cookie;
add_header Set-Cookie $auth_cookie;
error_page 401 = @login;
location @login {
    return 302 https://auth.thelittleone.rocks/oauth2/start?rd=$scheme://$host$request_uri;
}
auth_request_set $email $upstream_http_x_auth_request_email;
proxy_set_header X-Email $email;
```

### Docker

The container:
- Builds frontend with Vite (node:20-slim)
- Installs claude CLI via `curl install.sh | bash`
- Runs Express server serving static files + API
- Mounts `~/.claude` from host for claude auth
- Joins `opt_default` Docker network (NPM network)

## Local Dev

```bash
npm install
npm run dev     # Starts Vite (port 3000) + Express (port 3001)
```

Requires `claude` CLI installed and authenticated locally for the AI chat feature.

## Debugging

```bash
# Check if container is running
ssh n100w 'docker ps --filter name=llmlearn'

# Check container logs
ssh n100w 'docker logs llmlearn --tail 50'

# Check auto-update log
ssh n100w 'cat ~/llmlearn/update.log'

# Force rebuild
ssh n100w 'cd ~/llmlearn && HASH=$(git rev-parse --short HEAD) && NUM=$(git rev-list --count HEAD) && docker compose build --no-cache --build-arg COMMIT_HASH=$HASH --build-arg BUILD_NUM=$NUM && docker compose up -d'

# Test claude inside container
ssh n100w 'docker exec llmlearn claude -p "say hi"'
```

## Stack

- **Frontend**: React + Vite, dark theme, Pyodide (in-browser Python with torch shim)
- **Backend**: Express, `claude -p` for AI chat (streaming SSE), GitHub API for PR review
- **Infra**: Docker, Nginx Proxy Manager, oauth2-proxy, cron auto-deploy
- **Hosting**: n100w (192.168.0.7), `llm.thelittleone.rocks`
