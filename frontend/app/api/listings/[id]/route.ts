import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
{ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}