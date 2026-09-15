import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";

interface PromoBannerProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PromoBanner({ eyebrow, title, description }: PromoBannerProps) {
  return (
    <div className="relative isolate flex flex-col justify-center gap-4 overflow-hidden rounded-2xl border border-black/10 p-8">
      <TerminalgraphShader
        theme="light"
        background={{ dark: "#052e12", light: "#ffffff" }}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="max-w-lg">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[12px] font-medium text-neutral-700 ring-1 ring-neutral-200">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#3A7A00]" />
          {eyebrow}
        </span>
        <h2 className="text-balance mt-3 text-2xl font-semibold text-neutral-900 sm:text-3xl">{title}</h2>
        <p className="text-pretty mt-2 text-[14px] leading-relaxed text-neutral-600">{description}</p>
      </div>
    </div>
  );
}
