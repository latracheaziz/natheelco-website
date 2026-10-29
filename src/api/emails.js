import { ADMIN_TOKEN_KEY } from './reviews';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function adminHeaders(extra = {}) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Errors carry the backend's machine-readable code so the page can tell
 *  "needs configuring" from "needs connecting" from "needs reconnecting". */
export class EmailApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function readBody(response) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  throw new EmailApiError(
    data.error?.message || 'تعذر الاتصال بصندوق البريد',
    data.error?.code || `HTTP_${response.status}`,
  );
}

export function fetchMailboxStatus() {
  return fetch(`${API_BASE}/api/emails/status`, { headers: adminHeaders() }).then(readBody);
}

export function startMailboxConnect() {
  return fetch(`${API_BASE}/api/emails/oauth/start`, {
    method: 'POST',
    headers: adminHeaders(),
  }).then(readBody);
}

export function disconnectMailbox() {
  return fetch(`${API_BASE}/api/emails/connection`, {
    method: 'DELETE',
    headers: adminHeaders(),
  }).then(readBody);
}

export function fetchEmails({
  status = 'all',
  sender = '',
  subject = '',
  q = '',
  dateFrom = '',
  dateTo = '',
  hasAttachment = false,
  pageSize = 25,
  pageToken = '',
} = {}) {
  const params = new URLSearchParams({ status, page_size: String(pageSize) });
  if (sender.trim()) params.set('sender', sender.trim());
  if (subject.trim()) params.set('subject', subject.trim());
  if (q.trim()) params.set('q', q.trim());
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  if (hasAttachment) params.set('has_attachment', 'true');
  if (pageToken) params.set('page_token', pageToken);
  return fetch(`${API_BASE}/api/emails?${params}`, { headers: adminHeaders() }).then(readBody);
}

export function fetchEmail(messageId) {
  return fetch(`${API_BASE}/api/emails/${encodeURIComponent(messageId)}`, {
    headers: adminHeaders(),
  }).then(readBody);
}

export function setEmailRead(messageId, read) {
  return fetch(`${API_BASE}/api/emails/${encodeURIComponent(messageId)}/read`, {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ read }),
  }).then(readBody);
}

export function formatEmailDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  // Gregorian is pinned: some browsers resolve an Arabic locale to the Hijri calendar.
  if (sameDay) {
    return date.toLocaleTimeString('ar-u-ca-gregory', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('ar-u-ca-gregory', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatEmailDateTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('ar-u-ca-gregory', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function senderLabel(person) {
  if (!person) return 'مرسل غير معروف';
  return person.name || person.email || 'مرسل غير معروف';
}

export function formatBytes(size) {
  if (typeof size !== 'number' || size <= 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
