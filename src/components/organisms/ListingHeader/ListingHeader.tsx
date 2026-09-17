import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Badge from "@/components/atoms/Badge/Badge";

interface ListingHeaderProps {
  slug: string;
  brandName: string;
  title: string;
  description: string;
  category?: string | null;
  align?: "left" | "center";
}

export default function ListingHeader({ slug, brandName, title, description, category, align = "center" }: ListingHeaderProps) {
  const isLeftAligned = align === "left";

  return (
    <div className={`flex flex-col ${isLeftAligned ? "items-start text-left" : "items-center text-center"}`}>
      <BrandLogo slug={slug} name={brandName} size={64} />
      {category && (
        <div className="mt-4">
          <Badge variant="tag" label={category} />
        </div>
      )}
      <h1 className="mt-3 text-balance text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h1>
      <p className={`text-pretty mt-2 text-[14px] leading-[1.55] text-neutral-500 ${isLeftAligned ? "max-w-md" : "max-w-sm"}`}>{description}</p>
    </div>
  );
}
