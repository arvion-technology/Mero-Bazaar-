import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/mine/stats`, {
      headers: { Authorization: authHeader || "" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("listings/mine/stats GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}