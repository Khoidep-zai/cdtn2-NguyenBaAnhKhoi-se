# API Contracts: Part-time P0 Gap Completion & Student Safety

**Feature**: `001-parttime-p0-completion`  
**Date**: 2026-11-06  
**Status**: Completed  
**Base URL**: `/api/v1` (tương thích `/api/v1` và route controller hiện tại)

---

## 1. Admin Job Moderation API (Kiểm duyệt tin tuyển dụng)

### 1.1. Lấy danh sách tin chờ duyệt
*   **Method**: `GET`
*   **Path**: `/admin/jobs/pending`
*   **Quyền hạn**: `ROLE_ADMIN`
*   **Query Parameters**:
    *   `page` (int, default: 0)
    *   `size` (int, default: 10)
*   **Response 200 OK**:
    ```json
    {
      "success": true,
      "message": "Lấy danh sách tin chờ duyệt thành công",
      "data": {
        "content": [
          {
            "id": 1471,
            "title": "Nhân viên phục vụ part-time ca tối",
            "employer": {
              "id": 5,
              "fullName": "The Coffee House",
              "companyName": "The Coffee House VN",
              "email": "hr@coffeehouse.vn"
            },
            "category": { "id": 1, "name": "F&B / Phục vụ" },
            "salaryType": "HOURLY",
            "salaryAmount": 28000,
            "salaryText": "28.000đ/giờ",
            "shiftType": "EVENING",
            "workingHours": "18:00 - 22:30",
            "location": "Quận 1, TP.HCM",
            "status": "PENDING_REVIEW",
            "createdAt": "2026-11-06T17:30:00"
          }
        ],
        "totalElements": 1,
        "totalPages": 1,
        "number": 0
      },
      "errors": null,
      "timestamp": "2026-11-06T17:45:00"
    }
    ```

### 1.2. Phê duyệt hoặc từ chối tin tuyển dụng
*   **Method**: `PATCH`
*   **Path**: `/admin/jobs/{id}/review`
*   **Quyền hạn**: `ROLE_ADMIN`
*   **Request Body**:
    ```json
    {
      "action": "APPROVE", // APPROVE hoặc REJECT
      "rejectionReason": "Thông tin mức lương không rõ ràng" // Bắt buộc nếu action = REJECT
    }
    ```
*   **Response 200 OK**:
    ```json
    {
      "success": true,
      "message": "Phê duyệt tin tuyển dụng thành công!",
      "data": {
        "id": 1471,
        "status": "OPEN", // hoặc REJECTED
        "rejectionReason": null
      },
      "errors": null,
      "timestamp": "2026-11-06T17:45:10"
    }
    ```

---

## 2. Scam Report & Safety API (Báo cáo vi phạm & Cảnh báo an toàn)

### 2.1. Người dùng gửi báo cáo tin tuyển dụng vi phạm
*   **Method**: `POST`
*   **Path**: `/reports`
*   **Quyền hạn**: Đã đăng nhập (`ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`)
*   **Request Body**:
    ```json
    {
      "jobId": 1471,
      "reason": "SCAM_DEPOSIT", // SCAM_DEPOSIT, FALSE_INFO, INAPPROPRIATE, OTHER
      "description": "Nhà tuyển dụng yêu cầu nộp 200k tiền đặt cọc giữ đồng phục."
    }
    ```
*   **Response 201 Created**:
    ```json
    {
      "success": true,
      "message": "Gửi báo cáo vi phạm thành công. Ban quản trị sẽ xác minh trong vòng 24h.",
      "data": {
        "id": 12,
        "jobId": 1471,
        "reason": "SCAM_DEPOSIT",
        "status": "PENDING",
        "createdAt": "2026-11-06T17:46:00"
      },
      "errors": null,
      "timestamp": "2026-11-06T17:46:00"
    }
    ```
*   **Response 400 Bad Request** (khi gửi báo cáo lặp):
    ```json
    {
      "success": false,
      "message": "Bạn đã gửi một báo cáo đang chờ xử lý cho công việc này.",
      "data": null,
      "errors": ["DUPLICATE_REPORT"],
      "timestamp": "2026-11-06T17:46:05"
    }
    ```

### 2.2. Admin xem danh sách báo cáo vi phạm
*   **Method**: `GET`
*   **Path**: `/admin/reports`
*   **Quyền hạn**: `ROLE_ADMIN`
*   **Query Parameters**: `status` (PENDING, RESOLVED, DISMISSED, optional), `page`, `size`
*   **Response 200 OK**:
    ```json
    {
      "success": true,
      "message": "Lấy danh sách phản ánh thành công",
      "data": {
        "content": [
          {
            "id": 12,
            "job": { "id": 1471, "title": "Nhân viên phục vụ part-time ca tối" },
            "reporter": { "id": 8, "fullName": "Nguyễn Văn Sinh Viên", "email": "student@vanlanguni.vn" },
            "reason": "SCAM_DEPOSIT",
            "description": "Nhà tuyển dụng yêu cầu nộp 200k tiền cọc đồng phục.",
            "status": "PENDING",
            "createdAt": "2026-11-06T17:46:00"
          }
        ]
      }
    }
    ```

### 2.3. Admin xử lý báo cáo vi phạm
*   **Method**: `PATCH`
*   **Path**: `/admin/reports/{id}/resolve`
*   **Quyền hạn**: `ROLE_ADMIN`
*   **Request Body**:
    ```json
    {
      "action": "RESOLVE_BAN_JOB", // DISMISS, RESOLVE_BAN_JOB, RESOLVE_BAN_EMPLOYER
      "resolutionNotes": "Xác nhận tin thu tiền cọc bất hợp pháp. Đã gỡ tin."
    }
    ```
*   **Response 200 OK**:
    ```json
    {
      "success": true,
      "message": "Xử lý báo cáo thành công",
      "data": {
        "id": 12,
        "status": "RESOLVED",
        "resolutionNotes": "Xác nhận tin thu tiền cọc bất hợp pháp. Đã gỡ tin."
      }
    }
    ```

---

## 3. Shift Standardization & Quick Filter API

### 3.1. Tìm kiếm và lọc theo ca làm việc
*   **Method**: `GET`
*   **Path**: `/jobs`
*   **Quyền hạn**: Public (permitAll)
*   **Query Parameters bổ sung**:
    *   `shiftType` (string: `MORNING`, `AFTERNOON`, `EVENING`, `WEEKEND`, `FLEXIBLE`, optional)
*   **Response 200 OK**: Trả về danh sách công việc lọc chính xác theo ca làm việc đã chọn.

### 3.2. Nhà tuyển dụng tạo tin kèm ca làm việc
*   **Method**: `POST`
*   **Path**: `/jobs`
*   **Quyền hạn**: `ROLE_EMPLOYER`, `ROLE_ADMIN`
*   **Request Body mở rộng**:
    ```json
    {
      "title": "Nhân viên thu ngân Part-time",
      "categoryId": 2,
      "jobType": "PART_TIME",
      "workMode": "ONSITE",
      "shiftType": "EVENING", // NEW: MORNING, AFTERNOON, EVENING, WEEKEND, FLEXIBLE
      "workingHours": "Ca tối: 17h30 - 22h00",
      "salaryType": "HOURLY",
      "salaryAmount": 26000,
      "salaryText": "26.000đ/giờ",
      "province": "Hồ Chí Minh",
      "location": "Quận Bình Thạnh",
      "benefits": "Bao cơm, hỗ trợ gửi xe",
      "studentFriendly": true,
      "slotsAvailable": 2
    }
    ```

---

## 4. Password Recovery API (Quên & Đặt lại mật khẩu)

### 4.1. Yêu cầu đặt lại mật khẩu
*   **Method**: `POST`
*   **Path**: `/auth/forgot-password`
*   **Quyền hạn**: Public
*   **Request Body**:
    ```json
    {
      "email": "student@vanlanguni.vn"
    }
    ```
*   **Response 200 OK** (Bảo mật - Không tiết lộ tồn tại email):
    ```json
    {
      "success": true,
      "message": "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn.",
      "data": {
        "email": "student@vanlanguni.vn",
        "resetTokenPreview": "9f8b4c2a-7d1e-4b3f-8a2c-5e6f7a8b9c0d" // Chỉ hiển thị trong dev profile
      },
      "errors": null,
      "timestamp": "2026-11-06T17:47:00"
    }
    ```

### 4.2. Đặt lại mật khẩu với Token
*   **Method**: `POST`
*   **Path**: `/auth/reset-password`
*   **Quyền hạn**: Public
*   **Request Body**:
    ```json
    {
      "token": "9f8b4c2a-7d1e-4b3f-8a2c-5e6f7a8b9c0d",
      "newPassword": "newSecurePassword123"
    }
    ```
*   **Response 200 OK**:
    ```json
    {
      "success": true,
      "message": "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.",
      "data": null,
      "errors": null,
      "timestamp": "2026-11-06T17:48:00"
    }
    ```

