import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  vi: {
    // Navigation
    'nav.brand': 'FreelanceHub',
    'nav.home': 'Trang chủ',
    'nav.jobs': 'Tìm việc làm',
    'nav.applications': 'Đơn ứng tuyển',
    'nav.profile': 'Hồ sơ CV',
    'nav.myJobs': 'Quản lý tin',
    'nav.postJob': 'Đăng tin mới',
    'nav.admin': 'Quản trị Admin',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'theme.toDark': 'Chuyển sang chế độ tối',
    'theme.toLight': 'Chuyển sang chế độ sáng',
    'lang.toEnglish': 'Switch to English',
    'lang.toVietnamese': 'Chuyển sang Tiếng Việt',

    // Home Page
    'home.badge': '1.470+ Việc làm VietJobs chuẩn hóa theo Nghị quyết 202/2025/QH15',
    'home.heroTitle1': 'Tìm việc làm thêm an toàn,',
    'home.heroTitle2': 'Bứt phá kỹ năng & Thu nhập',
    'home.heroDesc': 'Nền tảng kết nối sinh viên với các công việc part-time, dự án freelance và kỳ thực tập ngắn hạn. Xác minh độ uy tín, thanh toán minh bạch, linh hoạt theo lịch học trên cả hai nền tảng PostgreSQL & MySQL.',
    'home.searchPlaceholder': 'Nhập vị trí công việc, kỹ năng (ví dụ: Barista, Lập trình React, Gia sư, Content...)',
    'home.searchBtn': 'Tìm kiếm việc làm',
    'home.popularProvinces': 'Tỉnh thành phổ biến:',
    'home.statJobs': 'Việc làm bán thời gian & Freelance',
    'home.statCats': 'Nhóm ngành nghề tiêu chuẩn',
    'home.statProvs': 'Tỉnh/Thành phố toàn quốc',
    'home.statDb': 'Hỗ trợ đồng bộ 2 CSDL cốt lõi',
    'home.catTitle': 'Khám phá theo ngành nghề',
    'home.catDesc': 'Chọn lĩnh vực phù hợp với chuyên ngành và sở thích của bạn',
    'home.featuredTitle': 'Việc làm nổi bật mới nhất',
    'home.featuredDesc': 'Các vị trí part-time, dự án freelance và thực tập sinh đang mở tuyển',
    'home.viewAll': 'Xem tất cả 1.470+ việc làm',
    'home.trust1Title': '100% Tin tuyển dụng xác minh',
    'home.trust1Desc': 'Bảo vệ sinh viên khỏi các bẫy cọc tiền, tin tuyển dụng ảo và vi phạm luật lao động.',
    'home.trust2Title': 'Đánh giá 2 chiều minh bạch',
    'home.trust2Desc': 'Xây dựng hồ sơ uy tín thực tế cho cả sinh viên và nhà tuyển dụng sau mỗi công việc.',
    'home.trust3Title': 'Linh hoạt đa cơ sở dữ liệu',
    'home.trust3Desc': 'Hệ thống hỗ trợ đồng bộ hoàn hảo trên cả PostgreSQL 18 và MySQL 8 với 1.470+ việc làm thực tế.',

    // Browse Page
    'browse.headerBadge': 'Dữ liệu việc làm thực tế VietJobs (1.470+ việc làm đã chuẩn hóa)',
    'browse.title': 'Tìm kiếm việc làm part-time, thực tập & freelance',
    'browse.desc': 'Tuyển chọn công việc bán thời gian, dự án freelance và thực tập sinh an toàn, minh bạch, phù hợp với lịch học sinh viên theo Nghị quyết 202/2025/QH15.',
    'browse.searchPlaceholder': 'Nhập tên việc làm, kỹ năng, công ty (Barista, React, Marketing, Gia sư...)...',
    'browse.searchBtn': 'Tìm kiếm',
    'browse.clearFilters': 'Xóa bộ lọc',
    'browse.provinceLabel': 'Tỉnh / Thành phố',
    'browse.allProvinces': '📍 Tất cả tỉnh thành',
    'browse.categoryLabel': 'Ngành nghề / Danh mục',
    'browse.allCategories': '📁 Tất cả ngành nghề',
    'browse.typeLabel': 'Hình thức công việc',
    'browse.allTypes': '💼 Tất cả hình thức',
    'browse.partTime': 'Việc làm Part-time',
    'browse.freelance': 'Dự án Freelance',
    'browse.internship': 'Thực tập sinh (Internship)',
    'browse.modeLabel': 'Chế độ làm việc',
    'browse.allModes': '🏢 Tất cả chế độ',
    'browse.onsite': 'Làm tại chỗ (Onsite)',
    'browse.remote': 'Làm việc từ xa (Remote)',
    'browse.hybrid': 'Linh hoạt kết hợp (Hybrid)',
    'browse.quickFilter': 'Lọc nhanh:',
    'browse.studentFriendly': 'Phù hợp sinh viên',
    'browse.found': 'Tìm thấy',
    'browse.matchingJobs': 'công việc phù hợp',
    'browse.in': 'tại',
    'browse.forStudents': '(dành cho sinh viên)',
    'browse.page': 'Trang',
    'browse.prevPage': 'Trang trước',
    'browse.nextPage': 'Trang sau',
    'browse.noJobsTitle': 'Không tìm thấy công việc phù hợp',
    'browse.noJobsDesc': 'Hãy thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.',
    'browse.resetAll': 'Xóa tất cả bộ lọc',
    'browse.loading': 'Đang tải dữ liệu việc làm từ hệ thống...',

    // Job Card & Detail
    'job.forStudentsBadge': 'Cho sinh viên',
    'job.viewDetail': 'Xem chi tiết & Ứng tuyển',
    'job.applyNow': 'Ứng tuyển ngay',
    'job.applied': 'Đã nộp hồ sơ ứng tuyển',
    'job.loginToApply': 'Đăng nhập để ứng tuyển',
    'job.employerNotice': '(Tài khoản Nhà tuyển dụng không thể ứng tuyển)',
    'job.back': 'Quay lại danh sách việc làm',
    'job.salary': 'Mức lương / Thù lao',
    'job.location': 'Địa điểm làm việc',
    'job.workingHours': 'Thời gian làm việc',
    'job.benefits': '🎁 Quyền lợi & Đãi ngộ',
    'job.description': 'Mô tả công việc',
    'job.requirements': 'Yêu cầu công việc',
    'job.open': 'Đang nhận hồ sơ',
    'job.deadline': 'Hạn nộp hồ sơ',
    'job.unlimited': 'Không giới hạn',
    'job.applyModalTitle': 'Nộp hồ sơ ứng tuyển',
    'job.applyModalIntro': 'Gửi lời giới thiệu ngắn (Cover letter) của bạn đến',
    'job.coverLetterPlaceholder': 'Chào anh/chị, em là sinh viên trường ĐH Văn Lang, em rất quan tâm đến vị trí này...',
    'job.cancel': 'Hủy',
    'job.submit': 'Xác nhận gửi đơn',
    'job.submitting': 'Đang gửi...',

    // Auth Page
    'auth.loginTitle': 'Đăng nhập',
    'auth.loginSubtitle': 'Chào mừng bạn quay trở lại FreelanceHub',
    'auth.registerTitle': 'Tạo tài khoản mới',
    'auth.registerSubtitle': 'Tham gia hệ sinh thái việc làm sinh viên Nhóm 8',
    'auth.roleLabel': 'Bạn là:',
    'auth.roleStudent': 'Sinh viên tìm việc',
    'auth.roleEmployer': 'Nhà tuyển dụng',
    'auth.fullName': 'Họ và tên',
    'auth.phone': 'Số điện thoại',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.passwordMin': 'Mật khẩu (tối thiểu 6 ký tự)',
    'auth.university': 'Trường Đại học',
    'auth.companyName': 'Tên Công ty / Cửa hàng',
    'auth.loginBtn': 'Đăng nhập',
    'auth.loggingIn': 'Đang xác thực...',
    'auth.registerBtn': 'Hoàn tất đăng ký',
    'auth.registering': 'Đang xử lý đăng ký...',
    'auth.noAccount': 'Chưa có tài khoản?',
    'auth.registerNow': 'Đăng ký ngay',
    'auth.hasAccount': 'Đã có tài khoản?',
    'auth.loginNow': 'Đăng nhập ngay',

    // Footer
    'footer.brand': 'FreelanceHub — Marketplace việc làm sinh viên',
    'footer.course': 'Đồ án môn học: Chuyên đề tốt nghiệp 2 (261_71ITGR40303_04) — Khoa Công nghệ Thông tin, Trường Đại học Văn Lang.',
    'footer.team': 'Thực hiện bởi Nhóm 8: Nguyễn Tấn Tài (PM), Nguyễn Bá Anh Khôi (BA), Hoàng Bảo Long (Tester)',
  },
  en: {
    // Navigation
    'nav.brand': 'FreelanceHub',
    'nav.home': 'Home',
    'nav.jobs': 'Find Jobs',
    'nav.applications': 'Applications',
    'nav.profile': 'Resume / CV',
    'nav.myJobs': 'Manage Postings',
    'nav.postJob': 'Post New Job',
    'nav.admin': 'Admin Portal',
    'nav.login': 'Log In',
    'nav.register': 'Sign Up',
    'nav.logout': 'Log Out',
    'theme.toDark': 'Switch to dark mode',
    'theme.toLight': 'Switch to light mode',
    'lang.toEnglish': 'Switch to English',
    'lang.toVietnamese': 'Chuyển sang Tiếng Việt',

    // Home Page
    'home.badge': '1,470+ Standardized VietJobs positions conforming to Res. 202/2025/QH15',
    'home.heroTitle1': 'Find Safe Flexible Jobs,',
    'home.heroTitle2': 'Accelerate Skills & Earnings',
    'home.heroDesc': 'Platform connecting university students with verified part-time jobs, freelance projects, and short-term internships. Transparent compensation, schedule flexibility, synchronized across PostgreSQL & MySQL.',
    'home.searchPlaceholder': 'Search job title, skills (e.g., Barista, React Developer, English Tutor, Content Writer...)',
    'home.searchBtn': 'Search Jobs',
    'home.popularProvinces': 'Popular Provinces:',
    'home.statJobs': 'Part-time & Freelance Jobs',
    'home.statCats': 'Standard Job Categories',
    'home.statProvs': 'Provinces Nationwide',
    'home.statDb': 'Dual Core Database Support (MySQL & Postgres)',
    'home.catTitle': 'Browse by Category',
    'home.catDesc': 'Find opportunities matching your university major and personal interests',
    'home.featuredTitle': 'Latest Featured Opportunities',
    'home.featuredDesc': 'Part-time roles, freelance gigs, and internships actively hiring',
    'home.viewAll': 'Explore all 1,470+ jobs',
    'home.trust1Title': '100% Verified Job Postings',
    'home.trust1Desc': 'Shielding university students from deposit scams, ghost vacancies, and labor violations.',
    'home.trust2Title': 'Transparent Two-Way Reviews',
    'home.trust2Desc': 'Building verified credibility portfolios for both students and employers upon gig completion.',
    'home.trust3Title': 'Dual Database Flexibility',
    'home.trust3Desc': 'Fully synchronized and production-ready across both PostgreSQL 18 and MySQL 8 with 1,470+ real positions.',

    // Browse Page
    'browse.headerBadge': 'VietJobs Live Dataset (1,470+ Cleaned & Standardized Postings)',
    'browse.title': 'Explore Part-time, Internship & Freelance Jobs',
    'browse.desc': 'Hand-picked student-safe part-time vacancies, freelance projects, and internships conforming to Res. 202/2025/QH15.',
    'browse.searchPlaceholder': 'Search by title, skills, company (Barista, React, Marketing, Tutor...)...',
    'browse.searchBtn': 'Search',
    'browse.clearFilters': 'Clear Filters',
    'browse.provinceLabel': 'Province / City',
    'browse.allProvinces': '📍 All Provinces',
    'browse.categoryLabel': 'Job Category',
    'browse.allCategories': '📁 All Categories',
    'browse.typeLabel': 'Job Type',
    'browse.allTypes': '💼 All Job Types',
    'browse.partTime': 'Part-time Jobs',
    'browse.freelance': 'Freelance Projects',
    'browse.internship': 'Internships',
    'browse.modeLabel': 'Work Mode',
    'browse.allModes': '🏢 All Work Modes',
    'browse.onsite': 'Onsite',
    'browse.remote': 'Remote',
    'browse.hybrid': 'Hybrid',
    'browse.quickFilter': 'Quick Filter:',
    'browse.studentFriendly': 'Student Friendly',
    'browse.found': 'Found',
    'browse.matchingJobs': 'matching jobs',
    'browse.in': 'in',
    'browse.forStudents': '(student friendly)',
    'browse.page': 'Page',
    'browse.prevPage': 'Previous',
    'browse.nextPage': 'Next',
    'browse.noJobsTitle': 'No matching jobs found',
    'browse.noJobsDesc': 'Try removing some filters or searching with different keywords.',
    'browse.resetAll': 'Reset All Filters',
    'browse.loading': 'Loading live job opportunities from server...',

    // Job Card & Detail
    'job.forStudentsBadge': 'Student Friendly',
    'job.viewDetail': 'View Details & Apply',
    'job.applyNow': 'Apply Now',
    'job.applied': 'Application Submitted',
    'job.loginToApply': 'Log in to Apply',
    'job.employerNotice': '(Employer accounts cannot submit job applications)',
    'job.back': 'Back to job listings',
    'job.salary': 'Salary / Compensation',
    'job.location': 'Work Location',
    'job.workingHours': 'Working Hours',
    'job.benefits': '🎁 Benefits & Perks',
    'job.description': 'Job Description',
    'job.requirements': 'Job Requirements',
    'job.open': 'Actively Hiring',
    'job.deadline': 'Application Deadline',
    'job.unlimited': 'No Deadline',
    'job.applyModalTitle': 'Submit Application',
    'job.applyModalIntro': 'Send a brief cover letter to',
    'job.coverLetterPlaceholder': 'Hello, I am a university student and I am excited about this opportunity...',
    'job.cancel': 'Cancel',
    'job.submit': 'Confirm & Submit',
    'job.submitting': 'Submitting...',

    // Auth Page
    'auth.loginTitle': 'Sign In',
    'auth.loginSubtitle': 'Welcome back to FreelanceHub',
    'auth.registerTitle': 'Create Account',
    'auth.registerSubtitle': 'Join Team 8 Student Job Ecosystem',
    'auth.roleLabel': 'I am a:',
    'auth.roleStudent': 'Student Job Seeker',
    'auth.roleEmployer': 'Recruiter / Employer',
    'auth.fullName': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.passwordMin': 'Password (min. 6 characters)',
    'auth.university': 'University',
    'auth.companyName': 'Company / Store Name',
    'auth.loginBtn': 'Sign In',
    'auth.loggingIn': 'Authenticating...',
    'auth.registerBtn': 'Complete Registration',
    'auth.registering': 'Creating account...',
    'auth.noAccount': "Don't have an account?",
    'auth.registerNow': 'Sign up now',
    'auth.hasAccount': 'Already have an account?',
    'auth.loginNow': 'Sign in now',

    // Footer
    'footer.brand': 'FreelanceHub — Student Job Marketplace',
    'footer.course': 'Graduation Project 2 (261_71ITGR40303_04) — Faculty of Information Technology, Van Lang University.',
    'footer.team': 'Developed by Team 8: Nguyen Tan Tai (PM), Nguyen Ba Anh Khoi (BA), Hoang Bao Long (QA/Tester)',
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'vi' || saved === 'en') {
      return saved;
    }
    return 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
