import { NextRequest, NextResponse } from "next/server";
import { formToCreateAgriculturePayload } from "@/lib/adapters/agricultureAdapter";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const raw = await req.json();
    const transformed = formToCreateAgriculturePayload(raw);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agriculture`, {
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
    console.error("agriculture POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/agriculture${queryString ? `?${queryString}` : ""}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("agriculture GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}