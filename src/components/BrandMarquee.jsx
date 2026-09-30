import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useRef } from 'react';

const brands = ['أودن', 'هاجس', 'غالية'];

const BASE_SPEED = 3.2; // % of track per second

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const Row = ({ lit = false }) => (
  <div className="flex w-max" aria-hidden={lit || undefined}>
    {Array.from({ length: 16 }).map((_, g) => (
      <div key={g} className="mq-group">
        {brands.map((name) => (
          <div key={`${g}-${name}`} className="flex items-center">
            <span className={`mq-brand ${lit ? 'is-lit' : ''}`}>{name}</span>
            <span className="mq-dot" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const BrandMarquee = () => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(-1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.1) direction.current = 1;
    else if (b > 0.1) direction.current = -1;
    const move = direction.current * BASE_SPEED * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="relative bg-primary overflow-hidden py-10 md:py-14 mq-stage">
      <div className="grain" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-accent-light/40 to-transparent" />

      <div className="mq-band relative" dir="ltr">
        <motion.div style={{ x }}>
          <Row lit />
        </motion.div>
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default BrandMarquee;
