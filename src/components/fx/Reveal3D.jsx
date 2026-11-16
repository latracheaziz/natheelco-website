import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

// One-shot reveal when the block enters the viewport. Runs once on the compositor
// instead of recomputing transforms on every scroll frame.
const Reveal3D = ({
  children,
  className = '',
  rotateX = 10,
  rotateY = 0,
  distance = 60,
  delay = 0,
  style,
  ...rest
}) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1400, ...style }}
      initial={{ opacity: 0, y: distance, rotateX, rotateY, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Reveal3D;
