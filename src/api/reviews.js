const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export const ADMIN_TOKEN_KEY = 'natheel_admin_token';

async function readBody(response) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  const detail = data.detail;
  const message = Array.isArray(detail)
    ? detail.map((item) => item.msg || item).join(' ')
    : detail || data.message || 'تعذر الاتصال بالخادم';
  throw new Error(message);
}

export function adminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await readBody(response);
  sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  return data;
}

export function submitReview({ name, comment, rating, role }) {
  return fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, comment, rating, role: role || 'عميل' }),
  }).then(readBody);
}

export function fetchPublicReviews() {
  return fetch(`${API_BASE}/api/reviews/public`).then(readBody);
}

export function fetchAdminReviews() {
  return fetch(`${API_BASE}/api/reviews`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
  }).then(readBody);
}

export function fetchReviewStats() {
  return fetch(`${API_BASE}/api/reviews/stats`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
  }).then(readBody);
}

export function decideReview(id, status) {
  return fetch(`${API_BASE}/api/reviews/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken()}`,
    },
    body: JSON.stringify({ status }),
  }).then(readBody);
}

export function toOpinion(review) {
  const created = review.created_at ? new Date(review.created_at) : new Date();
  return {
    id: review.id,
    name: review.name,
    role: review.role || 'عميل',
    city: '',
    date: created.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }),
    rating: review.rating,
    status: review.status,
    comment: review.comment,
    project: '',
  };
}
