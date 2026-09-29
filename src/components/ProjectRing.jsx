import { motion, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import TiltCard from './fx/TiltCard';
import { useMediaQuery } from './fx/useCanHover';

const CARD_W = 340;
const RADIUS = 520;
const AUTO_SPEED = 0.012; // degrees per ms

const RingCard = ({ project, index, count, rotation, onOpen, dragMoved }) => {
  const base = (360 / count) * index;
  const facing = useTransform(rotation, (r) => Math.cos(((base - r) * Math.PI) / 180));
  const opacity = useTransform(facing, [-1, 0, 1], [0.06, 0.3, 1]);
  const pointerEvents = useTransform(facing, (f) => (f > 0.2 ? 'auto' : 'none'));

  return (
    <motion.div
      className="ring-card group cursor-pointer"
      style={{
        width: CARD_W,
        marginLeft: -CARD_W / 2,
        transform: `rotateY(${base}deg) translateZ(${RADIUS}px)`,
        opacity,
        pointerEvents,
      }}
      onClick={() => !dragMoved.current && onOpen(project)}
    >
      <motion.div
        whileHover={{ y: -14, z: 40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="preserve-3d h-full"
      >
        <ProjectCard project={project} index={index} />
      </motion.div>
    </motion.div>
  );
};

const ProjectRing = ({ projects, onOpen }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-6" dir="rtl">
      {projects.map((project, index) => (
        <TiltCard
          key={project.id}
          max={6}
          className="group cursor-pointer rounded-[24px] overflow-hidden"
          onClick={() => onOpen(project)}
        >
          <ProjectCard project={project} index={index} />
        </TiltCard>
      ))}
    </div>
  );
};

export default ProjectRing;
