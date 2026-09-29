import { motion, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import TiltCard from './fx/TiltCard';
import { useMediaQuery } from './fx/useCanHover';

const CARD_W = 340;
const RADIUS = 400; // Reduced radius brings cards much closer together
const AUTO_SPEED = 0.012; // degrees per ms

const RingCard = ({ project, index, count, rotation, onOpen, dragMoved }) => {
  const base = (360 / count) * index;
  const facing = useTransform(rotation, (r) => Math.cos(((base - r) * Math.PI) / 180));
  const opacity = useTransform(facing, [-1, 0, 1], [0.06, 0.3, 1]);
  const pointerEvents = useTransform(facing, (f) => (f > 0.2 ? 'auto' : 'none'));

  return (
    <motion.div
      className="ring-card group absolute top-0"
      style={{
        width: CARD_W,
        left: '50%',
        marginLeft: -CARD_W / 2,
        transform: `rotateY(${base}deg) translateZ(${RADIUS}px)`,
        opacity,
        pointerEvents,
      }}
    >
      <motion.div
        whileHover={{ y: -14, z: 40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="preserve-3d h-full cursor-pointer"
        onClick={() => !dragMoved.current && onOpen(project)}
      >
        <ProjectCard project={project} index={index} />
      </motion.div>
    </motion.div>
  );
};

const ProjectRing = ({ projects, onOpen }) => {
  const reduce = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 900px)');
  const rotation = useMotionValue(0);
  const ringRotate = useTransform(rotation, (r) => -r);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ active: false, startX: 0, startRot: 0 });
  const dragMoved = useRef(false);

  // Extend projects to make the ring fuller
  const extendedProjects = useMemo(() => {
    if (projects.length <= 4) {
      // If 3 projects, doubling them gives 6, which forms a nice ring
      return [...projects, ...projects];
    }
    return projects;
  }, [projects]);

  useAnimationFrame((_, delta) => {
    if (paused || drag.current.active || reduce || !isWide) return;
    rotation.set(rotation.get() + AUTO_SPEED * delta);
  });

  if (!isWide || reduce) {
    return (
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 py-6" dir="rtl">
        {projects.map((project, index) => (
          <TiltCard
            key={project.id}
            max={6}
            className="snap-center shrink-0 w-[300px] sm:w-[340px] group cursor-pointer rounded-[24px]"
            onClick={() => onOpen(project)}
          >
            <ProjectCard project={project} index={index} />
          </TiltCard>
        ))}
      </div>
    );
  }

  const onPointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startRot: rotation.get() };
    dragMoved.current = false;
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) dragMoved.current = true;
    rotation.set(drag.current.startRot - dx * 0.25);
  };
  const endDrag = () => {
    drag.current.active = false;
    setTimeout(() => { dragMoved.current = false; }, 0);
  };

  return (
    <div
      className="ring-stage relative h-[640px] select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); endDrag(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
    >
      {/* Floor reflection */}
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[900px] h-[140px] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(46,139,156,0.22),transparent_70%)] blur-xl" />
      <div
        className="absolute left-1/2 bottom-10 w-[1000px] h-[260px] rounded-[50%] border border-accent/15"
        style={{ transform: 'translateX(-50%) rotateX(78deg)' }}
      />

      <motion.div
        className="ring absolute left-1/2 top-8 h-[500px] w-full"
        style={{ rotateX: -6, rotateY: ringRotate, z: -RADIUS }}
      >
        {extendedProjects.map((project, index) => (
          <RingCard
            key={index}
            project={project}
            index={index}
            count={extendedProjects.length}
            rotation={rotation}
            onOpen={onOpen}
            dragMoved={dragMoved}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectRing;
