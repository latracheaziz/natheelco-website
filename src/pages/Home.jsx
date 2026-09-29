import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import ProjectModal from '../components/ProjectModal';
import ProjectRing from '../components/ProjectRing';
import RevealText from '../components/fx/RevealText';
import Magnetic from '../components/fx/Magnetic';
import TiltCard from '../components/fx/TiltCard';
import Counter from '../components/fx/Counter';
import Spotlight from '../components/fx/Spotlight';
import Reveal3D from '../components/fx/Reveal3D';
import { projects, heroStats } from '../data/projects';

const ease = [0.16, 1, 0.3, 1];

const heroSlides = [
  '/office.jpg',          // Natheel HQ — shown first
  '/slides/odun.jpg',
  '/slides/ghalia.jpg',
  '/slides/hajiss.jpg',
  '/slides/building.jpg',
];

const SLIDE_MS = 7000;

const Eyebrow = ({ children, center = false, light = false }) => (
  <motion.span
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease }}
    className={`inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase ${light ? 'text-accent-light' : 'text-accent'}`}
  >
    <span className={`w-8 h-px ${light ? 'bg-accent-light' : 'bg-accent'}`} />
    {children}
    {center && <span className={`w-8 h-px ${light ? 'bg-accent-light' : 'bg-accent'}`} />}
  </motion.span>
);

const Home = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoverTab, setHoverTab] = useState(0);
  const heroRef = useRef(null);
  const officeRef = useRef(null);

  // Hero scroll exit
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.94]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.6], [0, 14]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Hero mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgRotateY = useTransform(smx, [-0.5, 0.5], [3, -3]);
  const bgRotateX = useTransform(smy, [-0.5, 0.5], [-2.5, 2.5]);
  const bgX = useTransform(smx, [-0.5, 0.5], [18, -18]);
  const deckRotateY = useTransform(smx, [-0.5, 0.5], [-28, -8]);
  const deckRotateX = useTransform(smy, [-0.5, 0.5], [14, 2]);

  const handleHeroMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Office editorial unfold
  const { scrollYProgress: officeProgress } = useScroll({ target: officeRef, offset: ['start end', 'center center'] });
  const officeRotate = useTransform(officeProgress, [0, 1], [45, 0]);
  const officeScale = useTransform(officeProgress, [0, 1], [0.82, 1]);
  const officeRadius = useTransform(officeProgress, [0, 1], [48, 0]);
  const officeImgY = useTransform(officeProgress, [0, 1], ['-8%', '0%']);

  // Auto-slide: first slide shows for 7s then cycles through the rest
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const openModal = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 400);
  }, []);

  const deck = [0, 1, 2].map((o) => heroSlides[(currentSlide + o) % heroSlides.length]);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMove}
        className="relative min-h-screen flex items-center overflow-hidden bg-primary"
        style={{ perspective: 1600 }}
      >
        {/* Background slideshow — depth plane */}
        <motion.div
          className="absolute inset-[-4%]"
          style={{ rotateX: bgRotateX, rotateY: bgRotateY, x: bgX, y: heroY }}
        >
          {heroSlides.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: currentSlide === i ? 1 : 0 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  transform: currentSlide === i ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 9s ease-out',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/70 via-transparent to-transparent" />
        <div className="aurora opacity-40" />
        <div className="perspective-grid opacity-60" />
        <div className="grain" />
        <Spotlight />

        {/* Floating slide deck (3D) */}
        <motion.div
          className="absolute left-[4%] top-1/2 -translate-y-1/2 hidden 2xl:block z-10"
          style={{ opacity: heroOpacity, perspective: 1200 }}
        >
          <motion.div
            className="relative w-[300px] h-[400px] preserve-3d"
            style={{ rotateY: deckRotateY, rotateX: deckRotateX }}
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease }}
          >
            {deck.map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                onClick={() => setCurrentSlide((currentSlide + i) % heroSlides.length)}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
                initial={false}
                animate={{ z: -i * 90, x: i * 46, y: -i * 26, opacity: 1 - i * 0.28 }}
                transition={{ duration: 1, ease }}
                style={{ zIndex: 3 - i }}
                aria-label={`الشريحة ${((currentSlide + i) % heroSlides.length) + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-white/10" />
                {i === 0 && (
                  <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between font-latin text-white/80 text-xs tracking-[0.2em]">
                    <span>{String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
                    <span className="w-2 h-2 rounded-full bg-accent-glow shadow-[0_0_12px_#5FD4E6] animate-pulse" />
                  </div>
                )}
              </motion.button>
            ))}
            <div className="absolute -inset-10 rounded-[40px] border border-accent-light/20" style={{ transform: 'translateZ(-220px)' }} />
          </motion.div>
        </motion.div>

        {/* Slide indicators — progress bars */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`الشريحة ${i + 1}`}
              className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-500 ${
                currentSlide === i ? 'w-12 bg-white/20' : 'w-4 bg-white/25 hover:bg-white/50'
              }`}
            >
              {currentSlide === i && (
                <motion.span
                  key={`p-${currentSlide}`}
                  className="absolute inset-y-0 right-0 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, rotateX: heroRotateX, transformOrigin: '50% 100%' }}
          className="relative z-10 w-full"
        >
          <div className="container-premium section-padding pt-32 pb-24 lg:pt-40 lg:pb-32">
            <div className="max-w-4xl mr-auto text-right" dir="rtl">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-3 text-[12px] font-latin font-semibold tracking-[0.2em] uppercase text-accent-light px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent-glow opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-accent-glow" />
                  </span>
                  حائل، المملكة العربية السعودية
                </span>
              </motion.div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-[900] text-white leading-[1.15] mb-8 text-balance">
                <RevealText text="نحوّل الأفكار إلى" immediate delay={0.35} stagger={0.09} />
                <br />
                <RevealText text="مشاريع قابلة للنمو" immediate delay={0.65} stagger={0.09} wordClassName="text-white/30" />
              </h1>

              {/* Sub text */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.9, ease }}
                className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-12 font-light"
              >
                نطور الفكرة، ونبني الفريق والأنظمة، ونقود التنفيذ نحو نمو وربحية مستدامة.
              </motion.p>

              {/* CTA Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.05, ease }}
                className="flex flex-wrap gap-4"
              >
                <Magnetic>
                  <a
                    href="#projects"
                    className="group relative inline-flex items-center gap-3 overflow-hidden bg-white text-primary px-8 py-4 rounded-full text-[15px] font-semibold shadow-[0_20px_50px_-15px_rgba(95,212,230,0.5)]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-l from-accent to-accent-light scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">تعرّف على مشاريعنا</span>
                    <svg className="relative z-10 w-4 h-4 rotate-180 group-hover:-translate-x-1 group-hover:text-white transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <a
                    href="#about"
                    className="inline-flex items-center gap-2 text-white/70 px-6 py-4 rounded-full text-[15px] font-medium border border-white/10 backdrop-blur-md hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-400"
                  >
                    من نحن؟
                  </a>
                </Magnetic>
              </motion.div>
            </div>

            {/* Stats — glass bento chips */}
            <div className="mt-20 lg:mt-28 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" dir="rtl">
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 1.2 + i * 0.1, ease }}
                  style={{ transformOrigin: '50% 100%' }}
                >
                  <TiltCard max={12} className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5 md:p-6 text-right overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-accent/20 blur-2xl" />
                    <p className="relative text-3xl md:text-4xl font-[800] text-white mb-1.5 font-latin" style={{ transform: 'translateZ(30px)' }}>
                      <Counter value={stat.value} />
                    </p>
                    <p className="relative text-[13px] text-white/40 font-medium">{stat.label}</p>
                    <div className="absolute bottom-0 right-0 h-[2px] w-1/3 bg-gradient-to-l from-accent-light to-transparent" />
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-accent-glow rounded-full shadow-[0_0_8px_#5FD4E6]" />
          </motion.div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════
          ABOUT SECTION — Bento
      ═══════════════════════════════════════════════ */}
      <section id="about" className="relative py-28 lg:py-40 bg-white overflow-hidden">
        <div className="dot-field" />
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />

        <Reveal3D className="container-premium section-padding relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center" dir="rtl">

            {/* Right: Text */}
            <div className="lg:col-span-5">
              <div className="mb-6"><Eyebrow>من نحن</Eyebrow></div>

              <h2 className="text-3xl md:text-4xl lg:text-[46px] font-heading font-[800] text-primary leading-[1.25] mb-8">
                <RevealText text="نبني مشاريع منظّمة" />
                <br />
                <RevealText text="قابلة للتوسع والنمو" delay={0.2} wordClassName="text-text-muted" />
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3, ease }}
                className="text-text-secondary text-lg leading-[1.8] mb-10 max-w-lg"
              >
                <strong className="font-semibold text-primary">نثيل</strong> تطوّر الأفكار الواعدة وتحولها إلى مشاريع منظّمة قابلة للتوسع، مستندين على خبرات تمتد لأكثر من 30 عاماً وشركاء ذو اختصاصات مكملة.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45, ease }}
                className="inline-flex flex-wrap gap-1 p-1.5 rounded-full bg-surface-warm border border-border-light"
                onMouseLeave={() => setHoverTab(0)}
              >
                {['من نحن؟', 'ماذا نعمل؟', 'كيف نعمل؟'].map((tab, i) => (
                  <button
                    key={tab}
                    onMouseEnter={() => setHoverTab(i)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                      hoverTab === i ? 'text-white' : 'text-text-secondary'
                    }`}
                  >
                    {hoverTab === i && (
                      <motion.span
                        layoutId="about-tab"
                        className="absolute inset-0 rounded-full bg-primary shadow-[0_10px_25px_-10px_rgba(10,22,40,0.6)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Left: Visual element */}
            <div className="lg:col-span-7" style={{ perspective: 1400 }}>
              <TiltCard max={8} hoverScale={1.01} className="rounded-[32px]">
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-surface-warm relative shadow-[var(--shadow-depth)]">
                  <motion.img
                    src="/office.jpg"
                    alt="بيئة العمل في نثيل"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>

                {/* Floating depth card */}
                <div
                  className="absolute -bottom-8 right-6 left-6 md:left-auto md:w-[78%] glass-light rounded-2xl p-6"
                  style={{ transform: 'translateZ(70px)' }}
                  dir="rtl"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary-medium flex items-center justify-center text-white font-latin font-black shadow-[var(--shadow-glow)]">
                      30
                    </div>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed">
                      خبرة <span className="text-primary font-bold">+30 عاماً</span> في تطوير الأعمال والمشاريع في المملكة العربية السعودية
                    </p>
                  </div>
                </div>

                {/* Orbit ring */}
                <div
                  className="absolute -top-6 -left-6 w-28 h-28 rounded-full border border-dashed border-accent/40 hidden md:block"
                  style={{ transform: 'translateZ(40px)', animation: 'spin-flat 20s linear infinite' }}
                />
              </TiltCard>
            </div>
          </div>
        </Reveal3D>
      </section>


      {/* ═══════════════════════════════════════════════
          PROJECTS SECTION — 3D Ring
      ═══════════════════════════════════════════════ */}
      <section id="projects" className="relative py-28 lg:py-36 bg-surface overflow-hidden">
        <div className="dot-field" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/10 blur-[140px]" />

        <Reveal3D className="container-premium section-padding relative">
          <div className="text-center mb-10 lg:mb-4" dir="rtl">
            <div className="mb-6"><Eyebrow center>محفظة المشاريع</Eyebrow></div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-[800] text-primary mb-6">
              <RevealText text="مشاريعنا" wordClassName="gradient-text pb-2" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed"
            >
              مشاريع واعدة تُدار بفرق وقيادة متخصصة حسب مجالها مع دعم استراتيجي ومالي من نثيل لتحقيق نمو مستقر ومستدام.
            </motion.p>
          </div>
        </Reveal3D>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease }}
          className="relative"
        >
          <ProjectRing projects={projects} onOpen={openModal} />
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════
          OFFICE IMAGE — 3D unfold editorial
      ═══════════════════════════════════════════════ */}
      <section ref={officeRef} className="relative bg-surface pb-0" style={{ perspective: 1600 }}>
        <motion.div
          className="h-[50vh] md:h-[80vh] relative overflow-hidden"
          style={{ rotateX: officeRotate, scale: officeScale, borderRadius: officeRadius, transformOrigin: '50% 0%' }}
        >
          <motion.div className="absolute inset-[-8%_0]" style={{ y: officeImgY }}>
            <img
              src="/office.jpg"
              alt="بيئة العمل"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="grain" />
          <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20 container-premium" dir="rtl">
            <div className="w-12 h-[2px] bg-accent-light mb-6 shadow-[0_0_12px_#3AA8BC]" />
            <p className="text-white/85 text-xl md:text-3xl font-heading font-bold max-w-xl leading-snug">
              <RevealText text="نسعى لبناء بيئة عمل ملهمة تجمع بين الإبداع والاحترافية." stagger={0.05} />
            </p>
          </div>
        </motion.div>
      </section>


      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Home;
