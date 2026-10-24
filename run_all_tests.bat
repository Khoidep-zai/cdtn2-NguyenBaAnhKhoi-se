@echo off
chcp 65001 > nul
echo =====================================================================
echo   CHẠY TỔNG HỢP KIỂM THỬ HỆ THỐNG (BUỔI 8) - NHÓM 8
echo =====================================================================
python "%~dp0dataset\run_all_tests.py"
pause
