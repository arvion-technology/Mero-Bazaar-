import { NextRequest, NextResponse } from "next/server";

const CATEGORY_MAP: Record<string, string> = {
  Furniture: "FURNITURE",
  Appliance: "APPLIANCES",
  Clothing: "CLOTHING",
  Books: "BOOKS",
  Baby: "BABY",
  Sports: "SPORTS",
  Instruments: "INSTRUMENTS",
};

const CONDITION_MAP: Record<string, string> = {
  "Like New": "LIKE_NEW",
  Good: "GOOD",
  Fair: "FAIR",
  Poor: "FOR_PARTS",
};

function toIsoDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split("/");
  return new Date(`${y}-${m}-${d}`).toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const raw = await req.json();

    const transformed = {
      category: CATEGORY_MAP[raw.listing_type] ?? raw.listing_type,
      condition: CONDITION_MAP[raw.condition] ?? raw.condition,
      itemName: raw.item_name,
      price: Number(raw.price),
      isNegotiable: raw.negotiable,
      description: raw.description,
      city: raw.city ?? raw.location, 
      expiresAt: raw.expires_at
        ? toIsoDate(raw.expires_at)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
      photos: [], 
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/secondhand-goods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(transformed),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("secondhand-goods POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/secondhand-goods${queryString ? `?${queryString}` : ""}`
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("secondhand-goods GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}