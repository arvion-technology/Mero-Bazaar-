import HeroSection from "@/components/HeroSection";
import BrowseCategories from "@/components/BrowseCategories";
import FeaturedListings from "@/components/FeaturedListings";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrowseCategories />
      <FeaturedListings />
    </main>
  );
}