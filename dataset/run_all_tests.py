#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script chạy tổng hợp toàn bộ bài kiểm tra (Sprint 1 + Sprint 2 + End-to-End) - Nhóm 8
Chuyên đề tốt nghiệp 2 - ĐH Văn Lang
"""

import sys
import os
import subprocess

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    print("=" * 70)
    print("  CHẠY TỔNG HỢP TOÀN BỘ KIỂM THỬ HỆ THỐNG - NHÓM 8")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    s1_script = os.path.join(base_dir, "test_sprint1_demo.py")
    s2_script = os.path.join(base_dir, "test_sprint2_integration.py")

    print("\n--- CHẠY TEST SPRINT 1 ---")
    if os.path.exists(s1_script):
        subprocess.run([sys.executable, s1_script])
    else:
        print("  Không tìm thấy script test Sprint 1")

    print("\n--- CHẠY TEST SPRINT 2 ---")
    if os.path.exists(s2_script):
        subprocess.run([sys.executable, s2_script])
    else:
        print("  Không tìm thấy script test Sprint 2")

    print("\n" + "=" * 70)
    print("  HOÀN THÀNH TỔNG DUYỆT KIỂM THỬ BUỔI 8!")
    print("=" * 70)

if __name__ == "__main__":
    main()
