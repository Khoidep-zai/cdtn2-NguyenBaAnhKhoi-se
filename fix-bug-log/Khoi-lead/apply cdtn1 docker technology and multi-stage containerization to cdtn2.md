# 🐳 ÁP DỤNG CÔNG NGHỆ & PHƯƠNG PHÁP DOCKER TỐI ƯU TỪ CDTN1 SANG CDTN2

## 📌 THÔNG TIN CHUNG
- **Người thực hiện**: Nguyễn Bá Anh Khôi (Team Lead / DevOps)
- **Học phần**: Chuyên đề tốt nghiệp 2 (CDTN2) — Khoa CNTT — Trường Đại học Văn Lang
- **Dự án**: Sàn Giao dịch Việc làm Part-time & Freelance cho Sinh viên (FreelanceHub)
- **Phân hệ**: Containerization / DevOps / Docker Multi-stage & Orchestration
- **Tập tin liên quan**:
  - `docker-compose.yml`
  - `.dockerignore` (root, `backend/`, `frontend/`)
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `frontend/nginx.conf`
  - `.env.example` & `.env`
  - `package.json`
  - `scripts/docker-run.ps1` & `scripts/docker-run.sh`
  - `docs/docker-deployment-guide.md`
  - `README.md`

---

## 🎯 1. BỐI CẢNH VÀ MỤC TIÊU KỸ THUẬT
Dự án CDTN1 (Mekong Mobile CRM L2) đã hoàn thiện một kiến trúc Docker mẫu mực, đạt chuẩn Buổi 11 & 16 Track SE với khả năng khởi động 2 lệnh (`cp .env.example .env && docker compose up -d --build`), tối ưu bộ đệm PostgreSQL, kiểm tra sức khỏe đa tầng và thời gian build siêu tốc. 

Mục tiêu của đợt nâng cấp này là **chuyển giao và áp dụng toàn bộ công nghệ, phương pháp và tiêu chuẩn Docker tối ưu từ CDTN1 sang CDTN2 (FreelanceHub)**:
1. **Khắc phục tình trạng Build Context quá nặng**: Trước đây CDTN2 chưa có `.dockerignore`, mỗi lần build phải nạp hàng trăm MB thư mục `target/`, `node_modules/`, `.git/`.
2. **Khắc phục lỗi khởi động đồng thời (Race Condition)**: Trước đây `backend_api` khởi động cùng lúc với CSDL, dễ dính lỗi `Connection refused`.
3. **Tăng tốc độ truy vấn & khởi tạo CSDL**: Tinh chỉnh các tham số bộ đệm và tắt `synchronous_commit` trong Docker giúp nạp 1.470+ việc làm mẫu cực nhanh.
4. **Tích hợp Zero-CORS API Reverse Proxy ngay trong Docker Compose**: Cấu hình Nginx trong container frontend tự động làm gateway chuyển tiếp `/api/v1/*` sang backend, giúp trải nghiệm cục bộ Same-Origin y hệt môi trường Netlify production.
5. **Đồng bộ hóa tài liệu và hướng dẫn sử dụng**: Cung cấp script tự động cho Windows/Linux và viết mới `README.md` rõ ràng, trực quan.

---

## 🛠️ 2. CHI TIẾT CÁC CẢI TIẾN KỸ THUẬT

### A. Tối ưu Build Context với `.dockerignore`
- Tạo mới 3 tệp `.dockerignore` độc lập:
  - Gốc dự án: Loại bỏ `node_modules`, `target`, `dist`, `.git`, `docs`, `dataset`, `scratch`. Giảm context từ ~500MB xuống dưới **20MB**.
  - `backend/.dockerignore`: Loại bỏ `target`, `.git`, `.idea`.
  - `frontend/.dockerignore`: Loại bỏ `node_modules`, `dist`, `.git`.

### B. Tinh chỉnh `docker-compose.yml`
1. **PostgreSQL 16 Alpine Tuning**:
   - Thêm command flags:
     ```yaml
     command: >
       postgres
       -c shared_buffers=256MB
       -c work_mem=16MB
       -c max_connections=100
       -c synchronous_commit=off
       -c checkpoint_completion_target=0.9
       -c wal_buffers=16MB
     ```
   - Healthcheck định kỳ 3s qua `pg_isready`, retries 15 lần.
2. **Khởi động tuần tự có điều kiện (`depends_on: condition: service_healthy`)**:
   - `backend_api` chỉ khởi chạy khi `postgres_db` đã `service_healthy`.
   - `frontend_web` chỉ khởi chạy khi `backend_api` đã `service_healthy` tại endpoint `/api/v1/jobs?page=0&size=1`.
3. **Fail-safe Defaults**: Cung cấp giá trị mặc định cho toàn bộ biến môi trường `${DB_PASSWORD:-12345}`, `${JWT_SECRET:-...}` để chống lỗi sập khi chạy trên máy mới.
4. **MySQL chuyển sang Profile Tùy chọn**: Đặt `profiles: ["mysql"]` để tránh việc Docker tự động chiếm thêm 500MB RAM khi chạy mặc định với PostgreSQL.

### C. Nâng cấp `frontend/Dockerfile` & `frontend/nginx.conf`
1. Multi-stage build với `node:20-alpine` và `npm ci --prefer-offline --no-audit --no-fund`.
2. Runtime với `nginx:1.27-alpine` siêu nhẹ.
3. Cấu hình Nginx:
   - Gzip compression mức 6 cho toàn bộ file tĩnh.
   - Long-term caching 1 năm immutable cho `/assets/`.
   - Security Headers: `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`.
   - **Zero-CORS Reverse Proxy**:
     ```nginx
     location /api/v1/ {
         proxy_pass http://backend_api:8080/api/v1/;
         proxy_http_version 1.1;
         ...
     }
     ```

### D. Tiện ích & Hướng dẫn Vận hành
1. Thêm `package.json` tại thư mục gốc với các lệnh: `npm run docker:up`, `docker:down`, `docker:logs`, `docker:ps`, `test:backend`, `test:frontend`.
2. Tạo script khởi chạy tự động:
   - `scripts/docker-run.ps1` (PowerShell trên Windows).
   - `scripts/docker-run.sh` (Bash trên Linux/macOS).
3. Viết mới tài liệu `docs/docker-deployment-guide.md` và tái cấu trúc toàn diện `README.md`.

---

## 🧪 3. KẾT QUẢ NGHIỆM THU
- `docker compose config`: Cấu hình hợp lệ 100%.
- Cơ chế khởi động tuần tự hoạt động chuẩn xác: `postgres_db` (healthy) $\rightarrow$ `backend_api` (healthy) $\rightarrow$ `frontend_web` (healthy).
- Trình duyệt truy cập `http://localhost:3000` tải mượt mà giao diện, gọi API `/api/v1/jobs` không dính lỗi CORS.

