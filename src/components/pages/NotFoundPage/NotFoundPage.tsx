import { EmptyCompass } from "@/components/atoms/EmptyCompass";
import { EmptyState } from "@/components/molecules/EmptyState";

interface NotFoundAction {
  label: string;
  href: string;
}

interface NotFoundPageProps {
  /** Where to send people instead. Defaults to the creator side of the app. */
  action?: NotFoundAction;
  secondaryAction?: NotFoundAction;
}

/** The 404: a missing listing, profile, shop or any URL the app doesn't know. */
export default function NotFoundPage({
  action = { label: "Browse the shop", href: "/explore" },
  secondaryAction = { label: "Go home", href: "/" },
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <h1 className="sr-only">404: page not found</h1>
      <EmptyState
        framed={false}
        illustration={<EmptyCompass />}
        title="Page not found"
        description="This link may be broken, or the page may have moved."
        action={action}
        secondaryAction={secondaryAction}
      />
    </div>
  );
}
