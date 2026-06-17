import type { JobDetail } from "@/app/types/listing";
import type { JobCard, JobListing } from "@/app/types/jobs";

export function toContractType(label: string): string {
  const map: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Gig/Freelance": "GIG",
    "Labour": "LABOUR",
    "Domestic": "DOMESTIC",
  };
  return map[label] ?? label;
}

export function toTypeLabel(contractType: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    GIG: "Gig/Freelance",
    LABOUR: "Labour",
    DOMESTIC: "Domestic",
  };
  return map[contractType] ?? contractType;
}

export function toJobCard(listing: JobListing): JobCard {
  const job = listing.job;
  if (!job) throw new Error(`Listing ${listing.id} has no job relation`);

  return {
    id: listing.id,
    title: listing.title,
    company: listing.user?.vendorProfile?.businessName ?? "Unknown",
    salary: `NPR ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}/${job.payPeriod.toLowerCase()}`,
    location: `${job.city}, Nepal`,
    district: job.city,
    type: job.contractType,
    thumb: listing.images?.[0] ?? "/job1.jpg",
    skills: job.skillTags ?? [],
    category: job.contractType,
    minSalary: job.salaryMin,
    maxSalary: job.salaryMax,
    postedDaysAgo: Math.floor(
      (Date.now() - new Date(listing.createdAt).getTime()) / 86400000
    ),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
  };
}
export function toJobDetail(listing: JobListing): JobDetail {
  const job = listing.job;
  if (!job) throw new Error(`Listing ${listing.id} has no job relation`);

  return {
    id: listing.id,
    jobId: `#JOB${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    salary: `NPR ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}/${job.payPeriod.toLowerCase()}`,
    location: `${job.city}, Nepal`,
    distanceFrom: "",
    type: toTypeLabel(job.contractType),
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
    views: job.views ?? 0,
    experience: job.experienceLevel ?? "Not specified",
    education: job.educationLevel ?? "Not specified",
    vacancies: job.vacancies ?? 1,
    postedDate: new Date(listing.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
    breadcrumbs: ["Job", job.contractType],
    images: listing.images?.length ? listing.images : ["/job1.jpg"],
    description: listing.description ?? "",
    requirements: job.requirements ?? [],
    benefits: job.benefits ?? [],
    lat: listing.latitude ?? 27.7172,
    lng: listing.longitude ?? 85.3240,
    company: {
      name: listing.user?.vendorProfile?.businessName ?? "Unknown",
      logo: listing.images?.[0] ?? "/job1.jpg",
      rating: listing.user?.vendorProfile?.rating ?? 0,
      reviewCount: 0,
      industry: job.contractType,
      size: "",
      website: listing.user?.vendorProfile?.website ?? "",
      location: `${job.city}, Nepal`,
    },
    postedBy: {
      name: listing.user?.name ?? "Unknown",
      avatar: "/lady.jpg",
      rating: 0,
      reviewCount: 0,
      isVerified: listing.user?.isVerified ?? false,
    },
  };
}