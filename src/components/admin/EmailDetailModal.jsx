import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Clock,
  CornerUpLeft,
  ExternalLink,
  Loader2,
  Mail,
  Paperclip,
  X,
} from 'lucide-react';
import { fetchEmail, formatBytes, formatEmailDateTime, senderLabel } from '../../api/emails';

const AddressList = ({ label, people }) => {
  if (!people || people.length === 0) return null;
  return (
    <p className="text-[11px] text-[#64748B]">
      <span className="font-bold">{label}: </span>
      <span dir="ltr" className="break-all">
        {people.map((p) => p.email || p.name).filter(Boolean).join(', ')}
      </span>
    </p>
  );
};

/** The body is already allow-list sanitised on the server. It is rendered inside a sandboxed
 *  iframe as a second, independent barrier: with no `allow-scripts`, nothing in the message can
 *  execute, and with no `allow-same-origin` it cannot reach this page's storage or session. */
const HtmlBody = ({ html }) => {
  const document = useMemo(
    () =>
      [
        '<!doctype html><html><head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<style>',
        'html,body{margin:0;padding:0}',
        "body{font-family:system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif;",
        'font-size:14px;line-height:1.7;color:#334155;padding:4px;word-wrap:break-word}',
        'img{max-width:100%;height:auto}',
        'table{max-width:100%;border-collapse:collapse}',
        'a{color:#1D6FD9}',
        'pre{white-space:pre-wrap;word-break:break-word}',
        '</style></head><body>',
        html,
        '</body></html>',
      ].join(''),
    [html],
  );

  return (
    <iframe
      title="نص الرسالة"
      srcDoc={document}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      className="h-[55vh] w-full rounded-xl border border-[#E2E8F0] bg-white"
    />
  );
};

export const EmailDetailModal = ({ messageId, isRead, onToggleRead, onClose, canSyncRead }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    fetchEmail(messageId)
      .then((data) => {
        if (!cancelled) setMessage(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'تعذر تحميل الرسالة');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [messageId]);

  const sender = message?.from;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
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
        aria-label="تفاصيل الرسالة"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-bold text-[#1D6FD9]">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">رسالة بريد</span>
          </span>
          <div className="flex items-center gap-2">
            {canSyncRead && onToggleRead && (
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
                  {isRead ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'}
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
              جارٍ تحميل الرسالة...
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-2 p-16 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && message && (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <h2 className="font-heading text-lg font-bold leading-snug text-[#0F172A]">
                  {message.subject || '(بدون موضوع)'}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs font-bold text-[#0F172A]">{senderLabel(sender)}</span>
                  {sender?.email && (
                    <span dir="ltr" className="break-all text-[11px] text-[#64748B]">
                      &lt;{sender.email}&gt;
                    </span>
                  )}
                </div>
                <AddressList label="إلى" people={message.to} />
                <AddressList label="نسخة" people={message.cc} />
                <p className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#1D6FD9]" />
                  {formatEmailDateTime(message.date) || 'التاريخ غير متوفر'}
                </p>
              </div>

              {message.attachments?.length > 0 && (
                <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
                    <Paperclip className="h-3.5 w-3.5" />
                    {message.attachments.length} مرفق
                  </p>
                  <ul className="space-y-1">
                    {message.attachments.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-[11px]"
                      >
                        <span dir="ltr" className="min-w-0 flex-1 truncate text-[#0F172A]">
                          {file.filename || 'مرفق بدون اسم'}
                        </span>
                        <span className="flex-shrink-0 text-[#94A3B8]">
                          {formatBytes(file.size) || ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] leading-relaxed text-[#94A3B8]">
                    لتنزيل المرفقات افتح الرسالة في Gmail — هذه الصفحة تطلب صلاحية القراءة فقط.
                  </p>
                </div>
              )}

              <div className="border-t border-[#F1F5F9] pt-4">
                {message.body_html ? (
                  <HtmlBody html={message.body_html} />
                ) : message.body_text ? (
                  <pre
                    dir="auto"
                    className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-[#E2E8F0] bg-white p-3 font-sans text-sm leading-relaxed text-[#334155]"
                  >
                    {message.body_text}
                  </pre>
                ) : (
                  <p className="text-xs italic text-[#94A3B8]">
                    لا يتوفر نص قابل للعرض في هذه الرسالة. افتحها في Gmail لعرضها كاملة.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {!loading && !error && message && (message.reply_url || message.provider_url) && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            {message.reply_url && (
              <a
                href={message.reply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1D6FD9] px-4 py-2 text-xs font-bold text-[#1D6FD9] hover:bg-[#EFF6FF]"
              >
                <CornerUpLeft className="h-3.5 w-3.5" />
                الرد عبر Gmail
              </a>
            )}
            {message.provider_url && (
              <a
                href={message.provider_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-xs font-bold text-white hover:bg-[#1859B0]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                فتح في Gmail
              </a>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
