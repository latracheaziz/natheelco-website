import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import ProjectModal from '../components/ProjectModal';
import ProjectRing from '../components/ProjectRing';
import HailMap from '../components/map/HailMap';
import RevealText from '../components/fx/RevealText';
import Magnetic from '../components/fx/Magnetic';
import Counter from '../components/fx/Counter';
import Reveal3D from '../components/fx/Reveal3D';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

const ease = [0.16, 1, 0.3, 1];

const heroSlides = [
  '/office.jpg', // Natheel HQ — shown first
  '/slides/odun.webp',
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
    className={`inline-flex items-center gap-2 text-sm font-semibold tracking-[0.15em] uppercase ${
      light ? 'text-accent-light' : 'text-accent'
    } ${center ? 'justify-center' : ''}`}
  >
    {children}
  </motion.span>
);

const Home = () => {
  const { isAr, isEn, dir } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef(null);
  const officeRef = useRef(null);

  const portfolioStatus = [
    { value: '1', label: isEn ? 'Active Projects' : 'مشاريع قائمة' },
    { value: '2', label: isEn ? 'Projects Under Development' : 'قيد التطوير', isHighlight: true },
    { value: '0', label: isEn ? 'Projects In Expansion' : 'مرحلة التوسع' },
  ];

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
  const atmosphereX = useTransform(smx, [-0.5, 0.5], [14, -14]);
  const atmosphereY = useTransform(smy, [-0.5, 0.5], [9, -9]);
  const leftFacetX = useTransform(smx, [-0.5, 0.5], [24, -24]);
  const leftFacetY = useTransform(smy, [-0.5, 0.5], [15, -15]);
  const centerFacetX = useTransform(smx, [-0.5, 0.5], [42, -42]);
  const centerFacetY = useTransform(smy, [-0.5, 0.5], [26, -26]);
  const rightFacetX = useTransform(smx, [-0.5, 0.5], [58, -58]);
  const rightFacetY = useTransform(smy, [-0.5, 0.5], [36, -36]);
  const deckRotateY = useTransform(smx, [-0.5, 0.5], [-28, -8]);
  const deckRotateX = useTransform(smy, [-0.5, 0.5], [14, 2]);

  const handleHeroMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleHeroLeave = () => {
    mx.set(0);
    my.set(0);
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

  const openProject = useCallback((project) => {
    if (project.website) {
      window.location.assign(project.website);
      return;
    }

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
          HERO SECTION — 3D Stacked Slides
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMove}
        onMouseLeave={handleHeroLeave}
        className="relative bg-primary overflow-hidden min-h-[100dvh] flex flex-col justify-end"
        style={{ perspective: 1400 }}
      >
        {/* Background slide + 3D motion */}
        <motion.div
          className="absolute inset-[-6%] bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroSlides[currentSlide]}')`,
            scale: 1.14,
            rotateY: bgRotateY,
            rotateX: bgRotateX,
            x: bgX,
          }}
          key={heroSlides[currentSlide]}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1.14 }}
          transition={{ duration: 1.4, ease }}
        />

        {/* Ambient layered gradients */}
        <div className="absolute inset-0 bg-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
        <div
          className={`absolute inset-0 ${
            isAr
              ? 'bg-gradient-to-l from-primary via-primary/80 to-transparent'
              : 'bg-gradient-to-r from-primary via-primary/80 to-transparent'
          }`}
        />
        <div className="dot-field" />

        {/* Architectural 3D plane atmosphere */}
        <motion.div
          className="home-tech-depth home-tech-depth--atmosphere"
          style={{ x: atmosphereX, y: atmosphereY }}
        >
          <div className="home-tech-plane home-tech-plane--sky" />
        </motion.div>

        {/* Multi-layered faceted grid system */}
        <motion.div className="home-tech-stage" aria-hidden="true">
          <motion.div className="home-tech-depth" style={{ x: leftFacetX, y: leftFacetY }}>
            <div className="home-tech-plane home-tech-plane--left" />
          </motion.div>
          <motion.div className="home-tech-depth" style={{ x: centerFacetX, y: centerFacetY }}>
            <div className="home-tech-plane home-tech-plane--center" />
          </motion.div>
          <motion.div className="home-tech-depth" style={{ x: rightFacetX, y: rightFacetY }}>
            <div className="home-tech-plane home-tech-plane--right" />
          </motion.div>
        </motion.div>
        <div className="aurora home-hero-aurora" />

        {/* Floating slide deck (3D) */}
        <motion.div
          className={`absolute ${isAr ? 'left-[4%]' : 'right-[4%]'} top-1/2 -translate-y-1/2 hidden lg:block z-10`}
          style={{ opacity: heroOpacity, perspective: 1200 }}
        >
          <motion.div
            className="relative w-[300px] h-[400px] preserve-3d"
            style={{ rotateY: deckRotateY, rotateX: deckRotateX }}
            initial={{ opacity: 0, x: isAr ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease }}
          >
            {deck.map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                onClick={() => setCurrentSlide((currentSlide + i) % heroSlides.length)}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] cursor-pointer"
                initial={false}
                animate={{ z: -i * 90, x: (isAr ? 1 : -1) * i * 46, y: -i * 26, opacity: 1 - i * 0.28 }}
                transition={{ duration: 1, ease }}
                style={{ zIndex: 3 - i }}
                aria-label={`Slide ${((currentSlide + i) % heroSlides.length) + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-white/10" />
                {i === 0 && (
                  <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between font-latin text-white/80 text-xs tracking-[0.2em]">
                    <span dir="ltr">
                      {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent-glow shadow-[0_0_12px_#5FD4E6] animate-pulse" />
                  </div>
                )}
              </motion.button>
            ))}
            <div
              className="absolute -inset-10 rounded-[40px] border border-accent-light/20"
              style={{ transform: 'translateZ(-220px)' }}
            />
          </motion.div>
        </motion.div>

        {/* Slide indicators — progress bars */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-500 cursor-pointer ${
                currentSlide === i ? 'w-12 bg-white/20' : 'w-4 bg-white/25 hover:bg-white/50'
              }`}
            >
              {currentSlide === i && (
                <motion.div
                  className="absolute inset-0 bg-accent-light rounded-full"
                  initial={{ scaleX: 0, originX: isAr ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, rotateX: heroRotateX, y: heroY }}
          className="relative z-10 w-full"
        >
          <div className="container-premium section-padding pt-32 pb-24 lg:pt-40 lg:pb-32">
            <div
              className={`max-w-2xl lg:max-w-[55%] xl:max-w-3xl ${
                isAr ? 'ml-auto text-right' : 'mr-auto text-left'
              }`}
              dir={dir}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-3 text-base md:text-lg font-latin font-semibold tracking-[0.2em] uppercase text-white px-5 py-2.5 rounded-full bg-black/20 border border-white/20 backdrop-blur-md shadow-lg">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent-glow opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-accent-glow" />
                  </span>
                  {isEn ? 'Hail, Kingdom of Saudi Arabia' : 'حائل، المملكة العربية السعودية'}
                </span>
              </motion.div>

              {/* Main headline - VERBATIM FROM USER REQUEST IN ENGLISH */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-heading font-[900] text-white leading-[1.2] mb-8 text-balance">
                {isEn ? (
                  <>
                    <RevealText text="We Develop Structured, Scalable Projects" immediate delay={0.35} stagger={0.06} />
                    <br />
                    <RevealText
                      text="Designed for Sustainable Expansion and Growth"
                      immediate
                      delay={0.65}
                      stagger={0.06}
                      wordClassName="text-white"
                    />
                  </>
                ) : (
                  <>
                    <RevealText text="نبني مشاريع منظّمة" immediate delay={0.35} stagger={0.09} />
                    <br />
                    <RevealText text="قابلة للتوسّع والنمو." immediate delay={0.65} stagger={0.09} wordClassName="text-white" />
                  </>
                )}
              </h1>

              {/* Sub text - VERBATIM FROM USER REQUEST IN ENGLISH */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease }}
                className="text-lg md:text-2xl text-white/90 leading-[1.8] max-w-2xl mb-12 font-medium"
              >
                {isEn
                  ? 'Natheel transforms promising ideas into structured, scalable ventures, leveraging over 30 years of experience and partners with complementary expertise.'
                  : 'في نثيل، نطوّر الأفكار الواعدة ونحوّلها إلى مشاريع منظّمة وقابلة للنمو والتوسّع، مستندين إلى خبرات تمتد لأكثر من ثلاثين عامًا، وشراكات تجمع تخصصات متكاملة.'}
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
                    className="group relative inline-flex items-center gap-3 overflow-hidden bg-white text-primary px-8 py-3.5 rounded-full text-[15px] font-semibold shadow-[0_20px_50px_-15px_rgba(95,212,230,0.5)] transition-all duration-400"
                  >
                    <span
                      className={`absolute inset-0 bg-gradient-to-l from-accent to-accent-light scale-x-0 ${
                        isAr ? 'origin-right' : 'origin-left'
                      } group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                    />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      {isEn ? 'Our Portfolio' : 'محفظة مشاريعنا'}
                    </span>
                    <svg
                      className={`relative z-10 w-4 h-4 ${
                        isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                      } group-hover:text-white transition-all`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link
                    to={isEn ? '/about' : '/عن-نثيل'}
                    className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full text-[15px] font-semibold bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/30 hover:shadow-lg transition-all duration-400"
                  >
                    {isEn ? 'About Natheel' : 'عن نثيل'}
                  </Link>
                </Magnetic>
              </motion.div>
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
          PROJECTS SECTION — 3D Ring
      ═══════════════════════════════════════════════ */}
      <section id="projects" className="relative py-28 lg:py-36 bg-surface overflow-hidden">
        <div className="dot-field" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/10 blur-[140px]" />

        <Reveal3D className="container-premium section-padding relative">
          <div className="text-center mb-10 lg:mb-4" dir={dir}>
            <div className="mb-6">
              <Eyebrow center>{isEn ? 'Our Projects' : 'مشاريعنا'}</Eyebrow>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-[800] text-primary mb-6">
              <RevealText text={isEn ? 'Our Portfolio' : 'محفظة مشاريعنا'} wordClassName="gradient-text pb-2" />
            </h2>
          </div>
        </Reveal3D>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease }}
          className="relative"
        >
          <ProjectRing projects={projects} onOpen={openProject} />
        </motion.div>

        {/* Portfolio Status */}
        <Reveal3D className="container-premium section-padding relative mt-16 lg:mt-20">
          <div className="max-w-4xl mx-auto" dir={dir}>
            <h3 className="text-center text-2xl md:text-3xl font-heading font-[800] text-primary mb-8">
              {isEn ? 'Portfolio Status' : 'حالة المشاريع'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {portfolioStatus.map((item) => (
                <div
                  key={item.label}
                  className={`relative overflow-hidden rounded-2xl p-6 text-center border transition-shadow duration-300 ${
                    item.isHighlight
                      ? 'bg-primary text-white border-primary shadow-[0_16px_36px_-10px_rgba(10,22,40,0.5)]'
                      : 'bg-white text-primary border-border-light shadow-sm hover:shadow-md'
                  }`}
                >
                  <p className={`text-5xl font-[800] font-latin mb-2 ${item.isHighlight ? 'text-white' : 'text-primary'}`}>
                    <Counter value={item.value} />
                  </p>
                  <p className={`text-base font-semibold ${item.isHighlight ? 'text-white/80' : 'text-text-secondary'}`}>
                    {item.label}
                  </p>
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-l from-transparent via-accent-light to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </Reveal3D>
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
            <img src="/office.jpg" alt="بيئة العمل" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="grain" />
          <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20 container-premium" dir={dir}>
            <div className="w-12 h-[2px] bg-accent-light mb-6 shadow-[0_0_12px_#3AA8BC]" />
            <p className="text-white/85 text-xl md:text-3xl font-heading font-bold max-w-xl leading-snug">
              <RevealText
                text={
                  isEn
                    ? 'We strive to build an inspiring workplace combining creativity, discipline, and measurable impact.'
                    : 'نسعى لبناء بيئة عمل ملهمة تجمع بين الإبداع والاحترافية.'
                }
                stagger={0.05}
              />
            </p>
          </div>
        </motion.div>
      </section>

      {/* Hail Interactive Map */}
      <HailMap />

      {/* ═══════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="dot-field" />
        <Reveal3D className="container-premium section-padding relative">
          <div className="max-w-4xl mx-auto text-center" dir={dir}>
            <div className="mb-4">
              <Eyebrow center>{isEn ? 'Contact' : 'تواصل معنا'}</Eyebrow>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-[800] text-primary mb-10">
              {isEn ? 'Get in Touch' : 'يسعدنا تواصلك'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <a
                href="mailto:info@natheelco.com"
                className="group rounded-2xl p-6 bg-surface border border-border-light hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <p className="text-sm text-text-muted mb-2">{isEn ? 'Email' : 'البريد الإلكتروني'}</p>
                <p className="text-lg md:text-xl font-latin font-semibold text-primary group-hover:text-accent transition-colors" dir="ltr">
                  info@natheelco.com
                </p>
              </a>
              <div className="rounded-2xl p-6 bg-surface border border-border-light">
                <p className="text-sm text-text-muted mb-2">{isEn ? 'Location' : 'الموقع'}</p>
                <p className="text-lg md:text-xl font-semibold text-primary">
                  {isEn ? 'Hail, Kingdom of Saudi Arabia' : 'حائل، المملكة العربية السعودية'}
                </p>
              </div>
            </div>
            <Magnetic strength={0.25}>
              <Link
                to={isEn ? '/contact' : '/اتصل-بنا'}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-[15px] font-semibold hover:shadow-[var(--shadow-glow)] transition-all duration-300"
              >
                {isEn ? 'Contact Us' : 'تواصل معنا'}
              </Link>
            </Magnetic>
          </div>
        </Reveal3D>
      </section>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Home;
