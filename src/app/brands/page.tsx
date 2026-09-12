import { Navbar } from "@/components/organisms/Navbar";
import { BrandMomentSection } from "@/components/organisms/BrandMomentSection";
import { BrandHeroSection } from "@/components/organisms/BrandHeroSection";
import { FeatureGridSection } from "@/components/organisms/FeatureGridSection";
import { PricingSection } from "@/components/organisms/PricingSection";
import { BrandFAQSection } from "@/components/organisms/BrandFAQSection";
import { Footer } from "@/components/organisms/Footer";

export default function BrandsPage() {
  return (
    <div>
      <Navbar />
      <BrandHeroSection />
      <BrandMomentSection />
      <FeatureGridSection />
      <PricingSection />
      <BrandFAQSection />
      <Footer />
    </div>
  );
}
