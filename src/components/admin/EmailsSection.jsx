import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CalendarRange,
  Check,
  Clock,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  Paperclip,
  Plug,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Unlink,
  X,
} from 'lucide-react';
import {
  disconnectMailbox,
  fetchEmails,
  fetchMailboxStatus,
  formatEmailDate,
  senderLabel,
  setEmailRead,
} from '../../api/emails';
import { EmailConnectPanel } from './EmailConnectPanel';
import { EmailDetailModal } from './EmailDetailModal';

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 400;
const EMPTY_FILTERS = {
  status: 'all',
  q: '',
  sender: '',
  subject: '',
  dateFrom: '',
  dateTo: '',
  hasAttachment: false,
};

const STATUS_TABS = [
  { id: 'all', label: 'كل الرسائل' },
  { id: 'unread', label: 'غير المقروءة' },
  { id: 'read', label: 'المقروءة' },
];

const hasActiveFilters = (f) =>
  f.status !== 'all' ||
  Boolean(f.q.trim()) ||
  Boolean(f.sender.trim()) ||
  Boolean(f.subject.trim()) ||
  Boolean(f.dateFrom) ||
  Boolean(f.dateTo) ||
  f.hasAttachment;

/* ── One inbox row ──────────────────────────────────────────────────────── */
const EmailRow = ({ email, onOpen, onToggleRead, busy, canSyncRead }) => {
  const unread = !email.is_read;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-stretch gap-0 border-b border-[#F1F5F9] last:border-b-0 ${
        unread ? 'bg-[#F8FBFF]' : 'bg-white'
      } hover:bg-[#F8FAFC]`}
    >
      <button
        type="button"
        onClick={() => onOpen(email)}
        className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-right sm:px-4"
      >
        <span
          aria-hidden="true"
          className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${unread ? 'bg-[#1D6FD9]' : 'bg-transparent'}`}
        />

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Sender + date */}
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={`min-w-0 truncate text-xs ${unread ? 'font-bold text-[#0F172A]' : 'font-medium text-[#334155]'}`}
            >
              {senderLabel(email.from)}
            </span>
            <span className="flex flex-shrink-0 items-center gap-1.5 text-[10px] text-[#94A3B8]">
              {email.has_attachments && <Paperclip className="h-3 w-3" aria-label="يحتوي مرفقات" />}
              {formatEmailDate(email.date) || '—'}
            </span>
          </span>

          {email.from?.email && (
            <span dir="ltr" className="truncate text-[10px] text-[#94A3B8]">
              {email.from.email}
            </span>
          )}

          <span
            className={`truncate text-xs ${unread ? 'font-bold text-[#0F172A]' : 'text-[#475569]'}`}
          >
            {email.subject || '(بدون موضوع)'}
          </span>

          {email.snippet && (
            <span className="line-clamp-2 text-[11px] leading-relaxed text-[#64748B]">
              {email.snippet}
            </span>
          )}

          {unread && (
            <span className="w-fit rounded-full bg-[#1D6FD9] px-2 py-0.5 text-[10px] font-bold text-white">
              غير مقروءة
            </span>
          )}
        </span>
      </button>

      <div className="flex flex-col items-center justify-center gap-1 border-r border-[#F1F5F9] px-2">
        {canSyncRead && (
          <button
            type="button"
            onClick={() => onToggleRead(email)}
            disabled={busy}
            title={email.is_read ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'}
            aria-label={email.is_read ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'}
            className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#0F172A] disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : email.is_read ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-amber-600" />
            )}
          </button>
        )}
        {email.provider_url && (
          <a
            href={email.provider_url}
            target="_blank"
            rel="noopener noreferrer"
            title="فتح في Gmail"
            aria-label="فتح في Gmail"
            className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#1D6FD9]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const RowSkeleton = () => (
  <div className="animate-pulse space-y-2 border-b border-[#F1F5F9] px-4 py-3 last:border-b-0">
    <div className="flex justify-between gap-3">
      <div className="h-3 w-32 rounded bg-[#E2E8F0]" />
      <div className="h-3 w-16 rounded bg-[#F1F5F9]" />
    </div>
    <div className="h-3 w-3/5 rounded bg-[#E2E8F0]" />
    <div className="h-3 w-full rounded bg-[#F1F5F9]" />
  </div>
);

/* ── Filters ────────────────────────────────────────────────────────────── */
const EmailFilters = ({ filters, onChange, onReset, open, onToggleOpen, supportsAttachment }) => {
  const set = (patch) => onChange({ ...filters, ...patch });
  const active = hasActiveFilters(filters);

  const panel = (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => set({ status: tab.id })}
              aria-pressed={isActive}
              className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                isActive
                  ? 'border-[#1D6FD9] bg-[#1D6FD9] text-white'
                  : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        {supportsAttachment && (
          <button
            type="button"
            onClick={() => set({ hasAttachment: !filters.hasAttachment })}
            aria-pressed={filters.hasAttachment}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
              filters.hasAttachment
                ? 'border-[#1D6FD9] bg-[#1D6FD9] text-white'
                : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <Paperclip className="h-3.5 w-3.5" />
            بمرفقات
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="كلمات مفتاحية في الرسالة..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pr-10 pl-3 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1D6FD9] focus:outline-none"
          />
        </div>

        <input
          type="text"
          dir="ltr"
          value={filters.sender}
          onChange={(e) => set({ sender: e.target.value })}
          placeholder="المرسل أو بريده"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1D6FD9] focus:outline-none"
        />
        <input
          type="text"
          value={filters.subject}
          onChange={(e) => set({ subject: e.target.value })}
          placeholder="الموضوع"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1D6FD9] focus:outline-none"
        />

        <label className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#475569]">
          <CalendarRange className="h-3.5 w-3.5 flex-shrink-0 text-[#1D6FD9]" />
          <span className="flex-shrink-0 text-[11px]">من</span>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs text-[#475569]">
          <span className="flex-shrink-0 text-[11px]">إلى</span>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!active}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50 sm:w-auto"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        إعادة تعيين
      </button>
    </div>
  );

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
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

/* ── Section ────────────────────────────────────────────────────────────── */
export const EmailsSection = () => {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [debounced, setDebounced] = useState({ q: '', sender: '', subject: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [emails, setEmails] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [estimated, setEstimated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [selected, setSelected] = useState(null);
  const requestRef = useRef(0);

  const connected = Boolean(status?.connected);
  const canSyncRead = Boolean(status?.supports_read_sync);

  const loadStatus = useCallback(() => {
    setStatusLoading(true);
    setStatusError('');
    return fetchMailboxStatus()
      .then((data) => setStatus(data))
      .catch((err) => setStatusError(err.message || 'تعذر قراءة حالة الاتصال'))
      .finally(() => setStatusLoading(false));
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Returning from Google's consent screen lands here with ?email_connected=…
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('email_connected')) return;
    if (params.get('email_connected') === '0') {
      setStatusError(`تعذر إكمال الربط مع Google (${params.get('reason') || 'سبب غير معروف'}).`);
    }
    params.delete('email_connected');
    params.delete('reason');
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebounced({ q: filters.q, sender: filters.sender, subject: filters.subject }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [filters.q, filters.sender, filters.subject]);

  const { status: statusFilter, dateFrom, dateTo, hasAttachment } = filters;

  const load = useCallback(() => {
    if (!connected) return;
    const ticket = ++requestRef.current;
    setLoading(true);
    setError('');
    setErrorCode('');
    fetchEmails({
      status: statusFilter,
      dateFrom,
      dateTo,
      hasAttachment,
      ...debounced,
      pageSize: PAGE_SIZE,
    })
      .then((data) => {
        if (ticket !== requestRef.current) return;
        setEmails(data.items || []);
        setNextToken(data.next_page_token || null);
        setEstimated(data.estimated_total ?? null);
      })
      .catch((err) => {
        if (ticket !== requestRef.current) return;
        setEmails([]);
        setError(err.message || 'تعذر تحميل الرسائل');
        setErrorCode(err.code || '');
        // The grant was revoked or expired: fall back to the connection panel.
        if (err.code === 'MAIL_AUTH_REQUIRED' || err.code === 'MAIL_NOT_CONNECTED') loadStatus();
      })
      .finally(() => {
        if (ticket === requestRef.current) setLoading(false);
      });
  }, [connected, statusFilter, dateFrom, dateTo, hasAttachment, debounced, loadStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = () => {
    if (!nextToken) return;
    setLoadingMore(true);
    fetchEmails({
      status: statusFilter,
      dateFrom,
      dateTo,
      hasAttachment,
      ...debounced,
      pageSize: PAGE_SIZE,
      pageToken: nextToken,
    })
      .then((data) => {
        setEmails((current) => {
          const seen = new Set(current.map((m) => m.id));
          return [...current, ...(data.items || []).filter((m) => !seen.has(m.id))];
        });
        setNextToken(data.next_page_token || null);
      })
      .catch((err) => setError(err.message || 'تعذر تحميل المزيد'))
      .finally(() => setLoadingMore(false));
  };

  const applyRead = (id, isRead) =>
    setEmails((current) => current.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)));

  const toggleRead = (email) => {
    const next = !email.is_read;
    setBusyId(email.id);
    setEmailRead(email.id, next)
      .then((data) => applyRead(email.id, data.is_read))
      .catch((err) => setError(err.message || 'تعذر تحديث حالة القراءة'))
      .finally(() => setBusyId(null));
  };

  const openEmail = (email) => {
    setSelected(email);
    // Opening a message marks it read in the mailbox itself, as Gmail would.
    if (canSyncRead && !email.is_read) {
      setEmailRead(email.id, true)
        .then((data) => applyRead(email.id, data.is_read))
        .catch(() => {});
    }
  };

  const disconnect = () => {
    if (!window.confirm('سيتم فصل صندوق البريد وحذف رموز الوصول المحفوظة. هل تريد المتابعة؟')) return;
    disconnectMailbox()
      .then(() => {
        setEmails([]);
        setNextToken(null);
        setEstimated(null);
        return loadStatus();
      })
      .catch((err) => setStatusError(err.message || 'تعذر فصل صندوق البريد'));
  };

  const filtered = hasActiveFilters({ ...filters, ...debounced });
  const selectedEmail = emails.find((m) => m.id === selected?.id) || selected;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-[#0F172A]">
            <Inbox className="h-5 w-5 text-[#1D6FD9]" />
            <span>البريد الإلكتروني</span>
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
            {connected ? (
              <>
                متصل بـ <span dir="ltr" className="font-bold">{status?.email || '—'}</span>
                {status?.mailbox?.unread != null && ` · ${status.mailbox.unread} غير مقروءة في Inbox`}
              </>
            ) : (
              'صندوق البريد غير مرتبط — أكمل الربط لعرض الرسائل الحقيقية.'
            )}
          </p>
        </div>

        {connected && (
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                loadStatus();
                load();
              }}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[11px] font-bold text-[#1D6FD9] hover:bg-[#F8FAFC] disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'جارٍ المزامنة...' : 'مزامنة'}
            </button>
            <button
              type="button"
              onClick={disconnect}
              className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[11px] font-bold text-[#64748B] hover:bg-[#F8FAFC] hover:text-red-600"
            >
              <Unlink className="h-3.5 w-3.5" />
              فصل
            </button>
          </div>
        )}
      </div>

      {statusError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{statusError}</span>
        </div>
      )}

      {statusLoading && !status && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-12 text-sm text-[#64748B]">
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ قراءة حالة الاتصال...
        </div>
      )}

      {/* Not connected: real setup instructions, never a fake inbox */}
      {!statusLoading && !connected && status && (
        <EmailConnectPanel status={status} onRefresh={loadStatus} />
      )}

      {connected && (
        <>
          <EmailFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
            open={filtersOpen}
            onToggleOpen={() => setFiltersOpen((v) => !v)}
            supportsAttachment={Boolean(status?.supports_attachment_filter)}
          />

          {!loading && !error && (
            <p className="text-[11px] text-[#64748B]">
              {estimated != null
                ? `${emails.length} معروضة من نحو ${estimated} رسالة مطابقة`
                : `${emails.length} رسالة معروضة`}
              {filtered ? ' للمعايير المحددة' : ''}
            </p>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
              {errorCode && <p className="font-mono text-[10px] text-red-400">{errorCode}</p>}
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

          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
            {loading && (
              <div aria-busy="true" aria-label="جارٍ تحميل الرسائل">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && !error && emails.length === 0 && (
              <div className="flex flex-col items-center gap-2 p-12 text-center">
                <Mail className="h-7 w-7 text-[#94A3B8]" />
                <p className="text-sm text-[#475569]">
                  {filtered ? 'لا توجد رسائل مطابقة للمعايير المحددة.' : 'صندوق الوارد فارغ.'}
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

            {!loading &&
              !error &&
              emails.map((email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  onOpen={openEmail}
                  onToggleRead={toggleRead}
                  busy={busyId === email.id}
                  canSyncRead={canSyncRead}
                />
              ))}
          </div>

          {!loading && !error && nextToken && (
            <div className="flex justify-center pt-1">
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

          <p className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
            <Plug className="h-3 w-3" />
            تُقرأ الرسائل من Gmail عبر الخادم بصلاحية القراءة وتغيير حالة القراءة فقط. لا تُطلب
            صلاحية الإرسال، ولا تُحفظ الرسائل على هذا الخادم.
          </p>
        </>
      )}

      <AnimatePresence>
        {selected && (
          <EmailDetailModal
            messageId={selected.id}
            isRead={selectedEmail?.is_read}
            canSyncRead={canSyncRead}
            onToggleRead={() => toggleRead(selectedEmail)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
