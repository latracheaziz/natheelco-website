import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Magnetic from './fx/Magnetic';
import { useLanguage } from '../context/LanguageContext';

const getNavLinks = (isEn) =>
  isEn
    ? [
        { name: 'Home', href: '/', aliases: ['/'] },
        { name: 'About Natheel', href: '/about', aliases: ['/about', '/عن-نثيل'] },
        { name: 'How We Work', href: '/how-we-work', aliases: ['/how-we-work', '/كيف-نعمل'] },
        { name: 'Our Roots', href: '/roots', aliases: ['/roots', '/جذورنا'] },
        { name: 'Natheel Updates', href: '/news', aliases: ['/news', '/الأخبار', '/مستجدات-نثيل'] },
      ]
    : [
        { name: 'الرئيسية', href: '/', aliases: ['/'] },
        { name: 'عن نثيل', href: '/عن-نثيل', aliases: ['/عن-نثيل', '/about'] },
        { name: 'كيف نعمل', href: '/كيف-نعمل', aliases: ['/كيف-نعمل', '/how-we-work'] },
        { name: 'جذورنا', href: '/جذورنا', aliases: ['/جذورنا', '/roots'] },
        { name: 'مستجدات نثيل', href: '/الأخبار', aliases: ['/الأخبار', '/news', '/مستجدات-نثيل'] },
      ];

const isActivePath = (pathname, link) => {
  if (link.aliases) {
    return link.aliases.some((alias) => pathname === alias || pathname === encodeURI(alias));
  }
  return pathname === link.href || pathname === encodeURI(link.href);
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const logoClickCount = useRef(0);
  const lastLogoClick = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, isAr, isEn } = useLanguage();

  const navLinks = getNavLinks(isEn);
  const contactLink = {
    name: isEn ? 'Contact Us' : 'تواصل معنا',
    href: isEn ? '/contact' : '/اتصل-بنا',
    aliases: ['/contact', '/اتصل-بنا'],
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const light = !isMobileMenuOpen;
  const activeHref = navLinks.find((l) => isActivePath(location.pathname, l))?.href;
  const highlightHref = hovered ?? activeHref;

  const handleLogoClick = (event) => {
    const now = Date.now();
    logoClickCount.current = now - lastLogoClick.current > 2000 ? 1 : logoClickCount.current + 1;
    lastLogoClick.current = now;

    if (logoClickCount.current === 5) {
      event.preventDefault();
      logoClickCount.current = 0;
      navigate('/adminnatheelcoir');
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <motion.div
          className="mx-auto pointer-events-auto"
          initial={false}
          animate={{
            maxWidth: 1080,
            marginTop: 14,
            paddingLeft: 12,
            paddingRight: 12,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={false}
            animate={{ borderRadius: 999 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden transition-[background,box-shadow,backdrop-filter] duration-700 ${
              light
                ? 'bg-white/75 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_50px_-20px_rgba(10,22,40,0.35),inset_0_0_0_1px_rgba(255,255,255,0.6)]'
                : 'bg-transparent'
            }`}
          >
            <div className="flex justify-between items-center transition-all duration-700 px-4 sm:px-6 py-2.5">
              {/* Logo */}
              <Link to="/" onClick={handleLogoClick} className="flex items-center group relative z-10">
                <motion.img
                  src="/logo-black-wordmark.png"
                  alt="نثيل Natheel"
                  className={`h-10 md:h-12 w-auto object-contain transition-all duration-500 ${
                    !light ? 'brightness-0 invert' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1.5" onMouseLeave={() => setHovered(null)}>
                {navLinks.map((link) => {
                  const isActive = isActivePath(location.pathname, link);
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      className={`relative px-4 py-2.5 text-[14px] font-medium rounded-full transition-colors duration-300 ${
                        light
                          ? isActive
                            ? 'text-primary'
                            : 'text-text-secondary hover:text-primary'
                          : isActive
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {highlightHref === link.href && (
                        <motion.span
                          layoutId="nav-highlight"
                          className={`absolute inset-0 rounded-full ${
                            light ? 'bg-surface-warm' : 'bg-white/12'
                          }`}
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

                {/* Language Switcher Button (Desktop) */}
                <motion.button
                  onClick={toggleLang}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative inline-flex items-center gap-1.5 px-3.5 py-2 mx-1 rounded-full text-xs font-bold tracking-wider transition-all duration-300 border cursor-pointer ${
                    light
                      ? 'border-border-light text-primary hover:border-accent/40 bg-surface-warm/80 hover:bg-white shadow-sm'
                      : 'border-white/20 text-white hover:border-white/40 bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={isAr ? 'Switch website language to English' : 'تحويل لغة الموقع إلى العربية'}
                  title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
                >
                  <Globe className="w-3.5 h-3.5 text-accent group-hover:rotate-45 transition-transform duration-500" />
                  <span className="font-semibold">{isAr ? 'EN' : 'العربية'}</span>
                </motion.button>

                {/* CTA Button */}
                <Magnetic strength={0.3} className="ms-2">
                  <Link
                    to={contactLink.href}
                    className={`group relative inline-flex overflow-hidden px-7 py-2.5 text-[14px] font-semibold rounded-full transition-all duration-400 ${
                      light
                        ? 'bg-primary text-white shadow-[0_10px_30px_-10px_rgba(10,22,40,0.6)]'
                        : 'bg-white text-primary hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)]'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-l from-accent to-accent-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      {contactLink.name}
                    </span>
                  </Link>
                </Magnetic>
              </nav>

              {/* Mobile Right Controls: Language + Menu */}
              <div className="lg:hidden flex items-center gap-2">
                {/* Mobile Language Switcher */}
                <button
                  onClick={toggleLang}
                  type="button"
                  className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all duration-300 cursor-pointer ${
                    light || isMobileMenuOpen
                      ? 'border-border-light bg-surface-warm text-primary hover:border-accent/40'
                      : 'border-white/20 bg-white/10 text-white'
                  }`}
                  aria-label={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
                >
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>{isAr ? 'EN' : 'العربية'}</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-400 ${
                    light || isMobileMenuOpen
                      ? 'text-primary hover:bg-surface-warm'
                      : 'text-white hover:bg-white/10'
                  }`}
                  aria-label={isEn ? 'Menu' : 'القائمة'}
                  aria-expanded={isMobileMenuOpen}
                >
                  <div className="w-5 h-4 flex flex-col justify-between">
                    <motion.span
                      animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                      className={`block h-[1.5px] w-full rounded-full transition-colors ${
                        light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
                      }`}
                    />
                    <motion.span
                      animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                      className={`block h-[1.5px] w-full rounded-full transition-colors ${
                        light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
                      }`}
                    />
                    <motion.span
                      animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                      className={`block h-[1.5px] w-full rounded-full transition-colors ${
                        light || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
                      }`}
                    />
                  </div>
                </button>
              </div>
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
                {[...navLinks, contactLink].map((link, i) => {
                  const isActive = isActivePath(location.pathname, link);
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
                        <span className="text-xs font-latin text-text-muted">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Language Switcher button in menu */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full mt-4"
                >
                  <button
                    onClick={() => {
                      toggleLang();
                      setIsMobileMenuOpen(false);
                    }}
                    type="button"
                    className="w-full flex items-center justify-between py-3.5 px-6 rounded-2xl border border-accent/25 bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5" />
                      <span>{isAr ? 'English Language' : 'اللغة العربية'}</span>
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/70 text-primary font-latin font-bold">
                      {isAr ? 'EN' : 'AR'}
                    </span>
                  </button>
                </motion.div>
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
