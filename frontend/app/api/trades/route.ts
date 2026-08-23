import { NextRequest, NextResponse } from "next/server";
import { formToCreateTradesPayload } from "@/lib/adapters/tradesAdapter";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const raw = await req.json();
    const transformed = formToCreateTradesPayload(raw);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(transformed),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("trades POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/trades${queryString ? `?${queryString}` : ""}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("trades GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}