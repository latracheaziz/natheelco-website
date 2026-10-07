const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const ADMIN_TOKEN_KEY = 'natheel_admin_token';

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
  const detail = data.detail;
  const message = Array.isArray(detail)
    ? detail.map((item) => item.msg || item).join(' ')
    : detail || data.message || 'تعذر الاتصال بخدمة النشر';
  throw new Error(message);
}

export function fetchHubStatus() {
  return fetch(`${API_BASE}/api/hub/status`, { headers: adminHeaders() }).then(readBody);
}

export function fetchHubPosts() {
  return fetch(`${API_BASE}/api/hub/posts`, { headers: adminHeaders() }).then(readBody);
}

export function fetchHubAnalytics() {
  return fetch(`${API_BASE}/api/hub/analytics`, { headers: adminHeaders() }).then(readBody);
}

export function syncHubAnalytics() {
  return fetch(`${API_BASE}/api/hub/analytics/sync`, {
    method: 'POST',
    headers: adminHeaders(),
  }).then(readBody);
}

export function toAdminPost(post) {
  const publishedAt = post.published_at || post.publishedAt;
  return {
    id: post.id,
    caption: post.caption,
    mediaType: post.media_type || post.mediaType || 'text',
    mediaUrl: post.media_url || post.mediaUrl || '',
    videoUrl: post.video_url || post.videoUrl || '',
    platforms: post.platforms || [],
    status: post.status || 'saved',
    publishedAt: publishedAt ? new Date(publishedAt).toLocaleString('ar') : 'الآن',
    results: post.results || [],
    stats: post.stats || {},
  };
}

export function aggregatePublicationMetrics(items = []) {
  const available = items.filter((item) => item.available);
  const total = (key) => {
    const values = available.map((item) => item[key]).filter((value) => value !== null && value !== undefined);
    return values.length ? values.reduce((sum, value) => sum + Number(value), 0) : null;
  };
  return {
    available: available.length > 0,
    likes_count: total('likes_count'),
    comments_count: total('comments_count'),
    shares_count: total('shares_count'),
    views_count: total('views_count'),
  };
}

export async function publishHubPost({ caption, platforms, imageFile, videoFile, videoUrl }) {
  const body = new FormData();
  body.append('caption', caption || '');
  body.append('platforms', platforms.join(','));
  if (imageFile) body.append('image', imageFile);
  if (videoFile) body.append('video', videoFile);
  if (videoUrl && /^https?:\/\//i.test(videoUrl)) body.append('video_url', videoUrl);
  const response = await fetch(`${API_BASE}/api/hub/posts`, {
    method: 'POST',
    headers: adminHeaders(),
    body,
  });
  return readBody(response);
}

export async function deleteHubPost(id) {
  const response = await fetch(`${API_BASE}/api/hub/posts/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (response.status === 404) return;
  await readBody(response);
}

export async function fileFromUrl(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('تعذر قراءة ملف الوسائط');
  const blob = await response.blob();
  const type = blob.type || (filename.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg');
  return new File([blob], filename, { type });
}
