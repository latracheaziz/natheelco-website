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
  const error = new Error(data.error?.message || 'تعذر تنفيذ العملية');
  error.code = data.error?.code;
  throw error;
}

/** The API returns a relative image path; the browser needs it against the API origin.
 *  `updated_at` busts the one-day cache after an edit replaces the cover. */
export function postImageUrl(post) {
  if (!post?.image_url) return null;
  const version = post.updated_at ? `?v=${encodeURIComponent(post.updated_at)}` : '';
  return `${API_BASE}${post.image_url}${version}`;
}

function toFormData(fields, image, removeImage) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });
  if (image) form.append('image', image);
  if (removeImage) form.append('remove_image', 'true');
  return form;
}

/* ── Admin ─────────────────────────────────────────────────────────────── */

export function fetchOwnPosts({ status = '', limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.set('status', status);
  return fetch(`${API_BASE}/api/news-posts?${params}`, { headers: adminHeaders() }).then(readBody);
}

export function createPost(fields, image) {
  return fetch(`${API_BASE}/api/news-posts`, {
    method: 'POST',
    headers: adminHeaders(),
    body: toFormData(fields, image, false),
  }).then(readBody);
}

export function updatePost(id, fields, image, removeImage) {
  return fetch(`${API_BASE}/api/news-posts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: toFormData(fields, image, removeImage),
  }).then(readBody);
}

export function deletePost(id) {
  return fetch(`${API_BASE}/api/news-posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  }).then(readBody);
}

/* ── Public (no authentication) ────────────────────────────────────────── */

export function fetchPublicPosts({ limit = 12, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return fetch(`${API_BASE}/api/public/news/posts?${params}`).then(readBody);
}

export function fetchPublicPost(id) {
  return fetch(`${API_BASE}/api/public/news/posts/${encodeURIComponent(id)}`).then(readBody);
}

export function fetchPublicMinistryNews({ limit = 12, offset = 0, locale = 'ar' } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    locale,
  });
  return fetch(`${API_BASE}/api/public/news/ministry?${params}`).then(readBody);
}

/* ── Shared helpers ────────────────────────────────────────────────────── */

const DATE_LOCALES = { ar: 'ar-u-ca-gregory', en: 'en-GB' };

export function formatPostDate(value, locale = 'ar') {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(DATE_LOCALES[locale] || DATE_LOCALES.ar, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** `<input type="date">` wants YYYY-MM-DD; the API returns a full ISO timestamp. */
export function toDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
