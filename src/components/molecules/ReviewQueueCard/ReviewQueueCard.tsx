import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { FacePile, type FacePilePerson } from "@/components/molecules/FacePile";
import { cn } from "@/lib/utils";

interface ReviewQueueCardProps {
  /** Shoppers waiting on a decision, newest first. */
  people: FacePilePerson[];
  href: string;
  /** Where to go when nobody is waiting, e.g. the creator directory. */
  emptyHref: string;
  label?: string;
}

function firstName(person: FacePilePerson) {
  return person.name.split(" ")[0];
}

function waitingLine(people: FacePilePerson[]) {
  if (people.length === 1) return `${firstName(people[0])} wants to pay with a post.`;
  if (people.length === 2) return `${firstName(people[0])} and ${firstName(people[1])} want to pay with a post.`;
  return `${firstName(people[0])}, ${firstName(people[1])} and ${people.length - 2} more want to pay with a post.`;
}

/**
 * The one number a brand acts on first. The lime pill is the action; once the queue is clear the
 * number goes quiet and the pill points to the directory instead.
 */
export default function ReviewQueueCard({ people, href, emptyHref, label = "Shoppers to review" }: ReviewQueueCardProps) {
  const count = people.length;
  const waiting = count > 0;

  return (
    <Link
      href={waiting ? href : emptyHref}
      className="group flex min-h-[148px] flex-col justify-between gap-8 rounded-[20px] border border-neutral-200 bg-white p-6 text-left transition-[border-color,transform] duration-150 hover:border-neutral-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-neutral-600">{label}</p>
        <span className="flex h-8 items-center gap-1 rounded-full bg-[#A3FF38] pr-2.5 pl-3 text-xs font-medium text-neutral-950">
          {waiting ? "Review" : "Find creators"}
          <ArrowRightIcon aria-hidden="true" className="size-3.5 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className={cn("text-[44px] leading-none font-bold tracking-[-0.04em]", waiting ? "text-neutral-950" : "text-neutral-300")}>{count}</p>
          <p className="mt-3 text-pretty text-[13px] leading-snug text-neutral-500">
            {waiting ? waitingLine(people) : "Nobody's waiting. Invite creators who fit your product."}
          </p>
        </div>
        {waiting ? <FacePile people={people} max={4} size={36} className="mb-0.5 shrink-0" /> : null}
      </div>
    </Link>
  );
}
