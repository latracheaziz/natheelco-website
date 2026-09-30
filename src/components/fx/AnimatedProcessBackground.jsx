import { motion, useReducedMotion } from 'framer-motion';

const AnimatedProcessBackground = () => {
  const reduceMotion = useReducedMotion();

  // Create many thin overlapping waves
  const waveLines = Array.from({ length: 12 }).map((_, i) => {
    // Randomize slightly for organic look
    const yBase = 20 + (i * 5); 
    const amp = 15 + (i % 3) * 10;
    const dur = 10 + (i % 4) * 4;
    const width = 0.5 + (i % 2) * 0.5;
    const opacity = 0.3 + (i % 3) * 0.2;
    const color = i % 2 === 0 ? "#00F0FF" : "#0055FF"; // Electric cyan and deep blue
    
    return { yBase, amp, dur, width, opacity, color };
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
      {/* Subtle deep blue radial glow in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,30,80,0.6),transparent_70%)]" />

      {/* SVG Canvas for Lines */}
      <svg
        className="absolute w-[200vw] h-[150%] top-[-25%] left-[-50vw] opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {waveLines.map((line, i) => (
          <motion.path
            key={i}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            opacity={line.opacity}
            filter="url(#lineGlow)"
            vectorEffect="non-scaling-stroke"
            animate={
              !reduceMotion
                ? {
                    d: [
                      `M0,${line.yBase} C25,${line.yBase - line.amp} 75,${line.yBase + line.amp} 100,${line.yBase}`,
                      `M0,${line.yBase} C40,${line.yBase + line.amp} 60,${line.yBase - line.amp} 100,${line.yBase}`,
                      `M0,${line.yBase} C25,${line.yBase - line.amp} 75,${line.yBase + line.amp} 100,${line.yBase}`,
                    ],
                  }
                : {}
            }
            transition={{
              duration: line.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * -1.5, // stagger start times
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedProcessBackground;
