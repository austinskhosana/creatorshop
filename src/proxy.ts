import { clerkMiddleware, clerkClient, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/explore(.*)",
  "/software/(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect root to sign-in (unauthenticated) or dashboard (authenticated)
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(userId ? "/explore" : "/sign-in", req.url)
    );
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  if (userId) {
    const url = req.nextUrl;
    if (!url.pathname.startsWith("/onboarding") && !url.pathname.startsWith("/api")) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const onboardingComplete = user.publicMetadata?.onboardingComplete;
      if (!onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
