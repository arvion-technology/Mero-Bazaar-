import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listings?${searchParams.toString()}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch listings" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}