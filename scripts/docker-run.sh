#!/bin/bash
# ==============================================================================
# scripts/docker-run.sh — Khởi chạy nhanh toàn bộ hệ thống trên Linux / macOS
# ==============================================================================
set -e

echo ">>> [CDTN2 - Nhom 8] Khoi tao he thong FreelanceHub bang Docker Compose..."

if [ ! -f .env ]; then
    echo ">>> Chua co tep .env, dang sao chep tu .env.example..."
    cp .env.example .env
fi

echo ">>> Dang thuc thi: docker compose up -d --build..."
docker compose up -d --build

echo ">>> Trang thai cac container dang hoat dong:"
docker compose ps

echo ">>> He thong san sang tai:"
echo "    - Frontend Web: http://localhost:3000"
echo "    - Backend API:  http://localhost:8080/api/v1/jobs"
echo "    - Swagger Docs: http://localhost:8080/swagger-ui.html"

