# BÁO CÁO KIỂM THỬ TOÀN DIỆN FRONTEND - FREELANCEHUB

**Người thực hiện:** Phạm Công Tài  
**Dự án:** Chuyên đề Tốt nghiệp 2 (CDTN2) - Nền tảng FreelanceHub  
**Nhánh Git:** `Test` (Commit gốc: `ddf53a9`)  
**Ngày thực hiện kiểm thử:** 13/11/2026  
**Mục tiêu kiểm thử:** Xác minh độc lập, toàn diện các tính năng vừa nâng cấp trên Frontend: Khu vực Việc làm nổi bật (Hot Jobs), Ngành nghề trọng điểm (Key Industries), Trải nghiệm khách vãng lai xem việc làm không cần đăng nhập, Luồng chuyển hướng đăng nhập để ứng tuyển (Redirect to Job Detail), và Xử lý triệt để lỗi hiển thị công việc hết hạn (Job ID 1471).

---

## 1. MÔI TRƯỜNG KIỂM THỬ

| Thành phần | Thông số môi trường |
| :--- | :--- |
| **Hệ điều hành** | Windows 11 Pro 64-bit |
| **Frontend Runtime** | Node.js v24.16.0, React 18.2, TypeScript 5.2, Vite 5.4.21 |
| **Frontend Address** | `http://localhost:3000` (Process ID `task-1032`) |
| **Backend Runtime** | Java 17, Spring Boot 3.2.3, Spring Security 6 (JWT) |
| **Backend Address** | `http://localhost:8080/api/v1` (Profile `mysql`, Process ID `task-1300`) |
| **Cơ sở dữ liệu** | MySQL Server (XAMPP 8.x) - Database `freelance_db` (1.472 công việc, 16 danh mục) |
| **Công cụ kiểm thử tự động** | Google Chrome Headless v131 (CDP - Chrome DevTools Protocol), PowerShell 5.1, REST Client, JUnit 5 / Mockito |
| **Tài khoản kiểm thử** | • Khách vãng lai (Guest - Unauthenticated Session)<br>• Sinh viên: `taikon4725@gmail.com` (User ID 14, `ROLE_STUDENT`)<br>• Nhà tuyển dụng: `recruiter@thecoffee.vn` (User ID 2, `ROLE_EMPLOYER`) |

---

## 2. NGUYÊN TẮC TUÂN THỦ TRONG KIỂM THỬ & KHẮC PHỤC LỖI

1. **Bảo toàn dữ liệu 100%:** Tuyệt đối không thay đổi trạng thái, không cập nhật giá trị các bản ghi trong database, không xóa Job 1471 hoặc bất kỳ dữ liệu nào.
2. **Không commit, không push Git:** Toàn bộ công việc chỉ nằm trên working tree nhánh `Test`, tuyệt đối không tác động nhánh `main`.
3. **Không ảnh hưởng chức năng NTD:** Nhà tuyển dụng khi vào trang quản lý tin tuyển dụng cá nhân (`/employer/jobs`) vẫn xem được toàn bộ tin của mình (kể cả tin đã hết hạn) để theo dõi ứng viên và gia hạn tin.
4. **Không thay đổi giao diện, màu sắc, bố cục:** Giữ nguyên 100% thiết kế ban đầu.
5. **Bổ sung Unit Test đầy đủ:** Kiểm tra đầy đủ các kịch bản: Job hết hạn, Job còn hạn, Job không ở trạng thái OPEN.

---

## 3. MA TRẬN KẾT QUẢ KIỂM THỬ (TEST MATRIX)

| Mã TC | Hạng mục kiểm thử | Thao tác thực tế | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Truy cập Trang chủ khách vãng lai | Mở `http://localhost:3000` ở phiên ẩn danh | Hiển thị đầy đủ trang chủ, không bị chặn hay redirect về `/login` | Trang chủ load thành công (HTTP 200), giao diện hoàn chỉnh | **PASS** |
| **TC-02** | Hiển thị Hero Banner & Mascot | Quan sát phần đầu trang chủ | Mascot Ong Vàng Hubbie, tiêu đề, thanh tìm kiếm và tag tỉnh thành hiển thị trực quan | Hiển thị chuẩn xác, không lệch layout | **PASS** |
| **TC-03** | Thống kê việc làm tổng quan | Kiểm tra Stats Banner | Hiển thị số liệu: 1.470+ việc làm, 16 nhóm ngành nghề, 34+ tỉnh thành, Multi-DB | Hiển thị đúng 4 cột thống kê với icon và màu sắc đặc trưng | **PASS** |
| **TC-04** | Danh sách 16 ngành nghề trọng điểm | Kiểm tra Section Ngành nghề trọng điểm | Hiển thị đủ 16 danh mục được sắp xếp trong Grid responsive | Đủ 16 ngành nghề với icon emoji tương ứng từng ngành | **PASS** |
| **TC-05** | Số lượng việc làm thực tế theo ngành | Kiểm tra nhãn số việc làm trên từng card ngành | Lấy từ API thực tế (`GET /jobs?categoryId=...`), chỉ đếm job OPEN còn hạn | Hiển thị chuẩn xác số lượng job còn hạn: Marketing (447), Bán hàng (183), F&B (147), Hành chính (143), CNTT (58 - đã loại job 1471 hết hạn)... Tổng cộng 1.471 jobs còn hạn | **PASS** |
| **TC-06** | Khu vực Việc làm nổi bật / Hot Jobs | Kiểm tra Section Hot Jobs trên trang chủ | Chỉ hiển thị công việc đồng thời thỏa mãn: status = OPEN và deadline >= NOW, gắn badge `🔥 HOT` | Hiển thị 8 JobCard có gắn nhãn `🔥 HOT`, Job 1471 hết hạn đã được loại trừ hoàn toàn | **PASS** |
| **TC-07** | Nhấn ngành nghề điều hướng lọc Job | Click vào card "Lập trình & CNTT" | Điều hướng sang `/jobs?category=1`, dropdown tự chọn ngành, đếm đúng các việc làm còn hạn | URL chuyển thành `/jobs?category=1`, lọc chính xác danh sách | **PASS** |
| **TC-08** | Duyệt toàn bộ việc làm `/jobs` | Truy cập trực tiếp `http://localhost:3000/jobs` | Hiển thị danh sách việc làm hợp lệ phân trang (18 việc/trang) | Hiển thị "Tìm thấy 1.471 công việc phù hợp - Trang 1/82" | **PASS** |
| **TC-09** | Tìm kiếm theo từ khóa | Nhập từ khóa `"Barista"` và nhấn Tìm kiếm | Danh sách lọc ra đúng các việc làm liên quan đến Barista | Hiển thị đúng "Tìm thấy 3 công việc phù hợp" có từ khóa Barista | **PASS** |
| **TC-10** | Lọc kết hợp danh mục và địa điểm | Chọn ngành F&B (Cat 2) và tỉnh thành TP.HCM | Danh sách chỉ hiển thị các việc F&B tại Hồ Chí Minh | Bộ lọc kết hợp hoạt động chính xác theo tham số query URL | **PASS** |
| **TC-11** | Xem chi tiết Job khách vãng lai | Khách chưa đăng nhập truy cập `/jobs/1` và `/jobs/2` | Xem đầy đủ tiêu đề, mô tả, yêu cầu, lương, quyền lợi, thông tin NTD | Hiển thị toàn bộ thông tin công khai của công việc mà không bị chuyển trang | **PASS** |
| **TC-12** | Nút hành động dành cho khách | Quan sát nút ứng tuyển trên trang chi tiết Job | Nút hiển thị nội dung: *"Đăng nhập để ứng tuyển"* dẫn tới `/login?redirect=/jobs/:id` | Nút có text "Đăng nhập để ứng tuyển" và link chứa tham số redirect chính xác | **PASS** |
| **TC-13** | Luồng chuyển hướng Login (Redirect) | Click nút "Đăng nhập để ứng tuyển" tại `/jobs/2` | Điều hướng sang `/login?redirect=/jobs/2` | URL trên trình duyệt nhận đúng `http://localhost:3000/login?redirect=/jobs/2` | **PASS** |
| **TC-14** | Đăng nhập thành công và quay lại Job | Nhập tài khoản sinh viên `taikon4725@gmail.com` và đăng nhập | Hệ thống tự động chuyển ngược lại đúng `/jobs/2` | URL lập tức quay về `http://localhost:3000/jobs/2`, không bị đưa về dashboard | **PASS** |
| **TC-15** | Phân quyền Sinh viên trên trang Job | Kiểm tra giao diện sau khi đăng nhập sinh viên | Nút chuyển thành *"Ứng tuyển ngay"* và mở được modal nộp hồ sơ | Nút "Ứng tuyển ngay" xuất hiện, navbar hiển thị tên `Taikon` | **PASS** |
| **TC-16** | Phân quyền Nhà tuyển dụng | Đăng nhập bằng `recruiter@thecoffee.vn` vào xem `/jobs/2` | Không có nút ứng tuyển, có dòng thông báo *"Tài khoản Nhà tuyển dụng không thể ứng tuyển"* | Thông báo in nghiêng hiển thị chuẩn xác, không cho phép NTD ứng tuyển | **PASS** |
| **TC-17** | Chặn khách truy cập trang Admin | Khách chưa đăng nhập truy cập `/admin/dashboard` | `ProtectedRoute` chặn và chuyển hướng về `/login` | Hệ thống lập tức đẩy về `/login`, bảo vệ an toàn cho module Admin | **PASS** |
| **TC-18** | Gắn nhãn HOT có bị tràn lan không | So sánh Card tại `/` và Card tại danh sách `/jobs` | Chỉ khu vực Hot Jobs trên trang chủ mới có nhãn `🔥 HOT` | Trang `/jobs` hiển thị card tiêu chuẩn không có nhãn HOT. Nhãn HOT không bị gắn bừa bãi | **PASS** |
| **TC-19** | Độ toàn vẹn dữ liệu Database | Chạy truy vấn kiểm tra trùng lặp ID và tiêu đề | 1.472 dòng tương ứng đúng 1.472 ID duy nhất | 100% ID duy nhất, không trùng lặp khóa chính | **PASS** |
| **TC-20** | Xử lý Job hết hạn (Job ID 1471) | Kiểm tra hiển thị Hot Jobs và chi tiết `/jobs/1471` | Job 1471 không xuất hiện trong Hot Jobs; khi vào link trực tiếp `/jobs/1471` hiển thị badge "Đã hết hạn" và nút "Đã hết hạn ứng tuyển" | Job 1471 đã biến mất khỏi Hot Jobs; trang `/jobs/1471` hiển thị trạng thái "Đã hết hạn", cấm nộp đơn | **PASS** |
| **TC-21** | Kiểm tra hiển thị đa độ phân giải | Kiểm tra 1920px (Desktop), 1366px (Laptop), 375px (Mobile) | Giao diện responsive mượt mà, không vỡ layout, không mất chữ tiếng Việt | Không tràn ngang, text cân đối, tiếng Việt UTF-8 chuẩn xác 100% | **PASS** |

---

## 4. CHI TIẾT KHẮC PHỤC LỖI JOB HẾT HẠN (JOB ID 1471)

### 4.1. Nguyên nhân gốc rễ
* Tại Backend (`JobRepository.java`), phương thức native query `searchJobs` trước đó chỉ có điều kiện:
  ```sql
  WHERE j.status = 'OPEN' ...
  ```
  thiếu điều kiện ràng buộc hạn nộp hồ sơ.
* Do đó, bản ghi Job ID 1471 có `deadline = 2026-11-06 23:59:59` (đã quá hạn 7 ngày so với ngày 13/11/2026) nhưng do cột `status` trong DB vẫn mang giá trị `'OPEN'` nên Backend vẫn trả về trong danh sách 8 việc làm mới nhất.

### 4.2. Giải pháp thực hiện (Không sửa database, không xóa dữ liệu)
1. **Tại Backend (`JobRepository.java`):**
   Cập nhật câu truy vấn `searchJobs` (cả phần `value` và `countQuery`):
   ```sql
   SELECT j.* FROM jobs j 
   WHERE j.status = 'OPEN' 
     AND (j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP)
     AND (:keyword IS NULL OR ...) ...
   ```
   *Đặc điểm:* `CURRENT_TIMESTAMP` là chuẩn ANSI SQL tương thích 100% trên cả MySQL, PostgreSQL và H2. Các tin không giới hạn hạn nộp (`deadline IS NULL`) hoặc còn hạn (`deadline >= CURRENT_TIMESTAMP`) được hiển thị; tin quá hạn tự động bị loại khỏi kết quả tìm kiếm/danh mục mà không cần thay đổi dữ liệu trong database.
2. **Tại Backend (`JobService.java` & `JobRepository.java`):**
   Phương thức `findByEmployerId(Long employerId)` dành cho Nhà tuyển dụng được **giữ nguyên không thêm điều kiện deadline**, đảm bảo Nhà tuyển dụng vẫn quản lý, xem lại và gia hạn toàn bộ tin của mình bình thường.
3. **Tại Frontend (`HomePage.tsx`):**
   Bổ sung bộ lọc an toàn client-side:
   ```typescript
   const validJobs = res.content
     .filter((j) => j.status === 'OPEN' && (!j.deadline || new Date(j.deadline) >= now))
     .slice(0, 8);
   ```
4. **Tại Frontend (`JobDetailPage.tsx`):**
   Thêm cờ nhận diện hết hạn:
   ```typescript
   const isExpired = job?.deadline ? new Date(job.deadline) < new Date() : false;
   const isClosed = job?.status !== 'OPEN' || isExpired;
   ```
   Nếu công việc đã hết hạn hoặc không OPEN, hiển thị huy hiệu `ĐÃ HẾT HẠN` và khung thông báo màu đỏ `Đã hết hạn ứng tuyển`, ngăn chặn nút nộp đơn.

---

## 5. ẢNH CHỤP MINH CHỨNG THỰC TẾ (SCREENSHOT EVIDENCE)

Toàn bộ ảnh chụp thực tế được lưu trữ trong thư mục:
`test_evidence_screenshots/`

| STT | Tên file ảnh | Mô tả minh chứng | Link xem trực tiếp |
| :---: | :--- | :--- | :--- |
| 1 | `fixed_home_hot_jobs.png` | **Trang chủ sau khi sửa lỗi:** Khu vực Hot Jobs gồm đúng 8 việc làm OPEN còn hạn (Job 1472, 1470, 1469, 1468, 1467, 1466, 1465, 1464). Job 1471 đã bị loại bỏ hoàn toàn. Ngành CNTT cập nhật chính xác còn 58 việc làm còn hạn | [fixed_home_hot_jobs.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/fixed_home_hot_jobs.png) |
| 2 | `fixed_job_1471_expired.png` | **Chi tiết Job 1471 khi truy cập trực tiếp:** Hiển thị huy hiệu `ĐÃ HẾT HẠN`, nút ứng tuyển chuyển thành khung đỏ `Đã hết hạn ứng tuyển`, không cho phép nộp đơn | [fixed_job_1471_expired.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/fixed_job_1471_expired.png) |
| 3 | `home_fullpage.png` | Toàn cảnh Trang chủ trước khi sửa: Hero Mascot, Stats, 16 Ngành nghề trọng điểm | [home_fullpage.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/home_fullpage.png) |
| 4 | `jobs_browse_all.png` | Trang duyệt việc làm `/jobs`: Card tiêu chuẩn không bị gắn nhãn HOT tràn lan | [jobs_browse_all.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/jobs_browse_all.png) |
| 5 | `jobs_filter_cat1.png` | Lọc việc làm theo ngành "Lập trình & CNTT" từ trang chủ: Phân trang chuẩn xác | [jobs_filter_cat1.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/jobs_filter_cat1.png) |
| 6 | `jobs_search_barista.png` | Tìm kiếm từ khóa `"Barista"`: Lọc ra chính xác 3 công việc liên quan | [jobs_search_barista.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/jobs_search_barista.png) |
| 7 | `job_detail_guest.png` | Khách vãng lai xem chi tiết `/jobs/1`: Đầy đủ thông tin, hiển thị nút *"Đăng nhập để ứng tuyển"* | [job_detail_guest.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/job_detail_guest.png) |
| 8 | `flow_step2_login_redirect_url.png` | Nhấn nút ứng tuyển: Chuyển sang `/login?redirect=/jobs/2` | [flow_step2_login_redirect_url.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/flow_step2_login_redirect_url.png) |
| 9 | `flow_step4_redirected_to_job2_with_apply_btn.png` | Đăng nhập tài khoản sinh viên: Tự động quay lại đúng `/jobs/2`, nút chuyển thành *"Ứng tuyển ngay"* | [flow_step4_redirected_to_job2_with_apply_btn.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/flow_step4_redirected_to_job2_with_apply_btn.png) |
| 10 | `test_employer_view_job2.png` | Đăng nhập tài khoản Nhà tuyển dụng xem `/jobs/2`: Hiển thị thông báo không được ứng tuyển, không có nút nộp đơn | [test_employer_view_job2.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/test_employer_view_job2.png) |
| 11 | `test5_guest_blocked_from_admin.png` | Khách vãng lai cố tình vào `/admin/dashboard`: Bị `ProtectedRoute` chặn và chuyển hướng về `/login` | [test5_guest_blocked_from_admin.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/test5_guest_blocked_from_admin.png) |
| 12 | `home_responsive_1366.png` | Giao diện trên màn hình Laptop 1366x768 | [home_responsive_1366.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/home_responsive_1366.png) |
| 13 | `home_responsive_mobile.png` | Giao diện trên màn hình điện thoại di động (Mobile 375px) | [home_responsive_mobile.png](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/test_evidence_screenshots/home_responsive_mobile.png) |

---

## 6. KẾT QUẢ UNIT TEST BACKEND VÀ BUILD FRONTEND

### 6.1. Unit Test Backend
Đã bổ sung 5 Unit Test mới bao phủ toàn diện:
1. `JobRepositoryTest.searchJobs_ReturnsOnlyOpenAndUnexpiredJobs`: Xác minh chỉ lấy Job OPEN còn hạn.
2. `JobRepositoryTest.searchJobs_ExcludesExpiredAndNonOpenJobs`: Xác minh loại trừ Job hết hạn hoặc không OPEN.
3. `JobServiceTest.searchJobs_FilterValidOpenAndUnexpiredJobs`: Kiểm thử service chỉ trả về Job hợp lệ.
4. `ApplicationServiceTest.applyJob_JobDeadlineExpired_ThrowsException`: Ném `BadRequestException` khi nộp đơn vào Job quá hạn.
5. `ApplicationServiceTest.applyJob_JobDeadlineValid_Success`: Nộp đơn thành công khi Job còn hạn nộp.

**Kết quả chạy Maven Test:**
```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 56, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  11.600 s
```
Toàn bộ **56/56 Unit Tests đạt 100%**.

### 6.2. Frontend Build
Chạy lệnh `npm run build` (`tsc && vite build`):
```text
vite v5.4.21 building for production...
✓ 1582 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.75 kB │ gzip:   0.47 kB
dist/assets/index-B6PZHHfN.css   16.07 kB │ gzip:   3.83 kB
dist/assets/index-wdJGQRWa.js   448.27 kB │ gzip: 121.03 kB
✓ built in 2.39s
```
**Frontend biên dịch thành công 100%, không có lỗi TypeScript.**

---

## 7. DANH SÁCH CÁC FILE ĐÃ CHỈNH SỬA

| STT | Đường dẫn file | Mục đích chỉnh sửa |
| :---: | :--- | :--- |
| 1 | `backend/src/main/java/com/nhom8/freelance/repositories/JobRepository.java` | Bổ sung điều kiện `(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP)` trong `searchJobs` |
| 2 | `backend/src/test/java/com/nhom8/freelance/repository/JobRepositoryTest.java` | Bổ sung Unit Test kiểm tra lọc Job OPEN còn hạn và loại trừ Job hết hạn/không OPEN |
| 3 | `backend/src/test/java/com/nhom8/freelance/service/JobServiceTest.java` | Bổ sung Unit Test kiểm tra service trả về Job OPEN còn hạn |
| 4 | `backend/src/test/java/com/nhom8/freelance/service/ApplicationServiceTest.java` | Bổ sung Unit Test nộp đơn vào Job hết hạn (bị từ chối) và Job còn hạn (thành công) |
| 5 | `frontend/src/pages/HomePage.tsx` | Bổ sung bộ lọc an toàn client-side cho danh sách Hot Jobs |
| 6 | `frontend/src/pages/JobDetailPage.tsx` | Bổ sung kiểm tra `isClosed`/`isExpired`, hiển thị badge và cấm nộp đơn khi job quá hạn |
| 7 | `frontend/src/components/jobs/JobCard.tsx` | Đã chỉnh sửa trước đó: Thêm prop `isHot?: boolean` và badge `🔥 HOT` |
| 8 | `frontend/src/pages/LoginPage.tsx` | Đã chỉnh sửa trước đó: Nhận diện `?redirect=/jobs/:id` và quay lại đúng Job sau khi login |
| 9 | `frontend/src/pages/RegisterPage.tsx` | Đã chỉnh sửa trước đó: Nhận diện `?redirect=/jobs/:id` sau khi đăng ký |

---

## 8. ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG CỦA HỆ THỐNG

- **Tổng số Test Cases:** 21/21 **PASS (100%)**
- **Unit Test Backend:** 56/56 **PASS (100%)**
- **Frontend Build:** **PASS (0 errors, 2.39s)**
- **Toàn vẹn Database:** Không sửa trạng thái bản ghi, không xóa bản ghi, Job 1471 vẫn còn nguyên vẹn trong database.
- **Trạng thái Git:** Đang trên nhánh **`Test`**, **chưa commit, chưa push Git, không sửa nhánh `main`**.
- **Kết luận:** **HỆ THỐNG ĐÃ HOÀN TOÀN SẴN SÀNG ĐỂ NGƯỜI DÙNG KIỂM TRA.**
