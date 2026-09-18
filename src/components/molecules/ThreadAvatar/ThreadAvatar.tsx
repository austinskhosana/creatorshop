import Image from "next/image";
import Avatar from "@/components/atoms/Avatar/Avatar";
import { cn } from "@/lib/utils";

interface ThreadAvatarProps {
  name: string;
  image?: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const imageSizes = { sm: 36, md: 40, lg: 44 };

export default function ThreadAvatar({ name, image, online, size = "md", className }: ThreadAvatarProps) {
  const px = imageSizes[size];
  const radius = Math.round(px * 0.23);

  return (
    <div className={cn("relative shrink-0", className)}>
      {image ? (
        <div
          aria-label={`${name} logo`}
          className="overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          style={{ height: px, width: px, borderRadius: radius }}
        >
          <Image src={image} alt="" width={px} height={px} className="h-full w-full object-cover" />
        </div>
      ) : (
        <Avatar name={name} size={size} className="border-0 ring-0" />
      )}
      {online ? (
        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-[#A3FF38]" />
      ) : null}
    </div>
  );
}
