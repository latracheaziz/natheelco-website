import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const AnimatedProcessBackground = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (reduceMotion || isMobile || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
  };

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 200]);

  // Abstract nodes representing "Input -> Process -> Result"
  const nodes = [
    { cx: '15%', cy: '70%', r: 4, delay: 0 },
    { cx: '45%', cy: '40%', r: 6, delay: 1 },
    { cx: '85%', cy: '60%', r: 5, delay: 2 },
  ];

  const paths = [
    // Layer 1: Slow sweeping back waves
    {
      d: "M-10,80 Q20,30 50,60 T110,40",
      width: 1,
      opacity: 0.2,
      dur: 20,
      color: "#0EA5E9",
      offsetMove: -0.05
    },
    {
      d: "M-10,50 Q30,90 60,40 T110,70",
      width: 1.5,
      opacity: 0.15,
      dur: 25,
      color: "#38BDF8",
      offsetMove: 0.04
    },
    // Layer 2: Main data connection lines intersecting nodes
    {
      d: "M-10,85 C15,70 25,20 45,40 S70,70 85,60 C95,55 105,45 110,40",
      width: 2,
      opacity: 0.4,
      dur: 15,
      color: "#38BDF8",
      offsetMove: 0.08
    },
    {
      d: "M-10,65 C10,75 30,30 45,40 S60,20 85,60 C95,75 105,80 110,85",
      width: 1.5,
      opacity: 0.5,
      dur: 12,
      color: "#60A5FA",
      offsetMove: -0.06
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden bg-[#020617] z-0 pointer-events-auto"
    >
      {/* Dynamic Radial Glow following mouse (desktop only) */}
      {!reduceMotion && !isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(circle 600px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(14, 165, 233, 0.15), transparent 80%)`
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
        />
      )}

      {/* Static Base Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,21,47,0.8),transparent_70%)] pointer-events-none" />

      {/* Animated SVG Layers */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 w-full h-full pointer-events-none">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="dataGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="70%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Render paths */}
          {paths.map((path, i) => {
            if (isMobile && i > 1) return null; // reduce paths on mobile
            
            // Subtle mouse reaction offset
            const mouseOffsetX = (mousePos.x - 0.5) * path.offsetMove * 100;
            const mouseOffsetY = (mousePos.y - 0.5) * path.offsetMove * 100;
            
            return (
              <motion.g 
                key={`path-${i}`}
                animate={!reduceMotion && !isMobile ? { x: mouseOffsetX, y: mouseOffsetY } : {}}
                transition={{ type: 'spring', damping: 20, stiffness: 40 }}
              >
                {/* Base faded path */}
                <path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth={path.width}
                  opacity={path.opacity * 0.3}
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Animated dash flow */}
                {!reduceMotion && (
                  <motion.path
                    d={path.d}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth={path.width}
                    opacity={path.opacity}
                    filter="url(#dataGlow)"
                    strokeDasharray="40 100"
                    animate={{ strokeDashoffset: [140, 0] }}
                    transition={{
                      duration: path.dur,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </motion.g>
            );
          })}

          {/* Render glowing nodes */}
          {nodes.map((node, i) => {
            const mouseOffsetX = (mousePos.x - 0.5) * 0.05 * 100;
            const mouseOffsetY = (mousePos.y - 0.5) * 0.05 * 100;

            return (
              <motion.g
                key={`node-${i}`}
                animate={!reduceMotion && !isMobile ? { x: mouseOffsetX, y: mouseOffsetY } : {}}
                transition={{ type: 'spring', damping: 20, stiffness: 40 }}
              >
                {/* Outer pulse */}
                {!reduceMotion && (
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                    fill="#38BDF8"
                    opacity={0.2}
                    filter="url(#dataGlow)"
                    animate={{ scale: [1, 2, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: node.delay,
                      ease: "easeInOut"
                    }}
                  />
                )}
                {/* Inner core */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r * 0.4}
                  fill="#FFF"
                  filter="url(#dataGlow)"
                />
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Overlay grain for cinematic feel */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
    </div>
  );
};

export default AnimatedProcessBackground;
