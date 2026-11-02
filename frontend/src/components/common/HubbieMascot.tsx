import React from 'react';

interface HubbieMascotProps {
  size?: number;
  message?: string;
  mood?: 'happy' | 'waving' | 'smart';
  className?: string;
}

export const HubbieMascot: React.FC<HubbieMascotProps> = ({
  size = 72,
  message,
  mood = 'waving',
  className = '',
}) => {
  return (
    <div
      className={`hubbie-mascot-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
      }}
    >
      <div
        className="hubbie-mascot-avatar"
        style={{
          width: size,
          height: size,
          position: 'relative',
          filter: 'drop-shadow(0 4px 10px rgba(245, 158, 11, 0.35))',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wings with subtle opacity */}
          <ellipse
            cx="40"
            cy="42"
            rx="18"
            ry="24"
            transform="rotate(-25 40 42)"
            fill="rgba(199, 210, 254, 0.75)"
            stroke="#818CF8"
            strokeWidth="2.5"
          />
          <ellipse
            cx="80"
            cy="42"
            rx="18"
            ry="24"
            transform="rotate(25 80 42)"
            fill="rgba(199, 210, 254, 0.75)"
            stroke="#818CF8"
            strokeWidth="2.5"
          />

          {/* Bee Body */}
          <ellipse
            cx="60"
            cy="68"
            rx="36"
            ry="40"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="3"
          />

          {/* Bee Stripes */}
          <path
            d="M26 62 Q60 72 94 62"
            stroke="#1F2937"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M28 78 Q60 88 92 78"
            stroke="#1F2937"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Stinger */}
          <polygon points="60,110 54,98 66,98" fill="#1F2937" />

          {/* Cute Cheeks */}
          <circle cx="44" cy="58" r="6" fill="#F87171" opacity="0.6" />
          <circle cx="76" cy="58" r="6" fill="#F87171" opacity="0.6" />

          {/* Big Sparkly Eyes */}
          <circle cx="48" cy="50" r="7" fill="#1F2937" />
          <circle cx="72" cy="50" r="7" fill="#1F2937" />
          <circle cx="46" cy="48" r="2.5" fill="#FFFFFF" />
          <circle cx="70" cy="48" r="2.5" fill="#FFFFFF" />

          {/* Smart Glasses Frame */}
          {(mood === 'smart' || mood === 'waving') && (
            <g id="hubbie-glasses">
              <rect
                x="38"
                y="41"
                width="20"
                height="18"
                rx="5"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
              />
              <rect
                x="62"
                y="41"
                width="20"
                height="18"
                rx="5"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
              />
              <line
                x1="58"
                y1="50"
                x2="62"
                y2="50"
                stroke="#4F46E5"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Waving Paw in waving mood */}
          {mood === 'waving' && (
            <g id="hubbie-waving-paw">
              <path
                d="M94 66 C104 58, 108 46, 102 43 C97 41, 94 48, 92 56"
                stroke="#B45309"
                strokeWidth="3"
                strokeLinecap="round"
                fill="#FBBF24"
              />
              <circle cx="102" cy="43" r="3.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            </g>
          )}

          {/* Happy Smile */}
          <path
            d="M52 64 Q60 72 68 64"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Antennas */}
          <path
            d="M48 30 Q40 18 36 20"
            stroke="#B45309"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="35" cy="20" r="4.5" fill="#F59E0B" />
          <path
            d="M72 30 Q80 18 84 20"
            stroke="#B45309"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="85" cy="20" r="4.5" fill="#F59E0B" />

          {/* Mini Van Lang Graduation Cap or Student Tie */}
          <polygon
            points="60,24 42,32 60,38 78,32"
            fill="#4F46E5"
            stroke="#312E81"
            strokeWidth="1.5"
          />
          <rect x="56" y="36" width="8" height="6" fill="#312E81" />
          <line x1="74" y1="34" x2="78" y2="44" stroke="#FBBF24" strokeWidth="2" />
          <circle cx="78" cy="44" r="2" fill="#FBBF24" />
        </svg>
      </div>

      {message && (
        <div
          className="hubbie-speech-bubble"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 1rem',
            borderRadius: '16px 16px 16px 4px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-md)',
            lineHeight: 1.45,
            maxWidth: '320px',
            position: 'relative',
            textAlign: 'left',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};
