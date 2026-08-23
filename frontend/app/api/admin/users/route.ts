import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const search = req.nextUrl.search;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users${search}`, {
      headers: { Authorization: authHeader || "" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("admin/users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}