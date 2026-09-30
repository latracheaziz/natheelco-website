import { motion } from 'framer-motion';

const WaveLinesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#0a1128] z-0">
      {/* Center glowing light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,70,145,0.4),transparent_60%)]" />

      {/* Waves SVG */}
      <svg
        className="absolute w-[200vw] h-full top-0 left-[-50vw] opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7dd3fc" stopOpacity="1" />
            <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw a few animated wavy lines */}
        {[
          { yBase: 40, amp: 20, dur: 12, width: 0.5 },
          { yBase: 50, amp: 25, dur: 15, width: 0.8 },
          { yBase: 60, amp: 15, dur: 10, width: 0.4 },
          { yBase: 45, amp: 30, dur: 18, width: 0.6 },
          { yBase: 55, amp: 22, dur: 14, width: 0.7 },
        ].map((line, i) => (
          <motion.path
            key={i}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth={line.width}
            filter="url(#waveGlow)"
            animate={{
              d: [
                `M0,${line.yBase} C25,${line.yBase - line.amp} 75,${line.yBase + line.amp} 100,${line.yBase}`,
                `M0,${line.yBase} C35,${line.yBase + line.amp} 65,${line.yBase - line.amp} 100,${line.yBase}`,
                `M0,${line.yBase} C25,${line.yBase - line.amp} 75,${line.yBase + line.amp} 100,${line.yBase}`,
              ],
            }}
            transition={{
              duration: line.dur,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      
      {/* Overlay grain to keep the cinematic feel */}
      <div className="grain opacity-50" />
    </div>
  );
};

export default WaveLinesBackground;
