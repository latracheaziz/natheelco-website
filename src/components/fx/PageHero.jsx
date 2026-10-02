import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import RevealText from './RevealText';
import FloatingShapes from './FloatingShapes';
import WaveLinesBackground from './WaveLinesBackground';
import BlueWaveBackground from './BlueWaveBackground';

const ScenicHeroBackground = ({ src, scrollProgress }) => {
  const parallaxY = useTransform(scrollProgress, [0, 1], [0, 54]);

  return (
    <motion.div className="roots-hero-scene absolute inset-0" style={{ y: parallaxY }} aria-hidden="true">
      <div className="roots-hero-camera">
        <img className="roots-hero-photo" src={src} alt="" fetchPriority="high" />
      </div>
      <div className="roots-cloud-drift roots-cloud-drift--high" />
      <div className="roots-cloud-drift roots-cloud-drift--low" />
      <div className="roots-palm-breeze" />
      <div className="roots-hero-shade" />
    </motion.div>
  );
};

const PageHero = ({
  eyebrow,
  title,
  subtitle,
  subtitleClassName = 'text-lg text-white/50 mt-6 max-w-xl leading-relaxed font-light',
  variant = 0,
  showHeritageMark = false,
  heritageMarkClassName = '',
  backgroundImage = '',
  useWaveLines = false,
  useEnvatoWave = false,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScenicMove = (event) => {
    if (!backgroundImage) return;
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

  return (
    <section
      ref={ref}
      onMouseMove={backgroundImage ? handleScenicMove : undefined}
      onMouseLeave={backgroundImage ? handleScenicLeave : undefined}
      className={`bg-primary relative overflow-hidden min-h-[70vh] flex items-end ${backgroundImage ? 'roots-photo-hero' : ''}`}
    >
      {backgroundImage ? (
        <ScenicHeroBackground src={backgroundImage} scrollProgress={scrollYProgress} />
      ) : useEnvatoWave ? (
        <BlueWaveBackground />
      ) : useWaveLines ? (
        <WaveLinesBackground />
      ) : (
        <>
          <div className="aurora" />
          <div className="perspective-grid" />
          <div className="grain" />
          <FloatingShapes variant={variant} showHeritageMark={showHeritageMark} heritageMarkClassName={heritageMarkClassName} />
        </>
      )}

      <motion.div
        style={{ rotateX, y, opacity, transformPerspective: 1200, transformOrigin: '50% 0%' }}
        className="container-premium section-padding pt-40 pb-24 lg:pt-48 lg:pb-32 relative z-10 w-full"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.2em] uppercase text-accent-light">
            <motion.span
              className="h-px bg-accent-light origin-right"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            {eyebrow}
            <span className="w-1.5 h-1.5 rounded-full bg-accent-glow shadow-[0_0_12px_#5FD4E6] animate-pulse" />
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-[900] text-white leading-[1.1] max-w-3xl">
          <RevealText text={title} immediate delay={0.3} stagger={0.1} wordClassName="gradient-text-light pb-2" />
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={subtitleClassName}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-accent-light/50 to-transparent" />
    </section>
  );
};

export default PageHero;
