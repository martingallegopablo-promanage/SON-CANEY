import React from 'react';

export default function CubanFlagLogo({ className = "w-10 h-10", alt = "Son Caney Cuban Flag" }) {
  return (
    <div className={`relative rounded-full overflow-hidden shadow-md shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
      >
        <defs>
          <clipPath id="flagCircle">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodOpacity="0.25" />
          </filter>
        </defs>

        <g clipPath="url(#flagCircle)">
          {/* 5 Cuban stripes: 3 blue, 2 white */}
          <rect x="0" y="0" width="100" height="20" fill="#002a8f" />
          <rect x="0" y="20" width="100" height="20" fill="#ffffff" />
          <rect x="0" y="40" width="100" height="20" fill="#002a8f" />
          <rect x="0" y="60" width="100" height="20" fill="#ffffff" />
          <rect x="0" y="80" width="100" height="20" fill="#002a8f" />

          {/* Red triangle */}
          <polygon points="0,0 52,50 0,100" fill="#cf142b" />

          {/* White five-pointed star */}
          <polygon
            points="21,38 23.4,45.4 31.2,45.6 24.9,50.3 27.2,57.9 21,53.4 14.8,57.9 17.1,50.3 10.8,45.6 18.6,45.4"
            fill="#ffffff"
            filter="url(#starShadow)"
          />
        </g>

        {/* Polished outer border */}
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
