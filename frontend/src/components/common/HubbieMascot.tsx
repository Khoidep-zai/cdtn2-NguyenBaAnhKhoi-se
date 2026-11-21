import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      // Respect accessibility preference for reduced motion
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Organic Elliptical Float (Arc principle)
      gsap.to('.hubbie-body-group', {
        y: -6,
        x: 2,
        rotation: 2,
        duration: 2.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 2. High-frequency Wing Flutter (Secondary Action)
      gsap.to('.hubbie-wing-left', {
        scaleX: 0.85,
        rotation: -16,
        transformOrigin: '40px 42px',
        duration: 0.12,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to('.hubbie-wing-right', {
        scaleX: 0.85,
        rotation: 16,
        transformOrigin: '80px 42px',
        duration: 0.12,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 3. Antenna Waggle (Subtle life)
      gsap.to('.hubbie-antennae', {
        rotation: 4,
        transformOrigin: '60px 30px',
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 4. Natural Eye Blinking Cycle
      const blinkTimer = gsap.timeline({
        repeat: -1,
        repeatDelay: gsap.utils.random(3, 6),
      });
      blinkTimer
        .to('.hubbie-eyes-layer', { scaleY: 0.1, transformOrigin: 'center center', duration: 0.08 })
        .to('.hubbie-eyes-layer', { scaleY: 1, transformOrigin: 'center center', duration: 0.1 });

      // 5. Waving Paw Animation if in waving mood
      if (mood === 'waving') {
        gsap.to('.hubbie-waving-paw', {
          rotation: 18,
          transformOrigin: '92px 66px',
          duration: 0.45,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { scope: containerRef, dependencies: [mood] }
  );

  // Playful Squash & Stretch on Hover (Disney Principle)
  const handleMouseEnter = contextSafe(() => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        scale: 1.15,
        rotation: -6,
        duration: 0.35,
        ease: 'back.out(2.2)',
      });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  });

  return (
    <div
      ref={containerRef}
      className={`hubbie-mascot-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={avatarRef}
        className="hubbie-mascot-avatar"
        style={{
          width: size,
          height: size,
          position: 'relative',
          filter: 'drop-shadow(0 6px 14px rgba(245, 158, 11, 0.4))',
          flexShrink: 0,
          cursor: 'pointer',
          willChange: 'transform',
        }}
        aria-label="Linh vật Ong Vàng Hubbie"
      >
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wings with dedicated flutter groups */}
          <g className="hubbie-wing-left">
            <ellipse
              cx="40"
              cy="42"
              rx="18"
              ry="24"
              transform="rotate(-25 40 42)"
              fill="rgba(199, 210, 254, 0.85)"
              stroke="#818CF8"
              strokeWidth="2.5"
            />
          </g>
          <g className="hubbie-wing-right">
            <ellipse
              cx="80"
              cy="42"
              rx="18"
              ry="24"
              transform="rotate(25 80 42)"
              fill="rgba(199, 210, 254, 0.85)"
              stroke="#818CF8"
              strokeWidth="2.5"
            />
          </g>

          {/* Bee Body Group (Moves together with gentle float) */}
          <g className="hubbie-body-group">
            {/* Stinger */}
            <polygon points="60,110 54,98 66,98" fill="#1F2937" />

            {/* Bee Body Oval */}
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

            {/* Cute Cheeks */}
            <circle cx="44" cy="58" r="6" fill="#F87171" opacity="0.65" />
            <circle cx="76" cy="58" r="6" fill="#F87171" opacity="0.65" />

            {/* Eyes Group (Blinkable) */}
            <g className="hubbie-eyes-layer">
              <circle cx="48" cy="50" r="7" fill="#1F2937" />
              <circle cx="72" cy="50" r="7" fill="#1F2937" />
              <circle cx="46" cy="48" r="2.5" fill="#FFFFFF" />
              <circle cx="70" cy="48" r="2.5" fill="#FFFFFF" />
            </g>

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
              <g className="hubbie-waving-paw">
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

            {/* Antennae Group */}
            <g className="hubbie-antennae">
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
            </g>

            {/* Mini Graduation Cap (Văn Lang Student Pride) */}
            <polygon
              points="60,24 42,32 60,38 78,32"
              fill="#4F46E5"
              stroke="#312E81"
              strokeWidth="1.5"
            />
            <rect x="56" y="36" width="8" height="6" fill="#312E81" />
            <line x1="74" y1="34" x2="78" y2="44" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="78" cy="44" r="2" fill="#FBBF24" />
          </g>
        </svg>
      </div>

      {message && (
        <div
          className="hubbie-speech-bubble"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)',
            padding: '0.65rem 1.05rem',
            borderRadius: '18px 18px 18px 4px',
            fontSize: '0.86rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-md)',
            lineHeight: 1.45,
            maxWidth: '340px',
            position: 'relative',
            textAlign: 'left',
            animation: 'dropdownSpring 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};
