const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchAPI(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getPosts(params: any = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchAPI(`/api/posts?${qs}`);
}

export async function getPost(slug: string) {
  return fetchAPI(`/api/posts/${slug}`);
}

export async function getSettings() {
  return fetchAPI('/api/settings');
}

export async function generatePost(keyword: string, report: string) {
  return fetchAPI('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ keyword, report })
  });
}

export async function submitLead(data: any) {
  return fetchAPI('/api/leads', {
    method: 'POST',
    body: JSON.stringify({ ...data, source: 'website' })
  });
}

export async function trackAffiliate(slug: string) {
  return fetchAPI(`/api/affiliates/go/${slug}`, { redirect: 'manual' });
}
