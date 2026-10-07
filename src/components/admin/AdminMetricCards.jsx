import React from 'react';
import { Share2, Star, MessageSquare, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminMetricCards = ({
  pendingCount = 0,
  postsCount = 0,
  publishedCount = 0,
  connectedCount = 0,
}) => {
  const cardVariants = {
    hover: { 
      y: -4, 
      transition: { duration: 0.2, ease: 'easeOut' },
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* Connected providers */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-default transition-colors"
      >
        <div className="text-right">
          <span className="block font-heading font-black text-2xl sm:text-4xl text-[#0F172A] leading-none mb-1">
            {connectedCount}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-[#475569]">منصات متصلة</span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center shadow-md flex-shrink-0">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </motion.div>

      {/* Successfully published posts */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-default transition-colors"
      >
        <div className="text-right">
          <span className="block font-heading font-black text-2xl sm:text-4xl text-[#0F172A] leading-none mb-1">
            {publishedCount}
          </span>
          <div className="text-xs text-[#475569]">
            <span className="font-bold text-[10px] sm:text-[11px] leading-tight block">نشر ناجح أو جزئي</span>
          </div>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F43F5E] text-white flex items-center justify-center shadow-md flex-shrink-0">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
        </div>
      </motion.div>

      {/* Card 3: Active Posts */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-default transition-colors"
      >
        <div className="text-right">
          <span className="block font-heading font-black text-2xl sm:text-4xl text-[#0F172A] leading-none mb-1">
            {postsCount}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-[#475569]">المنشورات المسجلة</span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#14B8A6] text-white flex items-center justify-center shadow-md flex-shrink-0">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </motion.div>

      {/* Card 4: Pending Opinions */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-default transition-colors"
      >
        <div className="text-right">
          <span className="block font-heading font-black text-2xl sm:text-4xl text-[#0F172A] leading-none mb-1">
            {pendingCount}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-[#475569]">آراء بانتظار القرار</span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md flex-shrink-0">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </motion.div>

    </div>
  );
};
