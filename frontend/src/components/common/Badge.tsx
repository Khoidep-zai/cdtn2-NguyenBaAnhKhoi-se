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
    case 'INTERNSHIP':
      badgeClass += 'badge-internship';
      break;
    case 'STUDENT':
    case 'STUDENT_FRIENDLY':
      badgeClass += 'badge-student';
      break;
    case 'PROVINCE':
      badgeClass += 'badge-province';
      break;
    case 'CATEGORY':
      badgeClass += 'badge-category';
      break;
    case 'WORKMODE':
      badgeClass += 'badge-workmode';
      break;
    default:
      badgeClass += 'badge-part-time';
  }

  return <span className={badgeClass}>{label}</span>;
};
