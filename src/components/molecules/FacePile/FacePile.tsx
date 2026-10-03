import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FacePilePerson {
  name: string;
  avatar?: string;
}

interface FacePileProps {
  people: FacePilePerson[];
  /** Faces drawn before the rest collapse into a "+N" chip. */
  max?: number;
  /** Diameter in px. */
  size?: number;
  /** Ring colour matching the surface behind the pile, so each overlap reads as a clean cut. */
  ringClassName?: string;
  className?: string;
}

/** How much each face tucks under the one before it, as a share of its diameter. */
const OVERLAP = 0.22;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Overlapping avatars for "who's waiting": the first few faces, then a count of the rest. */
export default function FacePile({ people, max = 4, size = 32, ringClassName = "ring-white", className }: FacePileProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const label = rest > 0 ? `${shown.map((person) => person.name).join(", ")} and ${rest} more` : shown.map((person) => person.name).join(", ");
  const face = cn("relative shrink-0 overflow-hidden rounded-full ring-2", ringClassName);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.34) };

  return (
    <div role="img" aria-label={label} className={cn("flex items-center", className)} style={{ paddingLeft: size * OVERLAP }}>
      {shown.map((person) => (
        <span key={person.name} className={face} style={{ ...style, marginLeft: -size * OVERLAP }}>
          {person.avatar ? (
            <Image src={person.avatar} alt="" width={size} height={size} className="size-full bg-neutral-100 object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center bg-neutral-900 font-semibold text-white">{initials(person.name)}</span>
          )}
        </span>
      ))}
      {rest > 0 ? (
        <span className={cn(face, "flex items-center justify-center bg-neutral-950 font-semibold tabular-nums text-white")} style={{ ...style, marginLeft: -size * OVERLAP }}>
          +{rest}
        </span>
      ) : null}
    </div>
  );
}
