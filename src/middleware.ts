import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/explore(.*)",
  "/software/(.*)",
  "/profile/(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Redirect signed-in users who haven't completed onboarding
  const { userId, sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as
    | { role?: string; onboardingComplete?: boolean }
    | undefined;
  if (userId && !metadata?.onboardingComplete) {
    const url = req.nextUrl;
    if (!url.pathname.startsWith("/onboarding") && !url.pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
