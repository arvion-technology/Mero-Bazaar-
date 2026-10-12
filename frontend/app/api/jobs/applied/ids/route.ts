import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) return NextResponse.json({ ids: [] });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applied/ids`,
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return NextResponse.json({ ids: [] });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ ids: [] });
  }
}