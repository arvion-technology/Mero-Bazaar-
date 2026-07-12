import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const months = req.nextUrl.searchParams.get("months") ?? "6";

  const res = await fetch(
    `${process.env.BACKEND_URL}/vendor-sales-overview?months=${months}`,
    { headers: { Authorization: token ?? "" } }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}