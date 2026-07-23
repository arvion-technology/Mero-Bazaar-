import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("pending_2fa")?.value;
  const res = NextResponse.json(raw ? JSON.parse(raw) : null);
  if (raw) res.cookies.delete("pending_2fa");
  return res;
}