#!/usr/bin/env bash
# Auto-update: pull latest, rebuild only if changed
# Cron setup (run once):
#   (crontab -l 2>/dev/null; echo '*/2 * * * * /bin/bash /home/wouter/llmlearn/auto-update.sh') | crontab -
set -e

cd /home/wouter/llmlearn
LOG="/home/wouter/llmlearn/update.log"

# Rotate log if > 500 lines
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 500 ]; then
  tail -100 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

# Fetch latest
git fetch origin master --quiet 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master)

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Updating ${LOCAL:0:7} -> ${REMOTE:0:7}" >> "$LOG"
git pull --ff-only >> "$LOG" 2>&1
docker compose up --build -d >> "$LOG" 2>&1
docker image prune -f >> "$LOG" 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy complete" >> "$LOG"
