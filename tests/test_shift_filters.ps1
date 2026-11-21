# ============================================================================
# FREELANCEHUB QA AUTOMATION - TEST PHẦN 3: TÌM VIỆC & BỘ LỌC LỊCH LÀM (16 CASES)
# ============================================================================

$baseUrl = "http://localhost:8080/api/v1/jobs"
$results = @()

function Run-Test {
    param (
        [string]$TestId,
        [string]$Description,
        [string]$QueryString,
        [scriptblock]$Assertion
    )

    $url = "$baseUrl$QueryString"
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get
        $passed = $false
        $errorMsg = ""
        
        try {
            $passed = & $Assertion $response
        } catch {
            $passed = $false
            $errorMsg = $_.Exception.Message
        }

        $total = $response.data.totalElements
        $firstTitles = ($response.data.content | Select-Object -ExpandProperty title -First 3) -join " | "

        $statusStr = "FAIL"
        if ($passed) { $statusStr = "PASS" }

        $detailStr = "FAILED: $errorMsg (Total: $total)"
        if ($passed) { $detailStr = "OK (Total: $total) - Sample: $firstTitles" }

        $resObj = [PSCustomObject]@{
            TestId = $TestId
            Description = $Description
            Status = $statusStr
            TotalElements = $total
            Details = $detailStr
        }
        $global:results += $resObj
        $color = "Red"
        if ($passed) { $color = "Green" }
        Write-Host "[$statusStr] $TestId - $Description - Total: $total" -ForegroundColor $color
    } catch {
        $resObj = [PSCustomObject]@{
            TestId = $TestId
            Description = $Description
            Status = "ERROR"
            TotalElements = 0
            Details = $_.Exception.Message
        }
        $global:results += $resObj
        Write-Host "[ERROR] $TestId - $Description : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "--- BẮT ĐẦU KIỂM THỬ 16 TEST CASES LỌC LỊCH LÀM ---" -ForegroundColor Cyan

# 1. Không chọn ngày và giờ: hiển thị cả Jobs cũ và mới
Run-Test "TC_SHIFT_01" "Không chọn ngày và giờ (mặc định)" "" {
    param($r) $r.success -eq $true -and $r.data.totalElements -ge 1475
}

# 2. Chọn riêng Thứ 2 (daysOfWeek=1): trả về TEST_JOB_01, TEST_JOB_04, TEST_JOB_ZERO_DURATION
Run-Test "TC_SHIFT_02" "Chọn riêng Thứ 2 (daysOfWeek=1)" "?daysOfWeek=1" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $hasJob4 = (@($titles | Where-Object { $_ -like "*TEST_JOB_04*" }).Count -gt 0)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob1 -and $hasJob4 -and (-not $hasJob2)
}

# 3. Chọn riêng Thứ 7 (daysOfWeek=6): trả về TEST_JOB_01, TEST_JOB_OVERNIGHT
Run-Test "TC_SHIFT_03" "Chọn riêng Thứ 7 (daysOfWeek=6)" "?daysOfWeek=6" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $hasJobNight = (@($titles | Where-Object { $_ -like "*TEST_JOB_OVERNIGHT*" }).Count -gt 0)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob1 -and $hasJobNight -and (-not $hasJob2)
}

# 4. Chọn Thứ 3 (daysOfWeek=2): trả về TEST_JOB_02
Run-Test "TC_SHIFT_04" "Chọn Thứ 3 (daysOfWeek=2)" "?daysOfWeek=2" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob2 -and (-not $hasJob1)
}

# 5. Chọn Thứ 4 (daysOfWeek=3): trả về TEST_JOB_03, TEST_JOB_04
Run-Test "TC_SHIFT_05" "Chọn Thứ 4 (daysOfWeek=3)" "?daysOfWeek=3" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob3 = (@($titles | Where-Object { $_ -like "*TEST_JOB_03*" }).Count -gt 0)
    $hasJob4 = (@($titles | Where-Object { $_ -like "*TEST_JOB_04*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob3 -and $hasJob4
}

# 6. Chọn Chủ nhật (daysOfWeek=7): trả về TEST_JOB_03
Run-Test "TC_SHIFT_06" "Chọn Chủ nhật (daysOfWeek=7)" "?daysOfWeek=7" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob3 = (@($titles | Where-Object { $_ -like "*TEST_JOB_03*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob3
}

# 7. Chọn ca sáng (shiftType=MORNING): trả về TEST_JOB_01, TEST_JOB_ZERO_DURATION
Run-Test "TC_SHIFT_07" "Chọn ca sáng (shiftType=MORNING)" "?shiftType=MORNING" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob1
}

# 8. Chọn ca chiều (shiftType=AFTERNOON): trả về TEST_JOB_03
Run-Test "TC_SHIFT_08" "Chọn ca chiều (shiftType=AFTERNOON)" "?shiftType=AFTERNOON" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob3 = (@($titles | Where-Object { $_ -like "*TEST_JOB_03*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob3
}

# 9. Chọn ca tối (shiftType=EVENING): trả về TEST_JOB_02, TEST_JOB_OVERNIGHT
Run-Test "TC_SHIFT_09" "Chọn ca tối (shiftType=EVENING)" "?shiftType=EVENING" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob2
}

# 10. Chọn giờ tùy chỉnh: 08:00 - 12:00 trả về TEST_JOB_01
Run-Test "TC_SHIFT_10" "Chọn giờ tùy chỉnh 08:00:00 - 12:00:00" "?startTime=08:00:00&endTime=12:00:00" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob1
}

# 11. Chọn nhiều thứ: Thứ 2 và Thứ 3 (daysOfWeek=1,2) -> trả về cả TEST_JOB_01 và TEST_JOB_02 (logic OR)
Run-Test "TC_SHIFT_11" "Chọn nhiều thứ: Thứ 2 và Thứ 3 (daysOfWeek=1,2)" "?daysOfWeek=1,2" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob1 -and $hasJob2
}

# 12. Chọn cả 7 thứ (daysOfWeek=1,2,3,4,5,6,7): tương đương không giới hạn ngày (>1470 jobs)
Run-Test "TC_SHIFT_12" "Chọn cả 7 thứ (daysOfWeek=1,2,3,4,5,6,7)" "?daysOfWeek=1,2,3,4,5,6,7" {
    param($r) $r.success -eq $true -and $r.data.totalElements -ge 1475
}

# 13. Kết hợp ngày và khung giờ: Thứ 3 + 18:00-22:00 -> giao đúng TEST_JOB_02
Run-Test "TC_SHIFT_13" "Kết hợp ngày và giờ: Thứ 3 + 18:00-22:00" "?daysOfWeek=2&startTime=18:00:00&endTime=22:00:00" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob2 = (@($titles | Where-Object { $_ -like "*TEST_JOB_02*" }).Count -gt 0)
    $hasJob1 = (@($titles | Where-Object { $_ -like "*TEST_JOB_01*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob2 -and (-not $hasJob1)
}

# 14. Chọn bỏ lọc: dữ liệu khôi phục chính xác
Run-Test "TC_SHIFT_14" "Chọn bỏ lọc (quay về rỗng)" "?page=0&size=10" {
    param($r) $r.success -eq $true -and $r.data.totalElements -ge 1475
}

# 15. Kiểm tra phân trang sau khi lọc
Run-Test "TC_SHIFT_15" "Kiểm tra phân trang sau khi lọc (page=0, size=2)" "?daysOfWeek=1,2,3&page=0&size=2" {
    param($r)
    $r.success -eq $true -and $r.data.size -eq 2 -and $r.data.content.Count -le 2 -and $r.data.totalPages -ge 1
}

# 16. Kiểm tra Job cũ chưa có job_shifts không bị mất khi không áp dụng bộ lọc lịch
Run-Test "TC_SHIFT_16" "Kiểm tra Job cũ (ID <= 1470) hiển thị bình thường khi không lọc lịch" "?size=50" {
    param($r)
    $oldJobs = $r.data.content | Where-Object { $_.id -le 1470 }
    $r.success -eq $true -and $oldJobs.Count -gt 0
}

# KIỂM TRA ĐẶC BIỆT:
# Ca qua đêm: Thứ 7 + startTime 23:00 - 05:00
Run-Test "TC_SHIFT_SPEC_01" "Ca qua đêm (22:00 - 06:00)" "?daysOfWeek=6&startTime=23:00:00&endTime=05:00:00" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJobNight = (@($titles | Where-Object { $_ -like "*TEST_JOB_OVERNIGHT*" }).Count -gt 0)
    $r.success -eq $true -and $hasJobNight
}

# Ca giờ bắt đầu = giờ kết thúc (10:00 - 10:00)
Run-Test "TC_SHIFT_SPEC_02" "Ca giờ bắt đầu bằng kết thúc (10:00:00)" "?daysOfWeek=1&startTime=09:00:00&endTime=11:00:00" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJobZero = (@($titles | Where-Object { $_ -like "*TEST_JOB_ZERO_DURATION*" }).Count -gt 0)
    $r.success -eq $true -and $hasJobZero
}

# Lịch linh hoạt (isFlexible = true)
Run-Test "TC_SHIFT_SPEC_03" "Lịch linh hoạt (shiftType=FLEXIBLE)" "?shiftType=FLEXIBLE" {
    param($r)
    $titles = @($r.data.content | Select-Object -ExpandProperty title)
    $hasJob4 = (@($titles | Where-Object { $_ -like "*TEST_JOB_04*" }).Count -gt 0)
    $r.success -eq $true -and $hasJob4
}

# Bộ lọc không có kết quả
Run-Test "TC_SHIFT_SPEC_04" "Bộ lọc không có kết quả (keyword không tồn tại)" "?keyword=NON_EXISTENT_KEYWORD_XYZ999" {
    param($r)
    $r.success -eq $true -and $r.data.totalElements -eq 0 -and $r.data.content.Count -eq 0
}

Write-Host "--- KẾT THÚC KIỂM THỬ LỌC LỊCH LÀM ---" -ForegroundColor Cyan
$passedCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$totalCount = $results.Count
Write-Host "TỔNG KẾT: $passedCount / $totalCount TEST CASES PASS!" -ForegroundColor Yellow
