import HeroSection from "@/components/HeroSection";
import BrowseCategories from "@/components/BrowseCategories";
import FeaturedListings from "@/components/FeaturedListings";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrowseCategories />
      <FeaturedListings />
      <Footer />
    </main>
  );
}