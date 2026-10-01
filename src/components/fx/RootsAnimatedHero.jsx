import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import RevealText from './RevealText';
import RootsWindScene from './RootsWindScene';

const RootsAnimatedHero = ({ title, subtitle }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
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

  // Scroll Parallax for sticky hero text
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Image Source
  const bgSrc = "/roots-hero.jpeg";

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative h-screen flex items-center justify-center"
    >
      {/* BACKGROUND LAYERS */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none origin-center"
        style={{ scale: 1.05 }}
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
      <motion.div
        style={{ opacity: textOpacity, y: yText }}
        className="container-premium relative z-10 w-full pt-40 pb-24 lg:pt-48 lg:pb-32 flex flex-col justify-end min-h-full"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="w-10 h-px bg-white/60" />
            <span className="text-white/80 font-medium tracking-wide text-sm md:text-base">قصتنا</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-heading font-[900] leading-none mb-6 text-white drop-shadow-xl">
            <RevealText text={title} immediate delay={0.4} stagger={0.1} />
          </h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-3xl text-white/60 font-heading font-bold max-w-2xl drop-shadow-md"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
      
    </section>
  );
};

export default RootsAnimatedHero;
