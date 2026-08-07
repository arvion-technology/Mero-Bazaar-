import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings/${id}`, {
      headers: { Authorization: authHeader || "" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("admin/listings/[id] GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("admin/listings/[id] PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: authHeader || "" },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("admin/listings/[id] DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}