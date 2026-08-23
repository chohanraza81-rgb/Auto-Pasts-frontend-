import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/api';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  try {
    await fetchAPI(`/api/affiliates/go/${slug}`, { redirect: 'manual' });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
