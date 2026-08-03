import { NextRequest, NextResponse } from "next/server";
import { formToCreateRentalPayload } from "@/lib/adapters/realEstateAdapter";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const raw = await req.json();

    const transformed = formToCreateRentalPayload(raw);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rental`, {
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
    console.error("rental POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rental${queryString ? `?${queryString}` : ""}`
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("rental GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}