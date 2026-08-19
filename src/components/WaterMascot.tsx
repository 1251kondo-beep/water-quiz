import React from 'react';

interface WaterMascotProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'cheering' | 'thinking' | 'sleeping';
}

export default function WaterMascot({
  className = '',
  size = 48,
  mood = 'happy',
}: WaterMascotProps) {
  return (
    <div
      className={`inline-flex items-center justify-center filter drop-shadow-md select-none transition-transform hover:scale-110 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible animate-bounce-subtle"
      >
        <defs>
          <linearGradient id="waterDropGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="waterHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow under mascot */}
        <ellipse cx="50" cy="94" rx="28" ry="6" fill="#0284c7" opacity="0.25" />

        {/* Small ears / water splashes on head */}
        <circle cx="28" cy="30" r="10" fill="#0284c7" />
        <circle cx="28" cy="30" r="6" fill="#7dd3fc" />
        <circle cx="72" cy="30" r="10" fill="#0284c7" />
        <circle cx="72" cy="30" r="6" fill="#7dd3fc" />

        {/* Main Body (Cute Drop / Bear Shape) */}
        <path
          d="M 50 12 
             C 65 30, 85 45, 85 68 
             C 85 86, 69 92, 50 92 
             C 31 92, 15 86, 15 68 
             C 15 45, 35 30, 50 12 Z"
          fill="url(#waterDropGrad)"
        />

        {/* Water Gloss Highlight */}
        <ellipse
          cx="36"
          cy="42"
          rx="10"
          ry="6"
          transform="rotate(-25 36 42)"
          fill="url(#waterHighlight)"
        />
        <circle cx="32" cy="56" r="3" fill="#ffffff" opacity="0.6" />

        {/* Cute Face White patch */}
        <ellipse cx="50" cy="66" rx="22" ry="18" fill="#ffffff" opacity="0.95" />

        {/* Eyes */}
        <circle cx="42" cy="62" r="3.5" fill="#0f172a" />
        <circle cx="58" cy="62" r="3.5" fill="#0f172a" />
        {/* Eye sparkles */}
        <circle cx="43.5" cy="60.5" r="1.2" fill="#ffffff" />
        <circle cx="59.5" cy="60.5" r="1.2" fill="#ffffff" />

        {/* Cheeks (Blush) */}
        <ellipse cx="36" cy="68" rx="4" ry="2" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="64" cy="68" rx="4" ry="2" fill="#f43f5e" opacity="0.6" />

        {/* Mouth */}
        {mood === 'happy' && (
          <path
            d="M 46 67 Q 50 72 54 67"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === 'cheering' && (
          <path
            d="M 45 66 Q 50 75 55 66 Z"
            fill="#e11d48"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        )}

        {/* Small Hands */}
        <ellipse cx="22" cy="70" rx="5" ry="4" fill="#38bdf8" />
        <ellipse cx="78" cy="70" rx="5" ry="4" fill="#38bdf8" />
      </svg>
    </div>
  );
}
