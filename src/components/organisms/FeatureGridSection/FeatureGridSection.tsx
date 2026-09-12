import Image from "next/image";

interface FeatureTileProps {
  title: string;
  description: string;
}

function FeatureTile({ title, description }: FeatureTileProps) {
  return (
    <div className="flex aspect-square flex-col rounded-[32px] bg-[#FAFAFA] pt-6 pr-6 pb-10 pl-9 text-left">
      <div className="mt-auto">
        <h3 className="text-xl leading-tight font-medium tracking-tight text-neutral-900">
          {title}
        </h3>
        <p className="mt-3 leading-relaxed text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

export default function FeatureGridSection() {
  return (
    <section className="bg-white px-6 pt-48 pb-32 text-center sm:px-10 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl leading-tight font-medium text-neutral-900 sm:text-3xl">
          Everything you need to run a drop
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-neutral-500">
          From listing your software to reviewing pitches and tracking
          delivery, manage the whole campaign in one place.
        </p>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-[32px] bg-[#FAFAFA] p-3 pt-10">
          <div className="relative aspect-[1768/960] w-full overflow-hidden rounded-[24px]">
            <Image
              src="/Creator List.png"
              alt="List of creators pitching for a drop"
              fill
              className="object-contain"
            />
          </div>
          <div className="px-3 pt-16 pb-4 pl-6 text-left">
            <h3 className="text-xl leading-tight font-medium tracking-tight text-neutral-900 sm:text-2xl">
              Real creators, real audiences
            </h3>
            <p className="mt-3 max-w-xs leading-relaxed text-neutral-500">
              Not influencer agencies. Not AI UGC. Actual people who want your
              product.
            </p>
          </div>
        </div>

        <FeatureTile
          title="List in minutes"
          description="No approval queue. Set your plan, seats, and how many posts you want back. Live the same day."
        />

        <FeatureTile
          title="You choose who gets in"
          description="Every pitch reviewed by you, not an algorithm. Nothing goes out until you approve it."
        />

        <FeatureTile
          title="Pay in access, not cash"
          description="No affiliate cuts. No retainers. No invoices to chase."
        />
      </div>
    </section>
  );
}
