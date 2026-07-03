import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor-kyc/me`, {
      headers: { Authorization: authHeader || "" },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}