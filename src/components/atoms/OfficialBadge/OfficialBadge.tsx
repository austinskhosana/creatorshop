import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

interface OfficialBadgeProps {
  className?: string;
}

/** Marks an account run by the Creatorshop team, so creators can tell official messages from impersonators. */
export default function OfficialBadge({ className }: OfficialBadgeProps) {
  return (
    <span role="img" aria-label="Official Creatorshop account" title="Official Creatorshop account" className={cn("inline-flex shrink-0 text-neutral-900", className)}>
      <CheckBadgeIcon aria-hidden="true" className="size-4" />
    </span>
  );
}
