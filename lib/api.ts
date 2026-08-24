const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Client-side fetch via proxy (avoids CORS)
export async function fetchAPI(path: string, options?: RequestInit) {
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} ${error}`);
  }
  return res.json();
}

// Server-side direct fetch (no CORS)
export async function getServerPosts(params: any = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/posts?${qs}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}

export async function getServerPost(slug: string) {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  return res.json();
}

export async function getServerSettings() {
  const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
  return res.json();
}

// Keep old functions for client-side use
export async function getPosts(params: any = {}) {
  return fetchAPI(`/posts?${new URLSearchParams(params)}`);
}

export async function getPost(slug: string) {
  return fetchAPI(`/posts/${slug}`);
}

export async function getSettings() {
  return fetchAPI('/settings');
}

export async function generatePost(keyword: string, report: string) {
  return fetchAPI('/generate', {
    method: 'POST',
    body: JSON.stringify({ keyword, report }),
  });
}

export async function submitLead(data: any) {
  return fetchAPI('/leads', {
    method: 'POST',
    body: JSON.stringify({ ...data, source: 'website' }),
  });
}
