#!/usr/bin/env python3
"""
Build dataset for the "student part-time job marketplace" project
from OPEN, citable sources.

Sources
-------
1. VietJobs (48,092 Vietnamese job ads, Jul-Oct 2025, has part-time / internship)
   - Paper : https://arxiv.org/abs/2603.05262  (LREC 2026)
   - Code  : https://github.com/VinNLP/VietJobs
   - Data  : https://huggingface.co/datasets/dinhieufam/VietJobs
2. IT-Job-Posting (3,101 IT job ads from LinkedIn/ITviec/TopCV) - optional reference table
   - https://github.com/SonPhatTranDeveloper/IT-Job-Posting

Usage
-----
    pip install pandas huggingface_hub pyarrow
    python build_dataset.py                       # download from HF, filter part-time/intern
    python build_dataset.py --local path/to.csv   # use a local VietJobs file/folder instead
    python build_dataset.py --keep "bán thời gian|thực tập|thời vụ|freelance"

Outputs (./output)
------------------
    jobs_marketplace.csv      -> bảng `job_posts` cho nền tảng (VietJobs, đã lọc + chuẩn hóa)
    categories.csv            -> bảng `categories`
    locations.csv             -> tên địa điểm gốc trong dữ liệu
    provinces.csv             -> 34 tỉnh thành (NQ 202/2025/QH15) + tên tỉnh cũ được gộp
    province_stats.csv        -> số tin, tin hợp sinh viên, lương trung vị theo tỉnh
    location_unmapped.csv     -> địa điểm không khớp 34 tỉnh (cần xem tay)
    contract_type_counts.csv  -> thống kê giá trị contract_type thực tế (để chỉnh --keep)
    it_jobs_reference.csv     -> (tuỳ chọn, --with-it) tin IT tham khảo, KHÔNG phải part-time
    SOURCES.md                -> nguồn + giấy phép để ghi vào báo cáo
"""
import argparse
import glob
import os
import re
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

import pandas as pd

OUT = Path("output")
DEFAULT_KEEP = r"bán thời gian|part[\s-]?time|thực tập|intern|thời vụ|freelance|tự do"
STUDENT_HINT = r"sinh viên|sv\b|part[\s-]?time|bán thời gian|thực tập|thời vụ|ca (?:sáng|chiều|tối)|linh hoạt|không yêu cầu kinh nghiệm|chưa có kinh nghiệm"


# ---------- loading ----------
def read_any(path: str) -> pd.DataFrame:
    p = Path(path)
    files = [p] if p.is_file() else [Path(f) for f in glob.glob(str(p / "**" / "*.*"), recursive=True)]
    frames = []
    for f in files:
        s = f.suffix.lower()
        if s == ".csv":
            frames.append(pd.read_csv(f))
        elif s == ".parquet":
            frames.append(pd.read_parquet(f))
        elif s in (".jsonl", ".json"):
            frames.append(pd.read_json(f, lines=(s == ".jsonl")))
    if not frames:
        sys.exit(f"Không tìm thấy csv/parquet/jsonl trong {path}")
    return pd.concat(frames, ignore_index=True)


def load_vietjobs(local: str | None) -> pd.DataFrame:
    if local:
        return read_any(local)
    from huggingface_hub import snapshot_download

    d = snapshot_download(repo_id="dinhieufam/VietJobs", repo_type="dataset")
    return read_any(d)



# ---------- provinces (34 đơn vị cấp tỉnh từ 01/07/2025 - NQ 202/2025/QH15) ----------
# Mỗi tỉnh mới -> các tên (tỉnh cũ) được gộp vào. Dùng để chuẩn hóa cột location.
PROVINCES = {
    "Hà Nội": [
        "hà đông", "cầu giấy", "nam từ liêm", "bắc từ liêm", "đống đa", "thanh xuân",
        "hoàng mai", "đại kim", "ba đình", "hoàn kiếm", "hai bà trưng", "tây hồ", "long biên"
    ],
    "Huế": ["thừa thiên huế"], "Lai Châu": [], "Điện Biên": [], "Sơn La": [],
    "Lạng Sơn": [], "Quảng Ninh": [], "Thanh Hóa": [], "Nghệ An": [], "Hà Tĩnh": [], "Cao Bằng": [],
    "Tuyên Quang": ["hà giang"], "Lào Cai": ["yên bái"], "Thái Nguyên": ["bắc kạn"],
    "Phú Thọ": ["vĩnh phúc", "hòa bình"], "Bắc Ninh": ["bắc giang"], "Hưng Yên": ["thái bình"],
    "Hải Phòng": ["hải dương"], "Ninh Bình": ["hà nam", "nam định", "phủ lý", "tp phủ lý"], "Quảng Trị": ["quảng bình"],
    "Đà Nẵng": ["quảng nam"], "Quảng Ngãi": ["kon tum"], "Gia Lai": ["bình định"],
    "Khánh Hòa": ["ninh thuận"], "Lâm Đồng": ["đắk nông", "bình thuận"], "Đắk Lắk": ["phú yên"],
    "Hồ Chí Minh": [
        "bình dương", "bà rịa vũng tàu", "bà rịa - vũng tàu", "vũng tàu", "sài gòn", "hcm", "tphcm", "tp hcm",
        "quận 1", "quận 2", "quận 3", "quận 4", "quận 5", "quận 6", "quận 7", "quận 8", "quận 9", "quận 10", "quận 11", "quận 12",
        "bình thạnh", "thủ đức", "tân phú", "phú nhuận", "gò vấp", "tân bình", "bình tân", "hóc môn", "củ chi", "nhà bè"
    ],
    "Đồng Nai": ["bình phước", "biên hoà", "biên hòa"], "Tây Ninh": ["long an"],
    "Cần Thơ": ["sóc trăng", "hậu giang"], "Vĩnh Long": ["bến tre", "trà vinh"],
    "Đồng Tháp": ["tiền giang"], "Cà Mau": ["bạc liêu"], "An Giang": ["kiên giang"],
}


def _norm(x: str) -> str:
    import unicodedata
    x = unicodedata.normalize("NFD", str(x).lower().replace("đ", "d"))
    x = "".join(c for c in x if unicodedata.category(c) != "Mn")
    x = re.sub(r"\b(thanh pho|tinh|tp\.?)\b", " ", x)
    return re.sub(r"[^a-z0-9]+", " ", x).strip()


_LOOKUP = {}
for _new, _olds in PROVINCES.items():
    for _n in [_new] + _olds:
        _LOOKUP[_norm(_n)] = _new


def map_provinces(loc):
    """'hà nội, hồ chí minh' -> (['Hà Nội','Hồ Chí Minh'], [tên không nhận ra])"""
    if pd.isna(loc):
        return [], []
    ok, bad = [], []
    for part in re.split(r"[,;/|]", str(loc)):
        k = _norm(part)
        if not k:
            continue
        p = _LOOKUP.get(k)
        if p:
            if p not in ok:
                ok.append(p)
        else:
            bad.append(part.strip())
    return ok, bad


# ---------- transform ----------
def clean_text(s):
    if pd.isna(s):
        return None
    return re.sub(r"\s+", " ", str(s)).strip()


def to_marketplace(df: pd.DataFrame, keep_regex: str) -> pd.DataFrame:
    need = ["job_title", "location", "contract_type", "description"]
    miss = [c for c in need if c not in df.columns]
    if miss:
        sys.exit(f"Thiếu cột {miss}; cột hiện có: {df.columns.tolist()}")

    OUT.mkdir(exist_ok=True)
    df["contract_type"].fillna("không rõ").value_counts().rename_axis("contract_type").reset_index(
        name="n"
    ).to_csv(OUT / "contract_type_counts.csv", index=False)

    mask = df["contract_type"].fillna("").str.contains(keep_regex, case=False, regex=True)
    d = df[mask].copy()

    # dedupe on (title, location, description head)
    d["_k"] = (
        d["job_title"].fillna("").str.lower().str.strip()
        + "|" + d["location"].fillna("").str.lower().str.strip()
        + "|" + d["description"].fillna("").str[:200]
    )
    d = d.drop_duplicates("_k").drop(columns="_k").reset_index(drop=True)

    g = lambda c: d[c] if c in d.columns else pd.Series([None] * len(d))
    text_all = (g("job_title").fillna("") + " " + g("description").fillna("") + " " + g("requirements_text").fillna("")
                + " " + g("working_hours").fillna(""))

    out = pd.DataFrame({
        "job_id": [f"VJ{str(i + 1).zfill(6)}" for i in range(len(d))],
        "title": g("job_title").map(clean_text),
        "category": g("category"),
        "location": g("location").map(clean_text),
        "province": [None] * len(d),
        "provinces_all": [None] * len(d),
        "location_unmapped": [None] * len(d),
        "contract_type": g("contract_type"),
        "working_hours": g("working_hours").map(clean_text),
        "salary_text": g("salary"),
        "salary_min_million_vnd": pd.to_numeric(g("salary_min"), errors="coerce"),
        "salary_max_million_vnd": pd.to_numeric(g("salary_max"), errors="coerce"),
        "experience_required": g("experience_required"),
        "qualifications": g("qualifications"),
        "technical_skills": g("technical_skills"),
        "soft_skills": g("soft_skills"),
        "benefits": g("benefits"),
        "description": g("description").map(clean_text),
        "requirements": g("requirements_text").map(clean_text),
        # derived (heuristic, ghi rõ trong báo cáo)
        "student_friendly": text_all.str.contains(STUDENT_HINT, case=False, regex=True),
        "status": "OPEN",          # trạng thái mặc định của tin (đang tuyển)
        "source": "VietJobs (Pham Dinh et al., LREC 2026)",
        "source_url": "https://github.com/VinNLP/VietJobs",
    })
    mp = out["location"].map(map_provinces)
    out["province"] = mp.map(lambda t: t[0][0] if t[0] else None)          # tỉnh chính (đứng đầu)
    out["provinces_all"] = mp.map(lambda t: "; ".join(t[0]) if t[0] else None)
    out["location_unmapped"] = mp.map(lambda t: "; ".join(t[1]) if t[1] else None)
    return out


def write_province_outputs(out: pd.DataFrame):
    pd.DataFrame({"province_id": range(1, 35), "province_name": list(PROVINCES),
                  "merged_from_old_names": ["; ".join(v) for v in PROVINCES.values()]}) \
        .to_csv(OUT / "provinces.csv", index=False, encoding="utf-8-sig")
    ex = out.assign(p=out["provinces_all"].str.split("; ")).explode("p").dropna(subset=["p"])
    st = ex.groupby("p").agg(
        n_jobs=("job_id", "count"),
        n_student_friendly=("student_friendly", "sum"),
        salary_min_median=("salary_min_million_vnd", "median"),
        salary_max_median=("salary_max_million_vnd", "median"),
    ).reindex(list(PROVINCES)).fillna({"n_jobs": 0, "n_student_friendly": 0}).rename_axis("province").reset_index()
    st.to_csv(OUT / "province_stats.csv", index=False, encoding="utf-8-sig")
    bad = out["location_unmapped"].dropna().str.split("; ").explode().value_counts()
    bad.rename_axis("unmapped_location").reset_index(name="n").to_csv(OUT / "location_unmapped.csv", index=False, encoding="utf-8-sig")
    print(f"Tỉnh có dữ liệu: {(st.n_jobs > 0).sum()}/34 | tin có tên địa điểm chưa nhận ra: {out['location_unmapped'].notna().sum()}")


def write_lookups(out: pd.DataFrame):
    out["category"].dropna().drop_duplicates().sort_values().reset_index(drop=True).rename("category_name") \
        .rename_axis("category_id").reset_index().to_csv(OUT / "categories.csv", index=False)
    locs = (out["location"].dropna().str.split(",").explode().str.strip().drop_duplicates().sort_values())
    locs.reset_index(drop=True).rename("location_name").rename_axis("location_id").reset_index() \
        .to_csv(OUT / "locations.csv", index=False)


def get_it_reference():
    tmp = Path("_it_job_posting")
    if not tmp.exists():
        subprocess.run(["git", "clone", "--depth", "1",
                        "https://github.com/SonPhatTranDeveloper/IT-Job-Posting.git", str(tmp)], check=True)
    d = pd.read_csv(tmp / "job_descriptions.csv")
    cols = [c for c in ["title", "company", "location", "city", "description", "site", "job_url",
                        "it_role_type", "main_programming_languages", "key_technologies"] if c in d.columns]
    d[cols].to_csv(OUT / "it_jobs_reference.csv", index=False)
    return len(d)


SOURCES_MD = """# Nguồn dữ liệu

| # | Nguồn | Nội dung | Giấy phép | Link |
|---|-------|----------|-----------|------|
| 1 | VietJobs (Pham Dinh, Nguyen Huy, El-Haj, LREC 2026) | 48.092 tin tuyển dụng VN (07-10/2025), có full-time / part-time / internship | Code: MIT (GitHub); trang arXiv ghi CC BY 4.0 | https://github.com/VinNLP/VietJobs · https://huggingface.co/datasets/dinhieufam/VietJobs · https://arxiv.org/abs/2603.05262 |
| 3 | Danh sách 34 tỉnh thành | Nghị quyết 202/2025/QH15 (12/6/2025), hiệu lực 01/07/2025 | Văn bản pháp luật | https://thuvienphapluat.vn/hoi-dap-phap-luat/danh-sach-3321-dvhc-cap-xa-cua-34-tinh-thanh-sau-sap-nhap-2025-chi-tiet-ra-sao-138053823.html |
| 2 | IT-Job-Posting (SonPhatTranDeveloper) | 3.101 tin IT từ LinkedIn/ITviec/TopCV (chỉ dùng giáo dục) | xem repo | https://github.com/SonPhatTranDeveloper/IT-Job-Posting |

Trích dẫn: Hieu Pham Dinh, Hung Nguyen Huy, Mo El-Haj. *VietJobs: A Vietnamese Job Advertisement Dataset.* LREC 2026. https://aclanthology.org/2026.lrec-1.501/

Cột `student_friendly`, `status`, `job_id` là cột DO NHÓM SUY RA, không có trong dữ liệu gốc.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--local", help="đường dẫn file/thư mục VietJobs đã tải sẵn")
    ap.add_argument("--keep", default=DEFAULT_KEEP, help="regex lọc cột contract_type")
    ap.add_argument("--with-it", action="store_true", help="tải thêm IT-Job-Posting làm bảng tham khảo")
    a = ap.parse_args()

    raw = load_vietjobs(a.local)
    print(f"VietJobs thô: {len(raw):,} dòng")
    out = to_marketplace(raw, a.keep)
    out.to_csv(OUT / "jobs_marketplace.csv", index=False, encoding="utf-8-sig")
    write_lookups(out)
    write_province_outputs(out)
    (OUT / "SOURCES.md").write_text(SOURCES_MD, encoding="utf-8")
    print(f"Sau lọc part-time/thực tập + khử trùng: {len(out):,} dòng -> output/jobs_marketplace.csv")
    print("Xem output/contract_type_counts.csv để biết các giá trị contract_type thực tế.")
    if a.with_it:
        print(f"IT-Job-Posting: {get_it_reference():,} dòng -> output/it_jobs_reference.csv")


if __name__ == "__main__":
    main()
