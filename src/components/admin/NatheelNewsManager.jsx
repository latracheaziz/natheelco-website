import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileEdit,
  ImageOff,
  Loader2,
  Pencil,
  PenSquare,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  deletePost,
  fetchOwnPosts,
  formatPostDate,
  postImageUrl,
  updatePost,
} from '../../api/newsPosts';
import { NewsPostForm } from './NewsPostForm';

const PAGE_SIZE = 12;

const FILTERS = [
  { id: '', label: 'الكل' },
  { id: 'published', label: 'المنشورة' },
  { id: 'draft', label: 'المسودات' },
];

const StatusBadge = ({ status }) =>
  status === 'published' ? (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
      <CheckCircle2 className="h-2.5 w-2.5" />
      منشور
    </span>
  ) : (
    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
      <FileEdit className="h-2.5 w-2.5" />
      مسودة
    </span>
  );

const PostCard = ({ post, onEdit, onDelete, onToggleStatus, busy }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = postImageUrl(post);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
    >
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-[#F1F5F9]">
        {showImage ? (
          <img
            src={image}
            alt={post.title || ''}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-[#94A3B8]">
            <ImageOff className="h-6 w-6" />
            <span className="text-[11px]">بدون صورة</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={post.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
          <CalendarDays className="h-3.5 w-3.5 text-[#1D6FD9]" />
          <span>{formatPostDate(post.published_at || post.created_at) || 'بدون تاريخ'}</span>
        </div>

        <h4 className="font-heading text-sm font-bold leading-snug text-[#0F172A] line-clamp-2">
          {post.title}
        </h4>

        {post.summary && (
          <p className="text-xs leading-relaxed text-[#475569] line-clamp-2">{post.summary}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#F1F5F9] px-3 py-2.5">
        <button
          type="button"
          onClick={() => onToggleStatus(post)}
          disabled={busy}
          className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : post.status === 'published' ? (
            'إرجاع إلى مسودة'
          ) : (
            'نشر الآن'
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(post)}
            aria-label="تعديل"
            title="تعديل"
            className="rounded-lg p-2 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1D6FD9]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(post)}
            aria-label="حذف"
            title="حذف"
            className="rounded-lg p-2 text-[#64748B] hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const CardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
    <div className="h-40 bg-[#F1F5F9]" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
      <div className="h-4 w-4/5 rounded bg-[#E2E8F0]" />
      <div className="h-3 w-full rounded bg-[#F1F5F9]" />
    </div>
  </div>
);

export const NatheelNewsManager = () => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // post object, or {} for a new one
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    fetchOwnPosts({ status: filter, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setPosts(data.items || []);
        setTotal(data.total ?? 0);
        setHasMore(Boolean(data.has_more));
      })
      .catch((err) => {
        setPosts([]);
        setError(err.message || 'تعذر تحميل الأخبار');
      })
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = () => {
    setLoadingMore(true);
    fetchOwnPosts({ status: filter, limit: PAGE_SIZE, offset: posts.length })
      .then((data) => {
        setPosts((current) => {
          const seen = new Set(current.map((p) => p.id));
          return [...current, ...(data.items || []).filter((p) => !seen.has(p.id))];
        });
        setHasMore(Boolean(data.has_more));
      })
      .catch((err) => setError(err.message || 'تعذر تحميل المزيد'))
      .finally(() => setLoadingMore(false));
  };

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const handleSaved = (saved, wasEditing) => {
    setEditing(null);
    flash(wasEditing ? 'تم حفظ التعديلات.' : 'تم إنشاء الخبر.');
    load();
  };

  const handleDelete = (post) => {
    if (!window.confirm(`سيتم حذف «${post.title}» نهائياً. هل تريد المتابعة؟`)) return;
    setBusyId(post.id);
    deletePost(post.id)
      .then(() => {
        setPosts((current) => current.filter((p) => p.id !== post.id));
        setTotal((n) => Math.max(0, n - 1));
        flash('تم حذف الخبر.');
      })
      .catch((err) => setError(err.message || 'تعذر حذف الخبر'))
      .finally(() => setBusyId(null));
  };

  const handleToggleStatus = (post) => {
    const next = post.status === 'published' ? 'draft' : 'published';
    setBusyId(post.id);
    updatePost(post.id, { status: next })
      .then((saved) => {
        setPosts((current) => current.map((p) => (p.id === post.id ? saved : p)));
        flash(next === 'published' ? 'تم نشر الخبر.' : 'أُعيد الخبر إلى المسودات.');
      })
      .catch((err) => setError(err.message || 'تعذر تغيير حالة النشر'))
      .finally(() => setBusyId(null));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-[#0F172A]">
            <PenSquare className="h-5 w-5 text-[#1D6FD9]" />
            <span>أخبار نثيل</span>
          </h3>
          <p className="mt-1 text-[11px] text-[#64748B]">
            الأخبار التي تنشرها نثيل. تظهر المنشورة منها في صفحة الأخبار على الموقع.
            {total > 0 && ` · ${total} خبر`}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[11px] font-bold text-[#1D6FD9] hover:bg-[#F8FAFC] disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button
            type="button"
            onClick={() => setEditing({})}
            className="flex items-center gap-1.5 rounded-xl bg-[#1D6FD9] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#1859B0]"
          >
            <Plus className="h-4 w-4" />
            إضافة خبر
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((tab) => (
          <button
            key={tab.id || 'all'}
            type="button"
            onClick={() => setFilter(tab.id)}
            aria-pressed={filter === tab.id}
            className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
              filter === tab.id
                ? 'border-[#1D6FD9] bg-[#1D6FD9] text-white'
                : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800">
          {notice}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
          <PenSquare className="h-7 w-7 text-[#94A3B8]" />
          <p className="text-sm text-[#475569]">
            {filter ? 'لا توجد أخبار بهذه الحالة.' : 'لم تنشر نثيل أي خبر بعد.'}
          </p>
          <button
            type="button"
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-xs font-bold text-white hover:bg-[#1859B0]"
          >
            <Plus className="h-4 w-4" />
            أضف أول خبر
          </button>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                busy={busyId === post.id}
                onEdit={setEditing}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-xs font-bold text-[#1D6FD9] hover:bg-[#F8FAFC] disabled:opacity-60"
              >
                {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                تحميل المزيد
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {editing && (
          <NewsPostForm
            post={editing.id ? editing : null}
            onClose={() => setEditing(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
