import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';

const Reveal3D = ({
  children,
  className = '',
  rotateX = 18,
  rotateY = 0,
  distance = 80,
  offset = ['start 0.95', 'start 0.45'],
  style,
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const rX = useTransform(p, [0, 1], [rotateX, 0]);
  const rY = useTransform(p, [0, 1], [rotateY, 0]);
  const y = useTransform(p, [0, 1], [distance, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const opacity = useTransform(p, [0, 0.6], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduce
          ? style
          : {
              rotateX: rX,
              rotateY: rY,
              y,
              scale,
              opacity,
              transformPerspective: 1400,
              transformStyle: 'preserve-3d',
              ...style,
            }
      }
    >
      {children}
    </motion.div>
  );
};

export default Reveal3D;
