import { NextResponse } from 'next/server';
import { submitLead } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await submitLead(data);
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
