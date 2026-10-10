import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import RevealText from './fx/RevealText';

const ease = [0.16, 1, 0.3, 1];
const AUTO_INTERVAL = 60000;

/* ─── Icons ─────────────────────────────────────────────── */
const icons = {
  team: (
    <>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.2 1.8-4 4-4" strokeLinecap="round" />
    </>
  ),
  brand: (
    <>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6M9 9h.01M15 9h.01" strokeLinecap="round" />
    </>
  ),
  operation: (
    <>
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  performance: (
    <path d="M4 19V5M4 19h16M8 15v-3M12 15V9M16 15V7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  execution: (
    <>
      <path d="M12 3l7 4v5c0 4.4-3.1 8.5-7 9-3.9-.5-7-4.6-7-9V7l7-4z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  systems: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14c1.5 2 6.5 2 8 0" strokeLinecap="round" />
    </>
  ),
};

/* ─── Data ───────────────────────────────────────────────── */
const pillars = [
  {
    id: 'team', index: '01', title: 'بناء فريق متمكن',
    text: 'اختيار كفاءات شابة لكل مشروع لضمان أعلى أداء.',
    detail: 'نؤهّل الكفاءات التي تناسب طبيعة كل مشروع، ونبني ثقافة أداء عالية تدفع الفريق نحو التميز في كل مرحلة من مراحل العمل مع وضع أهداف و حوافز مخصصة مبنية على ال KPI.',
    accent: '#3AA8BC',
    tags: ['توظيف', 'تأهيل', 'أداء'],
  },
  {
    id: 'brand', index: '02', title: 'العلامة التجارية والنمو',
    text: 'بناء العلامة التجارية ودعم التسويق والنمو.',
    detail: 'نحرص ونهتم بتطوّير كل هوية بصرية متكاملة لكل مشروع وندعمه بخطط تسويقية ذكية تضمن حضوراً سوقياً قوياً وقاعدة عملاء وفية.',
    accent: '#2E8B9C',
    tags: ['هوية بصرية', 'تسويق', 'نمو'],
  },
  {
    id: 'operation', index: '03', title: 'مشاريعنا',
    text: 'نركز على المشاريع الخدمية عالية الكفاءة.',
    detail: 'نعمل على تحسين كفاءة التشغيل وتطويره باستمرار لتحقيق أفضل النتائج بأقل تكلفة ممكنة.',
    accent: '#3AA8BC',
    tags: ['كفاءة', 'هامش ربح', 'تطوير'],
  },
  {
    id: 'performance', index: '04', title: 'قياس الأداء والتطوير',
    text: 'قياس الأداء والتطوير المستمر المرتبط بحوافز مجزية.',
    detail: 'نعتمد مؤشرات قياس واضحة للإنتاجية و الإبداع و الحرص ونربطها بحوافز تكافىء أعضاء الفريق لضمان التطوير الذاتي المستمر لتجاوز و تحقيق الأهداف المرسومة.',
    accent: '#2E8B9C',
    tags: ['مؤشرات', 'حوافز', 'تطوير'],
  },
  {
    id: 'execution', index: '05', title: 'تنفيذ دقيق',
    text: 'تنفيذ متوافق مع الأنظمة واللوائح بدقة واحترافية.',
    detail: 'نضمن أن كل خطوة تنفيذية تسير وفق أعلى معايير الجودة والامتثال، مع مرونة كافية للتكيّف مع التحولات الميدانية.',
    accent: '#3AA8BC',
    tags: ['امتثال', 'جودة', 'احترافية'],
  },
  {
    id: 'systems', index: '06', title: 'أنظمة آلية متطورة',
    text: 'الاعتماد على أنظمة آلية متطورة لتسهيل العمليات.',
    detail: 'نوظّف أدوات رقمية وأتمتة ذكية لتقليل الأخطاء البشرية وتسريع العمليات وتوفير بيانات دقيقة تدعم القرار.',
    accent: '#2E8B9C',
    tags: ['أتمتة', 'ذكاء اصطناعي', 'بيانات'],
  },
  {
    id: 'success', index: '07', title: 'مشاركة النجاح',
    text: 'مشاركة النجاح والمكاسب مع فرق المشاريع.',
    detail: 'نُشرك الفرق في ثمار النجاح لبناء بيئة عمل محفزة وشراكة حقيقية طويلة الأمد.',
    accent: '#3AA8BC',
    tags: ['شراكة', 'تحفيز', 'استدامة'],
  },
];

/* ─── Mouse-tracked 3D panel ─────────────────────────────── */
const use3DMouse = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [6, -6]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [-5, 5]);

  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0);
  }, [mx, my]);

  return { rotateX, rotateY, onMove, onLeave };
};

/* ─── Orbiting ring decoration ───────────────────────────── */
const OrbitRing = ({ radius, duration, opacity, reversed = false }) => (
  <motion.div
    className="absolute rounded-full border border-accent/25"
    style={{
      width: radius * 2, height: radius * 2,
      top: '50%', left: '50%',
      translateX: '-50%', translateY: '-50%',
      opacity,
    }}
    animate={{ rotate: reversed ? [-360, 0] : [0, 360] }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
  >
    <div
      className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_#3AA8BC]"
      style={{ top: -4, left: '50%', translateX: '-50%' }}
    />
  </motion.div>
);

/* ─── Detail panel (right side) ──────────────────────────── */
const DetailPanel = ({ pillar }) => {
  const { rotateX, rotateY, onMove, onLeave } = use3DMouse();

  return (
    <motion.div
      className="relative h-full flex flex-col justify-center"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full flex flex-col justify-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Floating icon orb */}
        <div className="relative flex justify-center mb-10" style={{ height: 160 }}>
          {/* Orbit rings */}
          <OrbitRing radius={80} duration={12} opacity={0.6} />
          <OrbitRing radius={110} duration={18} opacity={0.35} reversed />
          <OrbitRing radius={140} duration={26} opacity={0.2} />

          {/* Central icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-[24px] flex items-center justify-center bg-white shadow-xl"
            style={{
              background: `radial-gradient(135deg at 30% 30%, ${pillar.accent}20, #ffffff)`,
              border: `1.5px solid ${pillar.accent}45`,
              boxShadow: `0 12px 35px ${pillar.accent}25, 0 4px 12px rgba(10,22,40,0.06)`,
              transform: 'translateZ(50px)',
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke={pillar.accent} strokeWidth="1.5">
              {icons[pillar.id]}
            </svg>
          </motion.div>
        </div>

        {/* Number */}
        <motion.div
          className="text-center mb-3"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span
            className="font-mono text-[80px] font-black leading-none select-none"
            style={{
              background: `linear-gradient(135deg, ${pillar.accent}35, ${pillar.accent}10)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {pillar.index}
          </span>
        </motion.div>

        {/* Title */}
        <div className="text-center mb-6" dir="rtl" style={{ transform: 'translateZ(40px)' }}>
          <h3 className="text-4xl md:text-5xl lg:text-[52px] font-heading font-[900] leading-tight text-primary">
            {pillar.title}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex justify-center flex-wrap gap-2 mb-7" dir="rtl">
          {pillar.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{
                backgroundColor: `${pillar.accent}12`,
                borderColor: `${pillar.accent}35`,
                color: pillar.accent,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Short text */}
        <p
          className="text-center text-text-secondary text-xl md:text-2xl leading-[1.8] mb-6 max-w-md mx-auto"
          dir="rtl"
          style={{ transform: 'translateZ(20px)' }}
        >
          {pillar.text}
        </p>

        {/* Divider */}
        <motion.div
          className="mx-auto mb-5 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${pillar.accent}40, transparent)`,
            width: '60%',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease }}
        />

        {/* Detail */}
        <p
          className="text-center text-text-muted text-lg leading-[1.9] max-w-md mx-auto"
          dir="rtl"
          style={{ transform: 'translateZ(10px)' }}
        >
          {pillar.detail}
        </p>

        {/* Bottom subtle glow */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-[60px] pointer-events-none"
          style={{ backgroundColor: `${pillar.accent}15` }}
        />
      </motion.div>
    </motion.div>
  );
};

/* ─── List item (left side) ──────────────────────────────── */
const PillarListItem = ({ pillar, isActive, index, onHover, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    onMouseEnter={onHover}
    aria-pressed={isActive}
    className="group relative w-full text-right focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-0 rounded-2xl"
    dir="rtl"
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay: index * 0.06, ease }}
  >
    {/* Active background */}
    <motion.div
      className="absolute inset-0 rounded-2xl"
      animate={{
        backgroundColor: isActive ? 'rgba(58,168,188,0.08)' : 'rgba(255,255,255,0.7)',
        borderColor: isActive ? 'rgba(58,168,188,0.35)' : 'rgba(10,22,40,0.06)',
        boxShadow: isActive ? '0 10px 25px -5px rgba(58,168,188,0.12)' : 'none',
      }}
      style={{ border: '1px solid' }}
      transition={{ duration: 0.35, ease }}
    />

    {/* Left accent bar */}
    <motion.div
      className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full"
      animate={{
        backgroundColor: isActive ? '#3AA8BC' : 'transparent',
        scaleY: isActive ? 1 : 0.3,
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease }}
    />

    <div className="relative flex items-center gap-4 px-5 py-4">
      {/* Icon */}
      <motion.div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        animate={{
          backgroundColor: isActive ? 'rgba(58,168,188,0.14)' : 'rgba(10,22,40,0.04)',
          color: isActive ? '#3AA8BC' : 'rgba(10,22,40,0.4)',
          scale: isActive ? 1.05 : 1,
        }}
        transition={{ duration: 0.35, ease }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
          {icons[pillar.id]}
        </svg>
      </motion.div>

      {/* Text */}
      <div className="flex-1 min-w-0 text-right">
        <motion.p
          className="font-heading font-bold text-lg md:text-xl leading-tight"
          animate={{ color: isActive ? '#0A1628' : 'rgba(10,22,40,0.75)' }}
          transition={{ duration: 0.3 }}
        >
          {pillar.title}
        </motion.p>
        <motion.p
          className="text-base mt-1 truncate"
          animate={{ color: isActive ? '#3AA8BC' : 'rgba(10,22,40,0.45)' }}
          transition={{ duration: 0.3 }}
        >
          {pillar.text}
        </motion.p>
      </div>

      {/* Index */}
      <motion.span
        className="shrink-0 font-mono text-[11px] font-bold tracking-widest"
        animate={{ color: isActive ? '#3AA8BC' : 'rgba(10,22,40,0.25)' }}
        transition={{ duration: 0.3 }}
      >
        {pillar.index}
      </motion.span>
    </div>
  </motion.button>
);

/* ─── Progress bar ────────────────────────────────────────── */
const AutoProgress = ({ isRunning, duration }) => (
  <div className="h-[2px] bg-slate-100 rounded-full overflow-hidden">
    <AnimatePresence>
      {isRunning && (
        <motion.div
          key="bar"
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          exit={{ width: '100%', opacity: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </AnimatePresence>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const CoreFocus = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const [direction, setDirection] = useState(1);
  const autoRef = useRef(null);

  const activePillar = pillars[activeIdx];

  /* Auto-cycle */
  useEffect(() => {
    if (!isAuto) return;
    autoRef.current = setInterval(() => {
      setDirection(1);
      setActiveIdx((i) => (i + 1) % pillars.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(autoRef.current);
  }, [isAuto, activeIdx]);

  const selectIdx = useCallback((idx) => {
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
    setIsAuto(false);
    clearTimeout(window._cfResume);
    window._cfResume = setTimeout(() => setIsAuto(true), 12000);
  }, [activeIdx]);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.97 }),
  };

  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${activePillar.accent}0d, transparent)`,
          }}
          transition={{ duration: 1.2, ease }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(10,22,40,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container-premium section-padding relative">

        {/* ── Section header ── */}
        <div className="text-center mb-14" dir="rtl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-[900] text-primary mb-4">
            <RevealText text="تركيزنا" />
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="text-text-secondary text-base max-w-md mx-auto"
          >
            مرّر على أي ركيزة أو انقر عليها لاستكشاف تفاصيلها
          </motion.p>
        </div>

        {/* ── Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start">

          {/* LEFT — pillar list */}
          <div className="flex flex-col gap-1.5" dir="rtl">
            {pillars.map((p, i) => (
              <PillarListItem
                key={p.id}
                pillar={p}
                index={i}
                isActive={activeIdx === i}
                onClick={() => selectIdx(i)}
                onHover={() => selectIdx(i)}
              />
            ))}

            {/* Auto-progress bar */}
            <div className="mt-4 px-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">
                  {isAuto ? 'تشغيل تلقائي' : 'يدوي'}
                </span>
                <button
                  onClick={() => setIsAuto((v) => !v)}
                  className="w-5 h-5 rounded-full border border-border-light bg-white shadow-sm flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
                >
                  {isAuto ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
              </div>
              <AutoProgress isRunning={isAuto} duration={AUTO_INTERVAL} key={`${activeIdx}-${isAuto}`} />
            </div>
          </div>

          {/* RIGHT — detail panel */}
          <div
            className="relative lg:sticky lg:top-28 h-[480px] md:h-[540px] rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_-15px_rgba(10,22,40,0.08)]"
            style={{
              border: `1px solid ${activePillar.accent}30`,
            }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: `radial-gradient(ellipse 80% 80% at 50% 30%, ${activePillar.accent}10, transparent 70%)`,
              }}
              transition={{ duration: 0.8, ease }}
            />

            {/* Keyboard navigation hint */}
            <div className="absolute top-4 left-4 z-10 flex gap-1.5">
              {pillars.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => selectIdx(i)}
                  className="w-1.5 h-1.5 rounded-full focus:outline-none"
                  animate={{
                    backgroundColor: activeIdx === i ? activePillar.accent : 'rgba(10,22,40,0.15)',
                    scale: activeIdx === i ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3, ease }}
                />
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-3 flex justify-between z-10 pointer-events-none">
              {[[-1, 'M15 18l-6-6 6-6'], [1, 'M9 18l6-6-6-6']].map(([dir, d], i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => selectIdx((activeIdx + pillars.length + dir) % pillars.length)}
                  className="pointer-events-auto w-9 h-9 rounded-full border border-border-light bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
                    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* Animated content */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={activePillar.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
                className="absolute inset-0 px-6 py-10"
              >
                <DetailPanel pillar={activePillar} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile dot nav ── */}
        <div className="flex justify-center gap-2 mt-8 lg:hidden">
          {pillars.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectIdx(i)}
              className="rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width: activeIdx === i ? 24 : 8,
                height: 8,
                backgroundColor: activeIdx === i ? activePillar.accent : 'rgba(10,22,40,0.15)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreFocus;
