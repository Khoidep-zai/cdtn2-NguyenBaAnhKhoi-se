import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Briefcase size={20} /> {t('footer.brand')}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {t('footer.course')}
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          {t('footer.team')} <Heart size={14} color="#ef4444" fill="#ef4444" />
        </p>
      </div>
    </footer>
  );
};
