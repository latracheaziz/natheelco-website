import { motion, useReducedMotion } from 'framer-motion';

const DURATION = 16;

const layers = {
  far: [
    'M-220 390 C160 250 430 540 760 430 C1080 325 1320 540 1820 395 L1820 900 L-220 900 Z',
    'M-220 415 C180 275 455 555 780 450 C1100 350 1340 555 1820 420 L1820 900 L-220 900 Z',
    'M-220 390 C160 250 430 540 760 430 C1080 325 1320 540 1820 395 L1820 900 L-220 900 Z',
  ],
  mid: [
    'M-220 310 C200 175 460 470 790 355 C1110 245 1360 455 1820 310 L1820 900 L-220 900 Z',
    'M-220 335 C220 195 485 490 810 375 C1130 270 1380 475 1820 335 L1820 900 L-220 900 Z',
    'M-220 310 C200 175 460 470 790 355 C1110 245 1360 455 1820 310 L1820 900 L-220 900 Z',
  ],
  silk: [
    'M-260 175 C90 35 370 285 680 165 C990 45 1270 250 1880 130 L1880 310 C1270 430 990 225 680 345 C370 465 90 215 -260 355 Z',
    'M-260 200 C110 55 390 305 700 185 C1010 70 1290 270 1880 155 L1880 335 C1290 450 1010 250 700 365 C390 480 110 235 -260 380 Z',
    'M-260 175 C90 35 370 285 680 165 C990 45 1270 250 1880 130 L1880 310 C1270 430 990 225 680 345 C370 465 90 215 -260 355 Z',
  ],
  crest: [
    'M-260 175 C90 35 370 285 680 165 C990 45 1270 250 1880 130',
    'M-260 200 C110 55 390 305 700 185 C1010 70 1290 270 1880 155',
    'M-260 175 C90 35 370 285 680 165 C990 45 1270 250 1880 130',
  ],
  near: [
    'M-220 545 C210 455 500 680 850 585 C1190 495 1430 685 1820 540 L1820 900 L-220 900 Z',
    'M-220 565 C230 475 520 695 870 605 C1210 515 1450 700 1820 560 L1820 900 L-220 900 Z',
    'M-220 545 C210 455 500 680 850 585 C1190 495 1430 685 1820 540 L1820 900 L-220 900 Z',
  ],
  foam: [
    'M-220 605 C250 545 540 720 880 635 C1220 555 1460 720 1820 600',
    'M-220 625 C270 565 560 735 900 650 C1240 575 1480 735 1820 620',
    'M-220 605 C250 545 540 720 880 635 C1220 555 1460 720 1820 600',
  ],
};

const BlueWaveBackground = () => {
  const reduceMotion = useReducedMotion();
  const animatePath = (frames) => (reduceMotion ? { d: frames[0] } : { d: frames });
  const wave = (duration, delay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, delay, repeat: Infinity, ease: 'easeInOut' };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0A1628]" aria-hidden="true">
      <div className="absolute -top-[36%] left-[-10%] h-[70%] w-[62%] rounded-full bg-[#1B3A5C] opacity-40 blur-[130px]" />
      <div className="absolute -bottom-[30%] right-[-14%] h-[58%] w-[50%] rounded-full bg-[#2E8B9C] opacity-[0.16] blur-[140px]" />

      <motion.svg
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{
          x: reduceMotion ? 0 : 'calc(var(--roots-pointer-x, 0px) * 2.2)',
          y: reduceMotion ? 0 : 'calc(var(--roots-pointer-y, 0px) * 2.2)',
          scale: 1.06,
        }}
      >
        <defs>
          <linearGradient id="bw-base" x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor="#060E1A" />
            <stop offset="55%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#132240" />
          </linearGradient>
          <linearGradient id="bw-far" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#132240" />
            <stop offset="100%" stopColor="#0A1628" />
          </linearGradient>
          <linearGradient id="bw-mid" x1="8%" y1="0%" x2="92%" y2="100%">
            <stop offset="0%" stopColor="#1B3A5C" />
            <stop offset="48%" stopColor="#164456" />
            <stop offset="100%" stopColor="#0A1628" />
          </linearGradient>
          <linearGradient id="bw-silk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E8B9C" />
            <stop offset="22%" stopColor="#1B3A5C" />
            <stop offset="100%" stopColor="#0A1628" />
          </linearGradient>
          <linearGradient id="bw-near" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#060E1A" />
          </linearGradient>
          <linearGradient id="bw-crest" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3AA8BC" stopOpacity="0.1" />
            <stop offset="38%" stopColor="#5FD4E6" />
            <stop offset="52%" stopColor="#EAFBFF" />
            <stop offset="68%" stopColor="#5FD4E6" />
            <stop offset="100%" stopColor="#2E8B9C" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="bw-foam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3AA8BC" stopOpacity="0" />
            <stop offset="50%" stopColor="#5FD4E6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2E8B9C" stopOpacity="0" />
          </linearGradient>
          <filter id="bw-glow" x="-8%" y="-40%" width="116%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bw-shadow" x="-6%" y="-12%" width="112%" height="130%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="22" stdDeviation="16" floodColor="#02060d" floodOpacity="0.45" />
          </filter>
        </defs>

        <rect width="1600" height="800" fill="url(#bw-base)" />

        <motion.path d={layers.far[0]} animate={animatePath(layers.far)} transition={wave(DURATION + 4)} fill="url(#bw-far)" />
        <motion.path d={layers.mid[0]} animate={animatePath(layers.mid)} transition={wave(DURATION + 1, 0.4)} fill="url(#bw-mid)" opacity="0.92" />
        <motion.path d={layers.silk[0]} animate={animatePath(layers.silk)} transition={wave(DURATION)} fill="url(#bw-silk)" filter="url(#bw-shadow)" />
        <motion.path
          d={layers.crest[0]}
          animate={animatePath(layers.crest)}
          transition={wave(DURATION)}
          fill="none"
          stroke="url(#bw-crest)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#bw-glow)"
        />
        <motion.path
          d={layers.crest[0]}
          animate={animatePath(layers.crest)}
          transition={wave(DURATION)}
          fill="none"
          stroke="#F4FDFF"
          strokeWidth="1.6"
          opacity="0.7"
          strokeLinecap="round"
        />
        <motion.path d={layers.near[0]} animate={animatePath(layers.near)} transition={wave(DURATION + 2, 0.8)} fill="url(#bw-near)" opacity="0.88" />
        <motion.path
          d={layers.foam[0]}
          animate={animatePath(layers.foam)}
          transition={wave(DURATION + 3, 1.1)}
          fill="none"
          stroke="url(#bw-foam)"
          strokeWidth="2.5"
        />
      </motion.svg>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-[#0A1628]/15 to-[#0A1628]/25" />
    </div>
  );
};

export default BlueWaveBackground;
