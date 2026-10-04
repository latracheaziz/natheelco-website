import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import RevealText from './RevealText';
import RootsWindScene from './RootsWindScene';

const RootsAnimatedHero = ({ title, subtitle }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // The route wrapper is transformed, which breaks position: fixed, so the image is counter-translated to stay pinned to the viewport.
  const y = useTransform(scrollYProgress, (p) => {
    const el = ref.current;
    if (!el) return 0;
    const vh = window.innerHeight;
    return -vh + p * (vh + el.offsetHeight);
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Subtle Mouse Parallax (Desktop Only)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (reduceMotion || isMobile || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  // Image Source
  const bgSrc = "/roots-hero.jpeg";

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex h-[100dvh] items-center justify-center overflow-hidden"
    >
      {/* BACKGROUND LAYERS */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[100dvh] w-full origin-center will-change-transform"
        style={{ y, scale: 1.05 }}
      >

        {/* Layer 1: Landscape with wind */}
        <motion.div
          className="absolute inset-0"
          animate={!reduceMotion && !isMobile ? { x: mousePos.x * -10, y: mousePos.y * -10 } : {}}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        >
          <RootsWindScene src={bgSrc} />
        </motion.div>

        {/* Layer 2: Solid Dark Color Treatment */}
        <div className="absolute inset-0 bg-[#020617]/40 mix-blend-multiply pointer-events-none" />

      </motion.div>

      {/* Hero Text & Content */}
      <div
        className="container-premium section-padding relative z-10 flex min-h-full w-full flex-col justify-end pb-16 pt-32 lg:pb-32 lg:pt-48"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-3 md:mb-6">
            <span className="w-8 h-px bg-white/60 md:w-10" />
            <span className="text-white/80 font-medium tracking-wide text-xs sm:text-sm md:text-base">قصتنا</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-heading font-[900] leading-tight md:leading-none mb-4 md:mb-6 text-white drop-shadow-xl">
            <RevealText text={title} immediate delay={0.4} stagger={0.1} />
          </h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl md:text-3xl text-white/60 font-heading font-bold max-w-2xl drop-shadow-md leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RootsAnimatedHero;
