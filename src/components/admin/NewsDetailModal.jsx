import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  FileText,
  ImageOff,
  Languages,
  Loader2,
  Newspaper,
  X,
} from 'lucide-react';
import { fetchNewsArticle, formatNewsDate } from '../../api/news';

const LOCALE_LABELS = { ar: 'العربية', en: 'English' };

const NoticeLine = ({ children }) => <p className="text-xs italic text-[#94A3B8]">{children}</p>;

const ContentBlock = ({ block }) => {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level <= 2 ? 'h3' : 'h4';
      return <Tag className="pt-2 font-heading font-bold text-[#0F172A]">{block.text}</Tag>;
    }
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-1 pr-5 text-[#334155]`}>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote className="rounded-l-xl border-r-4 border-[#1D6FD9] bg-[#F8FAFC] px-4 py-3 text-[#334155]">
          {block.text}
        </blockquote>
      );
    case 'image':
      return (
        <img
          src={block.url}
          alt={block.alt || ''}
          loading="lazy"
          className="w-full rounded-xl border border-[#E2E8F0]"
        />
      );
    default:
      return <p className="leading-loose text-[#334155]">{block.text}</p>;
  }
};

export const NewsDetailModal = ({ articleKey, isRead, onToggleRead, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [activeLocale, setActiveLocale] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchNewsArticle(articleKey)
      .then((data) => {
        if (cancelled) return;
        setArticle(data);
        setActiveLocale(data.locale || 'ar');
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'تعذر تحميل تفاصيل الخبر');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleKey]);

  // Every language the Ministry published for this article, original first.
  const versions = useMemo(() => {
    if (!article) return [];
    return [article, ...(article.translations || [])].filter((item) => item?.locale);
  }, [article]);

  const shown = versions.find((item) => item.locale === activeLocale) || article;
  const isTranslation = Boolean(shown && article && shown.locale !== article.locale);
  const date = formatNewsDate(shown?.date, shown?.locale);
  const hasImage = Boolean(shown?.image?.url) && !imageFailed;
  const isRtl = (shown?.locale || 'ar') === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="تفاصيل الخبر"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
          <span className="flex items-center gap-2 text-xs font-bold text-[#1D6FD9]">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">خبر من وزارة السياحة</span>
          </span>

          <div className="flex items-center gap-2">
            {onToggleRead && (
              <button
                type="button"
                onClick={onToggleRead}
                className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC]"
              >
                {isRead ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                )}
                <span className="hidden sm:inline">
                  {isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-[#64748B]">
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ تحميل الخبر...
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-2 p-16 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && shown && (
            <div className="space-y-5 p-4 sm:p-7">
              {article.stale && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>المصدر غير متاح حالياً، وهذه آخر نسخة محفوظة من الخبر.</span>
                </div>
              )}

              {/* Language switcher — only the languages the Ministry actually published */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
                  <Languages className="h-3.5 w-3.5 text-[#1D6FD9]" />
                  اللغة:
                </span>
                {versions.map((version) => (
                  <button
                    key={version.locale}
                    type="button"
                    onClick={() => setActiveLocale(version.locale)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      version.locale === shown.locale
                        ? 'bg-[#1D6FD9] text-white'
                        : 'bg-white text-[#475569] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    {LOCALE_LABELS[version.locale] || version.locale}
                    {version.locale === article.locale ? ' (الأصل)' : ''}
                  </button>
                ))}
                {versions.length < 2 && (
                  <span className="text-[11px] text-[#94A3B8]">
                    لا تتوفر ترجمات أخرى لهذا الخبر في المصدر.
                  </span>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9]">
                {hasImage ? (
                  <img
                    src={shown.image.url}
                    alt={shown.image.alt || shown.title || ''}
                    onError={() => setImageFailed(true)}
                    className="max-h-96 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-[#94A3B8]">
                    <ImageOff className="h-6 w-6" />
                    <span className="text-xs">لا توجد صورة لهذا الخبر</span>
                  </div>
                )}
              </div>

              <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : 'text-left'}>
                <div className="space-y-2">
                  <h2 className="font-heading text-xl font-bold leading-snug text-[#0F172A]">
                    {shown.title || 'العنوان غير متاح'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-[#1D6FD9]" />
                      {date || 'التاريخ غير متوفر'}
                    </span>
                    <span>المصدر: {article.source?.name || 'غير متوفر'}</span>
                    {isTranslation && (
                      <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#1D6FD9]">
                        ترجمة منشورة من المصدر
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-[#F1F5F9] pt-5 text-sm">
                  {shown.content?.length > 0 ? (
                    shown.content.map((block, index) => <ContentBlock key={index} block={block} />)
                  ) : (
                    <NoticeLine>
                      لا يتوفر نص تفصيلي لهذا الخبر في المصدر. يمكن قراءته على الموقع الأصلي.
                    </NoticeLine>
                  )}
                </div>
              </div>

              {shown.file?.url && (
                <a
                  href={shown.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-[#1D6FD9] hover:bg-[#F8FAFC]"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {shown.file.name || 'تحميل الملف المرفق'}
                </a>
              )}
            </div>
          )}
        </div>

        {!loading && !error && shown && (
          <div className="flex flex-col gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="text-[11px] text-[#94A3B8]">
              {article.fetched_at ? `جُلب من المصدر بتاريخ: ${formatNewsDate(article.fetched_at, 'ar')}` : ''}
            </span>
            {shown.url || article.fallback_url ? (
              <a
                href={shown.url || article.fallback_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-xs font-bold text-white hover:bg-[#1859B0]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {shown.url
                  ? 'عرض الخبر الأصلي'
                  : `عرض الخبر الأصلي (${LOCALE_LABELS[article.fallback_locale] || article.fallback_locale})`}
              </a>
            ) : (
              <NoticeLine>رابط الخبر الأصلي غير متوفر في المصدر</NoticeLine>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
