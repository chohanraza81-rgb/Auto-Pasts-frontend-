const API_URL = '/api/proxy';

export async function fetchAPI(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
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

export async function getPosts(params: any = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchAPI(`/posts?${qs}`);
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
