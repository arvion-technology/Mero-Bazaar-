import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Pass through the reauthentication proof (currentPassword or OTP).
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/api/user/profile/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to delete account" },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("delete-account proxy error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
