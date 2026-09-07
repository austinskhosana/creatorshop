import { HeroSection } from "@/components/organisms/HeroSection";
import { NextSection } from "@/components/organisms/NextSection";
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection";
import { FAQSection } from "@/components/organisms/FAQSection";
import { Footer } from "@/components/organisms/Footer";

export default function Home() {
  return (
    <>
      <div>
        <HeroSection />
        <NextSection />
        <HowItWorksSection />
      </div>
      <FAQSection />
      <Footer />
    </>
  );
}
