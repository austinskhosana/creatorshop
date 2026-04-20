import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding",
  "/profile/(.*)",       // public creator profiles
  "/api/webhooks/(.*)",  // Clerk webhook — never gate this
  "/card-preview",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Not signed in → send to sign-in, return after
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Signed in but hasn't picked a role yet → send back to onboarding
  // API routes are exempt so they don't create a redirect loop
  if (
    !sessionClaims?.metadata?.onboardingComplete &&
    !req.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
