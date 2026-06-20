import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role } = await req.json();

  if (role !== "VENDOR" && role !== "USER") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pending_role", role, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 5, 
    path: "/",
  });
  return res;
}