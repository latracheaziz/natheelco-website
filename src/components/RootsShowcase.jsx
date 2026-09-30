import {
  animate,
  motion,
  AnimatePresence,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Reveal3D from './fx/Reveal3D';
import { useMediaQuery } from './fx/useCanHover';

const slides = [
  { src: '/roots/roots-01.png', alt: 'وادي تحيط به الجبال والنخيل ومجرى الماء', caption: 'وادي النخيل' },
  { src: '/roots/roots-02.png', alt: 'جبال صخرية تحيط بمجرى ماء', caption: 'بين الجبل والماء' },
  { src: '/roots/roots-03.png', alt: 'وادي جبلي ومجرى مائي وقت الغروب', caption: 'ضوء الغروب' },
];

const COPIES = 3;
const cards = Array.from({ length: slides.length * COPIES }, (_, i) => ({ ...slides[i % slides.length], original: i % slides.length }));
const N = cards.length;
const CRUISE = 0.34;
const ease = [0.16, 1, 0.3, 1];

const wrap = (d) => {
  const half = N / 2;
  return ((((d + half) % N) + N) % N) - half;
};
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const originalAt = (p) => (((Math.round(p) % N) + N) % N) % slides.length;

const WheelCard = ({ card, index, progress, swing, speed, intro, geo, onPick }) => {
  const d = useTransform(progress, (p) => wrap(p - index));
  const angle = useTransform(d, (v) => v * geo.step);
  const x = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * geo.radius);
  const y = useTransform([angle, intro, d], ([a, i, dv]) =>
    (1 - Math.cos((a * Math.PI) / 180)) * geo.radius + (1 - i) * (320 + Math.abs(dv) * 180));
  const rotateZ = useTransform([angle, swing, intro, d], ([a, s, i, dv]) =>
    a + clamp(-s * 7, -16, 16) + (1 - i) * dv * 24);
  const rotateY = useTransform(d, (v) => clamp(v * -16, -40, 40));
  const scale = useTransform(d, (v) => 1.06 - Math.min(Math.abs(v), 2.6) * 0.13);
  const opacity = useTransform([d, intro], ([v, i]) => {
    const a = Math.abs(v);
    const edge = a > 2.7 ? 0 : a > 2 ? 1 - (a - 2) / 0.7 : 1;
    return edge * clamp(i * 1.6 - Math.abs(v) * 0.25, 0, 1);
  });
  const zIndex = useTransform(d, (v) => Math.round(100 - Math.abs(v) * 10));
  const focus = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v) * 2.2));
  const shade = useTransform(d, (v) => Math.min(Math.abs(v), 1.5) * 0.42);
  const imgX = useTransform(d, (v) => `${clamp(v * -13, -30, 30)}%`);
  const skewX = useTransform(speed, (v) => clamp(v * 4.5, -12, 12));
  const scaleX = useTransform(speed, (v) => 1 + Math.min(Math.abs(v) * 0.05, 0.1));
  const sweep = useTransform(focus, [0.4, 1], ['-130%', '130%']);
  const badgeY = useTransform(focus, [0.6, 1], [-10, 0]);
  const pointerEvents = useTransform(d, (v) => (Math.abs(v) < 2.2 ? 'auto' : 'none'));

  return (
    <motion.div
      className="absolute top-8 left-1/2"
      style={{ width: geo.cardW, marginLeft: -geo.cardW / 2, x, y, rotateZ, rotateY, scale, opacity, zIndex, pointerEvents, transformOrigin: '50% 50%' }}
      onClick={() => onPick(d.get())}
    >
      <motion.div style={{ skewX, scaleX }} className="cursor-pointer">
        <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[22px] border border-white/15 bg-primary-light shadow-[0_40px_70px_-28px_rgba(0,0,0,0.75)] sm:rounded-[32px]">
          <motion.img
            src={card.src}
            alt={card.alt}
            draggable="false"
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{ x: imgX, scale: 1.34 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-primary/10" />
          <motion.div className="pointer-events-none absolute inset-0 bg-[#050d18]" style={{ opacity: shade }} />
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light"
            style={{ x: sweep }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1.5px_rgba(95,212,230,0.9),inset_0_0_40px_rgba(95,212,230,0.25)]"
            style={{ opacity: focus }}
          />
          <motion.div
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-primary/35 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-white/85 backdrop-blur-xl sm:right-6 sm:top-6 sm:text-[11px]"
            style={{ opacity: focus, y: badgeY }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_10px_#5FD4E6]" />
            جذور نثيل
          </motion.div>
          <span className="pointer-events-none absolute bottom-4 left-5 font-latin text-4xl font-black leading-none text-white/30 sm:bottom-7 sm:left-8 sm:text-6xl" aria-hidden="true">
            {String(card.original + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RootsShowcase = () => {
  const reduce = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 900px)');
  const geo = isWide
    ? { cardW: 540, radius: 1500, step: 21, stage: 620 }
    : { cardW: 270, radius: 760, step: 24, stage: 360 };

  const stageRef = useRef(null);
  const inView = useInView(stageRef, { amount: 0.15 });
  const inViewRef = useRef(false);
  inViewRef.current = inView;
  const progress = useMotionValue(0);
  const velocity = useVelocity(progress);
  const excess = useTransform(velocity, (v) => v - CRUISE);
  const speed = useSpring(excess, { stiffness: 320, damping: 40 });
  const swing = useSpring(excess, { stiffness: 90, damping: 7, mass: 1.2 });
  const intro = useMotionValue(reduce ? 1 : 0);

  const [active, setActive] = useState(0);
  const pending = useRef(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startP: 0 });
  const introStarted = useRef(false);

  useMotionValueEvent(progress, 'change', (p) => {
    const next = originalAt(p);
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!inView || introStarted.current || reduce) return;
    introStarted.current = true;
    animate(intro, 1, { duration: 1.9, ease });
  }, [inView, reduce, intro]);

  useAnimationFrame((_, delta) => {
    if (reduce || drag.current.active || !inViewRef.current) return;
    const dt = Math.min(delta, 40) / 1000;
    let move = CRUISE * dt;
    if (pending.current !== 0) {
      const catchup = Math.min(Math.abs(pending.current), 2.2 * dt) * Math.sign(pending.current);
      pending.current -= catchup;
      move += catchup;
    }
    progress.set(progress.get() + move);
  });

  const nudge = (delta) => {
    if (reduce) {
      progress.set(progress.get() + delta);
      return;
    }
    pending.current += delta;
  };

  const onPointerDown = (e) => {
    drag.current = { active: true, moved: false, startX: e.clientX, startP: progress.get() };
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6 && !drag.current.moved) {
      drag.current.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (drag.current.moved) progress.set(drag.current.startP + dx / (geo.cardW * 0.85));
  };
  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.moved) pending.current += clamp(progress.getVelocity() * 0.18, -2.5, 2.5);
  };

  const pick = (d) => {
    if (drag.current.moved) return;
    const offset = Math.round(d);
    if (offset !== 0) nudge(-offset);
  };

  const goToScene = (scene) => {
    const current = progress.get();
    let best = current;
    let bestDist = Infinity;
    for (let k = current - N; k <= current + N; k++) {
      if (originalAt(k) === scene && Math.abs(k - current) < bestDist) {
        best = k;
        bestDist = Math.abs(k - current);
      }
    }
    nudge(best - current);
  };

  const words = slides[active].caption.split(' ');

  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28" dir="rtl">
      <div className="aurora opacity-35" />
      <div className="grain" />
      <div className="absolute -left-44 top-1/4 h-[440px] w-[440px] rounded-full bg-accent/10 blur-[130px]" />

      <div className="container-premium section-padding relative z-10">
        <Reveal3D className="flex justify-start" dir="rtl">
          <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.16em] text-accent-light">
            <span className="h-px w-8 bg-accent-light" />
            مشاهد من الجذور
            <span className="h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_12px_#5FD4E6]" />
          </span>
        </Reveal3D>
      </div>

      <div
        ref={stageRef}
        className="relative mt-10 select-none touch-pan-y"
        style={{ height: geo.stage, perspective: 1800 }}
        onMouseLeave={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-[-150px] grid place-items-center sm:bottom-[-230px]" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 90, filter: 'blur(16px)', scale: 0.88 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -70, filter: 'blur(16px)', scale: 1.1 }}
              transition={{ duration: 0.9, ease }}
              className="col-start-1 row-start-1 font-latin font-black leading-none text-transparent"
              style={{ fontSize: isWide ? 300 : 160, WebkitTextStroke: '1.5px rgba(95,212,230,0.22)' }}
            >
              {String(active + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 h-[120px] w-[80%] max-w-[1000px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(58,168,188,0.22),transparent_70%)] blur-2xl" />

        {cards.map((card, index) => (
          <WheelCard
            key={index}
            card={card}
            index={index}
            progress={progress}
            swing={swing}
            speed={speed}
            intro={intro}
            geo={geo}
            onPick={pick}
          />
        ))}
      </div>

      <div className="container-premium section-padding relative z-10 -mt-4 flex flex-col items-center gap-6 sm:-mt-10">
        <div className="grid min-h-[56px] place-items-center overflow-hidden" style={{ perspective: 600 }} aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.h3 key={active} className="col-start-1 row-start-1 flex gap-3 text-2xl font-heading font-[800] text-white sm:text-4xl">
              {words.map((word, i) => (
                <motion.span
                  key={word + i}
                  initial={{ y: '110%', opacity: 0, rotateX: -70 }}
                  animate={{ y: '0%', opacity: 1, rotateX: 0 }}
                  exit={{ y: '-110%', opacity: 0, rotateX: 70 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="inline-block origin-bottom text-white"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h3>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-5" dir="ltr">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="السابق"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent-light/60 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-2" dir="rtl">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goToScene(i)}
                aria-label={slide.caption}
                aria-current={active === i}
                className="relative h-[3px] w-10 overflow-hidden rounded-full bg-white/15"
              >
                {active === i && (
                  <span className="absolute inset-0 rounded-full bg-accent-light shadow-[0_0_10px_#5FD4E6]" />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="التالي"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent-light/60 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RootsShowcase;
