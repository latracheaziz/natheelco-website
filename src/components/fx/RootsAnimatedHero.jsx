import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import RevealText from './RevealText';

const RootsAnimatedHero = ({ title, subtitle }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

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

  // Scroll Parallax 
  const yBase = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Image Source
  const bgSrc = "/roots-hero.jpeg";

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a111a]"
    >
      {/* SVG Filters for Wind Effects */}
      <svg className="hidden w-0 h-0 absolute">
        <defs>
          <filter id="wind-palms">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="5">
              <animate attributeName="baseFrequency" values="0.015 0.02;0.018 0.025;0.015 0.02" dur="12s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={reduceMotion ? 0 : 4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wind-foreground">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" seed="2">
              <animate attributeName="baseFrequency" values="0.02 0.05;0.03 0.06;0.02 0.05" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={reduceMotion ? 0 : 3} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* BACKGROUND LAYERS */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none origin-center"
        style={{ y: yBase, scale: 1.05 }} // Slight scale to hide edges during parallax
      >
        
        {/* Layer 1: Base Landscape Image */}
        <motion.div 
          className="absolute inset-0"
          animate={!reduceMotion && !isMobile ? { x: mousePos.x * -10, y: mousePos.y * -10 } : {}}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        >
          <img src={bgSrc} alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Layer 2: Slow Cloud Movement (Overlaying Noise) */}
        {!reduceMotion && (
          <motion.div 
            className="absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 55%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 55%)'
            }}
            animate={{ x: mousePos.x * -15, y: mousePos.y * -15 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
          >
            {/* Extremely slow drifting large cloud-like noise */}
            <motion.div 
              className="absolute top-0 left-[-50%] w-[200%] h-full bg-[url('/noise.png')] bg-repeat opacity-40 mix-blend-screen"
              animate={{ x: ["0%", "20%"] }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '150px' }}
            />
          </motion.div>
        )}

        {/* Layer 3: Subtle Palm Tree Movement (using SVG Filter) */}
        {!reduceMotion && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              // Mask out only the middle section where palm trees are (approx 30% to 70% height)
              maskImage: 'linear-gradient(to bottom, transparent 20%, black 40%, black 65%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 40%, black 65%, transparent 75%)',
              filter: 'url(#wind-palms)'
            }}
            animate={!isMobile ? { x: mousePos.x * -12, y: mousePos.y * -12 } : {}}
            transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
          >
            <img src={bgSrc} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Layer 4: Foreground Vegetation Movement */}
        {!reduceMotion && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              // Mask only the bottom 25% where dark bushes are
              maskImage: 'linear-gradient(to bottom, transparent 75%, black 85%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 75%, black 85%, black 100%)',
              filter: 'url(#wind-foreground)'
            }}
            animate={!isMobile ? { x: mousePos.x * -25, y: mousePos.y * -25 } : {}}
            transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
          >
            <img src={bgSrc} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Layer 5: Cinematic Cinematic Dark Gradient & Treatment */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]/10 opacity-90 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06152F]/20 to-transparent opacity-60 mix-blend-color-burn pointer-events-none" />

      </motion.div>

      {/* Layer 6: Hero Text & Content */}
      <motion.div
        style={{ opacity, y: yText }}
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
      
      {/* Edge blend to body content */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default RootsAnimatedHero;
