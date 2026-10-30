import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ImagePlus, Loader2, Save, Send, Trash2, X } from 'lucide-react';
import { createPost, postImageUrl, toDateInput, updatePost } from '../../api/newsPosts';

const TITLE_MAX = 200;
const SUMMARY_MAX = 500;
const MAX_IMAGE_MB = 5;
const ACCEPTED = 'image/jpeg,image/png,image/webp';

const Field = ({ label, hint, required, children }) => (
  <label className="block space-y-1.5">
    <span className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-bold text-[#0F172A]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {hint && <span className="text-[10px] text-[#94A3B8]">{hint}</span>}
    </span>
    {children}
  </label>
);

const inputClass =
  'w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#0F172A] ' +
  'placeholder:text-[#94A3B8] focus:border-[#1D6FD9] focus:outline-none';

export const NewsPostForm = ({ post, onClose, onSaved }) => {
  const editing = Boolean(post?.id);
  const [title, setTitle] = useState(post?.title || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [body, setBody] = useState(post?.body || '');
  const [publishedAt, setPublishedAt] = useState(
    toDateInput(post?.published_at) || new Date().toISOString().slice(0, 10),
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(editing ? postImageUrl(post) : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, saving]);

  // A preview made with createObjectURL has to be released or it leaks for the page's lifetime.
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const pickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`حجم الصورة أكبر من ${MAX_IMAGE_MB} ميجابايت.`);
      return;
    }
    setError('');
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    setImageFile(file);
    setPreview(objectUrlRef.current);
    setRemoveImage(false);
  };

  const clearImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImageFile(null);
    setPreview(null);
    setRemoveImage(editing && Boolean(post?.has_image));
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = (status) => {
    if (!title.trim()) return setError('العنوان مطلوب.');
    if (!body.trim()) return setError('نص الخبر مطلوب.');

    setSaving(true);
    setError('');
    const fields = { title: title.trim(), body: body.trim(), summary: summary.trim(), status };
    if (publishedAt) fields.published_at = publishedAt;

    const action = editing
      ? updatePost(post.id, fields, imageFile, removeImage)
      : createPost(fields, imageFile);

    action
      .then((saved) => onSaved(saved, editing))
      .catch((err) => setError(err.message || 'تعذر حفظ الخبر'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !saving && onClose()}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3">
          <h3 className="font-heading text-sm font-bold text-[#0F172A]">
            {editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}
          </h3>
          <button
            type="button"
            onClick={() => !saving && onClose()}
            aria-label="إغلاق"
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Field label="عنوان الخبر" required hint={`${title.length}/${TITLE_MAX}`}>
            <input
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنواناً واضحاً ومختصراً"
              className={inputClass}
            />
          </Field>

          <Field label="ملخص قصير" hint={`اختياري · ${summary.length}/${SUMMARY_MAX}`}>
            <textarea
              value={summary}
              maxLength={SUMMARY_MAX}
              rows={2}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="يظهر في بطاقة الخبر. إن تُرك فارغاً تُستخدم بداية النص."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>

          <Field label="نص الخبر" required hint={`${body.length} حرف`}>
            <textarea
              value={body}
              rows={9}
              onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب تفاصيل الخبر هنا. كل سطر فارغ يبدأ فقرة جديدة."
              className={`${inputClass} resize-y leading-loose`}
            />
          </Field>

          <Field label="تاريخ النشر" hint="يظهر على البطاقة وفي صفحة الموقع">
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="صورة الغلاف" hint={`JPG أو PNG أو WEBP · حتى ${MAX_IMAGE_MB} ميجابايت`}>
            <div className="space-y-2">
              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0]">
                  <img src={preview} alt="معاينة صورة الغلاف" className="max-h-56 w-full object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-bold text-red-600 shadow-sm hover:bg-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    إزالة
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-7 text-[#64748B] hover:bg-[#F1F5F9]"
                >
                  <ImagePlus className="h-6 w-6 text-[#1D6FD9]" />
                  <span className="text-xs font-bold">اختر صورة من جهازك</span>
                  <span className="text-[10px]">اختياري — تظهر في أعلى بطاقة الخبر</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED}
                onChange={pickImage}
                className="hidden"
              />
              {preview && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-[11px] font-bold text-[#1D6FD9] hover:underline"
                >
                  استبدال الصورة
                </button>
              )}
            </div>
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => !saving && onClose()}
            className="rounded-xl px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9]"
          >
            إلغاء
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => submit('draft')}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              حفظ كمسودة
            </button>
            <button
              type="button"
              onClick={() => submit('published')}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1859B0] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              {editing ? 'حفظ ونشر' : 'نشر الخبر'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
