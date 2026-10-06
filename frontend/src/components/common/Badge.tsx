import React from 'react';

interface BadgeProps {
  type: string;
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, label }) => {
  let badgeClass = 'badge ';
  switch (type.toUpperCase()) {
    case 'OPEN':
      badgeClass += 'badge-open';
      break;
    case 'PART_TIME':
      badgeClass += 'badge-part-time';
      break;
    case 'FREELANCE':
      badgeClass += 'badge-freelance';
      break;
    default:
      badgeClass += 'badge-part-time';
  }

  return <span className={badgeClass}>{label}</span>;
};
