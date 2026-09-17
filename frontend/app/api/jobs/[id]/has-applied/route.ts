import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ applied: false }, { status: 200 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/has-applied`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ applied: false }, { status: 200 });
  }

  return NextResponse.json(await res.json());
}