# Feature Specification: Part-time P0 Gap Completion & Student Safety (Hoàn thiện Lỗ hổng Cốt lõi P0 & An toàn Việc làm Sinh viên)

**Feature Branch**: `001-parttime-p0-completion`  
**Created**: 2026-11-06  
**Status**: Draft  
**Input**: User description: "triển khai bổ sung và hoàn thành giúp tôi các tính năng P0 còn thiếu theo AGENT_SPEC_WEBSITE_VIEC_LAM_PARTTIME_SINH_VIEN.md và FEATURE_AUDIT.md"  

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Job Moderation Queue (Duyệt tin tuyển dụng) (Priority: P1)

Là một **Quản trị viên (Admin)**, tôi muốn có một hàng chờ kiểm duyệt các tin tuyển dụng mới do Nhà tuyển dụng đăng tải, để xem xét nội dung, kiểm tra tính hợp pháp và xác thực các điều khoản làm việc trước khi tin được hiển thị công khai cho sinh viên.

**Why this priority**: Đây là chốt chặn quan trọng nhất để bảo vệ sinh viên khỏi các tin tuyển dụng lừa đảo, đa cấp trá hình hoặc vi phạm pháp luật lao động. Hiện tại hệ thống đang cho phép tin đăng tự động công khai ngay lập tức, phá vỡ luồng nghiệp vụ an toàn.

**Independent Test**:
1. Nhà tuyển dụng đăng một tin việc làm mới -> Tin được tạo với trạng thái chờ duyệt và KHÔNG xuất hiện trên trang tìm việc công khai.
2. Admin đăng nhập vào trang quản trị, mở danh sách tin chờ duyệt -> Thấy tin mới nộp kèm đầy đủ chi tiết.
3. Admin bấm "Phê duyệt" -> Tin lập tức xuất hiện trên trang tìm việc công khai cho sinh viên.
4. Nếu Admin bấm "Từ chối" kèm lý do -> Tin không xuất hiện công khai và Nhà tuyển dụng nhận được thông báo từ chối kèm lý do.

**Acceptance Scenarios**:
1. **Given** Nhà tuyển dụng đăng một tin tuyển dụng mới với đầy đủ thông tin, **When** tin được gửi lên hệ thống, **Then** trạng thái tin là "Chờ duyệt" và sinh viên/khách vãng lai không thể tìm thấy tin này trên trang việc làm công khai.
2. **Given** Quản trị viên truy cập hàng chờ duyệt tin, **When** duyệt chấp thuận một tin đang chờ, **Then** trạng thái tin chuyển thành "Đang mở" (công khai) và nhà tuyển dụng nhận được thông báo tin đã được duyệt.
3. **Given** Quản trị viên truy cập hàng chờ duyệt tin, **When** từ chối một tin và nhập lý do (ví dụ: "Thiếu địa chỉ làm việc cụ thể"), **Then** trạng thái tin chuyển thành "Bị từ chối" và nhà tuyển dụng nhận được thông báo giải thích lý do.

---

### User Story 2 - Scam Warning & Job Reporting System (Cảnh báo lừa đảo & Báo cáo vi phạm) (Priority: P1)

Là một **Sinh viên tìm việc**, tôi muốn nhìn thấy cảnh báo an toàn rõ ràng tại mỗi tin tuyển dụng (nhắc nhở không đóng tiền cọc, không giao giấy tờ gốc) và có nút báo cáo khi phát hiện tin tuyển dụng có dấu hiệu khả nghi hoặc vi phạm, để bảo vệ bản thân và cộng đồng sinh viên.  
Đồng thời, là một **Quản trị viên**, tôi muốn tiếp nhận danh sách các báo cáo vi phạm để kịp thời điều tra và xử lý khóa tin/khóa tài khoản vi phạm.

**Why this priority**: Sinh viên là đối tượng dễ bị tổn thương trước các chiêu trò lừa đảo thu phí giữ chân, bán hàng đa cấp hoặc tuyển dụng mạo danh. Đây là yêu cầu an toàn cốt lõi P0 (`PT-04` và `AD-04`) theo đúng tiêu chuẩn sàn tuyển dụng thực tế.

**Independent Test**:
1. Sinh viên mở bất kỳ chi tiết công việc nào -> Nhìn thấy khung cảnh báo an toàn nổi bật với các lưu ý không đóng tiền cọc.
2. Sinh viên bấm "Báo cáo tin vi phạm", chọn lý do (ví dụ: "Thu tiền cọc trái phép", "Thông tin sai sự thật") và gửi nội dung -> Hệ thống ghi nhận báo cáo thành công.
3. Admin đăng nhập vào mục Báo cáo vi phạm -> Thấy danh sách phản ánh mới, bấm xử lý để khóa tin hoặc khóa tài khoản nhà tuyển dụng vi phạm.

**Acceptance Scenarios**:
1. **Given** Sinh viên hoặc khách vãng lai xem chi tiết một tin tuyển dụng, **When** trang hiển thị, **Then** một khung cảnh báo an toàn việc làm sinh viên xuất hiện rõ ràng với khuyến cáo không nộp bất kỳ khoản phí tuyển dụng nào.
2. **Given** Người dùng đã đăng nhập phát hiện tin có dấu hiệu gian lận, **When** nhấn nút "Báo cáo tin này", chọn lý do và gửi mô tả, **Then** hệ thống tiếp nhận báo cáo, thông báo gửi thành công và ghi nhận vào hàng đợi xử lý của quản trị viên.
3. **Given** Quản trị viên kiểm tra danh sách báo cáo vi phạm, **When** quyết định chấp thuận báo cáo gian lận, **Then** tin tuyển dụng bị ẩn/gỡ bỏ ngay lập tức và tài khoản nhà tuyển dụng có thể bị khóa hoạt động.

---

### User Story 3 - Part-time Shift Categorization & Quick Filters (Chuẩn hóa ca làm việc & Lọc nhanh theo ca) (Priority: P2)

Là một **Sinh viên có lịch học theo ca**, tôi muốn tìm kiếm việc làm lọc nhanh theo các ca cụ thể (Ca sáng, Ca chiều, Ca tối, Ca cuối tuần, Ca linh hoạt) để nhanh chóng chọn được công việc khớp với khoảng thời gian rảnh giữa các buổi học.  
Đồng thời, là một **Nhà tuyển dụng**, tôi muốn dễ dàng chọn ca làm việc khi đăng tin tuyển dụng.

**Why this priority**: Điểm khác biệt sống còn của sàn việc làm sinh viên so với sàn việc làm văn phòng thông thường là nhu cầu làm việc theo ca kíp (Shift-based work). Việc lưu text tự do hiện tại gây khó khăn cho việc tìm kiếm chính xác.

**Independent Test**:
1. Nhà tuyển dụng tạo tin tuyển dụng và chọn phân loại ca (ví dụ: "Ca tối" hoặc "Linh hoạt") -> Thông tin ca được chuẩn hóa và hiển thị trực quan.
2. Sinh viên truy cập trang danh sách việc làm, nhấn chip lọc "Ca tối" -> Danh sách lập tức chỉ hiển thị các công việc có ca tối.

**Acceptance Scenarios**:
1. **Given** Nhà tuyển dụng ở trang đăng tin việc làm, **When** điền thông tin ca làm việc, **Then** hệ thống cung cấp các tùy chọn phân loại ca chuẩn hóa (Sáng, Chiều, Tối, Cuối tuần, Linh hoạt) bên cạnh mô tả giờ làm chi tiết.
2. **Given** Sinh viên ở trang tìm kiếm việc làm, **When** chọn một hoặc nhiều bộ lọc ca làm việc, **Then** hệ thống chỉ hiển thị các công việc thỏa mãn các ca đã chọn.
3. **Given** Người dùng xóa bộ lọc ca, **When** nhấn "Xóa bộ lọc", **Then** danh sách công việc trở về trạng thái hiển thị toàn bộ tin đang mở.

---

### User Story 4 - Secure Password Reset Flow (Đặt lại mật khẩu an toàn) (Priority: P2)

Là một **Người dùng hệ thống (Sinh viên hoặc Nhà tuyển dụng)** bị quên mật khẩu, tôi muốn có cơ chế yêu cầu đặt lại mật khẩu bằng email đã đăng ký một cách bảo mật, để có thể khôi phục quyền truy cập vào tài khoản của mình.

**Why this priority**: Đảm bảo trải nghiệm người dùng liền mạch và đáp ứng đầy đủ yêu cầu `ST-01` của hồ sơ nghiệm thu dự án.

**Independent Test**:
1. Người dùng bấm "Quên mật khẩu" tại màn hình đăng nhập, nhập email đã đăng ký.
2. Hệ thống gửi mã/token đặt lại mật khẩu an toàn mà không tiết lộ thông tin nhạy cảm.
3. Người dùng nhập mật khẩu mới và xác nhận -> Đăng nhập thành công với mật khẩu mới.

**Acceptance Scenarios**:
1. **Given** Người dùng ở trang đăng nhập, **When** nhấn liên kết "Quên mật khẩu" và nhập email, **Then** hệ thống thông báo chung về việc gửi hướng dẫn đặt lại (không tiết lộ việc email có tồn tại hay không vì lý do bảo mật).
2. **Given** Người dùng có mã/token đặt lại mật khẩu hợp lệ, **When** nhập mật khẩu mới thỏa mãn độ dài tối thiểu và xác nhận, **Then** mật khẩu tài khoản được cập nhật và người dùng có thể đăng nhập ngay với mật khẩu mới.

---

### Edge Cases

- **Tin đang tuyển bị chỉnh sửa:** Khi Nhà tuyển dụng chỉnh sửa nội dung trọng yếu (tiêu đề, lương, yêu cầu), tin có cần chuyển về trạng thái chờ duyệt lại hay không? -> *Mặc định: Các tin sửa đổi cơ bản được giữ trạng thái, nhưng nếu chỉnh sửa quy mô lớn, hệ thống ghi vết cảnh báo để Admin rà soát.*
- **Spam báo cáo vi phạm:** Một người dùng liên tục bấm báo cáo cùng một tin việc làm -> *Hệ thống giới hạn mỗi người dùng chỉ được gửi 1 báo cáo đang chờ xử lý cho 1 tin việc làm cụ thể.*
- **Hết hạn nộp hồ sơ khi đang chờ duyệt:** Nếu tin ở trạng thái chờ duyệt quá lâu đến qua ngày hạn chót (`deadline`) -> *Hệ thống tự động chuyển trạng thái hết hạn và thông báo cho nhà tuyển dụng.*
- **Khóa tài khoản NTD có nhiều tin đang mở:** Khi Admin xử lý báo cáo vi phạm và khóa tài khoản NTD -> *Toàn bộ các tin tuyển dụng đang mở của NTD đó lập tức bị ẩn khỏi kết quả tìm kiếm công khai.*

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống BẮT BUỘC hỗ trợ trạng thái "Chờ duyệt" (`PENDING_REVIEW`) trong vòng đời tin tuyển dụng, bên cạnh các trạng thái hiện có (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`).
- **FR-002**: Tin tuyển dụng mới do Nhà tuyển dụng tạo BẮT BUỘC khởi tạo ở trạng thái "Chờ duyệt", KHÔNG được hiển thị công khai cho đến khi Quản trị viên phê duyệt.
- **FR-003**: Quản trị viên BẮT BUỘC có giao diện và chức năng xem danh sách tin chờ duyệt, phê duyệt tin sang trạng thái "Đang mở", hoặc từ chối tin kèm lý do văn bản rõ ràng.
- **FR-004**: Hệ thống BẮT BUỘC gửi thông báo tự động cho Nhà tuyển dụng khi tin đăng của họ được duyệt hoặc bị từ chối.
- **FR-005**: Mọi trang chi tiết việc làm BẮT BUỘC hiển thị banner cảnh báo an toàn sinh viên với nội dung hướng dẫn phòng chống lừa đảo (không đặt cọc, không nộp phí, không nộp giấy tờ tùy thân gốc).
- **FR-006**: Người dùng đã đăng nhập BẮT BUỘC có thể gửi báo cáo phản ánh tin tuyển dụng vi phạm với các lý do chuẩn hóa (Lừa đảo/Đóng phí, Nội dung không đứng đắn, Thông tin sai lệch, Khác) kèm mô tả chi tiết.
- **FR-007**: Hệ thống BẮT BUỘC ngăn chặn việc một người dùng gửi nhiều báo cáo trùng lặp cho cùng một tin việc làm khi báo cáo cũ chưa được xử lý.
- **FR-008**: Quản trị viên BẮT BUỘC có giao diện quản lý danh sách phản ánh/báo cáo vi phạm, cho phép xem chi tiết, đánh dấu đã xử lý, hoặc thực hiện thao tác gỡ tin / khóa tài khoản vi phạm.
- **FR-009**: Hệ thống BẮT BUỘC hỗ trợ phân loại ca làm việc chuẩn hóa cho tin tuyển dụng: Sáng (`MORNING`), Chiều (`AFTERNOON`), Tối (`EVENING`), Cuối tuần (`WEEKEND`), Linh hoạt (`FLEXIBLE`).
- **FR-010**: Bộ lọc tìm kiếm việc làm BẮT BUỘC hỗ trợ lọc theo loại ca làm việc chuẩn hóa để sinh viên tìm việc phù hợp lịch học.
- **FR-011**: Hệ thống BẮT BUỘC cung cấp luồng yêu cầu đặt lại mật khẩu cho người dùng quên mật khẩu qua email, với cơ chế xác thực token/mã an toàn và không tiết lộ sự tồn tại của email qua thông báo phản hồi.

### Key Entities

- **Job (Tin tuyển dụng)**: Mở rộng trường trạng thái (`status`) với giá trị `PENDING_REVIEW` và bổ sung trường phân loại ca làm việc (`shift_type`).
- **Report (Báo cáo vi phạm)**: Thực thể lưu trữ các phản ánh của người dùng về tin tuyển dụng, bao gồm: người báo cáo (`reporter`), tin bị báo cáo (`job`), lý do (`reason`), mô tả chi tiết (`description`), trạng thái xử lý (`status`: PENDING, RESOLVED, DISMISSED), người xử lý (`resolved_by`) và thời gian giải quyết.
- **PasswordResetToken (Token đặt lại mật khẩu)**: Thực thể lưu trữ mã xác thực đặt lại mật khẩu gắn với người dùng, thời gian hết hạn và cờ đã sử dụng.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% tin tuyển dụng mới tạo được đưa vào hàng chờ kiểm duyệt và không xuất hiện trên giao diện tìm kiếm công khai trước khi Admin phê duyệt.
- **SC-002**: Quản trị viên có thể hoàn tất việc duyệt hoặc từ chối một tin tuyển dụng trong thời gian dưới 10 giây trên giao diện quản trị.
- **SC-003**: 100% các trang chi tiết việc làm hiển thị biểu ngữ cảnh báo phòng ngừa lừa đảo đạt chuẩn nhận diện thương hiệu và tương phản WCAG 2.1 AA.
- **SC-004**: Người dùng có thể gửi báo cáo phản ánh vi phạm thành công trong vòng dưới 30 giây với biểu mẫu trực quan tối đa 2 bước.
- **SC-005**: Sinh viên có thể lọc chính xác danh sách việc làm theo từng ca làm việc (Sáng, Chiều, Tối, Cuối tuần) với thời gian phản hồi dưới 300ms.
- **SC-006**: Luồng quên mật khẩu bảo đảm an toàn thông tin, không làm rò rỉ danh sách email người dùng qua lỗi xác thực.

---

## Assumptions

- Môi trường phát triển và kiểm thử hiện tại sử dụng cơ chế token đặt lại mật khẩu giả lập/ghi nhận an toàn trong hệ thống, chưa yêu cầu tích hợp dịch vụ gửi email bên thứ ba (SendGrid/AWS SES) để tránh phụ thuộc vào khóa API trả phí ngoài phạm vi đồ án.
- Phân loại ca làm việc chuẩn hóa (`shift_type`) được tích hợp bổ sung tương thích ngược với trường chuỗi mô tả tự do (`working_hours`) sẵn có trong cơ sở dữ liệu.
- Mọi thao tác kiểm duyệt tin và xử lý báo cáo vi phạm đều thuộc thẩm quyền độc quyền của vai trò Quản trị viên (`ROLE_ADMIN`).

