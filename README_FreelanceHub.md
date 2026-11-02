# FreelanceHub – Nền tảng việc làm

FreelanceHub kết nối ứng viên và nhà tuyển dụng, tập trung vào việc làm part-time, thực tập và freelance.

## 1. Công nghệ

- **Backend:** Java 21, Spring Boot, Spring Data JPA/Hibernate, Spring Security/JWT, Maven, MySQL.
- **Frontend:** React, TypeScript, Vite, Axios.

## 2. Cấu trúc dự án

```text
FreelanceHub-QA-Test/
├── backend/
│   └── src/main/
│       ├── java/
│       └── resources/
└── frontend/
    └── src/
        ├── pages/
        ├── services/
        └── types/
```

## 3. Cấu hình và chạy dự án

### Database MySQL

Tạo database nếu chưa có:

```sql
CREATE DATABASE freelance_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Cấu hình tại `backend/src/main/resources/application-mysql.yml`. Các biến môi trường hỗ trợ gồm `SERVER_PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` và `SPRING_DATASOURCE_URL`.

### Backend

Mở terminal tại `backend`:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

API mặc định: `http://localhost:8080/api/v1`

Nếu repository có Maven Wrapper, có thể dùng `mvnw.cmd` trên Windows thay cho `mvn`.

### Frontend

Mở terminal tại `frontend`:

```bash
npm install
npm run dev
```

Frontend mặc định: `http://localhost:3000`

Kiểm tra `VITE_API_BASE_URL` nếu API chạy ở địa chỉ khác. Giá trị mặc định trong mã nguồn đã chia sẻ: `http://localhost:8080/api/v1`.

## 4. Chức năng chính

- Đăng ký, đăng nhập, đăng xuất.
- Xem, tìm kiếm và lọc việc làm.
- Lọc theo từ khóa, tỉnh/thành, ngành nghề, loại công việc, chế độ làm việc và tiêu chí phù hợp sinh viên.
- Xem chi tiết tin tuyển dụng.
- Ứng tuyển, theo dõi đơn ứng tuyển.
- Quản lý hồ sơ CV.
- Nhà tuyển dụng đăng và quản lý tin tuyển dụng.
- Hiển thị thông báo.

## 5. Công việc và kết quả kiểm thử đã thực hiện

### Phạm vi phụ trách – Phạm Công Tài

- QA/QC kiểm thử giao diện Frontend theo phân công.
- Kiểm tra chức năng tìm kiếm và lọc việc làm.
- Ghi nhận lỗi, phối hợp phân tích nguyên nhân và chỉnh sửa trong phạm vi được giao.
- Tham gia vai trò Tech Lead trong việc tổng hợp tài liệu, ghi nhận lỗi hệ thống và hoàn thiện README.

### Kết quả kiểm tra tìm kiếm/lọc

Các kết quả giao diện đã được đối chiếu với truy vấn SQL trên database tại thời điểm kiểm thử:

| Hạng mục | Kết quả |
|---|---:|
| Việc làm đang mở | 1.471 |
| Việc làm phù hợp sinh viên | 1.241 |
| Tỉnh/thành Hồ Chí Minh | 645 |
| Hồ Chí Minh + phù hợp sinh viên | 545 |
| Hồ Chí Minh + Part-time + phù hợp sinh viên | 191 |
| Hồ Chí Minh + Part-time + Remote + phù hợp sinh viên | 3 |
| Tìm từ khóa `QA Tester` | 1 kết quả |

Số liệu phụ thuộc dữ liệu hiện có và có thể thay đổi khi database được cập nhật.

### Vấn đề đã xử lý

- API tìm kiếm việc làm trả HTTP 500 khi truy vấn MySQL.
- Truy vấn tìm kiếm cần xử lý tương thích chuỗi tiếng Việt/collation.
- Đồng bộ truy vấn lấy dữ liệu và truy vấn đếm tổng bản ghi phục vụ phân trang.
- Gửi hạn tuyển dụng từ Frontend ở thời điểm `23:59:59` của ngày được chọn.

### Tệp mã nguồn đã thay đổi

| Tệp | Nội dung |
|---|---|
| `backend/src/main/java/com/nhom8/freelance/controllers/JobController.java` | Điều chỉnh tạo `Pageable`, đồng bộ với cách sắp xếp tại repository. |
| `backend/src/main/java/com/nhom8/freelance/repositories/JobRepository.java` | Điều chỉnh native SQL tìm kiếm/lọc, xử lý chuỗi tiếng Việt và truy vấn đếm phân trang. |
| `backend/src/main/resources/application-mysql.yml` | Điều chỉnh mật khẩu mặc định cho môi trường MySQL local; cần cấu hình theo máy thực tế. |
| `frontend/src/pages/PostJobPage.tsx` | Gửi deadline ở thời điểm `23:59:59` của ngày được chọn. |

**Xác nhận:** Backend build thành công và chạy với profile `mysql`. Danh sách việc làm và các bộ lọc nêu trên hiển thị số liệu khớp với kết quả SQL được đối chiếu.

**Giới hạn:** Không xem các chức năng khác ngoài danh sách trên là đã kiểm thử đầy đủ nếu chưa có test case và bằng chứng tương ứng.

## 6. Git

- Branch: `Test`
- Commit đã thực hiện: `1bb4bba`
- Message: `fix: improve job search filtering and deadline handling`

Commit này đã được push lên `origin/Test` theo kết quả Git đã ghi nhận. README cần được commit và push riêng.

## 7. Lưu ý

- Không commit mật khẩu database, JWT secret hoặc token cá nhân.
- Dùng biến môi trường cho thông tin cấu hình riêng của từng máy.
- Trước khi triển khai, kiểm tra database, CORS, JWT và URL API.
- Cập nhật kết quả QA khi dữ liệu hoặc mã nguồn thay đổi.
