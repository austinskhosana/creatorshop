interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={[
          "rounded-full object-cover border border-gray-200",
          sizes[size],
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold border border-gray-200",
        sizes[size],
        className,
      ].join(" ")}
    >
      {getInitials(name)}
    </div>
  );
}
