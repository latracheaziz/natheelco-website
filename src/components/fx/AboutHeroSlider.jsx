import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import FluidWaveBackground from './FluidWaveBackground';

const slides = [
  {
    id: 1,
    eyebrow: "من نحن",
    title: "في نثيل",
    subtitle: "نعمل على تحويل الأفكار الواعدة إلى مشاريع منظّمة قابلة للنمو. نطوّر نموذج العمل، ونبني الفريق والأنظمة، ونقود التنفيذ للوصول إلى نمو وربحية مستدامة.",
  }
];

const AboutHeroSlider = () => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleScenicMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--roots-pointer-x', `${horizontal * -18}px`);
    event.currentTarget.style.setProperty('--roots-pointer-y', `${vertical * -12}px`);
  };

  const handleScenicLeave = (event) => {
    event.currentTarget.style.setProperty('--roots-pointer-x', '0px');
    event.currentTarget.style.setProperty('--roots-pointer-y', '0px');
  };

  const slide = slides[active];

  return (
    <section
      ref={ref}
      onMouseMove={handleScenicMove}
      onMouseLeave={handleScenicLeave}
      className="bg-primary relative overflow-hidden min-h-[100dvh] flex flex-col justify-end fluid-wave-hero"
    >
      <FluidWaveBackground />

      <motion.div
        style={{ rotateX, y, opacity, transformPerspective: 1200, transformOrigin: '50% 0%' }}
        className="container-premium section-padding pt-40 pb-32 lg:pt-48 lg:pb-40 relative z-10 w-full"
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-3 text-base md:text-lg font-semibold tracking-[0.2em] uppercase fluid-wave-eyebrow">
                <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_12px_#5FD4E6] animate-pulse fluid-wave-accent" />
                {slide.eyebrow}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-[900] leading-[1.1] mb-6 text-white fluid-wave-heading">
              <span className="fluid-wave-title pb-2 inline-block">
                {slide.title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl lg:text-[34px] text-white/90 leading-[1.7] md:leading-[1.7] font-medium fluid-wave-subtitle">
              {slide.subtitle}
            </p>

            {/* Progress indicators */}
            <div className="flex gap-3 mt-12 md:mt-16">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 bg-white/20 hover:bg-white/40"
                  style={{ width: active === i ? '48px' : '24px' }}
                >
                  {active === i && (
                    <motion.div
                      layoutId="slider-progress"
                      className="absolute inset-0 bg-white"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-accent-light/50 to-transparent" />
    </section>
  );
};

export default AboutHeroSlider;
