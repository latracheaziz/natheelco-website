import React from 'react';

const BlueWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="darkBg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="100%" stopColor="#001d4a" />
          </linearGradient>
          
          <linearGradient id="topBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#0033cc" />
          </linearGradient>

          <linearGradient id="waveLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>

          <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/>
          </filter>
        </defs>

        {/* Base dark background */}
        <rect width="1440" height="600" fill="url(#darkBg)" />

        {/* Top bright blue area */}
        <path
          d="M0,0 L1440,0 L1440,150 C1000,450 400,300 0,100 Z"
          fill="url(#topBlue)"
          filter="url(#dropShadow)"
        />

        {/* Glowing wave line */}
        <path
          d="M0,100 C400,300 1000,450 1440,150"
          fill="none"
          stroke="url(#waveLine)"
          strokeWidth="16"
          filter="url(#waveGlow)"
        />
        
        {/* Secondary subtle line for depth */}
        <path
          d="M0,115 C400,315 1000,465 1440,165"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="3"
          opacity="0.4"
          filter="url(#waveGlow)"
        />
      </svg>
    </div>
  );
};

export default BlueWaveBackground;
