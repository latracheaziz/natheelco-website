import { motion } from 'framer-motion';
import PageHero from '../components/fx/PageHero';
import Reveal3D from '../components/fx/Reveal3D';
import TiltCard from '../components/fx/TiltCard';
import Magnetic from '../components/fx/Magnetic';
import { SocialIcon } from '../components/SocialIcons';

const socials = [
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Snapchat', url: 'https://snapchat.com' },
  { name: 'TikTok', url: 'https://tiktok.com' },
];

const ease = [0.16, 1, 0.3, 1];

const CardHeading = ({ children }) => (
  <>
    <motion.div
      className="h-[2px] bg-gradient-to-l from-accent to-accent-light rounded-full mb-6 shadow-[0_0_12px_rgba(58,168,188,0.6)]"
      initial={{ width: 0 }}
      whileInView={{ width: 48 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease }}
    />
    <h2 className="text-2xl font-heading font-bold text-primary mb-8">{children}</h2>
  </>
);

const Contact = () => {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="نتطلع للتواصل"
        title="تواصل معنا"
        subtitle="تابعنا على منصات التواصل الإجتماعي للإطلاع على كل جديد."
        variant={3}
      />

      {/* Contact content */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="dot-field" />
        <div className="absolute top-10 right-1/4 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[120px]" />

        <div className="container-premium section-padding relative" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

            {/* Contact Info */}
            <Reveal3D rotateY={-14}>
              <TiltCard max={7} className="glass-light rounded-[28px] p-8 md:p-10 h-full">
                <div style={{ transform: 'translateZ(30px)' }}>
                  <CardHeading>معلومات التواصل</CardHeading>

                  <div className="space-y-6">
                    <div className="rounded-2xl bg-surface-warm/80 border border-border-light p-5">
                      <p className="text-text-muted text-xs font-semibold tracking-wide uppercase mb-2">الموقع</p>
                      <p className="text-text-primary text-base font-medium">حائل، المملكة العربية السعودية</p>
                    </div>
                    <div className="rounded-2xl bg-surface-warm/80 border border-border-light p-5">
                      <p className="text-text-muted text-xs font-semibold tracking-wide uppercase mb-2">البريد الإلكتروني</p>
                      <a href="mailto:contact@natheelco.com" className="text-accent text-base font-latin font-medium hover:text-accent-light transition-colors" dir="ltr">
                        contact@natheelco.com
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal3D>

            {/* Social */}
            <Reveal3D rotateY={14}>
              <TiltCard max={7} className="glass-light rounded-[28px] p-8 md:p-10 h-full">
                <div style={{ transform: 'translateZ(30px)' }}>
                  <CardHeading>تابعنا</CardHeading>

                  <div className="grid grid-cols-2 gap-4" style={{ perspective: 800 }}>
                    {socials.map((social, i) => (
                      <motion.div
                        key={social.name}
                        initial={{ opacity: 0, rotateX: -60, y: 20 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                      >
                        <Magnetic strength={0.2} className="w-full">
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block h-[72px] relative"
                            style={{ perspective: 600 }}
                            aria-label={social.name}
                          >
                            <span className="absolute inset-0 preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:rotateX(180deg)]">
                              <span className="absolute inset-0 backface-hidden flex items-center justify-center rounded-xl bg-surface font-latin font-semibold text-sm text-text-secondary border border-border-light">
                                {social.name}
                              </span>
                              <span className="absolute inset-0 backface-hidden flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-medium text-white shadow-[var(--shadow-glow)] [transform:rotateX(180deg)]">
                                <SocialIcon name={social.name} className="w-5 h-5" />
                                <span className="font-latin font-semibold text-sm">{social.name}</span>
                              </span>
                            </span>
                          </a>
                        </Magnetic>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal3D>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
