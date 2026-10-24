@echo off
chcp 65001 > nul
echo =====================================================================
echo   CHẠY KIỂM THỬ TÍCH HỢP END-TO-END SPRINT 2 (BUỔI 7) - NHÓM 8
echo =====================================================================
python "%~dp0dataset\test_sprint2_integration.py"
pause
