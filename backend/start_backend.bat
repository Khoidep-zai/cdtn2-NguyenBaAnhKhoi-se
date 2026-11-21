@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"
cd /d "%~dp0"

set "PS_EXEC=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"

REM 1. Nap tu User Environment neu session chua co
if "%MAIL_USERNAME%"=="" for /f "usebackq delims=" %%i in (`"%PS_EXEC%" -NoProfile -Command "[System.Environment]::GetEnvironmentVariable('MAIL_USERNAME','User')"` ) do set "MAIL_USERNAME=%%i"
if "%MAIL_APP_PASSWORD%"=="" for /f "usebackq delims=" %%i in (`"%PS_EXEC%" -NoProfile -Command "[System.Environment]::GetEnvironmentVariable('MAIL_APP_PASSWORD','User')"` ) do set "MAIL_APP_PASSWORD=%%i"

REM 2. Nap tu file .env o thu muc goc neu co
if exist "%~dp0..\.env" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%~dp0..\.env") do (
        if "%%a"=="MAIL_USERNAME" if "%MAIL_USERNAME%"=="" set "MAIL_USERNAME=%%b"
        if "%%a"=="MAIL_APP_PASSWORD" if "%MAIL_APP_PASSWORD%"=="" set "MAIL_APP_PASSWORD=%%b"
    )
)

"C:\Users\windows\.m2\wrapper\dists\apache-maven-3.10.0\2aaba761688b1a6ea5a46e7e5f4d5406ed7a75ee8da95e5e3079863a23461c9b\bin\mvn.cmd" spring-boot:run -Dspring-boot.run.profiles=mysql
