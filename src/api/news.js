import { ADMIN_TOKEN_KEY } from './reviews';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function adminHeaders(extra = {}) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readBody(response) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  throw new Error(data.error?.message || 'تعذر تحميل الأخبار');
}

export function fetchNews({
  page = 1,
  pageSize = 12,
  status = 'all',
  q = '',
  dateFrom = '',
  dateTo = '',
  locale = 'ar',
  refresh = false,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    status,
    locale,
  });
  if (q.trim()) params.set('q', q.trim());
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  // Ask the server to re-read the Ministry now rather than serve its cached feed.
  if (refresh) params.set('refresh', 'true');
  return fetch(`${API_BASE}/api/news?${params}`, { headers: adminHeaders() }).then(readBody);
}

export function fetchNewsCounters(locale = 'ar', { refresh = false } = {}) {
  const params = new URLSearchParams({ locale });
  if (refresh) params.set('refresh', 'true');
  return fetch(`${API_BASE}/api/news/counters?${params}`, { headers: adminHeaders() }).then(readBody);
}

export function fetchNewsArticle(key, locale = 'ar') {
  const params = new URLSearchParams({ locale });
  return fetch(`${API_BASE}/api/news/${encodeURIComponent(key)}?${params}`, {
    headers: adminHeaders(),
  }).then(readBody);
}

export function setNewsRead(key, read) {
  return fetch(`${API_BASE}/api/news/${encodeURIComponent(key)}/read`, {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ read }),
  }).then(readBody);
}

// The Ministry publishes Gregorian dates. Some browsers resolve "ar-SA" to the Hijri calendar,
// which would show a different date than the source, so the calendar is pinned explicitly.
const DATE_LOCALES = { ar: 'ar-u-ca-gregory', en: 'en-GB' };

export function formatNewsDate(value, locale = 'ar') {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(DATE_LOCALES[locale] || DATE_LOCALES.ar, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
