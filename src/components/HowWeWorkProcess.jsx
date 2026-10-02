import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import RevealText from './fx/RevealText';

const ease = [0.16, 1, 0.3, 1];
const AUTO_SPEED = 6000;

/* ─── Icons ─────────────────────────────────────────────── */
const icons = {
  stage1: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M8 10.5h5M10.5 8v5" strokeLinecap="round" />
    </>
  ),
  stage2: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" strokeLinejoin="round" />
    </>
  ),
  stage3: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 15c2.8 0 5 2.2 5 5" strokeLinecap="round" />
    </>
  ),
  stage4: (
    <>
      <path d="M14 5 19 10 9 20H4v-5L14 5Z" strokeLinejoin="round" />
      <path d="m12 7 5 5M4 20l4-1" strokeLinecap="round" />
    </>
  ),
  stage5: (
    <>
      <path d="M4 19V5M4 19h16M8 15v-3M12 15V9M16 15V6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  stage6: (
    <>
      <path d="M4 17 10 11l4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

const stages = [
  {
    id: 'stage1', number: '01', title: 'دراسة الفكرة',
    text: 'نقيّم الفكرة واحتياجات السوق وفرص نجاحها لضمان جدواها قبل البدء.',
    color: '#3AA8BC',
  },
  {
    id: 'stage2', number: '02', title: 'بناء النموذج',
    text: 'نحدد مفهوم المشروع، ونموذج العمل، والميزانية، ومؤشرات الأداء بدقة.',
    color: '#5FD4E6',
  },
  {
    id: 'stage3', number: '03', title: 'تشكيل الفريق',
    text: 'نختار الكفاءات المتمكنة في التنفيذ ونحدد الأهداف ومسؤولياتها لضمان الاستمرارية.',
    color: '#3AA8BC',
  },
  {
    id: 'stage4', number: '04', title: 'التجهيز والإطلاق',
    text: 'ندير التمويل، ونجهّز العلامة التجارية، ونطلق المشروع بخطة تشغيلية واضحة.',
    color: '#5FD4E6',
  },
  {
    id: 'stage5', number: '05', title: 'المتابعة والتطوير',
    text: 'نراقب الأداء، ونطوّر المشروع باستمرار بناءً على النتائج والمؤشرات الفعلية.',
    color: '#3AA8BC',
  },
  {
    id: 'stage6', number: '06', title: 'النمو والاستقلال',
    text: 'نمنح الفريق صلاحيات أكبر، ونقود المشروع نحو نمو مستقر ومستدام.',
    color: '#5FD4E6',
  },
];

/* ─── Interactive 3D Card Hook ─────────────────────────── */
const use3DCard = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 70, damping: 25 });
  const smy = useSpring(my, { stiffness: 70, damping: 25 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [8, -8]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [-8, 8]);
  const lightX = useTransform(smx, [-0.5, 0.5], [100, 0]);
  const lightY = useTransform(smy, [-0.5, 0.5], [100, 0]);
  const lightBg = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(95,212,230,0.18) 0%, transparent 60%)`;

  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0);
  }, [mx, my]);

  return { rotateX, rotateY, lightBg, onMove, onLeave };
};

/* ─── Main Component ─────────────────────────────────────── */
const HowWeWorkProcess = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const autoRef = useRef(null);
  const activeStage = stages[activeIdx];

  // Auto-play logic
  useEffect(() => {
    if (!isAuto) return;
    autoRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stages.length);
    }, AUTO_SPEED);
    return () => clearInterval(autoRef.current);
  }, [isAuto]);

  const selectStage = (idx) => {
    setActiveIdx(idx);
    setIsAuto(false);
    clearTimeout(window._hwwResume);
    window._hwwResume = setTimeout(() => setIsAuto(true), 15000);
  };

  const { rotateX, rotateY, lightBg, onMove, onLeave } = use3DCard();

  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-36 min-h-[100dvh] flex flex-col justify-center">
      
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient mesh */}
        <motion.div 
          className="absolute inset-0 opacity-40"
          animate={{
            background: `radial-gradient(circle at ${50 + (activeIdx * 10)}% ${40 + (activeIdx * 5)}%, ${activeStage.color}15, transparent 60%)`
          }}
          transition={{ duration: 1.5, ease }}
        />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(10,22,40,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container-premium relative z-10" dir="rtl">
        
        {/* ── Header ── */}
        <div className="text-center mb-12 lg:mb-28 px-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-4 sm:mb-6"
          >
            <span className="w-6 sm:w-8 h-px bg-accent" />
            منهجية العمل
            <span className="w-6 sm:w-8 h-px bg-accent" />
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-heading font-[900] text-primary leading-[1.3] md:leading-[1.2] mb-4 sm:mb-6">
            <RevealText text="كيف نعمل في نثيل؟" />
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            رحلة متكاملة تبدأ من الفكرة وتصل إلى الاستقلالية والنمو المستدام.
          </p>
        </div>

        {/* ── Interactive Timeline Path ── */}
        <div className="relative mb-16 lg:mb-24 px-4 sm:px-10">
          {/* SVG Connection Line */}
          <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-primary/[0.04] -translate-y-1/2 rounded-full overflow-hidden hidden md:block">
            <motion.div 
              className="h-full bg-gradient-to-l from-accent to-accent-light shadow-[0_0_15px_rgba(95,212,230,0.5)]"
              animate={{ width: `${(activeIdx / (stages.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="relative flex justify-start md:justify-between items-center z-10 gap-6 md:gap-0 overflow-x-auto md:overflow-visible pb-6 md:pb-0 hide-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-0">
            {stages.map((stage, idx) => {
              const isActive = activeIdx === idx;
              const isPast = activeIdx > idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => selectStage(idx)}
                  className="group relative flex flex-col items-center gap-3 sm:gap-4 min-w-[90px] sm:min-w-[100px] md:min-w-0 focus:outline-none shrink-0 snap-center"
                >
                  {/* Orb */}
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 rounded-full border bg-white"
                      animate={{
                        borderColor: isActive ? '#3AA8BC' : isPast ? 'rgba(58,168,188,0.6)' : 'rgba(10,22,40,0.3)',
                        scale: isActive ? 1.15 : 1,
                        boxShadow: isActive ? '0 0 20px rgba(95,212,230,0.3)' : '0 4px 10px rgba(10,22,40,0.02)'
                      }}
                      transition={{ duration: 0.4, ease }}
                    />
                    
                    {/* Active Pulsing Ring */}
                    {isActive && (
                      <motion.div 
                        className="absolute -inset-3 rounded-full border border-accent/40"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}

                    {/* Progress Ring (Auto-play indicator) */}
                    {isActive && isAuto && (
                      <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
                        <motion.circle
                          cx="50%" cy="50%" r="48%"
                          fill="none"
                          stroke="#3AA8BC"
                          strokeWidth="2"
                          strokeDasharray="100 100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ duration: AUTO_SPEED / 1000, ease: 'linear' }}
                          className="opacity-80"
                        />
                      </svg>
                    )}

                    <span 
                      className={`font-mono text-sm md:text-lg font-bold transition-colors duration-300 relative z-10 ${isActive ? 'text-accent' : 'text-primary'}`}
                    >
                      {stage.number}
                    </span>
                  </div>

                  {/* Title Label */}
                  <div className="text-center">
                    <motion.span 
                      className="block text-xs md:text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                      animate={{ color: isActive ? '#3AA8BC' : 'rgba(10,22,40,0.5)' }}
                    >
                      {stage.title}
                    </motion.span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D Dynamic Content Card ── */}
        <div className="flex justify-center perspective-[1200px] px-4 md:px-0 mx-auto w-full max-w-[100vw] overflow-hidden md:overflow-visible">
          <motion.div
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="w-full max-w-4xl relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_24px_70px_-36px_rgba(10,22,40,0.15)] mx-auto"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          >
            {/* Card Background Container */}
            <div className="absolute inset-0 border-[1.5px] border-primary/30 rounded-[32px] bg-white/80 backdrop-blur-xl" />
            
            {/* Mouse Tracking Light */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              style={{ background: lightBg }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease }}
                className="relative p-6 sm:p-8 md:p-14 grid md:grid-cols-[1fr_2fr] gap-6 sm:gap-8 md:gap-12 items-center"
              >
                
                {/* Left side: Holographic Icon */}
                <div className="flex justify-center" style={{ transform: 'translateZ(60px)' }}>
                  <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                    {/* Rotating Rings */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-dashed border-accent/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div 
                      className="absolute inset-4 rounded-full border border-accent/20"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Inner Glowing Core */}
                    <motion.div 
                      className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/15 blur-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="relative text-accent w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_4px_12px_rgba(58,168,188,0.3)]">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
                        {icons[activeStage.id]}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right side: Content */}
                <div className="text-center md:text-right" style={{ transform: 'translateZ(40px)' }}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-3 mb-6"
                  >
                    <span className="w-10 h-[2px] bg-accent/50" />
                    <span className="font-mono text-accent text-sm tracking-[0.2em] font-semibold">المرحلة {activeStage.number}</span>
                  </motion.div>

                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-[900] text-primary mb-4 sm:mb-6 leading-tight"
                  >
                    {activeStage.title}
                  </motion.h3>

                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed font-medium"
                  >
                    {activeStage.text}
                  </motion.p>

                  {/* Manual Navigation Controls inside card */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center md:justify-start gap-4 mt-10"
                  >
                    <button 
                      onClick={() => selectStage((activeIdx + stages.length - 1) % stages.length)}
                      className="w-12 h-12 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:bg-surface-warm hover:text-primary transition-all group"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button 
                      onClick={() => selectStage((activeIdx + 1) % stages.length)}
                      className="px-6 h-12 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2 group shadow-[0_4px_12px_rgba(58,168,188,0.1)]"
                    >
                      المرحلة التالية
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </motion.div>
                </div>

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HowWeWorkProcess;
