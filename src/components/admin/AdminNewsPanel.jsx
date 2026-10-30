import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, PenSquare } from 'lucide-react';
import { NewsSection } from './NewsSection';
import { NatheelNewsManager } from './NatheelNewsManager';

const VIEWS = [
  { id: 'ministry', label: 'أخبار وزارة السياحة', icon: Landmark },
  { id: 'natheel', label: 'أخبار نثيل', icon: PenSquare },
];

/** Holds the two halves of the News tab: the Ministry feed (read-only) and Natheel's own
 *  posts (full editing). Kept as a wrapper so neither section had to change. */
export const AdminNewsPanel = ({ onCountsChange }) => {
  const [view, setView] = useState('ministry');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5">
        {VIEWS.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-pressed={active}
              className={`flex flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                active
                  ? 'bg-white text-[#1D6FD9] shadow-sm'
                  : 'text-[#64748B] hover:bg-white/60 hover:text-[#334155]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'ministry' ? (
            <NewsSection onCountsChange={onCountsChange} />
          ) : (
            <NatheelNewsManager />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
