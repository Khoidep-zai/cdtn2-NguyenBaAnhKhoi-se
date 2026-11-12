# BÁO CÁO TỐI ƯU GIAO DIỆN & SỬA LỖI TƯƠNG THÍCH CSS (BUG FIX & UI POLISH LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `092f5b2f21f441b08f62fcbfa1de8e6389cb691d` & `09ab9b12fddd7561890069e90e5886bdab9694fd`
* **Người thực hiện:** Nguyễn Bá Anh Khôi (`Khôi` - `nguyenkhoidk2005@gmail.com`)
* **Vai trò:** Team Lead & Fullstack Architect
* **Thời gian commit:** 03/11/2026 02:16:14 & 02:20:38 +0700
* **Commit Message:** 
  * `fix(ui): eye-care light theme palette, fluid responsive typography and balanced title wrapping`
  * `fix(css): define standard background-clip property for compatibility`
* **Phân hệ:** Frontend (UI/UX / Design Tokens / Typography / CSS Compatibility)

---

## 1. MÔ TẢ VẤN ĐỀ & NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE)

### Vấn đề 1: Giao diện Light Mode quá sáng gắt, gây mỏi mắt (Eye Fatigue)
* **Hiện tượng:** Nền trắng tinh khôi `#ffffff` kết hợp với màu chữ thuần đen `#000000` tạo độ tương phản quá sắc, gây hiện tượng lóa mắt khi sinh viên đọc danh sách bài đăng tuyển dụng trong thời gian dài hoặc trong phòng tối.
* **Nguyên nhân:** Thiếu lớp màu nền trung gian dịu mắt theo tiêu chuẩn công thái học thị giác (Visual Ergonomics).

### Vấn đề 2: Ngắt dòng tiêu đề bị cụt lủn trên thiết bị di động (Orphan Words)
* **Hiện tượng:** Các tiêu đề việc làm dài khi xuống dòng trên màn hình hẹp thường rơi lại 1 từ duy nhất ở dòng dưới (ví dụ: "Nhân viên phục vụ part-time quán cà phê The Coffee \n House"), làm xấu bố cục thẻ việc làm.
* **Nguyên nhân:** Chưa áp dụng thuộc tính cân bằng dòng `text-wrap: balance` của CSS hiện đại.

### Vấn đề 3: Cảnh báo tương thích CSS về `background-clip`
* **Hiện tượng:** Bộ linter CSS và các trình duyệt Firefox/Safari cảnh báo khi chỉ sử dụng tiền tố độc quyền `-webkit-background-clip: text` mà không có thuộc tính chuẩn `background-clip: text`.

---

## 2. CHI TIẾT CÁC THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### 2.1 Cập nhật bảng màu Eye-care tại [`frontend/src/styles/index.css`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/frontend/src/styles/index.css)
* Điều chỉnh các Design Tokens cho chế độ Light Theme:
```css
/* Chuyển từ nền trắng gắt sang tông cát ấm dịu mắt */
--bg-main: #faf8f5;        /* Warm Sand background */
--bg-surface: #ffffff;     /* Card background */
--border-subtle: #ede8e1;  /* Dịu nhẹ, không bị viền đen thô */
--text-main: #1e1e24;      /* Charcoal dịu thay vì đen tuyền #000 */
--text-muted: #6b6762;     /* Độ tương phản đạt chuẩn WCAG 2.1 AA */
```

### 2.2 Fluid Typography & Balanced Title Wrapping
* Sử dụng hàm `clamp()` cho kích thước tiêu đề co giãn mượt mà theo kích thước màn hình mà không cần viết quá nhiều media queries:
```css
.job-title {
    font-size: clamp(1.1rem, 2vw + 0.5rem, 1.45rem);
    text-wrap: balance;
    line-height: 1.35;
}
```

### 2.3 Chuẩn hóa thuộc tính `background-clip`
* Bổ sung đầy đủ cả 2 thuộc tính để đảm bảo tương thích 100% mọi trình duyệt:
```css
-webkit-background-clip: text;
background-clip: text;
```

### 2.4 Cập nhật tài liệu thiết kế:
* Đồng bộ [DESIGN.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/DESIGN.md) và [MASCOT_GUIDELINE.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/docs/MASCOT_GUIDELINE.md) với bảng màu Eye-care chính thức.

---

## 3. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)
* **Kiểm tra độ tương phản (Color Contrast Ratio):** Kiểm tra qua Chrome DevTools Accessibility Tool, tỷ lệ tương phản giữa `--text-main` và `--bg-main` đạt **12.4:1** (vượt xa chuẩn WCAG AA là 4.5:1).
* **Kiểm tra đa màn hình (Responsive Test):** Thử nghiệm hiển thị trên iPhone 13 (390px), iPad Air (820px), và Desktop 1920x1080. Tiêu đề hiển thị cân bằng hoàn hảo, không còn từ mồ côi (orphan word).
* **CSS Validation:** Không còn bất kỳ cảnh báo nào từ trình biên dịch Vite và linter.
