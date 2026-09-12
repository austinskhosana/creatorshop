import { Button } from "@/components/atoms/Button";
import { Fire } from "@/components/atoms/Fire";
import { Logo3D } from "@/components/atoms/Logo3D";

export default function BrandMomentSection() {
  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 pb-24 text-center sm:px-10 lg:px-16">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        <Logo3D className="h-56 w-56 sm:h-64 sm:w-64" spinWithScroll />
        <div className="max-w-2xl">
          <h2 className="text-2xl leading-tight font-medium text-neutral-900 sm:text-3xl">
            Built for creator led software distribution
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-neutral-500">
            Building got easy, distribution is the new game, Create and manage
            campaigns that get eyes and your tool.
          </p>
          <Button
            variant="primary"
            size="md"
            pill
            className="mt-10"
            style={{ border: "none", boxShadow: "none" }}
          >
            Join Waitlist
          </Button>
        </div>
      </div>

      <Fire
        background="#ffffff"
        rows={90}
        widthPercent={100}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full"
      />
    </section>
  );
}
