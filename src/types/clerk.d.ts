export {};

declare global {
  interface ClerkAuthorization {
    permission: "";
    role: "";
  }
}

// Extend Clerk's session claims to include our custom metadata
declare module "@clerk/nextjs/server" {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "CREATOR" | "BRAND" | "BOTH";
      onboardingComplete?: boolean;
    };
  }
}
