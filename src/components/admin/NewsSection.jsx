import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  ImageOff,
  Loader2,
  Newspaper,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { fetchNews, fetchNewsCounters, formatNewsDate, setNewsRead } from '../../api/news';
import { NewsFilters } from './NewsFilters';
import { NewsDetailModal } from './NewsDetailModal';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;
// The server re-reads the Ministry when its cached feed ages out, so polling this often is
// enough for a newly published article to appear on its own, without hammering the source.
const POLL_MS = 60_000;
const MARK_ON_OPEN_KEY = 'natheel_news_mark_read_on_open';
const EMPTY_FILTERS = { status: 'all', q: '', dateFrom: '', dateTo: '' };

const hasActiveFilters = (filters) =>
  filters.status !== 'all' ||
  Boolean(filters.q.trim()) ||
  Boolean(filters.dateFrom) ||
  Boolean(filters.dateTo);

const readStoredFlag = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === 'true';
  } catch {
    return fallback;
  }
};

const NewsCard = ({ article, locale, onOpen, onToggleRead, busy }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(article.image?.url) && !imageFailed;
  const date = formatNewsDate(article.date, locale);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        article.is_read ? 'border-[#E2E8F0]' : 'border-[#CBD5E1]'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(article)}
        className="group block w-full text-right"
      >
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-[#F1F5F9]">
          {hasImage ? (
            <img
              src={article.image.thumbnail || article.image.url}
              alt={article.image.alt || article.title || ''}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
              <ImageOff className="h-7 w-7" />
              <span className="text-[11px]">لا توجد صورة لهذا الخبر</span>
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {article.is_new && (
              <span className="flex items-center gap-1 rounded-full bg-[#1D6FD9] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <Sparkles className="h-2.5 w-2.5" />
                جديد
              </span>
            )}
            {!article.is_read && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-sm">
                غير مقروء
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5 pb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
            <CalendarDays className="h-3.5 w-3.5 text-[#1D6FD9]" />
            <span>{date || 'التاريخ غير متوفر'}</span>
          </div>

          <h4
            className={`font-heading text-sm leading-snug text-[#0F172A] line-clamp-2 ${
              article.is_read ? 'font-semibold' : 'font-bold'
            }`}
          >
            {article.title || 'العنوان غير متاح'}
          </h4>

          <p className="text-xs leading-relaxed text-[#475569] line-clamp-3">
            {article.summary || 'لا يتوفر ملخص لهذا الخبر في المصدر.'}
          </p>

          <p className="pt-1 text-[11px] text-[#94A3B8]">
            المصدر: {article.source?.name || 'غير متوفر'}
          </p>
        </div>
      </button>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#F1F5F9] px-4 py-2.5">
        <button
          type="button"
          onClick={() => onToggleRead(article)}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : article.is_read ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          )}
          {article.is_read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
        </button>

        {article.url || article.fallback_url ? (
          <a
            href={article.url || article.fallback_url}
            target="_blank"
            rel="noopener noreferrer"
            title={article.url ? undefined : 'لا تتوفر صفحة عربية لهذا الخبر في المصدر'}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#1D6FD9] hover:bg-[#F8FAFC]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {article.url ? 'المصدر الأصلي' : 'المصدر الأصلي (بالإنجليزية)'}
          </a>
        ) : (
          <span className="px-2 py-1.5 text-[10px] text-[#94A3B8]">لا يوجد رابط أصلي</span>
        )}
      </div>
    </motion.article>
  );
};

const NewsSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
    <div className="h-44 bg-[#F1F5F9]" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
      <div className="h-4 w-4/5 rounded bg-[#E2E8F0]" />
      <div className="h-3 w-full rounded bg-[#F1F5F9]" />
      <div className="h-3 w-2/3 rounded bg-[#F1F5F9]" />
    </div>
  </div>
);

export const NewsSection = ({ onCountsChange }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [matching, setMatching] = useState(0);
  const [counts, setCounts] = useState(null);
  const [meta, setMeta] = useState({ syncedAt: null, stale: false, newDays: null, readStateAvailable: true });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [markOnOpen, setMarkOnOpen] = useState(() => readStoredFlag(MARK_ON_OPEN_KEY, true));
  const [pendingNew, setPendingNew] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const requestRef = useRef(0);
  // Fingerprint of the newest article the view is showing, compared against each poll.
  const feedRef = useRef({ latest_id: null, total: null });

  // Debounce only the text box; the other controls apply immediately.
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(filters.q), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [filters.q]);

  const applyPayload = useCallback(
    (data) => {
      if (data.feed) {
        feedRef.current = { latest_id: data.feed.latest_id, total: data.feed.total };
        setPendingNew(0);
      }
      setMatching(data.matching ?? 0);
      setHasMore(Boolean(data.has_more));
      setCounts(data.counts || null);
      setMeta({
        syncedAt: data.synced_at || null,
        stale: Boolean(data.stale),
        newDays: data.new_days ?? null,
        readStateAvailable: data.read_state_available !== false,
      });
      if (data.counts && onCountsChange) onCountsChange(data.counts);
    },
    [onCountsChange],
  );

  // Read the applied values out of `filters` so this callback does not close over the whole
  // object: typing changes `filters.q` on every keystroke, which would defeat the debounce.
  const { status, dateFrom, dateTo } = filters;

  const load = useCallback(
    ({ refresh = false, silent = false } = {}) => {
      const ticket = ++requestRef.current;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError('');
      fetchNews({ status, dateFrom, dateTo, q: debouncedQuery, page: 1, pageSize: PAGE_SIZE, refresh })
        .then((data) => {
          if (ticket !== requestRef.current) return;
          setArticles(data.items || []);
          setPage(1);
          applyPayload(data);
        })
        .catch((err) => {
          if (ticket !== requestRef.current) return;
          // A failed background refresh must not wipe what is already on screen.
          if (!silent) setArticles([]);
          setError(err.message || 'تعذر تحميل الأخبار');
        })
        .finally(() => {
          if (ticket !== requestRef.current) return;
          setLoading(false);
          setRefreshing(false);
        });
    },
    [status, dateFrom, dateTo, debouncedQuery, applyPayload],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Keep the page current while it sits open: poll the cheap counters endpoint and compare the
  // feed fingerprint. Untouched views refresh themselves; a filtered or paged view is left alone
  // and offered a banner instead, so the admin's place is never yanked away.
  const viewIsUntouched = page === 1 && !hasActiveFilters({ ...filters, q: debouncedQuery });

  useEffect(() => {
    let stopped = false;

    const check = () => {
      if (stopped || document.hidden) return;
      fetchNewsCounters('ar')
        .then((data) => {
          if (stopped || !data.feed) return;
          if (data.counts) {
            setCounts(data.counts);
            if (onCountsChange) onCountsChange(data.counts);
          }
          const known = feedRef.current;
          const changed =
            known.latest_id !== null &&
            (data.feed.latest_id !== known.latest_id || data.feed.total !== known.total);
          if (!changed) return;
          if (viewIsUntouched) load({ silent: true });
          else setPendingNew(Math.max(1, (data.feed.total || 0) - (known.total || 0)));
        })
        .catch(() => {});
    };

    const timer = window.setInterval(check, POLL_MS);
    // Coming back to a tab left open for hours should not show yesterday's feed.
    document.addEventListener('visibilitychange', check);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [viewIsUntouched, load, onCountsChange]);

  const loadMore = () => {
    const next = page + 1;
    setLoadingMore(true);
    fetchNews({ status, dateFrom, dateTo, q: debouncedQuery, page: next, pageSize: PAGE_SIZE })
      .then((data) => {
        setArticles((current) => {
          const seen = new Set(current.map((item) => item.id));
          return [...current, ...(data.items || []).filter((item) => !seen.has(item.id))];
        });
        setPage(next);
        applyPayload(data);
      })
      .catch((err) => setError(err.message || 'تعذر تحميل المزيد من الأخبار'))
      .finally(() => setLoadingMore(false));
  };

  const refreshCounts = () => {
    fetchNewsCounters('ar')
      .then((data) => {
        if (data.counts) {
          setCounts(data.counts);
          if (onCountsChange) onCountsChange(data.counts);
        }
      })
      .catch(() => {});
  };

  const applyReadState = (id, isRead) => {
    setArticles((current) =>
      current.map((item) => (item.id === id ? { ...item, is_read: isRead } : item)),
    );
    // A filtered view may no longer match this article; counts come from the server.
    refreshCounts();
  };

  const toggleRead = (article) => {
    const next = !article.is_read;
    setBusyId(article.id);
    setNewsRead(article.id, next)
      .then((data) => applyReadState(article.id, data.is_read))
      .catch((err) => setError(err.message || 'تعذر تحديث حالة القراءة'))
      .finally(() => setBusyId(null));
  };

  const openArticle = (article) => {
    setSelected(article);
    if (markOnOpen && !article.is_read) {
      setNewsRead(article.id, true)
        .then((data) => applyReadState(article.id, data.is_read))
        .catch(() => {});
    }
  };

  const changeMarkOnOpen = (value) => {
    setMarkOnOpen(value);
    try {
      localStorage.setItem(MARK_ON_OPEN_KEY, String(value));
    } catch {
      /* a blocked storage only loses the preference, not the feature */
    }
  };

  const filtered = hasActiveFilters({ ...filters, q: debouncedQuery });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-[#0F172A]">
            <Newspaper className="h-5 w-5 text-[#1D6FD9]" />
            <span>أخبار وزارة السياحة</span>
            {counts?.new_unread > 0 && (
              <span className="rounded-full bg-[#1D6FD9] px-2 py-0.5 text-[11px] font-bold text-white">
                {counts.new_unread} جديد
              </span>
            )}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
            المصدر: موقع وزارة السياحة السعودية (mt.gov.sa)
            {counts ? ` · ${counts.total} خبر · ${counts.unread} غير مقروء · ${counts.read} مقروء` : ''}
          </p>
          {meta.syncedAt && (
            <p className="mt-0.5 text-[10px] text-[#94A3B8]">
              آخر مزامنة مع المصدر: {formatNewsDate(meta.syncedAt, 'ar')}
              {meta.newDays ? ` · يُعتبر الخبر جديداً خلال ${meta.newDays} يوماً` : ''}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-[#475569]">
            <input
              type="checkbox"
              checked={markOnOpen}
              onChange={(event) => changeMarkOnOpen(event.target.checked)}
              className="h-3.5 w-3.5 accent-[#1D6FD9]"
            />
            تحديد كمقروء عند الفتح
          </label>
          <button
            type="button"
            onClick={() => load({ refresh: true })}
            disabled={refreshing || loading}
            title="يفحص موقع الوزارة الآن بدلاً من استخدام النسخة المحفوظة"
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[11px] font-bold text-[#1D6FD9] hover:bg-[#F8FAFC] disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'جارٍ الفحص...' : 'تحديث الآن'}
          </button>
        </div>
      </div>

      <NewsFilters
        filters={filters}
        counts={counts}
        active={hasActiveFilters(filters)}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        open={filtersOpen}
        onToggleOpen={() => setFiltersOpen((value) => !value)}
      />

      {pendingNew > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 text-xs text-[#1E40AF]"
        >
          <span className="flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            نُشر {pendingNew} خبر جديد في موقع الوزارة.
          </span>
          <button
            type="button"
            onClick={() => load()}
            className="rounded-lg bg-[#1D6FD9] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#1859B0]"
          >
            عرض الأخبار الجديدة
          </button>
        </motion.div>
      )}

      {meta.stale && !loading && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>المصدر غير متاح حالياً، وتُعرض آخر نسخة محفوظة من الأخبار.</span>
        </div>
      )}

      {!meta.readStateAvailable && !loading && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>تعذر الوصول إلى حالة القراءة المحفوظة، لذلك قد تكون أعداد المقروء وغير المقروء غير دقيقة.</span>
        </div>
      )}

      {!loading && !error && (
        <p className="text-[11px] text-[#64748B]">
          {matching} خبر مطابق{filtered ? ' للمعايير المحددة' : ''}
        </p>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="جارٍ تحميل الأخبار">
          {Array.from({ length: 6 }).map((_, index) => (
            <NewsSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-xs font-bold text-white hover:bg-[#1859B0]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
          <Newspaper className="h-7 w-7 text-[#94A3B8]" />
          <p className="text-sm text-[#475569]">
            {filtered ? 'لا توجد أخبار مطابقة للمعايير المحددة.' : 'لا توجد أخبار متاحة حالياً في المصدر.'}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-1 rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-[#1D6FD9] hover:bg-[#F8FAFC]"
            >
              إعادة تعيين التصفية
            </button>
          )}
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                locale="ar"
                onOpen={openArticle}
                onToggleRead={toggleRead}
                busy={busyId === article.id}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-xs font-bold text-[#1D6FD9] shadow-sm hover:bg-[#F8FAFC] disabled:opacity-60"
              >
                {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loadingMore ? 'جارٍ التحميل...' : 'تحميل المزيد'}
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <NewsDetailModal
            articleKey={selected.id}
            isRead={articles.find((item) => item.id === selected.id)?.is_read ?? selected.is_read}
            onToggleRead={() => toggleRead(articles.find((item) => item.id === selected.id) || selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
