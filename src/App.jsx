import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BrandMarquee from './components/BrandMarquee';
import Home from './pages/Home';
import About from './pages/About';
import HowWeWork from './pages/HowWeWork';
import Roots from './pages/Roots';
import Contact from './pages/Contact';

const pageVariants = {
  initial: { opacity: 0, y: 80, rotateX: 6, scale: 0.98 },
  enter: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -40,
    rotateX: -4,
    scale: 0.97,
    transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] },
  },
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-0 inset-x-0 h-[2px] z-[60] origin-right bg-gradient-to-l from-accent-glow via-accent-light to-accent shadow-[0_0_12px_rgba(95,212,230,0.8)]"
      style={{ scaleX }}
    />
  );
};

const RouteWipe = ({ path }) => (
  <motion.div
    key={path}
    className="fixed top-0 inset-x-0 h-[3px] z-[61] pointer-events-none origin-right bg-gradient-to-l from-transparent via-accent-glow to-transparent"
    initial={{ scaleX: 0, opacity: 1 }}
    animate={{ scaleX: 1, opacity: 0 }}
    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
  />
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <RouteWipe path={location.pathname} />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ transformOrigin: '50% 0%', transformPerspective: 2000 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/عن-نثيل" element={<About />} />
            <Route path="/كيف-نعمل" element={<HowWeWork />} />
            <Route path="/جذورنا" element={<Roots />} />
            <Route path="/اتصل-بنا" element={<Contact />} />

            {/* Fallback route just in case */}
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const ConditionalMarquee = () => {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <BrandMarquee />;
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollProgress />
        <div className="font-sans text-text-primary bg-white min-h-[100dvh] flex flex-col overflow-x-hidden relative w-full">
          <Header />
          <main className="flex-grow w-full">
            <AnimatedRoutes />
          </main>
          <ConditionalMarquee />
          <Footer />
        </div>
      </Router>
    </MotionConfig>
  );
}

export default App;
