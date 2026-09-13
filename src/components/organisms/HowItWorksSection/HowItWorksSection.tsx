import { PosterCard } from "@/components/molecules/PosterCard";

const STEPS = [
  {
    step: "01",
    model: "/models/floppy-disk.glb",
    title: "BROWSE THE DROP",
    description: "Explore software\nsubscription listings from\nbrands seeking creators.",
  },
  {
    step: "02",
    model: "/models/pitch-bag.glb",
    title: "APPLY TO SHOP",
    description: "Apply to pay with a post\nif the brand approves, go ahead and pay",
  },
  {
    step: "03",
    model: "/models/deliver-symbol.glb",
    title: "PAY WITH A POST",
    description: "Create and deliver the\ncontent, unlock your access.\nNo cash required.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative z-20 flex flex-col justify-start bg-white px-6 pt-28 pb-16 sm:sticky sm:top-0 sm:h-screen sm:px-10 sm:pt-36 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-center font-pixel text-2xl text-neutral-900 sm:text-3xl lg:text-5xl">How it works</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-3">
          {STEPS.map((s) => (
            <PosterCard key={s.step} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
