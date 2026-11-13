# ==============================================================================
# scripts/docker-run.ps1 — Khởi chạy nhanh toàn bộ hệ thống bằng PowerShell (Windows)
# ==============================================================================
Write-Host ">>> [CDTN2 - Nhom 8] Khoi tao he thong FreelanceHub bang Docker Compose..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host ">>> Chua co tep .env, dang sao chep tu .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Write-Host ">>> Dang thuc thi: docker compose up -d --build..." -ForegroundColor Green
docker compose up -d --build

Write-Host ">>> Trang thai cac container dang hoat dong:" -ForegroundColor Cyan
docker compose ps

Write-Host ">>> He thong san sang tai:" -ForegroundColor Green
Write-Host "    - Frontend Web: http://localhost:3000" -ForegroundColor White
Write-Host "    - Backend API:  http://localhost:8080/api/v1/jobs" -ForegroundColor White
Write-Host "    - Swagger Docs: http://localhost:8080/swagger-ui.html" -ForegroundColor White

