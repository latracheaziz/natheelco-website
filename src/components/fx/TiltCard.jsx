import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useCanHover } from './useCanHover';

const spring = { stiffness: 180, damping: 18, mass: 0.6 };

const TiltCard = ({
  children,
  className = '',
  max = 10,
  hoverScale = 1.02,
  glare = true,
  perspective = 1000,
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const active = true; // FORCE active so 3D effect is always visible

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const scale = useSpring(1, spring);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const handleMove = (e) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x - 0.5);
    py.set(y - 0.5);
    ref.current.style.setProperty('--gx', `${x * 100}%`);
    ref.current.style.setProperty('--gy', `${y * 100}%`);
  };

  const handleEnter = () => active && scale.set(hoverScale);
  const handleLeave = () => {
    px.set(0);
    py.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-root relative ${className}`}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        scale,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
      {glare && active && <span className="tilt-glare" aria-hidden="true" />}
    </motion.div>
  );
};

export default TiltCard;
