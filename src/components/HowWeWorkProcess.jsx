import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import RevealText from './fx/RevealText';
import { useLanguage } from '../context/LanguageContext';

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
      <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

/* ─── Stages Data: Verbatim from user prompt ─── */
const getStages = (isEn) =>
  isEn
    ? [
        {
          id: 'stage1',
          number: '01',
          title: 'Idea Assessment',
          text: 'We evaluate each idea, assess market needs, and identify opportunities to determine its viability before moving forward.',
          color: '#3AA8BC',
        },
        {
          id: 'stage2',
          number: '02',
          title: 'Business Model Development',
          text: 'We define the venture’s concept, business model, budget, and performance indicators with precision.',
          color: '#5FD4E6',
        },
        {
          id: 'stage3',
          number: '03',
          title: 'Team Formation',
          text: 'We select qualified professionals, establish clear objectives, and define roles and responsibilities to support effective execution and long-term continuity.',
          color: '#3AA8BC',
        },
        {
          id: 'stage4',
          number: '04',
          title: 'Preparation & Launch',
          text: 'We manage funding, develop the brand, and launch the venture with a clear operational plan.',
          color: '#5FD4E6',
        },
        {
          id: 'stage5',
          number: '05',
          title: 'Monitoring & Development',
          text: 'We monitor performance and continuously refine the venture based on actual results and measurable indicators.',
          color: '#3AA8BC',
        },
        {
          id: 'stage6',
          number: '06',
          title: 'Growth & Independence',
          text: 'We progressively expand the team’s authority and lead the venture toward stable, sustainable growth and greater operational independence.',
          color: '#5FD4E6',
        },
      ]
    : [
        {
          id: 'stage1',
          number: '01',
          title: 'تقييم الأفكار',
          text: 'نقوم بتقييم كل فكرة، ودراسة احتياج السوق، وتحديد الفرص للتحقق من جدواها قبل المضي قدماً.',
          color: '#3AA8BC',
        },
        {
          id: 'stage2',
          number: '02',
          title: 'بناء نموذج العمل',
          text: 'نحدد مفهوم المشروع، ونموذج العمل، والميزانية، ومؤشرات الأداء بدقة وإحكام.',
          color: '#5FD4E6',
        },
        {
          id: 'stage3',
          number: '03',
          title: 'تكوين الفريق',
          text: 'نختار الكفاءات المؤهلة، ونحدد أهدافاً واضحة، ونوزع الأدوار والمسؤوليات لضمان تنفيذ فعال واستمرارية طويلة الأمد.',
          color: '#3AA8BC',
        },
        {
          id: 'stage4',
          number: '04',
          title: 'التجهيز والانطلاق',
          text: 'ندير التمويل، ونطور الهوية والعلامة التجارية، ونطلق المشروع وفق خطة تشغيلية واضحة ومحكمة.',
          color: '#5FD4E6',
        },
        {
          id: 'stage5',
          number: '05',
          title: 'المتابعة والتطوير',
          text: 'نتابع الأداء ونطور المشروع باستمرار استناداً إلى النتائج الفعلية والمؤشرات القابلة للقياس.',
          color: '#3AA8BC',
        },
        {
          id: 'stage6',
          number: '06',
          title: 'النمو والاستقلالية',
          text: 'نوسع صلاحيات الفريق تدريجياً ونقود المشروع نحو نمو مستقر ومستدام واستقلالية تشغيلية كاملة.',
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

  const onMove = useCallback(
    (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return { rotateX, rotateY, lightBg, onMove, onLeave };
};

/* ─── Main Component ─────────────────────────────────────── */
const HowWeWorkProcess = () => {
  const { isAr, isEn, dir } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const autoRef = useRef(null);

  const stages = getStages(isEn);
  const activeStage = stages[activeIdx] || stages[0];

  // Auto-play logic
  useEffect(() => {
    if (!isAuto) return;
    autoRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stages.length);
    }, AUTO_SPEED);
    return () => clearInterval(autoRef.current);
  }, [isAuto, stages.length]);

  const selectStage = (index) => {
    setActiveIdx(index);
    setIsAuto(false);
  };

  const { rotateX, rotateY, lightBg, onMove, onLeave } = use3DCard();

  return (
    <section className="relative py-20 md:py-28 lg:py-36 bg-surface overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[140px]" />
      </div>

      <div className="container-premium section-padding relative z-10 w-full" dir={dir}>
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-accent text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4"
          >
            {isEn ? 'Execution Stages' : 'المراحل'}
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-heading font-[900] text-primary">
            <RevealText text={isEn ? 'How We Work at Natheel' : 'كيف نعمل في نثيل'} />
          </h2>
        </div>

        {/* ── Desktop & Mobile Progress Timeline ── */}
        <div className="relative mb-14 md:mb-20 px-2 sm:px-4">
          {/* Track line behind steps */}
          <div className="absolute top-6 inset-x-8 md:inset-x-12 h-[2px] bg-border-light hidden md:block">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-light"
              animate={{
                width: `${(activeIdx / (stages.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease }}
            />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-2 relative z-10">
            {stages.map((stage, i) => {
              const isActive = i === activeIdx;

              return (
                <button
                  key={stage.id}
                  onClick={() => selectStage(i)}
                  className="group flex flex-col items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer"
                  aria-label={`${stage.title}`}
                >
                  {/* Step Bubble Indicator */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-white shadow-[0_0_24px_rgba(58,168,188,0.5)] border-2 border-accent scale-110'
                        : 'bg-surface-warm border border-border-light hover:border-accent/40'
                    }`}
                  >
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
                          cx="50%"
                          cy="50%"
                          r="48%"
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
                      className={`font-mono text-sm md:text-lg font-bold transition-colors duration-300 relative z-10 ${
                        isActive ? 'text-accent' : 'text-primary'
                      }`}
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
            <motion.div className="absolute inset-0 pointer-events-none" style={{ background: lightBg }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeStage.id}-${isEn}`}
                initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease }}
                className="relative px-5 py-8 sm:p-8 md:p-14 grid md:grid-cols-[1fr_2fr] gap-6 sm:gap-8 md:gap-12 items-center"
              >
                {/* Left side: Holographic Icon */}
                <div className="flex justify-center mb-2 md:mb-0" style={{ transform: 'translateZ(60px)' }}>
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-56 md:h-56 flex items-center justify-center">
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
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full bg-accent/15 blur-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="relative text-accent w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 drop-shadow-[0_4px_12px_rgba(58,168,188,0.3)]">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
                        {icons[activeStage.id]}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right side: Content */}
                <div className={isAr ? 'text-center md:text-right' : 'text-center md:text-left'} style={{ transform: 'translateZ(40px)' }}>
                  <motion.div
                    initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`flex justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} items-center gap-3 mb-3 md:mb-6`}
                  >
                    <span className="font-mono text-accent text-sm tracking-[0.2em] font-semibold">
                      {isEn ? `Stage ${activeStage.number}` : `المرحلة ${activeStage.number}`}
                    </span>
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

                  {/* Navigation Controls inside card */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`flex justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-4 mt-8 md:mt-10`}
                  >
                    <button
                      onClick={() => selectStage((activeIdx + stages.length - 1) % stages.length)}
                      className="w-12 h-12 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:bg-surface-warm hover:text-primary transition-all group cursor-pointer"
                      aria-label="Previous"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`w-5 h-5 ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'} transition-transform`}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => selectStage((activeIdx + 1) % stages.length)}
                      className="px-6 h-12 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2 group shadow-[0_4px_12px_rgba(58,168,188,0.1)] cursor-pointer"
                    >
                      <span>{isEn ? 'Next Stage' : 'المرحلة التالية'}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`w-4 h-4 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
