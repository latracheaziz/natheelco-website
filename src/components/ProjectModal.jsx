import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpLeft } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -30, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
};

const ProjectModal = ({ project, isOpen, onClose }) => {
  const cardRef = useRef(null);

  // Mouse position state for 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery 3D movement
  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Convert mouse position to rotation angles
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ['-8deg', '8deg']);
  // Subtle translation for floating effect
  const translateX = useTransform(smoothMouseX, [-0.5, 0.5], ['-15px', '15px']);
  const translateY = useTransform(smoothMouseY, [-0.5, 0.5], ['-15px', '15px']);
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 45%)`
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset mouse position when opened
      mouseX.set(0);
      mouseY.set(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, mouseX, mouseY]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!project) return null;

  const stats = [
    { label: 'الموقع', value: project.location },
    { label: 'التأسيس', value: project.year },
    { label: 'الحالة', value: project.status },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{ perspective: 2000 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="dialog"
          aria-modal="true"
          aria-label={project.nameAr}
        >
          {/* Backdrop with intense blur */}
          <motion.div
            className="fixed inset-0 bg-primary/75 backdrop-blur-2xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aurora opacity-50" />
            <div className="grain" />
          </motion.div>

          {/* Modal Content - 3D Transform Container */}
          <motion.div
            ref={cardRef}
            className="relative z-10 my-auto w-full max-w-6xl bg-white/95 rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,22,40,0.6),0_0_0_1px_rgba(95,212,230,0.15)] flex flex-col md:flex-row backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.8, rotateX: 30, rotateY: -20, y: 100 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: 20, y: -100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.8 }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            dir="rtl"
          >
            {/* Glare */}
            <motion.div className="absolute inset-0 pointer-events-none z-40 mix-blend-soft-light" style={{ background: glare }} />

            {/* Close Button - Floating above */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300 z-50 shadow-xl border border-white/40"
              style={{ translateZ: 50 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="إغلاق"
            >
              <X size={24} strokeWidth={2.5} />
            </motion.button>

            {/* Image Column with 3D Parallax Inside */}
            <div className="w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-auto md:min-h-[600px] bg-primary overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
              <motion.img
                src={project.image || '/slides/office.jpg'}
                alt={project.nameAr}
                className="absolute inset-[-10%] w-[120%] h-[120%] object-cover"
                initial={{ scale: 1.3 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 1.6, ease }}
                style={{ x: translateX, y: translateY }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-accent/20 to-transparent mix-blend-overlay" />

              {/* Logo badge over image - pops out in 3D */}
              <motion.div
                className="absolute bottom-8 right-8"
                style={{ translateZ: 80 }}
                initial={{ opacity: 0, scale: 0.6, rotateY: -60 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.35, ease }}
              >
                <div className="absolute -inset-6 rounded-full bg-accent-light/40 blur-2xl animate-pulse" />
                <div className="relative w-28 h-28 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                  <span className={`${project.logoSize} font-bold text-white text-center leading-tight whitespace-pre-line font-latin drop-shadow-lg relative z-10`}>
                    {project.logo}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Content Column */}
            <motion.div
              className="w-full md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative"
              style={{ transformStyle: 'preserve-3d' }}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="mb-6" style={{ translateZ: 40 }} variants={itemVariants}>
                <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold tracking-widest mb-6 border border-accent/20 shadow-sm">
                  {project.category}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-[900] text-primary mb-2 leading-tight">
                  {project.nameAr}
                </h2>
                <h3 className="text-2xl md:text-3xl font-latin font-black text-transparent bg-clip-text bg-gradient-to-r from-text-muted/40 to-accent tracking-widest uppercase">
                  {project.nameEn}
                </h3>
              </motion.div>

              <motion.div
                className="w-16 h-1.5 bg-gradient-to-l from-accent to-accent-light rounded-full my-8 shadow-[0_0_15px_rgba(46,139,156,0.5)] origin-right"
                style={{ translateZ: 20 }}
                variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease } } }}
              />

              <motion.p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-12 font-medium" style={{ translateZ: 30 }} variants={itemVariants}>
                {project.description}
              </motion.p>

              <motion.div className="grid grid-cols-3 gap-4 md:gap-6 mb-12" style={{ translateZ: 50 }} variants={itemVariants}>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="relative glass-light rounded-2xl p-4 md:p-5 overflow-hidden group/stat hover:-translate-y-1 transition-transform duration-500"
                  >
                    <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-accent/15 blur-xl group-hover/stat:bg-accent/30 transition-colors" />
                    <p className="relative text-[11px] text-text-muted font-bold uppercase tracking-widest mb-2">{s.label}</p>
                    <p className="relative text-primary font-black text-sm md:text-lg">{s.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div className="mt-auto" style={{ translateZ: 60 }} variants={itemVariants}>
                <button
                  onClick={onClose}
                  className="group relative flex items-center justify-center gap-4 w-full py-5 bg-primary text-white rounded-2xl font-bold text-xl transition-all duration-500 overflow-hidden shadow-[0_20px_40px_-15px_rgba(10,22,40,0.6)]"
                >
                  {/* Dynamic background sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="relative z-10">استكشف المشروع</span>
                  <div className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500">
                    <ArrowUpLeft size={20} className="group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
