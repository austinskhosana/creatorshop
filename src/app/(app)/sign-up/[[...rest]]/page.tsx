import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <AuthShell tagline="Barter your services for software subscriptions">
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  );
}
