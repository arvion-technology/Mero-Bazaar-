import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/leads/mine`);
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}