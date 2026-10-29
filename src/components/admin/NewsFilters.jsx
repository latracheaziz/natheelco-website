import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarRange, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'كل الأخبار', countKey: 'total' },
  { id: 'new', label: 'الأخبار الجديدة', countKey: 'new' },
  { id: 'unread', label: 'غير المقروءة', countKey: 'unread' },
  { id: 'read', label: 'المقروءة', countKey: 'read' },
];

export const NewsFilters = ({ filters, counts, active, onChange, onReset, open, onToggleOpen }) => {
  const set = (patch) => onChange({ ...filters, ...patch });

  const panel = (
    <div className="space-y-3">
      {/* Status tabs — horizontally scrollable on narrow screens */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.id;
          const count = counts?.[tab.countKey];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => set({ status: tab.id })}
              aria-pressed={isActive}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                isActive
                  ? 'border-[#1D6FD9] bg-[#1D6FD9] text-white'
                  : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>{tab.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + date range */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            value={filters.q}
            onChange={(event) => set({ q: event.target.value })}
            placeholder="ابحث في العناوين والمحتوى..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pr-10 pl-3 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1D6FD9] focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#475569]">
          <CalendarRange className="h-3.5 w-3.5 flex-shrink-0 text-[#1D6FD9]" />
          <span className="flex-shrink-0 text-[11px]">من</span>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(event) => set({ dateFrom: event.target.value })}
            className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#475569]">
          <span className="flex-shrink-0 text-[11px]">إلى</span>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(event) => set({ dateTo: event.target.value })}
            className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={onReset}
          disabled={!active}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          إعادة تعيين
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="mb-2 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#0F172A] sm:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#1D6FD9]" />
          التصفية والبحث
          {active && <span className="rounded-full bg-[#1D6FD9] px-2 py-0.5 text-[10px] text-white">مُطبّقة</span>}
        </span>
        {open ? <X className="h-4 w-4 text-[#64748B]" /> : null}
      </button>

      <div className="hidden sm:block">{panel}</div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:hidden"
          >
            {panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
