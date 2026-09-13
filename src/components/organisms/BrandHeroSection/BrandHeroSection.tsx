import { Button } from "@/components/atoms/Button";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";

export default function BrandHeroSection() {
  return (
    <section className="bg-white px-6 pb-6 text-center sm:px-10 sm:pb-10 lg:px-16">
      <div className="mx-auto max-w-3xl pt-16 sm:pt-20">
        <h1 className="text-4xl leading-tight font-medium text-neutral-900 sm:text-5xl">
          Turn creators into your cheapest growth channel
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-neutral-500 sm:text-lg">
          Post a software drop, review pitches from creators, and pay in
          access instead of cash. No affiliate fees, no retainers.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" size="md" pill style={{ border: "none", boxShadow: "none" }}>
            Join Waitlist
          </Button>
          <Button variant="secondary" size="md" pill style={{ boxShadow: "none" }}>
            List your software
          </Button>
        </div>
      </div>

      <MeshGradientPanel className="mx-auto mt-10 flex w-full max-w-5xl items-center justify-center px-6 py-12 sm:mt-16 sm:px-0 sm:py-24">
        <BrandCardVisual />
      </MeshGradientPanel>
    </section>
  );
}
