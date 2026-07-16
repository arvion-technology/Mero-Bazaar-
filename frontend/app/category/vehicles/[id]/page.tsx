import Link from "next/link";
import { fetchListing, fetchRelatedListings } from "../../../../lib/fetcher";

import ImageGallery from "./components/shared/ImageGallery";
import ListingInfo from "./components/shared/ListingInfo";
import ListingDescription from "./components/shared/ListingDescription";
import SellerCard from "./components/shared/SellerCard";
import RelatedListings from "./components/shared/RelatedListings";
import VehicleDetails from "./components/category-detail/VehicleDetails";
import BuyNowButton from "@/components/BuyNowButton";

import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const listing = await fetchListing(id);
  console.log("ID:", id);
  console.log("Listing:", listing);
  if (!listing) notFound();

  const related = await fetchRelatedListings(listing.category, listing.id);

  return (
    <>
      <div className="ld-topbar">
        <div className="ld-topbar-inner">
          <nav className="ld-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="ld-bc-link">Home</Link>
            <span className="ld-bc-sep">›</span>
            <Link href="/category/vehicles" className="ld-bc-link">Vehicles</Link>

            {listing.breadcrumbs.slice(1).map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="ld-bc-sep">›</span>
                <span className="ld-bc-current">{crumb}</span>
              </span>
            ))}

            <span className="ld-bc-sep">›</span>
            <span className="ld-bc-current" style={{ color: "#1a1a1a", fontWeight: 600 }}>
              {listing.title}
            </span>
          </nav>

          <a href="#report" className="ld-report">Report this listing</a>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="ld-container">

        <div className="ld-left">
          <ImageGallery images={listing.images} title={listing.title} />

          <ListingInfo
            title={listing.title}
            price={listing.price}
            negotiable={listing.negotiable}
            driven={listing.driven}
            postedDaysAgo={listing.postedDaysAgo}
            isVerified={listing.isVerified}
            specs={listing.specs}
            latitude={listing.latitude}
            longitude={listing.longitude}
            listingId={listing.id}
          />

          <ListingDescription description={listing.description} />

          <VehicleDetails 
          type={listing.vehicleType ?? undefined}
          details={listing.details ?? {}} />
        </div>

        <div className="ld-right">
        <BuyNowButton                                 
          listingId={listing.id}
          price={listing.price}
          status={listing.status}
        />
        <SellerCard
          seller={listing.seller}
          reviews={listing.reviews}
          listingId={listing.id}
          sellerId={listing.sellerId}
        />
          {/* <LocationCard
            location={listing.location}
            distanceFrom={listing.distanceFrom}
            googleMapsUrl={listing.googleMapsUrl}
          /> */}
        </div>
      </div>

      <RelatedListings listings={related} />
    </>
  );
}