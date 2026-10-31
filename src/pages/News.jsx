import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CalendarDays, ExternalLink, ImageOff, Loader2, Newspaper, X } from 'lucide-react';
import {
  fetchPublicMinistryNews,
  fetchPublicPost,
  fetchPublicPosts,
  formatPostDate,
  postImageUrl,
} from '../api/newsPosts';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/fx/PageHero';

const PAGE_SIZE = 9;
// Temporary switch: set to true to display Ministry of Tourism news alongside Natheel blog
const SHOW_MINISTRY_NEWS = false;

const COPY = {
  ar: {
    title: 'مستجدات نثيل',
    lead: SHOW_MINISTRY_NEWS
      ? 'مستجدات نثيل وأحدث ما ينشره المركز الإعلامي لوزارة السياحة.'
      : 'مستجدات ومقالات نثيل وكل جديد عن مشاريعنا.',
    all: 'الكل',
    natheel: 'مستجدات نثيل',
    ministry: 'وزارة السياحة',
    more: 'تحميل المزيد',
    loading: 'جارٍ التحميل...',
    empty: 'لا توجد مستجدات لعرضها حالياً.',
    error: 'تعذر تحميل المستجدات. حاول مرة أخرى لاحقاً.',
    retry: 'إعادة المحاولة',
    ministryDown: 'أخبار وزارة السياحة غير متاحة حالياً. تظهر مستجدات نثيل فقط.',
    read: 'اقرأ المزيد',
    source: 'المصدر',
    original: 'عرض المصدر الأصلي',
    close: 'إغلاق',
    noDate: 'بدون تاريخ',
    noImage: 'لا توجد صورة',
  },
  en: {
    title: 'Natheel Updates',
    lead: SHOW_MINISTRY_NEWS
      ? "Natheel's updates, alongside the latest from the Ministry of Tourism newsroom."
      : "Natheel's updates, articles, and latest project developments.",
    all: 'All',
    natheel: 'Natheel Updates',
    ministry: 'Ministry of Tourism',
    more: 'Load more',
    loading: 'Loading…',
    empty: 'There are no updates to show yet.',
    error: 'Could not load updates. Please try again later.',
    retry: 'Try again',
    ministryDown: 'Ministry of Tourism news is unavailable right now. Showing Natheel news only.',
    read: 'Read article',
    source: 'Source',
    original: 'View original article',
    close: 'Close',
    noDate: 'No date',
    noImage: 'No image',
  },
};

const sortByDate = (a, b) => {
  const left = new Date(a.published_at || a.date || 0).getTime() || 0;
  const right = new Date(b.published_at || b.date || 0).getTime() || 0;
  return right - left;
};

const cardImage = (item) =>
  item.origin === 'natheel' ? postImageUrl(item) : item.image?.thumbnail || item.image?.url || null;

const NewsCard = ({ item, copy, locale, onOpen }) => {
  const [failed, setFailed] = useState(false);
  const image = cardImage(item);
  const showImage = Boolean(image) && !failed;
  const isOwn = item.origin === 'natheel';
  const date = formatPostDate(item.published_at || item.date, locale);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-slate-100">
        {showImage ? (
          <img
            src={image}
            alt={item.title || ''}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImageOff className="h-7 w-7" />
            <span className="text-[11px]">{copy.noImage}</span>
          </div>
        )}
        <span
          className={`absolute top-3 ${isOwn ? 'bg-[#0B3B46]' : 'bg-[#2E8B9C]'} rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-sm`}
          style={{ insetInlineStart: '0.75rem' }}
        >
          {isOwn ? copy.natheel : copy.ministry}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <CalendarDays className="h-3.5 w-3.5 text-[#2E8B9C]" />
          <span>{date || copy.noDate}</span>
        </div>

        <h3 className="font-heading text-base font-bold leading-snug text-slate-900 line-clamp-2">
          {item.title || '—'}
        </h3>

        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
          {item.summary || ''}
        </p>

        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-auto w-fit pt-2 text-xs font-bold text-[#2E8B9C] hover:underline"
        >
          {copy.read} →
        </button>
      </div>
    </motion.article>
  );
};

const Paragraphs = ({ text }) =>
  String(text || '')
    .split(/\n{2,}/)
    .map((block, index) => (
      <p key={index} className="leading-loose text-slate-700">
        {block.split('\n').map((line, i, all) => (
          <React.Fragment key={i}>
            {line}
            {i < all.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));

const Detail = ({ item, copy, locale, onClose }) => {
  const [full, setFull] = useState(item.origin === 'natheel' ? null : item);
  const [loading, setLoading] = useState(item.origin === 'natheel');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const handler = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (item.origin !== 'natheel') return;
    let cancelled = false;
    fetchPublicPost(item.id)
      .then((data) => !cancelled && setFull(data))
      .catch(() => !cancelled && setFull(item))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [item]);

  const shown = full || item;
  const image = cardImage(shown);
  const date = formatPostDate(shown.published_at || shown.date, locale);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <span className="text-xs font-bold text-[#2E8B9C]">
            {shown.origin === 'natheel' ? copy.natheel : copy.ministry}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.loading}
            </div>
          ) : (
            <div className="space-y-5 p-5 sm:p-7">
              {image && !failed && (
                <img
                  src={image}
                  alt={shown.title || ''}
                  onError={() => setFailed(true)}
                  className="max-h-96 w-full rounded-2xl border border-slate-200 object-cover"
                />
              )}

              <div className="space-y-2">
                <h2 className="font-heading text-xl font-bold leading-snug text-slate-900">
                  {shown.title || '—'}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-[#2E8B9C]" />
                    {date || copy.noDate}
                  </span>
                  <span>
                    {copy.source}: {shown.source?.name || '—'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-sm">
                {shown.origin === 'natheel' ? (
                  <Paragraphs text={shown.body || shown.summary} />
                ) : shown.summary ? (
                  <p className="leading-loose text-slate-700">{shown.summary}</p>
                ) : null}
              </div>

              {shown.origin !== 'natheel' && (shown.url || shown.fallback_url) && (
                <a
                  href={shown.url || shown.fallback_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2E8B9C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#247383]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {copy.original}
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const News = () => {
  const { isEn, dir } = useLanguage();
  const locale = isEn ? 'en' : 'ar';
  const copy = COPY[locale];

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ministryDown, setMinistryDown] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const requests = [fetchPublicPosts({ limit: 50 })];
    if (SHOW_MINISTRY_NEWS) {
      requests.push(fetchPublicMinistryNews({ limit: 50, locale }));
    }
    Promise.allSettled(requests)
      .then(([own, ministry]) => {
        const ownItems = own.status === 'fulfilled' ? own.value.items || [] : [];
        const ministryItems =
          SHOW_MINISTRY_NEWS && ministry?.status === 'fulfilled' && !ministry.value.unavailable
            ? ministry.value.items || []
            : [];
        setMinistryDown(
          SHOW_MINISTRY_NEWS && (ministry?.status !== 'fulfilled' || Boolean(ministry?.value?.unavailable))
        );
        if (own.status === 'rejected' && ministryItems.length === 0) {
          setError(copy.error);
        }
        setItems([...ownItems, ...ministryItems].sort(sortByDate));
      })
      .finally(() => setLoading(false));
  }, [locale, copy.error]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filter]);

  const filtered = items.filter((item) => filter === 'all' || item.origin === filter);
  const page = filtered.slice(0, visible);

  const tabs = SHOW_MINISTRY_NEWS
    ? [
        { id: 'all', label: copy.all },
        { id: 'natheel', label: copy.natheel },
        { id: 'ministry', label: copy.ministry },
      ]
    : [];

  return (
    <div dir={dir} className="bg-white">
      <PageHero
        eyebrow={isEn ? 'Latest Insights & Updates' : 'آخر المستجدات والرؤى'}
        title={copy.title}
        subtitle={copy.lead}
        eyebrowClassName="inline-flex items-center gap-3 text-base md:text-lg font-semibold tracking-[0.2em] text-accent-light"
        subtitleClassName="text-xl md:text-2xl text-white/70 mt-6 max-w-2xl leading-relaxed font-medium"
        variant={2}
        useEnvatoWave={true}
        hideEyebrowLine={true}
        dir={dir}
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {SHOW_MINISTRY_NEWS && tabs.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={filter === tab.id}
                className={`rounded-full border px-5 py-2 text-xs font-bold transition-colors ${
                  filter === tab.id
                    ? 'border-[#0B3B46] bg-[#0B3B46] text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {SHOW_MINISTRY_NEWS && ministryDown && !loading && (
          <div className="mx-auto mb-6 flex max-w-2xl items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{copy.ministryDown}</span>
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200">
                <div className="h-48 bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-10 text-center">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={load}
              className="rounded-xl bg-[#0B3B46] px-5 py-2.5 text-xs font-bold text-white"
            >
              {copy.retry}
            </button>
          </div>
        )}

        {!loading && !error && page.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-14 text-center">
            <Newspaper className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">{copy.empty}</p>
          </div>
        )}

        {!loading && page.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.map((item) => (
                <NewsCard
                  key={`${item.origin}-${item.id}`}
                  item={item}
                  copy={copy}
                  locale={locale}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {visible < filtered.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                  className="rounded-full border border-[#0B3B46] px-7 py-3 text-xs font-bold text-[#0B3B46] transition-colors hover:bg-[#0B3B46] hover:text-white"
                >
                  {copy.more}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <Detail
            item={selected}
            copy={copy}
            locale={locale}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
