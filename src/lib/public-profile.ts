import type { Shopper } from "@/lib/data/brand-schema";
import type { CreatorProfile } from "@/lib/data/schema";
import { CREATOR, CREATOR_TRACK_RECORD } from "@/lib/mock-creator";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

/**
 * The signed-in creator's profile as brands receive it. The creator's own profile page renders this
 * through the same card brands swipe on, so nothing about how they're presented is a surprise.
 * Track record isn't editable: it stands in for connected-account stats and finished shops.
 */
export function toPublicProfile(profile: CreatorProfile): Shopper {
  return {
    id: profile.username,
    name: profile.displayName,
    handle: profile.username,
    avatar: profile.avatar || undefined,
    bio: profile.bio,
    niches: profile.niches,
    platforms: SOCIAL_PLATFORMS.flatMap(({ name }) => {
      const handle = profile.socials[name];
      return handle ? [{ name, handle, audience: CREATOR_TRACK_RECORD.audience[name] }] : [];
    }),
    rating: Number(CREATOR.rating),
    completedShops: CREATOR.completedShops,
    examplePosts: CREATOR_TRACK_RECORD.examplePosts.map((post) => ({ ...post })),
    coverId: profile.coverId,
    coverImage: profile.coverImage,
  };
}
