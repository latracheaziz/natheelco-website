import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminTopBar = ({ onToggleMobile = () => {} }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
    >
      {/* Right side: Hamburger (Mobile) + Admin profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm flex-shrink-0">
          NA
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-[#0F172A] leading-tight">إدارة نثيل</p>
          <p className="text-[10px] sm:text-[11px] text-[#64748B] leading-tight">مدير النظام</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block mr-0.5" />
      </div>

      {/* Left side: External Link + Time + Server Status */}
      <div className="flex items-center gap-2.5 sm:gap-5">
        {/* Main Website Link Button */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D6FD9] border border-[#BFDBFE] text-xs font-bold transition-all group"
        >
          <span className="hidden xs:inline">الموقع الرئيسي</span>
          <span className="xs:hidden text-[11px]">الموقع</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#1D6FD9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Real-time Clock */}
        <div className="text-xs font-mono font-medium text-[#475569] hidden md:block">
          {time}
        </div>

        {/* Status Pill with Green Dot */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#475569] whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
          <span className="hidden sm:inline">الخادم نشط</span>
        </div>
      </div>
    </motion.div>
  );
};
