import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  ExternalLink,
  BarChart2,
  Megaphone,
} from 'lucide-react';
import { SocialBrandIcon } from './SocialIconsAdmin';
import { SOCIAL_PLATFORMS } from '../../data/adminMockData';

/* Platform name map */
const platformNames = {
  tiktok:    'تيك توك',
  snapchat:  'سناب شات',
  instagram: 'انستغرام',
  linkedin:  'لينكد إن',
  twitter:   'تويتر (X)',
  pinterest: 'بنترست',
  youtube:   'يوتيوب',
};

const platformColors = {
  tiktok:    '#00F2FE',
  snapchat:  '#FFFC00',
  instagram: '#E1306C',
  linkedin:  '#0A66C2',
  twitter:   '#1DA1F2',
  pinterest: '#BD081C',
  youtube:   '#FF0000',
};

/* ── Stat Pill ────────────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm min-w-[90px]">
    <Icon className="w-4 h-4" style={{ color }} />
    <span className="text-base font-black text-[#0F172A]">{value}</span>
    <span className="text-[10px] text-[#94A3B8] font-medium">{label}</span>
  </div>
);

/* ── Main Modal ───────────────────────────────────────────────────────── */
export const PostDetailModal = ({ post, onClose }) => {
  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!post) return null;

  const postPlatforms = (post.platforms || []).map((pid) => ({
    id: pid,
    name: platformNames[pid] || pid,
    color: platformColors[pid] || '#888',
  }));

  const stats = post.stats || {};

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(10,22,40,0.75)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* ── Modal Panel ── */}
        <motion.div
          key="panel"
          dir="rtl"
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-white"
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── HERO IMAGE ─────────────────────────────────────────── */}
          <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
            {post.mediaUrl ? (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Megaphone className="w-16 h-16 text-slate-600" />
              </div>
            )}

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Status badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>منشور معتمد</span>
            </div>

            {/* Timestamp */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{post.publishedAt}</span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Platform badges row overlapping bottom */}
            <div className="absolute bottom-0 inset-x-0 px-5 pb-3 flex items-center gap-2 flex-wrap">
              {postPlatforms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md"
                  style={{
                    background: `${p.color}22`,
                    border: `1px solid ${p.color}55`,
                    color: '#fff',
                  }}
                >
                  <SocialBrandIcon platform={p.id} size={12} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── BODY ───────────────────────────────────────────────── */}
          <div className="p-6 space-y-5">

            {/* Caption */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="w-4 h-4 text-[#1D6FD9]" />
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">نص المنشور</span>
              </div>
              <p className="text-sm text-[#1E293B] leading-relaxed bg-[#F8FAFC] rounded-2xl p-4 border border-[#F1F5F9]">
                {post.caption}
              </p>
            </div>

            {/* Platforms detailed */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-[#1D6FD9]" />
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  المنصات المُبثّ عليها ({postPlatforms.length})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {postPlatforms.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
                    style={{
                      background: `${p.color}10`,
                      borderColor: `${p.color}40`,
                      color: p.color === '#FFFC00' ? '#92400E' : p.color,
                    }}
                  >
                    <SocialBrandIcon platform={p.id} size={16} />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                إغلاق
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[#1D6FD9] text-white text-xs font-bold hover:bg-[#165AB8] transition-colors flex items-center justify-center gap-2 shadow-sm">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>عرض على المنصة</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
