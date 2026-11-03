# CLAUDE.md — Freelance Marketplace (CDTN2 - Nhóm 8)
**Dự án:** Chuyên đề Tốt nghiệp 2 (CDTN2) | Khoa CNTT – Đại học Văn Lang  
**Phân hệ:** Freelance Marketplace (FreelanceHub)  
**Nhóm sinh viên:** Nhóm 8 (Nguyễn Bá Anh Khôi, Nguyễn Tấn Tài, Hoàng Bảo Long)  
**Quy chuẩn cốt lõi (Hiến pháp):** `.specify/memory/constitution.md`

---

## 1. NGUYÊN TẮC HOẠT ĐỘNG CỦA CLAUDE TRONG DỰ ÁN (OPERATING PROTOCOL)

Khi nhận bất kỳ yêu cầu lập trình, thay đổi nghiệp vụ hoặc bổ sung tính năng nào từ người dùng, **Claude TUYỆT ĐỐI KHÔNG viết code ngay lập tức (NO PREMATURE CODING)**. Bắt buộc áp dụng quy trình **Spec-Driven Development** thông qua bộ công cụ **Spec-Kit** theo 6 giai đoạn:

```text
Prompt Người Dùng (Yêu cầu tính năng / sửa lỗi / đổi quy tắc)
      │
      ▼
[GIAI ĐOẠN 1: ĐỐI CHIẾU HIẾN PHÁP] ──► /speckit-constitution
  └─ Đọc .specify/memory/constitution.md để thẩm định tính hợp lệ với kiến trúc phân tầng và quy tắc nghiệp vụ.
      │
      ▼
[GIAI ĐOẠN 2: LÀM RÕ ĐIỂM MƠ HỒ]    ──► /speckit-clarify (Nếu có điểm chưa rõ)
  └─ Đặt tối đa 3-5 câu hỏi trúng đích về biên dữ liệu, quyền hạn RBAC, chống IDOR và ngoại lệ.
      │
      ▼
[GIAI ĐOẠN 3: LẬP KẾ HOẠCH KỸ THUẬT]──► /speckit-plan
  └─ Thiết kế kiến trúc, DTOs, JPA queries (chống N+1) và API contracts (docs/api-contract.md).
      │
      ▼
[GIAI ĐOẠN 4: PHÂN RÃ CHECKLIST]    ──► /speckit-tasks
  └─ Phân rã checklist công việc chi tiết theo thứ tự TDD (tasks.md).
      │
      ▼
[GIAI ĐOẠN 5: RÀ SOÁT KHỚP NỐI]      ──► /speckit-analyze
  └─ Rà soát chéo tính nhất quán giữa spec.md ↔ plan.md ↔ tasks.md ↔ constitution.md.
      │
      ▼
[GIAI ĐOẠN 6: THỰC THI VIẾT CODE]   ──► /speckit-implement
  └─ Viết code theo TDD (Red-Green-Refactor), kiểm thử từng task đến khi 100% test pass.
```

---

## 2. BỘ CÔNG CỤ SPEC-KIT VÀ CÁCH THỰC THI

| Lệnh / Slash Command | Mục đích & Mô tả | Script PowerShell hỗ trợ |
| :--- | :--- | :--- |
| `/speckit-constitution` | Xem hoặc cập nhật Hiến pháp dự án tại `.specify/memory/constitution.md`. Mọi code phải tuân thủ Hiến pháp này. | `powershell -File .specify/scripts/powershell/resolve-template.ps1 constitution-template -Json` |
| `/speckit-clarify` | Phân tích spec tìm điểm mơ hồ, hỏi người dùng để chốt quyết định thiết kế. | `powershell -File .specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly` |
| `/speckit-plan` | Khởi tạo kế hoạch kỹ thuật, data model và API contracts cho feature. | `powershell -File .specify/scripts/powershell/setup-plan.ps1 -Json` |
| `/speckit-tasks` | Phân rã spec và plan thành danh sách task TDD chi tiết trong `tasks.md`. | `powershell -File .specify/scripts/powershell/setup-tasks.ps1 -Json` |
| `/speckit-analyze` | Rà soát chéo chất lượng giữa `spec.md`, `plan.md` và `tasks.md` (chế độ chỉ đọc). | `powershell -File .specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireSpec -RequireTasks -IncludeTasks` |
| `/speckit-implement` | Triển khai mã nguồn theo từng task trong `tasks.md`, chạy test xác minh liên tục. | Chạy test: `mvn test` (Backend) hoặc `npm test` (Frontend) |

---

## 3. CÁC QUY TẮC BẤT BIẾN VỀ KIẾN TRÚC & NGHIỆP VỤ

1. **Kiến Trúc 4 Tầng Phân Lập (Backend):**
   - `Controller`: Nhận HTTP request, validate `@Valid`, bọc phản hồi `ApiResponse<T>`. CẤM chứa logic nghiệp vụ, CẤM gọi trực tiếp Repository.
   - `Service`: Nơi duy nhất chứa quy tắc nghiệp vụ (BR-01..BR-06) và quản lý giao dịch `@Transactional`.
   - `Repository`: Kế thừa `JpaRepository`, tối ưu 13 index, chống N+1 bằng `@EntityGraph` hoặc `JOIN FETCH`.
   - `Entity & DTO`: CẤM trả Entity ra ngoài Controller, luôn bọc qua DTO.
2. **Quy Tắc Nghiệp Vụ Cốt Lõi (BR-01 Đến BR-06):**
   - `BR-01`: Chỉ `ROLE_STUDENT` nộp đơn ứng tuyển việc làm `OPEN`.
   - `BR-02`: Chỉ `ROLE_EMPLOYER` (hoặc `ROLE_ADMIN`) đăng và quản lý tin việc làm.
   - `BR-03`: Mỗi sinh viên chỉ nộp đúng 1 đơn/tin (`UNIQUE (job_id, student_id)`).
   - `BR-04`: Chống IDOR — Chỉ NTD sở hữu tin mới được xem và duyệt đơn ứng tuyển.
   - `BR-05`: Đánh giá 2 chiều chỉ khi tin `COMPLETED` và ứng viên `ACCEPTED` (1-5 sao, `UNIQUE (job_id, reviewer_id)`).
   - `BR-06`: Khi `isActive = false`, chặn cấp token và chặn toàn bộ thao tác.
3. **Frontend UI/UX & Design Tokens:**
   - Sử dụng biến CSS chuẩn hóa trong `frontend/src/styles/variables.css`.
   - Hỗ trợ song ngữ VI/EN (`LanguageContext`) và Dark/Light mode (`ThemeContext`).

---

## 4. TỐI ƯU HÓA TOKEN & CODEGRAPH
- Dự án có sẵn chỉ mục `.codegraph/`.
- Khi cần tìm hiểu code, tìm symbol hay trace call graph: Dùng `codegraph explore "<symbol>"` thay vì dùng grep/find quét toàn bộ thư mục.
- Tuyệt đối không đọc toàn bộ các file cùng một lúc. Nạp ngữ cảnh tăng dần (Progressive Disclosure) theo đúng giai đoạn Spec-Kit.

