import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        reviews: true,
        vehicle: true,
      },
    });

    if (!listing) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}