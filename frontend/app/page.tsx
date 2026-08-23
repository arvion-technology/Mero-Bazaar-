import HeroSection from "@/components/HeroSection";
import BrowseCategories from "@/components/BrowseCategories";
import FeaturedListings from "@/components/FeaturedListings";
import StatsAndAppBanner from "@/components/StatsAndAppBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrowseCategories />
      <FeaturedListings />
      <StatsAndAppBanner />
      <Footer />
    </main>
  );
}