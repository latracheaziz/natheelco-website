import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Reveal3D from './fx/Reveal3D';
import TiltCard from './fx/TiltCard';

const SLIDE_DURATION = 5000;

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

const ArrowIcon = ({ direction = 'left' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`h-5 w-5 ${direction === 'right' ? 'rotate-180' : ''}`}
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d="M19 12H5m0 0 6 6m-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RootsShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsed = useRef(0);
  const thumbnailRefs = useRef([]);
  const swipeStartX = useRef(null);
  const reduceMotion = useReducedMotion();
  const activeSlide = slides[activeIndex];

  const showSlide = (index, requestedDirection) => {
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === activeIndex) return;
    const forwardDistance = (nextIndex - activeIndex + slides.length) % slides.length;
    setDirection(requestedDirection ?? (forwardDistance <= slides.length / 2 ? 1 : -1));
    elapsed.current = 0;
    setProgress(0);
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    if (!isPlaying || isFocused) return undefined;

    let previousTime = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - previousTime;
      previousTime = now;

      const nextProgress = Math.min(elapsed.current / SLIDE_DURATION, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        elapsed.current = 0;
        setProgress(0);
        setDirection(1);
        setActiveIndex((current) => (current + 1) % slides.length);
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [isPlaying, isFocused]);

  const handleThumbnailKeyDown = (event, index) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextIndex = (index + 1) % slides.length;
      showSlide(nextIndex, 1);
      thumbnailRefs.current[nextIndex]?.focus();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (index - 1 + slides.length) % slides.length;
      showSlide(nextIndex, -1);
      thumbnailRefs.current[nextIndex]?.focus();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0, -1);
      thumbnailRefs.current[0]?.focus();
    }
    if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1, 1);
      thumbnailRefs.current[slides.length - 1]?.focus();
    }
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' || event.target.closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    swipeStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (swipeStartX.current === null) return;
    const distance = swipeStartX.current - event.clientX;
    swipeStartX.current = null;
    if (Math.abs(distance) < 48) return;
    showSlide(activeIndex + (distance > 0 ? 1 : -1), distance > 0 ? 1 : -1);
  };

  const clearPointer = () => { swipeStartX.current = null; };

  return (
    <section
      className="relative overflow-hidden bg-primary py-20 lg:py-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
      }}
      dir="rtl"
    >
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

        <Reveal3D rotateX={8} rotateY={-3} distance={70} offset={['start 0.95', 'start 0.6']}>
          <TiltCard max={3.5} hoverScale={1.006} className="rounded-[28px] sm:rounded-[36px]">
            <div
              className="relative isolate aspect-[4/3] touch-pan-y overflow-hidden rounded-[28px] border border-white/15 bg-primary-light shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8),0_0_60px_rgba(58,168,188,0.12)] sm:aspect-[16/9] sm:rounded-[36px] lg:aspect-[1.95/1]"
              style={{ perspective: 1500 }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={clearPointer}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={activeSlide.src}
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  draggable="false"
                  className="absolute inset-0 h-full w-full select-none object-cover origin-center"
                  initial={reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.88, rotateY: direction * 45, rotateX: 8, x: direction * 120, z: -150, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, x: 0, z: 0, filter: 'blur(0px)' }}
                  exit={reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.88,
                        rotateY: direction * -45,
                        rotateX: -8,
                        x: direction * -120,
                        z: -150,
                        filter: 'blur(12px)',
                        transition: { duration: 0.85, ease: [0.25, 1, 0.35, 1] },
                      }}
                  transition={reduceMotion
                    ? { opacity: { duration: 0.35 } }
                    : {
                        opacity: { duration: 0.8, ease: [0.25, 1, 0.35, 1] },
                        scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                        rotateY: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                        rotateX: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                        x: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                        z: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                        filter: { duration: 0.8 },
                      }}
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transformOrigin: 'center center' }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/5 to-primary/10" />
              <div className="absolute inset-0 bg-gradient-to-l from-primary/25 via-transparent to-transparent" />

              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-primary/35 px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-white/85 backdrop-blur-xl sm:right-8 sm:top-8 sm:px-4 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_10px_#5FD4E6]" />
                <span>جذور نثيل</span>
                <span dir="ltr" className="font-latin text-white/60">{String(activeIndex + 1).padStart(2, '0')} / 03</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7 md:p-9">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-end gap-3 sm:gap-5">
                    <motion.span
                      key={`display-number-${activeIndex}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 0.72, y: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.55 }}
                      className="hidden font-latin text-5xl font-black leading-none text-white/30 sm:block md:text-7xl"
                      aria-hidden="true"
                    >
                      {String(activeIndex + 1).padStart(2, '0')}
                    </motion.span>
                    <div className="min-w-0 flex-1 pb-0.5">
                      <div className="h-[2px] overflow-hidden rounded-full bg-white/25">
                        <motion.div
                          className="h-full origin-right rounded-full bg-gradient-to-l from-accent-glow to-white shadow-[0_0_12px_rgba(95,212,230,0.8)]"
                          animate={{ scaleX: progress }}
                          transition={{ duration: 0.12, ease: 'linear' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                      onClick={() => {
                        if (!isPlaying) setIsFocused(false);
                        setIsPlaying(!isPlaying);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                      aria-label={isPlaying ? 'إيقاف العرض التلقائي' : 'تشغيل العرض التلقائي'}
                      title={isPlaying ? 'إيقاف العرض التلقائي' : 'تشغيل العرض التلقائي'}
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                          <path d="M8 5h3v14H8zM14 5h3v14h-3z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-0.5" aria-hidden="true">
                          <path d="M7 4.8c0-.8.9-1.3 1.6-.9l11.1 7.1a1.2 1.2 0 0 1 0 2L8.6 20.1c-.7.4-1.6-.1-1.6-.9V4.8Z" />
                        </svg>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={reduceMotion ? undefined : { scale: 1.08, x: -2 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                      onClick={() => showSlide(activeIndex - 1, -1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                      aria-label="الصورة السابقة"
                    >
                      <ArrowIcon direction="right" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={reduceMotion ? undefined : { scale: 1.08, x: 2 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                      onClick={() => showSlide(activeIndex + 1, 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                      aria-label="الصورة التالية"
                    >
                      <ArrowIcon />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal3D>

        <div role="tablist" aria-label="اختر صورة من جذورنا" className="mt-5 grid grid-cols-3 gap-3 sm:mt-7 sm:gap-5">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={slide.src}
                ref={(element) => { thumbnailRefs.current[index] = element; }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`عرض الصورة ${index + 1}: ${slide.alt}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => showSlide(index)}
                onMouseEnter={() => showSlide(index)}
                onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
                whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={`group relative aspect-[2/1] overflow-hidden rounded-xl border text-right transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light sm:aspect-[2.35/1] sm:rounded-2xl ${
                  isActive ? 'border-accent-light shadow-[0_0_0_2px_rgba(95,212,230,0.28),0_16px_36px_-18px_rgba(0,0,0,0.7)]' : 'border-white/15 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={slide.src} alt="" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'group-hover:scale-110'}`} />
                <span className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
                <span className="absolute bottom-2 right-2 flex items-center gap-2 text-[10px] font-semibold text-white sm:bottom-3 sm:right-4 sm:text-xs">
                  <span dir="ltr" className="font-latin tracking-[0.12em] text-accent-light">{String(index + 1).padStart(2, '0')}</span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="roots-active-thumbnail"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent-light shadow-[0_0_12px_#5FD4E6]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RootsShowcase;
