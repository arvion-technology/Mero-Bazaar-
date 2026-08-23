import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

<<<<<<< HEAD
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
=======
  try {
    const res = await fetch(`${API_URL}/api/user/profile/me`, {
      method: "DELETE",
      headers: { Authorization: authHeader },
>>>>>>> origin/aashika
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
<<<<<<< HEAD
    console.error("delete-account proxy error:", err instanceof Error ? err.message : err);
=======
    console.error("delete-account proxy error:", err);
>>>>>>> origin/aashika
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
