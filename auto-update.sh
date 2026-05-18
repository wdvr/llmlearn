#!/usr/bin/env bash
# Auto-update: rebuild whenever HEAD differs from last deployed commit
# Cron setup (run once):
#   (crontab -l 2>/dev/null; echo '*/2 * * * * /bin/bash /home/wouter/llmlearn/auto-update.sh') | crontab -
set -e

cd /home/wouter/llmlearn
LOG="/home/wouter/llmlearn/update.log"
DEPLOYED_FILE="/home/wouter/llmlearn/.deployed-commit"

# Rotate log if > 500 lines
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 500 ]; then
  tail -100 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

# Fetch latest from origin (cheap if nothing changed).
git fetch origin master --quiet 2>/dev/null || true

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master)

# Fast-forward if origin has new commits and we're behind.
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Fetching ${LOCAL:0:7} -> ${REMOTE:0:7}" >> "$LOG"
  git pull --ff-only >> "$LOG" 2>&1
  LOCAL=$(git rev-parse HEAD)
fi

# If the deployed image's commit matches HEAD, nothing to do.
# (This is the fix: previous version only checked git remote sync, missing
# the case where commits are pushed from THIS machine — they're already
# local before cron runs, so LOCAL == REMOTE but the container still has
# the old build.)
DEPLOYED=""
[ -f "$DEPLOYED_FILE" ] && DEPLOYED=$(cat "$DEPLOYED_FILE")

if [ "$LOCAL" = "$DEPLOYED" ]; then
  exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rebuilding ${DEPLOYED:0:7} -> ${LOCAL:0:7}" >> "$LOG"

# Pass git info as build args so the frontend shows the correct version
HASH=$(git rev-parse --short HEAD)
NUM=$(git rev-list --count HEAD)
COMMIT_HASH=$HASH BUILD_NUM=$NUM docker compose build \
  --build-arg COMMIT_HASH=$HASH --build-arg BUILD_NUM=$NUM >> "$LOG" 2>&1

# Recreate cleanly. `docker compose down --remove-orphans` is *supposed* to
# tear everything down, but it has raced twice with `up -d` and left an
# orphaned hash-prefixed container blocking the recreate. Defensive sequence:
#   1. down --remove-orphans (graceful shutdown)
#   2. force-remove any container still bound to the name (handles the race)
#   3. up -d (clean creation)
# Each step swallows its own error so a missing container doesn't fail the
# script. The `up -d` exit code is checked — that's the one that matters.
docker compose down --remove-orphans >> "$LOG" 2>&1 || true
docker rm -f llmlearn >> "$LOG" 2>&1 || true
if ! docker compose up -d >> "$LOG" 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] docker compose up FAILED" >> "$LOG"
  # One more retry after a force-clean: sometimes a container is still
  # being created when up first runs.
  sleep 2
  docker rm -f llmlearn >> "$LOG" 2>&1 || true
  docker compose up -d >> "$LOG" 2>&1
fi
docker image prune -f >> "$LOG" 2>&1

# Record what we just deployed so we won't rebuild on the next cron tick.
echo "$LOCAL" > "$DEPLOYED_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy complete (commit ${LOCAL:0:7})" >> "$LOG"
