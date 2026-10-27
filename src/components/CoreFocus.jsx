import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import RevealText from './fx/RevealText';
import { useLanguage } from '../context/LanguageContext';

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

/* ─── Pillars Data: Exact verbatim content for English & Arabic ─── */
const getPillars = (isEn) =>
  isEn
    ? [
        {
          id: 'team',
          index: '01',
          title: 'Building High-Performing Teams',
          text: 'Selecting the right talent for every project to achieve high performance.',
          detail:
            'We identify, develop, and equip talent suited to each project’s specific needs. We foster a high-performance culture that drives excellence at every stage, supported by tailored objectives and incentive structures aligned with key performance indicators (KPIs).',
          accent: '#3AA8BC',
          tags: ['Recruitment', 'Development', 'Performance'],
        },
        {
          id: 'brand',
          index: '02',
          title: 'Brand Development & Growth',
          text: 'Developing cohesive brand identities and supporting marketing & growth.',
          detail:
            'We develop cohesive brand identities for each venture and support them with strategic marketing plans designed to strengthen market presence, build brand recognition, and cultivate lasting customer relationships.',
          accent: '#2E8B9C',
          tags: ['Brand Identity', 'Marketing', 'Growth'],
        },
        {
          id: 'operation',
          index: '03',
          title: 'Our Ventures',
          text: 'Focusing on high-efficiency service-based ventures.',
          detail:
            'We focus on high-efficiency service-based ventures, continuously improving operational processes and performance to achieve optimal results while maintaining cost efficiency.',
          accent: '#3AA8BC',
          tags: ['Efficiency', 'Profitability', 'Development'],
        },
        {
          id: 'performance',
          index: '04',
          title: 'Performance Measurement & Development',
          text: 'Measuring performance and driving continuous improvement through meaningful incentives.',
          detail:
            'We establish clear performance indicators for productivity, creativity, and commitment, linking them to incentive structures that reward team members, encourage continuous development, and support the achievement and surpassing of established targets.',
          accent: '#2E8B9C',
          tags: ['KPIs', 'Incentives', 'Continuous Improvement'],
        },
        {
          id: 'execution',
          index: '05',
          title: 'Precision in Execution',
          text: 'Executing every initiative with precision, professionalism, and regulatory compliance.',
          detail:
            'We ensure that every stage of execution adheres to high standards of quality and compliance, while maintaining the flexibility needed to adapt to changing operational conditions.',
          accent: '#3AA8BC',
          tags: ['Compliance', 'Quality', 'Professionalism'],
        },
        {
          id: 'systems',
          index: '06',
          title: 'Advanced Automation Systems',
          text: 'Leveraging advanced systems to streamline operations and improve efficiency.',
          detail:
            'We implement digital tools and intelligent automation to reduce human error, accelerate workflows, and provide accurate, reliable data that supports informed decision-making.',
          accent: '#2E8B9C',
          tags: ['Automation', 'Artificial Intelligence', 'Data'],
        },
        {
          id: 'success',
          index: '07',
          title: 'Shared Success',
          text: 'Sharing success and value creation with project teams.',
          detail:
            'We believe that project success should be shared. By enabling teams to participate in the value they help create, we foster a motivating work environment and build genuine, long-term partnerships.',
          accent: '#3AA8BC',
          tags: ['Partnership', 'Incentives', 'Sustainability'],
        },
      ]
    : [
        {
          id: 'team',
          index: '01',
          title: 'بناء فرق عمل عالية الأداء',
          text: 'اختيار الكفاءات المناسبة لكل مشروع لتحقيق أداء عالي.',
          detail:
            'نحدد ونطور ونجهز الكفاءات المناسبة لاحتياجات كل مشروع. نعزز ثقافة الأداء العالي التي تدفع نحو التميز في كل مرحلة، مدعومة بأهداف محددة وهياكل حوافز متوافقة مع مؤشرات الأداء الرئيسية (KPIs).',
          accent: '#3AA8BC',
          tags: ['توظيف', 'تطوير', 'أداء'],
        },
        {
          id: 'brand',
          index: '02',
          title: 'تطوير وتنمية الهوية التجارية',
          text: 'بناء العلامة التجارية ودعم خطط التسويق والنمو.',
          detail:
            'نطور هوية تجارية متماسكة لكل مشروع وندعمها بخطط تسويقية استراتيجية مصممة لتعزيز الحضور السوقي، وبناء الاعتراف بالعلامة التجارية، وتنمية علاقات دائمة مع العملاء.',
          accent: '#2E8B9C',
          tags: ['هوية تجارية', 'تسويق', 'نمو'],
        },
        {
          id: 'operation',
          index: '03',
          title: 'مشاريعنا',
          text: 'التركيز على المشاريع الخدمية عالية الكفاءة.',
          detail:
            'نركز على مشاريع خدمية عالية الكفاءة، مع التحسين المستمر للعمليات التشغيلية والأداء لتحقيق النتائج المثلى مع الحفاظ على كفاءة التكاليف.',
          accent: '#3AA8BC',
          tags: ['كفاءة', 'ربحية', 'تطوير'],
        },
        {
          id: 'performance',
          index: '04',
          title: 'قياس الأداء والتطوير',
          text: 'قياس الأداء ودفع التحسين المستمر من خلال حوافز مجزية.',
          detail:
            'نضع مؤشرات أداء واضحة للإنتاجية والإبداع والالتزام، ونربطها بهياكل حوافز تكافئ أعضاء الفريق، وتشجع التطوير المستمر، وتدعم تحقيق وتجاوز الأهداف المحددة.',
          accent: '#2E8B9C',
          tags: ['مؤشرات أداء', 'حوافز', 'تحسين مستمر'],
        },
        {
          id: 'execution',
          index: '05',
          title: 'الدقة في التنفيذ',
          text: 'تنفيذ كل مبادرة بدقة واحترافية وامتثال تنظيمي.',
          detail:
            'نضمن التزام كل مرحلة تنفيذية بأعلى معايير الجودة والامتثال، مع الحفاظ على المرونة اللازمة للتكيف مع الظروف التشغيلية المتغيرة.',
          accent: '#3AA8BC',
          tags: ['امتثال', 'جودة', 'احترافية'],
        },
        {
          id: 'systems',
          index: '06',
          title: 'أنظمة أتمتة متقدمة',
          text: 'توظيف الأنظمة المتقدمة لتبسيط العمليات وتحسين الكفاءة.',
          detail:
            'نطبق الأدوات الرقمية والأتمتة الذكية للحد من الأخطاء البشرية، وتسريع سير العمل، وتوفير بيانات دقيقة وموثوقة تدعم اتخاذ قرارات مستنيرة.',
          accent: '#2E8B9C',
          tags: ['أتمتة', 'ذكاء اصطناعي', 'بيانات'],
        },
        {
          id: 'success',
          index: '07',
          title: 'النجاح المشترك',
          text: 'مشاركة النجاح وخلق القيمة مع فرق العمل.',
          detail:
            'نؤمن بأن نجاح المشاريع يجب أن يكون مشتركاً. من خلال تمكين الفرق من المشاركة في القيمة التي يساهمون في صنعها، نخلق بيئة عمل محفزة ونبني شراكات حقيقية طويلة الأمد.',
          accent: '#3AA8BC',
          tags: ['شراكة', 'حوافز', 'استدامة'],
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

  return { rotateX, rotateY, onMove, onLeave };
};

/* ─── Orbiting ring decoration ───────────────────────────── */
const OrbitRing = ({ radius, duration, opacity, reversed = false }) => (
  <motion.div
    className="absolute rounded-full border border-accent/25"
    style={{
      width: radius * 2,
      height: radius * 2,
      top: '50%',
      left: '50%',
      translateX: '-50%',
      translateY: '-50%',
      opacity,
    }}
    animate={{ rotate: reversed ? [-360, 0] : [0, 360] }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
  />
);

/* ─── Detail panel ───────────────────────────────────────── */
const DetailPanel = ({ pillar, dir, isAr }) => {
  const { rotateX, rotateY, onMove, onLeave } = use3DMouse();

  return (
    <motion.div
      className="relative w-full my-auto flex flex-col items-center justify-center"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full my-auto flex flex-col items-center justify-center text-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Floating icon orb */}
        <div className="relative flex justify-center items-center mb-2.5 sm:mb-3" style={{ height: 68 }}>
          {/* Orbit rings */}
          <OrbitRing radius={34} duration={12} opacity={0.5} />
          <OrbitRing radius={48} duration={18} opacity={0.25} reversed />

          {/* Central icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-lg"
            style={{
              background: `radial-gradient(135deg at 30% 30%, ${pillar.accent}20, #ffffff)`,
              border: `1.5px solid ${pillar.accent}45`,
              boxShadow: `0 8px 24px ${pillar.accent}25, 0 2px 8px rgba(10,22,40,0.05)`,
              transform: 'translateZ(40px)',
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={pillar.accent} strokeWidth="1.6">
              {icons[pillar.id]}
            </svg>
          </motion.div>
        </div>

        {/* Number */}
        <motion.div className="text-center mb-1.5 sm:mb-2" style={{ transform: 'translateZ(25px)' }}>
          <span
            className="font-mono text-2xl sm:text-3xl font-black tracking-wider leading-none select-none"
            style={{
              background: `linear-gradient(135deg, ${pillar.accent}, ${pillar.accent}80)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {pillar.index}
          </span>
        </motion.div>

        {/* Title */}
        <div className="text-center mb-2.5 sm:mb-3 px-4" dir={dir} style={{ transform: 'translateZ(35px)' }}>
          <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-heading font-[900] leading-tight text-primary max-w-xl mx-auto">
            {pillar.title}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex justify-center flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-2" dir={dir}>
          {pillar.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease }}
              className="px-3 py-0.5 rounded-full text-xs font-semibold border"
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
          className="text-center text-text-secondary text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 max-w-xl mx-auto font-medium px-4"
          dir={dir}
          style={{ transform: 'translateZ(15px)' }}
        >
          {pillar.text}
        </p>

        {/* Divider */}
        <motion.div
          className="mx-auto mb-3 sm:mb-4 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${pillar.accent}40, transparent)`,
            width: '45%',
            maxWidth: 160,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease }}
        />

        {/* Detail */}
        <p
          className="text-center text-text-muted text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto px-4"
          dir={dir}
          style={{ transform: 'translateZ(10px)' }}
        >
          {pillar.detail}
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ─── List item ─── */
const PillarListItem = ({ pillar, isActive, onClick, onHover, isAr }) => (
  <motion.button
    type="button"
    onClick={onClick}
    onMouseEnter={onHover}
    className={`group relative w-full rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer overflow-hidden ${
      isActive
        ? 'bg-white shadow-[0_8px_30px_rgba(10,22,40,0.08)] border border-accent/20'
        : 'hover:bg-surface-warm/80 border border-transparent'
    }`}
  >
    {/* Active indicator bar */}
    <motion.span
      className={`absolute top-3 bottom-3 ${isAr ? 'right-0' : 'left-0'} w-[3px] rounded-full`}
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
      <div className={`flex-1 min-w-0 ${isAr ? 'text-right' : 'text-left'}`}>
        <motion.p
          className="font-heading font-bold text-lg leading-tight"
          animate={{ color: isActive ? '#0A1628' : 'rgba(10,22,40,0.75)' }}
          transition={{ duration: 0.3 }}
        >
          {pillar.title}
        </motion.p>
        <motion.p
          className="text-sm mt-1 truncate"
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

/* ─── Progress bar ─── */
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
  const { isAr, isEn, dir } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const [direction, setDirection] = useState(1);
  const autoRef = useRef(null);

  const pillars = getPillars(isEn);
  const activePillar = pillars[activeIdx] || pillars[0];

  /* Auto-cycle */
  useEffect(() => {
    if (!isAuto) return;
    autoRef.current = setInterval(() => {
      setDirection(1);
      setActiveIdx((i) => (i + 1) % pillars.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(autoRef.current);
  }, [isAuto, activeIdx, pillars.length]);

  const selectIdx = useCallback(
    (idx) => {
      setDirection(idx > activeIdx ? 1 : -1);
      setActiveIdx(idx);
      setIsAuto(false);
      clearTimeout(window._cfResume);
      window._cfResume = setTimeout(() => setIsAuto(true), 12000);
    },
    [activeIdx]
  );

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -40 : 40, scale: 0.97 }),
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
            backgroundImage:
              'linear-gradient(rgba(10,22,40,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container-premium section-padding relative">
        {/* ── Section header ── */}
        <div className="text-center mb-14" dir={dir}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-[900] text-primary mb-4">
            <RevealText text={isEn ? 'Our Focus' : 'تركيزنا'} />
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="text-text-secondary text-base max-w-md mx-auto"
          >
            {isEn
              ? 'Hover or click on any pillar to explore its detailed framework'
              : 'مرّر على أي ركيزة أو انقر عليها لاستكشاف تفاصيلها'}
          </motion.p>
        </div>

        {/* ── Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start">
          {/* LEFT — pillar list */}
          <div className="flex flex-col gap-1.5" dir={dir}>
            {pillars.map((p, i) => (
              <PillarListItem
                key={p.id}
                pillar={p}
                index={i}
                isActive={activeIdx === i}
                onClick={() => selectIdx(i)}
                onHover={() => selectIdx(i)}
                isAr={isAr}
              />
            ))}

            {/* Auto-progress bar */}
            <div className="mt-4 px-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">
                  {isAuto ? (isEn ? 'Auto-Cycle' : 'تشغيل تلقائي') : isEn ? 'Manual' : 'يدوي'}
                </span>
                <button
                  onClick={() => setIsAuto((v) => !v)}
                  className="w-5 h-5 rounded-full border border-border-light bg-white shadow-sm flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
                  aria-label={isAuto ? 'Pause Auto-cycle' : 'Start Auto-cycle'}
                >
                  {isAuto ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <AutoProgress isRunning={isAuto} duration={AUTO_INTERVAL} key={`${activeIdx}-${isAuto}`} />
            </div>
          </div>

          {/* RIGHT — detail panel */}
          <div
            className="relative lg:sticky lg:top-28 min-h-[640px] sm:min-h-[680px] md:min-h-[700px] lg:min-h-[720px] lg:h-[720px] rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_-15px_rgba(10,22,40,0.08)]"
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

            {/* Navigation dots */}
            <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-10 flex gap-1.5`}>
              {pillars.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => selectIdx(i)}
                  className="w-1.5 h-1.5 rounded-full focus:outline-none cursor-pointer"
                  animate={{
                    backgroundColor: activeIdx === i ? activePillar.accent : 'rgba(10,22,40,0.15)',
                    scale: activeIdx === i ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3, ease }}
                />
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 sm:inset-x-3 flex justify-between z-10 pointer-events-none">
              {[
                [-1, 'M15 18l-6-6 6-6'],
                [1, 'M9 18l6-6-6-6'],
              ].map(([d, pathD], i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => selectIdx((activeIdx + pillars.length + d) % pillars.length)}
                  className="pointer-events-auto w-9 h-9 rounded-full border border-border-light bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={d === 1 ? 'Next' : 'Previous'}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
                    <path d={pathD} strokeLinecap="round" strokeLinejoin="round" />
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
                className="absolute inset-0 px-6 sm:px-10 md:px-14 py-6 sm:py-8 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col justify-center"
              >
                <DetailPanel pillar={activePillar} dir={dir} isAr={isAr} />
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
              className="rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
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
