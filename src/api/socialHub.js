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

// Posts sourced live from Zoho Social (GET /api/hub/posts merges these in) carry one
// network per entry instead of our local "platforms" + "results" shape — normalize both
// shapes into the same object the admin UI already knows how to render.
export function toAdminPost(post) {
  if (post.source === 'zoho') {
    const manageUrl = post.manage_url || post.permalink || '';
    return {
      id: post.id,
      source: 'zoho',
      caption: post.caption || '',
      mediaType: post.media_type || 'text',
      mediaUrl: post.media_url || '',
      videoUrl: post.media_type === 'video' ? (post.media_url || '') : '',
      platforms: post.platform ? [post.platform] : [],
      status: 'published',
      publishedAt: post.created_at ? new Date(post.created_at).toLocaleString('ar') : 'الآن',
      results: [{
        platform: post.platform,
        status: 'published',
        message: post.from_name ? `نُشر عبر Zoho Social (${post.from_name})` : 'نُشر عبر Zoho Social',
        url: manageUrl || null,
      }],
      stats: post.stats || {},
      manageLinks: manageUrl ? [manageUrl] : [],
    };
  }
  const publishedAt = post.published_at || post.publishedAt;
  const results = post.results || [];
  return {
    id: post.id,
    source: post.source || 'local',
    caption: post.caption,
    mediaType: post.media_type || post.mediaType || 'text',
    mediaUrl: post.media_url || post.mediaUrl || '',
    videoUrl: post.video_url || post.videoUrl || '',
    platforms: post.platforms || [],
    status: post.status || 'saved',
    publishedAt: publishedAt ? new Date(publishedAt).toLocaleString('ar') : 'الآن',
    results,
    stats: post.stats || {},
    manageLinks: results.map((item) => item.url).filter(Boolean),
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

// Zoho Social has no API to delete an already-published post (only drafts/schedules) — so
// posts sourced live from Zoho have nothing local to delete. We only call DELETE for posts
// that exist in our own local record, and in both cases hand back the links the caller
// should open so the admin can finish the deletion manually on Zoho/the network.
export async function deleteHubPost(post) {
  if (post.source === 'zoho') {
    return { manageLinks: post.manageLinks || [] };
  }
  const response = await fetch(`${API_BASE}/api/hub/posts/${post.id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (response.status === 404) return { manageLinks: [] };
  const data = await readBody(response);
  return { manageLinks: data.manage_links || post.manageLinks || [] };
}

export async function fileFromUrl(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('تعذر قراءة ملف الوسائط');
  const blob = await response.blob();
  const type = blob.type || (filename.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg');
  return new File([blob], filename, { type });
}
