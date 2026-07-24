import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const formData = await req.formData();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/secondhand-goods/${id}/photos`, {
      method: "POST",
      headers: { Authorization: authHeader || "" },
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("secondhand-goods/:id/photos POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}