// Legacy/fallback route: looks up the listing's category, then redirects
// to the real detail page under /category/<slug>/<id>.
import { notFound, redirect } from "next/navigation";

const CATEGORY_SLUG: Record<string, string> = {
  VEHICLE: "vehicles",
  RENTAL: "rent-and-real-estate",
  REALESTATE: "rent-and-real-estate",
  JOB: "job",
  MEDICAL: "medical",
  TRADES: "trade-and-homerepair",
  TRADE: "trade-and-homerepair",
  BEAUTY: "beauty",
  SECONDHAND: "secondhand",
  FOOD: "food",
  FOODS: "food",
  AGRICULTURE: "agriculture-and-livestock",
  LIVESTOCK: "agriculture-and-livestock",
};

// Normalizes "REAL_ESTATE", "real-estate", "RealEstate" before lookup.
function slugFor(category?: string | null): string | null {
  if (!category) return null;
  return CATEGORY_SLUG[category.toUpperCase().replace(/[^A-Z]/g, "")] ?? null;
}

export default async function ListingRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category: string | undefined;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[listing redirect] backend returned", res.status, "for", id);
      notFound();
    }

    ({ category } = (await res.json()) as { category?: string });
  } catch (err) {
    // notFound() throws a special error too;
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[listing redirect] fetch failed:", err);
    notFound();
  }

  const slug = slugFor(category);
  if (!slug) {
    console.error("[listing redirect] no route for category:", category);
    notFound();
  }

  redirect(`/category/${slug}/${id}`);
}