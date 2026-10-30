import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Link2,
  Loader2,
  Mail,
  Paperclip,
  RefreshCw,
} from 'lucide-react';
import { startMailboxConnect } from '../../api/emails';

/* ── Layout preview ──────────────────────────────────────────────────────
   The same row structure EmailsSection renders once a mailbox is attached, with the field
   names standing in for content. Deliberately not sample messages: nothing here should read
   as real mail. The full setup instructions live in backend/.env.example. */
const PLACEHOLDER_ROWS = [
  { unread: true, attachment: true },
  { unread: true, attachment: false },
  { unread: false, attachment: false },
  { unread: false, attachment: true },
];

const InboxPreview = () => (
  <div className="space-y-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-bold text-[#0F172A]">شكل صندوق الوارد بعد الربط</p>
      <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
        معاينة للتنسيق — ليست رسائل حقيقية
      </span>
    </div>

    <div
      aria-hidden="true"
      className="pointer-events-none select-none overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-white"
    >
      {PLACEHOLDER_ROWS.map((row, index) => (
        <div
          key={index}
          className={`flex items-stretch border-b border-[#F1F5F9] last:border-b-0 ${
            row.unread ? 'bg-[#F8FBFF]' : 'bg-white'
          }`}
        >
          <div className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 sm:px-4">
            <span
              className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                row.unread ? 'bg-[#1D6FD9]' : 'bg-transparent'
              }`}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`truncate text-xs ${
                    row.unread ? 'font-bold text-[#0F172A]' : 'font-medium text-[#334155]'
                  }`}
                >
                  اسم المرسل
                </span>
                <span className="flex flex-shrink-0 items-center gap-1.5 text-[10px] text-[#94A3B8]">
                  {row.attachment && <Paperclip className="h-3 w-3" />}
                  التاريخ والوقت
                </span>
              </div>
              <span dir="ltr" className="truncate text-[10px] text-[#94A3B8]">
                sender@example.com
              </span>
              <span
                className={`truncate text-xs ${
                  row.unread ? 'font-bold text-[#0F172A]' : 'text-[#475569]'
                }`}
              >
                موضوع الرسالة
              </span>
              <span className="text-[11px] leading-relaxed text-[#64748B]">
                مقتطف قصير من نص الرسالة يظهر هنا في سطرين كحدّ أقصى…
              </span>
              {row.unread && (
                <span className="w-fit rounded-full bg-[#1D6FD9] px-2 py-0.5 text-[10px] font-bold text-white">
                  غير مقروءة
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 border-r border-[#F1F5F9] px-2">
            <span className="rounded-lg p-2 text-[#CBD5E1]">
              {row.unread ? <Mail className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            <span className="rounded-lg p-2 text-[#CBD5E1]">
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      ))}
    </div>

    <p className="text-[11px] leading-relaxed text-[#64748B]">
      كل رسالة تعرض: المرسل وبريده، الموضوع، مقتطفاً من النص، التاريخ والوقت، حالة القراءة،
      ومؤشر المرفقات. بالضغط على الرسالة تُفتح بنصها الكامل ومرفقاتها، مع زرَّي «الرد عبر Gmail»
      و«فتح في Gmail». وتتوفّر تصفية حسب المقروء وغير المقروء والمرسل والموضوع والتاريخ والمرفقات.
    </p>
  </div>
);

/** Shown whenever no mailbox is attached: a slim status line plus what the page will look
 *  like once it is. The server-side setup steps are documented in backend/.env.example. */
export const EmailConnectPanel = ({ status, onRefresh }) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const needsCredentials = status?.next_step === 'configure_credentials';
  const needsReconnect = status?.next_step === 'reconnect_mailbox';
  const missing = status?.required_settings || [];

  const connect = () => {
    setConnecting(true);
    setError('');
    startMailboxConnect()
      .then((data) => {
        if (data.authorization_url) {
          // Google's consent screen is a full top-level navigation, not a popup.
          window.location.assign(data.authorization_url);
        } else {
          setError('لم يُرجع الخادم رابط الموافقة.');
          setConnecting(false);
        }
      })
      .catch((err) => {
        setError(err.message || 'تعذر بدء الربط');
        setConnecting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D6FD9]">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-bold text-[#0F172A]">
              {needsReconnect ? 'يلزم إعادة ربط صندوق البريد' : 'صندوق البريد غير مرتبط بعد'}
            </h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
              المزوّد: {status?.provider_label || '—'}
              {needsCredentials && missing.length > 0 && (
                <>
                  {' · '}
                  بانتظار إعداد <span className="font-mono">{missing.join('، ')}</span> في
                  ملف backend/.env على الخادم
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-[11px] font-bold text-[#1D6FD9] hover:bg-[#F8FAFC]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            إعادة الفحص
          </button>
          <button
            type="button"
            onClick={connect}
            disabled={connecting || needsCredentials}
            title={needsCredentials ? 'بانتظار إعداد المفاتيح على الخادم' : undefined}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#1859B0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            {connecting ? 'جارٍ التحويل...' : 'ربط البريد'}
          </button>
        </div>
      </div>

      {(status?.error || error) && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{status?.error || error}</span>
        </div>
      )}

      <InboxPreview />
    </motion.div>
  );
};
