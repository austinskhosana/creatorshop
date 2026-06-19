import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthShell tagline="Welcome back">
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  );
}
