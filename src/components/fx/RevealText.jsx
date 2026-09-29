import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Fragment, useRef } from 'react';

const wordVariants = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -80, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i },
  }),
};

// Splits by word so Arabic letters stay joined.
const RevealText = ({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.06,
  immediate = false,
}) => {
  const words = text.split(' ');
  const trigger = immediate
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-10%' } };

  return (
    <motion.span className={`inline ${className}`} style={{ perspective: 800 }} {...trigger}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <motion.span
            className={`inline-block will-change-transform ${wordClassName}`}
            style={{ transformOrigin: '50% 100%' }}
            variants={wordVariants}
            custom={delay + i * stagger}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  );
};

const ScrollWord = ({ word, progress, range, highlight }) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      className={`inline-block ${highlight ? 'text-accent font-semibold' : ''}`}
      style={{ opacity, y }}
    >
      {word}
    </motion.span>
  );
};

// Words light up one by one as the block scrolls through the viewport.
export const ScrollRevealText = ({ text, className = '', highlights = [] }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');

  if (reduce) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Fragment key={`${word}-${i}`}>
            <ScrollWord
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
              highlight={highlights.some((h) => word.includes(h))}
            />
            {i < words.length - 1 && ' '}
          </Fragment>
        );
      })}
    </p>
  );
};

export default RevealText;
