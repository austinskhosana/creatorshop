import Image from "next/image";
import { Logo3D } from "@/components/atoms/Logo3D";

interface PosterCardProps {
  step: string;
  art?: string;
  image?: string;
  model?: string;
  title: string;
  description: string;
}

export default function PosterCard({ step, art, image, model, title, description }: PosterCardProps) {
  return (
    <div className="flex flex-col bg-[#A3FF38] p-6 pb-14 sm:p-8 sm:pb-20">
      <span className="font-mono text-xs tracking-[0.2em] text-black/50">{step}</span>
      {model ? (
        <div className="mt-6 mb-10 flex items-center justify-center sm:mb-14">
          <Logo3D modelUrl={model} spinSpeed={0.628} className="h-40 w-40 sm:h-48 sm:w-48" />
        </div>
      ) : image ? (
        <div className="relative mt-6 mb-10 h-40 w-full overflow-hidden rounded-xl sm:mb-14 sm:h-48">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <pre className="mt-6 mb-10 flex min-h-24 items-center justify-center font-mono text-[8px] leading-[1.15] text-black sm:mb-14 sm:min-h-28 sm:text-[9px]">
          {art}
        </pre>
      )}
      <div className="text-center">
        <h3 className="font-pixel text-xl leading-tight whitespace-nowrap text-black sm:text-[clamp(0.65rem,1.6vw,1.125rem)]">
          {title}
        </h3>
        <p className="mt-3 font-mono text-sm leading-relaxed whitespace-pre-line text-black/70">
          {description}
        </p>
      </div>
    </div>
  );
}
