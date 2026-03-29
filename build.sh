#!/usr/bin/env bash
set -e

echo "=== Building frontend ==="
cd frontend
npm install --include=dev
npm run build
cd ..

echo "=== Building backend ==="
cd backend
npm install --include=dev --legacy-peer-deps
npm run build
cd ..

echo "=== Build complete ==="
