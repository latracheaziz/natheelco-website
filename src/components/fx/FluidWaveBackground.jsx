import { motion, useReducedMotion } from 'framer-motion';
import './FluidWaveBackground.css';

const folds = {
  outer: [
    'M-150 255 C70 112 329 70 548 171 C767 273 812 512 1032 587 C1244 660 1420 488 1740 296',
    'M-150 288 C74 145 335 100 552 198 C771 296 824 536 1045 613 C1257 687 1427 520 1740 331',
    'M-150 255 C70 112 329 70 548 171 C767 273 812 512 1032 587 C1244 660 1420 488 1740 296',
  ],
  center: [
    'M-150 410 C99 265 336 208 548 291 C747 369 803 614 1017 684 C1227 752 1430 602 1740 432',
    'M-150 445 C100 300 340 242 553 324 C752 400 814 648 1028 716 C1237 783 1435 639 1740 469',
    'M-150 410 C99 265 336 208 548 291 C747 369 803 614 1017 684 C1227 752 1430 602 1740 432',
  ],
  lower: [
    'M-150 570 C95 432 360 365 563 448 C755 527 817 737 1026 796 C1234 854 1443 725 1740 565',
    'M-150 600 C100 460 365 395 570 475 C763 550 828 765 1036 824 C1243 882 1450 755 1740 598',
    'M-150 570 C95 432 360 365 563 448 C755 527 817 737 1026 796 C1234 854 1443 725 1740 565',
  ],
  upper: [
    'M-170 120 C75 8 340 14 547 116 C760 222 814 418 1016 476 C1230 537 1436 382 1750 192',
    'M-170 152 C80 40 345 45 551 148 C764 252 824 449 1026 508 C1240 570 1444 418 1750 228',
    'M-170 120 C75 8 340 14 547 116 C760 222 814 418 1016 476 C1230 537 1436 382 1750 192',
  ],
};

const FluidWaveBackground = () => {
  const reduceMotion = useReducedMotion();
  const animatePath = (frames) => (reduceMotion ? { d: frames[0] } : { d: frames });
  const transition = (duration, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: 'easeInOut' };

  const ribbon = (name, width, opacity, filter, stroke) => (
    <motion.path
      key={`${name}-${width}`}
      d={folds[name][0]}
      animate={animatePath(folds[name])}
      transition={transition(name === 'center' ? 22 : 27, name === 'upper' ? 1.5 : 0)}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      filter={filter}
    />
  );

  return (
    <div className="fluid-wave-background absolute inset-x-0 top-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="fluid-wave-atmosphere absolute inset-[-8%]" />
      <motion.svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-[-4%] h-[108%] w-[108%]"
        style={{
          x: reduceMotion ? 0 : 'calc(var(--roots-pointer-x, 0px) * 0.42)',
          y: reduceMotion ? 0 : 'calc(var(--roots-pointer-y, 0px) * 0.42)',
          scale: 1.04,
        }}
      >
        <defs>
          <linearGradient id="fluid-base" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B3A5C" />
            <stop offset="34%" stopColor="#132240" />
            <stop offset="64%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#132240" />
          </linearGradient>
          <linearGradient id="fluid-ribbon" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0%" stopColor="#2E8B9C" stopOpacity="0.12" />
            <stop offset="30%" stopColor="#1B3A5C" stopOpacity="0.55" />
            <stop offset="54%" stopColor="#3AA8BC" stopOpacity="0.9" />
            <stop offset="76%" stopColor="#132240" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2E8B9C" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="fluid-edge" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#5FD4E6" stopOpacity="0.14" />
            <stop offset="44%" stopColor="#3AA8BC" stopOpacity="0.56" />
            <stop offset="66%" stopColor="#5FD4E6" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#2E8B9C" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="fluid-glow-left">
            <stop offset="0%" stopColor="#2E8B9C" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2E8B9C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fluid-glow-right">
            <stop offset="0%" stopColor="#1B3A5C" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#1B3A5C" stopOpacity="0" />
          </radialGradient>
          <filter id="fluid-bloom" x="-30%" y="-40%" width="160%" height="180%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="fluid-soft" x="-24%" y="-24%" width="148%" height="148%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="fluid-shadow" x="-22%" y="-30%" width="144%" height="160%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill="url(#fluid-base)" />
        <motion.ellipse
          cx="280" cy="208" rx="590" ry="340" fill="url(#fluid-glow-left)"
          animate={reduceMotion ? undefined : { cx: [280, 390, 280], cy: [208, 296, 208] }}
          transition={transition(30)}
        />
        <motion.ellipse
          cx="1390" cy="620" rx="610" ry="390" fill="url(#fluid-glow-right)"
          animate={reduceMotion ? undefined : { cx: [1390, 1250, 1390], cy: [620, 532, 620] }}
          transition={transition(26, 2)}
        />
        <ellipse cx="820" cy="468" rx="620" ry="340" fill="#020d35" opacity="0.22" />

        {/* Simplified shadows */}
        {ribbon('outer', 80, 0.15, undefined, '#020b2d')}
        {ribbon('center', 85, 0.15, undefined, '#020a30')}
        {ribbon('lower', 80, 0.15, undefined, '#020a30')}

        {/* Base ribbons */}
        {ribbon('outer', 60, 0.4, undefined, 'url(#fluid-ribbon)')}
        {ribbon('center', 65, 0.5, undefined, 'url(#fluid-ribbon)')}
        {ribbon('lower', 60, 0.4, undefined, 'url(#fluid-ribbon)')}
        {ribbon('upper', 50, 0.3, undefined, 'url(#fluid-ribbon)')}

        {/* Edge highlights */}
        {ribbon('outer', 3, 0.6, undefined, 'url(#fluid-edge)')}
        {ribbon('center', 3.5, 0.7, undefined, 'url(#fluid-edge)')}
        {ribbon('lower', 3, 0.5, undefined, 'url(#fluid-edge)')}
        {ribbon('upper', 2.5, 0.4, undefined, 'url(#fluid-edge)')}
      </motion.svg>
      <div className="fluid-wave-fade absolute inset-0" />
    </div>
  );
};

export default FluidWaveBackground;
