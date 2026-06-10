import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}`)

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