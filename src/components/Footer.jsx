import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Spotlight from './fx/Spotlight';
import TiltCard from './fx/TiltCard';
import Magnetic from './fx/Magnetic';
import RevealText from './fx/RevealText';
import { SocialIcon } from './SocialIcons';

const ease = [0.16, 1, 0.3, 1];

const navItems = [
  { name: 'الرئيسية', link: '/' },
  { name: 'عن نثيل', link: '/عن-نثيل' },
  { name: 'كيف نعمل', link: '/كيف-نعمل' },
  { name: 'جذورنا', link: '/جذورنا' },
  { name: 'تواصل معنا', link: '/اتصل-بنا' },
];

const socials = [
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'Snapchat', url: 'https://snapchat.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'TikTok', url: 'https://tiktok.com' },
];

const colVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -25 },
  visible: (i) => ({ opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay: i * 0.1, ease } }),
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <footer ref={ref} className="bg-primary text-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary-light/30 pointer-events-none" />
      <div className="aurora opacity-25" />
      <div className="grain" />
      <Spotlight />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-premium section-padding pt-24 pb-16">



          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20" dir="rtl" style={{ perspective: 1200 }}>

            {/* Col 1: About */}
            <motion.div className="lg:col-span-1" variants={colVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-6">
                <img src="/logo.png" alt="نثيل Natheel" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                تطوّر الأفكار الواعدة وتحولها إلى مشاريع منظّمة قابلة للتوسع، مستندين على خبرات تمتد لأكثر من 30 عاماً.
              </p>
            </motion.div>

            {/* Col 2: Navigation */}
            <motion.div variants={colVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-[11px] font-latin font-semibold tracking-[0.2em] uppercase text-white/30 mb-6">التنقل</h3>
              <ul className="space-y-3.5">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className="group inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-accent-light transition-all duration-500" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Col 3: Contact */}
            <motion.div variants={colVariants} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-[11px] font-latin font-semibold tracking-[0.2em] uppercase text-white/30 mb-6">التواصل</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-white/40 text-xs mb-1">الموقع</p>
                  <p className="text-white/80 text-sm font-medium">حائل، المملكة العربية السعودية</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">البريد الإلكتروني</p>
                  <a href="mailto:contact@natheelco.com" className="text-white/80 text-sm font-latin font-medium hover:text-accent-light transition-colors" dir="ltr">
                    contact@natheelco.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Col 4: QR Code */}
            <motion.div className="flex flex-col items-start" variants={colVariants} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-[11px] font-latin font-semibold tracking-[0.2em] uppercase text-white/30 mb-6">تابعنا</h3>
              <TiltCard max={14} className="w-44 glass-panel rounded-2xl">
                <div className="p-3 pb-2" style={{ transform: 'translateZ(30px)' }}>
                  <img src="/qr.jpg" alt="QR Code - Natheel" className="w-full h-auto rounded-lg" />
                </div>
                {/* Social Icons */}
                <div className="flex items-center justify-center gap-5 pb-4 pt-1" style={{ transform: 'translateZ(20px)' }}>
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-accent-glow hover:-translate-y-0.5 transition-all duration-300"
                      aria-label={s.name}
                    >
                      <SocialIcon name={s.name} />
                    </a>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

          </div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-l from-transparent via-white/15 to-transparent mb-8 origin-center"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease }}
          />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4" dir="rtl">
            <p className="text-white/30 text-xs font-medium">
              © {currentYear} نثيل. جميع الحقوق محفوظة.
            </p>

            <Magnetic strength={0.4}>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 text-xs font-medium group px-4 py-2 rounded-full border border-white/10 hover:border-accent-light/50 hover:shadow-[var(--shadow-glow)]"
                aria-label="العودة للأعلى"
              >
                <span>العودة للأعلى</span>
                <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Giant wordmark */}
        <motion.div
          className="pointer-events-none select-none text-center font-latin font-black leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/[0.09] to-transparent text-[22vw] -mb-[4vw]"
          style={{ y: wordmarkY, opacity: wordmarkOpacity }}
          aria-hidden="true"
        >
          NATHEEL
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
