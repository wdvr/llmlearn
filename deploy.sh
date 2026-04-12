#!/bin/bash
# Deploy llmlearn frontend to n100w (served via nginx + Nginx Proxy Manager)
# Note: This deploys only the static frontend build. The Claude AI chat feature
# requires the 'claude' CLI to be available locally and won't work in this deployment.
set -e

N100W="wouter@192.168.0.7"
REMOTE_DIR="/home/wouter/llmlearn"

# Build frontend
echo "Building frontend..."
npm run build:frontend

# Generate build info
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
BUILD_NUM=$(git rev-list --count HEAD 2>/dev/null || echo "0")
DEPLOY_TIME=$(date -u '+%Y-%m-%d %H:%M UTC')

cat > dist/build.json <<EOF
{"hash":"${COMMIT_HASH}","build":${BUILD_NUM},"deployed":"${DEPLOY_TIME}"}
EOF

echo "Deploying build #${BUILD_NUM} (${COMMIT_HASH})..."

# Create remote dir if needed
ssh "$N100W" "mkdir -p $REMOTE_DIR"

# Sync build output (using rsync with --delete to clean old files)
rsync -avz --delete dist/ "$N100W:$REMOTE_DIR/public/"

echo "Deploy complete! Live at https://llm.thelittleone.rocks"
