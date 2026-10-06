# DANH SÁCH ĐỀ TÀI

**Trường Đại học Văn Lang — Khoa Công nghệ thông tin**

**Học phần:** Chuyên đề tốt nghiệp 2
**GVHD:** Nguyễn Văn Trung

---

# CHUYÊN NGÀNH: Công nghệ phần mềm

## Nền tảng quản lý freelance / marketplace việc làm part-time cho sinh viên

### 1. Mục tiêu

Xây dựng một nền tảng web hai chiều (two-sided marketplace) kết nối sinh viên tìm việc làm thêm với nhà tuyển dụng/cá nhân có nhu cầu thuê nhân sự ngắn hạn, cho phép đăng tin, tìm kiếm, ứng tuyển, quản lý trạng thái công việc và đánh giá sau khi hoàn thành.

### 2. Phạm vi đề tài

**Trong phạm vi:**

1. Đăng ký/đăng nhập, phân quyền 3 vai trò: Sinh viên, Nhà tuyển dụng, Quản trị viên
2. Nhà tuyển dụng đăng tin việc làm part-time (mô tả, thời gian, mức lương, địa điểm)
3. Sinh viên tìm kiếm, lọc tin theo ngành nghề/địa điểm/mức lương, ứng tuyển kèm hồ sơ (CV/giới thiệu bản thân)
4. Nhà tuyển dụng xem danh sách ứng viên, duyệt/từ chối ứng tuyển
5. Theo dõi trạng thái công việc (đang tuyển, đã nhận người, hoàn thành)
6. Đánh giá hai chiều sau khi công việc hoàn thành (SV đánh giá NTD và ngược lại)
7. Thông báo cơ bản khi có cập nhật trạng thái ứng tuyển

**Ngoài phạm vi (không bắt buộc):**

8. Thanh toán/giao dịch tiền thật qua cổng thanh toán
9. Ứng dụng di động native riêng biệt (ưu tiên web responsive)
10. Chat real-time nâng cao giữa hai bên (có thể để hướng phát triển)

### 3. Công nghệ đề xuất

- Backend: Spring Boot (REST API), Spring Security + JWT cho xác thực/phân quyền
- Frontend: ReactJS (hoặc Vue.js), thiết kế responsive
- Cơ sở dữ liệu: MySQL/PostgreSQL
- Công cụ hỗ trợ: Git/GitHub cho quản lý mã nguồn, Postman cho kiểm thử API

### 4. Kế hoạch triển khai theo Sprint (10 buổi)

| Sprint | Buổi | Mục tiêu / Công việc chính | Sản phẩm bàn giao |
|---|---|---|---|
| Sprint 0 | Buổi 1–3 | Phân tích yêu cầu, xác định actor/use case, lập product backlog và kế hoạch sprint | Bản đặc tả yêu cầu (SRS rút gọn) + backlog |
| Sprint 1 | Buổi 4–5 | Thiết kế kiến trúc hệ thống, thiết kế CSDL (ERD), thiết kế API contract, wireframe UI | Tài liệu thiết kế kiến trúc + ERD + wireframe |
| Sprint 2 | Buổi 6 | Xây dựng chức năng đăng ký/đăng nhập, phân quyền, quản lý hồ sơ SV/NTD | Module auth + quản lý hồ sơ hoạt động |
| Sprint 3 | Buổi 7 | Xây dựng chức năng đăng tin, tìm kiếm/lọc tin, ứng tuyển | Module đăng tin & ứng tuyển hoạt động |
| Sprint 4 | Buổi 8 | Kiểm thử (unit/integration test), hoàn thiện quản lý trạng thái ứng tuyển và đánh giá sau công việc, sửa lỗi | Kết quả kiểm thử + module đánh giá hoàn chỉnh |
| Sprint 5 | Buổi 9–10 | Triển khai sản phẩm (deploy), hoàn thiện báo cáo, tập dượt bảo vệ | Sản phẩm chạy được + báo cáo hoàn thiện |

### 5. Tiêu chí nghiệm thu / đánh giá sản phẩm

- Hệ thống chạy ổn định, đầy đủ luồng nghiệp vụ chính (đăng tin → ứng tuyển → duyệt → hoàn thành → đánh giá)
- Có test case và kết quả kiểm thử cho các chức năng cốt lõi
- Giao diện rõ ràng, phân quyền đúng theo vai trò
- Báo cáo trình bày đầy đủ quy trình phân tích – thiết kế – xây dựng – kiểm thử

---

# CHUYÊN NGÀNH: Khoa học dữ liệu

## Phân tích & dự báo xu hướng tuyển dụng ngành CNTT từ dữ liệu tin đăng việc làm

### 1. Mục tiêu

Thu thập, phân tích dữ liệu tin đăng tuyển dụng ngành CNTT nhằm xác định các kỹ năng/công nghệ đang có nhu cầu cao, xu hướng mức lương theo vị trí, và xây dựng mô hình dự báo xu hướng tuyển dụng theo thời gian, trình bày qua dashboard trực quan.

### 2. Phạm vi đề tài

**Trong phạm vi:**

1. Thu thập dữ liệu tin tuyển dụng CNTT (crawl từ nguồn công khai hoặc sử dụng dataset có sẵn, ví dụ Kaggle/ITviec/TopCV)
2. Làm sạch, chuẩn hóa dữ liệu (xử lý dữ liệu thiếu, trùng lặp, chuẩn hóa tên kỹ năng/công nghệ)
3. Phân tích khám phá dữ liệu (EDA): kỹ năng/công nghệ phổ biến, mức lương theo vị trí/kinh nghiệm, phân bố theo khu vực
4. Trích xuất kỹ năng/công nghệ từ mô tả công việc (text mining cơ bản)
5. Xây dựng mô hình dự báo/phân tích xu hướng theo thời gian (time series đơn giản hoặc phân tích xu hướng theo giai đoạn)
6. Xây dựng dashboard trực quan hóa kết quả

**Ngoài phạm vi (không bắt buộc):**

7. Thu thập dữ liệu real-time liên tục (chỉ cần snapshot dữ liệu trong phạm vi thời gian làm đồ án)
8. Dự báo cá nhân hóa theo hồ sơ từng sinh viên
9. Mô hình deep learning phức tạp cho time series (ưu tiên mô hình thống kê/ML cơ bản, dễ giải thích)

### 3. Công nghệ đề xuất

- Thu thập dữ liệu: Python (requests/BeautifulSoup hoặc Scrapy) hoặc dataset có sẵn
- Xử lý & phân tích: pandas, numpy
- Trích xuất văn bản: regex/underthesea (nếu dữ liệu tiếng Việt)
- Mô hình dự báo: statsmodels/Prophet hoặc mô hình hồi quy đơn giản
- Trực quan hóa/Dashboard: matplotlib/seaborn kết hợp Streamlit hoặc Power BI

### 4. Kế hoạch triển khai theo Sprint (10 buổi)

| Sprint | Buổi | Mục tiêu / Công việc chính | Sản phẩm bàn giao |
|---|---|---|---|
| Sprint 0 | Buổi 1–3 | Xác định nguồn dữ liệu, phạm vi phân tích (khoảng thời gian, khu vực), lập kế hoạch thu thập | Kế hoạch thu thập dữ liệu + phạm vi phân tích |
| Sprint 1 | Buổi 4–5 | Xây dựng pipeline thu thập & làm sạch dữ liệu, EDA sơ bộ | Bộ dữ liệu đã làm sạch + báo cáo EDA sơ bộ |
| Sprint 2 | Buổi 6 | Hoàn thiện EDA, trích xuất kỹ năng/công nghệ từ mô tả công việc (feature engineering) | Bảng dữ liệu đặc trưng (feature table) |
| Sprint 3 | Buổi 7 | Xây dựng mô hình dự báo/phân tích xu hướng theo thời gian | Mô hình dự báo baseline |
| Sprint 4 | Buổi 8 | Đánh giá mô hình (so sánh baseline), tinh chỉnh tham số, phân tích lỗi | Kết quả đánh giá mô hình + bảng so sánh |
| Sprint 5 | Buổi 9–10 | Xây dựng dashboard trực quan, hoàn thiện báo cáo, tập dượt bảo vệ | Dashboard hoạt động + báo cáo hoàn thiện |

### 5. Tiêu chí nghiệm thu / đánh giá sản phẩm

- Dữ liệu được thu thập/làm sạch minh bạch, có mô tả nguồn và quy trình xử lý
- EDA thể hiện được insight rõ ràng (kỹ năng hot, xu hướng lương...)
- Mô hình dự báo có đánh giá bằng chỉ số phù hợp (MAE/RMSE hoặc tương đương) và so sánh với baseline
- Dashboard trực quan, dễ hiểu, phản ánh đúng kết quả phân tích

---

# CHUYÊN NGÀNH: Trí tuệ nhân tạo

## Hệ thống nhận diện khuôn mặt điểm danh tự động

### 1. Mục tiêu

Xây dựng hệ thống điểm danh tự động cho lớp học bằng công nghệ nhận diện khuôn mặt qua camera, cho phép đăng ký khuôn mặt sinh viên, nhận diện real-time và lưu trữ, tra cứu lịch sử điểm danh.

### 2. Phạm vi đề tài

**Trong phạm vi:**

1. Đăng ký (enrollment) khuôn mặt sinh viên: chụp/upload ảnh, trích xuất và lưu đặc trưng khuôn mặt
2. Nhận diện khuôn mặt real-time qua camera hoặc ảnh chụp tại lớp
3. Ghi nhận kết quả điểm danh (thời gian, trạng thái) vào cơ sở dữ liệu
4. Giao diện cho giảng viên/quản trị viên xem, chỉnh sửa, tra cứu lịch sử điểm danh theo lớp/buổi học
5. Đánh giá độ chính xác của mô hình nhận diện trên tập dữ liệu thử nghiệm

**Ngoài phạm vi (không bắt buộc):**

6. Nhận diện trong điều kiện ánh sáng cực kém hoặc khuôn mặt bị che khuất hoàn toàn
7. Tích hợp phần cứng camera AI chuyên dụng (dùng webcam/camera phổ thông)
8. Chống giả mạo khuôn mặt nâng cao (liveness detection) - có thể là hướng phát triển thêm nếu nhóm dư thời gian

### 3. Công nghệ đề xuất

- Xử lý ảnh: OpenCV
- Mô hình nhận diện khuôn mặt: face_recognition (dlib) hoặc InsightFace/MTCNN + FaceNet
- Backend: Flask/FastAPI (Python)
- Giao diện: web đơn giản (HTML/React) hiển thị camera & kết quả điểm danh
- Cơ sở dữ liệu: SQLite/MySQL lưu hồ sơ khuôn mặt và lịch sử điểm danh

### 4. Kế hoạch triển khai theo Sprint (10 buổi)

| Sprint | Buổi | Mục tiêu / Công việc chính | Sản phẩm bàn giao |
|---|---|---|---|
| Sprint 0 | Buổi 1–3 | Xác định yêu cầu, quy trình điểm danh thực tế, khảo sát và lựa chọn thư viện/mô hình nhận diện | Bản đặc tả yêu cầu + lựa chọn công nghệ |
| Sprint 1 | Buổi 4–5 | Thiết kế kiến trúc hệ thống, thiết kế pipeline enrollment và recognition, thiết kế CSDL lưu trữ | Tài liệu thiết kế kiến trúc & pipeline |
| Sprint 2 | Buổi 6 | Xây dựng module đăng ký khuôn mặt (enrollment) và lưu trữ đặc trưng | Module enrollment hoạt động |
| Sprint 3 | Buổi 7 | Xây dựng module nhận diện real-time qua camera và ghi nhận điểm danh | Module nhận diện & điểm danh hoạt động |
| Sprint 4 | Buổi 8 | Đánh giá độ chính xác (accuracy, false positive/negative), tinh chỉnh ngưỡng nhận diện | Báo cáo đánh giá độ chính xác mô hình |
| Sprint 5 | Buổi 9–10 | Hoàn thiện giao diện tra cứu lịch sử điểm danh, triển khai, viết báo cáo, tập dượt bảo vệ | Sản phẩm hoàn chỉnh + báo cáo hoàn thiện |

### 5. Tiêu chí nghiệm thu / đánh giá sản phẩm

- Hệ thống nhận diện chính xác trên tập dữ liệu thử nghiệm với ngưỡng chấp nhận được (nêu rõ % accuracy đạt được)
- Quy trình enrollment và điểm danh hoạt động ổn định, có xử lý trường hợp không nhận diện được
- Giao diện tra cứu lịch sử rõ ràng, đúng dữ liệu
- Báo cáo trình bày rõ phương pháp, thực nghiệm, kết quả đánh giá và hạn chế của hệ thống
