import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** The standard bordered surface used by creator-area pages. */
export default function CreatorSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[20px] border border-neutral-200 bg-white", className)} {...props} />;
}
