import { motion, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Reveal3D from './fx/Reveal3D';
import TiltCard from './fx/TiltCard';
import { useMediaQuery } from './fx/useCanHover';

const CARD_W = 600; // Increased card width
const RADIUS = 640; // Increased radius to fit larger cards
const AUTO_SPEED = 0.012; // degrees per ms

const slides = [
  {
    src: '/roots/roots-01.png',
    alt: 'وادي تحيط به الجبال والنخيل ومجرى الماء',
  },
  {
    src: '/roots/roots-02.png',
    alt: 'جبال صخرية تحيط بمجرى ماء',
  },
  {
    src: '/roots/roots-03.png',
    alt: 'وادي جبلي ومجرى مائي وقت الغروب',
  },
];

const RingCard = ({ slide, index, originalIndex, count, rotation, dragMoved }) => {
  const base = (360 / count) * index;
  const facing = useTransform(rotation, (r) => Math.cos(((base - r) * Math.PI) / 180));
  const opacity = useTransform(facing, [-1, 0, 1], [0.06, 0.3, 1]);
  const pointerEvents = useTransform(facing, (f) => (f > 0.2 ? 'auto' : 'none'));

  return (
    <motion.div
      className="ring-card group absolute top-0"
      style={{
        width: CARD_W,
        left: '50%',
        marginLeft: -CARD_W / 2,
        transform: `rotateY(${base}deg) translateZ(${RADIUS}px)`,
        opacity,
        pointerEvents,
      }}
    >
      <motion.div
        whileHover={{ y: -14, z: 40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="preserve-3d h-full relative isolate aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/15 bg-primary-light shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] cursor-grab active:cursor-grabbing"
      >
        <img
          src={slide.src}
          alt={slide.alt}
          draggable="false"
          className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/5 to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/25 via-transparent to-transparent pointer-events-none" />

        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-primary/35 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-white/85 backdrop-blur-xl sm:right-6 sm:top-6 sm:px-5 sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_10px_#5FD4E6]" />
          <span>جذور نثيل</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 pointer-events-none">
          <span
            className="font-latin text-5xl font-black leading-none text-white/30 sm:text-7xl"
            aria-hidden="true"
          >
            {String(originalIndex + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RootsShowcase = () => {
  const reduce = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 900px)');
  const rotation = useMotionValue(0);
  const ringRotate = useTransform(rotation, (r) => -r);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ active: false, startX: 0, startRot: 0 });
  const dragMoved = useRef(false);

  // Repeat slides to make a nice continuous ring (3 items is too few for a 3D ring)
  const extendedSlides = useMemo(() => [...slides, ...slides], []);

  useAnimationFrame((_, delta) => {
    if (paused || drag.current.active || reduce || !isWide) return;
    rotation.set(rotation.get() + AUTO_SPEED * delta);
  });

  const onPointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startRot: rotation.get() };
    dragMoved.current = false;
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) dragMoved.current = true;
    rotation.set(drag.current.startRot - dx * 0.25);
  };
  const endDrag = () => {
    drag.current.active = false;
    setTimeout(() => { dragMoved.current = false; }, 0);
  };

  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28" dir="rtl">
      <div className="aurora opacity-35" />
      <div className="grain" />
      <div className="absolute -left-44 top-1/4 h-[440px] w-[440px] rounded-full bg-accent/10 blur-[130px]" />

      <div className="container-premium section-padding relative z-10">
        <Reveal3D className="mb-8 flex justify-start sm:mb-10" dir="rtl">
          <div>
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.16em] text-accent-light">
              <span className="h-px w-8 bg-accent-light" />
              مشاهد من الجذور
              <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_12px_#5FD4E6]" />
            </span>
          </div>
        </Reveal3D>

        {!isWide || reduce ? (
          // Mobile Fallback: Horizontal Scroll
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-6">
            {slides.map((slide, index) => (
              <TiltCard
                key={index}
                max={6}
                className="snap-center shrink-0 w-[300px] sm:w-[400px] rounded-[24px]"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] border border-white/15 bg-primary-light">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="font-latin text-4xl font-black text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          // Desktop: 3D Spinning Ring
          <div
            className="ring-stage relative h-[700px] select-none mt-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => { setPaused(false); endDrag(); }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
          >
            {/* Floor reflection */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[140px] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(46,139,156,0.18),transparent_70%)] blur-xl pointer-events-none" />
            
            <motion.div
              className="ring absolute left-1/2 top-4 h-[440px]"
              style={{ rotateX: -8, rotateY: ringRotate, z: -RADIUS }}
            >
              {extendedSlides.map((slide, index) => (
                <RingCard
                  key={index}
                  slide={slide}
                  index={index}
                  originalIndex={index % slides.length}
                  count={extendedSlides.length}
                  rotation={rotation}
                  dragMoved={dragMoved}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RootsShowcase;
