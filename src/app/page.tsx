import { HeroSection } from "@/components/organisms/HeroSection";
import { NextSection } from "@/components/organisms/NextSection";
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection";
import { FAQSection } from "@/components/organisms/FAQSection";
import { Footer } from "@/components/organisms/Footer";

const MODEL_URLS = [
  "/models/symbol-3d.glb",
  "/models/floppy-disk.glb",
  "/models/pitch-bag.glb",
  "/models/deliver-symbol.glb",
];

export default function Home() {
  return (
    <>
      {/* Warms the HTTP cache for the 3D symbols this page renders — they're
          small now (~150-275KB each after compression), so fetching all four
          up front means each Logo3D's model is already cached by the time
          its section scrolls into view, instead of starting the fetch then. */}
      {MODEL_URLS.map((url) => (
        <link key={url} rel="prefetch" href={url} as="fetch" crossOrigin="anonymous" />
      ))}
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
