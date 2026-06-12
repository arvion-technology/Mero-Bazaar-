import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const exclude  = searchParams.get("exclude");
    const limit    = searchParams.get("limit") ?? "8";

    if (!category) {
      return NextResponse.json({ error: "category is required" }, { status: 400 });
    }

    const query = new URLSearchParams({ category, limit });
    if (exclude) query.set("exclude", exclude);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/related?${query.toString()}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}