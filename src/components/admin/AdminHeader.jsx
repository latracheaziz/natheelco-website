import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Share2, 
  MessageSquare, 
  ExternalLink, 
  Bell, 
  LayoutDashboard,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminHeader = ({ activeTab, setActiveTab, pendingReviewsCount = 0 }) => {
  const [time, setTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'all', label: 'نظرة شاملة', icon: LayoutDashboard },
    { id: 'statistics', label: 'الإحصائيات والتحليلات', icon: BarChart3, badge: 'مباشر' },
    { id: 'social', label: 'منشورات التواصل الاجتماعي', icon: Share2, badge: '7 منصات' },
    { id: 'opinions', label: 'آراء ومراجعات العملاء', icon: MessageSquare, badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} معلق` : null, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060E1A]/90 backdrop-blur-xl border-b border-[#1E3456]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top Banner Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#2E8B9C] via-[#5FD4E6] to-[#E8B04A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <Link 
              to="/adminnatheelcoir" 
              className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#132240] to-[#0A1628] border border-[#2E8B9C]/40 shadow-[0_0_15px_rgba(46,139,156,0.3)] group-hover:border-[#5FD4E6]/60 transition-colors">
                <img 
                  src="/logo.png" 
                  alt="Natheel" 
                  className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(95,212,230,0.5)]"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-accent font-bold text-lg font-heading">N</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xl text-white tracking-wide">
                    نـثـيـل
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#2E8B9C]/20 border border-[#2E8B9C]/40 text-[#5FD4E6] font-mono font-semibold">
                    ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans tracking-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  منظومة الإدارة والتحكم الذكي
                </p>
              </div>
            </Link>

            {/* System Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#132240]/60 border border-[#1E3456] text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>الخادم نشط</span>
              <span className="text-slate-500">|</span>
              <Clock className="w-3.5 h-3.5 text-[#5FD4E6]" />
              <span className="font-mono text-slate-300 tracking-wider text-[11px]">{time}</span>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            
            {/* View Live Website Button */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#132240] hover:bg-[#1B3A5C] text-slate-200 text-xs font-medium border border-[#1E3456] hover:border-[#2E8B9C]/50 transition-all duration-200 shadow-sm group"
            >
              <span>الموقع الرئيسي</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#5FD4E6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-[#132240]/80 hover:bg-[#1B3A5C] border border-[#1E3456] text-slate-300 hover:text-white transition-colors"
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black ring-2 ring-[#060E1A] animate-pulse">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div 
                  className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#0A1628] border border-[#1E3456] shadow-2xl p-4 text-right z-50 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E3456]/80">
                    <span className="font-bold text-sm text-white">مركز الإشعارات</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2E8B9C]/20 text-[#5FD4E6] text-[10px]">
                      {pendingReviewsCount} تنبيه جديد
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-[#132240]/60 border border-[#1E3456]/50">
                      <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>تقييمات جديدة بانتظار الاعتماد</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        يوجد {pendingReviewsCount} آراء عملاء جديدة تحتاج إلى مراجعة للظهور في واجهة الموقع.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#132240]/60 border border-[#1E3456]/50">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مزامنة منصات التواصل</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        تم ربط قنوات تيك توك، انستغرام، سناب شات، تويتر، لينكد إن، يوتيوب وبنترست بنجاح.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Profile Capsule */}
            <div className="flex items-center gap-2.5 pl-1 pr-2.5 py-1.5 rounded-xl bg-[#132240]/90 border border-[#1E3456]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2E8B9C] to-[#E8B04A] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                NA
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">إدارة نثيل</p>
                <p className="text-[10px] text-[#5FD4E6] leading-tight">مدير النظام</p>
              </div>
            </div>

          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-[#1E3456]/40 scrollbar-none">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2E8B9C] to-[#1B3A5C] text-white shadow-[0_0_20px_rgba(46,139,156,0.35)] border border-[#5FD4E6]/50'
                    : 'bg-[#0A1628]/60 text-slate-400 hover:text-slate-200 hover:bg-[#132240]/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#5FD4E6]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      tab.badgeColor || (isActive ? 'bg-white/20 text-white border-white/30' : 'bg-[#1E3456] text-slate-300 border-[#2E8B9C]/30')
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
