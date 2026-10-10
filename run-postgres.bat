@echo off
chcp 65001 >nul
title FreelanceHub - He thong viec lam sinh vien (Nhom 8) - Che do PostgreSQL

echo ========================================================================
echo   🚀 FREELANCEHUB - CHUYEN DE TOT NGHIEP 2 (NHOM 8 - DH VAN LANG)
echo   🗄️ CSDL: PostgreSQL (Port: 5433/5432 - User: postgres - Pass: 12345)
echo ========================================================================
echo.

REM Kiem tra JAVA_HOME neu chua co trong PATH
if "%JAVA_HOME%"=="" (
    if exist "C:\Users\nguye\.jdks\ms-21.0.11" set "JAVA_HOME=C:\Users\nguye\.jdks\ms-21.0.11"
    if exist "C:\Program Files\Java\jdk-17" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    if exist "C:\Program Files\Java\jdk-21" set "JAVA_HOME=C:\Program Files\Java\jdk-21"
)

REM Kiem tra Maven
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "MVN_EXEC=mvn"
) else (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.2\plugins\maven\lib\maven3\bin\mvn.cmd" (
        set "MVN_EXEC="C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.2\plugins\maven\lib\maven3\bin\mvn.cmd""
    ) else (
        set "MVN_EXEC=mvn"
    )
)

echo [1/2] Dang khoi dong Backend Spring Boot voi profile PostgreSQL...
cd /d "%~dp0backend"
start "Backend - Spring Boot (PostgreSQL)" cmd /c "title Backend Spring Boot (PostgreSQL) && %MVN_EXEC% spring-boot:run -Dspring-boot.run.profiles=postgres"

echo [2/2] Frontend va trinh duyet se duoc tu dong khoi dong boi Backend!
echo.
echo ========================================================================
echo   ✅ HE THONG DANG KHOI DONG THANH CONG!
echo.
echo   🌐 Ung dung Frontend:   http://localhost:3000
echo   🔌 Backend API:          http://localhost:8080/api/v1
echo   📖 Swagger UI API Docs:  http://localhost:8080/api/v1/swagger-ui.html
echo.
echo   🔑 Tai khoan demo (Mat khau: Password123@):
echo    - Admin:     admin@freelancehub.vn
echo    - NTD:       recruiter@thecoffee.vn
echo    - Sinh vien: sinhvien.khoi@vanlanguni.vn
echo ========================================================================
echo.
echo Nhan phim bat ky de dong cua so console nay...
pause >nul
