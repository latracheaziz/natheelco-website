import { motion } from 'framer-motion';
import PageHero from '../components/fx/PageHero';
import Reveal3D from '../components/fx/Reveal3D';
import TiltCard from '../components/fx/TiltCard';
import Magnetic from '../components/fx/Magnetic';
import { SocialIcon } from '../components/SocialIcons';

const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/nathe.els/' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/natheel-s/about/' },
  { name: 'Snapchat', url: 'https://www.snapchat.com/@natheel-s?share_id=wCG-7NCO0eQ&locale=en-AU' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@natheels' },
  { name: 'YouTube', url: 'https://www.youtube.com/@Natheels' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61588825941973#' },
  { name: 'X', url: 'https://x.com/Natheel2030' },
  { name: 'Pinterest', url: 'https://www.pinterest.com/natheels/' },
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
        useEnvatoWave={true}
      />

      {/* Contact content */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="dot-field" />
        <div className="absolute top-10 right-1/4 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

        <div className="container-premium section-padding relative" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

            {/* Contact Info */}
            <Reveal3D rotateY={-14}>
              <TiltCard max={7} glare={false} className="glass-light rounded-[28px] p-8 md:p-10 h-full">
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
              <TiltCard max={7} glare={false} className="glass-light rounded-[28px] p-8 md:p-10 h-full">
                <div style={{ transform: 'translateZ(30px)' }}>
                  <CardHeading>تابعنا</CardHeading>

                  <div className="grid grid-cols-2 gap-4">
                    {socials.map((social, i) => (
                      <motion.div
                        key={social.name}
                        initial={{ opacity: 0, rotateX: -30, y: 30 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                        className="w-full h-full"
                      >
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 3 + (i % 3),
                            ease: 'easeInOut',
                            delay: i * 0.2
                          }}
                          className="w-full h-full"
                        >
                          <TiltCard
                            max={25}
                            perspective={600}
                            hoverScale={1.08}
                            glare={true}
                            className="group block h-[72px] relative z-10 rounded-xl bg-surface border border-border-light shadow-sm transition-shadow duration-500 hover:shadow-[0_20px_40px_rgba(58,168,188,0.2)]"
                          >
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center gap-3 text-text-secondary group-hover:text-primary transition-colors duration-300"
                              aria-label={social.name}
                              style={{ transformStyle: 'preserve-3d' }}
                            >
                              <div
                                className="flex items-center justify-center"
                                style={{ transform: 'translateZ(40px)' }}
                              >
                                <SocialIcon name={social.name} className="w-5 h-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125 group-hover:[transform:rotateY(360deg)] text-text-secondary group-hover:text-accent drop-shadow-sm group-hover:drop-shadow-[0_0_12px_rgba(58,168,188,0.6)]" />
                              </div>
                              <span
                                className="font-latin font-semibold text-sm"
                                style={{ transform: 'translateZ(25px)' }}
                              >
                                {social.name}
                              </span>
                              {/* Very soft cyan highlight at bottom during hover */}
                              <div
                                className="absolute -bottom-4 inset-x-6 h-6 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ transform: 'translateZ(5px)' }}
                              />
                            </a>
                          </TiltCard>
                        </motion.div>
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
