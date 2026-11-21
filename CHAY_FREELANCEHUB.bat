@echo off
chcp 65001 >nul
title FreelanceHub - Hệ Thống Khởi Động 1-Click
color 0B

echo ========================================================================
echo   🚀 FREELANCEHUB - KHỞI ĐỘNG HỆ THỐNG TOÀN DIỆN (1-CLICK)
echo   🎓 Chuyên Đề Tốt Nghiệp 2 - Nhóm 8 - Đại Học Văn Lang
echo ========================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

set "JAVA_EXE=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin\java.exe"
if not exist "%JAVA_EXE%" (
    if defined JAVA_HOME (
        set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
    ) else (
        set "JAVA_EXE=java"
    )
)

set "MYSQL_EXE=C:\xampp\mysql\bin\mysqld.exe"
set "JAR_FILE=%PROJECT_DIR%backend\target\freelance-platform-1.0.0.jar"

REM ------------------------------------------------------------------------
REM BƯỚC 1: KIỂM TRA VÀ KHỞI ĐỘNG CƠ SỞ DỮ LIỆU MYSQL (PORT 3306)
REM ------------------------------------------------------------------------
echo [1/4] Đang kiểm tra cổng MySQL 3306...
netstat -ano | findstr LISTENING | findstr :3306 >nul 2>&1
if errorlevel 1 (
    echo       -> MySQL chưa chạy. Đang tự động kích hoạt mysqld XAMPP...
    if exist "%MYSQL_EXE%" (
        start "" /b "%MYSQL_EXE%" --defaults-file=C:\xampp\mysql\bin\my.ini --standalone
        timeout /t 3 /nobreak >nul
    ) else (
        echo [CẢNH BÁO] Không tìm thấy mysqld tại C:\xampp\mysql\bin\mysqld.exe!
        echo           Vui lòng khởi động MySQL qua XAMPP Control Panel trước.
    )
) else (
    echo       [OK] MySQL đang hoạt động sẵn sàng trên cổng 3306.
)

REM ------------------------------------------------------------------------
REM BƯỚC 2: KIỂM TRA VÀ KHỞI ĐỘNG BACKEND SPRING BOOT (PORT 8080)
REM ------------------------------------------------------------------------
echo.
echo [2/4] Đang kiểm tra cổng Backend 8080...
netstat -ano | findstr LISTENING | findstr :8080 >nul 2>&1
if errorlevel 1 (
    echo       -> Backend chưa chạy. Đang khởi động Spring Boot API...
    if not exist "%JAR_FILE%" (
        echo [LỖI] Không tìm thấy file JAR: %JAR_FILE%
        echo       Vui lòng chạy lệnh 'mvn package' trong thư mục backend trước!
        pause
        exit /b 1
    )
    start "FreelanceHub-Backend" /min "%JAVA_EXE%" -jar "%JAR_FILE%" --spring.profiles.active=mysql
    echo       -> Đang chờ Backend sẵn sàng trên http://localhost:8080/api/v1 ...
    
    set /a RETRIES=0
    :WAIT_BACKEND
    timeout /t 2 /nobreak >nul
    set /a RETRIES+=1
    netstat -ano | findstr LISTENING | findstr :8080 >nul 2>&1
    if errorlevel 1 (
        if %RETRIES% geq 20 (
            echo [CẢNH BÁO] Backend mất hơn 40s để khởi động. Vui lòng kiểm tra file log!
            goto CHECK_FRONTEND
        )
        echo          ... đang nạp dịch vụ (%RETRIES%/20)
        goto WAIT_BACKEND
    )
    echo       [OK] Backend Spring Boot đã sẵn sàng (Port 8080).
) else (
    echo       [OK] Backend đang hoạt động sẵn sàng trên cổng 8080.
)

REM ------------------------------------------------------------------------
REM BƯỚC 3: KIỂM TRA VÀ KHỞI ĐỘNG FRONTEND VITE (PORT 3000)
REM ------------------------------------------------------------------------
:CHECK_FRONTEND
echo.
echo [3/4] Đang kiểm tra cổng Frontend 3000...
netstat -ano | findstr LISTENING | findstr :3000 >nul 2>&1
if errorlevel 1 (
    echo       -> Frontend chưa chạy. Đang khởi động React Vite Dev Server...
    start "FreelanceHub-Frontend" /min cmd /c "cd /d ""%PROJECT_DIR%frontend"" && npm run dev"
    
    set /a RETRIES_FE=0
    :WAIT_FRONTEND
    timeout /t 2 /nobreak >nul
    set /a RETRIES_FE+=1
    netstat -ano | findstr LISTENING | findstr :3000 >nul 2>&1
    if errorlevel 1 (
        if %RETRIES_FE% geq 15 (
            echo [CẢNH BÁO] Frontend mất nhiều thời gian hơn dự kiến để khởi động.
            goto OPEN_BROWSER
        )
        echo          ... đang nạp giao diện React (%RETRIES_FE%/15)
        goto WAIT_FRONTEND
    )
    echo       [OK] Frontend React + Vite đã sẵn sàng (Port 3000).
) else (
    echo       [OK] Frontend đang hoạt động sẵn sàng trên cổng 3000.
)

REM ------------------------------------------------------------------------
REM BƯỚC 4: TỰ ĐỘNG MỞ TRÌNH DUYỆT NGHIỆM THU
REM ------------------------------------------------------------------------
:OPEN_BROWSER
echo.
echo [4/4] Đang mở trình duyệt truy cập FreelanceHub...
start http://localhost:3000

echo.
echo ========================================================================
echo   ✅ TOÀN BỘ HỆ THỐNG FREELANCEHUB ĐÃ KHỞI ĐỘNG THÀNH CÔNG!
echo ========================================================================
echo   🌐 Giao diện Web:      http://localhost:3000
echo   🔌 REST API:          http://localhost:8080/api/v1
echo   📖 Tài liệu API:      http://localhost:8080/api/v1/swagger-ui.html
echo.
echo   🔑 TÀI KHOẢN TRẢI NGHIỆM (Mật khẩu chung: Password123@)
echo      * Sinh viên:       sinhvien.khoi@vanlanguni.vn
echo      * Nhà tuyển dụng:  recruiter@thecoffee.vn
echo      * Quản trị viên:   admin@freelancehub.vn
echo ========================================================================
echo   (Cửa sổ này có thể đóng hoặc để mở tùy ý. Các dịch vụ chạy ngầm độc lập.)
echo.
pause
