#!/bin/bash
# Deploy: SSH to n100w, pull latest, rebuild container
# Usage: git push && ./deploy.sh
set -e

N100W="wouter@192.168.0.7"
REPO="git@github.com:wdvr/llmlearn.git"
REMOTE_DIR="/home/wouter/llmlearn"

echo "=== Deploying to n100w ==="
ssh "$N100W" "
  set -e

  # Clone or pull
  if [ -d ${REMOTE_DIR}/.git ]; then
    cd ${REMOTE_DIR}
    git pull --ff-only
  elif [ -d ${REMOTE_DIR} ]; then
    # Old non-git deploy exists, nuke it and clone fresh
    rm -rf ${REMOTE_DIR}
    git clone ${REPO} ${REMOTE_DIR}
    cd ${REMOTE_DIR}
  else
    git clone ${REPO} ${REMOTE_DIR}
    cd ${REMOTE_DIR}
  fi

  # Build and restart
  docker compose up --build -d

  # Clean up old images
  docker image prune -f

  echo ''
  docker ps --filter name=llmlearn --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
"

echo ""
echo "=== Done! https://llm.thelittleone.rocks ==="
