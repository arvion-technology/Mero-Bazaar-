import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/geocode/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  return NextResponse.json(data);
}