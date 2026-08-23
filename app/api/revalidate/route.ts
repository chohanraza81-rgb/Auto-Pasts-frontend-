import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Secret check
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await res.revalidate(body.path);
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
