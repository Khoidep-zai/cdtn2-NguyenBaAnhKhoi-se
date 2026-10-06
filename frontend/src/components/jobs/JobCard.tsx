import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { MapPin, DollarSign, Building } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    if (type === 'HOURLY') return `${formatted}/giờ`;
    if (type === 'FIXED_PROJECT') return `${formatted} (trọn gói)`;
    return `${formatted}/tháng`;
  };

  return (
    <div className="job-card">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <Badge type={job.jobType} label={job.jobType === 'PART_TIME' ? 'Part-time' : 'Freelance'} />
          <Badge type={job.status} label={job.status === 'OPEN' ? 'Đang tuyển' : job.status} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
            {job.title}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <Building size={16} />
          <span>{job.employer.companyName || job.employer.fullName}</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--primary)" />
            <span>{job.location || 'Toàn quốc (Remote)'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--success)' }}>
            <DollarSign size={16} />
            <span>{formatSalary(job.salaryAmount, job.salaryType)}</span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
          Xem chi tiết & Ứng tuyển
        </Link>
      </div>
    </div>
  );
};
