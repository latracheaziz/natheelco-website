import { motion } from 'framer-motion';
import RevealText from './fx/RevealText';
import AnimatedProcessBackground from './fx/AnimatedProcessBackground';

const HowWeWorkHero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#004499] text-white">
      {/* 
        Ensure navbar stays visible. 
        The existing Navbar is fixed and has a z-index. 
        We just need to ensure the hero padding accounts for it.
      */}
      
      {/* Interactive Process Background */}
      <AnimatedProcessBackground />

      {/* Hero Content */}
      <div className="container-premium section-padding relative z-10 w-full pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          {/* Eyebrow / Label */}
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="text-white font-bold tracking-wide text-base md:text-lg">منهجيتنا</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-[900] leading-[1.2] mb-8 text-balance text-white drop-shadow-lg">
            <RevealText text="نحوّل الفكرة إلى" immediate delay={0.4} stagger={0.06} />
            <br />
            <RevealText text="مشروع قابل للنمو" immediate delay={0.7} stagger={0.06} wordClassName="text-transparent bg-clip-text bg-gradient-to-l from-white to-white/70" />
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl text-white leading-relaxed font-medium max-w-3xl drop-shadow-sm"
          >
            نعمل بخطوات واضحة، تبدأ بدراسة الفكرة وتنتهي ببناء مشروع منظم ومستدام.
          </motion.p>
        </motion.div>
      </div>

    </section>
  );
};

export default HowWeWorkHero;
