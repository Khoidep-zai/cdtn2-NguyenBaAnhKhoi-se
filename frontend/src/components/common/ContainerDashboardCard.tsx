import React from 'react';
import './ContainerDashboardCard.css';

export interface ContainerDashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
  subtitle?: string;
}

export const ContainerDashboardCard: React.FC<ContainerDashboardCardProps> = ({
  title,
  value,
  icon,
  iconBg = 'var(--primary-light, #dbeafe)',
  iconColor = 'var(--primary, #2563eb)',
  valueColor = 'var(--text-main, #0f172a)',
  subtitle,
}) => {
  return (
    <div className="container-card-wrapper">
      <div className="container-card">
        <div className="container-card-header">
          <span className="container-card-title">{title}</span>
        </div>

        <div
          className="container-card-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>

        <div className="container-card-value" style={{ color: valueColor }}>
          {value}
        </div>

        {subtitle && (
          <div className="container-card-extra">
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

