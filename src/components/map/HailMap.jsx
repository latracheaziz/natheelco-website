import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import MapTerrain from './MapTerrain';
import MapPin, { PinGround } from './MapPin';
import { Compass, FilterPills, GrowthPanel, StatusPanel, Toolbar, TopPills, VenturesPanel } from './MapHUD';
import ProjectModal from '../ProjectModal';
import { useMediaQuery } from '../fx/useCanHover';
import { projects, hq } from '../../data/projects';

const ease = [0.16, 1, 0.3, 1];
const camSpring = { stiffness: 70, damping: 20, mass: 0.8 };
const pins = [hq, ...projects];

const HailMap = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduce = useReducedMotion();
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const revealed = useInView(stageRef, { once: true, margin: '-15%' });

  const [filter, setFilter] = useState('all');
  const [hovered, setHovered] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Camera: scroll intro + mouse parallax + user controls
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
  const intro = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 18 });
  const smy = useSpring(my, { stiffness: 50, damping: 18 });
  const zoom = useSpring(1, camSpring);
  const userRot = useSpring(0, camSpring);
  const panX = useSpring(0, camSpring);
  const panY = useSpring(0, camSpring);

  const restTilt = isMd ? 55 : 40;

  const tilt = useTransform([intro, smy], ([p, m]) =>
    reduce ? restTilt : restTilt + (1 - p) * 20 + m * 6
  );
  const rotZ = useTransform([intro, smx, userRot], ([p, m, u]) =>
    reduce ? u : (1 - p) * -14 + m * 5 + u
  );
  const scale = useTransform([intro, zoom], ([p, z]) => (reduce ? 1 : 0.72 + 0.28 * p) * z);
  const planeTransform = useTransform(
    [panX, panY, scale, tilt, rotZ],
    ([x, y, s, t, r]) => `translate(${x}%, ${-50 + y}%) scale(${s}) rotateX(${t}deg) rotateZ(${r}deg)`
  );
  const hudX = useTransform(smx, [-0.5, 0.5], [10, -10]);
  const hudY = useTransform(smy, [-0.5, 0.5], [8, -8]);

  // Drag to rotate
  const drag = useRef({ active: false, startX: 0, startRot: 0, moved: false });

  const onPointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startRot: userRot.get(), moved: false };
  };
  const onPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    if (drag.current.moved) {
      userRot.set(Math.max(-25, Math.min(25, drag.current.startRot + dx * 0.08)));
    }
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  const onPointerLeave = () => {
    endDrag();
    mx.set(0);
    my.set(0);
  };

  const focusOn = useCallback((item) => {
    setFocusedId(item.id);
    panX.set((50 - item.pos.x) * 0.55);
    panY.set((50 - item.pos.y) * 0.4);
    zoom.set(1.3);
  }, [panX, panY, zoom]);

  const recenter = () => {
    setFocusedId(null);
    panX.set(0);
    panY.set(0);
    zoom.set(1);
  };

  const reset = () => {
    recenter();
    userRot.set(0);
    setFilter('all');
  };

  const handleSelect = (item) => {
    if (drag.current.moved) return;
    focusOn(item);
    if (item.id === 'hq') return;
    setTimeout(() => {
      setSelected(item);
      setIsModalOpen(true);
    }, reduce ? 0 : 650);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelected(null), 400);
  }, []);

  const isDimmed = (item) => item.id !== 'hq' && filter !== 'all' && item.status !== filter;

  const panels = (
    <>
      <StatusPanel projects={projects} revealed={revealed} delay={0.9} />
      <GrowthPanel revealed={revealed} delay={1.05} />
      <VenturesPanel
        projects={projects}
        revealed={revealed}
        delay={1.2}
        hovered={hovered}
        onHover={setHovered}
        onSelect={handleSelect}
      />
    </>
  );

  return (
    <section ref={sectionRef} className="relative bg-primary-deep overflow-hidden py-20 md:py-28">
      <div className="aurora opacity-30" />
      <div className="grain" />

      {/* Heading */}
      <div className="container-premium section-padding relative mb-10 md:mb-14 text-center" dir="rtl">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-map-gold mb-5"
        >
          محفظة المشاريع
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30, rotateX: -40 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-3xl md:text-5xl font-heading font-[800] text-white"
        >
          حائل، المملكة العربية السعودية
        </motion.h2>
      </div>

      {/* Map stage */}
      <div className="container-premium px-3 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease }}
          className="relative h-[520px] md:h-[680px] lg:h-[720px] rounded-[28px] md:rounded-[36px] overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,#132240,#060E1A_70%)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(232,176,74,0.08)] touch-pan-y select-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={onPointerLeave}
        >
          {/* Stars / sky haze */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,139,156,0.25),transparent_70%)]" />

          {/* 3D scene */}
          <div className="map-stage absolute inset-0" dir="ltr">
            <motion.div
              className="map-plane absolute left-[-28%] top-[54%] w-[156%] md:left-[-15%] md:top-[56%] md:w-[130%] lg:left-[-22%] lg:w-[112%] lg:top-[54%] aspect-[5/3]"
              style={{ transform: planeTransform }}
            >
              <MapTerrain revealed={revealed} hovered={hovered} reduce={reduce} />
              {pins.map((item) => (
                <PinGround key={`g-${item.id}`} item={item} dimmed={isDimmed(item)} big={item.id === 'hq'} />
              ))}
              {pins.map((item, i) => (
                <MapPin
                  key={item.id}
                  item={item}
                  index={i}
                  tilt={tilt}
                  rotZ={rotZ}
                  revealed={revealed || reduce}
                  dimmed={isDimmed(item)}
                  focused={focusedId === item.id}
                  hovered={hovered === item.id}
                  onHover={setHovered}
                  onSelect={handleSelect}
                  showLabel={isMd || item.id === 'hq' || hovered === item.id || focusedId === item.id}
                />
              ))}
            </motion.div>
          </div>

          {/* Fog at the horizon */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-deep via-primary-deep/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-deep/90 to-transparent pointer-events-none" />

          {/* HUD */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 md:top-6 inset-x-0 pointer-events-auto">
              <TopPills items={pins} focusedId={focusedId} onFocus={(item) => (drag.current.moved ? null : focusOn(item))} />
            </div>

            <motion.div
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 hidden md:block pointer-events-auto"
              style={{ x: hudX, y: hudY }}
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.8, ease }}
            >
              <Toolbar
                onRecenter={recenter}
                onZoomIn={() => zoom.set(Math.min(1.8, zoom.get() + 0.2))}
                onZoomOut={() => zoom.set(Math.max(0.7, zoom.get() - 0.2))}
                onReset={reset}
              />
            </motion.div>

            <motion.div
              className="absolute left-3 md:left-6 bottom-14 md:bottom-6 pointer-events-auto max-md:scale-[0.7] origin-bottom-left"
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={revealed ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1.2, delay: 1, ease }}
            >
              <Compass rotZ={rotZ} />
            </motion.div>

            {isLg && (
              <motion.div
                className="absolute right-6 top-20 bottom-20 w-[250px] flex flex-col justify-center gap-3 pointer-events-auto"
                style={{ x: hudX, y: hudY }}
              >
                {panels}
              </motion.div>
            )}

            <div className="absolute bottom-4 md:bottom-6 inset-x-0 pointer-events-auto md:pr-[110px] lg:pr-0">
              <FilterPills filter={filter} setFilter={setFilter} />
            </div>
          </div>
        </motion.div>

        {/* Panels below the map on smaller screens */}
        {!isLg && (
          <div className="mt-5 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2" dir="rtl">
            {[StatusPanel, GrowthPanel, VenturesPanel].map((P, i) => (
              <div key={i} className="snap-center shrink-0 w-[260px]">
                <P
                  projects={projects}
                  revealed={revealed}
                  delay={0.2 + i * 0.1}
                  hovered={hovered}
                  onHover={setHovered}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal project={selected} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
};

export default HailMap;
