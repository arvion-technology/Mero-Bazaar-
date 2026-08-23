import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const authHeader = req.headers.get("authorization");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/vendor-kyc/document/${filename}`,
    { headers: { Authorization: authHeader || "" } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Not found" }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: { "Content-Type": res.headers.get("content-type") || "image/jpeg" },
  });
}