import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { MapPin, DollarSign, Building, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cleanMojibake, formatSalaryDisplay, formatLocationDisplay } from '../../utils/textUtils';

interface JobCardProps {
  job: Job;
  isHot?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isHot }) => {
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

  const getShiftBadge = (shift?: string) => {
    if (!shift) return null;
    let label = '';
    let bg = '';
    let color = '';
    switch (shift) {
      case 'MORNING':
        label = language === 'vi' ? 'Ca sáng' : 'Morning';
        bg = 'rgba(245, 158, 11, 0.12)';
        color = '#d97706';
        break;
      case 'AFTERNOON':
        label = language === 'vi' ? 'Ca chiều' : 'Afternoon';
        bg = 'rgba(59, 130, 246, 0.12)';
        color = '#2563eb';
        break;
      case 'EVENING':
        label = language === 'vi' ? 'Ca tối' : 'Evening';
        bg = 'rgba(139, 92, 246, 0.12)';
        color = '#7c3aed';
        break;
      case 'WEEKEND':
        label = language === 'vi' ? 'Cuối tuần' : 'Weekend';
        bg = 'rgba(236, 72, 153, 0.12)';
        color = '#db2777';
        break;
      case 'FLEXIBLE':
        label = language === 'vi' ? 'Linh hoạt' : 'Flexible';
        bg = 'rgba(16, 185, 129, 0.12)';
        color = '#059669';
        break;
      default:
        label = shift;
        bg = 'var(--bg-card-subtle)';
        color = 'var(--text-muted)';
    }
    return (
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          color,
          backgroundColor: bg,
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${color}33`,
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="job-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          {isHot && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                boxShadow: '0 1px 3px rgba(239, 68, 68, 0.3)',
              }}
            >
              🔥 HOT
            </span>
          )}
          <Badge type={job.jobType} label={getJobTypeLabel(job.jobType)} />
          {job.shiftType && getShiftBadge(job.shiftType)}
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
              {cleanMojibake(job.category.name)}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
            {cleanMojibake(job.title)}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          <Building size={16} />
          <span style={{ fontWeight: 500 }}>
            {cleanMojibake(job.employer?.companyName || job.employer?.fullName || (language === 'vi' ? 'Nhà tuyển dụng xác minh' : 'Verified Employer'))}
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
          {cleanMojibake(job.description)}
        </p>

        {job.workingHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', background: 'var(--bg-card-subtle)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Clock size={14} color="var(--primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cleanMojibake(job.workingHours)}
            </span>
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <MapPin size={15} color="var(--primary)" />
              <span style={{ fontWeight: 500 }}>{formatLocationDisplay(job.province, job.location, language)}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card-subtle)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              {getWorkModeLabel(job.workMode)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>
            <DollarSign size={16} />
            <span>{formatSalaryDisplay(job.salaryText, job.salaryAmount, job.salaryType, language)}</span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          {t('job.viewDetail')}
        </Link>
      </div>
    </div>
  );
};
