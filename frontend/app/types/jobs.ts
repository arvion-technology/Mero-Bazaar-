export const JOB_TYPES = ["Full-time", "Part-time", "Gig/Freelance", "Labour", "Domestic"];
export const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];
export const SKILLS = ["Sales", "Accounting", "Design", "Marketing", "IT & Software", "Construction", "Riding", "Delivery", "Finance"];

export interface JobListing {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
  images?: string[];

  job: {
    salaryMin: number;
    salaryMax: number;
    payPeriod: string;
    city: string;
    contractType: string;
    views?: number;
    skillTags?: string[];
    experienceLevel?: string;
    educationLevel?: string;
    vacancies?: number;
    requirements?: string[];
    benefits?: string[];
  };

  user?: {
    name?: string;
    isVerified?: boolean;
    vendorProfile?: {
      businessName?: string;
      rating?: number;
      website?: string;
    };
  };
}

export interface JobCard {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  district: string;
  type: string;
  thumb: string;
  skills: string[];
  category: string;
  minSalary: number;
  maxSalary: number;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}