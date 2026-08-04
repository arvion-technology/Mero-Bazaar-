import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const payload = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/beauty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("beauty POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/beauty${queryString ? `?${queryString}` : ""}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("beauty GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}