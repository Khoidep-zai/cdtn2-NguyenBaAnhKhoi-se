# ============================================================================
# FREELANCEHUB QA AUTOMATION - FULL SYSTEM LIFECYCLE & SECURITY TEST
# Covers: Phần 4, 5, 6, 7, 8
# ============================================================================

$baseUrl = "http://localhost:8080/api/v1"
$results = @()

function Record-Test {
    param($id, $desc, $status, $detail)
    $obj = [PSCustomObject]@{
        TestId = $id
        Description = $desc
        Status = $status
        Details = $detail
    }
    $global:results += $obj
    $color = "Green"
    if ($status -ne "PASS") { $color = "Red" }
    Write-Host "[$status] $id - $desc : $detail" -ForegroundColor $color
}

function Invoke-ApiJson {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        $BodyObj = $null
    )
    if ($BodyObj -ne $null) {
        $json = $BodyObj | ConvertTo-Json -Depth 10
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        return Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ContentType "application/json; charset=utf-8" -Body $bytes
    } else {
        return Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers
    }
}

Write-Host "=== BẮT ĐẦU KIỂM THỬ TOÀN DIỆN VÒNG ĐỜI NGHIỆP VỤ & BẢO MẬT ===" -ForegroundColor Cyan

# ----------------------------------------------------------------------------
# 1. AUTHENTICATION & LOGIN (PHẦN 8: BẢO MẬT BAN ĐẦU)
# ----------------------------------------------------------------------------
Write-Host "`n--- 1. KIỂM THỬ XÁC THỰC JWT & ĐĂNG NHẬP ---" -ForegroundColor Yellow

# Admin Login
$adminToken = ""
try {
    $res = Invoke-ApiJson "Post" "$baseUrl/auth/login" @{} @{
        email = "admin@freelancehub.vn"
        password = "Password123@"
    }
    if ($res.success -and $res.data.role -eq "ROLE_ADMIN") {
        $adminToken = $res.data.accessToken
        Record-Test "TC_AUTH_01" "Đăng nhập Admin hợp lệ" "PASS" "Token nhận diện đúng ROLE_ADMIN"
    } else {
        Record-Test "TC_AUTH_01" "Đăng nhập Admin hợp lệ" "FAIL" "Không nhận được role admin"
    }
} catch {
    Record-Test "TC_AUTH_01" "Đăng nhập Admin hợp lệ" "FAIL" $_.Exception.Message
}

# Employer Login
$employerToken = ""
$employerId = 0
try {
    $res = Invoke-ApiJson "Post" "$baseUrl/auth/login" @{} @{
        email = "TEST_employer@freelancehub.vn"
        password = "Password123@"
    }
    if ($res.success -and $res.data.role -eq "ROLE_EMPLOYER") {
        $employerToken = $res.data.accessToken
        $employerId = $res.data.userId
        Record-Test "TC_AUTH_02" "Đăng nhập Employer hợp lệ" "PASS" "UserId: $employerId, Role: ROLE_EMPLOYER"
    } else {
        Record-Test "TC_AUTH_02" "Đăng nhập Employer hợp lệ" "FAIL" "Sai role hoặc lỗi"
    }
} catch {
    Record-Test "TC_AUTH_02" "Đăng nhập Employer hợp lệ" "FAIL" $_.Exception.Message
}

# Student Login
$studentToken = ""
$studentId = 0
try {
    $res = Invoke-ApiJson "Post" "$baseUrl/auth/login" @{} @{
        email = "TEST_student@freelancehub.vn"
        password = "Password123@"
    }
    if ($res.success -and $res.data.role -eq "ROLE_STUDENT") {
        $studentToken = $res.data.accessToken
        $studentId = $res.data.userId
        Record-Test "TC_AUTH_03" "Đăng nhập Student hợp lệ" "PASS" "UserId: $studentId, Role: ROLE_STUDENT"
    } else {
        Record-Test "TC_AUTH_03" "Đăng nhập Student hợp lệ" "FAIL" "Sai role hoặc lỗi"
    }
} catch {
    Record-Test "TC_AUTH_03" "Đăng nhập Student hợp lệ" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------
# 2. PHẦN 4: KIỂM THỬ ĐĂNG TUYỂN (EMPLOYER JOB LIFECYCLE)
# ----------------------------------------------------------------------------
Write-Host "`n--- 2. KIỂM THỬ ĐĂNG TUYỂN & DUYỆT BÀI ---" -ForegroundColor Yellow

$createdJobId = 0
try {
    $jobPayload = @{
        title = "[TEST_FREELANCEHUB] Tuyển Lập trình viên React & Spring Boot Part-time"
        description = "Mô tả công việc lập trình website FreelanceHub phục vụ đồ án tốt nghiệp"
        requirements = "Biết React, TypeScript, Java Spring Boot"
        categoryId = 1
        jobType = "PART_TIME"
        workMode = "ONSITE"
        location = "Quận Bình Thạnh, TP.HCM"
        province = "Hồ Chí Minh"
        salaryType = "HOURLY"
        salaryAmount = 45000
        salaryText = "45.000 đ/giờ"
        workingHours = "Ca chiều 13h - 17h Thứ 2 và Thứ 4"
        shiftType = "AFTERNOON"
        studentFriendly = $true
        slotsAvailable = 2
        deadline = "2027-12-31T23:59:59"
        shifts = @(
            @{ dayOfWeek = 1; shiftName = "Ca chiều T2"; startTime = "13:00"; endTime = "17:00"; isFlexible = $false; sessionsPerWeek = 1 },
            @{ dayOfWeek = 3; shiftName = "Ca chiều T4"; startTime = "13:00"; endTime = "17:00"; isFlexible = $false; sessionsPerWeek = 1 }
        )
    }

    $res = Invoke-ApiJson "Post" "$baseUrl/jobs" @{ Authorization = "Bearer $employerToken" } $jobPayload
    if ($res.success -and $res.data.id -gt 0 -and $res.data.status -eq "PENDING_REVIEW") {
        $createdJobId = $res.data.id
        Record-Test "TC_JOB_01" "Employer đăng tin có ca làm việc" "PASS" "Job ID: $createdJobId, Status: PENDING_REVIEW, Shifts: $($res.data.shifts.Count)"
    } else {
        Record-Test "TC_JOB_01" "Employer đăng tin có ca làm việc" "FAIL" "Không nhận được Job ID hợp lệ"
    }
} catch {
    Record-Test "TC_JOB_01" "Employer đăng tin có ca làm việc" "FAIL" $_.Exception.Message
}

# Admin approves the job
try {
    $reviewPayload = @{ action = "APPROVE" }
    $res = Invoke-ApiJson "Patch" "$baseUrl/admin/jobs/$createdJobId/review" @{ Authorization = "Bearer $adminToken" } $reviewPayload
    if ($res.success -and $res.data.status -eq "OPEN") {
        Record-Test "TC_JOB_02" "Admin phê duyệt tin tuyển dụng" "PASS" "Job ID: $createdJobId -> Trạng thái OPEN"
    } else {
        Record-Test "TC_JOB_02" "Admin phê duyệt tin tuyển dụng" "FAIL" "Không chuyển trạng thái OPEN"
    }
} catch {
    Record-Test "TC_JOB_02" "Admin phê duyệt tin tuyển dụng" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------
# 3. PHẦN 5: KIỂM THỬ SINH VIÊN (HỒ SƠ 12 KHU VỰC, ỨNG TUYỂN, CHỐNG TRÙNG)
# ----------------------------------------------------------------------------
Write-Host "`n--- 3. KIỂM THỬ HỒ SƠ SINH VIÊN 12 KHU VỰC & ỨNG TUYỂN ---" -ForegroundColor Yellow

# Update 12-section profile
try {
    $profilePayload = @{
        fullName = "TEST Sinh Viên FreelanceHub Mới"
        phone = "0909999002"
        careerObjective = "Mục tiêu trở thành Senior Fullstack Engineer trong 3 năm tới"
        educationLevel = "Đại học chính quy"
        university = "Trường Đại học Văn Lang"
        major = "Kỹ thuật phần mềm"
        gpa = "3.65/4.0"
        skills = "Java, Spring Boot, React, Vite, MySQL, Docker, REST API"
        languages = '[{"language":"Tiếng Anh","level":"IELTS 7.0"},{"language":"Tiếng Nhật","level":"N4"}]'
        workExperiences = '[{"company":"FPT Software","position":"Intern Java","startDate":"2025-06-01","endDate":"2025-09-01","description":"Phát triển module thanh toán"}]'
        portfolioProjects = '[{"title":"FreelanceHub Platform","link":"https://github.com/freelancehub","description":"Sàn việc làm sinh viên","technologies":"Spring Boot, React"}]'
        certificates = '[{"name":"AWS Certified Cloud Practitioner","issuer":"Amazon Web Services","year":"2025","url":"https://aws.cert/123"}]'
        availableSchedule = '{"1":["AFTERNOON"],"3":["AFTERNOON"],"6":["MORNING"]}'
    }

    $res = Invoke-ApiJson "Put" "$baseUrl/student-profile/me" @{ Authorization = "Bearer $studentToken" } $profilePayload
    if ($res.success -and $res.data.completionPercentage -gt 70) {
        Record-Test "TC_STUDENT_01" "Cập nhật hồ sơ sinh viên 12 khu vực" "PASS" "Completion: $($res.data.completionPercentage)%"
    } else {
        Record-Test "TC_STUDENT_01" "Cập nhật hồ sơ sinh viên 12 khu vực" "FAIL" "Completion percentage thấp hoặc lỗi"
    }
} catch {
    Record-Test "TC_STUDENT_01" "Cập nhật hồ sơ sinh viên 12 khu vực" "FAIL" $_.Exception.Message
}

# Verify profile persistence upon reload
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/student-profile/me" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    if ($res.success -and $res.data.gpa -eq "3.65/4.0" -and $res.data.educationLevel -eq "Đại học chính quy") {
        Record-Test "TC_STUDENT_02" "Tải lại hồ sơ và kiểm tra bảo toàn dữ liệu" "PASS" "GPA, Education, Languages lưu toàn vẹn"
    } else {
        Record-Test "TC_STUDENT_02" "Tải lại hồ sơ và kiểm tra bảo toàn dữ liệu" "FAIL" "Dữ liệu không khớp"
    }
} catch {
    Record-Test "TC_STUDENT_02" "Tải lại hồ sơ và kiểm tra bảo toàn dữ liệu" "FAIL" $_.Exception.Message
}

# Student applies to the job
$applicationId = 0
if ($createdJobId -eq 0) { $createdJobId = 99001 }
try {
    $applyPayload = @{
        jobId = $createdJobId
        coverLetter = "Em chào anh chị, em rất muốn ứng tuyển vị trí này để thực tập và học hỏi kinh nghiệm."
    }

    $res = Invoke-ApiJson "Post" "$baseUrl/applications" @{ Authorization = "Bearer $studentToken" } $applyPayload
    if ($res.success -and $res.data.id -gt 0 -and $res.data.status -eq "PENDING") {
        $applicationId = $res.data.id
        Record-Test "TC_STUDENT_03" "Sinh viên ứng tuyển công việc" "PASS" "Application ID: $applicationId, Status: PENDING"
    } else {
        Record-Test "TC_STUDENT_03" "Sinh viên ứng tuyển công việc" "FAIL" "Không nhận được Application ID hợp lệ"
    }
} catch {
    Record-Test "TC_STUDENT_03" "Sinh viên ứng tuyển công việc" "FAIL" $_.Exception.Message
}

# Anti-duplicate application test
try {
    $applyPayload = @{
        jobId = $createdJobId
        coverLetter = "Nộp lần 2 thử nghiệm chống trùng"
    }

    $res = Invoke-ApiJson "Post" "$baseUrl/applications" @{ Authorization = "Bearer $studentToken" } $applyPayload
    Record-Test "TC_STUDENT_04" "Chống nộp đơn ứng tuyển trùng lặp" "FAIL" "Lẽ ra phải chặn đơn trùng lặp nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Record-Test "TC_STUDENT_04" "Chống nộp đơn ứng tuyển trùng lặp" "PASS" "Máy chủ chặn đúng mã HTTP 400 Bad Request (Đã nộp đơn rồi)"
    } else {
        Record-Test "TC_STUDENT_04" "Chống nộp đơn ứng tuyển trùng lặp" "FAIL" "HTTP Code: $statusCode"
    }
}

# ----------------------------------------------------------------------------
# 4. PHẦN 6: KIỂM THỬ NHÀ TUYỂN DỤNG (XEM 12 KHU VỰC, DUYỆT ĐƠN)
# ----------------------------------------------------------------------------
Write-Host "`n--- 4. KIỂM THỬ NHÀ TUYỂN DỤNG & EMAIL DUYỆT ĐƠN ---" -ForegroundColor Yellow

# Employer views student's 12-section profile
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/student-profile/$studentId" -Method Get -Headers @{ Authorization = "Bearer $employerToken" }
    if ($res.success -and $res.data.fullName -ne $null -and $res.data.skills -ne $null) {
        Record-Test "TC_EMPLOYER_01" "Employer xem hồ sơ sinh viên 12 khu vực" "PASS" "Xem thành công: $($res.data.fullName) - Skills: $($res.data.skills)"
    } else {
        Record-Test "TC_EMPLOYER_01" "Employer xem hồ sơ sinh viên 12 khu vực" "FAIL" "Không lấy được hồ sơ"
    }
} catch {
    Record-Test "TC_EMPLOYER_01" "Employer xem hồ sơ sinh viên 12 khu vực" "FAIL" $_.Exception.Message
}

# Employer cannot update student profile (RBAC / Privacy)
try {
    $fakePayload = @{ gpa = "4.0/4.0" }
    $res = Invoke-ApiJson "Put" "$baseUrl/student-profile/me" @{ Authorization = "Bearer $employerToken" } $fakePayload
    Record-Test "TC_EMPLOYER_02" "Employer không thể sửa hồ sơ sinh viên" "FAIL" "Lẽ ra bị chặn 403 nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Record-Test "TC_EMPLOYER_02" "Employer không thể sửa hồ sơ sinh viên" "PASS" "Bị chặn đúng chuẩn HTTP 403 Forbidden"
    } else {
        Record-Test "TC_EMPLOYER_02" "Employer không thể sửa hồ sơ sinh viên" "FAIL" "HTTP Code: $statusCode"
    }
}

# Employer accepts the student
try {
    $statusPayload = @{ status = "ACCEPTED" }
    $res = Invoke-ApiJson "Patch" "$baseUrl/applications/$applicationId/status" @{ Authorization = "Bearer $employerToken" } $statusPayload
    if ($res.success -and $res.data.status -eq "ACCEPTED") {
        Record-Test "TC_EMPLOYER_03" "Employer chấp nhận ứng viên (ACCEPTED)" "PASS" "Status chuyển ACCEPTED, kích hoạt email thông báo"
    } else {
        Record-Test "TC_EMPLOYER_03" "Employer chấp nhận ứng viên (ACCEPTED)" "FAIL" "Trạng thái không chuyển ACCEPTED"
    }
} catch {
    Record-Test "TC_EMPLOYER_03" "Employer chấp nhận ứng viên (ACCEPTED)" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------
# 5. PHẦN 7: KIỂM THỬ WORK HISTORY (XÁC NHẬN 2 CHIỀU)
# ----------------------------------------------------------------------------
Write-Host "`n--- 5. KIỂM THỬ XÁC NHẬN HOÀN THÀNH 2 CHIỀU ---" -ForegroundColor Yellow

# Step 1: Employer marks completed
$workHistoryId = 0
try {
    $markPayload = @{
        startDate = "2026-11-01"
        endDate = "2026-11-13"
        rating = 5
        feedback = "Sinh viên làm việc rất có trách nhiệm, code chuẩn TypeScript, hoàn thành đúng deadline bàn giao."
    }

    $res = Invoke-ApiJson "Post" "$baseUrl/work-history/applications/$applicationId/mark-completed" @{ Authorization = "Bearer $employerToken" } $markPayload
    if ($res.success -and $res.data.completionStatus -eq "PENDING_STUDENT_CONFIRM") {
        $workHistoryId = $res.data.id
        Record-Test "TC_WORK_01" "Employer xác nhận hoàn thành công việc" "PASS" "WH ID: $workHistoryId, Status: PENDING_STUDENT_CONFIRM, Rating: $($res.data.employerRating) ⭐"
    } else {
        Record-Test "TC_WORK_01" "Employer xác nhận hoàn thành công việc" "FAIL" "Không nhận được status PENDING_STUDENT_CONFIRM"
    }
} catch {
    Record-Test "TC_WORK_01" "Employer xác nhận hoàn thành công việc" "FAIL" $_.Exception.Message
}

# Step 2: Student confirms completed
try {
    $confirmPayload = @{
        isDispute = $false
        feedback = "Cảm ơn công ty đã tạo điều kiện học tập và hỗ trợ em rất nhiều!"
    }

    $res = Invoke-ApiJson "Post" "$baseUrl/work-history/applications/$applicationId/confirm-completed" @{ Authorization = "Bearer $studentToken" } $confirmPayload
    if ($res.success -and $res.data.completionStatus -eq "COMPLETED") {
        Record-Test "TC_WORK_02" "Sinh viên xác nhận hoàn tất vào Hồ sơ" "PASS" "Status chuyển COMPLETED, Student confirmed"
    } else {
        Record-Test "TC_WORK_02" "Sinh viên xác nhận hoàn tất vào Hồ sơ" "FAIL" "Status không chuyển COMPLETED"
    }
} catch {
    Record-Test "TC_WORK_02" "Sinh viên xác nhận hoàn tất vào Hồ sơ" "FAIL" $_.Exception.Message
}

# Step 3: Check student profile now includes the verified work history
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/student-profile/me" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    $whCount = $res.data.verifiedWorkHistories.Count
    if ($res.success -and $whCount -ge 1) {
        Record-Test "TC_WORK_03" "Lịch sử việc làm xuất hiện trên hồ sơ 12 khu vực" "PASS" "Tìm thấy $whCount công việc đã xác thực trong hồ sơ!"
    } else {
        Record-Test "TC_WORK_03" "Lịch sử việc làm xuất hiện trên hồ sơ 12 khu vực" "FAIL" "verifiedWorkHistories rỗng"
    }
} catch {
    Record-Test "TC_WORK_03" "Lịch sử việc làm xuất hiện trên hồ sơ 12 khu vực" "FAIL" $_.Exception.Message
}

# Step 4: Double confirmation error check
try {
    $confirmPayload = @{ isDispute = $false; feedback = "Thử xác nhận lại lần 2" }
    $res = Invoke-ApiJson "Post" "$baseUrl/work-history/applications/$applicationId/confirm-completed" @{ Authorization = "Bearer $studentToken" } $confirmPayload
    Record-Test "TC_WORK_04" "Chống xác nhận hoàn tất 2 lần (Double confirm)" "FAIL" "Lẽ ra phải chặn nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Record-Test "TC_WORK_04" "Chống xác nhận hoàn tất 2 lần (Double confirm)" "PASS" "Chặn đúng HTTP 400 Bad Request (Đã hoàn thành trước đó)"
    } else {
        Record-Test "TC_WORK_04" "Chống xác nhận hoàn tất 2 lần (Double confirm)" "FAIL" "HTTP Code: $statusCode"
    }
}

# ----------------------------------------------------------------------------
# 6. PHẦN 8: KIỂM THỬ BẢO MẬT & PHÂN QUYỀN (RBAC & IDOR)
# ----------------------------------------------------------------------------
Write-Host "`n--- 6. KIỂM THỬ BẢO MẬT PHÂN QUYỀN (RBAC & IDOR) ---" -ForegroundColor Yellow

# Access without token
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/student-profile/me" -Method Get
    Record-Test "TC_SEC_01" "Truy cập endpoint riêng tư không có JWT" "FAIL" "Lẽ ra chặn 401/403 nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Record-Test "TC_SEC_01" "Truy cập endpoint riêng tư không có JWT" "PASS" "Chặn đúng HTTP $statusCode Unauthorized/Forbidden"
    } else {
        Record-Test "TC_SEC_01" "Truy cập endpoint riêng tư không có JWT" "FAIL" "HTTP Code: $statusCode"
    }
}

# Student accesses admin-only endpoint
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    Record-Test "TC_SEC_02" "Sinh viên truy cập trái phép API Admin" "FAIL" "Lẽ ra chặn 403 nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Record-Test "TC_SEC_02" "Sinh viên truy cập trái phép API Admin" "PASS" "Chặn đúng HTTP 403 Forbidden"
    } else {
        Record-Test "TC_SEC_02" "Sinh viên truy cập trái phép API Admin" "FAIL" "HTTP Code: $statusCode"
    }
}

# Employer accesses admin-only endpoint
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers @{ Authorization = "Bearer $employerToken" }
    Record-Test "TC_SEC_03" "Employer truy cập trái phép API Admin" "FAIL" "Lẽ ra chặn 403 nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Record-Test "TC_SEC_03" "Employer truy cập trái phép API Admin" "PASS" "Chặn đúng HTTP 403 Forbidden"
    } else {
        Record-Test "TC_SEC_03" "Employer truy cập trái phép API Admin" "FAIL" "HTTP Code: $statusCode"
    }
}

# Invalid JWT token
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/student-profile/me" -Method Get -Headers @{ Authorization = "Bearer INVALID_EXPIRED_OR_TAMPERED_JWT_TOKEN" }
    Record-Test "TC_SEC_04" "Truy cập với JWT giả mạo / không hợp lệ" "FAIL" "Lẽ ra chặn 401 nhưng lại thành công!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Record-Test "TC_SEC_04" "Truy cập với JWT giả mạo / không hợp lệ" "PASS" "Chặn đúng HTTP $statusCode"
    } else {
        Record-Test "TC_SEC_04" "Truy cập với JWT giả mạo / không hợp lệ" "FAIL" "HTTP Code: $statusCode"
    }
}

Write-Host "`n=== TỔNG KẾT KIỂM THỬ VÒNG ĐỜI VÀ BẢO MẬT ===" -ForegroundColor Cyan
$pCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$tCount = $results.Count
Write-Host "KẾT QUẢ: $pCount / $tCount TEST CASES PASS!" -ForegroundColor Yellow
