@echo off
chcp 65001 >nul
title FreelanceHub - He thong viec lam sinh vien (Nhom 8)

echo ========================================================================
echo   🚀 FREELANCEHUB - CHUYEN DE TOT NGHIEP 2 (NHOM 8 - DH VAN LANG)
echo ========================================================================
echo.
echo [1/3] Dang khoi dong Backend Spring Boot (Port 8080)...
start "Backend - Spring Boot (Port 8080)" cmd /c "cd /d "%~dp0backend" && mvn spring-boot:run"

echo [2/3] Dang khoi dong Frontend React Vite (Port 3000)...
start "Frontend - React Vite (Port 3000)" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo [3/3] Dang cho he thong san sang va mo trinh duyet...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo ========================================================================
echo   ✅ HE THONG DA DUOC KHOI DONG THANH CONG!
echo.
echo   🌐 Ung dung Frontend:   http://localhost:3000
echo   🔌 Backend API:          http://localhost:8080/api/v1
echo   📖 Swagger UI API Docs:  http://localhost:8080/api/v1/swagger-ui.html
echo   🗄️ H2 Database Console:  http://localhost:8080/api/v1/h2-console
echo.
echo   🔑 Tai khoan demo:
echo    - Admin:     admin@freelancehub.vn / Password123@
echo    - NTD:       recruiter@thecoffee.vn / Password123@
echo    - Sinh vien: sinhvien.khoi@vanlanguni.vn / Password123@
echo ========================================================================
echo.
echo Nhan phim bat ky de dong cua so console nay...
pause >nul
