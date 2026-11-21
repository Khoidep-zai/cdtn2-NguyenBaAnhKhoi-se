/**
 * Utility functions for text cleaning, parsing, and formatting in FreelanceHub
 */

/**
 * Replaces common mojibake sequences that can occur if UTF-8 was misinterpreted as single-byte encodings (CP850 / Latin1 / CP1252)
 */
export function cleanMojibake(text?: string): string {
  if (!text) return '';
  let res = text;

  // Direct phrase replacements for known dataset and test artifacts
  const phraseReplacements: [RegExp, string][] = [
    [/Gi├¡m s├ít/g, 'Giám sát'],
    [/Hß╗Åc thß╗æng/g, 'Hệ thống'],
    [/hß╗ç thß╗æng/g, 'hệ thống'],
    [/É├¼m/g, 'Đêm'],
    [/-æ├¬m/g, 'đêm'],
    [/Cß╗Öng t├íc vi├¬n/g, 'Cộng tác viên'],
    [/Dß╗ïch thuß║¡t/g, 'Dịch thuật'],
    [/Lß╗ïch Linh Hoß║¡t/g, 'Lịch Linh Hoạt'],
    [/Hß╗ù trß╗ú Kß╗╣ thuß║¡t/g, 'Hỗ trợ Kỹ thuật'],
    [/Chiß╗üu/g, 'Chiều'],
    [/Nh├ón vi├¬n/g, 'Nhân viên'],
    [/B├ín h├áng/g, 'Bán hàng'],
    [/Ca Tß╗æi/g, 'Ca Tối'],
    [/Pha chß║┐/g, 'Pha chế'],
    [/Ca S├íng/g, 'Ca Sáng'],
    [/Ca s├íng/g, 'Ca sáng'],
    [/Hß╗ô Ch├¡ Minh/g, 'Hồ Chí Minh'],
    [/Quß║¡n Bình Thß║¡nh/g, 'Quận Bình Thạnh'],
    [/Quß║¡n/g, 'Quận'],
    [/Thß╗®/g, 'Thứ'],
    [/thß╗®/g, 'thứ'],
    [/v├á/g, 'và'],
    [/-æ\/giß╗Ø/g, 'đ/giờ'],
    [/đ\/giß╗Ø/g, 'đ/giờ'],
    [/-æ\/dß╗▒ ├ín/g, 'đ/dự án'],
    [/M├┤ tß║ú/g, 'Mô tả'],
    [/c├┤ng viß»çc/g, 'công việc'],
    [/kiß»âm thß»¡/g, 'kiểm thử'],
    [/CB¡Öng/g, 'Cộng'],
    [/THíc/g, 'Tác'],
    [/Vi\|¬n/g, 'Viên'],
    [/MH iTrã ß¡Øng/g, 'Môi Trường'],
    [/M H i trã ß¡Øng & N—âng lã ß¡úng/g, 'Môi trường & Năng lượng'],
    [/Môi trã ß¡Øng & Năng lượng/g, 'Môi trường & Năng lượng'],
    [/CH\|Xe/g, 'Có Xe'],
    [/-Éã a-É\|\|n/g, 'Đưa Đón'],
    [/Chuß¬ùi/g, 'Chuỗi'],
    [/triß¡çu/g, 'triệu'],
    [/Đ-Éß¡ông Nai/g, 'Đồng Nai'],
    [/bi\|¬n ho\|á/g, 'Biên Hòa'],
    [/biên hoà/g, 'Biên Hòa'],
    [/Thß¡® 2 - Thß¡® 7/g, 'Thứ 2 - Thứ 7'],
    [/tß¡½/g, 'từ'],
    [/-æß\|\|n/g, 'đến'],
    [/CH\|xe cH\|ng ty -æã a-æ\|\|n/g, 'Có xe công ty đưa đón'],
    [/Lã áing theo tuß\|\|o'n/g, 'Lương theo tuần'],
    [/Linh hoß\|ít lß¡a chß¡in ng hay l hám viß¡çc trong tuß\|\|o'n/g, 'Linh hoạt lựa chọn ngày làm việc trong tuần'],
    [/Phß¡æi hß¡úp/g, 'Phối hợp'],
    [/vß¡ơi/g, 'với'],
    [/nh lón vi\|¬n/g, 'nhân viên'],
    [/hiß¡çn trã/g, 'hiện trường'],
  ];

  for (const [pattern, repl] of phraseReplacements) {
    res = res.replace(pattern, repl);
  }

  // Token-level replacements for mojibake character fragments
  const charReplacements: [RegExp, string][] = [
    [/├¡/g, 'á'],
    [/├í/g, 'á'],
    [/├á/g, 'à'],
    [/├│/g, 'ó'],
    [/├ó/g, 'ò'],
    [/├ú/g, 'ú'],
    [/├╣/g, 'ù'],
    [/├¬/g, 'ê'],
    [/├¿/g, 'è'],
    [/├®/g, 'é'],
    [/├┤/g, 'ô'],
    [/├«/g, 'î'],
    [/├║/g, 'ứ'],
    [/├ón/g, 'ân'],
    [/ß╗æ/g, 'ố'],
    [/ß╗Å/g, 'ệ'],
    [/ß║¡/g, 'ậ'],
    [/ß║┐/g, 'ế'],
    [/ß╗®/g, 'ứ'],
    [/ß╗ü/g, 'ề'],
    [/ß╗ù/g, 'ỗ'],
    [/ß╗ú/g, 'ự'],
    [/ß╗ï/g, 'ị'],
    [/ß╗Ö/g, 'ộ'],
    [/ß╗Ø/g, 'ờ'],
    [/ß╗▒/g, 'ự'],
    [/ß║ú/g, 'ả'],
    [/ß»ç/g, 'ệ'],
    [/ß»âm/g, 'ểm'],
    [/ß»¡/g, 'ử'],
    [/Kß╗╣/g, 'Kỹ'],
    [/-æ/g, 'đ'],
    [/É├¼m/g, 'Đêm'],
  ];

  for (const [pattern, repl] of charReplacements) {
    res = res.replace(pattern, repl);
  }

  return res;
}

/**
 * Parses benefits string (which could be a JSON array string "['...', '...']", 
 * a newline-separated list, or a comma/semicolon list) into an array of clean strings.
 */
export function parseBenefits(raw?: string): string[] {
  if (!raw || !raw.trim()) return [];
  const cleaned = cleanMojibake(raw.trim());

  // Check if it's formatted as array ['...', '...'] or ["...", "..."]
  if ((cleaned.startsWith('[') && cleaned.endsWith(']')) || (cleaned.startsWith('(') && cleaned.endsWith(')'))) {
    try {
      const jsonStr = cleaned.replace(/'/g, '"');
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => cleanMojibake(String(item).trim())).filter(Boolean);
      }
    } catch {
      const matches = cleaned.match(/['"]([^'"]+)['"]/g);
      if (matches && matches.length > 0) {
        return matches.map(m => cleanMojibake(m.replace(/^['"]|['"]$/g, '').trim())).filter(Boolean);
      }
    }
  }

  // Check if separated by newlines
  if (cleaned.includes('\n')) {
    return cleaned
      .split('\n')
      .map(line => cleanMojibake(line.replace(/^[-*•\s]+/, '').trim()))
      .filter(Boolean);
  }

  // Check if separated by semicolons
  if (cleaned.includes(';')) {
    return cleaned
      .split(';')
      .map(item => cleanMojibake(item.trim()))
      .filter(Boolean);
  }

  return [cleaned];
}

/**
 * Formats salary cleanly: avoids "$ 0.0 triệu", treats 0 as "Thỏa thuận"
 */
export function formatSalaryDisplay(
  salaryText?: string,
  salaryAmount?: number,
  salaryType?: string,
  language: string = 'vi'
): string {
  if (salaryText && salaryText.trim()) {
    const raw = cleanMojibake(salaryText.trim());
    if (['0.0 triệu', '0 triệu', '0.0', '0đ', '0 vnđ', '0 vnd', '$ 0.0 triệu', '$0.0 triệu'].includes(raw.toLowerCase())) {
      return language === 'vi' ? 'Thỏa thuận' : 'Negotiable';
    }
    return raw.replace(/^\$\s*/, '');
  }

  if (salaryAmount && salaryAmount > 0) {
    const formatted = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(salaryAmount) + ' đ';
    if (salaryType === 'HOURLY') return `${formatted}${language === 'vi' ? '/giờ' : '/hr'}`;
    if (salaryType === 'FIXED_PROJECT') return `${formatted}${language === 'vi' ? ' (trọn gói)' : ' (fixed)'}`;
    return `${formatted}${language === 'vi' ? '/tháng' : '/mo'}`;
  }

  return language === 'vi' ? 'Thỏa thuận' : 'Negotiable';
}

/**
 * Cleanly formats location (province + district/address)
 */
export function formatLocationDisplay(province?: string, location?: string, language: string = 'vi'): string {
  const p = cleanMojibake(province?.trim());
  const l = cleanMojibake(location?.trim());

  if (p && l) {
    if (p.toLowerCase() === l.toLowerCase()) {
      return p;
    }
    const capL = l.charAt(0).toUpperCase() + l.slice(1);
    return `${p} - ${capL}`;
  }

  if (p) return p;
  if (l) return l.charAt(0).toUpperCase() + l.slice(1);

  return language === 'vi' ? 'Toàn quốc (Remote)' : 'Nationwide (Remote)';
}
