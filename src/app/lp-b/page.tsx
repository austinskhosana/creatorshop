import { HeroSectionB } from "@/components/organisms/HeroSectionB";
import { NextSectionB } from "@/components/organisms/NextSectionB";
import { HowItWorksSectionB } from "@/components/organisms/HowItWorksSectionB";
import { FAQSectionB } from "@/components/organisms/FAQSectionB";
import { Footer } from "@/components/organisms/Footer";

const MODEL_URLS = [
  "/models/symbol-3d.glb",
  "/models/floppy-disk.glb",
  "/models/pitch-bag.glb",
  "/models/deliver-symbol.glb",
];

// A/B variant B of the creator landing page. Mirrors src/app/page.tsx but
// renders its own copies of the section components (…SectionB) so edits
// here never affect the original at "/". Keep Footer shared — it's used
// site-wide, not landing-page-specific.
export default function LandingVariantB() {
  return (
    <>
      {MODEL_URLS.map((url) => (
        <link key={url} rel="prefetch" href={url} as="fetch" crossOrigin="anonymous" />
      ))}
      <div>
        <HeroSectionB />
        <NextSectionB />
        <HowItWorksSectionB />
      </div>
      <FAQSectionB />
      <Footer />
    </>
  );
}
