import React, { useRef, useState } from 'react';
import {
  Share2,
  Star,
  BarChart3,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── 3-D Tilt Card ─────────────────────────────────────────────────── */
const TiltCard = ({ card, onNavigateTab, index }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateY = ((x / width) - 0.5) * 22;
    const rotateX = (0.5 - (y / height)) * 22;
    setTransform(
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.045,1.045,1.045)`
    );
    setGlowPos({ x: (x / width) * 100, y: (y / height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        transformStyle: 'preserve-3d',
      }}
      className="relative cursor-pointer rounded-2xl overflow-hidden group"
      onClick={() => onNavigateTab(card.tabTarget)}
    >
      {/* Card base */}
      <div
        className="relative rounded-2xl border p-7 h-full flex flex-col items-center justify-center gap-5 text-center min-h-[200px] overflow-hidden"
        style={{
          background: card.bgGradient,
          borderColor: hovered ? card.borderHover : card.borderColor,
          transition: 'border-color 0.3s ease',
          boxShadow: hovered
            ? `0 25px 60px -10px ${card.shadowColor}, 0 0 0 1px ${card.borderHover}`
            : '0 4px 20px -4px rgba(0,0,0,0.08)',
        }}
      >
        {/* Spotlight glow on hover */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 180px at ${glowPos.x}% ${glowPos.y}%, ${card.glowColor} 0%, transparent 70%)`,
              opacity: 0.25,
            }}
          />
        )}

        {/* Animated shimmer line at top */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Icon circle */}
        <motion.div
          animate={hovered ? { y: -6, scale: 1.12 } : { y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
          style={{
            background: card.iconBg,
            boxShadow: hovered ? `0 12px 32px -6px ${card.shadowColor}` : undefined,
          }}
        >
          <Icon className="w-7 h-7" style={{ color: card.accentColor }} strokeWidth={1.8} />
        </motion.div>

        {/* Title only */}
        <div className="relative z-10">
          <h3
            className="font-heading font-black text-base sm:text-lg leading-snug"
            style={{ color: card.titleColor }}
          >
            {card.title}
          </h3>
        </div>

        {/* Badge */}
        <span
          className="text-[11px] px-3 py-1 rounded-full font-bold border"
          style={{
            background: card.badgeBg,
            color: card.badgeColor,
            borderColor: card.badgeBorder,
          }}
        >
          {card.statBadge}
        </span>

        {/* Arrow hint */}
        <motion.div
          animate={hovered ? { x: -4, opacity: 1 } : { x: 0, opacity: 0.5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-xs font-bold mt-1"
          style={{ color: card.accentColor }}
        >
          <span>{card.actionLabel}</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </motion.div>

        {/* Corner decorative orb */}
        <div
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10 pointer-events-none"
          style={{ background: card.accentColor }}
        />
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export const DashboardIntroduction = ({
  onNavigateTab,
  pendingCount = 0,
  postsCount = 0,
  connectedCount = 0,
}) => {
  const featureCards = [
    {
      id: 'opinions',
      title: 'إدارة وتدقيق آراء العملاء',
      statBadge: `${pendingCount} بانتظار المراجعة`,
      actionLabel: 'إدارة الآراء',
      tabTarget: 'opinions',
      icon: Star,
      accentColor: '#D97706',
      bgGradient: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 60%, #fffbeb 100%)',
      iconBg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      borderColor: '#FDE68A',
      borderHover: '#F59E0B',
      shadowColor: 'rgba(245,158,11,0.35)',
      glowColor: '#F59E0B',
      titleColor: '#92400E',
      badgeBg: '#FEF3C7',
      badgeColor: '#B45309',
      badgeBorder: '#FDE68A',
    },
    {
      id: 'social',
      title: 'بث ونشر المحتوى لـ 7 منصات',
      statBadge: `${connectedCount} منصات متصلة`,
      actionLabel: 'نموذج النشر',
      tabTarget: 'social',
      icon: Share2,
      accentColor: '#1D6FD9',
      bgGradient: 'linear-gradient(145deg, #EFF6FF 0%, #DBEAFE 60%, #EFF6FF 100%)',
      iconBg: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
      borderColor: '#BFDBFE',
      borderHover: '#3B82F6',
      shadowColor: 'rgba(29,111,217,0.3)',
      glowColor: '#3B82F6',
      titleColor: '#1E40AF',
      badgeBg: '#DBEAFE',
      badgeColor: '#1D4ED8',
      badgeBorder: '#BFDBFE',
    },
    {
      id: 'statistics',
      title: 'التحليلات والمخططات البيانية',
      statBadge: 'بيانات المنصات المتاحة',
      actionLabel: 'استعراض الإحصائيات',
      tabTarget: 'statistics',
      icon: BarChart3,
      accentColor: '#059669',
      bgGradient: 'linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 60%, #ECFDF5 100%)',
      iconBg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
      borderColor: '#A7F3D0',
      borderHover: '#10B981',
      shadowColor: 'rgba(5,150,105,0.3)',
      glowColor: '#10B981',
      titleColor: '#065F46',
      badgeBg: '#D1FAE5',
      badgeColor: '#047857',
      badgeBorder: '#A7F3D0',
    },
    {
      id: 'security',
      title: 'أمان وثبات الواجهة والبيانات',
      statBadge: `${postsCount} منشورات مسجلة`,
      actionLabel: 'سجل المنشورات',
      tabTarget: 'posts',
      icon: ShieldCheck,
      accentColor: '#7C3AED',
      bgGradient: 'linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 60%, #F5F3FF 100%)',
      iconBg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
      borderColor: '#DDD6FE',
      borderHover: '#8B5CF6',
      shadowColor: 'rgba(124,58,237,0.3)',
      glowColor: '#8B5CF6',
      titleColor: '#4C1D95',
      badgeBg: '#EDE9FE',
      badgeColor: '#6D28D9',
      badgeBorder: '#DDD6FE',
    },
  ];

  return (
    <div className="space-y-6 pt-1 text-right" style={{ perspective: '1200px' }}>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[#BFDBFE] bg-gradient-to-l from-[#EFF6FF] via-white to-[#F0F9FF] p-6 shadow-sm"
      >
        {/* subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#1D6FD9 0,#1D6FD9 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#1D6FD9 0,#1D6FD9 1px,transparent 1px,transparent 40px)',
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D6FD9] animate-pulse" />
              <h2 className="font-heading font-black text-lg sm:text-xl text-[#0F172A]">
                نظرة عامة وتعريفية: ماذا تقدم لوحة تحكم نثيل؟
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed max-w-3xl">
              مرحباً بك في المركز الإداري الشامل والمصمم خصيصاً لإدارة الحضور الرقمي لشركة{' '}
              <span className="font-bold text-[#1D6FD9] mx-1">نثيل للخدمات المعمارية والهندسية</span>.
              تمنحك هذه اللوحة تحكماً مركزياً فائق السلاسة لإدارة التقييمات، نشر المحتوى متعدد المنصات،
              ومتابعة البيانات التي تتيحها واجهات المنصات المتصلة.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#BFDBFE] text-xs font-bold text-[#1D6FD9] self-start md:self-auto flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E8B04A]" />
            <span>منظومة ذكية متكاملة</span>
          </div>
        </div>
      </motion.div>

      {/* ── 4 × 3D Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {featureCards.map((card, index) => (
          <TiltCard
            key={card.id}
            card={card}
            onNavigateTab={onNavigateTab}
            index={index}
          />
        ))}
      </div>

      {/* ── Daily Workflow Steps ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9] mb-4">
          <Sparkles className="w-4 h-4 text-[#1D6FD9]" />
          <h3 className="font-heading font-bold text-sm text-[#0F172A]">
            دليل سير العمل اليومي للوحة التحكم (Daily Workflow Guide)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: 1,
              label: 'المراجعة والاعتماد',
              desc: (
                <>توجه لتبويب <span className="font-bold text-[#1D6FD9]">"آراء وتقييمات العملاء"</span> لمراجعة الآراء الجديدة وقبول التقييمات أو رفضها.</>
              ),
            },
            {
              step: 2,
              label: 'صياغة وبث المنشورات',
              desc: (
                <>انتقل لتبويب <span className="font-bold text-[#1D6FD9]">"التواصل الاجتماعي"</span> واملأ نموذج النشر وحدد المنصات المستهدفة ثم اضغط Post Now.</>
              ),
            },
            {
              step: 3,
              label: 'متابعة الأداء الإحصائي',
              desc: (
                <>تحقق من تبويب <span className="font-bold text-[#1D6FD9]">"الإحصائيات والتحليلات"</span> لمشاهدة آخر بيانات جلبها الخادم من المنصات.</>
              ),
            },
          ].map(({ step, label, desc }) => (
            <div key={step} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-[#1D6FD9] text-white text-xs font-black flex items-center justify-center">
                  {step}
                </span>
                <span className="font-bold text-xs text-[#0F172A]">{label}</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
