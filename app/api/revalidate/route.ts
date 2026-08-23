import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  // Secret check
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }
    revalidatePath(body.path);
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
