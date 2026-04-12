#!/bin/bash
# One-shot setup: create GitHub repo, deploy to n100w, configure nginx
# Run this ONCE from your Mac: cd ~/dev/llmlearn && bash setup-and-deploy.sh
set -e

N100W="wouter@192.168.0.7"
DOMAIN="llm.thelittleone.rocks"

echo "=== Step 1: GitHub repo ==="
if ! git remote get-url origin &>/dev/null; then
  echo "Creating private GitHub repo..."
  gh repo create llmlearn --private --source=. --push
else
  echo "Remote already set: $(git remote get-url origin)"
  git push -u origin master
fi

echo ""
echo "=== Step 2: Build frontend ==="
npm run build:frontend

COMMIT_HASH=$(git rev-parse --short HEAD)
BUILD_NUM=$(git rev-list --count HEAD)
DEPLOY_TIME=$(date -u '+%Y-%m-%d %H:%M UTC')
cat > dist/build.json <<EOF
{"hash":"${COMMIT_HASH}","build":${BUILD_NUM},"deployed":"${DEPLOY_TIME}"}
EOF

echo ""
echo "=== Step 3: Deploy to n100w ==="
ssh "$N100W" "mkdir -p /home/wouter/llmlearn"
rsync -avz --delete dist/ "$N100W:/home/wouter/llmlearn/"
echo "Files synced to n100w:/home/wouter/llmlearn/"

echo ""
echo "=== Step 4: Set up nginx on n100w ==="
# Copy nginx config and set it up
ssh "$N100W" "cat > /tmp/llmlearn.conf << 'NGINX'
server {
    listen 3080;
    root /home/wouter/llmlearn;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # No caching for index.html (cache busting)
    location = /index.html {
        add_header Cache-Control \"no-cache, no-store, must-revalidate\";
    }
}
NGINX
"

# Check if nginx sites dir exists, otherwise use conf.d
ssh "$N100W" "
if [ -d /etc/nginx/sites-available ]; then
  sudo cp /tmp/llmlearn.conf /etc/nginx/sites-available/llmlearn
  sudo ln -sf /etc/nginx/sites-available/llmlearn /etc/nginx/sites-enabled/llmlearn
elif [ -d /etc/nginx/conf.d ]; then
  sudo cp /tmp/llmlearn.conf /etc/nginx/conf.d/llmlearn.conf
fi
sudo nginx -t && sudo systemctl reload nginx
echo 'Nginx configured and reloaded'
" 2>&1 || echo "NOTE: If nginx isn't installed, use Nginx Proxy Manager instead (see below)"

echo ""
echo "=== Step 5: Add GitHub Actions SSH key ==="
echo "To enable auto-deploy on push:"
echo "  1. Go to https://github.com/$(gh api user -q .login)/llmlearn/settings/secrets/actions"
echo "  2. Add secret N100W_SSH_KEY with your SSH private key for n100w"
echo ""
echo "=== Done! ==="
echo "Your app should be live at https://${DOMAIN}"
echo ""
echo "If using Nginx Proxy Manager instead of raw nginx:"
echo "  - Add Proxy Host: ${DOMAIN} → http://localhost:3080"
echo "  - Enable SSL with Let's Encrypt"
echo "  - Custom Nginx config for SPA: location / { try_files \$uri /index.html; }"
