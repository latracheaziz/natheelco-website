import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopBar } from '../components/admin/AdminTopBar';
import { AdminBanner } from '../components/admin/AdminBanner';
import { AdminMetricCards } from '../components/admin/AdminMetricCards';
import { DashboardIntroduction } from '../components/admin/DashboardIntroduction';
import { ClientOpinionSection } from '../components/admin/ClientOpinionSection';
import { SocialMediaSection } from '../components/admin/SocialMediaSection';
import { StatisticsSection } from '../components/admin/StatisticsSection';
import { PostDetailModal } from '../components/admin/PostDetailModal';
import { 
  INITIAL_POSTS, 
  INITIAL_OPINIONS 
} from '../data/adminMockData';
import { 
  Megaphone, 
  Clock 
} from 'lucide-react';

const STORAGE_KEYS = {
  POSTS: 'natheel_admin_posts_v6',
  OPINIONS: 'natheel_admin_opinions_v6',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'opinions' | 'social' | 'posts' | 'statistics'
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Initialize Opinions
  const [opinions, setOpinions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPINIONS);
      return saved ? JSON.parse(saved) : INITIAL_OPINIONS;
    } catch {
      return INITIAL_OPINIONS;
    }
  });

  // Initialize Posts
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OPINIONS, JSON.stringify(opinions));
    } catch (e) {
      console.error(e);
    }
  }, [opinions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  // Handle Opinion Actions: Accept, Decline
  const handleAcceptOpinion = (id) => {
    setOpinions((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: 'accepted' } : op))
    );
  };

  const handleDeclineOpinion = (id) => {
    setOpinions((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: 'declined' } : op))
    );
  };

  const handleAddOpinion = (newOpinion) => {
    setOpinions((prev) => [newOpinion, ...prev]);
  };

  // Handle Social Media Post Actions
  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const pendingCount = opinions.filter((o) => o.status === 'pending').length;

  return (
    <div 
      dir="rtl" 
      className="min-h-screen bg-[#F0F4F9] text-[#0F172A] font-sans flex flex-row selection:bg-[#1D6FD9]/20 selection:text-[#1D6FD9]"
    >
      {/* ─── 1. RIGHT SIDEBAR (Desktop & Mobile Drawer) ─── */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ─── 2. MAIN CONTENT AREA (Left side in RTL) ─── */}
      <div className="flex-1 min-w-0 p-3 sm:p-5 lg:p-7 space-y-4 sm:space-y-5 overflow-y-auto max-w-full">
        
        {/* Top Header Card */}
        <AdminTopBar onToggleMobile={() => setMobileOpen(true)} />

        {/* Welcome Banner */}
        <AdminBanner />

        {/* 4 Metric Cards Row */}
        <AdminMetricCards 
          pendingCount={pendingCount} 
          postsCount={posts.length} 
        />

        {/* ─── TAB CONTENT (With Framer Motion Transitions) ─── */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: الرئيسية (Overview) - DEDICATED INTRODUCTION & WHAT DASHBOARD OFFERS */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardIntroduction 
                onNavigateTab={(tabId) => setActiveTab(tabId)}
                pendingCount={pendingCount}
                postsCount={posts.length}
              />
            </motion.div>
          )}

          {/* TAB 2: آراء وتقييمات العملاء (Client Opinions Section with 7 Reviews & Filters) */}
          {activeTab === 'opinions' && (
            <motion.div
              key="opinions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ClientOpinionSection 
                opinions={opinions}
                onAcceptOpinion={handleAcceptOpinion}
                onDeclineOpinion={handleDeclineOpinion}
                onAddOpinion={handleAddOpinion}
              />
            </motion.div>
          )}

          {/* TAB 3: التواصل الاجتماعي (Social Media Publisher Formulaire) */}
          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SocialMediaSection 
                posts={posts} 
                onAddPost={handleAddPost} 
                onDeletePost={handleDeletePost} 
              />
            </motion.div>
          )}

          {/* TAB 4: سجل المنشورات (Recent Published Posts Feed) */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-heading font-bold text-lg text-[#0F172A] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#1D6FD9]" />
                  <span>سجل المنشورات الحديثة المنشورة</span>
                </h3>
                <button
                  onClick={() => setActiveTab('social')}
                  className="px-3 py-1.5 rounded-xl bg-[#1D6FD9] text-white text-xs font-bold"
                >
                  + منشور جديد
                </button>
              </div>

              {/* Clickable post cards — opens PostDetailModal */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 group"
                  >
                    {post.mediaUrl && (
                      <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                        <img
                          src={post.mediaUrl}
                          alt="Post"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-white flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-[#38BDF8]" />
                          <span>{post.publishedAt}</span>
                        </div>
                        {/* Hover overlay hint */}
                        <div className="absolute inset-0 bg-[#1D6FD9]/0 group-hover:bg-[#1D6FD9]/10 flex items-center justify-center transition-all duration-200">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-[#1D6FD9] px-3 py-1.5 rounded-full shadow">
                            عرض التفاصيل
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-[#334155] leading-relaxed mb-3 line-clamp-3">
                        {post.caption}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>مشاهدات: {post.stats?.views || '1.2K'}</span>
                        <span className="text-[#1D6FD9] font-bold">منشور معتمد ←</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: الإحصائيات والتحليلات البيانية (The 2 Charts) */}
          {activeTab === 'statistics' && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StatisticsSection opinions={opinions} posts={posts} />
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ── Post Detail Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
