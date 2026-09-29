import { useEffect, useRef } from 'react';

// Cursor-following light; tracks the pointer over its parent element.
const Spotlight = ({ className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!parent || !window.matchMedia('(hover: hover)').matches) return;

    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    };

    parent.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      parent.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <div ref={ref} className={`spotlight ${className}`} aria-hidden="true" />;
};

export default Spotlight;
