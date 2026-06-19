import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    // Pass all search params through to NestJS
    const query = new URLSearchParams();
    searchParams.forEach((value, key) => query.set(key, value));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${query.toString()}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}