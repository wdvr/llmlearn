#!/bin/bash
# Auto-update: pull latest, rebuild only if changed
# Intended to run via cron on n100w every 2 minutes
set -e

cd /home/wouter/llmlearn

# Fetch latest
git fetch origin master --quiet

# Check if there are new commits
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master)

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi

echo "$(date): Updating $LOCAL -> $REMOTE"
git pull --ff-only
docker compose up --build -d
docker image prune -f
echo "$(date): Deploy complete"
