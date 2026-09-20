import type { FeaturedCard } from '@/app/types/featured';

export function resolveCardMeta(listing: FeaturedCard['listing']) {
  switch (listing.category) {
    case 'VEHICLE':
      return {
        priceLabel: 'Asking',
        priceText: `Rs. ${listing.price?.toLocaleString()}`,
        subtitle: listing.vehicle
          ? `${listing.vehicle.year} · ${listing.vehicle.km_driven.toLocaleString()} km`
          : null,
        city: listing.location,
      };
    case 'RENTAL':
      return {
        priceLabel: listing.rental?.listingType === 'SALE' ? 'Asking' : 'Rent',
        priceText: `Rs. ${listing.rental?.monthlyRent.toLocaleString()}${listing.rental?.listingType === 'RENT' ? ' / month' : ''}`,
        subtitle: listing.rental ? `${listing.rental.bedrooms ?? '–'} Beds · ${listing.rental.bathrooms ?? '–'} Baths` : null,
        city: listing.rental?.city ?? listing.location,
      };
    case 'JOB':
      return {
        priceLabel: 'Salary',
        priceText: listing.job
          ? `Rs. ${listing.job.salaryMin.toLocaleString()} – ${listing.job.salaryMax.toLocaleString()}`
          : null,
        subtitle: listing.job?.contractType.replace('_', ' '),
        city: listing.job?.city ?? listing.location,
        muted: true, // salary is money TO the user, not a price to pay — de-emphasise
      };
    case 'MEDICAL':
      return {
        priceLabel: 'Fee',
        priceText: `Rs. ${listing.medical?.appointmentFee.toLocaleString()}`,
        subtitle: listing.medical?.serviceType.replace(/_/g, ' '),
        city: listing.medical?.city ?? listing.location,
      };
    case 'TRADES':
      return {
        priceLabel: 'Call-out',
        priceText: `Rs. ${listing.trades?.calloutCharge.toLocaleString()}`,
        subtitle: listing.trades?.emergencyAvailable ? 'Emergency available' : null,
        city: listing.trades?.city ?? listing.location,
      };
    case 'BEAUTY':
      return {
        priceLabel: listing.beauty?.priceStartingFrom ? 'From' : 'Price',
        priceText: `Rs. ${listing.beauty?.price.toLocaleString()}`,
        subtitle: listing.beauty?.serviceType.replace(/_/g, ' '),
        city: listing.beauty?.city ?? listing.location,
      };
    case 'FOODS':
      return {
        priceLabel: 'Price',
        priceText: `Rs. ${listing.foods?.price.toLocaleString()} / ${listing.foods?.priceUnit.replace('PER_', '').toLowerCase()}`,
        subtitle: listing.foods?.foodType.replace('_', ' '),
        city: listing.location,
      };
    case 'AGRICULTURE':
      return {
        priceLabel: 'Price',
        priceText: `Rs. ${listing.agriculture?.pricePerUnit.toLocaleString()} / ${listing.agriculture?.unit.toLowerCase()}`,
        subtitle: listing.agriculture?.district,
        city: listing.agriculture?.district ?? listing.location,
      };
    case 'SECONDHAND':
      return {
        priceLabel: listing.secondhand?.isNegotiable ? 'Negotiable' : 'Price',
        priceText: `Rs. ${listing.secondhand?.price.toLocaleString()}`,
        subtitle: listing.secondhand?.condition.replace('_', ' '),
        city: listing.secondhand?.city ?? listing.location,
      };
    default:
      return { priceLabel: 'Price', priceText: listing.price ? `Rs. ${listing.price}` : null, subtitle: null, city: listing.location };
  }
}