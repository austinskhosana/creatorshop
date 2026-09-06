interface PosterCardProps {
  step: string;
  art: string;
  title: string;
  description: string;
}

export default function PosterCard({ step, art, title, description }: PosterCardProps) {
  return (
    <div className="flex flex-col bg-[#A3FF38] p-6 sm:p-8">
      <span className="font-mono text-xs tracking-[0.2em] text-black/50">{step}</span>
      <pre className="my-6 flex min-h-24 items-center justify-center font-mono text-[8px] leading-[1.15] text-black sm:min-h-28 sm:text-[9px]">
        {art}
      </pre>
      <div>
        <h3 className="font-pixel text-2xl leading-tight whitespace-pre-line text-black sm:text-[28px]">
          {title}
        </h3>
        <p className="mt-3 font-mono text-sm leading-relaxed whitespace-pre-line text-black/70">
          {description}
        </p>
      </div>
    </div>
  );
}
