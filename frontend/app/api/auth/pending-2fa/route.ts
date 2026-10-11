  import { NextResponse } from "next/server";
  import { readPending2fa } from "@/lib/auth";

  export async function GET() {
    const pending = await readPending2fa();
    return NextResponse.json(
      pending ? { pending: true, provider: pending.provider } : { pending: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }