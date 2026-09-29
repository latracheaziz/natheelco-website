import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Keeps the original prefix ("+") and zero-padding ("04") of the value.
const parse = (value) => {
  const match = String(value).match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return { prefix, suffix, target: Number(digits), pad: digits.length };
};

const Counter = ({ value, duration = 2, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduce = useReducedMotion();
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed && !reduce ? 0 : null);

  useEffect(() => {
    if (!parsed || reduce || !inView) return;
    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  if (!parsed || display === null) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {String(display).padStart(parsed.pad, '0')}
      {parsed.suffix}
    </span>
  );
};

export default Counter;
