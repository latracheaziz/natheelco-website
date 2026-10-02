import React from 'react';
import { motion } from 'framer-motion';

// Generate subtle floating particles for a premium "dust" effect
const particles = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: Math.random() * 1440,
  y: Math.random() * 600,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 15 + 15,
  delay: Math.random() * 5,
}));

const BlueWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020617]">
      {/* Ambient gradient glow in the background for volumetric feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0044ff] rounded-full blur-[150px] opacity-30" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00e5ff] rounded-full blur-[150px] opacity-10" />

      <motion.svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{
          x: 'calc(var(--roots-pointer-x, 0px) * 2.5)',
          y: 'calc(var(--roots-pointer-y, 0px) * 2.5)',
          scale: 1.08
        }}
      >
        <defs>
          <linearGradient id="darkBg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#010410" />
            <stop offset="100%" stopColor="#001538" />
          </linearGradient>
          
          <linearGradient id="topBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0055ff" />
            <stop offset="50%" stopColor="#0077ff" />
            <stop offset="100%" stopColor="#0022aa" />
          </linearGradient>

          <linearGradient id="waveLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="50%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#00f2ff" />
          </linearGradient>

          <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="25" stdDeviation="25" floodColor="#000" floodOpacity="0.8"/>
          </filter>
        </defs>

        {/* Base dark background */}
        <rect width="1440" height="600" fill="url(#darkBg)" />

        {/* Particles */}
        {particles.map(p => (
          <motion.circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="#00e5ff"
            opacity={0.3}
            filter="url(#waveGlow)"
            animate={{
              y: [p.y, p.y - 200],
              x: [p.x, p.x + 80],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
          />
        ))}

        {/* Top bright blue area (extended beyond edges to prevent clipping during parallax) */}
        <motion.path
          animate={{
            d: [
              "M-100,-100 L1540,-100 L1540,150 C1100,450 400,300 -100,100 Z",
              "M-100,-100 L1540,-100 L1540,180 C950,420 450,280 -100,120 Z",
              "M-100,-100 L1540,-100 L1540,150 C1100,450 400,300 -100,100 Z",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#topBlue)"
          filter="url(#dropShadow)"
        />

        {/* Deep background shadow line for extreme 3D effect */}
        <motion.path
          animate={{
            d: [
              "M-100,110 C400,310 1100,460 1540,160",
              "M-100,130 C450,290 950,430 1540,190",
              "M-100,110 C400,310 1100,460 1540,160",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          fill="none"
          stroke="#000"
          strokeWidth="30"
          opacity="0.3"
          filter="url(#waveGlow)"
        />

        {/* Glowing wave line */}
        <motion.path
          animate={{
            d: [
              "M-100,100 C400,300 1100,450 1540,150",
              "M-100,120 C450,280 950,420 1540,180",
              "M-100,100 C400,300 1100,450 1540,150",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          fill="none"
          stroke="url(#waveLine)"
          strokeWidth="14"
          filter="url(#waveGlow)"
        />
        
        {/* Core bright white line (gives it that hot neon center) */}
        <motion.path
          animate={{
            d: [
              "M-100,100 C400,300 1100,450 1540,150",
              "M-100,120 C450,280 950,420 1540,180",
              "M-100,100 C400,300 1100,450 1540,150",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.8"
        />

        {/* Secondary subtle line for liquid depth */}
        <motion.path
          animate={{
            d: [
              "M-100,115 C400,315 1100,465 1540,165",
              "M-100,135 C450,295 950,435 1540,195",
              "M-100,115 C400,315 1100,465 1540,165",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          fill="none"
          stroke="#00e5ff"
          strokeWidth="4"
          opacity="0.4"
          filter="url(#waveGlow)"
        />
      </motion.svg>
    </div>
  );
};

export default BlueWaveBackground;
