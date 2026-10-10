# Hướng dẫn cho AI Agent: dựng dataset việc làm part-time sinh viên theo tỉnh thành

> Tài liệu này dành cho bất kỳ AI agent nào (Claude Code, Codex, Cursor, Copilot Agent, Gemini CLI...) hoặc người dùng muốn chạy `build_dataset.py`. Đọc hết mục **Quy tắc bắt buộc** trước khi làm.

## 1. Mục tiêu

Tạo bộ dữ liệu việc làm Việt Nam, có phân theo **34 tỉnh thành**, cho đề tài *"Nền tảng marketplace việc làm part-time cho sinh viên"* (Trường ĐH Văn Lang, Chuyên đề tốt nghiệp 2, chuyên ngành Công nghệ phần mềm).

Dữ liệu lấy từ nguồn công khai, có trích dẫn. Script lọc tin part-time / thực tập / thời vụ, chuẩn hóa địa điểm về 34 tỉnh thành và xuất các bảng sẵn sàng nạp vào CSDL.

## 2. Quy tắc bắt buộc (agent phải tuân thủ)

1. **Không tự bịa dữ liệu tin tuyển dụng.** Mọi dòng trong `jobs_marketplace.csv` phải đến từ VietJobs. Nếu không tải được dữ liệu, dừng lại và báo người dùng, không sinh dữ liệu giả để thay thế.
2. **Không sửa tay file CSV đầu ra.** Muốn đổi kết quả thì đổi tham số hoặc code rồi chạy lại.
3. **Luôn kiểm tra `contract_type_counts.csv` trước khi tin vào bộ lọc part-time.** Cách VietJobs ghi "part-time" chưa được xác minh (5 dòng mẫu đều là "Toàn thời gian").
4. **Ghi rõ nguồn** trong mọi báo cáo dùng dữ liệu này (xem mục 8).
5. **Các cột do nhóm suy ra** (`job_id`, `status`, `student_friendly`, `province`, `provinces_all`) không có trong dữ liệu gốc. Phải nói rõ điều này khi báo cáo.
6. Dữ liệu giả cho hồ sơ sinh viên, đơn ứng tuyển, đánh giá (nếu cần) phải **gắn nhãn là dữ liệu tổng hợp** và để trong thư mục riêng.

## 3. Nguồn dữ liệu

| Nguồn | Vai trò | Link |
|---|---|---|
| VietJobs (Pham Dinh, Nguyen Huy, El-Haj, LREC 2026), 48.092 tin, 07-10/2025, đủ 34 tỉnh thành | **Nguồn chính** | Dữ liệu: https://huggingface.co/datasets/dinhieufam/VietJobs · Code: https://github.com/VinNLP/VietJobs · Bài báo: https://arxiv.org/abs/2603.05262 |
| IT-Job-Posting (3.101 tin IT từ LinkedIn, ITviec, TopCV) | Tham khảo, **không phải part-time** | https://github.com/SonPhatTranDeveloper/IT-Job-Posting |
| Nghị quyết 202/2025/QH15 (34 đơn vị hành chính cấp tỉnh) | Chuẩn hóa tỉnh thành | https://thuvienphapluat.vn/hoi-dap-phap-luat/danh-sach-3321-dvhc-cap-xa-cua-34-tinh-thanh-sau-sap-nhap-2025-chi-tiet-ra-sao-138053823.html |

## 4. Yêu cầu môi trường

- Python 3.10 trở lên (script dùng cú pháp `str | None`).
- Truy cập được `huggingface.co` (để tải VietJobs) và `github.com` (nếu dùng `--with-it`).
- `git` đã cài (chỉ cần khi dùng `--with-it`).

```bash
pip install pandas huggingface_hub pyarrow
```

> Nếu agent chạy trong sandbox chặn HuggingFace: tải VietJobs thủ công trên máy người dùng, rồi dùng `--local` (mục 5, cách B).

## 5. Cách chạy

**Cách A: tải tự động từ HuggingFace**

```bash
python build_dataset.py --with-it
```

**Cách B: dùng dữ liệu đã tải sẵn**

```bash
# tải: huggingface-cli download dinhieufam/VietJobs --repo-type dataset --local-dir ./vietjobs_raw
python build_dataset.py --local ./vietjobs_raw --with-it
```

**Tham số**

| Tham số | Ý nghĩa | Mặc định |
|---|---|---|
| `--local PATH` | File hoặc thư mục VietJobs đã tải (đọc csv, parquet, jsonl) | tải từ HuggingFace |
| `--keep REGEX` | Regex lọc cột `contract_type` | `bán thời gian\|part-time\|thực tập\|intern\|thời vụ\|freelance\|tự do` |
| `--with-it` | Tải thêm IT-Job-Posting thành bảng tham khảo | tắt |

## 6. Quy trình chuẩn cho agent (làm theo thứ tự)

1. **Chạy lần đầu** với `--keep` mặc định.
2. **Mở `output/contract_type_counts.csv`.** Xem các giá trị `contract_type` thật và số lượng.
3. **Điều chỉnh `--keep`** nếu giá trị thật khác dự kiến (ví dụ "Bán thời gian", "Thực tập sinh"...). Chạy lại.
4. **Kiểm tra số dòng** trong `jobs_marketplace.csv`. Nếu bằng 0, bộ lọc sai. Quay lại bước 3, không tự nới lỏng sang full-time mà không hỏi người dùng.
5. **Mở `output/province_stats.csv`.** Ghi lại tỉnh nào có `n_jobs = 0` hoặc rất thấp và báo cho người dùng.
6. **Mở `output/location_unmapped.csv`.** Nếu có địa điểm không khớp 34 tỉnh, báo người dùng và đề xuất thêm tên đó vào bảng `PROVINCES` trong script (chỉ khi chắc chắn thuộc tỉnh nào).
7. **Báo cáo kết quả** theo mẫu ở mục 9.

## 7. Các file đầu ra (`./output`)

| File | Nội dung |
|---|---|
| `jobs_marketplace.csv` | Bảng tin việc làm (UTF-8 BOM, mở được bằng Excel) |
| `provinces.csv` | 34 tỉnh thành kèm tên tỉnh cũ được gộp |
| `province_stats.csv` | Số tin, số tin hợp sinh viên, lương trung vị theo tỉnh |
| `categories.csv` | Danh mục ngành nghề |
| `locations.csv` | Tên địa điểm gốc trong dữ liệu |
| `location_unmapped.csv` | Địa điểm không khớp 34 tỉnh (cần xem tay) |
| `contract_type_counts.csv` | Thống kê giá trị `contract_type` thật |
| `it_jobs_reference.csv` | Tin IT tham khảo (chỉ khi có `--with-it`) |
| `SOURCES.md` | Nguồn và giấy phép để đưa vào báo cáo |

### Các cột chính của `jobs_marketplace.csv`

| Cột | Nguồn |
|---|---|
| `job_id` | Suy ra (VJ000001...) |
| `title`, `category`, `location`, `contract_type`, `working_hours`, `salary_text`, `experience_required`, `qualifications`, `technical_skills`, `soft_skills`, `benefits`, `description`, `requirements` | VietJobs |
| `salary_min_million_vnd`, `salary_max_million_vnd` | VietJobs (đơn vị triệu đồng) |
| `province`, `provinces_all`, `location_unmapped` | Suy ra từ `location` (chuẩn hóa 34 tỉnh) |
| `student_friendly` | Suy ra bằng từ khóa ("sinh viên", "bán thời gian", "ca sáng"...) |
| `status` | Mặc định `OPEN` |
| `source`, `source_url` | Nguồn gốc |

## 8. Trích dẫn

> Hieu Pham Dinh, Hung Nguyen Huy, Mo El-Haj. *VietJobs: A Vietnamese Job Advertisement Dataset.* LREC 2026. https://aclanthology.org/2026.lrec-1.501/

Giấy phép: code VietJobs theo MIT (GitHub); trang arXiv ghi CC BY 4.0. Kiểm tra lại trên trang HuggingFace trước khi nộp báo cáo. IT-Job-Posting ghi "chỉ dùng cho mục đích giáo dục".

## 9. Mẫu báo cáo agent gửi người dùng sau khi chạy

```
- Số tin VietJobs thô: ...
- Giá trị contract_type tìm thấy (top 5): ...
- Regex --keep đã dùng: ...
- Số tin sau lọc và khử trùng: ...
- Số tỉnh có dữ liệu: x/34 (tỉnh trống: ...)
- Số tin có địa điểm chưa nhận ra: ...
- Lưu ý: ...
```

## 10. Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Không tải được từ HuggingFace | Mạng hoặc sandbox chặn | Tải thủ công rồi dùng `--local` |
| `Thiếu cột [...]` | Dữ liệu tải về khác schema mẫu | In `df.columns`, sửa tên cột trong `to_marketplace()` |
| `Không tìm thấy csv/parquet/jsonl` | Sai đường dẫn `--local` | Kiểm tra thư mục có file dữ liệu |
| Output 0 dòng | `--keep` không khớp giá trị `contract_type` | Xem `contract_type_counts.csv`, sửa regex |
| Nhiều tỉnh `n_jobs = 0` | Tin part-time tập trung ở thành phố lớn | Báo người dùng, hỏi có muốn mở rộng bộ lọc không |
| `location_unmapped.csv` có nhiều dòng | Tên địa điểm viết khác (viết tắt, tên huyện) | Thêm vào `PROVINCES` khi chắc chắn |
| Lỗi `str \| None` | Python dưới 3.10 | Nâng Python hoặc đổi sang `Optional[str]` |

## 11. Giới hạn đã biết

- Script mới được kiểm thử trên **5 dòng mẫu** của VietJobs (đều là full-time), chưa kiểm thử với dữ liệu part-time thật.
- Bảng gộp tên tỉnh cũ sang tỉnh mới là do người viết script tổng hợp, cần đối chiếu với Nghị quyết 202/2025/QH15.
- Lương part-time có thể tính theo giờ hoặc theo ngày, trong khi `salary_min/max` theo triệu đồng một tháng. Đọc `salary_text` khi phân tích lương part-time.
- Dataset chỉ có tin tuyển dụng, không có hồ sơ sinh viên, đơn ứng tuyển hay đánh giá hai chiều.
