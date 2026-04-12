#!/bin/bash
# Deploy llmlearn to n100w via Docker
# Usage: ./deploy.sh
set -e

REGISTRY="docker.thelittleone.rocks"
IMAGE="${REGISTRY}/llmlearn"
N100W="wouter@192.168.0.7"

TAG=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")

echo "=== Building Docker image (${IMAGE}:${TAG}) ==="
docker build -t "${IMAGE}:${TAG}" -t "${IMAGE}:latest" .

echo ""
echo "=== Pushing to registry ==="
docker push "${IMAGE}:${TAG}"
docker push "${IMAGE}:latest"

echo ""
echo "=== Deploying on n100w ==="
ssh "$N100W" "
  mkdir -p ~/llmlearn
  cd ~/llmlearn

  # Write/update compose file
  cat > docker-compose.yml << 'COMPOSE'
services:
  llmlearn:
    image: ${IMAGE}:latest
    container_name: llmlearn
    restart: unless-stopped
    ports:
      - \"3080:80\"
COMPOSE

  docker pull ${IMAGE}:latest
  docker compose up -d --force-recreate
  echo 'Container running:'
  docker ps --filter name=llmlearn --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
"

echo ""
echo "=== Done! Live at https://llm.thelittleone.rocks ==="
