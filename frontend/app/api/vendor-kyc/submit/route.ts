import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const formData = await req.formData();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor-kyc/submit`, {
      method: "POST",
      headers: {
        Authorization: authHeader || "",
      },
      body: formData,
    });

    const data = await res.json();
<<<<<<< HEAD
    // Never log the KYC response: it contains PAN, bank, contact and document PII.
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("vendor-kyc/submit error:", err instanceof Error ? err.message : err);
=======
    console.log("vendor-kyc/submit response:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("vvendor-kyc/submit error:", err); 
>>>>>>> origin/aashika
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}