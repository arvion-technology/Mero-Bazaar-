import { NextRequest, NextResponse } from "next/server";
import { formToCreateFoodsPayload } from "@/lib/adapters/foodsAdapter";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const raw = await req.json();
    const transformed = formToCreateFoodsPayload(raw);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/foods`, {
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
    console.error("foods POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/foods${queryString ? `?${queryString}` : ""}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("foods GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}