# 🎨 FreelanceHub Design System (DESIGN.md)

> **Dự án:** Nền tảng Quản lý Freelance & Marketplace Việc làm Sinh viên (Nhóm 8 - ĐH Văn Lang)  
> **Phiên bản:** v1.2.0 (Design System Spec)  
> **Ngôn ngữ thiết kế:** Semantic Modern Student-Centric Interface  

---

## 1. Triết lý Thiết kế & Định vị Thương hiệu (Brand & Design Philosophy)

FreelanceHub được xây dựng dành riêng cho đối tượng sinh viên đại học (đặc biệt là sinh viên Văn Lang) và các nhà tuyển dụng đối tác uy tín. Thiết kế hướng đến:
* **Tính tin cậy & Minh bạch (Trust & Transparency):** Thông tin lương thưởng, quyền lợi, chế độ làm việc và đánh giá hai chiều được hiển thị trực quan, trung thực.
* **Tươi trẻ & Truyền cảm hứng (Energetic & Student-Friendly):** Tông màu Indigo kết hợp Cyan mang lại cảm giác năng động, hiện đại của công nghệ và tinh thần khởi nghiệp sinh viên.
* **Đồng nhất Đa nền tảng & Đa giao diện:** Trải nghiệm chuyển đổi mượt mà giữa chế độ Sáng (Light Mode) và Tối (Dark Mode) cùng hỗ trợ song ngữ Việt — Anh.

---

## 2. Hệ Thống Màu Sắc (Color Tokens)

### 2.1. Bảng màu Cốt lõi (Core Palette)
| Token | Light Mode Hex | Dark Mode Hex | Ý nghĩa sử dụng |
| :--- | :--- | :--- | :--- |
| `--primary` | `#4F46E5` (Indigo-600) | `#6366F1` (Indigo-500) | Màu thương hiệu chủ đạo, CTA buttons, active state |
| `--primary-hover` | `#4338CA` (Indigo-700) | `#4F46E5` (Indigo-600) | Trạng thái hover của các nút chính |
| `--primary-light` | `#EEF2FF` (Indigo-50) | `#1E1B4B` (Indigo-950) | Nền highlight nhẹ, badge nền phụ |
| `--secondary` | `#06B6D4` (Cyan-500) | `#22D3EE` (Cyan-400) | Điểm nhấn gradient, nhãn tính năng công nghệ |
| `--accent` | `#F59E0B` (Amber-500) | `#FBBF24` (Amber-400) | Huy hiệu nổi bật, đánh giá sao, freelancer tip |
| `--success` | `#10B981` (Emerald-500) | `#34D399` (Emerald-400) | Trạng thái OPEN, đơn ứng tuyển thành công, việc thân thiện sinh viên |
| `--warning` | `#F59E0B` (Amber-500) | `#FBBF24` (Amber-400) | Hạn chót sắp hết, cảnh báo trạng thái tin |
| `--danger` | `#EF4444` (Red-500) | `#F87171` (Red-400) | Hủy việc, từ chối đơn, thông báo lỗi validation |

### 2.2. Bảng màu Bề mặt & Nền (Surfaces & Backgrounds)
| Token | Light Mode | Dark Mode | Vai trò |
| :--- | :--- | :--- | :--- |
| `--bg-main` | `#F8FAFC` (Slate-50) | `#0B0F19` (Deep Navy/Black) | Nền toàn trang web |
| `--bg-card` | `#FFFFFF` | `#111827` (Gray-900) | Nền card việc làm, form đăng ký, panel |
| `--bg-card-subtle` | `#F1F5F9` (Slate-100) | `#1F2937` (Gray-800) | Nền input, header bảng, hover panel |
| `--bg-navbar` | `rgba(255, 255, 255, 0.85)` | `rgba(17, 24, 39, 0.88)` | Thanh điều hướng kính mờ (blur backdrop) |
| `--border-color` | `#E2E8F0` (Slate-200) | `#374151` (Gray-700) | Đường phân cách, viền card |
| `--border-focus` | `#818CF8` (Indigo-400) | `#6366F1` (Indigo-500) | Trạng thái focus bàn phím & input |

---

## 3. Hệ Thống Kiểu Chữ (Typography Scale)

* **Font chữ chính:** `Plus Jakarta Sans`, sans-serif (Google Fonts).
* **Font thay thế dự phòng:** `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.

| Cấp bậc | Cỡ chữ (Size) | Trọng lượng (Weight) | Chiều cao dòng (Line Height) | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `clamp(2rem, 5vw, 3.25rem)` | 800 (ExtraBold) | 1.15 | Tiêu đề chính trang chủ |
| **Heading 1** | `1.85rem` (29.6px) | 800 (ExtraBold) | 1.25 | Tiêu đề trang (Dashboard, JobDetail, Login) |
| **Heading 2** | `1.5rem` (24px) | 700 (Bold) | 1.3 | Tiêu đề phân mục lớn, section title |
| **Heading 3** | `1.15rem` (18.4px) | 700 (Bold) | 1.4 | Tiêu đề việc làm trong JobCard |
| **Body (Thường)** | `0.95rem` (15.2px) | 400 (Regular) / 500 (Medium) | 1.5 | Nội dung mô tả việc, văn bản chính |
| **Small / Caption** | `0.8rem` (12.8px) | 600 (SemiBold) | 1.4 | Nhãn badge, metadata, thời gian |

---

## 4. Hệ Thống Thành Phần Giao Diện (Component Library)

### 4.1. Nút bấm (Buttons)
* **Primary Button (`.btn-primary`):** Nền Indigo gradient, chữ trắng, độ bo góc `--radius-md` (10px), hiệu ứng hover nâng cao 1px kèm bóng sáng `--shadow-glow`.
* **Secondary Button (`.btn-secondary`):** Nền thẻ, viền tinh tế, hover đổi màu nền sang `--bg-card-subtle`.
* **Admin Role Badge (`.btn-admin-badge`):** Thay thế viền đỏ thô sơ bằng huy hiệu bảo mật cao cấp: nền tím mờ `rgba(99, 102, 241, 0.12)`, chữ `--primary`, viền `rgba(99, 102, 241, 0.35)` kèm icon khiên bảo vệ `Shield`.
* **Language & Theme Switcher (`.control-btn`):** Thiết kế dạng pill bo tròn hoàn toàn (`--radius-full`), tạo cảm giác tactile mượt mà khi click.

### 4.2. Huy hiệu phân loại (Badges)
Được tối ưu màu tương phản chuẩn WCAG 2.1 AA cho cả hai giao diện:
* `badge-open`: Xanh lục (Tuyển dụng đang mở)
* `badge-part-time`: Xanh tím indigo (Việc bán thời gian)
* `badge-freelance`: Vàng cam ấm (Dự án tự do)
* `badge-internship`: Tím mộng mơ (Kỳ thực tập)
* `badge-student`: Gradient xanh ngọc (Đặc quyền thân thiện sinh viên)

### 4.3. Thẻ việc làm (JobCard)
* Cấu trúc 3 vùng thông tin:
  1. *Đầu thẻ:* Hệ thống badge phân loại công việc + ngành nghề.
  2. *Thân thẻ:* Tiêu đề việc làm in đậm có link chi tiết, tên công ty, mô tả ngắn gọn (cắt 2 dòng `line-clamp: 2`).
  3. *Chân thẻ:* Mức lương nổi bật, địa điểm, chế độ làm việc và nút "Ứng tuyển / Chi tiết".

---

## 5. Linh Vật Thương Hiệu: "Ong Vàng Hubbie" (Brand Mascot System)

Theo chuẩn `mascot-sheet`, FreelanceHub sở hữu linh vật đại diện:
* **Tên linh vật:** **Hubbie** (Ong Vàng Sinh Viên Cần Mẫn).
* **Hình tượng:** Chú ong vàng đeo kính tri thức, mang balo hoặc laptop, mặc áo đồng phục sinh viên.
* **Ý nghĩa biểu trưng:** Sự chăm chỉ, nỗ lực tích lũy kinh nghiệm làm việc thực tế, kiếm thêm thu nhập chân chính và kết nối cộng đồng sinh viên Văn Lang.
* **Vị trí xuất hiện:**
  - Hero banner trang chủ: Chào đón sinh viên và gợi ý tìm việc thông minh.
  - Trang chi tiết / Trạng thái trống (Empty State): Động viên sinh viên khi chưa có hồ sơ hoặc chưa tìm thấy việc làm.
  - Hộp thoại nộp đơn ứng tuyển: Biểu cảm hào hứng chúc ứng viên thành công.

---

## 6. Tiêu Chuẩn Tiếp Cận & Khả Năng Đáp Ứng (Accessibility & Responsive)

* **Breakpoints:**
  - Mobile Small: `< 480px` (Giao diện 1 cột, thanh tìm kiếm xếp dọc, font tiêu đề co giãn).
  - Tablet: `481px - 768px` (Lưới việc làm 2 cột, menu hamburger di động).
  - Desktop: `> 768px` (Menu thanh ngang mở rộng, lưới 3 cột linh hoạt).
* **Quy chuẩn WCAG 2.1 AA:**
  - Mọi nút bấm và tương tác cảm ứng tối thiểu đạt diện tích chạm **44 × 44px**.
  - Trạng thái `focus-visible` có vòng viền xanh rõ ràng để người dùng duyệt bằng phím Tab không bị lạc lối.
  - Tỷ lệ tương phản chữ đạt tối thiểu **4.5:1** trên mọi bề mặt nền sáng và tối.
