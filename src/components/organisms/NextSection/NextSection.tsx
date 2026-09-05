import { Button } from "@/components/atoms/Button";

export default function NextSection() {
  return (
    <section className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center bg-[#a2ff38] px-6 text-center">
      <h2 className="font-pixel max-w-4xl text-4xl leading-tight text-black sm:text-5xl">
        Ditch the subscription. You&apos;re too hot to pay for software.
      </h2>
      <p className="mt-6 max-w-xl font-mono text-sm text-black/70 sm:text-base">
        Apply to software access listings and if brands approve, you can pay
        using content you create for the brand. No cash required.
      </p>
      <Button
        variant="dark"
        size="lg"
        pill
        className="mt-8 min-w-[160px]"
        style={{ boxShadow: "none", fontWeight: 400, color: "#A3FF38" }}
      >
        Sign Up
      </Button>
    </section>
  );
}
