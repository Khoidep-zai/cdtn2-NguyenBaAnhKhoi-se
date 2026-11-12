import React, { useState } from 'react';
import { ChevronDown, BarChart2 } from 'lucide-react';
import './StatsAccordion.css';

export interface StatsAccordionProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const StatsAccordion: React.FC<StatsAccordionProps> = ({
  title,
  badge,
  defaultOpen = true,
  icon = <BarChart2 size={18} className="text-primary" />,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`stats-accordion-container ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="stats-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="stats-accordion-title">
          {icon}
          <span>{title}</span>
          {badge && <span className="stats-accordion-badge">{badge}</span>}
        </div>
        <ChevronDown size={18} className="stats-accordion-chevron" />
      </button>

      <div className="stats-accordion-content-wrapper">
        <div className="stats-accordion-content">
          <div className="stats-accordion-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

