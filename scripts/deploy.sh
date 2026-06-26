#!/usr/bin/env bash
# Pull latest, install, rebuild, and zero-downtime reload on the VPS.
#   bash scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Pulling latest…"
git pull origin main

echo "→ Installing deps…"
npm ci

echo "→ Building…"
npm run build

echo "→ Reloading PM2…"
pm2 reload ecosystem.config.js --update-env

echo "✓ Deployed."
