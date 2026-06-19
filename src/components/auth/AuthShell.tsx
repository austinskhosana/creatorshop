import Logo from "@/components/ui/Logo";

export default function AuthShell({
  tagline,
  children,
}: {
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAFB] px-4 py-12">
      {/* Faint dot grid + soft lime glow — quiet enough not to compete with the auth card */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div
        aria-hidden="true"
        className="animate-float absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#A3FF38]/30 blur-3xl"
        style={{ "--card-rotate": "0deg" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="animate-float absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#A3FF38]/20 blur-3xl"
        style={{ animationDelay: "1.5s" } as React.CSSProperties}
      />

      <div className="animate-fade-up relative flex flex-col items-center gap-8 w-full">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo height={40} />
          <p className="text-sm text-gray-500">{tagline}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
