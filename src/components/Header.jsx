import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Magnetic from './fx/Magnetic';

const navLinks = [
  { name: 'الرئيسية', href: '/' },
  { name: 'عن نثيل', href: '/عن-نثيل' },
  { name: 'كيف نعمل', href: '/كيف-نعمل' },
  { name: 'جذورنا', href: '/جذورنا' },
];

const isActivePath = (pathname, href) => pathname === href || pathname === encodeURI(href);

const Header = () => {
  const [scrolledPast, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  // The About and Contact heroes are too dark for the black wordmark, so the header stays in its compact frosted form there.
  const isScrolled = scrolledPast || isActivePath(location.pathname, '/عن-نثيل') || isActivePath(location.pathname, '/اتصل-بنا');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const light = isScrolled && !isMobileMenuOpen;
  const activeHref = navLinks.find((l) => isActivePath(location.pathname, l.href))?.href;
  const highlightHref = hovered ?? activeHref;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <motion.div
          className="mx-auto pointer-events-auto"
          initial={false}
          animate={{
            maxWidth: isScrolled ? 1040 : 1280,
            marginTop: isScrolled ? 14 : 0,
            paddingLeft: isScrolled ? 12 : 0,
            paddingRight: isScrolled ? 12 : 0,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={false}
            animate={{ borderRadius: isScrolled ? 999 : 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden transition-[background,box-shadow,backdrop-filter] duration-700 ${
              light
                ? 'bg-white/75 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_50px_-20px_rgba(10,22,40,0.35),inset_0_0_0_1px_rgba(255,255,255,0.6)]'
                : 'bg-transparent'
            }`}
          >
            <div className={`flex justify-between items-center transition-all duration-700 ${
              isScrolled ? 'px-4 sm:px-6 py-2.5' : 'section-padding py-6 lg:py-8'
            }`}>

              {/* Logo */}
              <Link to="/" className="flex items-center group relative z-10">
                <motion.img
                  src="/logo-black-wordmark.png"
                  alt="نثيل Natheel"
                  className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
                {navLinks.map((link) => {
                  const isActive = link.href === activeHref;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      className={`relative px-5 py-2.5 text-[14px] font-medium rounded-full transition-colors duration-300 ${
                        light
                          ? isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
                          : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {highlightHref === link.href && (
                        <motion.span
                          layoutId="nav-highlight"
                          className={`absolute inset-0 rounded-full ${light ? 'bg-surface-warm' : 'bg-white/12'}`}
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute left-1/2 -bottom-0.5 w-1 h-1 -translate-x-1/2 rounded-full bg-accent-light shadow-[0_0_8px_#3AA8BC]"
                        />
                      )}
                    </Link>
                  );
                })}

                {/* CTA Button */}
                <Magnetic strength={0.3} className="mr-4">
                  <Link
                    to="/اتصل-بنا"
                    className={`group relative inline-flex overflow-hidden px-7 py-2.5 text-[14px] font-semibold rounded-full transition-all duration-400 ${
                      light
                        ? 'bg-primary text-white shadow-[0_10px_30px_-10px_rgba(10,22,40,0.6)]'
                        : 'bg-white text-primary'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-l from-accent to-accent-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">تواصل معنا</span>
                  </Link>
                </Magnetic>
              </nav>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-400 ${
                  light || isMobileMenuOpen ? 'text-primary hover:bg-surface-warm' : 'text-white hover:bg-white/10'
                }`}
                aria-label="القائمة"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    className={`block h-[1.5px] w-full rounded-full transition-colors ${light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'}`}
                  />
                  <motion.span
                    animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                    className={`block h-[1.5px] w-full rounded-full transition-colors ${light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'}`}
                  />
                  <motion.span
                    animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    className={`block h-[1.5px] w-full rounded-full transition-colors ${light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'}`}
                  />
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col overflow-hidden"
            style={{ perspective: 1000 }}
          >
            <div className="dot-field" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/15 blur-[100px]" />
            <div className="relative flex-1 flex flex-col justify-center items-center px-8 pt-24">
              <nav className="flex flex-col items-center gap-2 w-full max-w-sm">
                {[...navLinks, { name: 'تواصل معنا', href: '/اتصل-بنا' }].map((link, i) => {
                  const isActive = isActivePath(location.pathname, link.href);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, rotateX: -70, y: 40 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, rotateX: 40, y: -10 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '50% 100%' }}
                      className="w-full"
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-4 px-6 text-2xl font-heading font-bold rounded-2xl transition-all duration-300 ${
                          isActive
                            ? 'text-primary bg-surface-warm'
                            : 'text-text-secondary hover:text-primary hover:bg-surface-warm'
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className="text-xs font-latin text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Menu Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative pb-12 text-center"
            >
              <p className="text-text-muted text-sm font-latin tracking-wide">contact@natheelco.com</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
