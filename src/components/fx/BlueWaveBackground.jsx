import React from 'react';

const BlueWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#020617]">
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="darkBg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00091d" />
            <stop offset="100%" stopColor="#00194a" />
          </linearGradient>
          
          <linearGradient id="topBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#0044ff" />
          </linearGradient>

          <linearGradient id="waveLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00a2ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>

          <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#000" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Base dark background */}
        <rect width="1440" height="600" fill="url(#darkBg)" />

        {/* Top bright blue area (curves down from top left to middle right) */}
        <path
          d="M0,0 L1440,0 L1440,250 C1000,450 500,100 -100,50 Z"
          fill="url(#topBlue)"
          filter="url(#dropShadow)"
        />

        {/* Glowing wave line matching the path of the top area */}
        <path
          d="M-100,50 C500,100 1000,450 1440,250"
          fill="none"
          stroke="url(#waveLine)"
          strokeWidth="12"
          filter="url(#waveGlow)"
        />
        
        {/* Secondary subtle line for depth */}
        <path
          d="M-100,65 C500,115 1000,465 1440,265"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2"
          opacity="0.3"
          filter="url(#waveGlow)"
        />
      </svg>
    </div>
  );
};

export default BlueWaveBackground;
