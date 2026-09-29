import { motion } from 'framer-motion';
import Reveal3D from './Reveal3D';
import TiltCard from './TiltCard';
import { ScrollRevealText } from './RevealText';

// Glass text card used by the About and How-we-work pages.
const ContentCard = ({ text, highlights = [], index = '01' }) => (
  <section className="relative py-24 lg:py-36 overflow-hidden">
    <div className="dot-field" />
    <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full bg-accent/10 blur-[120px]" />

    <div className="container-premium section-padding relative" dir="rtl">
      <Reveal3D className="max-w-4xl mx-auto">
        <TiltCard max={5} hoverScale={1.005} className="glass-light rounded-[32px] p-10 md:p-16">
          <div className="flex items-start justify-between mb-10" style={{ transform: 'translateZ(30px)' }}>
            <motion.div
              className="h-[2px] bg-gradient-to-l from-accent to-accent-light rounded-full shadow-[0_0_12px_rgba(58,168,188,0.6)]"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-latin font-black text-5xl text-primary/[0.06] leading-none">{index}</span>
          </div>
          <div style={{ transform: 'translateZ(40px)' }}>
            <ScrollRevealText
              text={text}
              highlights={highlights}
              className="text-text-secondary text-xl md:text-2xl leading-[2]"
            />
          </div>
        </TiltCard>
      </Reveal3D>
    </div>
  </section>
);

export default ContentCard;
