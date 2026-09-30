import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import Reveal3D from './fx/Reveal3D';
import RevealText from './fx/RevealText';
import TiltCard from './fx/TiltCard';
const ease = [0.16, 1, 0.3, 1];

const Eyebrow = ({ children, center = false, light = false }) => (
  <motion.span
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease }}
    className={`inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase ${
      light ? 'text-accent-light' : 'text-accent'
    } ${center ? 'justify-center' : ''}`}
  >
    <span className={`w-8 h-px ${light ? 'bg-accent-light' : 'bg-accent'}`} />
    {children}
    {center && <span className={`w-8 h-px ${light ? 'bg-accent-light' : 'bg-accent'}`} />}
  </motion.span>
);

const pillars = [
  {
    index: '01',
    title: 'رؤيتنا',
    text: 'أن نصنع مشاريع ناجحة وقابلة للتوسع، تقودها فرق مؤهلة مع نظام آلي واضح',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    index: '02',
    title: 'رسالتنا',
    text: 'تحويل الأفكار الواعدة إلى مشاريع عاملة، من خلال التخطيط المدروس، وبناء الفرق، وتطبيق الأنظمة، والتنفيذ المنضبط، مع مشاركة النجاح مع قادة المشاريع وموظفيها.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    index: '03',
    title: 'فريقنا',
    text: 'فريق شاب يؤمن بقدراته، ويواكب المستجدات، ويعمل بروح الإبداع والتعاون لتقديم حلول بسيطة، ذكية ومثمرة. نمكّن أفراد الفريق، ونمنحهم فرصاً للقيادة والنمو، ونربط حوافزهم بما يحققونه من نتائج.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.2 1.8-4 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const AboutIdentity = () => {
  const [active, setActive] = useState(0);
  const current = pillars[active];

  const goTo = useCallback((idx) => setActive(idx), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo((active + 1) % pillars.length);
      if (e.key === 'ArrowRight') goTo((active - 1 + pillars.length) % pillars.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  return (
    <>
      {/* Manifesto — dark footer-style band */}
      <section className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary-light/30 pointer-events-none" />
        <div className="aurora opacity-20" />
        <div className="grain" />

        <div className="container-premium section-padding relative z-10 py-24 lg:py-32" dir="rtl">
          <Reveal3D rotateX={14} distance={60}>
            <div className="max-w-4xl mr-auto">
              <div className="mb-8">
                <Eyebrow light>من نحن</Eyebrow>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-[800] leading-[1.3] mb-10">
                <RevealText text="في نثيل" wordClassName="gradient-text-light pb-1" />
              </h2>

              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15, ease }}
                  className="text-xl md:text-2xl text-white/80 leading-[1.9] font-light"
                >
                  نعمل على تحويل الأفكار الواعدة إلى مشاريع منظّمة قابلة للنمو.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease }}
                  className="text-lg md:text-xl text-white/50 leading-[1.9]"
                >
                  نطوّر نموذج العمل، ونبني الفريق والأنظمة، ونقود التنفيذ للوصول إلى نمو وربحية مستدامة
                </motion.p>
              </div>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease }}
                className="h-[2px] bg-gradient-to-l from-accent-glow to-accent-light rounded-full mt-12 shadow-[0_0_16px_rgba(95,212,230,0.5)]"
              />
            </div>
          </Reveal3D>
        </div>
      </section>

      {/* Interactive pillars */}
      <section className="relative py-28 lg:py-40 bg-surface overflow-hidden">
        <div className="dot-field" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="container-premium section-padding relative">
          <Reveal3D className="text-center mb-14 lg:mb-20" dir="rtl">
            <div className="mb-6">
              <Eyebrow center>هويتنا</Eyebrow>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[46px] font-heading font-[800] text-primary leading-[1.25]">
              <RevealText text="رؤيتنا ورسالتنا" />
              <br />
              <RevealText text="وفريقنا" delay={0.15} wordClassName="text-text-muted" />
            </h2>
          </Reveal3D>

          {/* Tab pills */}
          <div className="flex justify-center mb-12 lg:mb-16" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full bg-white border border-border-light shadow-[0_8px_32px_-12px_rgba(10,22,40,0.08)]"
              role="tablist"
              aria-label="رؤيتنا ورسالتنا وفريقنا"
            >
              {pillars.map((pillar, i) => (
                <button
                  key={pillar.title}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={`pillar-panel-${i}`}
                  id={`pillar-tab-${i}`}
                  onClick={() => goTo(i)}
                  className={`relative px-5 sm:px-7 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    active === i ? 'text-white' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {active === i && (
                    <motion.span
                      layoutId="about-pillar-tab"
                      className="absolute inset-0 rounded-full bg-primary shadow-[0_10px_25px_-10px_rgba(10,22,40,0.6)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="font-latin text-[10px] tracking-widest opacity-60">{pillar.index}</span>
                    {pillar.title}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Content panel + side nav */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-5xl mx-auto" dir="rtl">
            {/* Side progress cards — desktop only */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3">
              {pillars.map((pillar, i) => (
                <motion.button
                  key={pillar.index}
                  onClick={() => goTo(i)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                  className={`group text-right p-5 rounded-2xl border transition-all duration-500 ${
                    active === i
                      ? 'bg-white border-accent/30 shadow-[var(--shadow-glow)]'
                      : 'bg-white/60 border-border-light hover:border-accent/20 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        active === i
                          ? 'bg-gradient-to-br from-accent to-primary-medium text-white shadow-[var(--shadow-glow)]'
                          : 'bg-surface-warm text-accent group-hover:bg-accent/10'
                      }`}
                    >
                      {pillar.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-latin text-[10px] tracking-[0.2em] text-text-muted block mb-0.5">
                        {pillar.index}
                      </span>
                      <span className={`font-heading font-bold text-base ${active === i ? 'text-primary' : 'text-text-secondary'}`}>
                        {pillar.title}
                      </span>
                    </div>
                    <div
                      className={`w-1 h-8 rounded-full transition-all duration-500 ${
                        active === i ? 'bg-accent shadow-[0_0_8px_rgba(46,139,156,0.6)]' : 'bg-border'
                      }`}
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Main content card */}
            <div className="lg:col-span-8" style={{ perspective: 1400 }}>
              <TiltCard max={6} hoverScale={1.008} className="rounded-[32px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    id={`pillar-panel-${active}`}
                    role="tabpanel"
                    aria-labelledby={`pillar-tab-${active}`}
                    initial={{ opacity: 0, y: 24, rotateX: 8 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -16, rotateX: -6 }}
                    transition={{ duration: 0.55, ease }}
                    className="glass-light rounded-[32px] p-10 md:p-14 lg:p-16 min-h-[320px] flex flex-col"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex items-start justify-between mb-8" style={{ transform: 'translateZ(30px)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary-medium flex items-center justify-center text-white shadow-[var(--shadow-glow)]">
                          {current.icon}
                        </div>
                        <div>
                          <span className="font-latin text-xs tracking-[0.25em] text-accent font-semibold block mb-1">
                            {current.index}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-heading font-[800] text-primary">
                            {current.title}
                          </h3>
                        </div>
                      </div>
                      <span className="font-latin font-black text-6xl md:text-7xl text-primary/[0.04] leading-none select-none">
                        {current.index}
                      </span>
                    </div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 64 }}
                      transition={{ duration: 0.8, ease }}
                      className="h-[2px] bg-gradient-to-l from-accent to-accent-light rounded-full mb-8 shadow-[0_0_12px_rgba(58,168,188,0.4)]"
                      style={{ transform: 'translateZ(20px)' }}
                    />

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-text-secondary text-lg md:text-xl leading-[2] flex-1"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {current.text}
                    </motion.p>

                    {/* Progress dots */}
                    <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border-light" style={{ transform: 'translateZ(20px)' }}>
                      {pillars.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          aria-label={`${pillars[i].title}`}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            active === i ? 'w-10 bg-accent shadow-[0_0_8px_rgba(46,139,156,0.5)]' : 'w-3 bg-border hover:bg-accent/40'
                          }`}
                        />
                      ))}
                      <span className="mr-auto font-latin text-[11px] text-text-muted tracking-wider">
                        {current.index} / 03
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutIdentity;
