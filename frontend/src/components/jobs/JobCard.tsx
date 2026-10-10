import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { MapPin, DollarSign, Building, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { t, language } = useLanguage();

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'PART_TIME':
        return language === 'vi' ? 'Part-time' : 'Part-time';
      case 'FREELANCE':
        return language === 'vi' ? 'Freelance' : 'Freelance';
      case 'INTERNSHIP':
        return language === 'vi' ? 'Thực tập sinh' : 'Internship';
      default:
        return type;
    }
  };

  const getWorkModeLabel = (mode: string) => {
    switch (mode) {
      case 'ONSITE':
        return language === 'vi' ? 'Tại chỗ (Onsite)' : 'Onsite';
      case 'REMOTE':
        return language === 'vi' ? 'Từ xa (Remote)' : 'Remote';
      case 'HYBRID':
        return language === 'vi' ? 'Kết hợp (Hybrid)' : 'Hybrid';
      default:
        return mode;
    }
  };

  const formatSalary = () => {
    if (job.salaryText && job.salaryText.trim()) {
      return job.salaryText;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(job.salaryAmount) + ' đ';
    if (job.salaryType === 'HOURLY') return language === 'vi' ? `${formatted}/giờ` : `${formatted}/hr`;
    if (job.salaryType === 'FIXED_PROJECT') return language === 'vi' ? `${formatted} (trọn gói)` : `${formatted} (project)`;
    return language === 'vi' ? `${formatted}/tháng` : `${formatted}/mo`;
  };

  const displayLocation = job.province || job.location || (language === 'vi' ? 'Toàn quốc' : 'Nationwide');

  return (
    <div className="job-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Badge type={job.jobType} label={getJobTypeLabel(job.jobType)} />
          {job.studentFriendly && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Sparkles size={12} /> {t('job.forStudentsBadge')}
            </span>
          )}
          {job.category?.name && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#059669',
                background: 'var(--bg-card-subtle)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              {job.category.name}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
            {job.title}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          <Building size={16} />
          <span style={{ fontWeight: 500 }}>{job.employer?.companyName || job.employer?.fullName || (language === 'vi' ? 'Nhà tuyển dụng xác minh' : 'Verified Employer')}</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
          {job.description}
        </p>

        {job.workingHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', background: 'var(--bg-card-subtle)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Clock size={14} color="var(--primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.workingHours}</span>
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <MapPin size={15} color="var(--primary)" />
              <span style={{ fontWeight: 500 }}>{displayLocation}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card-subtle)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              {getWorkModeLabel(job.workMode)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>
            <DollarSign size={16} />
            <span>{formatSalary()}</span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          {t('job.viewDetail')}
        </Link>
      </div>
    </div>
  );
};
