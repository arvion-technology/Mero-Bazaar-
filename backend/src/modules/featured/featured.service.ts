import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  FeaturedSlot,
  FeaturedTier,
  ListingCategory,
  ListingStatus,
  PlacementStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const TIER_RANK: Record<FeaturedTier, number> = {
  PLATINUM: 0,
  GOLD: 1,
  STANDARD: 2,
};

/** Only what the home-page card needs. Keep narrow. */
const CARD_SELECT = {
  id: true,
  title: true,
  price: true,
  category: true,
  location: true,
  images: true,
  status: true,
  createdAt: true,
  user: { select: { id: true, name: true, isVerified: true, isActive: true } },
  vehicle: { select: { year: true, km_driven: true, condition: true } },
  job: { select: { salaryMin: true, salaryMax: true, payPeriod: true, contractType: true, city: true } },
  rental: { select: { monthlyRent: true, bedrooms: true, bathrooms: true, listingType: true, city: true } },
  medical: { select: { appointmentFee: true, serviceType: true, city: true } },
  trades: { select: { calloutCharge: true, city: true, emergencyAvailable: true } },
  beauty: { select: { price: true, priceStartingFrom: true, serviceType: true, city: true } },
  foods: { select: { price: true, priceUnit: true, foodType: true } },
  agriculture: { select: { pricePerUnit: true, unit: true, district: true } },
  secondhand: { select: { price: true, condition: true, city: true, isNegotiable: true } },
} satisfies Prisma.ListingSelect;

type ListingCard = Prisma.ListingGetPayload<{ select: typeof CARD_SELECT }>;

export interface FeaturedCard {
  listing: ListingCard;
  isPromoted: boolean; 
  tier: FeaturedTier | null;
  placementId: string | null;
}

@Injectable()
export class FeaturedService {
  private readonly logger = new Logger(FeaturedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFeatured(
    { limit = 10, city, slot = FeaturedSlot.HOME_FEATURED }:
    { limit?: number; city?: string; slot?: FeaturedSlot } = {},
  ): Promise<FeaturedCard[]> {
    const now = new Date();

    // Eligibility lives in the query: a SOLD listing or a photo-less one
    const placements = await this.prisma.featuredPlacement.findMany({
      where: {
        slot,
        status: PlacementStatus.ACTIVE,
        startsAt: { lte: now },
        endsAt: { gt: now },
        listing: {
          status: ListingStatus.ACTIVE,
          images: { isEmpty: false },
          user: {
            isActive: true,
            vendorKyc: { status: 'VERIFIED' },
          },
        },
      },
      select: {
        id: true,
        tier: true,
        priority: true,
        startsAt: true,
        listing: { select: CARD_SELECT },
      },
      take: limit * 4,
    });

    placements.sort(
      (a, b) =>
        TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
        b.priority - a.priority ||
        a.startsAt.getTime() - b.startsAt.getTime(),
    );

    const picked: FeaturedCard[] = [];
    const usedSellers = new Set<string>();
    const usedCategories = new Set<ListingCategory>();

    const accept = (card: ListingCard) => {
      if (usedSellers.has(card.user.id)) return false;
      if (usedCategories.has(card.category)) return false;
      usedSellers.add(card.user.id);
      usedCategories.add(card.category);
      return true;
    };

    for (const p of placements) {
      if (picked.length >= limit) break;
      if (!accept(p.listing)) continue;
      picked.push({ listing: p.listing, isPromoted: true, tier: p.tier, placementId: p.id });
    }

    if (picked.length >= limit) return picked;

    // Backfill: fresh, photographed listings. Not labelled promoted. ---
    const backfill = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        images: { isEmpty: false },
        user: { isActive: true },
        id: { notIn: picked.map((c) => c.listing.id) },
        category: { notIn: [...usedCategories] },
        userId: { notIn: [...usedSellers] },
      },
      select: CARD_SELECT,
      orderBy: { createdAt: 'desc' },
      take: (limit - picked.length) * 4,
    });

    // City is a soft preference, never a hard filter — an empty rail is worse.
    const match = (l: ListingCard) =>
      !!city && !!this.cityOf(l)?.toLowerCase().includes(city.toLowerCase());
    const ranked = city
      ? [...backfill.filter(match), ...backfill.filter((l) => !match(l))]
      : backfill;

    for (const listing of ranked) {
      if (picked.length >= limit) break;
      if (!accept(listing)) continue;
      picked.push({ listing, isPromoted: false, tier: null, placementId: null });
    }

    return picked;
  }

  /** City sits on a different child table per category. */
  private cityOf(l: ListingCard): string | null {
    return (
      l.job?.city ??
      l.rental?.city ??
      l.medical?.city ??
      l.trades?.city ??
      l.beauty?.city ??
      l.secondhand?.city ??
      l.agriculture?.district ??
      l.location ??
      null
    );
  }

  /** Call from the eSewa success callback. */
  async activateFromPayment(paymentRef: string) {
    return this.prisma.featuredPlacement.update({
      where: { paymentRef },
      data: { status: PlacementStatus.ACTIVE },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expirePlacements() {
    const { count } = await this.prisma.featuredPlacement.updateMany({
      where: { status: PlacementStatus.ACTIVE, endsAt: { lte: new Date() } },
      data: { status: PlacementStatus.EXPIRED },
    });
    if (count) this.logger.log(`Expired ${count} featured placement(s)`);
  }
}