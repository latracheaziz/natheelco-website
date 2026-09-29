import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useCanHover } from './useCanHover';

const spring = { stiffness: 220, damping: 15, mass: 0.4 };

const Magnetic = ({ children, strength = 0.35, className = '' }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const handleMove = (e) => {
    if (reduce || !canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
