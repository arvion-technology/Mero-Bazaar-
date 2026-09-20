import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured/home${qs ? `?${qs}` : ''}`, {
    headers: { cookie: req.headers.get('cookie') ?? '' },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to load featured listings' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}