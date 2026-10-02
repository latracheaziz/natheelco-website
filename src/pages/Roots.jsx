import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RootsAnimatedHero from '../components/fx/RootsAnimatedHero';
import Reveal3D from '../components/fx/Reveal3D';
import RevealText from '../components/fx/RevealText';
import TiltCard from '../components/fx/TiltCard';
import RootsShowcase from '../components/RootsShowcase';

const VisionSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // The route wrapper is transformed, which breaks position: fixed, so the image is counter-translated to stay pinned to the viewport.
  const y = useTransform(scrollYProgress, (p) => {
    const el = ref.current;
    if (!el) return 0;
    const vh = window.innerHeight;
    return -vh + p * (vh + el.offsetHeight);
  });

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden py-32 md:py-48"
      dir="rtl"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[100dvh] w-full will-change-transform"
        style={{ y }}
        aria-hidden="true"
      >
        <img src="/roots-hero.jpeg" alt="" draggable="false" className="h-full w-full object-cover" />
      </motion.div>

      <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-primary/20" />

      <div className="container-premium section-padding relative z-10 text-center">
        <Reveal3D>
          <span className="mb-5 inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.15em] text-accent-light">
            <span className="h-px w-8 bg-accent-light" />
            رؤيتنا
            <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_10px_#5FD4E6]" />
          </span>
        </Reveal3D>

        <Reveal3D delay={0.2}>
          <h2 className="mb-6 text-3xl font-heading font-bold text-white drop-shadow-lg md:text-5xl">
            نبني المستقبل بأصالة الماضي
          </h2>
        </Reveal3D>

        <Reveal3D delay={0.4}>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 drop-shadow-md md:text-xl">
            كما النخيل يضرب بجذوره في الأرض، نثيل تبني مشاريعها على أسس متينة من الجودة والثقة لنعكس طموحنا نحو التطور المستمر.
          </p>
        </Reveal3D>
      </div>
    </section>
  );
};

const Roots = () => {
  return (
    <div className="bg-transparent relative z-0">
      
      <RootsAnimatedHero
        title="جذورنا"
        subtitle="ياهلا والله يحييكم"
      />

      {/* 2. Content Container scrolls over the Hero */}
      <div className="relative z-10">

      {/* Intro Section */}
      <section className="relative py-20 lg:py-28 bg-surface-warm overflow-hidden" dir="rtl">
        <div className="container-premium section-padding relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text */}
            <div className="space-y-12">
              <Reveal3D delay={0.2}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                    حكايتنا بدأت من حائل
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    في أرض تجمع بين الأصالة والطموح، تنطلق نثيل لبناء مشاريع عصرية تنمو من احتياجات المجتمع وتواكب تطلعات المستقبل.
                  </p>
                </div>
              </Reveal3D>

              <Reveal3D delay={0.4}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                    حائل كما نراها
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    حائل منطقة غنية بتاريخها، وطبيعتها، وثقافتها، وأهلها. نرى فيها بيئة واعدة لصناعة المشاريع، وتنمية المواهب، وتقديم تجارب وخدمات تضيف قيمة حقيقية للمجتمع.
                  </p>
                </div>
              </Reveal3D>
            </div>

            {/* Image */}
            <Reveal3D delay={0.3}>
              <TiltCard className="rounded-[32px]">
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative shadow-[var(--shadow-depth)] border border-white/20">
                  <img src="/hail-city.png" alt="مدينة حائل" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                </div>
              </TiltCard>
            </Reveal3D>

          </div>
        </div>
      </section>

      <RootsShowcase />

      <VisionSection />

      <section className="relative overflow-hidden bg-surface py-20 lg:py-28" dir="rtl">
        <div className="dot-field" />
        <div className="absolute -left-32 top-1/4 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[110px]" />
        <div className="container-premium section-padding relative z-10">
          <Reveal3D className="mx-auto max-w-5xl">
            <div className="glass-light relative overflow-hidden rounded-[28px] px-7 py-10 text-center sm:rounded-[36px] sm:px-12 sm:py-14 lg:px-20 lg:py-16">
              <div className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-l from-transparent via-accent-light to-transparent" />
              <span className="mb-5 inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.15em] text-accent">
                <span className="h-px w-8 bg-accent" />
                جذور نثيل
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(58,168,188,0.65)]" />
              </span>
              <h2 className="mt-3 text-3xl font-heading font-[800] leading-[1.3] text-primary md:text-4xl lg:text-5xl">
                <RevealText text="الإنسان والمكان" />
              </h2>
              <div className="mx-auto my-6 h-[2px] w-16 rounded-full bg-gradient-to-l from-accent to-accent-light shadow-[0_0_12px_rgba(58,168,188,0.4)]" />
              <p className="mx-auto max-w-3xl text-lg leading-[2] text-text-secondary md:text-xl">
                نؤمن بأن المشاريع الناجحة تبدأ من فهم المكان والناس. لذلك نطّور مشاريع تحترم هوية حائل، وتستفيد من قدرات شبابها، وتجمع بين الأصالة والأسلوب العصري.
              </p>
            </div>
          </Reveal3D>
        </div>
      </section>
      </div> {/* End Content Container */}
    </div>
  );
};

export default Roots;
