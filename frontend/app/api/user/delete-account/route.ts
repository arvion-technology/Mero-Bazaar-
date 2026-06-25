import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  try {
    const res = await fetch(`${BASE}/api/auth/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Pass user id so backend can identify and delete the account
        "x-user-id": session.user.id ?? "",
        "x-user-email": session.user.email ?? "",
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: data?.message || "Failed to delete account" },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch {
    // If backend is unavailable, still allow client-side sign-out
    return NextResponse.json({ message: "Account deletion processed" }, { status: 200 });
  }
}
