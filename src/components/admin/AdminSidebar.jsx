import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Megaphone, 
  Star, 
  Share2, 
  BarChart3, 
  ShieldCheck, 
  X 
} from 'lucide-react';

const SidebarInner = ({ activeTab, onSelectTab, onCloseMobile, pendingCount = 0 }) => {
  const navItems = [
    { id: 'overview', label: 'الرئيسية', icon: Home },
    { id: 'opinions', label: 'آراء وتقييمات العملاء', icon: Star, badge: pendingCount > 0 ? `${pendingCount} معلق` : null },
    { id: 'social', label: 'التواصل الاجتماعي', icon: Share2 },
    { id: 'posts', label: 'سجل المنشورات', icon: Megaphone },
    { id: 'statistics', label: 'الإحصائيات والتحليلات', icon: BarChart3 },
  ];

  return (
  <div className="h-full flex flex-col justify-between py-6 px-4">
    <div>
      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-white/15 relative">
        {/* Close button on mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden absolute left-0 top-0 p-1.5 rounded-lg bg-white/10 text-white/65 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="mb-3 flex h-14 w-full items-center justify-center rounded-md bg-white px-3">
          <img src="/logo-black-wordmark.png" alt="نثيل Natheel" className="h-12 w-auto max-w-full object-contain" />
        </div>
        <p className="text-[12px] font-bold text-white/90">إدارة للخدمات المعمارية والهندسية</p>
        <p className="text-[11px] text-white/55 mt-0.5">لوحة الإدارة والتحكم</p>
      </div>

      {/* Navigation Links with Framer Motion layout transition */}
      <nav className="mt-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer relative ${
                isActive
                  ? 'bg-[#2E8B9C] text-white shadow-sm font-bold'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </div>
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/55'}`} />
            </motion.button>
          );
        })}
      </nav>
    </div>

    {/* Footer / Badge at bottom of sidebar */}
    <div className="pt-6 border-t border-white/15 flex items-center gap-3 px-2">
      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#83D8E5] flex-shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="text-right">
        <p className="text-[11px] font-bold text-white/85 font-mono leading-tight">NATHEEL ADMIN SUITE v2.4</p>
        <p className="text-[10px] text-white/50 font-mono uppercase tracking-tight">SECURE INTERFACE • LOCAL PERSISTENCE</p>
      </div>
    </div>
  </div>
  );
};

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  mobileOpen = false, 
  setMobileOpen = () => {},
  pendingCount = 0,
}) => {
  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0B3B46] border-l border-white/10 min-h-screen flex-col justify-between shadow-[2px_0_18px_rgba(0,0,0,0.16)] flex-shrink-0 z-20">
        <SidebarInner 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab}
          pendingCount={pendingCount}
        />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-in Drawer from Right (RTL) */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative mr-0 ml-auto w-72 max-w-[85vw] bg-[#0B3B46] h-full shadow-2xl z-10 flex flex-col border-l border-white/10"
            >
              <SidebarInner 
                activeTab={activeTab} 
                onSelectTab={handleSelectTab} 
                onCloseMobile={() => setMobileOpen(false)}
                pendingCount={pendingCount}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
